import { supabaseServer } from "./server-simple"

export async function getStats() {
  try {
    const [{ count: totalUsers }, { count: totalProducts }, { count: totalComments }] = await Promise.all([
      supabaseServer.from("profiles").select("*", { count: "exact", head: true }),
      supabaseServer.from("products").select("*", { count: "exact", head: true }),
      supabaseServer.from("comments").select("*", { count: "exact", head: true }),
    ])

    return {
      totalUsers: totalUsers || 0,
      totalProducts: totalProducts || 0,
      totalComments: totalComments || 0,
    }
  } catch (error) {
    console.error("Erreur récupération stats:", error)
    return {
      totalUsers: 0,
      totalProducts: 0,
      totalComments: 0,
    }
  }
}

export async function getRecentProducts() {
  try {
    const { data: products, error } = await supabaseServer
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
      return []
    }

    return products || []
  } catch (error) {
    console.error("Erreur récupération produits:", error)
    return []
  }
}

export async function getUserProducts(userId: string) {
  try {
    const { data: products, error } = await supabaseServer
      .from("products")
      .select(`
        *,
        comments (
          id
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erreur récupération produits utilisateur:", error)
      return []
    }

    return products || []
  } catch (error) {
    console.error("Erreur récupération produits utilisateur:", error)
    return []
  }
}

export async function getUserComments(userId: string) {
  try {
    const { data: comments, error } = await supabaseServer
      .from("comments")
      .select(`
        *,
        products (
          id,
          title
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erreur récupération commentaires utilisateur:", error)
      return []
    }

    return comments || []
  } catch (error) {
    console.error("Erreur récupération commentaires utilisateur:", error)
    return []
  }
}

export async function getAllProducts() {
  try {
    const { data: products, error } = await supabaseServer
      .from("products")
      .select(`
        *,
        profiles (
          username,
          email
        ),
        comments (
          id
        )
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erreur récupération tous les produits:", error)
      return []
    }

    return products || []
  } catch (error) {
    console.error("Erreur récupération tous les produits:", error)
    return []
  }
}

export async function getProductById(id: string) {
  try {
    const { data: product, error } = await supabaseServer
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
      .eq("id", id)
      .single()

    if (error) {
      console.error("Erreur récupération produit:", error)
      return null
    }

    return product
  } catch (error) {
    console.error("Erreur récupération produit:", error)
    return null
  }
}

// Fonction utilitaire pour créer un produit
export async function createProduct(productData: {
  title: string
  description: string
  image_url?: string
  user_id: string
}) {
  try {
    const { data, error } = await supabaseServer.from("products").insert([productData]).select().single()

    if (error) {
      console.error("Erreur création produit:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erreur création produit:", error)
    return { data: null, error }
  }
}

// Fonction utilitaire pour créer un commentaire
export async function createComment(commentData: {
  content: string
  user_id: string
  product_id: string
}) {
  try {
    const { data, error } = await supabaseServer
      .from("comments")
      .insert([commentData])
      .select(`
        id,
        content,
        user_id,
        product_id,
        created_at,
        profiles!comments_user_id_fkey (
          username
        )
      `)
      .single()

    if (error) {
      console.error("Erreur création commentaire:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erreur création commentaire:", error)
    return { data: null, error }
  }
}
