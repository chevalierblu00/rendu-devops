"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"
import { supabase } from "@/lib/supabase/client-simple"
import { ProductsHeader } from "@/components/products/products-header"

export default function CreateProductPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profileChecked, setProfileChecked] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && !profileChecked) {
      checkAndCreateProfile()
    }
  }, [user, profileChecked])

  const checkAndCreateProfile = async () => {
    if (!user) return

    try {
      // Vérifier si le profil existe
      const { data: profile, error } = await supabase.from("profiles").select("id").eq("id", user.id).single()

      if (error && error.code === "PGRST116") {
        // Le profil n'existe pas, le créer
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            username: user.user_metadata?.username || user.email?.split("@")[0] || "user",
            email: user.email || "",
            role: "standard",
          },
        ])

        if (insertError) {
          console.error("Erreur création profil:", insertError)
          toast({
            title: "Erreur",
            description: "Impossible de créer votre profil",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Profil créé",
            description: "Votre profil a été créé automatiquement",
          })
        }
      }
    } catch (error) {
      console.error("Erreur vérification profil:", error)
    } finally {
      setProfileChecked(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer un produit",
        variant: "destructive",
      })
      router.push("/auth/signin")
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
      // Vérifier une dernière fois que le profil existe
      const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

      if (!profile) {
        toast({
          title: "Erreur",
          description: "Votre profil n'existe pas. Veuillez vous reconnecter.",
          variant: "destructive",
        })
        router.push("/auth/signin")
        return
      }

      const { data: product, error } = await supabase
        .from("products")
        .insert([
          {
            title: formData.title.trim(),
            description: formData.description.trim(),
            image_url: formData.image_url.trim() || null,
            user_id: user.id,
            status: "active",
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Erreur création produit:", error)
        toast({
          title: "Erreur",
          description: `Impossible de créer le produit: ${error.message}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Produit créé",
          description: "Votre produit a été créé avec succès",
        })
        router.push(`/products/${product.id}`)
      }
    } catch (error) {
      console.error("Erreur création produit:", error)
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (authLoading || !profileChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProductsHeader />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connexion requise</h3>
              <p className="text-gray-500 mb-6">Vous devez être connecté pour créer un produit.</p>
              <div className="flex gap-2 justify-center">
                <Link href="/auth/signin">
                  <Button variant="outline">Se connecter</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>S'inscrire</Button>
                </Link>
              </div>
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
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux produits
            </Button>
          </Link>
        </div>

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Créer un nouveau produit
            </CardTitle>
            <CardDescription>Ajoutez un nouveau produit à votre catalogue</CardDescription>
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
                <p className="text-xs text-gray-500">Laissez vide pour utiliser une image par défaut</p>
              </div>

              {/* Aperçu */}
              {(formData.title || formData.description) && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-sm text-gray-700 mb-3">Aperçu du produit</h4>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={
                          formData.image_url ||
                          `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(formData.title) || "product"}`
                        }
                        alt={formData.title || "Aperçu"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h5 className="font-medium text-gray-900 mb-1">{formData.title || "Titre du produit"}</h5>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {formData.description || "Description du produit"}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Création..." : "Créer le produit"}
                </Button>
                <Link href="/products">
                  <Button type="button" variant="outline">
                    Annuler
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
