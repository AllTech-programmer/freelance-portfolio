"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Check,
  Globe,
  ShoppingCart,
  Calendar,
  MessageCircle,
  Mail,
  Facebook,
  Star,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Heart,
  Smartphone,
  Monitor,
  Palette,
  AlertTriangle,
  Target,
  Clock,
  Settings,
} from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Float, Environment } from "@react-three/drei"
import { AdminAccess } from "@/components/admin-access"

// 3D Components
function FloatingWebsite() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 1.2, 0.1]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[1.8, 1, 0.02]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </Float>
  )
}

function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <Environment preset="night" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} color="#ffd700" intensity={1} />
      <FloatingWebsite />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
    </Canvas>
  )
}

export default function PremiumPortfolio() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const [portfolioItems, setPortfolioItems] = useState([])

  useEffect(() => {
    setIsVisible(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    // Fetch portfolio items with better error handling
    console.log("Fetching portfolio items...")
    fetch("/api/portfolio")
      .then((res) => {
        console.log("Portfolio API response status:", res.status)
        return res.json()
      })
      .then((data) => {
        console.log("Portfolio data received:", data)
        console.log("Number of items:", data.length)

        // Log each item's image info
        data.forEach((item, index) => {
          console.log(`Portfolio item ${index + 1}:`, {
            title: item.title,
            hasImage: !!item.imageUrl,
            imageUrl: item.imageUrl?.substring(0, 50) + "...", // Show first 50 chars
          })
        })

        setPortfolioItems(data.slice(0, 3)) // Show only first 3 items
      })
      .catch((err) => {
        console.error("Failed to fetch portfolio:", err)
      })
  }, [])

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 215, 0, 0.1), transparent 40%)`,
          }}
        ></div>
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-400/25">
                <span className="text-black font-bold text-xl">W</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                WebCraft Pro
              </h1>
              <p className="text-xs text-gray-400">Easy Website Builder</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              variant="outline"
              className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
            <Button
              onClick={scrollToContact}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold px-6 py-2 rounded-full hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:scale-105"
            >
              Get My Website
            </Button>
          </div>
        </div>
      </nav>

      {/* Admin Panel Toggle */}
      {showAdminPanel && (
        <div className="fixed top-20 right-6 z-50 w-80">
          <AdminAccess />
        </div>
      )}

      {/* Floating Admin Access Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-4 rounded-full shadow-2xl shadow-yellow-400/25 hover:scale-110 transition-all duration-300"
          title="Admin Panel Access"
        >
          <Settings className="w-6 h-6" />
        </Button>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div
            className={`transition-all duration-1500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
          >
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 rounded-full text-yellow-400 text-sm font-medium mb-6">
                ✨ Fast Delivery
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Need a Website?
              </span>
            </h1>
          </div>
          <div
            className={`transition-all duration-1500 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
          >
            <h2 className="text-2xl md:text-3xl mb-6 font-light text-gray-300 max-w-4xl mx-auto">
              I help you make <span className="text-yellow-400 font-semibold">beautiful websites</span> fast and easy -
              even if you don't know how to code!
            </h2>
          </div>
          <div
            className={`transition-all duration-1500 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
          >
            <p className="text-xl mb-12 text-gray-400 max-w-2xl mx-auto">
              Perfect for students, sellers, tutors, and small business owners. Ready in 2–5 days!
            </p>
          </div>
          <div
            className={`transition-all duration-1500 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={scrollToContact}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-12 py-6 text-xl font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/25 group"
              >
                <span className="mr-2">Start My Website</span>
                <Zap className="w-6 h-6 group-hover:animate-bounce" />
              </Button>
            </div>
          </div>
        </div>

        {/* 3D Animation */}
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 w-64 h-64 hidden lg:block">
          <Suspense fallback={<div className="w-full h-full bg-yellow-400/10 rounded-full animate-pulse"></div>}>
            <Scene3D />
          </Suspense>
        </div>

        {/* Animated geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-yellow-400/20 rounded-full animate-spin-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-lg animate-pulse"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 border-2 border-yellow-400/30 rotate-45 animate-bounce"></div>
        </div>
      </section>

      {/* Why Businesses Need Websites - Blog Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Why You Need a Website
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Your business deserves to be seen. Here's why a website changes everything.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-12 h-12 text-yellow-400" />,
                title: "People Trust You More",
                description:
                  "When customers see your website, they think 'This person is real and serious about their business.' No website? They might think you're not professional.",
                emotion: "🤝 Build Trust",
              },
              {
                icon: <TrendingUp className="w-12 h-12 text-yellow-400" />,
                title: "Make More Money",
                description:
                  "Your website works 24/7 to bring you customers. While you sleep, people can find you, see your work, and want to buy from you.",
                emotion: "💰 Earn More",
              },
              {
                icon: <Heart className="w-12 h-12 text-yellow-400" />,
                title: "Feel Proud of Your Business",
                description:
                  "Imagine showing your beautiful website to friends and family. You'll feel so proud! Your business looks as good as big companies.",
                emotion: "❤️ Feel Proud",
              },
              {
                icon: <Smartphone className="w-12 h-12 text-yellow-400" />,
                title: "Customers Find You Easy",
                description:
                  "When people search on Google or Facebook, your website shows up. No more losing customers to competitors who have websites.",
                emotion: "🔍 Get Found",
              },
              {
                icon: <Globe className="w-12 h-12 text-yellow-400" />,
                title: "Sell to Anyone, Anywhere",
                description:
                  "Your website lets you sell to people in other cities, even other countries! Your small business can reach the whole world.",
                emotion: "🌍 Go Global",
              },
              {
                icon: <Star className="w-12 h-12 text-yellow-400" />,
                title: "Look Like a Big Company",
                description:
                  "A good website makes your small business look big and successful. Customers will choose you over competitors without websites.",
                emotion: "⭐ Stand Out",
              },
            ].map((reason, index) => (
              <Card
                key={index}
                className="group bg-gradient-to-br from-gray-900 to-black border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10 rounded-2xl overflow-hidden"
              >
                <CardContent className="p-8 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                      {reason.icon}
                    </div>
                    <div className="text-yellow-400 text-sm font-bold mb-2">{reason.emotion}</div>
                    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors duration-300">
                      {reason.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">{reason.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Website Packages
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Choose the perfect website for your business. All websites are mobile-friendly and easy to use!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "One-Page Website",
                price: "₱1,000 – ₱2,000",
                perfect: [
                  "Students (Resume, Portfolio)",
                  "Freelancers (Service Offer)",
                  "Online Tutors (Booking Page)",
                  "Product Promo Pages",
                ],
                includes: ["Hero Section", "About You", "Your Services", "Contact Button", "Social Media Links"],
                popular: false,
                icon: <Monitor className="w-8 h-8" />,
              },
              {
                name: "Two-Page Website",
                price: "₱2,000 – ₱3,500",
                perfect: ["Coaches and Tutors", "Small Brands", "Freelancers with Portfolio"],
                includes: [
                  "Home Page",
                  "1 Custom Page (Products/Services)",
                  "Contact Forms",
                  "Social Media",
                  "Mobile Friendly",
                ],
                popular: true,
                icon: <Globe className="w-8 h-8" />,
              },
              {
                name: "Full Website + Admin",
                price: "₱5,000 – ₱10,000",
                perfect: ["Online Sellers", "Skincare Brands", "Tech Gadget Shops", "Growing Businesses"],
                includes: [
                  "3-4 Pages Complete",
                  "Admin Dashboard",
                  "Add/Edit Products Yourself",
                  "Free Hosting",
                  "Custom Domain Ready",
                ],
                popular: false,
                icon: <ShoppingCart className="w-8 h-8" />,
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-gradient-to-br from-gray-900 to-black border rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 ${
                  plan.popular
                    ? "border-yellow-400 shadow-2xl shadow-yellow-400/20"
                    : "border-yellow-400/20 hover:border-yellow-400/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full font-bold text-sm">
                      Most Popular
                    </div>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 p-3 rounded-2xl mr-4">
                      <div className="text-yellow-400">{plan.icon}</div>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  </div>
                  <div className="mb-6">
                    <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-yellow-400 font-bold mb-3">Perfect for:</h4>
                    <ul className="space-y-2">
                      {plan.perfect.map((item, idx) => (
                        <li key={idx} className="text-gray-300 text-sm">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-white font-bold mb-3">What you get:</h4>
                    <ul className="space-y-3">
                      {plan.includes.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-300">
                          <Check className="w-4 h-4 text-yellow-400 mr-3 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:shadow-lg hover:shadow-yellow-400/25"
                        : "border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Choose This Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add-ons Section */}
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-3xl p-8 border border-yellow-400/20">
            <h3 className="text-3xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Extra Services
              </span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Logo & Branding Kit", price: "₱500+", icon: <Palette className="w-6 h-6" /> },
                { name: "Facebook Messenger", price: "₱300", icon: <MessageCircle className="w-6 h-6" /> },
                { name: "Booking Form", price: "₱300", icon: <Calendar className="w-6 h-6" /> },
                { name: "Custom Domain", price: "₱500", icon: <Globe className="w-6 h-6" /> },
              ].map((addon, index) => (
                <div
                  key={index}
                  className="bg-black/30 p-6 rounded-2xl border border-yellow-400/10 hover:border-yellow-400/30 transition-all duration-300"
                >
                  <div className="flex items-center mb-3">
                    <div className="text-yellow-400 mr-3">{addon.icon}</div>
                    <h4 className="font-bold text-white">{addon.name}</h4>
                  </div>
                  <p className="text-yellow-400 font-bold">{addon.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-bold mb-12">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Why Choose Me
                </span>
              </h2>
              <div className="space-y-8">
                {[
                  {
                    icon: <Zap className="w-8 h-8" />,
                    text: "Super fast delivery (2–5 days only)",
                    color: "from-yellow-400 to-yellow-600",
                  },
                  {
                    icon: <Smartphone className="w-8 h-8" />,
                    text: "Works perfect on phones and computers",
                    color: "from-yellow-400 to-yellow-600",
                  },
                  {
                    icon: <Users className="w-8 h-8" />,
                    text: "Easy to use - you can update it yourself",
                    color: "from-yellow-400 to-yellow-600",
                  },
                  {
                    icon: <Heart className="w-8 h-8" />,
                    text: "Made with love - I care about your success",
                    color: "from-yellow-400 to-yellow-600",
                  },
                  {
                    icon: <Shield className="w-8 h-8" />,
                    text: "Safe payments with GCash and PayPal",
                    color: "from-yellow-400 to-yellow-600",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-6 group cursor-pointer">
                    <div
                      className={`bg-gradient-to-br ${benefit.color} p-3 rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-lg`}
                    >
                      <div className="text-black">{benefit.icon}</div>
                    </div>
                    <span className="text-xl text-gray-300 group-hover:text-white transition-colors duration-300 font-medium">
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-yellow-400/20 shadow-2xl shadow-yellow-400/10">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-3xl"></div>
                {/* Beautiful 5-page website screenshot */}
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-12 flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center text-white text-sm font-medium">Premium Business Website</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6">
                    <div className="bg-white rounded-lg p-4 mb-4 shadow-md">
                      <div className="h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-white rounded-lg p-3 shadow-md">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded"></div>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-md">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded"></div>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-md">
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-red-500 rounded-full mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <div className="flex justify-between items-center mb-3">
                        <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                        <div className="w-16 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-2 bg-gray-200 rounded"></div>
                        <div className="h-2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-full font-bold text-sm">
                  ₱15,000 Value
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Projects Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                See My Work
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">Real websites I made for real people like you</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.length > 0
              ? portfolioItems.map((project, index) => (
                  <Card
                    key={project.id}
                    className="group bg-gradient-to-br from-gray-900 to-black border border-yellow-400/20 hover:border-yellow-400/50 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10"
                  >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <img
                          src={project.imageUrl || "/placeholder.svg?height=300&width=400"}
                          alt={project.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                          onLoad={() => console.log(`Image loaded for ${project.title}`)}
                          onError={(e) => {
                            console.error(`Image failed to load for ${project.title}:`, e)
                            // Fallback to placeholder
                            e.currentTarget.src = "/placeholder.svg?height=300&width=400"
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-sm font-bold">
                            View Website
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-black/70 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
                            {project.price}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-yellow-400 transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-gray-400">{project.category}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              : // Fallback to original hardcoded items if API fails
                [
                  {
                    title: "Student Portfolio",
                    category: "One-Page Website",
                    price: "₱1,500",
                    screenshot: (
                      <div className="w-full h-64 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg overflow-hidden relative">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="p-6 relative z-10">
                          <div className="bg-white/90 rounded-lg p-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-3"></div>
                            <div className="h-2 bg-gray-300 rounded mb-2"></div>
                            <div className="h-2 bg-gray-300 rounded w-3/4 mx-auto"></div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white/80 rounded p-2">
                              <div className="h-1 bg-gray-400 rounded mb-1"></div>
                              <div className="h-1 bg-gray-400 rounded"></div>
                            </div>
                            <div className="bg-white/80 rounded p-2">
                              <div className="h-1 bg-gray-400 rounded mb-1"></div>
                              <div className="h-1 bg-gray-400 rounded"></div>
                            </div>
                            <div className="bg-white/80 rounded p-2">
                              <div className="h-1 bg-gray-400 rounded mb-1"></div>
                              <div className="h-1 bg-gray-400 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Tutor Booking Site",
                    category: "Two-Page Website",
                    price: "₱2,500",
                    screenshot: (
                      <div className="w-full h-64 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg overflow-hidden relative">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="p-6 relative z-10">
                          <div className="bg-white/90 rounded-lg p-4 mb-4">
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mr-3"></div>
                              <div className="h-2 bg-gray-300 rounded flex-1"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="h-1 bg-gray-300 rounded"></div>
                              <div className="h-1 bg-gray-300 rounded"></div>
                            </div>
                            <div className="w-full h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded"></div>
                          </div>
                          <div className="bg-white/80 rounded p-3">
                            <div className="h-1 bg-gray-400 rounded mb-2"></div>
                            <div className="h-1 bg-gray-400 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Online Shop",
                    category: "Full Website + Admin",
                    price: "₱8,000",
                    screenshot: (
                      <div className="w-full h-64 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg overflow-hidden relative">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="p-6 relative z-10">
                          <div className="bg-white/90 rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center mb-3">
                              <div className="h-2 bg-gray-300 rounded w-1/4"></div>
                              <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-red-500 rounded"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="bg-gray-100 rounded p-2">
                                <div className="w-full h-8 bg-gradient-to-br from-yellow-300 to-orange-400 rounded mb-1"></div>
                                <div className="h-1 bg-gray-400 rounded"></div>
                              </div>
                              <div className="bg-gray-100 rounded p-2">
                                <div className="w-full h-8 bg-gradient-to-br from-blue-300 to-purple-400 rounded mb-1"></div>
                                <div className="h-1 bg-gray-400 rounded"></div>
                              </div>
                            </div>
                            <div className="w-full h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                ].map((project, index) => (
                  <Card
                    key={index}
                    className="group bg-gradient-to-br from-gray-900 to-black border border-yellow-400/20 hover:border-yellow-400/50 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10"
                  >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <div className="group-hover:scale-110 transition-transform duration-500">
                          {project.screenshot}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-sm font-bold">
                            View Website
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-black/70 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
                            {project.price}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-yellow-400 transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-gray-400">{project.category}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Let's Start Your Website
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-12">
                Ready to get your beautiful website? Let's chat on Facebook Messenger - it's the fastest way to get
                started!
              </p>

              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-yellow-400/20 mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Message Me on Facebook</h3>
                    <p className="text-gray-400">Get instant replies and quick quotes!</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-yellow-400 mr-3" />
                    <span>Instant response during business hours</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-yellow-400 mr-3" />
                    <span>Share your ideas and get immediate feedback</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-yellow-400 mr-3" />
                    <span>See examples and discuss your project details</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-yellow-400 mr-3" />
                    <span>Get your custom quote in minutes</span>
                  </div>
                </div>

                <Button
                  onClick={() => window.open("https://m.me/YOUR_FACEBOOK_PAGE_USERNAME", "_blank")}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-12 py-4 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-400/25"
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Chat with Me on Messenger
                </Button>

                <p className="text-center text-gray-400 text-sm mt-4">
                  Click the button above to start our conversation!
                </p>
              </div>

              <div className="text-center">
                <p className="text-gray-400 mb-4">Or reach me through:</p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => window.open("https://facebook.com/YOUR_FACEBOOK_PAGE", "_blank")}
                    variant="outline"
                    className="border-blue-400/30 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300 hover:scale-110 px-6 py-3 rounded-2xl"
                  >
                    <Facebook className="w-5 h-5 mr-2" />
                    Facebook Page
                  </Button>
                  <Button
                    onClick={() => window.open("mailto:your.email@gmail.com", "_blank")}
                    variant="outline"
                    className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 hover:scale-110 px-6 py-3 rounded-2xl"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-yellow-400/20 shadow-2xl shadow-yellow-400/10">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-3xl"></div>
                <div className="relative z-10 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Zap className="w-16 h-16 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ready in 2-5 Days!</h3>
                  <p className="text-gray-400 mb-6">
                    Fast delivery, beautiful design, and easy to use. Your website will be ready before you know it!
                  </p>
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-2xl font-bold inline-block">
                    No Monthly Fees!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section - Don't Be on the Losing End */}
      <section className="py-32 px-4 relative bg-gradient-to-br from-gray-900/50 to-black/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
                Don't Be on the Losing End
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Every day without a website, you're losing customers to your competitors
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-red-400/20 mb-12">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-12 h-12 text-red-400 mr-4" />
              <h3 className="text-3xl font-bold text-white">The Hard Truth About Business Today</h3>
            </div>

            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">
                Right now, while you're reading this, your competitors with websites are getting customers that should
                be yours. Every single day, people are searching for services like yours online. When they don't find
                you, they find someone else.
              </p>

              <p className="text-lg">
                <span className="text-red-400 font-bold">Here's what's happening:</span> A customer needs what you
                offer. They search on Google or ask friends on Facebook. Your competitor shows up with a beautiful
                website. You don't. Guess who gets the sale?
              </p>

              <div className="bg-red-900/20 border border-red-400/30 rounded-2xl p-6 my-8">
                <h4 className="text-xl font-bold text-red-400 mb-4">You're Losing Money Every Day Because:</h4>
                <ul className="space-y-3">
                  {[
                    "Customers think you're not professional without a website",
                    "People can't find your business when they search online",
                    "You look smaller than competitors who have websites",
                    "You can't sell to people in other cities or countries",
                    "Young customers expect every business to have a website",
                    "You can't show your work 24/7 like competitors do",
                  ].map((point, index) => (
                    <li key={index} className="flex items-start">
                      <Target className="w-5 h-5 text-red-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-lg">
                <span className="text-yellow-400 font-bold">But here's the good news:</span> You can change this today.
                While your competitors are sleeping, you can get ahead. A beautiful website puts you in the game. It
                makes you look professional, trustworthy, and successful.
              </p>

              <p className="text-lg">
                Think about it: Would you rather be the business that customers find first, or the one they never find
                at all? Would you rather look like a big, successful company, or stay invisible?
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-gradient-to-br from-red-900/30 to-black border border-red-400/30 rounded-3xl">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-red-400 mb-4">Without a Website</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>❌ Customers can't find you</li>
                  <li>❌ You look unprofessional</li>
                  <li>❌ Competitors get your customers</li>
                  <li>❌ You can't sell 24/7</li>
                  <li>❌ Limited to local customers only</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/30 to-black border border-yellow-400/30 rounded-3xl">
              <CardContent className="p-8 text-center">
                <Star className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">With a Website</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>✅ Customers find you easily</li>
                  <li>✅ You look professional & trustworthy</li>
                  <li>✅ You beat competitors without websites</li>
                  <li>✅ Your business works 24/7</li>
                  <li>✅ Sell to the whole world</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-3xl p-8 border border-yellow-400/30">
            <Clock className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">Time is Running Out</h3>
            <p className="text-xl text-gray-300 mb-8">
              Every day you wait, your competitors get stronger. Every customer you lose today is harder to get back
              tomorrow. But you can change everything in just 2-5 days.
            </p>
            <Button
              onClick={scrollToContact}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-12 py-6 text-xl font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/25"
            >
              Stop Losing Customers - Get My Website Now!
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-yellow-400/20 py-12 px-4 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">W</span>
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                WebCraft Pro
              </h3>
            </div>
          </div>
          <p className="text-gray-400 mb-4">Making beautiful websites easy for everyone</p>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} WebCraft Pro. All rights reserved. | Easy Website Builder Philippines
          </p>
        </div>
      </footer>
    </div>
  )
}
