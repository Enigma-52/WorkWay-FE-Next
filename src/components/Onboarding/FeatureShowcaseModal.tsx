"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, ArrowRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ONBOARDING_FEATURES } from "@/data/onboardingFeatures";

const SLIDE_DURATION_MS = 10_000;

type FeatureShowcaseModalProps = {
  open: boolean;
  onClose: () => void;
  /** Index to start on, e.g. jump straight to the Pro feature after checkout. */
  startIndex?: number;
  title?: string;
  subtitle?: string;
};

export default function FeatureShowcaseModal({
  open,
  onClose,
  startIndex = 0,
  title = "Welcome to WorkWay",
  subtitle = "Here's everything you can do.",
}: FeatureShowcaseModalProps) {
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (open) setActiveIndex(startIndex);
  }, [open, startIndex]);

  // Auto-advance every SLIDE_DURATION_MS, driven by rAF so the progress bar
  // animates smoothly rather than just jumping every 10s.
  useEffect(() => {
    if (!open) return;

    startRef.current = performance.now();
    setProgress(0);

    function tick(now: number) {
      const elapsed = now - startRef.current;
      const pct = Math.min(1, elapsed / SLIDE_DURATION_MS);
      setProgress(pct);
      if (pct >= 1) {
        setActiveIndex((i) => (i + 1) % ONBOARDING_FEATURES.length);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [open, activeIndex]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const active = ONBOARDING_FEATURES[activeIndex];
  const Icon = active.icon;

  function selectFeature(index: number) {
    setActiveIndex(index);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 sm:p-8">
      <div className="relative flex h-full max-h-[720px] w-full max-w-6xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left 20% — selectable feature list */}
        <div className="hidden w-[240px] shrink-0 flex-col border-r border-border bg-background/40 p-4 sm:flex">
          <div className="mb-4 px-2">
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto">
            {ONBOARDING_FEATURES.map((feature, index) => {
              const FeatureIcon = feature.icon;
              const isActive = index === activeIndex;
              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => selectFeature(index)}
                  className={`relative flex w-full items-center gap-2.5 overflow-hidden rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <span
                      className="absolute inset-y-0 left-0 bg-primary/10"
                      style={{ width: `${progress * 100}%` }}
                      aria-hidden="true"
                    />
                  )}
                  <FeatureIcon className="relative h-4 w-4 shrink-0" />
                  <span className="relative truncate">{feature.title}</span>
                  {feature.pro && (
                    <Crown className="relative ml-auto h-3 w-3 shrink-0 text-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 80% — active feature content */}
        <div className="flex flex-1 flex-col justify-between p-8 sm:p-12">
          <div>
            {/* Mobile-only feature dots since the left list is hidden */}
            <div className="mb-8 flex gap-1.5 sm:hidden">
              {ONBOARDING_FEATURES.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => selectFeature(i)}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i === activeIndex ? "bg-primary" : "bg-secondary"
                  }`}
                  aria-label={f.title}
                />
              ))}
            </div>

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Icon className="h-7 w-7 text-primary" />
            </div>

            {active.pro && (
              <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                <Crown className="h-3 w-3" />
                Pro
              </span>
            )}

            <h2 className="mb-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {active.title}
            </h2>
            <p className="mb-4 text-lg text-primary">{active.tagline}</p>
            <p className="mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {active.description}
            </p>

            <ul className="space-y-2.5">
              {active.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <div className="hidden gap-1.5 sm:flex">
              {ONBOARDING_FEATURES.map((f, i) => (
                <span
                  key={f.id}
                  className={`h-1 w-6 rounded-full transition-colors ${
                    i === activeIndex ? "bg-primary" : "bg-secondary"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2 ml-auto">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Skip
              </Button>
              <Button size="sm" asChild onClick={onClose}>
                <Link href={active.pro ? "/dashboard/seeker/companies" : "/jobs"}>
                  Get started
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
