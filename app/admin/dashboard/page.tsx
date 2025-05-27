"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, LogOut, Mail, Globe, Star } from "lucide-react"
import type { PortfolioItem, ContactSubmission } from "@/lib/types"

export default function AdminDashboard() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"portfolio" | "contacts">("portfolio")
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      console.log("Admin dashboard: Fetching data...")

      const [portfolioRes, contactRes] = await Promise.all([fetch("/api/portfolio"), fetch("/api/contact")])

      console.log("Portfolio response status:", portfolioRes.status)
      console.log("Contact response status:", contactRes.status)

      if (portfolioRes.ok) {
        const portfolioData = await portfolioRes.json()
        console.log("Portfolio data in admin:", portfolioData.length, "items")

        portfolioData.forEach((item, index) => {
          console.log(`Admin item ${index + 1}:`, {
            id: item.id,
            title: item.title,
            hasImage: !!item.imageUrl,
            imageType: item.imageUrl?.startsWith("data:") ? "base64" : "url",
          })
        })

        setPortfolioItems(portfolioData)
      }

      if (contactRes.ok) {
        const contactData = await contactRes.json()
        setContactSubmissions(contactData)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const deletePortfolioItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return

    try {
      const response = await fetch(`/api/portfolio/${id}`, { method: "DELETE" })
      if (response.ok) {
        setPortfolioItems((items) => items.filter((item) => item.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete portfolio item:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-black border-b border-yellow-400/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold">W</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                WebCraft Pro Admin
              </h1>
              <p className="text-sm text-gray-400">Dashboard</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-900 to-black border border-yellow-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Portfolio Items</p>
                  <p className="text-3xl font-bold text-yellow-400">{portfolioItems.length}</p>
                </div>
                <Globe className="w-12 h-12 text-yellow-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border border-yellow-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Contact Submissions</p>
                  <p className="text-3xl font-bold text-yellow-400">{contactSubmissions.length}</p>
                </div>
                <Mail className="w-12 h-12 text-yellow-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border border-yellow-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Featured Items</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    {portfolioItems.filter((item) => item.featured).length}
                  </p>
                </div>
                <Star className="w-12 h-12 text-yellow-400/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button
            onClick={() => setActiveTab("portfolio")}
            variant={activeTab === "portfolio" ? "default" : "outline"}
            className={
              activeTab === "portfolio"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black"
                : "border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            }
          >
            <Globe className="w-4 h-4 mr-2" />
            Portfolio Management
          </Button>
          <Button
            onClick={() => setActiveTab("contacts")}
            variant={activeTab === "contacts" ? "default" : "outline"}
            className={
              activeTab === "contacts"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black"
                : "border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            }
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Submissions
          </Button>
        </div>

        {/* Portfolio Management */}
        {activeTab === "portfolio" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Portfolio Items</h2>
              <Button
                onClick={() => router.push("/admin/portfolio/new")}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Item
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map((item) => (
                <Card key={item.id} className="bg-gradient-to-br from-gray-900 to-black border border-yellow-400/20">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {item.featured && (
                        <Badge className="absolute top-2 right-2 bg-yellow-400 text-black">Featured</Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{item.category}</p>
                      <p className="text-yellow-400 font-bold mb-4">{item.price}</p>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/admin/portfolio/edit/${item.id}`)}
                          className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deletePortfolioItem(item.id)}
                          className="border-red-400/30 text-red-400 hover:bg-red-400 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Contact Submissions */}
        {activeTab === "contacts" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Contact Submissions</h2>

            <div className="space-y-4">
              {contactSubmissions.map((submission) => (
                <Card
                  key={submission.id}
                  className="bg-gradient-to-br from-gray-900 to-black border border-yellow-400/20"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-white">{submission.name}</h3>
                        <p className="text-gray-400">{submission.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={submission.status === "new" ? "default" : "secondary"}
                          className={submission.status === "new" ? "bg-yellow-400 text-black" : ""}
                        >
                          {submission.status}
                        </Badge>
                        <p className="text-gray-400 text-sm mt-1">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{submission.message}</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                      >
                        Reply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-400/30 text-gray-400 hover:bg-gray-400 hover:text-black"
                      >
                        Mark as Read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {contactSubmissions.length === 0 && (
                <Card className="bg-gradient-to-br from-gray-900 to-black border border-yellow-400/20">
                  <CardContent className="p-12 text-center">
                    <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No contact submissions yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
