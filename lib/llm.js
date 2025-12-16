// ================================
// lib/llm.js
// ================================
import OpenAI from 'openai'
 
function getClient() {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not set')
    }

    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })
}

export async function classifyRequest(text) {
    const client = getClient()
    const prompt = `Classify the following DPDP-related message into one of:
Grievance, Access, Rectification, Deletion.


Message:\n${text}`


    const res = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0
    })


    return res.choices[0].message.content.trim()
}


export async function draftReply(text, type, language = 'English') {
    const client = getClient()
    const prompt = `Draft a polite, DPDP-compliant reply in ${language} for a ${type} request.


Customer message:\n${text}`


    const res = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2
    })


    return res.choices[0].message.content.trim()
}