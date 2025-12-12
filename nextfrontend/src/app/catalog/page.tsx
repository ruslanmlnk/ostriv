import CatalogPage from "@/components/CatalogPage";
import { fetchCategoriesServer } from "@/graphql/server/categories";
import { fetchProductsServer } from "@/graphql/server/products";

interface CatalogProps {
  searchParams?: Promise<{
    category?: string;
  }>;
}

export default async function Catalog({ searchParams }: CatalogProps) {
  const params = searchParams ? await searchParams : undefined;
  const categorySlug = params?.category || undefined;

  const [categories, products] = await Promise.all([
    fetchCategoriesServer(),
    // тягнемо всі товари, фільтруємо на клієнті, щоб зберегти коректні лічильники
    fetchProductsServer('all'),
  ]);

  return (
    <CatalogPage
      categorySlug={categorySlug}
      initialProducts={products}
      initialCategories={categories}
    />
  );
}
