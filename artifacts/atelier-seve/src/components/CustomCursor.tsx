import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Only run on desktop
    if (window.matchMedia("(max-width: 768px)").matches) {
      setHidden(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", onMouseMove);

    let animationFrameId: number;
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateDot = () => {
      setDotPosition((prev) => ({
        x: lerp(prev.x, position.x, 0.15),
        y: lerp(prev.y, position.y, 0.15),
      }));
      animationFrameId = requestAnimationFrame(updateDot);
    };

    animationFrameId = requestAnimationFrame(updateDot);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [position]);

  if (hidden) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A06E]"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      />
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9998] h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#E8C4B8] bg-[#E8C4B8]/20 backdrop-blur-[2px] transition-transform duration-75"
        style={{
          transform: `translate3d(${dotPosition.x}px, ${dotPosition.y}px, 0)`,
        }}
      />
    </>
  );
}
