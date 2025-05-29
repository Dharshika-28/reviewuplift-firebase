"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  BarChart3,
  Settings,
  Star,
  LinkIcon,
  Users,
  Building,
  LogOut,
  Menu,
  ChevronDown,
  ChevronUp,
  MapPin,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SidebarProps {
  isAdmin?: boolean
}

export default function Sidebar({ isAdmin = false }: SidebarProps) {
  const location = useLocation()
  const pathname = location.pathname
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const adminLinks = [
    { name: "Dashboard", href: "/components/admin/dashboard", icon: BarChart3 },
    { name: "Businesses", href: "/components/admin/businesses", icon: Building },
    { name: "Users", href: "/components/admin/users", icon: Users },
    // { 
    //   name: "Settings", 
    //   href: "/components/admin/settings", 
    //   icon: Settings,
    //   subLinks: [
    //     { name: "Account", href: "/components/admin/settings/account", icon: User },
    //     { name: "Locations", href: "/components/admin/settings/locations", icon: MapPin },
    //     { name: "Business Users", href: "/components/admin/settings/business-users", icon: Users }
    //   ]
    // },
  ]

  const businessLinks = [
    { name: "Dashboard", href: "/components/business/dashboard", icon: BarChart3 },
    { name: "Reviews", href: "/components/business/reviews", icon: Star },
    { name: "Review Link", href: "/components/business/review-link", icon: LinkIcon },
    { 
      name: "Settings", 
      href: "/components/business/settings", 
      icon: Settings,
      subLinks: [
        { name: "Account", href: "/components/business/settings/account", icon: User },
        { name: "Locations", href: "/components/business/settings/location", icon: MapPin },
        { name: "Business Users", href: "/components/business/settings/businessusers", icon: Users }
      ]
    },
  ]

  const links = isAdmin ? adminLinks : businessLinks

  const handleLogout = () => {
    window.location.href = "/login"
  }

  const isSettingsActive = (pathname: string) => {
    return pathname.includes("/settings")
  }

  const SidebarContent = () => (
    <div className="h-full flex flex-col pt-12 bg-orange-50 text-orange-900 shadow-md rounded-r-xl overflow-hidden animate-fade-in">
      
      <div className="flex-1 px-5 py-6 overflow-y-auto">
        <nav
          className="space-y-2"
          aria-label={isAdmin ? "Admin navigation" : "Business navigation"}
        >
          {links.map((link, index) => {
            const isActive = pathname === link.href || (link.name === "Settings" && isSettingsActive(pathname))
            const hasSubLinks = link.subLinks && link.subLinks.length > 0

            return (
              <div key={link.name} className="space-y-1">
                <div
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-all duration-300 ease-in-out transform",
                    isActive
                      ? "bg-orange-500 text-white shadow-md"
                      : "hover:bg-orange-100 hover:text-orange-800 hover:translate-x-1"
                  )}
                  onClick={() => {
                    if (hasSubLinks) {
                      setSettingsOpen(!settingsOpen)
                    } else {
                      setOpen(false)
                    }
                  }}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <link.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <Link
                      to={link.href}
                      className="transition-opacity duration-300"
                      onClick={(e) => {
                        if (hasSubLinks) {
                          e.preventDefault()
                        }
                      }}
                    >
                      {link.name}
                    </Link>
                  </div>
                  {hasSubLinks && (
                    settingsOpen ? (
                      <ChevronUp className="h-4 w-4 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    )
                  )}
                </div>

                {hasSubLinks && settingsOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {link.subLinks?.map((subLink, subIndex) => {
                      const isSubActive = pathname === subLink.href
                      return (
                        <Link
                          key={subLink.name}
                          to={subLink.href}
                          className={cn(
                            "group flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out",
                            isSubActive
                              ? "bg-orange-400 text-white shadow-md"
                              : "hover:bg-orange-100 hover:text-orange-800"
                          )}
                          onClick={() => setOpen(false)}
                          style={{ animationDelay: `${(index + subIndex) * 30}ms` }}
                        >
                          <subLink.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                          <span>{subLink.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-orange-200">
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
  )

  if (!mounted) return null

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50 text-orange-700 bg-white rounded-full shadow-lg border border-orange-200"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 bg-orange-50 text-orange-900 w-64 animate-slide-in-left"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-orange-200 bg-orange-50">
        <SidebarContent />
      </div>
    </>
  )
}