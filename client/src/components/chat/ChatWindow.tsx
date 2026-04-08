import { useRef, useEffect } from "react";
import type { Message } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { StreamingText } from "./StreamingText";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatWindowProps {
  messages: Message[];
  streamingTokens: string;
  isStreaming: boolean;
}

/** Chat message window with auto-scroll and streaming text support */
export function ChatWindow({ messages, streamingTokens, isStreaming }: ChatWindowProps): React.ReactElement {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingTokens]);

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="max-w-3xl mx-auto py-4">
        {messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-2xl font-semibold mb-2">Start a conversation</p>
            <p className="text-muted-foreground text-sm">
              Type a message below to begin chatting with AI
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} />
        ))}
        {isStreaming && <StreamingText tokens={streamingTokens} />}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
