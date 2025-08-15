const fs = require('fs');
const path = require('path');

class HomepageBlogEnhancer {
  constructor() {
    this.componentsDir = path.join(process.cwd(), 'src/components');
    this.homePagePath = path.join(process.cwd(), 'src/app/page.js');
    this.blogIndexPath = path.join(process.cwd(), 'src/app/blog/page.js');
  }

  generatePostCard() {
    const componentContent = `import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function generateExcerpt(content, maxLength = 140) {
  const plainText = content
    .replace(/#{1,6}\\s+/g, '')
    .replace(/\\*\\*(.*?)\\*\\*/g, '$1')
    .replace(/\\*(.*?)\\*/g, '$1')
    .replace(/\\[(.*?)\\]\\(.*?\\)/g, '$1')
    .replace(/\`(.*?)\`/g, '$1')
    .replace(/\\n\\n/g, ' ')
    .replace(/\\n/g, ' ')
    .replace(/\\s+/g, ' ')
    .trim();

  if (plainText.length <= maxLength) return plainText;
  
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}

export default function PostCard({ post, showExcerpt = true, size = 'default' }) {
  let excerpt = '';
  
  if (showExcerpt) {
    try {
      const filePath = path.join(process.cwd(), 'content/blog', \`\${post.slug}.mdx\`);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { content } = matter(fileContents);
      excerpt = generateExcerpt(content, size === 'large' ? 180 : 140);
    } catch (error) {
      excerpt = 'Discover expert techniques and insights for panoramic photography.';
    }
  }

  const cardClasses = size === 'large' 
    ? 'bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100'
    : 'bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100';

  const titleClasses = size === 'large'
    ? 'text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2'
    : 'text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2';

  return (
    <article className={cardClasses}>
      <div className={size === 'large' ? 'p-8' : 'p-6'}>
        {/* Date */}
        {post.date && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 100-2H6z" clipRule="evenodd"></path>
            </svg>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        )}

        {/* Title */}
        <h3 className={titleClasses}>
          <Link href={\`/blog/\${post.slug}\`}>
            {post.title}
          </Link>
        </h3>
        
        {/* Excerpt */}
        {showExcerpt && excerpt && (
          <p className="text-gray-600 leading-relaxed mb-4 text-sm">
            {excerpt}
          </p>
        )}
        
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.slice(0, 2).map(categorySlug => (
              <Link
                key={categorySlug}
                href={\`/category/\${categorySlug}\`}
                className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium hover:bg-blue-100 transition-colors"
              >
                📁 {categorySlug.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Link>
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 4).map(tagSlug => (
              <span 
                key={tagSlug}
                className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded font-medium"
              >
                🏷️ {tagSlug.replace(/-/g, ' ')}
              </span>
            ))}
            {post.tags.length > 4 && (
              <span className="text-xs text-gray-400 px-2 py-1">
                +{post.tags.length - 4} more
              </span>
            )}
          </div>
        )}
        
        {/* Read More Link */}
        <Link 
          href={\`/blog/\${post.slug}\`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          Read article
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </article>
  );
}`;

    return componentContent;
  }

  generateHomePage() {
    const homePageContent = `import fs from 'fs';
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
                  href={\`/category/\${categorySlug}\`}
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
}`;

    return homePageContent;
  }

  generateBlogIndex() {
    const blogIndexContent = `import fs from 'fs';
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
                href={\`/category/\${category.slug}\`}
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
              <p className="text-gray-600 mb-8">We're working on adding great content. Check back soon!</p>
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
}`;

    return blogIndexContent;
  }

  generateFiles() {
    console.log('🎨 Enhancing homepage and blog index...');

    // Ensure components directory exists
    if (!fs.existsSync(this.componentsDir)) {
      fs.mkdirSync(this.componentsDir, { recursive: true });
    }

    // Generate PostCard component
    const postCardPath = path.join(this.componentsDir, 'PostCard.js');
    fs.writeFileSync(postCardPath, this.generatePostCard());
    console.log('✅ Generated PostCard component');

    // Generate HomePage
    fs.writeFileSync(this.homePagePath, this.generateHomePage());
    console.log('✅ Updated homepage');

    // Generate Blog Index
    fs.writeFileSync(this.blogIndexPath, this.generateBlogIndex());
    console.log('✅ Updated blog index');

    console.log('\n🎉 Homepage and blog enhancement complete!');
    console.log('📁 Files created/updated:');
    console.log('   - src/components/PostCard.js (new reusable component)');
    console.log('   - src/app/page.js (enhanced homepage)');
    console.log('   - src/app/blog/page.js (enhanced blog index)');
    
    console.log('\n✨ Features added:');
    console.log('   - Professional homepage with hero section');
    console.log('   - Posts organized by top categories (3 per category)');
    console.log('   - Latest articles section');
    console.log('   - Enhanced blog index with featured post');
    console.log('   - Rich post cards with excerpts, categories, and tags');
    console.log('   - Responsive design for all screen sizes');
    console.log('   - Reusable components for future migrations');
    
    console.log('\n🚀 Next steps:');
    console.log('   1. npm run build');
    console.log('   2. git add .');
    console.log('   3. git commit -m "Enhance homepage and blog with rich content display"');
    console.log('   4. git push origin master');
  }
}

// Run the enhancer
const enhancer = new HomepageBlogEnhancer();
enhancer.generateFiles();
