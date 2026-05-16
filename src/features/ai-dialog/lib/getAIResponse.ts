import { OpenAI } from 'openai'
import {
	readTransactions,
	type Transaction,
} from '@/entities/transaction/model/transactions'

const openai = new OpenAI({
	apiKey: import.meta.env.VITE_OPENAI_API_KEY,
	dangerouslyAllowBrowser: true,
})

function serializeTransactions(transactions: Transaction[]) {
	return transactions.map(transaction => ({
		id: transaction.id,
		type: transaction.type,
		category: transaction.category,
		date: transaction.date,
		comment: transaction.comment ?? null,
		amount: transaction.amount,
	}))
}

function buildSystemPrompt(transactions: Transaction[]) {
	const serializedTransactions = JSON.stringify(
		serializeTransactions(transactions),
		null,
		2,
	)

	return `
Ты — личный финансовый помощник пользователя. У тебя есть доступ к списку его транзакций.

Каждая транзакция содержит поля:
type — тип операции: income или expense
category — категория операции
date — дата операции в ISO-формате
comment — комментарий пользователя
amount — сумма операции

Твоя задача — внимательно анализировать запрос пользователя и давать точный, полезный и подробный ответ на основе доступных транзакций.
Правила ответа: отвечай только на основе имеющихся данных. Если данных недостаточно — прямо скажи об этом. Учитывай даты, категории, типы операций, комментарии и суммы. Если пользователь просит анализ — показывай расчёты и объясняй выводы. Если пользователь спрашивает про траты или доходы за период — фильтруй транзакции по датам. Если пользователь просит совет — давай практичные рекомендации на основе его финансового поведения. Не выдумывай транзакции, суммы или категории. Отвечай простым и понятным языком. Если запрос неоднозначный — уточни, какой период, категорию или тип операций нужно проанализировать.

Ниже представлен список транзакций пользователя:
${serializedTransactions}
`
}

export const getAIResponse = async (prompt: string) => {
	const transactions = readTransactions()
	const systemPrompt = buildSystemPrompt(transactions)

	const completion = await openai.chat.completions.create({
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: prompt },
		],
		model: 'gpt-4o',
	})

	return completion.choices[0].message.content
}
