import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">📸</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PhotoSymphony</h1>
              <p className="text-sm text-gray-600">Panoramic Photography</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contact
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center">
                Categories
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4">
                  <Link href="/category/panoramic-photography-techniques" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors">
                    📸 Photography Techniques
                  </Link>
                  <Link href="/category/panoramic-applications" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors">
                    🎯 Applications
                  </Link>
                  <Link href="/category/panoramic-post-processing" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors">
                    🎨 Post-Processing
                  </Link>
                  <Link href="/category/panoramic-camera-gear" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors">
                    📷 Camera Gear
                  </Link>
                  <Link href="/category/panoramic-history-and-culture" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors">
                    📚 History & Culture
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-700 hover:text-blue-600 py-2">Home</Link>
              <Link href="/blog" className="text-gray-700 hover:text-blue-600 py-2">Blog</Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 py-2">About</Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 py-2">Contact</Link>
              <div className="border-t pt-3 mt-3">
                <p className="text-sm font-medium text-gray-500 mb-2">Categories</p>
                <Link href="/category/panoramic-photography-techniques" className="block text-gray-600 hover:text-blue-600 py-1">📸 Photography Techniques</Link>
                <Link href="/category/panoramic-applications" className="block text-gray-600 hover:text-blue-600 py-1">🎯 Applications</Link>
                <Link href="/category/panoramic-post-processing" className="block text-gray-600 hover:text-blue-600 py-1">🎨 Post-Processing</Link>
                <Link href="/category/panoramic-camera-gear" className="block text-gray-600 hover:text-blue-600 py-1">📷 Camera Gear</Link>
                <Link href="/category/panoramic-history-and-culture" className="block text-gray-600 hover:text-blue-600 py-1">📚 History & Culture</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}