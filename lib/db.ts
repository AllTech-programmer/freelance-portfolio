// Enhanced database with persistent media storage
import type { PortfolioItem, User, ContactSubmission } from "./types"

// Portfolio items storage with persistent URLs
const portfolioItemsStorage = new Map<string, PortfolioItem>()

// Initialize with default items
const defaultItems: PortfolioItem[] = [
  {
    id: "default-1",
    title: "Student Portfolio",
    category: "One-Page Website",
    price: "₱1,500",
    description: "Beautiful portfolio website for students showcasing skills and projects",
    imageUrl: "/placeholder.svg?height=300&width=400",
    featured: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "default-2",
    title: "Tutor Booking Site",
    category: "Two-Page Website",
    price: "₱2,500",
    description: "Professional booking system for tutors with scheduling functionality",
    imageUrl: "/placeholder.svg?height=300&width=400",
    featured: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "default-3",
    title: "Online Shop",
    category: "Full Website + Admin",
    price: "₱8,000",
    description: "Complete e-commerce solution with admin dashboard and payment integration",
    imageUrl: "/placeholder.svg?height=300&width=400",
    featured: true,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
]

// Initialize storage
defaultItems.forEach((item) => {
  portfolioItemsStorage.set(item.id, item)
})

const users: User[] = [
  {
    id: "1",
    email: "admin@webcraft.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "2",
    email: "webcraft.admin@gmail.com",
    password: "WebCraft2024!",
    role: "admin",
  },
]

const contactSubmissions: ContactSubmission[] = []

// Enhanced portfolio operations with media persistence
export const portfolioDb = {
  getAll: () => {
    const items = Array.from(portfolioItemsStorage.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    console.log("📁 portfolioDb.getAll() - Returning", items.length, "items")

    // Log each item's media info
    items.forEach((item, index) => {
      console.log(`📄 Item ${index + 1}:`, {
        id: item.id,
        title: item.title,
        hasImage: !!item.imageUrl,
        imageUrl: item.imageUrl?.substring(0, 50) + (item.imageUrl?.length > 50 ? "..." : ""),
        isUploadedFile: item.imageUrl?.startsWith("/uploads/"),
        isPlaceholder: item.imageUrl?.includes("placeholder"),
      })
    })

    return items
  },

  getById: (id: string) => {
    const item = portfolioItemsStorage.get(id)
    console.log("🔍 portfolioDb.getById() - ID:", id, "Found:", !!item)
    return item
  },

  create: (itemData: Omit<PortfolioItem, "id" | "createdAt" | "updatedAt">) => {
    const id = `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newItem: PortfolioItem = {
      ...itemData,
      id,
      imageUrl: itemData.imageUrl || "/placeholder.svg?height=300&width=400",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Store the item
    portfolioItemsStorage.set(id, newItem)

    console.log("✅ portfolioDb.create() - New item created:", {
      id: newItem.id,
      title: newItem.title,
      hasImage: !!newItem.imageUrl,
      imageUrl: newItem.imageUrl?.substring(0, 50) + "...",
      isUploadedFile: newItem.imageUrl?.startsWith("/uploads/"),
      totalItems: portfolioItemsStorage.size,
    })

    return newItem
  },

  update: (id: string, updates: Partial<PortfolioItem>) => {
    const existingItem = portfolioItemsStorage.get(id)
    if (!existingItem) {
      console.log("❌ portfolioDb.update() - Item not found:", id)
      return null
    }

    const updatedItem = {
      ...existingItem,
      ...updates,
      updatedAt: new Date(),
    }

    portfolioItemsStorage.set(id, updatedItem)

    console.log("🔄 portfolioDb.update() - Item updated:", {
      id: updatedItem.id,
      title: updatedItem.title,
      hasImage: !!updatedItem.imageUrl,
      imageChanged: existingItem.imageUrl !== updatedItem.imageUrl,
    })

    return updatedItem
  },

  delete: (id: string) => {
    const item = portfolioItemsStorage.get(id)
    const deleted = portfolioItemsStorage.delete(id)

    console.log("🗑️ portfolioDb.delete() - ID:", id, "Success:", deleted)

    // If item had an uploaded image, you could delete the file here
    if (item?.imageUrl?.startsWith("/uploads/")) {
      console.log("📁 Item had uploaded image:", item.imageUrl)
      // In production, you might want to delete the actual file
    }

    return deleted
  },
}

// User operations
export const userDb = {
  findByEmail: (email: string) => users.find((user) => user.email === email),
  findById: (id: string) => users.find((user) => user.id === id),
}

// Contact submissions
export const contactDb = {
  getAll: () => contactSubmissions,
  create: (submission: Omit<ContactSubmission, "id" | "createdAt" | "status">) => {
    const newSubmission: ContactSubmission = {
      ...submission,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: "new",
    }
    contactSubmissions.push(newSubmission)
    return newSubmission
  },
  updateStatus: (id: string, status: ContactSubmission["status"]) => {
    const index = contactSubmissions.findIndex((sub) => sub.id === id)
    if (index === -1) return null

    contactSubmissions[index].status = status
    return contactSubmissions[index]
  },
}
