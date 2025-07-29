'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import BottomNavbar from '@/components/BottomNavbar'
import { initializeAdmin } from '../utils/initializeAdmin'
import './globals.css'

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const [showBottomBar, setShowBottomBar] = useState(false)

  useEffect(() => {
    initializeAdmin()

    const user = JSON.parse(localStorage.getItem('currentUser'))

    // List of routes where you DO NOT want to show bottom bar
    const hideOnRoutes = ['/', '/login', '/signup', '/admin/dashboard', '/admin/create-user']

    // Show bottom bar only if user exists and current route is not in the restricted list
    if (user && !hideOnRoutes.includes(pathname)) {
      setShowBottomBar(true)
    } else {
      setShowBottomBar(false)
    }
  }, [pathname]) // re-run on route change

  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col">
        <main className="flex-grow pb-20">{children}</main>

        {/* Show BottomNavbar only when allowed */}
        {showBottomBar && <BottomNavbar />}
      </body>
    </html>
  )
}
