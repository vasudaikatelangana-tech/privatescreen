// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Temporarily disabled for local testing
  return NextResponse.next();
}

export const config = {
  matcher: [],
};