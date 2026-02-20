import CategoryCard from './CategoryCard';

export default function ShopByCategory() {
  const categories = [
    {
      name: 'Noir Dresses',
      emoji: '🖤',
      image: '/assets/generated/category-noir-dresses.dim_600x600.png',
      slug: 'noir-dresses',
    },
    {
      name: 'Cozy Hoodies',
      emoji: '🐧',
      image: '/assets/generated/category-hoodies.dim_600x600.png',
      slug: 'hoodies',
    },
    {
      name: 'Pink Sets',
      emoji: '🌸',
      image: '/assets/generated/category-pink-sets.dim_600x600.png',
      slug: 'pink-sets',
    },
    {
      name: 'Accessories',
      emoji: '✨',
      image: '/assets/generated/category-accessories.dim_600x600.png',
      slug: 'accessories',
    },
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="font-playfair text-4xl md:text-5xl font-bold text-center mb-12">
        Shop by Category
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.slug} {...category} />
        ))}
      </div>
    </section>
  );
}
