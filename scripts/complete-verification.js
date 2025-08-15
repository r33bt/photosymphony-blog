const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const xml2js = require('xml2js');

// Auto-find the most recent XML export
function findLatestXML() {
  const exportDir = path.join(process.cwd(), '..', 'wp-export');
  if (!fs.existsSync(exportDir)) {
    throw new Error('wp-export directory not found. Run automated export first.');
  }
  
  const xmlFiles = fs.readdirSync(exportDir)
    .filter(f => f.endsWith('.xml'))
    .map(f => ({
      name: f,
      path: path.join(exportDir, f),
      time: fs.statSync(path.join(exportDir, f)).mtime
    }))
    .sort((a, b) => b.time - a.time);
  
  if (xmlFiles.length === 0) {
    throw new Error('No XML files found in wp-export directory');
  }
  
  console.log(`📄 Using XML: ${xmlFiles[0].name}`);
  return xmlFiles[0].path;
}

async function completeVerification() {
  console.log('🔍 COMPLETE MIGRATION VERIFICATION');
  console.log('=' .repeat(60));
  
  const results = {
    timestamp: new Date().toISOString(),
    original: { posts: 0, pages: 0, total: 0 },
    migrated: { posts: 0, pages: 0, total: 0 },
    missing: [],
    extra: [],
    urlMismatches: [],
    errors: []
  };

  try {
    // 1. Parse original WordPress XML
    console.log('📄 Reading original WordPress XML export...');
    
    let xmlPath;
    try {
      xmlPath = findLatestXML();
    } catch (error) {
      console.log('❌ Auto-detection failed, trying manual path...');
      xmlPath = path.join(process.cwd(), '..', 'wp-export', 'photosymphony-export.xml');
      
      if (!fs.existsSync(xmlPath)) {
        console.log('❌ WordPress XML file not found at:', xmlPath);
        console.log('🔍 Looking for XML files in parent directory...');
        const parentDir = path.join(process.cwd(), '..');
        const files = fs.readdirSync(parentDir);
        const xmlFiles = files.filter(f => f.endsWith('.xml'));
        if (xmlFiles.length > 0) {
          console.log('📁 Found XML files:', xmlFiles);
          console.log('💡 Please run the automated export script first');
        }
        return;
      }
    }
    
    const xmlData = fs.readFileSync(xmlPath, 'utf8');
    const parser = new xml2js.Parser();
    const parsed = await parser.parseStringPromise(xmlData);
    
    const items = parsed.rss.channel[0].item || [];
    console.log(`📊 Original WordPress items found: ${items.length}`);
    
    // Parse original posts and pages
    const originalPosts = [];
    const originalPages = [];
    
    items.forEach(item => {
      const postType = item['wp:post_type'] ? item['wp:post_type'][0] : '';
      const status = item['wp:status'] ? item['wp:status'][0] : '';
      const title = item.title ? item.title[0] : '';
      const slug = item['wp:post_name'] ? item['wp:post_name'][0] : '';
      
      if (status === 'publish' && title && slug) {
        const itemData = {
          title: title,
          slug: slug,
          type: postType,
          date: item.pubDate ? item.pubDate[0] : '',
          id: item['wp:post_id'] ? item['wp:post_id'][0] : ''
        };
        
        if (postType === 'post') {
          originalPosts.push(itemData);
        } else if (postType === 'page') {
          originalPages.push(itemData);
        }
      }
    });
    
    results.original.posts = originalPosts.length;
    results.original.pages = originalPages.length;
    results.original.total = originalPosts.length + originalPages.length;
    
    console.log(`📝 Original Posts: ${originalPosts.length}`);
    console.log(`📄 Original Pages: ${originalPages.length}`);
    console.log(`📊 Original Total: ${results.original.total}`);
    
    // 2. Check migrated content
    console.log('\n🔍 Checking migrated content...');
    
    const migratedPosts = [];
    const migratedPages = [];
    
    // Check blog posts
    const blogDir = path.join(process.cwd(), 'content/blog');
    if (fs.existsSync(blogDir)) {
      const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));
      
      blogFiles.forEach(file => {
        try {
          const filePath = path.join(blogDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const { data: frontMatter } = matter(content);
          
          migratedPosts.push({
            file: file,
            slug: file.replace('.mdx', ''),
            title: frontMatter.title,
            date: frontMatter.date,
            originalSlug: frontMatter.slug || file.replace('.mdx', '')
          });
        } catch (error) {
          results.errors.push(`Error reading ${file}: ${error.message}`);
        }
      });
    }
    
    // Check pages
    const pagesDir = path.join(process.cwd(), 'content/pages');
    if (fs.existsSync(pagesDir)) {
      const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.mdx'));
      
      pageFiles.forEach(file => {
        try {
          const filePath = path.join(pagesDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const { data: frontMatter } = matter(content);
          
          migratedPages.push({
            file: file,
            slug: file.replace('.mdx', ''),
            title: frontMatter.title,
            date: frontMatter.date,
            originalSlug: frontMatter.slug || file.replace('.mdx', '')
          });
        } catch (error) {
          results.errors.push(`Error reading ${file}: ${error.message}`);
        }
      });
    }
    
    results.migrated.posts = migratedPosts.length;
    results.migrated.pages = migratedPages.length;
    results.migrated.total = migratedPosts.length + migratedPages.length;
    
    console.log(`📝 Migrated Posts: ${migratedPosts.length}`);
    console.log(`📄 Migrated Pages: ${migratedPages.length}`);
    console.log(`📊 Migrated Total: ${results.migrated.total}`);
    
    // 3. Find missing content
    console.log('\n🔍 Checking for missing content...');
    
    originalPosts.forEach(original => {
      const found = migratedPosts.find(migrated => 
        migrated.originalSlug === original.slug || 
        migrated.slug === original.slug ||
        migrated.title === original.title
      );
      if (!found) {
        results.missing.push({
          type: 'post',
          title: original.title,
          slug: original.slug,
          id: original.id
        });
      }
    });
    
    originalPages.forEach(original => {
      const found = migratedPages.find(migrated => 
        migrated.originalSlug === original.slug || 
        migrated.slug === original.slug ||
        migrated.title === original.title
      );
      if (!found) {
        results.missing.push({
          type: 'page',
          title: original.title,
          slug: original.slug,
          id: original.id
        });
      }
    });
    
    // 4. Find extra content (content that exists in migration but not in original)
    // Note: This section has been simplified to reduce false positives
    migratedPosts.forEach(migrated => {
      const found = originalPosts.find(original => 
        original.slug === migrated.originalSlug || 
        original.slug === migrated.slug ||
        original.title === migrated.title
      );
      if (!found) {
        results.extra.push({
          type: 'post',
          title: migrated.title,
          slug: migrated.slug,
          file: migrated.file
        });
      }
    });
    
    migratedPages.forEach(migrated => {
      const found = originalPages.find(original => 
        original.slug === migrated.originalSlug || 
        original.slug === migrated.slug ||
        original.title === migrated.title
      );
      if (!found) {
        results.extra.push({
          type: 'page',
          title: migrated.title,
          slug: migrated.slug,
          file: migrated.file
        });
      }
    });
    
    // 5. Generate detailed report
    console.log('\n📊 VERIFICATION RESULTS');
    console.log('=' .repeat(60));
    console.log(`✅ Original WordPress content: ${results.original.total} items`);
    console.log(`✅ Migrated content: ${results.migrated.total} items`);
    console.log(`📈 Match rate: ${((results.migrated.total / results.original.total) * 100).toFixed(1)}%`);
    
    const isComplete = results.missing.length === 0 && results.errors.length === 0;
    console.log(`🎯 Migration complete: ${isComplete ? 'YES ✅' : 'NO ❌'}`);
    
    if (results.missing.length > 0) {
      console.log(`\n❌ MISSING CONTENT (${results.missing.length} items):`);
      results.missing.forEach(item => {
        console.log(`   - ${item.type}: "${item.title}" (${item.slug})`);
      });
    }
    
    if (results.extra.length > 0 && results.extra.length < 10) {
      // Only show extra content if it's a reasonable number (to avoid spam)
      console.log(`\n⚠️  EXTRA CONTENT (${results.extra.length} items):`);
      results.extra.forEach(item => {
        console.log(`   - ${item.type}: "${item.title}" (${item.file})`);
      });
    } else if (results.extra.length > 0) {
      console.log(`\n⚠️  EXTRA CONTENT: ${results.extra.length} items (list truncated - see JSON report for details)`);
    }
    
    if (results.errors.length > 0) {
      console.log(`\n🚨 ERRORS (${results.errors.length}):`);
      results.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    // 6. Save detailed report
    const reportPath = path.join(process.cwd(), 'migration-verification-report.json');
    const detailedReport = {
      ...results,
      originalPosts,
      originalPages,
      migratedPosts,
      migratedPages,
      xmlPath: xmlPath,
      verificationDate: new Date().toISOString()
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(detailedReport, null, 2));
    console.log(`\n📄 Detailed report saved to: migration-verification-report.json`);
    
    // 7. Generate URL verification list
    const urlVerificationList = [
      ...migratedPosts.map(post => ({
        type: 'post',
        title: post.title,
        url: `/blog/${post.slug}`,
        file: post.file
      })),
      ...migratedPages.map(page => ({
        type: 'page',
        title: page.title,
        url: `/${page.slug}`,
        file: page.file
      }))
    ];
    
    const urlListPath = path.join(process.cwd(), 'url-verification-list.json');
    fs.writeFileSync(urlListPath, JSON.stringify(urlVerificationList, null, 2));
    console.log(`📋 URL verification list saved to: url-verification-list.json`);
    
    // 8. Final verdict
    console.log('\n🎯 DEPLOYMENT READINESS CHECK:');
    console.log('=' .repeat(40));
    console.log(`Content count matches: ${results.original.total === results.migrated.total ? '✅' : '❌'}`);
    console.log(`No missing content: ${results.missing.length === 0 ? '✅' : '❌'}`);
    console.log(`No errors: ${results.errors.length === 0 ? '✅' : '❌'}`);
    
    const readyForDeployment = isComplete && results.original.total === results.migrated.total;
    console.log(`\n🚀 READY FOR VERCEL: ${readyForDeployment ? 'YES ✅' : 'NO ❌'}`);
    
    if (readyForDeployment) {
      console.log('\n🎉 Perfect! Your migration is complete and verified.');
      console.log('   All content matches the original WordPress export.');
      console.log('   You can proceed with confidence to Vercel deployment.');
      console.log('\n🚀 Next steps:');
      console.log('   1. npm run build');
      console.log('   2. vercel --prod');
      console.log('   3. Test URLs from url-verification-list.json');
    } else {
      console.log('\n⚠️  Please resolve the issues above before deploying.');
    }
    
    return {
      ready: readyForDeployment,
      results: results,
      urlList: urlVerificationList
    };
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    results.errors.push(error.message);
    return {
      ready: false,
      results: results,
      error: error.message
    };
  }
}

// Install required dependency if needed
try {
  require('xml2js');
} catch (e) {
  console.log('📦 Installing xml2js dependency...');
  require('child_process').execSync('npm install xml2js', { stdio: 'inherit' });
}

// Export for use in other scripts
module.exports = completeVerification;

// Run verification if called directly
if (require.main === module) {
  completeVerification().then(result => {
    if (result.ready) {
      console.log('\n✅ Migration verification passed - ready for deployment!');
      process.exit(0);
    } else {
      console.log('\n❌ Migration verification failed - please fix issues before deployment');
      process.exit(1);
    }
  }).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
