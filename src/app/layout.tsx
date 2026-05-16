import { AiDialogButton } from '@/features/ai-dialog'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Link, Outlet, useLocation } from 'react-router-dom'

const links = [
	{ to: '/', label: 'Home' },
	{ to: '/sandbox', label: 'Sandbox' },
]

export function AppLayout() {
	const location = useLocation()

	return (
		<div className='min-h-screen bg-white text-black'>
			<div className='mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6'>
				<header className='mb-8 rounded-xl border border-black/10 bg-white'>
					<div className='flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between'>
						<div>
							<p className='text-sm'>Мои финансы</p>
							<h1 className='text-2xl font-semibold'>
								Простая работа с деньгами
							</h1>
						</div>
						<nav className='flex gap-2'>
							{links.map(link => {
								const active = location.pathname === link.to

								return (
									<Button
										key={link.to}
										asChild
										variant={active ? 'default' : 'outline'}
									>
										<Link to={link.to}>{link.label}</Link>
									</Button>
								)
							})}
						</nav>
					</div>
					<Separator />
					<div className='px-4 py-3 text-sm'>
						Fast base for AI-heavy hackathon delivery.
					</div>
				</header>
				<main className='flex-1'>
					<Outlet />
				</main>

				<AiDialogButton />
			</div>
		</div>
	)
}
