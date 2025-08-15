import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            📷 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PhotoSymphony</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Master the art of panoramic photography with expert techniques, in-depth tutorials, and cutting-edge industry insights
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link 
            href="/blog"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform transition hover:scale-105 text-center"
          >
            📚 Explore Articles
          </Link>
          
          <Link 
            href="/about"
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform transition hover:scale-105 text-center"
          >
            👋 About Us
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="text-4xl mb-4">🌅</div>
            <h3 className="font-bold text-xl text-gray-900 mb-3">Panoramic Mastery</h3>
            <p className="text-gray-600">Learn professional techniques for capturing breathtaking wide-format images</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-bold text-xl text-gray-900 mb-3">Expert Tutorials</h3>
            <p className="text-gray-600">Step-by-step guides from equipment selection to post-processing</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="font-bold text-xl text-gray-900 mb-3">Latest Trends</h3>
            <p className="text-gray-600">Stay ahead with emerging technologies and industry innovations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
