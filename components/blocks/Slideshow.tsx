'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';
import Link from 'next/link';

import type {SlideshowBlock} from '@types/blocks';
import type {Locale} from '@i18n/config';

function resolveSlideHref({
  href,
  locale,
  tenantPath
}: {
  href?: string;
  locale: Locale;
  tenantPath?: string;
}) {
  if (!href) {
    return null;
  }
  const isExternal = /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
  if (isExternal) {
    return {href, external: true};
  }
  const normalized = href.startsWith('/') ? href : `/${href}`;
  return {
    href: `/${locale}${tenantPath ?? ''}${normalized}`,
    external: false
  };
}

export function Slideshow({
  block,
  locale,
  tenantPath
}: {
  block: SlideshowBlock;
  locale: Locale;
  tenantPath?: string;
}) {
  const slides = block.slides;
  const [activeIndex, setActiveIndex] = useState(0);

  const interval = block.options?.interval ?? 6000;
  const autoplay = block.options?.autoplay ?? false;
  const loop = block.options?.loop ?? true;

  const total = slides.length;

  const goTo = useCallback(
    (nextIndex: number) => {
      if (!total) {
        return;
      }
      if (!loop) {
        setActiveIndex(Math.min(Math.max(nextIndex, 0), total - 1));
        return;
      }
      const wrapped = (nextIndex + total) % total;
      setActiveIndex(wrapped);
    },
    [loop, total]
  );

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (!autoplay || total <= 1) {
      return;
    }
    const timer = setInterval(() => {
      goNext();
    }, interval);
    return () => clearInterval(timer);
  }, [autoplay, goNext, interval, total]);

  const dots = useMemo(() => new Array(total).fill(null).map((_, index) => index), [total]);

  if (!total) {
    return null;
  }

  const currentSlide = slides[activeIndex];

  return (
    <section className="relative isolate overflow-hidden bg-secondary text-white">
      <div className="absolute inset-0 opacity-30">
        <img
          src={currentSlide.image.url}
          alt=""
          className="h-full w-full object-cover"
          aria-hidden
        />
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
        {(block.title || block.description) && (
          <header className="max-w-2xl">
            {block.title ? <h2 className="text-3xl font-semibold">{block.title}</h2> : null}
            {block.description ? <p className="mt-3 text-base text-white/80">{block.description}</p> : null}
          </header>
        )}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-secondary bg-opacity-60 shadow-xl">
          {(() => {
            const resolved = resolveSlideHref({
              href: currentSlide.href,
              locale,
              tenantPath
            });
            if (!resolved) {
              return <SlideContent slide={currentSlide} interactive={false} />;
            }
            if (resolved.external) {
              return (
                <a
                  href={resolved.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <SlideContent slide={currentSlide} interactive />
                </a>
              );
            }
            return (
              <Link href={resolved.href} className="group block">
                <SlideContent slide={currentSlide} interactive />
              </Link>
            );
          })()}
          {total > 1 ? (
            <>
              <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3">
                {dots.map((index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goTo(index)}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      index === activeIndex ? 'bg-white' : 'bg-white/40'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                <button
                  type="button"
                  onClick={goPrev}
                  className="pointer-events-auto ml-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
                  aria-label="Previous slide"
                >
                  ‹
                </button>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                <button
                  type="button"
                  onClick={goNext}
                  className="pointer-events-auto mr-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
                  aria-label="Next slide"
                >
                  ›
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function SlideContent({
  slide,
  interactive = false
}: {
  slide: SlideshowBlock['slides'][number];
  interactive?: boolean;
}) {
  return (
    <div className="relative flex h-[420px] flex-col justify-end">
      <div className="absolute inset-0">
        {interactive ? <span aria-hidden className="absolute inset-0 z-10" /> : null}
        <div className="absolute inset-0">
          <div className="h-full w-full opacity-80">
            <img
              src={slide.image.url}
              alt={slide.image.alt ?? slide.title ?? ''}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
      </div>
      <div className="relative z-20 p-8">
        {slide.title ? <h3 className="text-2xl font-semibold">{slide.title}</h3> : null}
        {slide.caption ? <p className="mt-2 max-w-2xl text-base text-white/80">{slide.caption}</p> : null}
      </div>
    </div>
  );
}
