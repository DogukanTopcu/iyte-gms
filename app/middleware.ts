import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': ['admin'],
  '/advisor': ['advisor'],
  '/student': ['student'],
  '/user': ['user'],
}

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Get auth data from cookies
  const authCookie = request.cookies.get('auth')
  
  // If no auth cookie exists, redirect to login
  if (!authCookie) {
    const loginUrl = new URL('/', request.url)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const authData = JSON.parse(authCookie.value)
    
    // Validate auth data structure
    if (!authData || typeof authData.isAuthenticated !== 'boolean' || !authData.userRole) {
      console.error('Invalid auth data structure:', authData)
      return NextResponse.redirect(new URL('/', request.url))
    }

    const { isAuthenticated, userRole } = authData

    // Check if user is authenticated
    if (!isAuthenticated) {
      console.error('User is not authenticated')
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Check route-specific authorization
    for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(userRole)) {
          // Redirect to home page if user doesn't have required role
          return NextResponse.redirect(new URL('/login', request.url))
        }
        return NextResponse.redirect(new URL('/sa/init-system', request.url))
        break
      }
    }

    // If we get here, the user is authenticated and authorized
    return NextResponse.next()
  } catch (error) {
    console.error('Error processing auth cookie:', error)
    // If there's any error parsing the auth cookie, redirect to login
    return NextResponse.redirect(new URL('/', request.url))
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 