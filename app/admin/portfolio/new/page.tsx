"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, ImageIcon } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { MediaLibrary } from "@/components/media-library"

export default function NewPortfolioItem() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
    featured: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("🚀 Creating portfolio item:", formData)

    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("✅ Portfolio item created successfully:", data)
        router.push("/admin/dashboard")
      } else {
        console.error("❌ Failed to create portfolio item:", data.error)
        setError(data.error || "Failed to create portfolio item")
      }
    } catch (error) {
      console.error("❌ Network error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
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
            Add New Portfolio Item
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
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
                    {isLoading ? "Creating..." : "Create Portfolio Item"}
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

          {/* Media Section */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-900 to-black border border-yellow-400/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Media Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                    <TabsTrigger
                      value="upload"
                      className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                    >
                      Upload New
                    </TabsTrigger>
                    <TabsTrigger
                      value="library"
                      className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                    >
                      Media Library
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="mt-4">
                    <ImageUpload
                      value={formData.imageUrl}
                      onChange={(url) => handleInputChange("imageUrl", url)}
                      disabled={isLoading}
                      acceptVideo={true}
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Upload images or videos to showcase your work. Files are permanently stored.
                    </p>
                  </TabsContent>

                  <TabsContent value="library" className="mt-4">
                    <MediaLibrary onSelectFile={(url) => handleInputChange("imageUrl", url)} showSelector={true} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Preview */}
            {formData.imageUrl && (
              <Card className="bg-gradient-to-br from-gray-900 to-black border border-yellow-400/20">
                <CardHeader>
                  <CardTitle className="text-white">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    {formData.imageUrl.includes(".mp4") || formData.imageUrl.includes(".webm") ? (
                      <video
                        src={formData.imageUrl}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={formData.imageUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mt-2">This is how your media will appear on the website</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
