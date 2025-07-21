"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Import useRouter
import { LoginForm } from "@/components/login-form"
import { AppFooter } from "@/components/app-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function StaffLoginPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Keep state for potential future use, though redirect makes it less critical here

  const handleLoginSuccess = () => {
    setIsLoggedIn(true) // Update state
    router.push("/dashboard") // Redirect to the new dashboard page
  }

  // If already logged in (e.g., via a persistent session check), redirect immediately
  // This is a mock check; in a real app, you'd check a token/session
  // useEffect(() => {
  //   if (checkIfUserIsLoggedIn()) { // Placeholder for actual auth check
  //     router.push("/dashboard");
  //   }
  // }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-white/10 bg-card px-4 py-3 shadow-sm backdrop-blur-md md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Home</span>
          </Link>
          <h1 className="text-xl font-semibold">Staff Login</h1>
        </div>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-4 md:p-6">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </main>
      <AppFooter />
    </div>
  )
}
