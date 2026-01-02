import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover3d?: boolean;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover3d = true,
  glow = false,
}) => {
  const baseClasses = `
    relative group overflow-hidden
    bg-white/10
    backdrop-blur-2xl backdrop-saturate-150
    border border-white/20
    rounded-3xl p-6 md:p-8
    shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
    transition-all duration-500 ease-out
    before:absolute before:inset-0
    before:bg-gradient-to-br before:from-white/10 before:to-transparent
    before:rounded-3xl before:opacity-0 group-hover:before:opacity-100
    before:transition-opacity before:duration-500
    after:absolute after:inset-0 after:rounded-3xl after:pointer-events-none
    after:border-2 after:border-transparent after:group-hover:border-gradient-glass
    after:transition-all after:duration-700
  `;

  const hover3dClasses = hover3d
    ? `
      group-hover:shadow-[0_24px_64px_0_rgba(31,38,135,0.5)]
      group-hover:border-white/30
      group-hover:-translate-y-3
      group-hover:scale-[1.02]
    `
    : '';

  const glowClasses = glow
    ? `pulse-glow`
    : '';

  return (
    <div className={`${baseClasses} ${hover3dClasses} ${glowClasses} ${className}`}>
      {children}
    </div>
  );
};

// Gradient border and pulse glow CSS (add to global styles if not present)
if (typeof window !== 'undefined' && !document.getElementById('glasscard-style')) {
  const style = document.createElement('style');
  style.id = 'glasscard-style';
  style.innerHTML = `
    .border-gradient-glass {
      border-image: linear-gradient(120deg, #fffbe6, #ffd700, #ffb347, #e0c3fc, #8ec5fc) 1;
    }
    .pulse-glow {
      box-shadow: 0 0 16px 4px #ffd70080, 0 0 64px 16px #fffbe680;
      animation: pulse-glow 2.5s infinite alternate;
    }
    @keyframes pulse-glow {
      0% { box-shadow: 0 0 16px 4px #ffd70080, 0 0 64px 16px #fffbe680; }
      100% { box-shadow: 0 0 32px 8px #ffd700cc, 0 0 96px 32px #fffbe6cc; }
    }
  `;
  document.head.appendChild(style);
}

