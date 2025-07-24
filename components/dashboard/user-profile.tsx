"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client-simple"

interface UserProfileProps {
  user: any
}

export function UserProfile({ user }: UserProfileProps) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: user.user_metadata?.username || "",
    bio: user.user_metadata?.bio || "",
    website: user.user_metadata?.website || "",
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: formData,
      })

      if (!error && data.user) {
        // Mettre à jour aussi la table profiles
        const { error: profileError } = await supabase.from("profiles").update(formData).eq("id", data.user.id)

        if (profileError) {
          toast({
            title: "Erreur",
            description: profileError.message,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Profil mis à jour",
            description: "Vos informations ont été sauvegardées",
          })
          setEditing(false)
        }
      } else {
        toast({
          title: "Erreur",
          description: error?.message || "Erreur lors de la mise à jour",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Gérez vos informations de profil</CardDescription>
          </div>
          <Button variant={editing ? "outline" : "default"} onClick={() => setEditing(!editing)}>
            {editing ? "Annuler" : "Modifier"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                placeholder="Parlez-nous de vous..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://votre-site.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Email</Label>
              <p className="text-sm">{user.email}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Nom d'utilisateur</Label>
              <p className="text-sm">{formData.username || "Non défini"}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Rôle</Label>
              <div className="mt-1">
                <Badge variant="secondary">{user.user_metadata?.role || "Standard"}</Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Biographie</Label>
              <p className="text-sm">{formData.bio || "Aucune biographie"}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Site web</Label>
              <p className="text-sm">
                {formData.website ? (
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {formData.website}
                  </a>
                ) : (
                  "Non défini"
                )}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Membre depuis</Label>
              <p className="text-sm">{new Date(user.created_at).toLocaleDateString("fr-FR")}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
