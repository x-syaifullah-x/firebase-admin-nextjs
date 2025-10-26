export const runtime = "nodejs"

import { _auth } from "@/lib/firebase"
import { NextRequest, NextResponse } from "next/server"

export const KEY_X_USER_ID = "x-user-id"

export async function middleware(req: NextRequest) {

  const url = req.nextUrl.clone()

  if (url.pathname.startsWith("/api/users")) {
    const authHeader = req.headers.get("authorization") || ""

    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]

    try {
      const requestHeaders = new Headers(req.headers)
      const decodedToken = await _auth.verifyIdToken(idToken)
      const uid = decodedToken.uid
      // const uid = "BYrE25TCIDbkOCa5Hd3MeBwCF9M2"
      requestHeaders.set(KEY_X_USER_ID, uid)
      return NextResponse.next({ request: { headers: requestHeaders } })
    } catch (error) {
      console.log("middleware: ", error)
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }
  }
}

export const config = {
  matcher: ["/api/users/:path*"],
}