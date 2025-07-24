"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client-simple"

export function RecentProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const { data: products, error } = await supabase
        .from("products")
        .select(`
          *,
          profiles (
            username,
            email
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(6)

      if (error) {
        console.error("Erreur récupération produits:", error)
      } else {
        setProducts(products || [])
      }
    } catch (error) {
      console.error("Erreur récupération produits:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun produit pour le moment</h3>
        <p className="text-gray-500 mb-6">Les produits apparaîtront ici une fois ajoutés.</p>
        <Link href="/products">
          <Button>Voir tous les produits</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <img
                src={
                  product.image_url ||
                  `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(product.title) || "product"}`
                }
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardTitle className="text-lg">{product.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">Par {product.profiles?.username || "Anonyme"}</Badge>
              <Link href={`/products/${product.id}`}>
                <Button size="sm">Voir détails</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
