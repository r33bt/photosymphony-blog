import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function generateExcerpt(content, maxLength = 140) {
  const plainText = content
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\n\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
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
      const filePath = path.join(process.cwd(), 'content/blog', `${post.slug}.mdx`);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { content } = matter(fileContents);
      excerpt = generateExcerpt(content, size === 'large' ? 180 : 140);
    } catch {
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
          <Link href={`/blog/${post.slug}`}>
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
                href={`/category/${categorySlug}`}
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
  );
}