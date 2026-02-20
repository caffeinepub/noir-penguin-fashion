import { useState } from 'react';
import { X } from 'lucide-react';

export default function FloatingPenguinMascot() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-40 animate-float">
      <div className="relative group">
        <img
          src="/assets/generated/penguin-logo.dim_200x200.png"
          alt="Penguin Mascot"
          className="w-16 h-16 drop-shadow-glow"
        />
        <button
          onClick={() => setVisible(false)}
          className="absolute -top-2 -right-2 bg-softPink text-noirBlack rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
