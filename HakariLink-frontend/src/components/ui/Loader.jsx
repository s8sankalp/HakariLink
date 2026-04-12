import React from "react";
import { Loader2 } from "lucide-react";

export default function Loader({ message = "Loading...", emoji = "⏳", fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500 p-8">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <div className="flex items-center gap-2 text-muted-foreground font-medium">
        <span>{message}</span>
        <span className="text-xl">{emoji}</span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
