import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { MessageSquare, Zap, Shield, ArrowRight, Link2 } from "lucide-react";

export function Home(): React.ReactElement {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground mb-8">
          <Zap className="h-4 w-4" />
          Powered by AI
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
          Your Intelligent
          <span className="block text-primary">AI Platform</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl">
          Chat with AI in real-time and shorten URLs with smart slugs — all in one place.
        </p>
        <div className="mt-10 flex gap-4">
          {isAuthenticated ? (
            <Button size="lg" nativeButton={false} render={<Link to="/dashboard" />}>
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button size="lg" nativeButton={false} render={<Link to="/register" />}>
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" nativeButton={false} render={<Link to="/login" />}>
                Sign In
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="border-t py-20 px-4">
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center p-6">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI Chatbot</h3>
            <p className="text-muted-foreground text-sm">
              Chat with DeepSeek AI in real-time with streaming responses and full conversation history.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Link2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">URL Shortener</h3>
            <p className="text-muted-foreground text-sm">
              Shorten any URL instantly with a custom slug, or let AI generate a meaningful one for you.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure by Default</h3>
            <p className="text-muted-foreground text-sm">
              JWT authentication with HTTP-only cookies, rate limiting, and encrypted passwords.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
