"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client-simple"

interface CommentFormProps {
  productId: string
  onCommentAdded?: () => void
}

export function CommentForm({ productId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un commentaire",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour commenter",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("comments").insert([
        {
          content: content.trim(),
          user_id: user.id,
          product_id: productId,
        },
      ])

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le commentaire",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Commentaire ajouté",
          description: "Votre commentaire a été publié avec succès",
        })
        setContent("")
        if (onCommentAdded) {
          onCommentAdded()
        }
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Écrivez votre commentaire..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading || !content.trim()}>
          {loading ? "Publication..." : "Publier le commentaire"}
        </Button>
      </div>
    </form>
  )
}
