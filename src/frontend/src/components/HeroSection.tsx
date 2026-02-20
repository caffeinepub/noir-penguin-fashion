import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-background.dim_1920x800.png"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-noirBlack/60 via-transparent to-noirBlack/80" />
        <div className="absolute inset-0 bg-softPink/10 mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-block mb-6 animate-sparkle">
          <Sparkles className="w-8 h-8 text-softPink" />
        </div>
        
        <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Soft. Bold. <span className="text-softPink">Unstoppable.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-10 tracking-wide">
          Where cute meets confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate({ to: '/category/$categoryName', params: { categoryName: 'noir-dresses' } })}
            size="lg"
            className="bg-softPink text-noirBlack hover:bg-softPink/90 rounded-full px-8 py-6 text-lg font-semibold shadow-glow"
          >
            Shop The Drop
          </Button>
          <Button
            onClick={() => navigate({ to: '/category/$categoryName', params: { categoryName: 'pink-sets' } })}
            size="lg"
            variant="outline"
            className="border-2 border-softPink text-softPink hover:bg-softPink hover:text-noirBlack rounded-full px-8 py-6 text-lg font-semibold"
          >
            Discover Your Style
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-softPink/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-lavender/20 rounded-full blur-3xl animate-pulse delay-1000" />
    </section>
  );
}
