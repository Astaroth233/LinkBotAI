import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useCreateChat } from "@/hooks/useChat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Link2, ArrowRight, Loader2 } from "lucide-react";

export function Dashboard(): React.ReactElement {
  const user = useAuthStore((s) => s.user);
  const createChat = useCreateChat();
  const navigate = useNavigate();

  async function handleChatbot(): Promise<void> {
    const res = await createChat.mutateAsync({});
    if (res.success && res.data) {
      navigate(`/chat/${res.data.chat._id}`);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!</h1>
        <p className="text-muted-foreground mt-2">What would you like to do today?</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 w-full max-w-2xl">
        {/* AI Chatbot */}
        <Card
          className="cursor-pointer transition-all hover:bg-muted/50 hover:shadow-md group"
          onClick={handleChatbot}
        >
          <CardHeader className="pb-3">
            <div className="rounded-full bg-primary/10 p-3 w-fit mb-2">
              {createChat.isPending ? (
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              ) : (
                <MessageSquare className="h-6 w-6 text-primary" />
              )}
            </div>
            <CardTitle className="flex items-center justify-between">
              AI Chatbot
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardTitle>
            <CardDescription>
              Chat with DeepSeek AI in real-time with streaming responses and conversation history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">DeepSeek Chat · DeepSeek Reasoner</p>
          </CardContent>
        </Card>

        {/* URL Shortener */}
        <Card
          className="cursor-pointer transition-all hover:bg-muted/50 hover:shadow-md group"
          onClick={() => navigate("/urls")}
        >
          <CardHeader className="pb-3">
            <div className="rounded-full bg-primary/10 p-3 w-fit mb-2">
              <Link2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="flex items-center justify-between">
              URL Shortener
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardTitle>
            <CardDescription>
              Shorten any URL with a custom slug or let AI generate a memorable one for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Custom slugs · AI-generated slugs · Click tracking</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
