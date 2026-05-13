export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0e17]">
      {/* subtle radial glow behind the card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(240,165,0,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl px-10 py-10 shadow-2xl">
        <p className="font-display text-3xl text-amber-400 mb-1">SaveIt</p>
        <p className="text-sm text-slate-400 mb-8">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
