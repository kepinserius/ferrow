import ProductForm from '../product-form'

// Biarkan Next.js atur typing, kita tidak pakai custom type
export default async function EditProductPage({ params }: { params: { id: string } }) {
  return <ProductForm mode="edit" productId={params.id} />
}
