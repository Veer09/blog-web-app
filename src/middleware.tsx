import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/blog/:id(.*)', '/api/webhook', '/api/qstash(.*)'])
const isOnboardingRoute = createRouteMatcher(['/onboarding'])
const isApiRoute = createRouteMatcher(['/api(.*)'])
export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = auth()

  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next()
  }

  if (!userId && !isPublicRoute(req)) return redirectToSignIn({ returnBackUrl: req.url })


  if (userId && !isApiRoute && !sessionClaims?.metadata?.onboardingComplete) {
    const onboardingUrl = new URL('/onboarding', req.url)
    return NextResponse.redirect(onboardingUrl)
  }

  if (userId && !isPublicRoute(req)) return NextResponse.next()

}
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}