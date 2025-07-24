"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Package, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"
import { supabase } from "@/lib/supabase/client-simple"
import { ProductsHeader } from "@/components/products/products-header"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [productLoading, setProductLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    status: "active",
  })

  useEffect(() => {
    loadProduct()
  }, [params.id])

  const loadProduct = async () => {
    try {
      const { data: product, error } = await supabase.from("products").select("*").eq("id", params.id).single()

      if (error) {
        console.error("Erreur récupération produit:", error)
        notFound()
      } else {
        setProduct(product)
        setFormData({
          title: product.title,
          description: product.description,
          image_url: product.image_url || "",
          status: product.status,
        })
      }
    } catch (error) {
      console.error("Erreur récupération produit:", error)
      notFound()
    } finally {
      setProductLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || user.id !== product?.user_id) {
      toast({
        title: "Erreur",
        description: "Vous n'êtes pas autorisé à modifier ce produit",
        variant: "destructive",
      })
      return
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from("products")
        .update({
          title: formData.title.trim(),
          description: formData.description.trim(),
          image_url: formData.image_url.trim() || null,
          status: formData.status,
        })
        .eq("id", params.id)

      if (error) {
        console.error("Erreur modification produit:", error)
        toast({
          title: "Erreur",
          description: "Impossible de modifier le produit",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Produit modifié",
          description: "Votre produit a été modifié avec succès",
        })
        router.push(`/products/${params.id}`)
      }
    } catch (error) {
      console.error("Erreur modification produit:", error)
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!user || user.id !== product?.user_id) {
      toast({
        title: "Erreur",
        description: "Vous n'êtes pas autorisé à supprimer ce produit",
        variant: "destructive",
      })
      return
    }

    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.")) {
      return
    }

    setDeleteLoading(true)

    try {
      const { error } = await supabase.from("products").delete().eq("id", params.id)

      if (error) {
        console.error("Erreur suppression produit:", error)
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le produit",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Produit supprimé",
          description: "Votre produit a été supprimé avec succès",
        })
        router.push("/products")
      }
    } catch (error) {
      console.error("Erreur suppression produit:", error)
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (productLoading) {
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

  if (!user || user.id !== product.user_id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProductsHeader />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Accès non autorisé</h3>
              <p className="text-gray-500 mb-6">Vous ne pouvez modifier que vos propres produits.</p>
              <Link href={`/products/${params.id}`}>
                <Button>Voir le produit</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductsHeader />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/products/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au produit
            </Button>
          </Link>
        </div>

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Modifier le produit
            </CardTitle>
            <CardDescription>Modifiez les informations de votre produit</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Titre du produit <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Ex: MacBook Pro M3"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Décrivez votre produit en détail..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL de l'image (optionnel)</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  placeholder="https://exemple.com/image.jpg"
                  value={formData.image_url}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Modification..." : "Modifier le produit"}
                </Button>
                <Link href={`/products/${params.id}`}>
                  <Button type="button" variant="outline">
                    Annuler
                  </Button>
                </Link>
              </div>
            </form>

            {/* Zone de danger */}
            <div className="mt-8 pt-6 border-t border-red-200">
              <h4 className="text-sm font-medium text-red-800 mb-2">Zone de danger</h4>
              <p className="text-xs text-red-600 mb-4">
                La suppression du produit est définitive et ne peut pas être annulée.
              </p>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleteLoading}>
                <Trash2 className="h-4 w-4 mr-2" />
                {deleteLoading ? "Suppression..." : "Supprimer le produit"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
