import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ScrollPickerProps {
  items: { label: string; value: string | number }[];
  value: string | number;
  onChange: (value: string | number) => void;
  horizontal?: boolean;
  suffix?: string;
}

export default function ScrollPicker({ items, value, onChange, horizontal = false, suffix }: ScrollPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 52;
  const itemWidth = 60;
  const visibleCount = 5;
  const isScrollingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const selectedIndex = items.findIndex(i => i.value === value);

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    if (!containerRef.current) return;
    if (horizontal) {
      const offset = index * itemWidth - (containerRef.current.clientWidth / 2 - itemWidth / 2);
      containerRef.current.scrollTo({ left: offset, behavior: smooth ? "smooth" : "auto" });
    } else {
      const offset = index * itemHeight - (containerRef.current.clientHeight / 2 - itemHeight / 2);
      containerRef.current.scrollTo({ top: offset, behavior: smooth ? "smooth" : "auto" });
    }
  }, [horizontal]);

  useEffect(() => {
    if (selectedIndex >= 0) {
      scrollToIndex(selectedIndex, false);
    }
  }, [selectedIndex, scrollToIndex]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    clearTimeout(timeoutRef.current);
    isScrollingRef.current = true;

    timeoutRef.current = setTimeout(() => {
      if (!containerRef.current) return;
      isScrollingRef.current = false;
      let centerIndex: number;
      if (horizontal) {
        const scrollLeft = containerRef.current.scrollLeft;
        const center = scrollLeft + containerRef.current.clientWidth / 2;
        centerIndex = Math.round((center - itemWidth / 2) / itemWidth);
      } else {
        const scrollTop = containerRef.current.scrollTop;
        const center = scrollTop + containerRef.current.clientHeight / 2;
        centerIndex = Math.round((center - itemHeight / 2) / itemHeight);
      }
      centerIndex = Math.max(0, Math.min(items.length - 1, centerIndex));
      if (items[centerIndex] && items[centerIndex].value !== value) {
        onChange(items[centerIndex].value);
      }
      scrollToIndex(centerIndex);
    }, 80);
  };

  if (horizontal) {
    return (
      <div className="relative w-full">
        {/* Triangle indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10 pointer-events-none">
          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-primary" />
        </div>
        {/* Selection lines */}
        <div className="absolute left-1/2 -translate-x-1/2 top-3 w-[60px] h-[calc(100%-24px)] border-l border-r border-primary/30 z-10 pointer-events-none" />
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory py-5"
          style={{ scrollSnapType: "x mandatory" }}
        >
          <div className="flex-shrink-0" style={{ width: `calc(50% - ${itemWidth / 2}px)` }} />
          {items.map((item, idx) => {
            const isSelected = item.value === value;
            const dist = Math.abs(idx - selectedIndex);
            return (
              <div
                key={item.value}
                className={cn(
                  "flex-shrink-0 flex items-center justify-center snap-center transition-all duration-200 cursor-pointer select-none font-semibold",
                  isSelected
                    ? "text-foreground text-3xl"
                    : dist === 1
                    ? "text-muted-foreground text-xl"
                    : dist === 2
                    ? "text-muted-foreground/40 text-base"
                    : "text-muted-foreground/20 text-sm"
                )}
                style={{ width: itemWidth, height: itemHeight }}
                onClick={() => { onChange(item.value); scrollToIndex(idx); }}
              >
                {item.label}{suffix && isSelected ? suffix : ""}
              </div>
            );
          })}
          <div className="flex-shrink-0" style={{ width: `calc(50% - ${itemWidth / 2}px)` }} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full flex justify-center">
      {/* Center selection lines */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-full max-w-[180px] h-[52px] border-t border-b border-primary/30 z-10 pointer-events-none"
      />
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="overflow-y-auto scrollbar-hide snap-y snap-mandatory w-full max-w-[180px]"
        style={{ height: visibleCount * itemHeight, scrollSnapType: "y mandatory" }}
      >
        <div style={{ height: (visibleCount - 1) / 2 * itemHeight }} />
        {items.map((item, idx) => {
          const isSelected = item.value === value;
          const dist = Math.abs(idx - selectedIndex);
          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center justify-center snap-center transition-all duration-200 cursor-pointer select-none font-semibold",
                isSelected
                  ? "text-foreground text-3xl"
                  : dist === 1
                  ? "text-muted-foreground text-xl"
                  : dist === 2
                  ? "text-muted-foreground/50 text-lg"
                  : "text-muted-foreground/25 text-base"
              )}
              style={{ height: itemHeight }}
              onClick={() => { onChange(item.value); scrollToIndex(idx); }}
            >
              {item.label}{suffix && isSelected ? suffix : ""}
            </div>
          );
        })}
        <div style={{ height: (visibleCount - 1) / 2 * itemHeight }} />
      </div>
    </div>
  );
}
