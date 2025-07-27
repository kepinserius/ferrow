"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, Save, AlertCircle, Upload, X, ImageIcon } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

interface ProductFormProps {
  mode: "add" | "edit"
  productId?: string
}

interface Category {
  id: number
  name: string
}

// Field length limits to match database constraints
const FIELD_LIMITS = {
  name: 255,
  code: 50,
  image_url: 500,
  category: 100,
  description: 1000,
  ingredients: 2000,
  health_benefits: 1500,
}

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageSource, setImageSource] = useState<"url" | "upload">("url")
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    price: "",
    stock: "",
    image_url: "",
    category: "",
    description: "",
    ingredients: "",
    health_benefits: "",
    // Nutrition facts
    protein: "",
    fat: "",
    fiber: "",
    moisture: "",
    ash: "",
    calcium: "",
    phosphorus: "",
    is_active: true,
  })

  useEffect(() => {
    fetchCategories()
    if (mode === "edit" && productId) {
      fetchProduct()
    }
  }, [mode, productId])

  const fetchCategories = async () => {
    try {
      // Try to fetch from categories table first
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name")
        .order("name")

      if (categoriesData && !categoriesError) {
        setCategories(categoriesData)
      } else {
        // If no categories table exists, create default categories
        const defaultCategories = [
          { id: 1, name: "Dry Cat Food" },
          { id: 2, name: "Dry Dog Food" },
          { id: 3, name: "Wet Food" },
          { id: 4, name: "Healthy Snack Treat" },
          { id: 5, name: "Cat Litter" },
        ]
        setCategories(defaultCategories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      // Fallback categories
      setCategories([
        { id: 1, name: "Food & Treats" },
        { id: 2, name: "Toys" },
        { id: 3, name: "Accessories" },
        { id: 4, name: "Health & Care" },
        { id: 5, name: "Other" },
      ])
    }
  }

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("products").select("*").eq("id", productId).single()

      if (error) throw error

      if (data) {
        setFormData({
          name: data.name || "",
          code: data.code || "",
          price: data.price?.toString() || "",
          stock: data.stock?.toString() || "",
          image_url: data.image_url || "",
          category: data.category || "",
          description: data.description || "",
          ingredients: data.ingredients || "",
          health_benefits: data.health_benefits || "",
          protein: data.protein?.toString() || "",
          fat: data.fat?.toString() || "",
          fiber: data.fiber?.toString() || "",
          moisture: data.moisture?.toString() || "",
          ash: data.ash?.toString() || "",
          calcium: data.calcium?.toString() || "",
          phosphorus: data.phosphorus?.toString() || "",
          is_active: data.is_active ?? true,
        })

        // Set image preview if exists
        if (data.image_url) {
          setImagePreview(data.image_url)
          setImageSource("url")
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      setError("Failed to load product data")
    } finally {
      setLoading(false)
    }
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, or WebP)")
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError("Image file size must be less than 5MB")
      return
    }

    setImageFile(file)
    setImageSource("upload")

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Clear URL field when uploading file
    setFormData((prev) => ({ ...prev, image_url: "" }))
    setError(null)
  }

  const testAPIRoute = async () => {
    try {
      console.log("Testing API route...")
      const response = await fetch("/api/upload-image", {
        method: "GET",
      })

      console.log("API test response status:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("API test result:", result)
        return true
      } else {
        const errorText = await response.text()
        console.log("API test error:", errorText)
        return false
      }
    } catch (error) {
      console.error("API test failed:", error)
      return false
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    try {
      console.log("=== Starting image upload ===")
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type,
      })

      // Test API route first
      const apiWorking = await testAPIRoute()
      if (!apiWorking) {
        throw new Error("API route is not accessible")
      }

      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `products/${fileName}`

      console.log("Generated file path:", filePath)

      // Create FormData
      const formData = new FormData()
      formData.append("file", file)
      formData.append("filePath", filePath)

      console.log("Sending upload request...")

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      console.log("Upload response status:", response.status)
      console.log("Upload response headers:", Object.fromEntries(response.headers.entries()))

      // Get response text first
      const responseText = await response.text()
      console.log("Upload response text:", responseText)

      if (!response.ok) {
        // Try to extract error message
        let errorMessage = "Upload failed"

        if (responseText.includes("404")) {
          errorMessage = "Upload API not found. Please check your API route configuration."
        } else {
          try {
            const errorData = JSON.parse(responseText)
            errorMessage = errorData.error || errorMessage
          } catch {
            errorMessage = `Upload failed with status ${response.status}`
          }
        }

        throw new Error(errorMessage)
      }

      // Parse JSON response
      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        throw new Error("Invalid response from server")
      }

      console.log("Upload successful:", result)

      if (!result.publicUrl) {
        throw new Error("No public URL returned from upload")
      }

      return result.publicUrl
    } catch (error: any) {
      console.error("Upload error:", error)
      throw error
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    setFormData((prev) => ({ ...prev, image_url: "" }))
    setImageSource("url")

    // Reset file input
    const fileInput = document.getElementById("image-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = {}

    switch (name) {
      case "name":
        if (!value.trim()) {
          errors.name = "Product name is required"
        } else if (value.length > FIELD_LIMITS.name) {
          errors.name = `Product name must be ${FIELD_LIMITS.name} characters or less`
        }
        break
      case "code":
        if (!value.trim()) {
          errors.code = "Product code is required"
        } else if (value.length > FIELD_LIMITS.code) {
          errors.code = `Product code must be ${FIELD_LIMITS.code} characters or less`
        }
        break
      case "category":
        if (!value.trim()) {
          errors.category = "Category is required"
        }
        break
      case "image_url":
        if (value && value.length > FIELD_LIMITS.image_url) {
          errors.image_url = `Image URL must be ${FIELD_LIMITS.image_url} characters or less`
        } else if (value && !isValidUrl(value)) {
          errors.image_url = "Please enter a valid URL"
        }
        break
      case "description":
        if (value && value.length > FIELD_LIMITS.description) {
          errors.description = `Description must be ${FIELD_LIMITS.description} characters or less`
        }
        break
      case "ingredients":
        if (value && value.length > FIELD_LIMITS.ingredients) {
          errors.ingredients = `Ingredients must be ${FIELD_LIMITS.ingredients} characters or less`
        }
        break
      case "health_benefits":
        if (value && value.length > FIELD_LIMITS.health_benefits) {
          errors.health_benefits = `Health benefits must be ${FIELD_LIMITS.health_benefits} characters or less`
        }
        break
      case "price":
        const priceNum = Number(value)
        if (!value || priceNum <= 0) {
          errors.price = "Valid price is required"
        } else if (priceNum > 999999999.99) {
          errors.price = "Price is too large"
        }
        break
      case "stock":
        const stockNum = Number(value)
        if (!value || stockNum < 0) {
          errors.stock = "Valid stock quantity is required"
        } else if (stockNum > 999999999) {
          errors.stock = "Stock quantity is too large"
        }
        break
    }

    return errors
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    const newValue = type === "checkbox" ? checked : value

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    // Handle image URL change
    if (name === "image_url" && value) {
      setImageSource("url")
      setImagePreview(value)
      setImageFile(null)
    }

    // Validate field on change
    if (type !== "checkbox") {
      const fieldErrors = validateField(name, value)
      setFieldErrors((prev) => ({
        ...prev,
        ...fieldErrors,
        [name]: fieldErrors[name] || "", // Clear error if validation passes
      }))
    }

    // Clear general error when user starts typing
    if (error) setError(null)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Validate all fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "is_active") {
        const fieldErrors = validateField(key, value as string)
        Object.assign(errors, fieldErrors)
      }
    })

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setError("Please fix the errors above before submitting")
      return
    }

    setSaving(true)
    setError(null)

    try {
      let imageUrl = formData.image_url

      // Upload image if file is selected
      if (imageFile) {
        console.log("Starting image upload...")
        setUploading(true)
        imageUrl = await uploadImage(imageFile)
        console.log("Image uploaded successfully:", imageUrl)
      }

      const productData = {
        name: formData.name.trim().substring(0, FIELD_LIMITS.name),
        code: formData.code.trim().substring(0, FIELD_LIMITS.code),
        price: Number(formData.price),
        stock: Number(formData.stock),
        image_url: imageUrl || null,
        category: formData.category.trim() || "Other",
        description: formData.description.trim().substring(0, FIELD_LIMITS.description) || null,
        ingredients: formData.ingredients.trim().substring(0, FIELD_LIMITS.ingredients) || null,
        health_benefits: formData.health_benefits.trim().substring(0, FIELD_LIMITS.health_benefits) || null,
        protein: formData.protein ? Number(formData.protein) : null,
        fat: formData.fat ? Number(formData.fat) : null,
        fiber: formData.fiber ? Number(formData.fiber) : null,
        moisture: formData.moisture ? Number(formData.moisture) : null,
        ash: formData.ash ? Number(formData.ash) : null,
        calcium: formData.calcium ? Number(formData.calcium) : null,
        phosphorus: formData.phosphorus ? Number(formData.phosphorus) : null,
        is_active: formData.is_active,
      }

      console.log("Saving product data:", productData)

      if (mode === "add") {
        const { error } = await supabase.from("products").insert([productData])
        if (error) throw error
      } else {
        const { error } = await supabase.from("products").update(productData).eq("id", productId)
        if (error) throw error
      }

      console.log("Product saved successfully")
      // Success - redirect to products list
      router.push("/admin/products")
    } catch (error: any) {
      console.error("Error saving product:", error)
      // Handle specific database errors
      if (error.message?.includes("value too long")) {
        setError("One or more fields exceed the maximum allowed length. Please shorten your input.")
      } else if (error.message?.includes("duplicate key")) {
        setError("A product with this name already exists.")
      } else if (error.message?.includes("not-null constraint")) {
        setError("All required fields must be filled out.")
      } else {
        setError(error.message || "Failed to save product. Please try again.")
      }
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const handleCancel = () => {
    router.push("/admin/products")
  }

  const getCharacterCount = (fieldName: string, value: string) => {
    const limit = FIELD_LIMITS[fieldName as keyof typeof FIELD_LIMITS]
    if (!limit) return null

    const remaining = limit - value.length
    const isNearLimit = remaining <= 50

    return (
      <span className={`text-xs ${isNearLimit ? "text-red-600" : "text-gray-500"}`}>
        {value.length}/{limit} characters
      </span>
    )
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-6">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      {/* Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-gray-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {mode === "add" ? "Add New Product" : "Edit Product"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {mode === "add"
                  ? "Fill in the details below to add a new product to your inventory"
                  : "Update the product information below"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                maxLength={FIELD_LIMITS.name}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
                  fieldErrors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                required
              />
              <div className="flex justify-between items-center mt-1">
                {fieldErrors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.name}
                  </p>
                )}
                <div className="ml-auto">{getCharacterCount("name", formData.name)}</div>
              </div>
            </div>

            {/* Product Code */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Product Code *
              </label>
              <input
                id="code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter product code (e.g., DRY-CAT-001)"
                maxLength={FIELD_LIMITS.code}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
                  fieldErrors.code ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                required
              />
              <div className="flex justify-between items-center mt-1">
                {fieldErrors.code && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.code}
                  </p>
                )}
                <div className="ml-auto">{getCharacterCount("code", formData.code)}</div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
                  fieldErrors.category ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {fieldErrors.category && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.category}
                </p>
              )}
            </div>

            {/* Price and Stock Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (IDR) *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  max="999999999.99"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
                    fieldErrors.price ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  required
                />
                {fieldErrors.price && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.price}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  max="999999999"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
                    fieldErrors.stock ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  required
                />
                {fieldErrors.stock && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.stock}
                  </p>
                )}
              </div>
            </div>

            {/* Product Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>

              {/* Image Source Toggle */}
              <div className="flex gap-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageSource"
                    value="url"
                    checked={imageSource === "url"}
                    onChange={(e) => {
                      setImageSource("url")
                      setImageFile(null)
                      setImagePreview(formData.image_url)
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Image URL</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageSource"
                    value="upload"
                    checked={imageSource === "upload"}
                    onChange={(e) => setImageSource("upload")}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Upload Image</span>
                </label>
              </div>

              {/* Image URL Input */}
              {imageSource === "url" && (
                <div className="mb-4">
                  <input
                    id="image_url"
                    name="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    maxLength={FIELD_LIMITS.image_url}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
                      fieldErrors.image_url ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">Enter a URL for the product image</p>
                    <div className="ml-auto">{getCharacterCount("image_url", formData.image_url)}</div>
                  </div>
                  {fieldErrors.image_url && (
                    <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.image_url}
                    </p>
                  )}
                </div>
              )}

              {/* File Upload */}
              {imageSource === "upload" && (
                <div className="mb-4">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG or WebP (MAX. 5MB)</p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {imageFile && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <ImageIcon className="h-4 w-4" />
                      <span>{imageFile.name}</span>
                      <span className="text-gray-400">({(imageFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  )}
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                  <div className="relative inline-block">
                    <div className="relative h-32 w-32 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Product preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                maxLength={FIELD_LIMITS.description}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
                  fieldErrors.description ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">Optional: Detailed product description</p>
                <div className="ml-auto">{getCharacterCount("description", formData.description)}</div>
              </div>
              {fieldErrors.description && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.description}
                </p>
              )}
            </div>

            {/* Ingredients */}
            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
                Ingredients
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                rows={4}
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="List all ingredients (e.g., Fresh chicken, brown rice, sweet potatoes...)"
                maxLength={FIELD_LIMITS.ingredients}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
                  fieldErrors.ingredients ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">Optional: List all product ingredients</p>
                <div className="ml-auto">{getCharacterCount("ingredients", formData.ingredients)}</div>
              </div>
              {fieldErrors.ingredients && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.ingredients}
                </p>
              )}
            </div>

            {/* Health Benefits */}
            <div>
              <label htmlFor="health_benefits" className="block text-sm font-medium text-gray-700 mb-2">
                Health Benefits
              </label>
              <textarea
                id="health_benefits"
                name="health_benefits"
                rows={3}
                value={formData.health_benefits}
                onChange={handleChange}
                placeholder="Describe the health benefits (e.g., Supports healthy digestion, promotes shiny coat...)"
                maxLength={FIELD_LIMITS.health_benefits}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
                  fieldErrors.health_benefits ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">Optional: Health benefits of the product</p>
                <div className="ml-auto">{getCharacterCount("health_benefits", formData.health_benefits)}</div>
              </div>
              {fieldErrors.health_benefits && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.health_benefits}
                </p>
              )}
            </div>

            {/* Nutrition Facts */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nutrition Facts (Optional)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">
                    Protein (%)
                  </label>
                  <input
                    id="protein"
                    name="protein"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.protein}
                    onChange={handleChange}
                    placeholder="0.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">
                    Fat (%)
                  </label>
                  <input
                    id="fat"
                    name="fat"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.fat}
                    onChange={handleChange}
                    placeholder="0.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="fiber" className="block text-sm font-medium text-gray-700 mb-1">
                    Fiber (%)
                  </label>
                  <input
                    id="fiber"
                    name="fiber"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.fiber}
                    onChange={handleChange}
                    placeholder="0.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="moisture" className="block text-sm font-medium text-gray-700 mb-1">
                    Moisture (%)
                  </label>
                  <input
                    id="moisture"
                    name="moisture"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.moisture}
                    onChange={handleChange}
                    placeholder="0.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="ash" className="block text-sm font-medium text-gray-700 mb-1">
                    Ash (%)
                  </label>
                  <input
                    id="ash"
                    name="ash"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.ash}
                    onChange={handleChange}
                    placeholder="0.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="calcium" className="block text-sm font-medium text-gray-700 mb-1">
                    Calcium (%)
                  </label>
                  <input
                    id="calcium"
                    name="calcium"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.calcium}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="phosphorus" className="block text-sm font-medium text-gray-700 mb-1">
                    Phosphorus (%)
                  </label>
                  <input
                    id="phosphorus"
                    name="phosphorus"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.phosphorus}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Enter nutritional values as percentages. Leave blank if not applicable.
              </p>
            </div>

            {/* Active Status */}
            <div>
              <label className="flex items-center gap-3">
                <input
                  name="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Active Product</span>
                  <p className="text-xs text-gray-500">Active products will be visible to customers</p>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading || Object.keys(fieldErrors).some((key) => fieldErrors[key])}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving || uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {uploading ? "Uploading..." : mode === "add" ? "Creating..." : "Updating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {mode === "add" ? "Create Product" : "Update Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
