"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Calendar, MessageSquare, Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProductsHeader } from "@/components/products/products-header"
import { CommentsList } from "@/components/products/comments-list"
import { CommentForm } from "@/components/products/comment-form"
import { useAuth } from "@/components/providers/auth-provider"
import { supabase } from "@/lib/supabase/client-simple"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const { user } = useAuth()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProduct()
  }, [params.id])

  const loadProduct = async () => {
    try {
      const { data: product, error } = await supabase
        .from("products")
        .select(`
          *,
          profiles (
            username,
            email
          ),
          comments (
            *,
            profiles (
              username
            )
          )
        `)
        .eq("id", params.id)
        .single()

      if (error) {
        console.error("Erreur récupération produit:", error)
        notFound()
      } else {
        setProduct(product)
      }
    } catch (error) {
      console.error("Erreur récupération produit:", error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  const isOwner = user?.id === product.user_id

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductsHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux produits
            </Button>
          </Link>
          {isOwner && (
            <Link href={`/products/${product.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </Link>
          )}
        </div>

        {/* Produit principal */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image */}
              <div className="aspect-square lg:aspect-video bg-gray-100 overflow-hidden lg:rounded-l-lg">
                <img
                  src={
                    product.image_url ||
                    `/placeholder.svg?height=500&width=500&query=${encodeURIComponent(product.title) || "product"}`
                  }
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Informations */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                  <Badge variant="secondary">{product.status}</Badge>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                <Separator className="my-6" />

                {/* Métadonnées */}
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-2" />
                    <span>
                      Créé par <strong>{product.profiles?.username || "Anonyme"}</strong>
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      Publié le{" "}
                      {new Date(product.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>
                      {product.comments?.length || 0} commentaire{(product.comments?.length || 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section commentaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Commentaires ({product.comments?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Formulaire de commentaire */}
            {user ? (
              <div className="mb-8">
                <CommentForm productId={product.id} onCommentAdded={loadProduct} />
              </div>
            ) : (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 mb-4">Connectez-vous pour laisser un commentaire</p>
                <div className="flex gap-2 justify-center">
                  <Link href="/auth/signin">
                    <Button variant="outline" size="sm">
                      Se connecter
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm">S'inscrire</Button>
                  </Link>
                </div>
              </div>
            )}

            <Separator className="mb-6" />

            {/* Liste des commentaires */}
            <CommentsList comments={product.comments || []} currentUserId={user?.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
