export default function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="orb absolute -top-32 -left-24 h-80 w-80 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.74 0.19 145 / .55), transparent 70%)",
        }}
      />
      <div
        className="orb absolute top-1/3 -right-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{
          animationDelay: "-6s",
          background:
            "radial-gradient(closest-side, oklch(0.72 0.18 145 / .45), transparent 70%)",
        }}
      />
      <div
        className="orb absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          animationDelay: "-12s",
          background:
            "radial-gradient(closest-side, oklch(0.78 0.2 145 / .35), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
    </div>
  );
}
