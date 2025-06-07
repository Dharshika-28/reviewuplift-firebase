"use client"
import { useCallback, useState } from "react"
import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Building2, Users, Menu, X, LogOut, Star, User, Icon, BarChart2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Label } from "recharts"

interface SimpleAdminLayoutProps {
  children: React.ReactNode
}

export function SimpleAdminLayout({ children }: SimpleAdminLayoutProps) {
  const location = useLocation()
  const pathname = location.pathname
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/components/admin/dashboard" },
    { icon: Building2, label: "Businesses", href: "/components/admin/businesses" },
    { icon: BarChart2, label: "Analytics", href:"/components/admin/analytics"},
    { icon: Users, label: "Users", href: "/components/admin/users" },
    { icon: User, label: "Register", href: "/components/admin/register" },

  ]

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
            pathname === item.href ? "bg-orange-50 text-orange-600 font-medium" : "text-gray-700 hover:bg-gray-100",
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <item.icon size={18} />
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  )

   const handleLogout = useCallback(() => {
      window.location.href = "/login"
    }, [])
  

  return (
    <div className="w-full flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen p-4">
        <div className="flex items-center justify-center mb-8 pt-4">
          <div className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-orange-600 fill-current" />
            <h1 className="text-xl font-bold text-orange-600">ReviewUplift</h1>
          </div>
        </div>

        <nav className="space-y-1">
          <NavLinks />
        </nav>

        <div className="absolute bottom-4 left-4 right-4 md:w-56">
          <Button
            variant="ghost"
            className="w-full flex items-center gap-3 justify-start text-red-600 hover:text-white hover:bg-red-500 px-4 py-2 transition-all duration-300 rounded-lg"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Star className="h-6 w-6 text-orange-600 fill-current" />
          <h1 className="text-lg font-bold text-orange-600">ReviewUplift</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={24} />
        </Button>
      </div>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-orange-600 fill-current" />
              <h1 className="text-lg font-bold text-orange-600">ReviewUplift</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </Button>
          </div>
          <div className="p-4">
            <nav className="space-y-1">
              <NavLinks />
            </nav>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <Button
            variant="ghost"
            className="w-full flex items-center gap-3 justify-start text-red-600 hover:text-white hover:bg-red-500 px-4 py-2 transition-all duration-300 rounded-lg"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1">
        <div className="md:p-6 p-4 pt-20 md:pt-6">{children}</div>
      </div>
    </div>
  )
}