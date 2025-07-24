import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  })

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      description,
      image_url,
      user_id,
      status,
      created_at,
      updated_at,
      profiles!products_user_id_fkey (
        username,
        email
      ),
      comments!comments_product_id_fkey (
        id,
        content,
        user_id,
        created_at,
        profiles!comments_user_id_fkey (
          username
        )
      )
    `)
    .eq("id", params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json({ product })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    // Vérifier que l'utilisateur est propriétaire du produit
    const { data: product } = await supabase.from("products").select("user_id").eq("id", params.id).single()

    if (!product || product.user_id !== user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, image_url, status } = body

    const { data: updatedProduct, error } = await supabase
      .from("products")
      .update({
        title,
        description,
        image_url,
        status,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ product: updatedProduct })
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    // Vérifier que l'utilisateur est propriétaire du produit
    const { data: product } = await supabase.from("products").select("user_id").eq("id", params.id).single()

    if (!product || product.user_id !== user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const { error } = await supabase.from("products").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Produit supprimé" })
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
