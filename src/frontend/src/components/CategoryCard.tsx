import { useNavigate } from '@tanstack/react-router';

interface CategoryCardProps {
  name: string;
  emoji: string;
  image: string;
  slug: string;
}

export default function CategoryCard({ name, emoji, image, slug }: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate({ to: '/category/$categoryName', params: { categoryName: slug } })}
      className="group relative overflow-hidden rounded-3xl aspect-square bg-noirBlack/50 border-2 border-transparent hover:border-softPink transition-all duration-300 hover:shadow-neon w-full text-left"
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-noirBlack via-noirBlack/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="text-4xl mb-2">{emoji}</div>
        <h3 className="font-playfair text-2xl font-bold">{name}</h3>
      </div>
    </button>
  );
}
