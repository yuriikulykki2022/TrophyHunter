"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    isStreaming?: boolean;
}

interface AIChatSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    pendingRequest: {
        gameName: string;
        achievementName: string;
        achievementDescription: string;
    } | null;
    onRequestHandled: () => void;
}

export default function AIChatSidebar({
    isOpen,
    onClose,
    pendingRequest,
    onRequestHandled,
}: AIChatSidebarProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (pendingRequest && !isLoading) {
            const request = pendingRequest;
            onRequestHandled(); // Очищаємо одразу
            handleNewRequest(request);
        }
    }, [pendingRequest, isLoading]);

    const handleNewRequest = async (request: {
        gameName: string;
        achievementName: string;
        achievementDescription: string;
    }) => {
        const userMessageId = Date.now().toString();
        const assistantMessageId = (Date.now() + 1).toString();

        // Додаємо повідомлення користувача
        const userMessage: ChatMessage = {
            id: userMessageId,
            role: "user",
            content: `Як отримати досягнення "${request.achievementName}" у грі ${request.gameName}?`,
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        // Додаємо placeholder для відповіді AI
        const assistantMessage: ChatMessage = {
            id: assistantMessageId,
            role: "assistant",
            content: "",
            isStreaming: true,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Timeout controller
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), 10000);

        try {
            const response = await fetch("/api/ai/hint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    gameName: request.gameName,
                    achievementName: request.achievementName,
                    achievementDescription: request.achievementDescription,
                }),
                signal: abortController.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.error || `Помилка сервера: ${response.status}`,
                );
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error("Не вдалося прочитати відповідь");
            }

            let text = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                text += decoder.decode(value, { stream: true });
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMessageId
                            ? { ...msg, content: text }
                            : msg,
                    ),
                );
            }

            // Завершуємо streaming
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === assistantMessageId
                        ? { ...msg, isStreaming: false }
                        : msg,
                ),
            );
        } catch (error: any) {
            clearTimeout(timeoutId);
            console.error("AI Chat Error:", error);

            let errorMessage = "AI недоступний. Спробуйте пізніше.";

            if (error.name === "AbortError") {
                errorMessage =
                    "AI недоступний. Перевищено час очікування (10 сек).";
            } else if (error.message) {
                errorMessage = `AI недоступний: ${error.message}`;
            }

            console.log("Setting error message:", errorMessage);
            console.log("Assistant message ID:", assistantMessageId);

            // Оновлюємо повідомлення з помилкою
            setMessages((prev) => {
                console.log("Current messages before error:", prev.length);
                const updated = prev.map((msg) => {
                    if (msg.id === assistantMessageId) {
                        console.log("Found message to update with error");
                        return {
                            ...msg,
                            content: errorMessage,
                            isStreaming: false,
                        };
                    }
                    return msg;
                });
                console.log("Updated messages after error:", updated.length);
                return updated;
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <aside className="w-full sm:w-96 lg:w-[28rem] bg-slate-800 border-l border-slate-700 flex flex-col h-screen fixed sm:relative right-0 top-0 z-50">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <h2 className="font-bold text-lg">AI Помічник</h2>
                </div>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10">
                        <p className="text-4xl mb-4">💬</p>
                        <p className="text-sm">
                            Натисніть "AI підказка" на будь-якому прихованому
                            досягненні, щоб отримати допомогу
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                                    message.role === "user"
                                        ? "bg-blue-600 text-white rounded-br-md"
                                        : "bg-slate-700 text-slate-200 rounded-bl-md"
                                }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">
                                    {message.content ||
                                        (message.isStreaming
                                            ? ""
                                            : "Не вдалося згенерувати підказку. Спробуйте пізніше.")}
                                    {message.isStreaming && message.content && (
                                        <span className="inline-block w-2 h-4 bg-purple-400 ml-1 animate-pulse" />
                                    )}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700 bg-slate-900/30">
                <p className="text-xs text-slate-500 text-center">
                    Підказки генеруються AI та можуть бути неточними
                </p>
            </div>
        </aside>
        </>
    );
}
