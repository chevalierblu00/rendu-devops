import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  })

  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search")

  let query = supabase
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
        id
      )
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const {
    data: products,
    error,
    count,
  } = await query.range((page - 1) * limit, page * limit - 1).select("*", { count: "exact" })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    products: products || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  })
}

export async function POST(request: NextRequest) {
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
    const body = await request.json()
    const { title, description, image_url } = body

    if (!title || !description) {
      return NextResponse.json({ error: "Titre et description requis" }, { status: 400 })
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert([
        {
          title,
          description,
          image_url,
          user_id: user.id,
          status: "active",
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
