import { supabase } from "./client-simple"

export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        role: "standard",
      },
    },
  })

  return { data, error }
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signOut() {
  return await supabase.auth.signOut()
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function updateProfile(profileData: any) {
  const { data, error } = await supabase.auth.updateUser({
    data: profileData,
  })

  if (!error && data.user) {
    // Mettre à jour aussi la table profiles
    const { error: profileError } = await supabase.from("profiles").update(profileData).eq("id", data.user.id)

    return { data, error: profileError }
  }

  return { data, error }
}

// Fonction pour récupérer le profil complet d'un utilisateur
export async function getUserProfile(userId: string) {
  try {
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Erreur récupération profil:", error)
      return null
    }

    return profile
  } catch (error) {
    console.error("Erreur récupération profil:", error)
    return null
  }
}
