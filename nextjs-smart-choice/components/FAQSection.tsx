'use client';

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQProps {
    faqs: any[];
}

export default function FAQSection({ faqs }: FAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (idx: number) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <section className="section bg-[var(--color-primary-bg)]">
            <div className="container mx-auto px-4" style={{ maxWidth: '800px' }}>
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-3xl md:text-5xl font-black text-[var(--color-dark-bg)] mb-4">ТҮГЭЭМЭЛ АСУУЛТ ХАРИУЛТ</h2>
                    <div className="w-24 h-1 bg-[var(--color-accent-gold)] mx-auto rounded-full"></div>
                </div>
                
                <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                    {faqs && faqs.length > 0 ? (
                        faqs.map((faq: any, idx: number) => {
                            const isOpen = openIndex === idx;
                            return (
                                <div key={faq._id || idx} className={`border-b border-gray-100 last:border-0 overflow-hidden transition-all duration-300 ${isOpen ? 'bg-gray-50/50 -mx-6 px-6 md:-mx-10 md:px-10' : ''}`}>
                                    <button 
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full flex justify-between items-center py-6 text-left group transition-colors"
                                    >
                                        <span className={`font-bold transition-colors ${isOpen ? 'text-[var(--color-accent-gold)]' : 'text-[var(--color-dark-bg)] group-hover:text-[var(--color-accent-gold)]'}`}>
                                            {faq.question}
                                        </span>
                                        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--color-accent-gold)]' : 'text-gray-400'}`}>
                                            <ChevronDown size={20} />
                                        </span>
                                    </button>
                                    <div 
                                        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'}`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="text-gray-600 leading-relaxed max-w-3xl border-l-2 border-[var(--color-accent-gold)] pl-4">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500 py-8">
                            Асуулт байхгүй байна.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
