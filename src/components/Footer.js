import Link from 'next/link';

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
}