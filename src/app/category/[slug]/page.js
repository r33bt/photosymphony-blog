import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export async function generateStaticParams() {
  const categoriesData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/categories.json'), 'utf8')
  );
  
  return categoriesData.categories.map(category => ({
    slug: category.slug
  }));
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  
  try {
    // Load categories and post mappings
    const categoriesData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data/categories.json'), 'utf8')
    );
    const postTaxonomies = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data/post-taxonomies.json'), 'utf8')
    );
    
    const category = categoriesData.categories.find(c => c.slug === slug);
    const categoryPosts = postTaxonomies.posts.filter(post => 
      post.categories.includes(slug)
    );
    
    if (!category) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-6">The requested category could not be found.</p>
            <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium">
              Return to Blog
            </Link>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <nav className="mb-4">
              <Link href="/blog" className="text-blue-600 hover:text-blue-800">
                ← Back to Blog
              </Link>
            </nav>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              📁 {category.name}
            </h1>
            <p className="text-gray-600">
              {category.count} post{category.count !== 1 ? 's' : ''} in this category
            </p>
          </div>
          
          <div className="grid gap-6">
            {categoryPosts.map(post => (
              <article key={post.slug} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                <h2 className="text-2xl font-bold mb-3">
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    <span className="text-sm text-gray-500 mr-2">Tags:</span>
                    {post.tags.slice(0, 5).map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200 transition-colors"
                      >
                        🏷️ {tag.replace(/-/g, ' ')}
                      </span>
                    ))}
                    {post.tags.length > 5 && (
                      <span className="text-xs text-gray-400">
                        +{post.tags.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
          
          {categoryPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts found in this category.</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Category</h1>
          <p className="text-gray-600 mb-6">There was an error loading this category.</p>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }
}
