const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function auditMigration() {
  console.log('🔍 Starting Migration Audit...\n');
  
  // Check blog posts
  const blogDir = path.join(process.cwd(), 'content/blog');
  const pagesDir = path.join(process.cwd(), 'content/pages');
  
  let blogPosts = [];
  let pages = [];
  let errors = [];
  
  try {
    // Audit blog posts
    if (fs.existsSync(blogDir)) {
      const blogFiles = fs.readdirSync(blogDir);
      console.log(`📁 Found ${blogFiles.length} files in content/blog/`);
      
      blogFiles.forEach(file => {
        if (file.endsWith('.mdx')) {
          try {
            const filePath = path.join(blogDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const { data: frontMatter } = matter(content);
            
            blogPosts.push({
              file: file,
              slug: file.replace('.mdx', ''),
              title: frontMatter.title || 'NO TITLE',
              date: frontMatter.date || 'NO DATE',
              status: frontMatter.status || 'NO STATUS'
            });
          } catch (error) {
            errors.push(`❌ Error reading ${file}: ${error.message}`);
          }
        }
      });
    }
    
    // Audit pages
    if (fs.existsSync(pagesDir)) {
      const pageFiles = fs.readdirSync(pagesDir);
      console.log(`📄 Found ${pageFiles.length} files in content/pages/`);
      
      pageFiles.forEach(file => {
        if (file.endsWith('.mdx')) {
          try {
            const filePath = path.join(pagesDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const { data: frontMatter } = matter(content);
            
            pages.push({
              file: file,
              slug: file.replace('.mdx', ''),
              title: frontMatter.title || 'NO TITLE',
              date: frontMatter.date || 'NO DATE',
              status: frontMatter.status || 'NO STATUS'
            });
          } catch (error) {
            errors.push(`❌ Error reading ${file}: ${error.message}`);
          }
        }
      });
    }
    
    // Display results
    console.log('\n📊 MIGRATION AUDIT RESULTS');
    console.log('=' .repeat(50));
    console.log(`✅ Blog Posts: ${blogPosts.length}`);
    console.log(`✅ Pages: ${pages.length}`);
    console.log(`📝 Total Content: ${blogPosts.length + pages.length}`);
    console.log(`❌ Errors: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n🚨 ERRORS FOUND:');
      errors.forEach(error => console.log(error));
    }
    
    // Check for missing titles or dates
    const missingTitles = [...blogPosts, ...pages].filter(item => item.title === 'NO TITLE');
    const missingDates = [...blogPosts, ...pages].filter(item => item.date === 'NO DATE');
    
    if (missingTitles.length > 0) {
      console.log('\n⚠️  FILES MISSING TITLES:');
      missingTitles.forEach(item => console.log(`   - ${item.file}`));
    }
    
    if (missingDates.length > 0) {
      console.log('\n⚠️  FILES MISSING DATES:');
      missingDates.forEach(item => console.log(`   - ${item.file}`));
    }
    
    // Sample of blog posts for verification
    console.log('\n📋 SAMPLE BLOG POSTS:');
    blogPosts.slice(0, 5).forEach(post => {
      console.log(`   📖 ${post.title} (${post.date}) → /blog/${post.slug}`);
    });
    
    if (blogPosts.length > 5) {
      console.log(`   ... and ${blogPosts.length - 5} more posts`);
    }
    
    // Sample of pages
    if (pages.length > 0) {
      console.log('\n📋 PAGES:');
      pages.forEach(page => {
        console.log(`   📄 ${page.title} → /${page.slug}`);
      });
    }
    
    console.log('\n🎯 PRE-DEPLOYMENT CHECKLIST:');
    console.log(`   ${blogPosts.length > 0 ? '✅' : '❌'} Blog posts migrated`);
    console.log(`   ${pages.length > 0 ? '✅' : '❌'} Pages migrated`);
    console.log(`   ${errors.length === 0 ? '✅' : '❌'} No file errors`);
    console.log(`   ${missingTitles.length === 0 ? '✅' : '❌'} All files have titles`);
    console.log(`   ${missingDates.length === 0 ? '✅' : '❌'} All files have dates`);
    
    const isReady = blogPosts.length > 0 && errors.length === 0;
    console.log(`\n🚀 Ready for Vercel deployment: ${isReady ? 'YES' : 'NO'}`);
    
    return {
      blogPosts: blogPosts.length,
      pages: pages.length,
      errors: errors.length,
      ready: isReady
    };
    
  } catch (error) {
    console.error('❌ Audit failed:', error);
    return null;
  }
}

// Run the audit
auditMigration();
