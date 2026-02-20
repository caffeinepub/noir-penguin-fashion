import { Sparkles } from 'lucide-react';

export default function AboutSection() {
  const brandValues = [
    'Created for bold girls',
    'Confidence-driven fashion',
    'Comfortable but powerful designs',
    'Express yourself without limits',
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <img
          src="/assets/generated/penguin-logo.dim_200x200.png"
          alt="Noir Penguin Logo"
          className="w-32 h-32 mx-auto mb-8 drop-shadow-glow"
        />
        
        <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
          Stay Cool. Stay Confident.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {brandValues.map((value, index) => (
            <div
              key={index}
              className="bg-softPink/5 border border-softPink/20 rounded-3xl p-6 hover:border-softPink transition-colors"
            >
              <Sparkles className="w-6 h-6 text-softPink mx-auto mb-3" />
              <p className="text-lg">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
