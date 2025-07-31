"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Plus, Trash2, Package, DollarSign, Archive, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useAdminAuth } from "../../../context/AuthContext" // Import useAdminAuth

interface Product {
  id: number
  name: string
  price: number
  stock: number
  image_url?: string
  is_active: boolean
  code?: string
  category?: string
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { isAuthenticated, loading: authLoading } = useAdminAuth() // Gunakan useAdminAuth

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      // Hanya fetch jika sudah terautentikasi
      fetchProducts()
    }
  }, [isAuthenticated])

  const fetchProducts = async () => {
    try {
      setError(null)
      const res = await fetch("/api/products")
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return
    setDeletingId(productToDelete.id)
    setError(null)
    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
      }
      // Success - refresh the products list
      await fetchProducts()
      // Show success message (optional)
      console.log(`Product "${productToDelete.name}" deleted successfully`)
    } catch (error) {
      console.error("Failed to delete product:", error)
      setError(error instanceof Error ? error.message : "Failed to delete product")
    } finally {
      setDeletingId(null)
      setShowDeleteDialog(false)
      setProductToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteDialog(false)
    setProductToDelete(null)
    setError(null)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price)
  }

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="container mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      {" "}
      {/* Added bg-gray-50 */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-yellow-100 rounded animate-pulse"></div>{" "}
          {/* Changed bg-gray-200 to bg-yellow-100 */}
          <div className="h-4 w-64 bg-yellow-100 rounded animate-pulse"></div>{" "}
          {/* Changed bg-gray-200 to bg-yellow-100 */}
        </div>
        <div className="h-10 w-32 bg-yellow-100 rounded animate-pulse"></div>{" "}
        {/* Changed bg-gray-200 to bg-yellow-100 */}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-yellow-200 p-6">
            {" "}
            {/* Changed border-gray-200 to border-yellow-200 */}
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-24 bg-yellow-100 rounded animate-pulse"></div>{" "}
              {/* Changed bg-gray-200 to bg-yellow-100 */}
              <div className="h-4 w-4 bg-yellow-100 rounded animate-pulse"></div>{" "}
              {/* Changed bg-gray-200 to bg-yellow-100 */}
            </div>
            <div className="h-8 w-16 bg-yellow-100 rounded animate-pulse"></div>{" "}
            {/* Changed bg-gray-200 to bg-yellow-100 */}
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg border border-yellow-200 p-6">
        {" "}
        {/* Changed border-gray-200 to border-yellow-200 */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-yellow-100 rounded animate-pulse"></div>{" "}
          {/* Changed bg-gray-200 to bg-yellow-100 */}
          <div className="h-4 w-48 bg-yellow-100 rounded animate-pulse"></div>{" "}
          {/* Changed bg-gray-200 to bg-yellow-100 */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-yellow-100 rounded animate-pulse"></div>{" "}
                {/* Changed bg-gray-200 to bg-yellow-100 */}
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-48 bg-yellow-100 rounded animate-pulse"></div>{" "}
                  {/* Changed bg-gray-200 to bg-yellow-100 */}
                  <div className="h-3 w-32 bg-yellow-100 rounded animate-pulse"></div>{" "}
                  {/* Changed bg-gray-200 to bg-yellow-100 */}
                </div>
                <div className="h-8 w-16 bg-yellow-100 rounded animate-pulse"></div>{" "}
                {/* Changed bg-gray-200 to bg-yellow-100 */}
                <div className="h-8 w-20 bg-yellow-100 rounded animate-pulse"></div>{" "}
                {/* Changed bg-gray-200 to bg-yellow-100 */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  if (loading || authLoading || !isAuthenticated) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {" "}
      {/* Added bg-gray-50 for consistent background */}
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="flex items-center space-x-2 text-green-600 hover:text-green-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Product List</h1>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setError(null)}
                    className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header with Add Product Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product inventory and pricing</p>
          </div>
          <button
            onClick={() => router.push("/admin/products/new")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-800 text-yellow-100 text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-lg border border-yellow-200 p-6">
            {" "}
            {/* Changed border-gray-200 to border-yellow-200 */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Products</h3>
              <Package className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{products.length}</div>
          </div>
          <div className="bg-white rounded-lg border border-yellow-200 p-6">
            {" "}
            {/* Changed border-gray-200 to border-yellow-200 */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Active Products</h3>
              <Archive className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{products.filter((p) => p.is_active).length}</div>
          </div>
          <div className="bg-white rounded-lg border border-yellow-200 p-6">
            {" "}
            {/* Changed border-gray-200 to border-yellow-200 */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Low Stock</h3>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{products.filter((p) => p.stock < 10).length}</div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border border-yellow-200">
          {" "}
          {/* Changed border-gray-200 to border-yellow-200 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Product Inventory</h2>
            <p className="text-sm text-gray-600 mt-1">A list of all products in your store</p>
          </div>
          <div className="p-6">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">No products found</h3>
                <p className="text-gray-600 mt-2">Get started by adding your first product.</p>
                <button
                  onClick={() => router.push("/admin/products/new")}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-800 text-yellow-100 text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-yellow-50">
                    {" "}
                    {/* Changed bg-gray-50 to bg-yellow-50 */}
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-yellow-50">
                        {" "}
                        {/* Changed hover:bg-gray-50 to hover:bg-yellow-50 */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                            {product.image_url ? (
                              <Image
                                src={product.image_url || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {product.code ? `Code: ${product.code}` : `ID: ${product.id}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`${product.stock < 10 ? "text-red-600" : "text-gray-900"}`}>
                              {product.stock}
                            </span>
                            {product.stock < 10 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Low
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {product.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => router.push(`/admin/products/${product.id}`)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-yellow-50 border border-yellow-300 rounded-md hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(product)}
                              disabled={deletingId === product.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-3 w-3" />
                              {deletingId === product.id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={cancelDelete}></div>
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Product</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Are you sure you want to delete "<strong>{productToDelete?.name}</strong>"? This action cannot be
                      undone and will permanently remove the product from your inventory.
                    </p>
                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={cancelDelete}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={confirmDelete}
                        disabled={deletingId === productToDelete?.id}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {deletingId === productToDelete?.id ? (
                          <>
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Deleting...
                          </>
                        ) : (
                          "Delete Product"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
