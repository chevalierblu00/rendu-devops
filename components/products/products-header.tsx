"use client"

import { Button } from "@/components/ui/button"
import { Package, Home, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/providers/auth-provider"

export function ProductsHeader() {
  const { user } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">DevOps Store</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
            </Link>
            {user ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Se connecter
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">S'inscrire</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
