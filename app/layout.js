
'use client'

import BottomNavbar from '@/components/BottomNavbar'
import Navbar from '@/components/Navbar'
import { useEffect } from 'react'
import { initializeAdmin } from '../utils/initializeAdmin'
import './globals.css'


export default function RootLayout({ children }) {
  useEffect(() => {
    // Initialize default admin on app start
    initializeAdmin()
  }, [])

  return (
   <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pb-20">{children}</main> {/* 👈 padding-bottom added */}
        <BottomNavbar />
      </body>
    </html>
  )
}