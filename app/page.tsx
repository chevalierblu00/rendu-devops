import { Suspense } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"
import Link from "next/link"
import { StatsCards } from "@/components/home/stats-cards"
import { RecentProducts } from "@/components/home/recent-products"


export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">DevOps Store</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost">Se connecter</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>S'inscrire</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Plateforme E-Commerce
            <span className="text-blue-600"> DevOps</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Une application complète avec authentification, gestion de produits, système de commentaires et déploiement
            automatisé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto">
                Voir les produits
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Créer un compte
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Statistiques de la plateforme</h2>
          <Suspense fallback={<StatsCardsSkeleton />}>
            <StatsCards />
          </Suspense>
        </div>
      </section>

      {/* Recent Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Produits récents</h2>
          <Suspense fallback={<div>Chargement des produits...</div>}>
            <RecentProducts />
          </Suspense>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Package className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-lg font-bold">DevOps Store</span>
              </div>
              <p className="text-gray-400">Plateforme e-commerce moderne avec architecture DevOps complète.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Fonctionnalités</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Authentification sécurisée</li>
                <li>• Gestion de produits</li>
                <li>• Système de commentaires</li>
                <li>• Rôles utilisateurs</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Technologies</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Next.js & React</li>
                <li>• Supabase</li>
                <li>• GitHub Actions</li>
                <li>• Vercel</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DevOps Store. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2" />
            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
