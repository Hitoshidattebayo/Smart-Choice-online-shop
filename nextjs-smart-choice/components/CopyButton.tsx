'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    text: string;
    className?: string;
    showLabel?: boolean;
    label?: string;
}

export default function CopyButton({ text, className = "", showLabel = false, label = "ХУУЛАХ" }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`flex items-center gap-2 transition-colors ${className}`}
            title="Хуулах"
        >
            {copied ? (
                <Check size={16} className="text-green-500" />
            ) : (
                <Copy size={16} />
            )}
            {showLabel && (
                <span className={copied ? "text-green-600" : ""}>
                    {copied ? "Хуулагдлаа" : label}
                </span>
            )}
        </button>
    );
}
