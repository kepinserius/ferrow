"use client"

import { useState, useEffect, FormEvent } from 'react'
import { supabaseAdmin } from '../lib/supabaseAdmin'
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  description?: string
  image_url?: string
  is_active: boolean
  created_at: string
}

interface CategoryOption {
  value: string
  label: string
}

interface ProductModalProps {
  product: Product | null
  categories: CategoryOption[]
  onClose: () => void
  onSave: () => void
}

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const categories: CategoryOption[] = [
    { value: 'dry_cat_food', label: 'Dry Cat Food' },
    { value: 'dry_dog_food', label: 'Dry Dog Food' },
    { value: 'wet_food', label: 'Wet Food' },
    { value: 'healthy_snack_treat', label: 'Healthy Snack Treat' },
    { value: 'cat_litter', label: 'Cat Litter' }
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data as Product[])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      setProducts(products.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price)
  }

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category)
    return cat ? cat.label : category
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* UI: Header, Filters, Table... unchanged */}

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false)
            fetchProducts()
          }}
        />
      )}
    </div>
  )
}

function ProductModal({ product, categories, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price?.toString() || '',
    stock: product?.stock?.toString() || '',
    description: product?.description || '',
    image_url: product?.image_url || '',
    is_active: product?.is_active ?? true
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      }

      if (product) {
        const { error } = await supabaseAdmin
          .from('products')
          .update(data)
          .eq('id', product.id)
        if (error) throw error
      } else {
        const { error } = await supabaseAdmin
          .from('products')
          .insert([data])
        if (error) throw error
      }

      onSave()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product')
    } finally {
      setLoading(false)
    }
  }

  return (
    // UI modal content... (same as before)
    <div></div>
  )
}
