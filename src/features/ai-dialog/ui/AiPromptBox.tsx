'use client'

import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { ArrowUp } from 'lucide-react'
import { FC, useState } from 'react'
import { getAIResponse } from '../lib/getAIResponse'
import { useAiDialogStore } from '../model/useAiDialogStore'

interface IAiPromptBox {
	setIsLoadingOpenAi: (isLoading: boolean) => void
	onSendPrompt: () => void
}

export const AiPromptBox: FC<IAiPromptBox> = ({
	setIsLoadingOpenAi,
	onSendPrompt,
}) => {
	const [prompt, setPrompt] = useState('')
	const [loading, setLoading] = useState(false)
	const setMessage = useAiDialogStore(state => state.setMessage)

	const handleSubmit = async () => {
		if (!prompt.trim()) return

		onSendPrompt()

		setLoading(true)
		setIsLoadingOpenAi(true)

		setMessage({ text: prompt, isMyMessage: true })

		try {
			const responseText = await getAIResponse(prompt)

			if (responseText !== null) {
				setMessage({ text: responseText, isMyMessage: false })
			}

			setPrompt('')
		} finally {
			setLoading(false)
			setIsLoadingOpenAi(false)
		}
	}

	return (
		<div className='w-full max-w-2xl rounded-2xl border bg-background p-3 shadow-sm'>
			<Textarea
				value={prompt}
				onChange={e => setPrompt(e.target.value)}
				placeholder='Введите промпт для виртуального помошника'
				className='min-h-14 resize-none border-0 p-2 shadow-none focus-visible:ring-0'
			/>

			<div className='mt-2 flex items-center justify-end'>
				<Button
					onClick={handleSubmit}
					disabled={!prompt.trim() || loading}
					className='rounded-full'
				>
					<ArrowUp className='h-4 w-4' />
				</Button>
			</div>
		</div>
	)
}
