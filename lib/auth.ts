export interface Session {
  userId: string
  email: string
  role: string
}

// Simple session storage (in production, use proper session management)
const sessions = new Map<string, Session>()

export function createSession(userId: string, email: string, role: string): string {
  const sessionId = Date.now().toString() + Math.random().toString(36)
  sessions.set(sessionId, { userId, email, role })
  return sessionId
}

export function getSession(sessionId: string): Session | null {
  return sessions.get(sessionId) || null
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId)
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  // In production, use proper password hashing (bcrypt, etc.)
  return password === hashedPassword
}
