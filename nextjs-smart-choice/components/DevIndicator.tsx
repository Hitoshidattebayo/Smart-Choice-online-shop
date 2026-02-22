'use client';

import { Zap, X, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface CapturedError {
    id: number;
    message: string;
    source?: string;
    stack?: string;
    time: string;
}

export function DevIndicator() {
    const [errors, setErrors] = useState<CapturedError[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [idCounter, setIdCounter] = useState(0);

    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            const err: CapturedError = {
                id: Date.now(),
                message: event.message || 'Unknown error',
                source: event.filename ? `${event.filename}:${event.lineno}:${event.colno}` : undefined,
                stack: event.error?.stack,
                time: new Date().toLocaleTimeString(),
            };
            setErrors(prev => [err, ...prev].slice(0, 20)); // Keep last 20 errors
            setIsExpanded(true); // Auto-expand on new error
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const err: CapturedError = {
                id: Date.now(),
                message: event.reason?.message || String(event.reason) || 'Unhandled Promise Rejection',
                stack: event.reason?.stack,
                time: new Date().toLocaleTimeString(),
            };
            setErrors(prev => [err, ...prev].slice(0, 20));
            setIsExpanded(true);
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);

    if (process.env.NODE_ENV !== "development") return null;

    const clearErrors = () => {
        setErrors([]);
        setIsExpanded(false);
    };

    return (
        <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2 max-w-[min(420px,calc(100vw-2rem))]">
            {/* Error Panel */}
            {errors.length > 0 && isExpanded && (
                <div className="bg-[#1a0a0a] border border-red-500/40 rounded-xl shadow-2xl overflow-hidden text-xs">
                    {/* Error Panel Header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-red-950/50 border-b border-red-500/30">
                        <div className="flex items-center gap-2 text-red-400 font-bold">
                            <AlertTriangle size={13} />
                            <span>{errors.length} Error{errors.length > 1 ? 's' : ''} Caught</span>
                        </div>
                        <button
                            onClick={clearErrors}
                            className="text-red-400/70 hover:text-red-300 transition-colors text-[10px] font-medium uppercase tracking-wide"
                        >
                            Clear All
                        </button>
                    </div>

                    {/* Error List */}
                    <div className="max-h-[320px] overflow-y-auto">
                        {errors.map((err) => (
                            <div key={err.id} className="border-b border-red-500/10 last:border-0 px-3 py-2.5 group">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-red-300 font-medium leading-snug flex-1 break-all">
                                        {err.message}
                                    </p>
                                    <button
                                        onClick={() => setErrors(prev => prev.filter(e => e.id !== err.id))}
                                        className="text-red-500/50 hover:text-red-400 flex-shrink-0 mt-0.5 transition-colors"
                                    >
                                        <X size={11} />
                                    </button>
                                </div>
                                {err.source && (
                                    <p className="text-red-500/60 mt-1 text-[10px] break-all font-mono">{err.source}</p>
                                )}
                                {err.stack && (
                                    <details className="mt-1">
                                        <summary className="text-red-500/50 cursor-pointer text-[10px] hover:text-red-400 transition-colors">Stack Trace</summary>
                                        <pre className="text-red-500/40 text-[9px] mt-1 overflow-x-auto whitespace-pre-wrap break-all font-mono leading-relaxed">
                                            {err.stack}
                                        </pre>
                                    </details>
                                )}
                                <p className="text-red-600/40 text-[10px] mt-1">{err.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Indicator Badge */}
            <div
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-sm border animate-in fade-in slide-in-from-bottom-4 duration-700 cursor-pointer select-none transition-all ${errors.length > 0
                        ? 'bg-red-950/90 border-red-500/40 hover:border-red-400/70'
                        : 'bg-black/80 border-white/10 hover:border-white/20'
                    }`}
                onClick={() => errors.length > 0 && setIsExpanded(p => !p)}
            >
                {errors.length > 0 ? (
                    <>
                        <AlertTriangle size={13} className="text-red-400" />
                        <span className="font-semibold text-red-300">{errors.length} Error{errors.length > 1 ? 's' : ''}</span>
                        {isExpanded ? <ChevronDown size={13} className="text-red-400/70" /> : <ChevronUp size={13} className="text-red-400/70" />}
                    </>
                ) : (
                    <>
                        <div className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                        </div>
                        <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold tracking-wide">
                            TURBOPACK <span className="text-white/60 font-normal">Active</span>
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}
