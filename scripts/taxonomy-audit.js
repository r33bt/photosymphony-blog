const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

class TaxonomyAuditor {
  constructor() {
    this.categories = new Map();
    this.tags = new Map();
    this.postTaxonomies = [];
  }

  async auditTaxonomies() {
    console.log('🏷️  WORDPRESS TAXONOMY AUDIT');
    console.log('=' .repeat(50));

    try {
      // Find XML file
      const xmlPath = this.findXMLFile();
      const xmlData = fs.readFileSync(xmlPath, 'utf8');
      const parser = new xml2js.Parser();
      const parsed = await parser.parseStringPromise(xmlData);

      const items = parsed.rss.channel[0].item || [];
      console.log(`📊 Processing ${items.length} WordPress items...`);

      // Extract taxonomies from each post
      items.forEach(item => {
        const postType = item['wp:post_type'] ? item['wp:post_type'][0] : '';
        const status = item['wp:status'] ? item['wp:status'][0] : '';
        const title = item.title ? item.title[0] : '';
        const slug = item['wp:post_name'] ? item['wp:post_name'][0] : '';
        
        if (status === 'publish' && postType === 'post' && title && slug) {
          const postData = {
            title,
            slug,
            categories: [],
            tags: []
          };

          // Extract categories and tags
          if (item.category) {
            item.category.forEach(cat => {
              const domain = cat.$.domain;
              const nicename = cat.$.nicename;
              const name = cat._;

              if (domain === 'category') {
                this.categories.set(nicename, {
                  slug: nicename,
                  name: name,
                  count: (this.categories.get(nicename)?.count || 0) + 1
                });
                postData.categories.push(nicename);
              } else if (domain === 'post_tag') {
                this.tags.set(nicename, {
                  slug: nicename,
                  name: name,
                  count: (this.tags.get(nicename)?.count || 0) + 1
                });
                postData.tags.push(nicename);
              }
            });
          }

          this.postTaxonomies.push(postData);
        }
      });

      this.displayResults();
      this.generateTaxonomyFiles();
      this.generateUpdatedMDX();

    } catch (error) {
      console.error('❌ Taxonomy audit failed:', error);
    }
  }

  findXMLFile() {
    const possiblePaths = [
      path.join(process.cwd(), '..', 'wp-export', 'photosymphony-export.xml'),
      path.join(process.cwd(), '..', 'wp-export'),
      path.join(process.cwd(), '..')
    ];

    for (const searchPath of possiblePaths) {
      if (fs.existsSync(searchPath)) {
        if (fs.statSync(searchPath).isDirectory()) {
          const xmlFiles = fs.readdirSync(searchPath).filter(f => f.endsWith('.xml'));
          if (xmlFiles.length > 0) {
            return path.join(searchPath, xmlFiles[0]);
          }
        } else if (searchPath.endsWith('.xml')) {
          return searchPath;
        }
      }
    }
    throw new Error('WordPress XML export file not found');
  }

  displayResults() {
    console.log('\n📊 TAXONOMY AUDIT RESULTS');
    console.log('=' .repeat(50));
    
    console.log(`📁 Categories: ${this.categories.size}`);
    console.log(`🏷️  Tags: ${this.tags.size}`);
    console.log(`📝 Posts with taxonomies: ${this.postTaxonomies.length}`);

    // Show top categories
    const topCategories = Array.from(this.categories.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    console.log('\n📁 TOP CATEGORIES:');
    topCategories.forEach(cat => {
      console.log(`   ${cat.name} (${cat.slug}) - ${cat.count} posts`);
    });

    // Show top tags
    const topTags = Array.from(this.tags.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    console.log('\n🏷️  TOP TAGS:');
    topTags.forEach(tag => {
      console.log(`   ${tag.name} (${tag.slug}) - ${tag.count} posts`);
    });
  }

  generateTaxonomyFiles() {
    console.log('\n📄 Generating taxonomy files...');

    // Create taxonomy data directory
    const taxonomyDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(taxonomyDir)) {
      fs.mkdirSync(taxonomyDir, { recursive: true });
    }

    // Generate categories.json
    const categoriesData = {
      categories: Array.from(this.categories.values()).sort((a, b) => b.count - a.count),
      totalCategories: this.categories.size,
      generatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(taxonomyDir, 'categories.json'),
      JSON.stringify(categoriesData, null, 2)
    );

    // Generate tags.json
    const tagsData = {
      tags: Array.from(this.tags.values()).sort((a, b) => b.count - a.count),
      totalTags: this.tags.size,
      generatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(taxonomyDir, 'tags.json'),
      JSON.stringify(tagsData, null, 2)
    );

    // Generate post-taxonomy mapping
    const postTaxonomyMapping = {
      posts: this.postTaxonomies,
      totalPosts: this.postTaxonomies.length,
      generatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(taxonomyDir, 'post-taxonomies.json'),
      JSON.stringify(postTaxonomyMapping, null, 2)
    );

    console.log('✅ Generated data/categories.json');
    console.log('✅ Generated data/tags.json');
    console.log('✅ Generated data/post-taxonomies.json');
  }

  generateUpdatedMDX() {
    console.log('\n📝 Updating MDX files with taxonomy data...');

    const blogDir = path.join(process.cwd(), 'content/blog');
    if (!fs.existsSync(blogDir)) {
      console.log('❌ Blog directory not found');
      return;
    }

    let updatedCount = 0;

    this.postTaxonomies.forEach(postData => {
      const mdxPath = path.join(blogDir, `${postData.slug}.mdx`);
      
      if (fs.existsSync(mdxPath)) {
        try {
          const content = fs.readFileSync(mdxPath, 'utf8');
          const matter = require('gray-matter');
          const { data: frontMatter, content: markdownContent } = matter(content);

          // Add categories and tags to frontmatter
          const updatedFrontMatter = {
            ...frontMatter,
            categories: postData.categories,
            tags: postData.tags
          };

          // Generate updated MDX content
          const updatedContent = matter.stringify(markdownContent, updatedFrontMatter);
          fs.writeFileSync(mdxPath, updatedContent);
          updatedCount++;

        } catch (error) {
          console.log(`⚠️  Failed to update ${postData.slug}.mdx: ${error.message}`);
        }
      }
    });

    console.log(`✅ Updated ${updatedCount} MDX files with taxonomy data`);
  }
}

// Run if called directly
if (require.main === module) {
  const auditor = new TaxonomyAuditor();
  auditor.auditTaxonomies();
}

module.exports = TaxonomyAuditor;
