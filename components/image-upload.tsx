"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon, Loader2, Video, FileImage } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
  acceptVideo?: boolean
}

export function ImageUpload({ value, onChange, disabled, acceptVideo = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    console.log("🔄 Starting file upload:", {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (response.ok) {
        console.log("✅ Upload successful:", data)
        onChange(data.url)

        // Show success message briefly
        setTimeout(() => {
          setUploadProgress(0)
        }, 1000)
      } else {
        console.error("❌ Upload failed:", data.error)
        alert(data.error || "Upload failed")
        setUploadProgress(0)
      }
    } catch (error) {
      console.error("❌ Upload error:", error)
      alert("Upload failed. Please try again.")
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const removeFile = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const isVideo = value?.includes(".mp4") || value?.includes(".webm") || value?.includes(".ogg")
  const acceptTypes = acceptVideo ? "image/*,video/mp4,video/webm,video/ogg,video/avi,video/mov" : "image/*"

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {value ? (
        <Card className="bg-gray-900 border-yellow-400/30">
          <CardContent className="p-4">
            <div className="relative">
              {isVideo ? (
                <video src={value} className="w-full h-48 object-cover rounded-lg" controls preload="metadata" />
              ) : (
                <img
                  src={value || "/placeholder.svg"}
                  alt="Uploaded media"
                  className="w-full h-48 object-cover rounded-lg"
                  onLoad={() => console.log("🖼️ Image loaded successfully:", value)}
                  onError={(e) => {
                    console.error("❌ Image failed to load:", value)
                    console.error("Error details:", e)
                  }}
                />
              )}

              <Button
                type="button"
                onClick={removeFile}
                disabled={disabled || isUploading}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>

              {/* File info overlay */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {isVideo ? <Video className="w-3 h-3 inline mr-1" /> : <FileImage className="w-3 h-3 inline mr-1" />}
                {value.split("/").pop()?.substring(0, 20)}...
              </div>
            </div>

            <p className="text-gray-400 text-sm mt-2">
              {isVideo ? "Video uploaded successfully" : "Image uploaded successfully"} - Click X to remove
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={`bg-gray-900 border-2 border-dashed transition-colors cursor-pointer ${
            dragActive ? "border-yellow-400 bg-yellow-400/5" : "border-yellow-400/30 hover:border-yellow-400/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        >
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center">
              {isUploading ? (
                <>
                  <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mb-4" />
                  <p className="text-yellow-400 font-medium">Uploading...</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{uploadProgress}%</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Upload {acceptVideo ? "Image or Video" : "Image"}</h3>
                  <p className="text-gray-400 text-sm mb-4">Drag and drop your file here, or click to browse</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <ImageIcon className="w-4 h-4" />
                    <span>
                      {acceptVideo
                        ? "Images: PNG, JPG, GIF, WebP (10MB) • Videos: MP4, WebM, OGG (50MB)"
                        : "PNG, JPG, GIF, WebP up to 10MB"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
