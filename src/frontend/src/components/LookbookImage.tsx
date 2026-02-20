import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import type { Product } from '../backend';

interface LookbookImageProps {
  src: string;
  alt: string;
  products: Product[];
}

export default function LookbookImage({ src, alt, products }: LookbookImageProps) {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation();
  const [showHotspots, setShowHotspots] = useState(false);

  return (
    <div
      ref={ref}
      className={`relative w-full transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
      onMouseEnter={() => setShowHotspots(true)}
      onMouseLeave={() => setShowHotspots(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-auto object-cover"
      />
      
      {/* Hotspots */}
      {showHotspots && products.slice(0, 3).map((product, index) => (
        <button
          key={product.id}
          onClick={() => navigate({ to: '/product/$productId', params: { productId: product.id } })}
          className="absolute bg-softPink text-noirBlack rounded-full w-10 h-10 flex items-center justify-center font-bold hover:scale-125 transition-transform shadow-glow animate-pulse"
          style={{
            top: `${30 + index * 20}%`,
            left: `${40 + index * 15}%`,
          }}
        >
          +
        </button>
      ))}
    </div>
  );
}
