"use client";
import { MessageCircle } from "lucide-react";

export default function FeedbackButton() {
  return (
    <a
      href="https://workway.featurebase.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 hover:shadow-[0_0_20px_hsl(82_100%_55%/0.3)]"
      aria-label="Send feedback"
    >
      <MessageCircle className="h-5 w-5" />
    </a>
  );
}
