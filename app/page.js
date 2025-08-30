'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
const supabase = createClientComponentClient()



const heroImages = [
  '/canteen-1.jpg',
  '/canteen-2.jpg',
  '/canteen-3.jpg',
]

const developers = [
  { 
    name: 'Mayank', 
    role: 'Backend Developer', 
    image: '/developer1.jpg', // Add these images to your public folder
    description: 'Specializes in server architecture and database optimization. Built the core API for mycanteen.'
  },
  { 
    name: 'Vinit', 
    role: 'Full Stack Developer', 
    image: '/developer2.jpg',
    description: 'Crafted the user interface with React and Next.js. Focused on creating seamless user experiences.'
  },
  { 
    name: 'Kanak', 
    role: 'Full Stack Developer ', 
    image: '/developer4.jpg',
    description: 'Designed the visual identity and user flows. Ensures accessibility and intuitive navigation.'
  },
  { 
    name: 'Vaishnavi', 
    role: 'UI/UX Designer', 
    image: '/developer3.jpg',
    description: 'Bridges frontend and backend systems. Implements features across the entire stack.'
  }
]

export default function LandingPage() {
  const router = useRouter()
  const [imgIdx, setImgIdx] = useState(0)
  const [showDevelopers, setShowDevelopers] = useState(false)

  // ✅ Session check for redirect
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      
    }
    
  }, [router])

  // Slideshow logic
  useEffect(() => {
    const interval = setInterval(() => {
      setImgIdx((idx) => (idx + 1) % heroImages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen flex flex-col bg-white text-gray-900 pt-16 relative">
      {/* Developers Overlay */}
       {showDevelopers && (
        <div className="fixed inset-0 z-40 bg-white-800/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-6xl w-full bg-white rounded-xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-blue-700 text-white sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Our Development Team</h2>
                <button 
                  onClick={() => setShowDevelopers(false)}
                  className="text-white hover:text-blue-200 text-2xl transition"
                >
                  ✕
                </button>
              </div>
              <p className="text-blue-100 mt-1">The talented people behind mycanteen</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
              {developers.map((dev, index) => (
                <div key={index} className="group perspective">
                  <div className="relative w-full h-64 transition-all duration-500 preserve-3d group-hover:rotate-y-180">
                    {/* Front of Card */}
                    <div className="absolute backface-hidden w-full h-full bg-blue-50 rounded-xl overflow-hidden shadow-md border border-blue-100 flex flex-col items-center justify-center p-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 mb-4">
                        <Image
  src={dev.image}
  alt={dev.name}
  className="w-full h-full object-cover"
  width={500}         // or any default fallback
  height={500}        // required unless you use `fill`
  unoptimized         // optional if your images are external and not whitelisted
/>

                      </div>
                      <h3 className="text-xl font-bold text-blue-800">{dev.name}</h3>
                      <p className="text-blue-600">{dev.role}</p>
                    </div>
                    
                    {/* Back of Card */}
                    <div className="absolute w-full h-full bg-white rounded-xl overflow-hidden shadow-md border border-blue-200 rotate-y-180 backface-hidden p-6 flex flex-col">
                      <h3 className="text-xl font-bold text-blue-800 mb-2">{dev.name}</h3>
                      <p className="text-blue-600 font-medium mb-4">{dev.role}</p>
                      <p className="text-gray-700 text-sm flex-grow">{dev.description}</p>
                      <div className="w-10 h-1 bg-blue-200 mx-auto my-3"></div>
                      <button className="mt-auto text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-center">
              <button
                onClick={() => setShowDevelopers(false)}
                className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className={`w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-center md:justify-between px-6 py-10 bg-gradient-to-b from-white to-blue-50 gap-10 transition-all duration-300 ${showDevelopers ? 'blur-sm' : ''}`}>
        {/* Left column: Motto and CTA */}
        <div className="flex-1 flex flex-col items-start justify-center max-w-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-800">
            Eat Together, Live Better!
          </h1>
          <p className="mb-6 text-gray-700 text-lg md:text-xl">
            mycanteen brings everyone to the table. Enjoy seamless meal tracking and community dining every day.
          </p>
         <button
  onClick={async () => {
    const { data } = await supabase.auth.getSession()
    const session = data.session
    if (session) {
      const role = session.user?.user_metadata?.role
      if (role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/user/dashboard')
      }
    } else {
      router.push('/login')
    }
  }}
  className="bg-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow hover:bg-blue-800 transition"
>
  Get Started
</button>

        </div>

        {/* Right column: Larger Slideshow */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="relative w-[390px] h-[265px] md:w-[520px] md:h-[350px] rounded-2xl overflow-hidden shadow-2xl">
            {heroImages.map((src, i) => (
             <Image
  key={src}
  src={src}
  alt={`Canteen scene ${i + 1}`}
  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 rounded-2xl ${
    i === imgIdx ? 'opacity-100 z-10' : 'opacity-0'
  }`}
  fill
  sizes="100vw"
/>

            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className={`max-w-4xl mx-auto px-6 py-14 space-y-12 text-center transition-all duration-300 ${showDevelopers ? 'blur-sm' : ''}`}>
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-3">What We Have</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Offer a seamless QR-based attendance system, dynamic daily menus, and smart notifications for students and staff.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-3">What We Are Doing</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Streamlining canteen operations by providing real-time attendance tracking, meal planning, and automated billing reminders.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-3">What We Aim For</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            To empower institutes with efficient food management solutions that reduce waste, save staff time, and enhance user experience.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={`bg-gray-100 py-6 text-center text-gray-600 text-sm transition-all duration-300 ${showDevelopers ? 'blur-sm' : ''}`}>
        © {new Date().getFullYear()} mycanteen | Built for students & staff
        <button 
          onClick={() => setShowDevelopers(true)}
          className="ml-4 text-blue-600 hover:underline hover:text-blue-800 transition"
        >
          Meet Our Developers
        </button>
      </footer>

      {/* Add these styles to your global CSS */}
      <style jsx global>{`
        .perspective {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </main>
  )
}