"use client";
import { X } from "lucide-react";

const WhatWeAreNot = () => {
  const notItems = [
    "Social feeds",
    "Engagement farming",
    '"Career guru" content',
    "Resume roasting",
    "Fake urgency banners",
  ];

  return (
    <section className="py-24 md:py-32 bg-card/30 border-y border-border">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12">
            Things we{" "}
            <span className="text-destructive">refused</span> to build.
          </h2>

          {/* Items */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {notItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-destructive/30 bg-destructive/5 text-foreground/80"
              >
                <X className="w-4 h-4 text-destructive" />
                <span className="font-mono text-sm">{item}</span>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <p className="text-xl text-muted-foreground">
            Just tools that help you get hired.
            <br />
            <span className="text-foreground font-semibold">Or hire faster.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatWeAreNot;
