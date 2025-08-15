import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import PostCard from '../../components/PostCard';

function loadAllPosts() {
  try {
    const postTaxonomies = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data/post-taxonomies.json'), 'utf8')
    );
    
    const categoriesData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data/categories.json'), 'utf8')
    );

    // Sort posts by date (newest first)
    const sortedPosts = postTaxonomies.posts.sort((a, b) => 
      new Date(b.date || 0) - new Date(a.date || 0)
    );

    return { 
      posts: sortedPosts, 
      categories: categoriesData.categories 
    };
  } catch (error) {
    console.error('Error loading posts:', error);
    return { posts: [], categories: [] };
  }
}

export default function BlogIndex() {
  const { posts, categories } = loadAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center text-blue-100 hover:text-white transition-colors mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
              </svg>
              Back to Home
            </Link>
          </div>
          
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📸</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Photography Blog</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover expert insights, techniques, and inspiration for panoramic photography
          </p>
          
          <div className="mt-8 text-blue-100">
            <span className="text-lg font-medium">{posts.length} Articles</span>
            <span className="mx-3">•</span>
            <span className="text-lg font-medium">{categories.length} Categories</span>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-gray-600 font-medium">Browse by category:</span>
            <Link 
              href="/blog"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              All Articles
            </Link>
            {categories.slice(0, 5).map(category => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                📁 {category.name} ({category.count})
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl text-gray-400">📝</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Articles Found</h2>
              <p className="text-gray-600 mb-8">We&apos;re working on adding great content. Check back soon!</p>
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {posts.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>
                  <div className="max-w-4xl">
                    <PostCard post={posts[0]} size="large" />
                  </div>
                </div>
              )}

              {/* All Posts */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">All Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.slice(1).map(post => (
                    <PostCard key={post.slug} post={post} size="default" />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
