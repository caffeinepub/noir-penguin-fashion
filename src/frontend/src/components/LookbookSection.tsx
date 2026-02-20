import { useGetLookbooks } from '../hooks/useQueries';
import LookbookImage from './LookbookImage';

export default function LookbookSection() {
  const { data: lookbooks, isLoading } = useGetLookbooks();

  if (isLoading || !lookbooks || lookbooks.length === 0) {
    return null;
  }

  const lookbookImages = [
    { src: '/assets/generated/lookbook-noir-dress.dim_1920x1080.png', alt: 'Noir Dress Lookbook' },
    { src: '/assets/generated/lookbook-hoodie.dim_1920x1080.png', alt: 'Hoodie Lookbook' },
    { src: '/assets/generated/lookbook-pink-set.dim_1920x1080.png', alt: 'Pink Set Lookbook' },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 mb-12">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-center">
          Lookbook
        </h2>
        <p className="text-center text-gray-400 mt-4">Shop the look</p>
      </div>

      <div className="space-y-8">
        {lookbookImages.map((image, index) => (
          <LookbookImage
            key={index}
            src={image.src}
            alt={image.alt}
            products={lookbooks[0]?.products || []}
          />
        ))}
      </div>
    </section>
  );
}
