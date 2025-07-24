"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase/client-simple"

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer l'utilisateur actuel
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        // Vérifier si le profil existe
        const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

        // Si le profil n'existe pas, le créer
        if (!profile) {
          await supabase.from("profiles").insert([
            {
              id: user.id,
              username: user.user_metadata?.username || user.email?.split("@")[0] || "user",
              email: user.email || "",
              role: "standard",
            },
          ])
        }
      }
      setUser(user)
      setLoading(false)
    })

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null

      if (user && event === "SIGNED_IN") {
        // Vérifier si le profil existe lors de la connexion
        const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

        // Si le profil n'existe pas, le créer
        if (!profile) {
          await supabase.from("profiles").insert([
            {
              id: user.id,
              username: user.user_metadata?.username || user.email?.split("@")[0] || "user",
              email: user.email || "",
              role: "standard",
            },
          ])
        }
      }

      setUser(user)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
