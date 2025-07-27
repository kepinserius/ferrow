'use client'

import ProductForm from '../product-form'

export default function EditProductPage({ params }: { params: { id: string } }) {
  return <ProductForm mode="edit" productId={params.id} />
}

