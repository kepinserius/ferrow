import ProductForm from '../product-form'

// Next.js 15: params is now a Promise
export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Await the params Promise
  const { id } = await params
  
  return <ProductForm mode="edit" productId={id} />
}