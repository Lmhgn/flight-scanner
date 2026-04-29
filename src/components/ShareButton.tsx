'use client';

export default function ShareButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => navigator.clipboard?.writeText(window.location.href)}
      className={className}
    >
      <span className="material-symbols-outlined text-base">share</span>
      Share
    </button>
  );
}
