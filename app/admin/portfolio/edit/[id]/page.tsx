"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import type { PortfolioItem } from "@/lib/types"

export default function EditPortfolioItem() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
    featured: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    fetchPortfolioItem()
  }, [id])

  const fetchPortfolioItem = async () => {
    try {
      const response = await fetch(`/api/portfolio/${id}`)
      if (response.ok) {
        const item: PortfolioItem = await response.json()
        setFormData({
          title: item.title,
          category: item.category,
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl || "",
          featured: item.featured,
        })
      } else {
        setError("Portfolio item not found")
      }
    } catch (error) {
      setError("Failed to load portfolio item")
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/dashboard")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update portfolio item")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
          <span className="text-xl">Loading portfolio item...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:text-black mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Edit Portfolio Item
          </h1>
        </div>

        <Card className="bg-gradient-to-br from-gray-900 to-black border border-yellow-400/20">
          <CardHeader>
            <CardTitle className="text-white">Portfolio Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Student Portfolio"
                    className="bg-gray-900 border-yellow-400/30 text-white placeholder-gray-400 focus:border-yellow-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full bg-gray-900 border border-yellow-400/30 text-white rounded-md px-3 py-2 focus:border-yellow-400 focus:outline-none"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="One-Page Website">One-Page Website</option>
                    <option value="Two-Page Website">Two-Page Website</option>
                    <option value="Full Website + Admin">Full Website + Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Price</label>
                  <Input
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="e.g., ₱1,500"
                    className="bg-gray-900 border-yellow-400/30 text-white placeholder-gray-400 focus:border-yellow-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Screenshot</label>
                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={(url) => handleInputChange("imageUrl", url)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-400">
                    Upload a screenshot of your website. This will be displayed in your portfolio.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe this portfolio item..."
                  rows={4}
                  className="bg-gray-900 border-yellow-400/30 text-white placeholder-gray-400 focus:border-yellow-400 resize-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange("featured", checked)}
                  className="data-[state=checked]:bg-yellow-400"
                />
                <label className="text-sm font-medium text-gray-300">
                  Featured item (will be highlighted on the website)
                </label>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-8 py-3"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Updating..." : "Update Portfolio Item"}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.back()}
                  variant="outline"
                  className="border-gray-400/30 text-gray-400 hover:bg-gray-400 hover:text-black px-8 py-3"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
