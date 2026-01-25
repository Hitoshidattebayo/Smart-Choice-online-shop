import { createClient } from 'next-sanity'
import dotenv from 'dotenv'

// Load environment variables from .env
dotenv.config()

const client = createClient({
    projectId: 'eiivfy8o',
    dataset: 'production',
    apiVersion: '2023-05-03',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
})

const faqs = [
    {
        question: "I always sleep through alarm clocks. Will this wake me up?",
        answer: "Yes! The Smart Choice alarm uses a combination of sound and vibration designed to wake even the heaviest sleepers. Reviewers specifically mention its effectiveness for deep sleepers."
    },
    {
        question: "What is the difference between the standard and the Pro version?",
        answer: "The Pro version includes advanced sleep tracking, a vibrating wristband, and customizable alarm tones. The Standard version focuses on the core alarm functionality with standard sound options."
    },
    {
        question: "Isn't this just like any smartwatch?",
        answer: "While smartwatches have alarms, ours is a dedicated waking device with a much stronger vibration motor and specialized loud alarm frequencies that smartwatches typically don't offer."
    },
    {
        question: "How long does the battery last?",
        answer: "The battery lasts up to 14 days on a single charge with daily use. It recharges fully in just 2 hours via USB-C."
    },
    {
        question: "Do you ship to my country?",
        answer: "Yes, we ship worldwide! Shipping times vary by location, typically 5-10 business days for international orders."
    }
]

async function seed() {
    console.log('Starting FAQ seed...')

    // Check for token
    if (!process.env.SANITY_API_TOKEN) {
        // Try to read from .env.local if not in .env logic above (dotenv handles .env)
        console.warn('Warning: SANITY_API_TOKEN not found in environment. Write operations may fail if the dataset is private or for non-public data types.')
    }

    try {
        // Delete existing FAQs to avoid duplicates (optional, but good for idempotent seed)
        // await client.delete({query: '*[_type == "faq"]'})

        for (const faq of faqs) {
            await client.create({
                _type: 'faq',
                ...faq
            })
            console.log(`Created FAQ: ${faq.question}`)
        }
        console.log('FAQ seed complete!')
    } catch (err: any) {
        console.error('Failed to seed FAQs:', err.message)
    }
}

seed()
