"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, Users, Info, Heart, Clock, BookOpen, User, Settings, LogIn, Search, Menu, ChevronLeft, BookText, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function AppSidebar() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  const [collapsed, setCollapsed] = useState(false)

  // Add an effect to update document body class when sidebar state changes
  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    document.body.classList.toggle('sidebar-expanded', !collapsed);

    // Update CSS variable directly
    document.documentElement.style.setProperty('--sidebar-width', collapsed ? '64px' : '240px');

    return () => {
      document.body.classList.remove('sidebar-collapsed');
      document.body.classList.remove('sidebar-expanded');
    };
  }, [collapsed]);

  const mainNavItems = [
    {
      title: "Generate",
      href: "/",
      icon: Sparkles,
      notification: false,
    },
    {
      title: "Prompt Library",
      href: "/prompts",
      icon: BookText,
      notification: false,
    },
    {
      title: "Community",
      href: "/community",
      icon: Users,
      notification: 3,
    },
    {
      title: "Favorites",
      href: "/favorites",
      icon: Heart,
      notification: false,
    },
    {
      title: "History",
      href: "/history",
      icon: Clock,
      notification: false,
    },
    {
      title: "Learning",
      href: "/learning",
      icon: BookOpen,
      notification: 2,
    },
    {
      title: "About",
      href: "/about",
      icon: Info,
      notification: false,
    },
  ]

  const toggleSidebar = () => {
    setCollapsed(prev => !prev)
  }

  return (
      <>
        {/* Sidebar Toggle Button (Always visible, positioned outside the sidebar) */}
        <button
            onClick={toggleSidebar}
            className="fixed left-0 top-4 z-50 flex h-8 w-8 transform items-center justify-center rounded-md border border-border/70 bg-background text-muted-foreground shadow-sm transition-all hover:bg-muted"
            style={{
              left: collapsed ? "48px" : "220px",
            }}
            aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
        >
          {collapsed ? (
              <ChevronLeft className="h-4 w-4 rotate-180" />
          ) : (
              <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        <div className="fixed bottom-4 right-4 z-50">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-md border border-border/50 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs">AI Models: Online</span>
          </div>
        </div>

        <div
            className={cn(
                "h-screen flex flex-col border-r border-border/50 bg-sidebar-background sidebar-container transition-width duration-300 ease-in-out",
                collapsed ? "w-16" : "w-[240px]",
            )}
            style={{ willChange: 'width' }}
        >
          {/* Logo area */}
          <div className="flex items-center h-16 px-4">
            <Link href="/" className="flex items-center gap-3 transition-all duration-300">
              <div className="flex h-8 w-8 min-w-[2rem] items-center justify-center rounded-md bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className={cn(
                  "text-lg font-bold transition-opacity duration-300",
                  collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              )}>
                VisioMera
              </span>
            </Link>
          </div>

          {/* Nav items - fixed height with scrolling */}
          <div className="flex flex-col space-y-1 overflow-y-auto py-3 px-2 h-[calc(100vh-8rem)]">
            {mainNavItems.map((item) => (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                        href={item.href}
                        className={cn(
                            "flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors relative group",
                            pathname === item.href
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                      <div className="relative flex items-center justify-center min-w-[1.5rem]">
                        <item.icon className="h-5 w-5" />
                        {item.notification && (
                            <span
                                className={cn(
                                    "absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium",
                                    pathname === item.href
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted-foreground/30 text-foreground"
                                )}
                            >
                          {item.notification}
                        </span>
                        )}
                      </div>
                      <span className={cn(
                          "transition-all duration-300 whitespace-nowrap",
                          collapsed ? "opacity-0 w-0 translate-x-5" : "opacity-100"
                      )}>
                      {item.title}
                    </span>
                      {collapsed && pathname === item.href && (
                          <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-primary"></span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                      <TooltipContent side="right" sideOffset={6}>
                        {item.title}
                      </TooltipContent>
                  )}
                </Tooltip>
            ))}
          </div>

          {/* Settings item - fixed at the bottom */}
          <div className="mt-auto px-2 py-3 border-t border-border/30">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                    href="/settings"
                    className={cn(
                        "flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                        pathname === "/settings"
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                >
                  <Settings className="h-5 w-5 min-w-[1.25rem]" />
                  <span className={cn(
                      "transition-all duration-300 whitespace-nowrap",
                      collapsed ? "opacity-0 w-0 translate-x-5" : "opacity-100"
                  )}>
                    Settings
                  </span>
                </Link>
              </TooltipTrigger>
              {collapsed && (
                  <TooltipContent side="right" sideOffset={6}>
                    Settings
                  </TooltipContent>
              )}
            </Tooltip>
          </div>

          {/* User area */}
          <div className="px-3 py-3 border-t border-border/30">
            {isLoggedIn ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 min-w-[2rem] border border-border/40">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>UN</AvatarFallback>
                      </Avatar>
                      {!collapsed && (
                          <div className="flex-1 overflow-hidden pl-0">
                            <p className="text-sm font-medium leading-none truncate">User Name</p>
                            <div className="flex flex-col text-xs mt-1">
                              <div className="flex items-center gap-1">
                            <span className="inline-flex h-4 px-1 bg-primary/20 text-primary text-[9px] font-medium rounded-sm items-center justify-center">
                              Pro
                            </span>
                                <span className="text-muted-foreground text-[10px]">•</span>
                                <span className="text-muted-foreground">250 Credits</span>
                              </div>
                            </div>
                          </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  {collapsed && (
                      <TooltipContent side="right" sideOffset={6}>
                        User Name • Pro • 250 Credits
                      </TooltipContent>
                  )}
                </Tooltip>
            ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                        asChild
                        variant="ghost"
                        size={collapsed ? "icon" : "default"}
                        className={cn("w-full", collapsed ? "px-0" : "")}
                    >
                      <Link href="/login">
                        <LogIn className={cn(
                            "h-4 w-4",
                            !collapsed && "mr-2"
                        )} />
                        <span className={cn(
                            "transition-all duration-300",
                            collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                        )}>
                        Sign In
                      </span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  {collapsed && (
                      <TooltipContent side="right" sideOffset={6}>
                        Sign In
                      </TooltipContent>
                  )}
                </Tooltip>
            )}
          </div>
        </div>

        {/* Add required CSS to layout.tsx or globals.css */}
        <style jsx global>{`
          /* Make sidebar fixed position */
          .sidebar-container {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 40;
            width: var(--sidebar-width, 240px);
            transition: width 0.3s ease-in-out;
          }

          /* Define widths for collapsed and expanded states */
          body.sidebar-expanded {
            --sidebar-width: 240px;
          }

          body.sidebar-collapsed {
            --sidebar-width: 64px;
          }

          /* Adjust main content based on sidebar */
          main {
            padding-top: 3.5rem; /* Высота хедера */
            margin-left: var(--sidebar-width, 240px);
            max-width: 100%;
            transition: margin-left 0.3s ease-in-out;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            main {
              margin-left: 0;
            }

            .sidebar-container {
              transform: translateX(calc(-100% + 64px));
            }

            body.sidebar-expanded .sidebar-container {
              transform: translateX(0);
            }
          }
        `}</style>
      </>
  )
}