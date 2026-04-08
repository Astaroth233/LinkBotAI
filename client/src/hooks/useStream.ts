import { useState, useRef, useCallback } from "react";

interface UseStreamReturn {
  tokens: string;
  isStreaming: boolean;
  start: (chatId: string, content: string, onDone?: () => void) => void;
  stop: () => void;
}

/** Hook for SSE streaming of AI responses */
export function useStream(): UseStreamReturn {
  const [tokens, setTokens] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const stop = useCallback((): void => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const start = useCallback(
    (chatId: string, content: string, onDone?: () => void): void => {
      stop();
      setTokens("");
      setIsStreaming(true);

      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const params = new URLSearchParams({ chatId, content });
      const url = `${baseURL}/ai/stream?${params.toString()}`;

      const eventSource = new EventSource(url, { withCredentials: true });
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event: MessageEvent<string>): void => {
        if (event.data === "[DONE]") {
          stop();
          onDone?.();
          return;
        }

        try {
          const parsed = JSON.parse(event.data) as { content?: string; error?: string };
          if (parsed.error) {
            stop();
            onDone?.();
            return;
          }
          if (parsed.content) {
            setTokens((prev) => prev + parsed.content);
          }
        } catch {
          // Non-JSON data, ignore
        }
      };

      eventSource.onerror = (): void => {
        stop();
        onDone?.();
      };
    },
    [stop]
  );

  return { tokens, isStreaming, start, stop };
}
