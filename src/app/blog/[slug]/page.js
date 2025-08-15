import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Link from 'next/link';
import { CategoryBadge, TagBadge } from '../../../components/CategoryTag';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'content/blog');
  
  try {
    const filenames = fs.readdirSync(postsDirectory);
    const mdxFiles = filenames.filter(name => name.endsWith('.mdx'));
    
    return mdxFiles.map((filename) => ({
      slug: filename.replace('.mdx', ''),
    }));
  } catch (error) {
    console.error('Error reading blog posts directory:', error);
    return [];
  }
}

function markdownToHtml(markdown) {
  marked.setOptions({
    gfm: true,
    breaks: true,
    tables: true
  });

  let html = marked(markdown);
  
  // Enhanced styling with better contrast and spacing
  html = html
    // Style unordered lists with proper bullets and indentation
    .replace(/<ul>/g, '<ul class="list-disc pl-8 mb-6 space-y-3">')
    // Style ordered lists
    .replace(/<ol>/g, '<ol class="list-decimal pl-8 mb-6 space-y-3">')
    // Style list items with better spacing
    .replace(/<li>/g, '<li class="text-gray-800 leading-relaxed">')
    // Style tables with professional appearance
    .replace(/<table>/g, '<div class="overflow-x-auto my-8 shadow-lg rounded-lg"><table class="min-w-full border-collapse bg-white">')
    .replace(/<\/table>/g, '</table></div>')
    // Style table headers
    .replace(/<thead>/g, '<thead class="bg-gray-800 text-white">')
    .replace(/<th>/g, '<th class="border border-gray-300 px-6 py-4 text-left font-bold uppercase tracking-wider">')
    // Style table body and cells
    .replace(/<tbody>/g, '<tbody>')
    .replace(/<td>/g, '<td class="border border-gray-300 px-6 py-4 text-gray-800">')
    // Style table rows with alternating colors
    .replace(/<tr>/g, '<tr class="even:bg-gray-50 hover:bg-blue-50 transition-colors">')
    // Style headings with better hierarchy
    .replace(/<h1>/g, '<h1 class="text-4xl font-bold mb-8 text-gray-900 border-b-4 border-blue-600 pb-4">')
    .replace(/<h2>/g, '<h2 class="text-3xl font-bold mb-6 mt-12 text-gray-900 border-b-2 border-gray-300 pb-2">')
    .replace(/<h3>/g, '<h3 class="text-2xl font-semibold mb-4 mt-8 text-gray-800">')
    .replace(/<h4>/g, '<h4 class="text-xl font-semibold mb-3 mt-6 text-gray-800">')
    // Style paragraphs with better readability
    .replace(/<p>/g, '<p class="mb-6 text-gray-800 leading-relaxed text-lg">')
    // Style blockquotes
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-blue-600 pl-6 py-4 mb-6 bg-blue-50 italic text-gray-800 rounded-r-lg">')
    // Style code blocks
    .replace(/<pre><code>/g, '<pre class="bg-gray-900 text-green-400 rounded-lg p-6 mb-6 overflow-x-auto shadow-inner"><code class="text-sm font-mono">')
    .replace(/<\/code><\/pre>/g, '</code></pre>')
    // Style inline code
    .replace(/<code>/g, '<code class="bg-gray-200 text-gray-900 px-2 py-1 rounded text-sm font-mono border">');

  return html;
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  
  try {
    const filePath = path.join(process.cwd(), 'content/blog', `${slug}.mdx`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontMatter, content } = matter(fileContents);
    const htmlContent = markdownToHtml(content);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <article className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            {/* Header with better styling */}
            <header className="mb-12 text-center">
              <h1 className="text-5xl font-bold mb-6 text-gray-900 leading-tight">
                {frontMatter.title}
              </h1>
              
              {frontMatter.date && (
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 100-2H6z" clipRule="evenodd"></path>
                  </svg>
                  {new Date(frontMatter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
              
              {/* Categories and Tags */}
              {(frontMatter.categories?.length > 0 || frontMatter.tags?.length > 0) && (
                <div className="mb-6">
                  {frontMatter.categories?.length > 0 && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-600 mr-2">Categories:</span>
                      {frontMatter.categories.map(categorySlug => (
                        <CategoryBadge 
                          key={categorySlug} 
                          category={{ 
                            slug: categorySlug, 
                            name: categorySlug.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') 
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {frontMatter.tags?.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-600 mr-2">Tags:</span>
                      {frontMatter.tags.map(tagSlug => (
                        <TagBadge 
                          key={tagSlug} 
                          tag={{ 
                            slug: tagSlug, 
                            name: tagSlug.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') 
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {frontMatter.excerpt && (
                <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  {frontMatter.excerpt}
                </p>
              )}
            </header>
            
            {/* Content with enhanced styling */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </article>
          
          {/* Back to blog link */}
          <div className="mt-12 text-center">
            <Link 
              href="/blog" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The requested blog post could not be found.</p>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }
}
