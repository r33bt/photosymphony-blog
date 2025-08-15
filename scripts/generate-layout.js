const fs = require('fs');
const path = require('path');

class LayoutGenerator {
  constructor() {
    this.componentsDir = path.join(process.cwd(), 'src/components');
    this.appDir = path.join(process.cwd(), 'src/app');
  }

  ensureDirectories() {
    if (!fs.existsSync(this.componentsDir)) {
      fs.mkdirSync(this.componentsDir, { recursive: true });
    }
  }

  generateHeader() {
    const headerContent = `import Link from 'next/link';
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
}`;

    return headerContent;
  }

  generateFooter() {
    const footerContent = `import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Site Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📸</span>
              </div>
              <h3 className="text-xl font-bold">PhotoSymphony</h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Your ultimate resource for panoramic photography techniques, gear reviews, and creative inspiration.
            </p>
            <p className="text-gray-400 text-sm">
              From beginner tutorials to advanced post-processing workflows, we help photographers capture the world in stunning wide-format imagery.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Pages</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/blog" className="block text-gray-300 hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/about" className="block text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/quick-guide-to-panoramic-cameras-in-2024" className="block text-gray-300 hover:text-white transition-colors">
                Camera Guide 2024
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Categories</h3>
            <div className="space-y-2">
              <Link href="/category/panoramic-photography-techniques" className="block text-gray-300 hover:text-white transition-colors">
                📸 Photography Techniques
              </Link>
              <Link href="/category/panoramic-applications" className="block text-gray-300 hover:text-white transition-colors">
                🎯 Applications
              </Link>
              <Link href="/category/panoramic-post-processing" className="block text-gray-300 hover:text-white transition-colors">
                🎨 Post-Processing
              </Link>
              <Link href="/category/panoramic-camera-gear" className="block text-gray-300 hover:text-white transition-colors">
                📷 Camera Gear
              </Link>
              <Link href="/category/panoramic-history-and-culture" className="block text-gray-300 hover:text-white transition-colors">
                📚 History & Culture
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} PhotoSymphony. All rights reserved. | 
            <span className="ml-2">Capturing the world in panoramic perfection.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}`;

    return footerContent;
  }

  generateUpdatedLayout() {
    const layoutContent = `'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>PhotoSymphony - Panoramic Photography Blog</title>
        <meta name="description" content="Master panoramic photography with expert techniques, gear reviews, and creative inspiration. From beginner tutorials to advanced workflows." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}`;

    return layoutContent;
  }

  generateFiles() {
    console.log('🎨 Generating complete site layout...');
    
    this.ensureDirectories();

    // Generate Header component
    const headerPath = path.join(this.componentsDir, 'Header.js');
    fs.writeFileSync(headerPath, this.generateHeader());
    console.log('✅ Generated Header component');

    // Generate Footer component
    const footerPath = path.join(this.componentsDir, 'Footer.js');
    fs.writeFileSync(footerPath, this.generateFooter());
    console.log('✅ Generated Footer component');

    // Update layout
    const layoutPath = path.join(this.appDir, 'layout.tsx');
    fs.writeFileSync(layoutPath, this.generateUpdatedLayout());
    console.log('✅ Updated layout.tsx');

    console.log('\n🎉 Layout generation complete!');
    console.log('📁 Files created:');
    console.log('   - src/components/Header.js');
    console.log('   - src/components/Footer.js');
    console.log('   - src/app/layout.tsx (updated)');
    
    console.log('\n🚀 Next steps:');
    console.log('   1. npm run build');
    console.log('   2. git add .');
    console.log('   3. git commit -m "Add complete header and footer layout"');
    console.log('   4. git push origin master');
  }
}

// Run the generator
const generator = new LayoutGenerator();
generator.generateFiles();
