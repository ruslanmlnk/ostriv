import ProductPage from "@/components/ProductPage";
import { fetchProductBySlugServer } from "@/graphql/server/products";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductBySlug({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlugServer(slug);

  if (!product) {
    return notFound();
  }

  return <ProductPage product={product} />;
}
