import { LandingHero } from "@/components/landing-hero"
import { AppFooter } from "@/components/app-footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <LandingHero />
      </main>
      <AppFooter />
    </div>
  )
}
