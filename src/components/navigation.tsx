import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Menu, X, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, signOut } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  const navItems = [
    { href: "/writing", label: "Writing" },
    { href: "/creative", label: "Creative" },
    { href: "/technology", label: "Technology" },
    { href: "/ai", label: "AI" },
    { href: "/health", label: "Health" },
    { href: "/socials", label: "Socials" },
    { href: "/about", label: "About" },
  ]

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="text-xl font-bold">David Martin</div>
          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggle />
          </div>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gradient">
          David Martin
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-2"
            >
              <Link to="/auth">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="h-9 w-9 px-0"
          >
            {isOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md">
          <div className="container py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={handleLinkClick}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  signOut()
                  handleLinkClick()
                }}
                className="w-full justify-start gap-2 px-3"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full justify-start gap-2 px-3"
              >
                <Link to="/auth" onClick={handleLinkClick}>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}