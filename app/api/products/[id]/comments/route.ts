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

  const { data: comments, error } = await supabase
    .from("comments")
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
    .eq("product_id", params.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ comments: comments || [] })
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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
    const { content } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Contenu requis" }, { status: 400 })
    }

    const { data: comment, error } = await supabase
      .from("comments")
      .insert([
        {
          content: content.trim(),
          user_id: user.id,
          product_id: params.id,
        },
      ])
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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
