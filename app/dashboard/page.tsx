"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Package, MessageSquare } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserProfile } from "@/components/dashboard/user-profile"
import { UserProducts } from "@/components/dashboard/user-products"
import { UserComments } from "@/components/dashboard/user-comments"
import { supabase } from "@/lib/supabase/client-simple"


export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    try {
      const [productsResult, commentsResult] = await Promise.all([
        supabase
          .from("products")
          .select(`
            *,
            comments (
              id
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("comments")
          .select(`
            *,
            products (
              id,
              title
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ])

      setProducts(productsResult.data || [])
      setComments(commentsResult.data || [])
    } catch (error) {
      console.error("Erreur chargement données:", error)
    } finally {
      setDataLoading(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Gérez vos produits, commentaires et informations personnelles</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mes Produits</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-gray-500">Produits créés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mes Commentaires</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{comments.length}</div>
              <p className="text-xs text-gray-500">Commentaires postés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Statut</CardTitle>
              <User className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant="secondary">{user.user_metadata?.role || "Standard"}</Badge>
              </div>
              <p className="text-xs text-gray-500">Rôle utilisateur</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="products">Mes Produits</TabsTrigger>
            <TabsTrigger value="comments">Mes Commentaires</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <UserProfile user={user} />
          </TabsContent>

          <TabsContent value="products">
            <UserProducts products={products} />
          </TabsContent>

          <TabsContent value="comments">
            <UserComments comments={comments} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
