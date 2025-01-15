'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Lost and Found System</h1>
              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
                <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                  <li><Link href="/" className="hover:underline">Home</Link></li>
                  <li><Link href="/register" className="hover:underline">Register</Link></li>
                  <li><Link href="/report-found" className="hover:underline">Report Found</Link></li>
                  <li><Link href="/admin" className="hover:underline">Admin Dashboard</Link></li>
                </ul>
              </nav>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-gray-200 text-center py-4 mt-8">
            <p>&copy; 2023 Lost and Found System. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  )
}

