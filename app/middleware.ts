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

// Add a loading state parameter to the URL
function addLoadingParam(url: URL): URL {
  const newUrl = new URL(url)
  newUrl.searchParams.set('loading', 'true')
  return newUrl
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if we have a loading param and this is a redirected request
  const isLoading = request.nextUrl.searchParams.get('loading') === 'true'
  
  // If a page is already showing loading state, proceed with normal flow
  if (isLoading) {
    // Remove the loading param for the actual redirect
    const cleanUrl = new URL(request.url)
    cleanUrl.searchParams.delete('loading')
    
    // Check if the route is public
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next()
    }

    // Get auth data from cookies
    const authCookie = request.cookies.get('auth')
    
    // If no auth cookie exists, redirect to login
    if (!authCookie) {
      const loginUrl = new URL('/', cleanUrl)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const authData = JSON.parse(authCookie.value)
      
      // Validate auth data structure
      if (!authData || typeof authData.isAuthenticated !== 'boolean' || !authData.userRole) {
        console.error('Invalid auth data structure:', authData)
        return NextResponse.redirect(new URL('/', cleanUrl))
      }

      const { isAuthenticated, userRole } = authData

      // Check if user is authenticated
      if (!isAuthenticated) {
        console.error('User is not authenticated')
        return NextResponse.redirect(new URL('/', cleanUrl))
      }

      // Check route-specific authorization
      for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
        if (pathname.startsWith(route)) {
          if (!allowedRoles.includes(userRole)) {
            // Redirect to home page if user doesn't have required role
            return NextResponse.redirect(new URL('/login', cleanUrl))
          }
          return NextResponse.redirect(new URL('/sa/init-system', cleanUrl))
        }
      }

      // If we get here, the user is authenticated and authorized
      return NextResponse.next()
    } catch (error) {
      console.error('Error processing auth cookie:', error)
      // If there's any error parsing the auth cookie, redirect to login
      return NextResponse.redirect(new URL('/', cleanUrl))
    }
  } else {
    // First time request - show loading state by redirecting to same URL with loading param
    const loadingUrl = addLoadingParam(request.nextUrl.clone())
    
    // Keep all the original path and query parameters
    return NextResponse.redirect(loadingUrl)
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