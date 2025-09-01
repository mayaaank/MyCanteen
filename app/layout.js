'use client'

import { usePathname } from 'next/navigation'


import './globals.css'

export default function RootLayout({ children }) {
  const pathname = usePathname()

  // Routes where BottomNavbar should be hidden
  const hideOnRoutes = [
    '/',
    '/login',
    '/signup',
    '/admin/dashboard',
    '/admin/create-user',
    '/unauthorized'
  ]

  const showBottomBar = !hideOnRoutes.includes(pathname)

  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col">
        <main className="flex-grow pb-20">{children}</main>
        
      </body>
    </html>
  )
}
