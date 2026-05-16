import { Button } from '@/shared/ui/button'
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/shared/ui/item'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/shared/ui/sheet'
import { Spinner } from '@/shared/ui/spinner'
import clsx from 'clsx'
import { BrainIcon, MessageCircleIcon, UserIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { useAiDialogStore } from '../model/useAiDialogStore'
import styles from './AiDialogButton.module.css'
import { AiPromptBox } from './AiPromptBox'

export function AiDialogButton() {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const messages = useAiDialogStore(state => state.messages)
	const listRef = useRef<HTMLDivElement>(null)

	const handleScroll = () => {
		setTimeout(() => {
			console.log(listRef.current)
			listRef.current?.scrollTo({
				top: listRef.current?.scrollHeight,
				behavior: 'smooth',
			})
		}, 100)
	}

	return (
		<>
			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant='outline'
						size='default'
						className={styles.buttonIcon}
						onClick={handleScroll}
					>
						<MessageCircleIcon className={styles.icon} />
					</Button>
				</SheetTrigger>
				<SheetContent>
					<SheetHeader className={styles.header}>
						<SheetTitle className={styles.title}>Ai Chat Bot</SheetTitle>
						<SheetDescription className={styles.description}>
							Ваш виртуальный хелпер на все случаи жизни
						</SheetDescription>
					</SheetHeader>

					<div className={styles.list} ref={listRef}>
						{messages.map(el => (
							<Item
								variant='muted'
								key={window.crypto.randomUUID()}
								className={clsx(
									styles.message,
									el.isMyMessage ? styles.rightMessage : styles.leftMessage,
								)}
							>
								{!el.isMyMessage && (
									<ItemMedia>
										<BrainIcon className={styles.icon} />
									</ItemMedia>
								)}

								<ItemContent>
									<ItemTitle className='line-clamp-1'>{el.text}</ItemTitle>
								</ItemContent>

								{el.isMyMessage && (
									<ItemMedia>
										<UserIcon className={styles.icon} />
									</ItemMedia>
								)}
							</Item>
						))}

						{isLoading && (
							<Item
								variant='muted'
								className={clsx(styles.message, styles.leftMessage)}
							>
								<ItemMedia>
									<Spinner />
								</ItemMedia>
								<ItemContent>
									<ItemTitle className='line-clamp-1'>
										Запрос выполняется...
									</ItemTitle>
								</ItemContent>
							</Item>
						)}
					</div>

					<SheetFooter>
						<AiPromptBox
							setIsLoadingOpenAi={setIsLoading}
							onSendPrompt={handleScroll}
						/>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</>
	)
}
