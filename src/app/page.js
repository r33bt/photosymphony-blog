import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import PostCard from '../components/PostCard';

function loadPostsData() {
  try {
    // Load categories and post taxonomies
    const categoriesData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data/categories.json'), 'utf8')
    );
    const postTaxonomies = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data/post-taxonomies.json'), 'utf8')
    );

    // Get top categories by post count
    const topCategories = categoriesData.categories
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    // Get posts with full metadata for each category
    const categorizedPosts = {};
    
    topCategories.forEach(category => {
      const categoryPosts = postTaxonomies.posts
        .filter(post => post.categories.includes(category.slug))
        .slice(0, 3); // Top 3 posts per category
      
      categorizedPosts[category.slug] = {
        category: category,
        posts: categoryPosts
      };
    });

    // Get latest posts overall
    const latestPosts = postTaxonomies.posts
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 6);

    return { categorizedPosts, latestPosts, totalPosts: postTaxonomies.posts.length };
  } catch (error) {
    console.error('Error loading posts data:', error);
    return { categorizedPosts: {}, latestPosts: [], totalPosts: 0 };
  }
}

export default function HomePage() {
  const { categorizedPosts, latestPosts, totalPosts } = loadPostsData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📸</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              PhotoSymphony
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Master the art of panoramic photography with expert techniques, in-depth tutorials, and cutting-edge industry insights
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/blog"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg inline-flex items-center justify-center"
            >
              📚 Explore Articles
            </Link>
            <Link 
              href="/about"
              className="px-8 py-4 bg-blue-500 bg-opacity-20 text-white rounded-lg font-semibold hover:bg-opacity-30 transition-colors border border-white border-opacity-20 inline-flex items-center justify-center"
            >
              👋 About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Panoramic Mastery</h3>
              <p className="text-gray-600">Learn professional techniques for capturing breathtaking wide-format images</p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Tutorials</h3>
              <p className="text-gray-600">Step-by-step guides from equipment selection to post-processing</p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Latest Trends</h3>
              <p className="text-gray-600">Stay ahead with emerging technologies and industry innovations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Articles</h2>
            <p className="text-xl text-gray-600">Fresh insights and techniques from our photography experts</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {latestPosts.slice(0, 6).map(post => (
              <PostCard key={post.slug} post={post} size="default" />
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href="/blog"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              View All {totalPosts} Articles
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Posts by Category */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore by Category</h2>
            <p className="text-xl text-gray-600">Dive deep into specific areas of panoramic photography</p>
          </div>
          
          {Object.entries(categorizedPosts).map(([categorySlug, data]) => (
            <div key={categorySlug} className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    📁 {data.category.name}
                  </h3>
                  <p className="text-gray-600">{data.category.count} articles in this category</p>
                </div>
                <Link 
                  href={`/category/${categorySlug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  View all
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.posts.map(post => (
                  <PostCard key={post.slug} post={post} size="default" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}