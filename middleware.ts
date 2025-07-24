import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Pour l'instant, on laisse passer toutes les requêtes
  // L'authentification sera gérée côté client
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
