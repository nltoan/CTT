'use client';

import {useEffect, useMemo, useState} from 'react';
import type React from 'react';

import type {HeroCountdownBlock} from '@types/blocks';

function formatRemainingTime(deadline: string | undefined) {
  if (!deadline) {
    return null;
  }
  const deadlineDate = new Date(deadline);
  if (Number.isNaN(deadlineDate.getTime())) {
    return null;
  }
  const now = new Date();
  const diff = deadlineDate.getTime() - now.getTime();
  if (diff <= 0) {
    return '00:00:00:00';
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return [days, hours, minutes, seconds]
    .map((value) => value.toString().padStart(2, '0'))
    .join(' : ');
}

export function HeroCountdown({
  block
}: {
  block: HeroCountdownBlock;
}) {
  const [countdown, setCountdown] = useState(() => formatRemainingTime(block.deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(formatRemainingTime(block.deadline));
    }, 1000);

    return () => clearInterval(interval);
  }, [block.deadline]);

  const backgroundStyle = useMemo(() => {
    if (!block.background) {
      return undefined;
    }
    return {
      backgroundImage: `url(${block.background.url})`
    } as React.CSSProperties;
  }, [block.background]);

  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-secondary px-6 py-16 text-white shadow-xl"
      style={backgroundStyle}
    >
      {block.overlay && <div className="absolute inset-0 bg-black/70" aria-hidden="true" />}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-start gap-6">
        {(block.subheading || block.countdownLabel) && (
          <div>
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm tracking-wide uppercase">
              {block.subheading ?? block.countdownLabel}
            </span>
          </div>
        )}
        <h1 className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
          {block.heading}
        </h1>
        {block.description && <p className="max-w-2xl text-lg text-white/80">{block.description}</p>}
        {countdown && (
          <div className="flex flex-wrap items-center gap-4 text-xl font-semibold">
            <span className="rounded-full bg-black/40 px-4 py-2 font-mono tracking-[0.2em]">
              {countdown}
            </span>
            {block.countdownLabel && <span>{block.countdownLabel}</span>}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4">
          {block.primaryCta && (
            <a
              href={block.primaryCta.href}
              className="rounded-full bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:opacity-90"
              target={block.primaryCta.external ? '_blank' : undefined}
              rel={block.primaryCta.external ? 'noopener noreferrer' : undefined}
            >
              {block.primaryCta.label}
            </a>
          )}
          {block.secondaryCta && (
            <a
              href={block.secondaryCta.href}
              className="rounded-full border border-white/60 px-6 py-3 text-base font-semibold text-white transition hover:border-white"
              target={block.secondaryCta.external ? '_blank' : undefined}
              rel={block.secondaryCta.external ? 'noopener noreferrer' : undefined}
            >
              {block.secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
