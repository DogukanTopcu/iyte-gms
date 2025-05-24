import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes and their required roles
const protectedRoutes = {
  '/advisor': ['advisor'],
  '/dept-secretariat': ['department secretariat'],
  '/faculty-secretariat': ['faculty secretariat'],
  '/student': ['student'],
  '/student-affairs': ['student affairs'],
}

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('🚀 MIDDLEWARE STARTED - PATH:', pathname)
  
  // Skip middleware for static assets
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') && !pathname.endsWith('.html')
  ) {
    console.log('📁 Static asset, skipping middleware:', pathname)
    return NextResponse.next()
  }
  
  try {
    // Check if the route is public
    if (publicRoutes.some(route => pathname === route || (route === '/' && pathname === '/'))) {
      console.log('🌐 Public route accessed:', pathname)
      return NextResponse.next()
    }

    // Get auth data from cookies
    const authCookie = request.cookies.get('auth')
    
    console.log('🍪 Auth cookie exists:', !!authCookie)
    
    // If no auth cookie exists, redirect to login
    if (!authCookie) {
      console.log('❌ No auth cookie, redirecting to login')
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      const authData = JSON.parse(authCookie.value)
      
      console.log('👤 Auth data:', authData)
      
      // Validate auth data structure
      if (!authData || typeof authData.isAuthenticated !== 'boolean' || !authData.userRole) {
        console.error('❌ Invalid auth data structure:', authData)
        return NextResponse.redirect(new URL('/', request.url))
      }

      const { isAuthenticated, userRole } = authData

      console.log('🔐 User authenticated:', isAuthenticated, 'Role:', userRole)

      // Check if user is authenticated
      if (!isAuthenticated) {
        console.error('❌ User is not authenticated')
        return NextResponse.redirect(new URL('/', request.url))
      }

      // Special handling for transcript routes - accessible by all roles except students
      if (pathname.startsWith('/transcript')) {
        console.log('📄 Transcript route accessed by:', userRole)
        if (userRole === 'student') {
          console.log('❌ Student trying to access transcript, redirecting to /student')
          return NextResponse.redirect(new URL('/student', request.url))
        }
        console.log('✅ Non-student accessing transcript route')
        return NextResponse.next()
      }

      // Check route-specific authorization
      let hasAccess = false
      let matchedRoute = null
      
      for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
        if (pathname.startsWith(route)) {
          matchedRoute = route
          console.log('🛣️ Route matched:', route, 'Allowed roles:', allowedRoles, 'User role:', userRole)
          
          if (allowedRoles.includes(userRole)) {
            hasAccess = true
            console.log('✅ Access granted for route:', route)
            break
          } else {
            console.log('❌ Access denied for route:', route)
            hasAccess = false
            break
          }
        }
      }

      // If no protected route matched, allow access (unprotected route)
      if (!matchedRoute) {
        console.log('🌐 No protected route matched, allowing access to:', pathname)
        return NextResponse.next()
      }

      // If access is denied, redirect to user's appropriate page
      if (!hasAccess) {
        let redirectPath = '/login'
        
        switch (userRole) {
          case 'advisor':
            redirectPath = '/'
            break
          case 'department secretariat':
            redirectPath = '/'
            break
          case 'faculty secretariat':
            redirectPath = '/'
            break
          case 'student':
            redirectPath = '/'
            break
          case 'student affairs':
            redirectPath = '/'
            break
          default:
            redirectPath = '/login'
        }
        
        console.log('🔄 Redirecting unauthorized user to:', redirectPath)
        return NextResponse.redirect(new URL(redirectPath, request.url))
      }

      // User has access to the route
      console.log('✅ Access granted, proceeding to:', pathname)
      return NextResponse.next()
    } catch (error) {
      console.error('❌ Error processing auth cookie:', error)
      // If there's any error parsing the auth cookie, redirect to login
      return NextResponse.redirect(new URL('/', request.url))
    }
  } catch (error) {
    console.error('💥 MIDDLEWARE ERROR:', error)
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
     * - public folder files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
} 