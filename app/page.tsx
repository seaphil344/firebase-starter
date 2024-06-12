'use client'
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import '@/styles/Home.css';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to My App</h1>
          <p className="text-lg text-gray-700">Your one-stop solution for everything.</p>
          <div className="mt-10">
            <Image
              src="/next.svg"
              alt="Next.js Logo"
              width={180}
              height={37}
              priority
              className="dark:invert"
            />
          </div>
        </div>
      </div>
      <footer className="w-full bg-gray-800 py-4">
        <div className="container mx-auto text-center text-white">
          <p>&copy; {new Date().getFullYear()} My App. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
