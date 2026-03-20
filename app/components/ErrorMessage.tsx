interface ErrorMessageProps {
    message: string;
    onDismiss?: () => void;
}

export default function ErrorMessage({
    message,
    onDismiss,
}: ErrorMessageProps) {
    return (
        <div className="fixed top-4 right-4 z-50 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg shadow-xl backdrop-blur-sm max-w-md">
            <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div className="flex-1">
                    <p className="font-medium">{message}</p>
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-red-400 hover:text-red-300 transition-colors"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}
