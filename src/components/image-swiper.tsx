"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";

interface Slide {
    id: number;
    image: string;
    alt: string;
    href?: string;
}

const DRAG_START = 5;
const DRAG_TO_CHANGE = 40;

/** Moves only when the visitor asks: touch uses native swipe, a mouse can drag or use the arrows. The next image shows at the edge so there is clearly more. */
export function ImageSwiper({ slides, frame = "aspect-video bg-paper lg:aspect-[1200/504]", fit = "object-cover", sizes = "(min-width: 1408px) 1344px, 100vw" }: {
    slides: Slide[];
    frame?: string;
    fit?: string;
    sizes?: string;
}) {
    const track = useRef<HTMLDivElement>(null);
    const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
    const justDragged = useRef(false);
    const [current, setCurrent] = useState(0);
    const many = slides.length > 1;

    const nearest = (el: HTMLDivElement, left: number) => {
        const step = (el.children[1] as HTMLElement).offsetLeft;
        return Math.round(left / step);
    };
    const onScroll = () => {
        const el = track.current;
        if (el && many) setCurrent(Math.min(nearest(el, el.scrollLeft), slides.length - 1));
    };
    const goTo = (index: number) => {
        const slide = track.current?.children[index] as HTMLElement | undefined;
        const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        track.current?.scrollTo({ left: slide?.offsetLeft ?? 0, behavior: smooth ? "smooth" : "auto" });
    };
    const move = (direction: number) => goTo((current + direction + slides.length) % slides.length);

    const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (!many || event.pointerType !== "mouse" || event.button !== 0) return;
        drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
        justDragged.current = false;
    };
    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const state = drag.current;
        if (!state) return;
        const distance = event.clientX - state.x;
        const el = event.currentTarget;
        if (!state.moved) {
            if (Math.abs(distance) < DRAG_START) return;
            state.moved = true;
            el.setPointerCapture(event.pointerId);
            // Snapping would fight the mouse, so it is off until the drag ends.
            el.style.scrollSnapType = "none";
        }
        el.scrollLeft = state.left - distance;
    };
    const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
        const state = drag.current;
        drag.current = null;
        if (!state?.moved) return;
        justDragged.current = true;
        const el = event.currentTarget;
        const distance = event.clientX - state.x;
        const from = nearest(el, state.left);
        const direction = Math.abs(distance) < DRAG_TO_CHANGE ? 0 : distance < 0 ? 1 : -1;
        goTo(Math.min(Math.max(from + direction, 0), slides.length - 1));
        // shortcut: a fixed wait for the glide to finish; use the scrollend event once Safari supports it everywhere.
        setTimeout(() => (el.style.scrollSnapType = ""), 400);
    };

    return (
        <div>
            <div className="relative">
                <div
                    ref={track}
                    onScroll={onScroll}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerEnd}
                    onPointerCancel={onPointerEnd}
                    onDragStart={(event) => event.preventDefault()}
                    onClickCapture={(event) => {
                        if (justDragged.current) event.preventDefault();
                        justDragged.current = false;
                    }}
                    className={`relative flex snap-x snap-mandatory gap-2 overflow-x-auto select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${many ? "[@media(hover:hover)]:cursor-grab [@media(hover:hover)]:active:cursor-grabbing" : ""}`}
                >
                    {slides.map((slide, index) => {
                        const image = <Image src={slide.image} alt={slide.alt} fill priority={index === 0} sizes={sizes} className={fit} />;
                        return (
                            <div key={slide.id} className={`relative shrink-0 snap-start ${frame} ${many ? "w-[92%]" : "w-full"}`}>
                                {slide.href ? <Link href={slide.href} aria-label={`${index + 1}-aksiyani ochish`} className="absolute inset-0">{image}</Link> : image}
                            </div>
                        );
                    })}
                </div>
                {many && (
                    <>
                        <button type="button" onClick={() => move(-1)} aria-label="Oldingi rasm" className="absolute top-1/2 left-2 hidden size-11 -translate-y-1/2 cursor-pointer items-center justify-center bg-white text-ink shadow-[inset_0_0_0_1px_var(--color-line)] hover:bg-ink hover:text-white [@media(hover:hover)]:flex"><ChevronLeftIcon size={22} aria-hidden /></button>
                        <button type="button" onClick={() => move(1)} aria-label="Keyingi rasm" className="absolute top-1/2 right-2 hidden size-11 -translate-y-1/2 cursor-pointer items-center justify-center bg-white text-ink shadow-[inset_0_0_0_1px_var(--color-line)] hover:bg-ink hover:text-white [@media(hover:hover)]:flex"><ChevronRightIcon size={22} aria-hidden /></button>
                    </>
                )}
            </div>
            {many && (
                <div className="flex justify-center">
                    {slides.map((slide, index) => (
                        <button key={slide.id} type="button" onClick={() => goTo(index)} aria-label={`${index + 1}-rasm`} aria-current={index === current} className="flex size-11 cursor-pointer items-center justify-center">
                            <span className={`size-2 rounded-full ${index === current ? "bg-ink" : "bg-line"}`} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
