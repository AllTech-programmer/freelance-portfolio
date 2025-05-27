// Media storage utilities for persistent file management

export interface MediaFile {
  id: string
  filename: string
  originalName: string
  url: string
  type: string
  size: number
  uploadedAt: Date
  category: "image" | "video" | "other"
}

// In-memory storage for media files (in production, use a database)
const mediaFiles = new Map<string, MediaFile>()

export const mediaStorage = {
  // Save media file info
  saveFile: (fileData: Omit<MediaFile, "id" | "uploadedAt" | "category">) => {
    const id = `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const category = fileData.type.startsWith("image/")
      ? "image"
      : fileData.type.startsWith("video/")
        ? "video"
        : "other"

    const mediaFile: MediaFile = {
      ...fileData,
      id,
      uploadedAt: new Date(),
      category,
    }

    mediaFiles.set(id, mediaFile)
    console.log("Media file saved:", mediaFile)
    return mediaFile
  },

  // Get all media files
  getAllFiles: () => {
    return Array.from(mediaFiles.values()).sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
  },

  // Get file by ID
  getFileById: (id: string) => {
    return mediaFiles.get(id)
  },

  // Get files by category
  getFilesByCategory: (category: "image" | "video" | "other") => {
    return Array.from(mediaFiles.values())
      .filter((file) => file.category === category)
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
  },

  // Delete file
  deleteFile: (id: string) => {
    const deleted = mediaFiles.delete(id)
    console.log("Media file deleted:", id, "success:", deleted)
    return deleted
  },
}
