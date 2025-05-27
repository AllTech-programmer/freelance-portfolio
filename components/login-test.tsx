"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function LoginTest() {
  const [testResult, setTestResult] = useState<{
    status: "idle" | "testing" | "success" | "error"
    message: string
  }>({ status: "idle", message: "" })

  const testLogin = async () => {
    setTestResult({ status: "testing", message: "Testing login..." })

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "webcraft.admin@gmail.com",
          password: "WebCraft2024!",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setTestResult({
          status: "success",
          message: `✅ Login successful! Welcome ${data.user.email}`,
        })
      } else {
        setTestResult({
          status: "error",
          message: `❌ Login failed: ${data.error}`,
        })
      }
    } catch (error) {
      setTestResult({
        status: "error",
        message: `❌ Network error: ${error.message}`,
      })
    }
  }

  const testDemoLogin = async () => {
    setTestResult({ status: "testing", message: "Testing demo login..." })

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@webcraft.com",
          password: "admin123",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setTestResult({
          status: "success",
          message: `✅ Demo login successful! Welcome ${data.user.email}`,
        })
      } else {
        setTestResult({
          status: "error",
          message: `❌ Demo login failed: ${data.error}`,
        })
      }
    } catch (error) {
      setTestResult({
        status: "error",
        message: `❌ Network error: ${error.message}`,
      })
    }
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-black border border-yellow-400/20">
      <CardHeader>
        <CardTitle className="text-yellow-400">🧪 Login Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button
            onClick={testLogin}
            disabled={testResult.status === "testing"}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold"
          >
            {testResult.status === "testing" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Test Your Admin Login
          </Button>

          <Button
            onClick={testDemoLogin}
            disabled={testResult.status === "testing"}
            variant="outline"
            className="w-full border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            {testResult.status === "testing" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Test Demo Login
          </Button>
        </div>

        {testResult.message && (
          <div
            className={`p-3 rounded-lg border flex items-center ${
              testResult.status === "success"
                ? "bg-green-900/20 border-green-400/30 text-green-400"
                : testResult.status === "error"
                  ? "bg-red-900/20 border-red-400/30 text-red-400"
                  : "bg-blue-900/20 border-blue-400/30 text-blue-400"
            }`}
          >
            {testResult.status === "success" ? (
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            ) : testResult.status === "error" ? (
              <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            ) : (
              <Loader2 className="w-4 h-4 mr-2 flex-shrink-0 animate-spin" />
            )}
            <span className="text-sm">{testResult.message}</span>
          </div>
        )}

        <div className="text-xs text-gray-400 space-y-1">
          <p>
            <strong>Your Credentials:</strong>
          </p>
          <p>Email: webcraft.admin@gmail.com</p>
          <p>Password: WebCraft2024!</p>
          <p className="mt-2">
            <strong>Demo Credentials:</strong>
          </p>
          <p>Email: admin@webcraft.com</p>
          <p>Password: admin123</p>
        </div>
      </CardContent>
    </Card>
  )
}
