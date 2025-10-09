'use client';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .line-chart-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw-line 15s ease-in-out infinite alternate;
        }
        @keyframes draw-line {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      <svg
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-auto"
        width="100%"
        height="100%"
        viewBox="0 0 1000 400"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="line-chart-path"
          d="M0 250 L100 220 L200 260 L300 200 L400 240 L500 180 L600 230 L700 170 L800 210 L900 160 L1000 200"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeOpacity="0.3"
        />
      </svg>
    </div>
  );
}
