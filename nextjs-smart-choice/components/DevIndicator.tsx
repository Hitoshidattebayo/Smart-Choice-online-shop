import { Zap } from "lucide-react";

export function DevIndicator() {
    if (process.env.NODE_ENV !== "development") return null;

    return (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-black/80 px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-sm border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </div>
            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="font-semibold tracking-wide">
                TURBOPACK <span className="text-white/60 font-normal">Active</span>
            </span>
        </div>
    );
}
