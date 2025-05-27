"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Video, Copy, Eye } from "lucide-react"

interface MediaFile {
  filename: string
  url: string
  size: number
  created: string
  modified: string
}

interface MediaLibraryProps {
  onSelectFile?: (url: string) => void
  showSelector?: boolean
}

export function MediaLibrary({ onSelectFile, showSelector = false }: MediaLibraryProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/upload")
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
      }
    } catch (error) {
      console.error("Failed to fetch files:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    alert("URL copied to clipboard!")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const isVideo = (filename: string) => {
    return /\.(mp4|webm|ogg|avi|mov)$/i.test(filename)
  }

  const isImage = (filename: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename)
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-yellow-400/30">
        <CardContent className="p-8 text-center">
          <p className="text-gray-400">Loading media library...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900 border-yellow-400/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <ImageIcon className="w-5 h-5 mr-2" />
          Media Library ({files.length} files)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No files uploaded yet</p>
            <p className="text-gray-500 text-sm">Upload some images or videos to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.filename}
                className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                  selectedFile === file.url ? "border-yellow-400" : "border-gray-600 hover:border-yellow-400/50"
                }`}
                onClick={() => {
                  setSelectedFile(file.url)
                  if (showSelector && onSelectFile) {
                    onSelectFile(file.url)
                  }
                }}
              >
                {/* Media Preview */}
                <div className="aspect-square bg-gray-800 flex items-center justify-center">
                  {isImage(file.filename) ? (
                    <img
                      src={file.url || "/placeholder.svg"}
                      alt={file.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : isVideo(file.filename) ? (
                    <div className="relative w-full h-full bg-gray-700 flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-400" />
                      <video
                        src={file.url}
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                        muted
                        preload="metadata"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-400">Unknown</span>
                    </div>
                  )}
                </div>

                {/* File Info Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {isVideo(file.filename) ? "Video" : "Image"}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-1 h-6 w-6 text-white hover:text-yellow-400"
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(file.url)
                        }}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-1 h-6 w-6 text-white hover:text-blue-400"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(file.url, "_blank")
                        }}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-white">
                    <p className="text-xs font-medium truncate">{file.filename}</p>
                    <p className="text-xs text-gray-300">{formatFileSize(file.size)}</p>
                    <p className="text-xs text-gray-400">{new Date(file.created).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedFile === file.url && (
                  <div className="absolute top-2 left-2 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showSelector && selectedFile && (
          <div className="mt-4 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
            <p className="text-yellow-400 text-sm font-medium">Selected file:</p>
            <p className="text-white text-sm truncate">{selectedFile}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
