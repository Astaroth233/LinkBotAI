import { useState } from "react";
import { useUrls, useCreateUrl, useDeleteUrl } from "@/hooks/useUrl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Trash2, Copy, Check, Sparkles, Link2, ExternalLink, Zap } from "lucide-react";

const DISPLAY_BASE = "linkbotai.com";
const REDIRECT_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function UrlShortener(): React.ReactElement {
  const { data: urls, isLoading } = useUrls();
  const createUrl = useCreateUrl();
  const deleteUrl = useDeleteUrl();

  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [useAi, setUseAi] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError("");
    try {
      await createUrl.mutateAsync({
        originalUrl,
        useAi,
        customCode: customCode.trim() || undefined,
      });
      setOriginalUrl("");
      setCustomCode("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Failed to shorten URL. Please try again.");
    }
  }

  function copyToClipboard(shortCode: string, id: string): void {
    navigator.clipboard.writeText(`${REDIRECT_BASE}/r/${shortCode}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">URL Shortener</h1>
        <p className="text-muted-foreground mt-1">Shorten URLs instantly, or let AI generate a meaningful slug</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Shorten a URL</CardTitle>
          <CardDescription>Paste a URL, then customize the slug or let us generate one</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="url">Long URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/very/long/url/that/needs/shortening"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
              />
            </div>

            {/* Inline slug preview */}
            <div className="space-y-2">
              <Label htmlFor="custom">Your short link</Label>
              <div className="flex items-center rounded-lg border bg-muted/40 overflow-hidden focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring">
                <span className="px-3 py-2 text-sm text-muted-foreground border-r bg-muted select-none whitespace-nowrap">
                  {DISPLAY_BASE}/r/
                </span>
                <Input
                  id="custom"
                  placeholder={useAi ? "AI will generate this..." : "my-custom-slug"}
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.replace(/\s+/g, "-").toLowerCase())}
                  disabled={useAi}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:border-0 rounded-none"
                />
              </div>
              {customCode && (
                <p className="text-xs text-muted-foreground">
                  Preview: <span className="text-primary font-mono">{DISPLAY_BASE}/r/{customCode}</span>
                </p>
              )}
            </div>

            {/* Mode toggle */}
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant={!useAi ? "default" : "outline"}
                size="sm"
                onClick={() => setUseAi(false)}
                className="flex-1"
              >
                <Zap className="mr-2 h-4 w-4" />
                Quick (Random)
              </Button>
              <Button
                type="button"
                variant={useAi ? "default" : "outline"}
                size="sm"
                onClick={() => { setUseAi(true); setCustomCode(""); }}
                className="flex-1"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Smart (AI Slug)
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={createUrl.isPending}>
              {createUrl.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{useAi ? "Generating AI slug..." : "Shortening..."}</>
              ) : (
                <><Link2 className="mr-2 h-4 w-4" />Shorten URL</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* URL List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !urls || urls.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Link2 className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-medium">No shortened URLs yet</p>
            <p className="text-sm text-muted-foreground">Paste a URL above to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {urls.map((url) => (
            <Card key={url._id}>
              <CardContent className="py-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium text-primary">
                      {DISPLAY_BASE}/r/{url.shortCode}
                    </span>
                    {url.aiGenerated && (
                      <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        <Sparkles className="h-3 w-3" />
                        AI
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{url.originalUrl}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{url.clicks} clicks &middot; {new Date(url.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => window.open(url.originalUrl, "_blank")}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(url.shortCode, url._id)}>
                    {copiedId === url._id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteUrl.mutate(url._id)} disabled={deleteUrl.isPending}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
