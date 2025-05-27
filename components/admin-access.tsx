"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, ExternalLink, User, Key } from "lucide-react"
import { LoginTest } from "./login-test"

export function AdminAccess() {
  const handleAdminAccess = () => {
    window.open("/admin/login", "_blank")
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-gray-900 to-black border border-yellow-400/20 shadow-2xl shadow-yellow-400/10">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-8 h-8 text-yellow-400 mr-3" />
            <h3 className="text-xl font-bold text-white">Admin Panel Access</h3>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <User className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm text-gray-400">Username:</span>
              </div>
              <p className="text-white font-mono text-sm">webcraft.admin@gmail.com</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Key className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm text-gray-400">Password:</span>
              </div>
              <p className="text-white font-mono text-sm">WebCraft2024!</p>
            </div>
          </div>

          <Button
            onClick={handleAdminAccess}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Access Admin Panel
          </Button>

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-xs">
              Direct Link: <span className="text-yellow-400">/admin/login</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <LoginTest />
    </div>
  )
}
