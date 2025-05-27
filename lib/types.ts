export interface PortfolioItem {
  id: string
  title: string
  category: string
  price: string
  description: string
  imageUrl: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  password: string
  role: "admin" | "user"
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  createdAt: Date
  status: "new" | "read" | "replied"
}
