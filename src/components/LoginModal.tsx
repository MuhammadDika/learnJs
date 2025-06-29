"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = isSignUp ? "/api/signup" : "/api/login"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (data.success) {
        alert(isSignUp ? "Sign-up successful, please log in" : "Login successful")
        if (isSignUp) {
          setIsSignUp(false)
          setPassword("")
        } else {
          onClose()
        }
      } else {
        alert(data.message || (isSignUp ? "Sign-up failed" : "Login failed"))
      }
    } catch {
      alert("An error occurred during " + (isSignUp ? "sign-up" : "login"))
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-80">
        <h2 className="text-xl font-bold mb-4 text-white">{isSignUp ? "Sign Up" : "Login"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-300 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="text-yellow-400 underline text-sm"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Back to Login" : "Create an account"}
            </button>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-white text-black hover:bg-white transition-none rounded-2xl"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-2xl">
                {isSignUp ? "Sign Up" : "Login"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
