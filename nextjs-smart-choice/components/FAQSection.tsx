import { ChevronDown } from "lucide-react";

interface FAQProps {
    faqs: any[];
}

export default function FAQSection({ faqs }: FAQProps) {
    return (
        <section className="section bg-white">
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="section-header">
                    <h2 className="section-title">Frequently Asked Questions</h2>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    {faqs && faqs.length > 0 ? (
                        faqs.map((faq: any, idx: number) => (
                            <details key={faq._id || idx} className="group border-b border-gray-100 last:border-0 pb-4 mb-4 last:mb-0 last:pb-0">
                                <summary className="flex justify-between items-center font-bold cursor-pointer list-none py-2 text-gray-900 hover:text-blue-600 transition-colors">
                                    <span>{faq.question}</span>
                                    <span className="transition-transform group-open:rotate-180">
                                        <ChevronDown size={20} className="text-gray-400" />
                                    </span>
                                </summary>
                                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                                    {faq.answer}
                                </p>
                            </details>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">
                            No questions yet.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
