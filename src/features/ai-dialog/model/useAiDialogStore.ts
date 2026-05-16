import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { Message } from './types'

export interface IAiDialog {
	messages: Message[]
	setMessage: (message: Message) => void
}

const initialState = {
	messages: [],
} as const

export const useAiDialogStore = create<IAiDialog>()(
	persist(
		devtools(
			set => ({
				...initialState,

				setMessage: message =>
					set(
						state => ({ messages: [...state.messages, message] }),
						false,
						'setMessage',
					),
			}),
			{ name: 'ai-dialog-store' },
		),
		{
			name: 'dialog-storage',
			storage: createJSONStorage(() => localStorage),
		},
	),
)
