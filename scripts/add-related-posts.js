const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

class RelatedPostsGenerator {
  constructor() {
    this.componentsDir = path.join(process.cwd(), 'src/components');
    this.blogPagePath = path.join(process.cwd(), 'src/app/blog/[slug]/page.js');
  }

  generateRelatedPostsComponent() {
    const componentContent = `import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function generateExcerpt(content, maxLength = 150) {
  // Remove markdown formatting and get plain text
  const plainText = content
    .replace(/#{1,6}\\s+/g, '') // Remove headers
    .replace(/\\*\\*(.*?)\\*\\*/g, '$1') // Remove bold
    .replace(/\\*(.*?)\\*/g, '$1') // Remove italics
    .replace(/\\[(.*?)\\]\\(.*?\\)/g, '$1') // Remove links
    .replace(/\`(.*?)\`/g, '$1') // Remove inline code
    .replace(/\\n\\n/g, ' ') // Replace double newlines with space
    .replace(/\\n/g, ' ') // Replace single newlines with space
    .replace(/\\s+/g, ' ') // Replace multiple spaces with single space
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
        const filePath = path.join(process.cwd(), 'content/blog', \`\${post.slug}.mdx\`);
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
                  <Link href={\`/blog/\${post.slug}\`}>
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
          ))}
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error loading related posts:', error);
    return null;
  }
}`;

    return componentContent;
  }

  generateUpdatedBlogPage() {
    const blogPageContent = `import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Link from 'next/link';
import { CategoryBadge, TagBadge } from '../../../components/CategoryTag';
import RelatedPosts from '../../../components/RelatedPosts';

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
    .replace(/<\\/table>/g, '</table></div>')
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
    .replace(/<\\/code><\\/pre>/g, '</code></pre>')
    // Style inline code
    .replace(/<code>/g, '<code class="bg-gray-200 text-gray-900 px-2 py-1 rounded text-sm font-mono border">');

  return html;
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  
  try {
    const filePath = path.join(process.cwd(), 'content/blog', \`\${slug}.mdx\`);
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

            {/* Related Posts */}
            <RelatedPosts 
              currentSlug={slug} 
              categories={frontMatter.categories || []} 
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
}`;

    return blogPageContent;
  }

  generateFiles() {
    console.log('📝 Adding related posts functionality...');

    // Ensure components directory exists
    if (!fs.existsSync(this.componentsDir)) {
      fs.mkdirSync(this.componentsDir, { recursive: true });
    }

    // Generate RelatedPosts component
    const relatedPostsPath = path.join(this.componentsDir, 'RelatedPosts.js');
    fs.writeFileSync(relatedPostsPath, this.generateRelatedPostsComponent());
    console.log('✅ Generated RelatedPosts component');

    // Update blog post page
    fs.writeFileSync(this.blogPagePath, this.generateUpdatedBlogPage());
    console.log('✅ Updated blog post page with related posts');

    console.log('\n🎉 Related posts functionality added!');
    console.log('📁 Files created/updated:');
    console.log('   - src/components/RelatedPosts.js (new)');
    console.log('   - src/app/blog/[slug]/page.js (updated)');
    
    console.log('\n✨ Features added:');
    console.log('   - Shows 3-5 related posts from same categories');
    console.log('   - Auto-generated excerpts (120 characters)');
    console.log('   - Professional card design with hover effects');
    console.log('   - Category badges on each related post');
    console.log('   - "Read article" links with arrow animations');
    
    console.log('\n🚀 Next steps:');
    console.log('   1. npm run build');
    console.log('   2. git add .');
    console.log('   3. git commit -m "Add related posts with auto-generated excerpts"');
    console.log('   4. git push origin master');
  }
}

// Run the generator
const generator = new RelatedPostsGenerator();
generator.generateFiles();
