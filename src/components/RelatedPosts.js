import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function generateExcerpt(content, maxLength = 150) {
  // Remove markdown formatting and get plain text
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italics
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\n\n/g, ' ') // Replace double newlines with space
    .replace(/\n/g, ' ') // Replace single newlines with space
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Find the last complete sentence within the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );

  if (lastSentenceEnd > maxLength * 0.6) {
    return truncated.substring(0, lastSentenceEnd + 1);
  }

  // If no good sentence break, find last word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}

export default function RelatedPosts({ currentSlug, categories }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  try {
    // Load post taxonomies
    const postTaxonomies = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data/post-taxonomies.json'), 'utf8')
    );

    // Find posts in the same categories
    const relatedPosts = postTaxonomies.posts
      .filter(post => {
        // Exclude current post
        if (post.slug === currentSlug) return false;
        
        // Check if post shares any categories
        return post.categories.some(cat => categories.includes(cat));
      })
      .slice(0, 5); // Limit to 5 related posts

    if (relatedPosts.length === 0) {
      return null;
    }

    // Get excerpts for each related post
    const postsWithExcerpts = relatedPosts.map(post => {
      try {
        const filePath = path.join(process.cwd(), 'content/blog', `${post.slug}.mdx`);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { content } = matter(fileContents);
        
        return {
          ...post,
          excerpt: generateExcerpt(content, 120)
        };
      } catch (error) {
        return {
          ...post,
          excerpt: 'Discover expert techniques and insights for panoramic photography.'
        };
      }
    });

    return (
      <section className="mt-16 pt-12 border-t border-gray-200">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Related Articles</h2>
          <p className="text-gray-600">More insights on panoramic photography techniques</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsWithExcerpts.map(post => (
            <article key={post.slug} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.categories.slice(0, 2).map(categorySlug => (
                      <span 
                        key={categorySlug}
                        className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded font-medium"
                      >
                        {categorySlug.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                    ))}
                  </div>
                )}
                
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  Read article
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error loading related posts:', error);
    return null;
  }
}