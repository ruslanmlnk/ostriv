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
    fetchProductsServer('all', categorySlug),
  ]);

  return (
    <CatalogPage
      categorySlug={categorySlug}
      initialProducts={products}
      initialCategories={categories}
    />
  );
}
