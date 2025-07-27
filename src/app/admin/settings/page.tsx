"use client"

import type React from "react"
import ProtectedRoute from "../../../components/ProtectedRoute"
import DashboardLayout from "../../../components/DashboardLayout"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "../../../context/AuthContext"
import { useRouter } from "next/navigation"
import { User, Lock, Save, Eye, EyeOff, AlertCircle, CheckCircle, SettingsIcon } from "lucide-react"

interface AdminProfile {
  id: string
  username: string
  created_at: string
  updated_at: string
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const { admin, adminSignOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (admin) {
      fetchAdminProfile()
    }
  }, [admin])

  const fetchAdminProfile = async () => {
    try {
      const { data, error } = await supabase.from("admin").select("*").eq("username", admin?.username).single()

      if (error) throw error

      if (data) {
        setProfile(data)
        setFormData({
          username: data.username || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error)
      setMessage({ type: "error", text: "Failed to load profile data" })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear message when user starts typing
    if (message) setMessage(null)
  }

  const validateForm = () => {
    if (!formData.username.trim()) {
      setMessage({ type: "error", text: "Username is required" })
      return false
    }

    // If changing password
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        setMessage({ type: "error", text: "Current password is required to change password" })
        return false
      }

      if (!formData.newPassword) {
        setMessage({ type: "error", text: "New password is required" })
        return false
      }

      if (formData.newPassword.length < 6) {
        setMessage({ type: "error", text: "New password must be at least 6 characters long" })
        return false
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: "error", text: "New passwords do not match" })
        return false
      }
    }

    return true
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setSaving(true)
    setMessage(null)

    try {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Prepare request data
      const requestData: any = {
        username: formData.username.trim(),
      }

      // Add password data if changing password
      if (formData.newPassword) {
        requestData.currentPassword = formData.currentPassword
        requestData.newPassword = formData.newPassword
      }

      const response = await fetch("/api/admin/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Fixed: Added backticks for template literal
        },
        body: JSON.stringify(requestData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Failed to update profile")
      }

      // If password changed, force logout
      if (result.requireReauth || result.passwordChanged) {
        setMessage({
          type: "success",
          text: "Password updated successfully! You will be redirected to login page.",
        })

        // Wait 2 seconds then logout
        setTimeout(async () => {
          await adminSignOut() // Use adminSignOut instead of signOut
          router.push("/admin/login")
        }, 2000)

        return
      }

      // Update local state if only username changed
      if (result.admin) {
        setProfile(result.admin)

        // Update token if provided
        if (result.newToken) {
          localStorage.setItem("adminToken", result.newToken)
        }
      }

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setMessage({ type: "error", text: error.message || "Failed to update profile" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout activeTab="settings">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="settings">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your admin account settings and preferences</p>
          </div>

          {/* Profile Settings */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <SettingsIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
                  <p className="text-sm text-gray-600">Update your account information and password</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Message */}
              {message && (
                <div
                  className={`p-4 rounded-lg flex items-center gap-3 ${
                    message.type === "success"
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  )}
                  <p className={`text-sm ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>
                    {message.text}
                  </p>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Username */}
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter username"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Change */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-600">
                  Leave blank if you don't want to change your password. You will be logged out after changing password.
                </p>

                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* New Password */}
                    <div className="space-y-2">
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}