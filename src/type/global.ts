export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean,
      about?: string,
      socialMedia?: {
        name: string,
        value: string
      }[]
    }
  }
}