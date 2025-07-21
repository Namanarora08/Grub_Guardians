"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"

export function LandingHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-center md:px-6 lg:py-24">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <motion.div className="max-w-3xl space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h1
          className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
          variants={itemVariants}
        >
          Guarding Every Grain. One Notification at a Time.
        </motion.h1>
        <motion.p className="text-lg text-muted-foreground md:text-xl" variants={itemVariants}>
          Real-time alerts · Smart feedback · Clean campus food flow
        </motion.p>
        <motion.div className="flex flex-col gap-4 sm:flex-row sm:justify-center" variants={itemVariants}>
          <Link href="/student" passHref>
            <Button size="lg" className="w-full bg-grubGreen-500 text-white hover:bg-grubGreen-600 sm:w-auto">
              I&apos;m a Student
            </Button>
          </Link>
          <Link href="/staff" passHref>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-grubGreen-500 text-grubGreen-500 hover:bg-grubGreen-50 hover:text-grubGreen-600 sm:w-auto bg-transparent"
            >
              I&apos;m Staff
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
