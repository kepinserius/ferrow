"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../context/AuthContext"
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Menu, X, Bell, Search, ChartNoAxesCombined } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  activeTab?: string
}

export default function DashboardLayout({ children, activeTab = "dashboard" }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { admin, adminSignOut } = useAuth()

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, key: "dashboard" },
    { name: "Products", href: "/admin/products", icon: Package, key: "products" },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart, key: "orders" },
    { name: "Analytics", href: "/admin/analytics", icon: ChartNoAxesCombined, key: "analytics" },
    { name: "Users", href: "/admin/users", icon: Users, key: "users" },
    { name: "Settings", href: "/admin/settings", icon: Settings, key: "settings" },
  ]

  const handleSignOut = async () => {
    await adminSignOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-[#A53410]" />
              <span className="text-xl font-bold text-gray-900">Ferrow Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.key
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-green-100 text-[#A53410]" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-[#A53410]">{admin?.username?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{admin?.username}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-[#A53410]" />
              <span className="text-xl font-bold text-gray-900">Pet Store</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.key
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-[#A53410]/10 text-[#A53410]" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-[#A53410]/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-[#A53410]">{admin?.username?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{admin?.username}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <Search className="pointer-events-none absolute left-4 h-5 w-5 text-gray-400" />
              <input
                className="block h-full w-full border-0 py-0 pl-11 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                placeholder="Search..."
                type="search"
              />
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
