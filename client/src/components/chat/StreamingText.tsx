interface StreamingTextProps {
  tokens: string;
}

/** Renders streaming text with a blinking cursor animation */
export function StreamingText({ tokens }: StreamingTextProps): React.ReactElement {
  return (
    <div className="flex gap-3 py-4 justify-start">
      <div className="flex-shrink-0 mt-1">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
      <div className="rounded-2xl px-4 py-2.5 max-w-[75%] bg-muted text-foreground text-sm leading-relaxed">
        <p className="whitespace-pre-wrap">
          {tokens}
          <span className="inline-block w-2 h-4 bg-primary/70 ml-0.5 animate-[blink_1s_step-end_infinite]" />
        </p>
      </div>
    </div>
  );
}
