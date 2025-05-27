"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // Auto-fill demo credentials for testing
  const fillDemoCredentials = () => {
    setEmail("webcraft.admin@gmail.com")
    setPassword("WebCraft2024!")
    setError("")
    setSuccess("Demo credentials filled! Click 'Sign In' to test.")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      console.log("Attempting login with:", { email, password: "***" })

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("Login response:", { status: response.status, data })

      if (response.ok) {
        setSuccess("Login successful! Redirecting to dashboard...")
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 1000)
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

      <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black border border-yellow-400/20 shadow-2xl shadow-yellow-400/10 relative z-10">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Admin Login
          </CardTitle>
          <p className="text-gray-400">Access your WebCraft Pro dashboard</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-3 text-red-400 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-3 text-green-400 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {success}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@webcraft.com"
                  className="pl-10 bg-gray-900 border-yellow-400/30 text-white placeholder-gray-400 focus:border-yellow-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 bg-gray-900 border-yellow-400/30 text-white placeholder-gray-400 focus:border-yellow-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Button
                type="button"
                onClick={fillDemoCredentials}
                variant="outline"
                className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:text-black text-sm"
              >
                Fill Demo Credentials
              </Button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-gray-400 text-sm">Demo: admin@webcraft.com / admin123</p>
              <p className="text-yellow-400 text-sm font-semibold">
                Your Account: webcraft.admin@gmail.com / WebCraft2024!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
