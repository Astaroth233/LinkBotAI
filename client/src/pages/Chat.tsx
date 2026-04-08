import { useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useChatById, useChats, useCreateChat, useDeleteChat } from "@/hooks/useChat";
import { useStream } from "@/hooks/useStream";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatInput } from "@/components/chat/ChatInput";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  MessageSquare,
  Loader2,
  PanelLeftClose,
  PanelLeft,
  ArrowLeft,
} from "lucide-react";
import type { Message } from "@/types";

/** Full chat page with sidebar, streaming, and model selector */
export function Chat(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: chatData, isLoading: chatLoading } = useChatById(id || "");
  const { data: chats } = useChats();
  const createChat = useCreateChat();
  const deleteChatMutation = useDeleteChat();
  const { tokens, isStreaming, start, stop } = useStream();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [model, setModel] = useState<string>("deepseek/deepseek-chat");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  const messages = chatData?.messages ?? [];
  const allMessages = [...messages, ...localMessages];

  const handleSend = useCallback(
    (content: string): void => {
      if (!id) return;

      // Add user message locally for instant feedback
      const userMsg: Message = {
        _id: `temp-${Date.now()}`,
        chatId: id,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };
      setLocalMessages((prev) => [...prev, userMsg]);

      start(id, content, () => {
        // Refetch only after stream is fully done
        queryClient.invalidateQueries({ queryKey: ["chat", id] });
        setLocalMessages([]);
      });
    },
    [id, start, queryClient]
  );

  async function handleNewChat(): Promise<void> {
    const res = await createChat.mutateAsync({ model: model as "deepseek/deepseek-chat" | "deepseek/deepseek-r1" | "meta-llama/llama-3.3-70b-instruct" | "google/gemini-2.0-flash-001" });
    if (res.success && res.data) {
      navigate(`/chat/${res.data.chat._id}`);
    }
  }

  function handleDeleteChat(chatId: string): void {
    deleteChatMutation.mutate(chatId);
    if (chatId === id) {
      navigate("/dashboard");
    }
  }

  if (chatLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 border-r flex flex-col bg-muted/30">
          <div className="p-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleNewChat} className="flex-1 justify-start">
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
          <Separator />
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {chats?.map((chat) => (
                <div
                  key={chat._id}
                  className={`group flex items-center gap-2 rounded-md px-3 py-2 text-sm cursor-pointer transition-colors ${
                    chat._id === id ? "bg-accent" : "hover:bg-muted"
                  }`}
                >
                  <Link to={`/chat/${chat._id}`} className="flex-1 truncate">
                    <MessageSquare className="inline h-3.5 w-3.5 mr-2" />
                    {chat.title}
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={() => handleDeleteChat(chat._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
          {/* Model selector */}
          <div className="p-3 border-t">
            <Select value={model} onValueChange={(val) => { if (val) setModel(val); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deepseek/deepseek-chat">DeepSeek Chat</SelectItem>
                <SelectItem value="deepseek/deepseek-r1">DeepSeek R1</SelectItem>
                <SelectItem value="meta-llama/llama-3.3-70b-instruct">Llama 3.3 70B</SelectItem>
                <SelectItem value="google/gemini-2.0-flash-001">Gemini 2.0 Flash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="h-12 border-b flex items-center px-4 gap-2">
          {!sidebarOpen && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <PanelLeft className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" nativeButton={false} render={<Link to="/dashboard" />}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-medium text-sm truncate">
            {chatData?.chat?.title || "Chat"}
          </h2>
        </div>

        <ChatWindow
          messages={allMessages}
          streamingTokens={tokens}
          isStreaming={isStreaming}
        />
        <ChatInput onSend={handleSend} onStop={stop} isStreaming={isStreaming} />
      </div>
    </div>
  );
}
