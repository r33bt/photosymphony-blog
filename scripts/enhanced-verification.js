const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const xml2js = require('xml2js');

async function enhancedVerification() {
  console.log('🔍 ENHANCED MIGRATION VERIFICATION (WITH TAXONOMIES)');
  console.log('=' .repeat(60));
  
  try {
    // Run taxonomy audit first
    const TaxonomyAuditor = require('./taxonomy-audit');
    const auditor = new TaxonomyAuditor();
    await auditor.auditTaxonomies();
    
    // Then run original verification
    const completeVerification = require('./complete-verification');
    const result = await completeVerification();
    
    // Additional taxonomy checks
    console.log('\n🏷️  TAXONOMY VERIFICATION:');
    console.log('=' .repeat(40));
    
    const dataDir = path.join(process.cwd(), 'data');
    const hasCategories = fs.existsSync(path.join(dataDir, 'categories.json'));
    const hasTags = fs.existsSync(path.join(dataDir, 'tags.json'));
    const hasPostMapping = fs.existsSync(path.join(dataDir, 'post-taxonomies.json'));
    
    console.log(`Categories data: ${hasCategories ? '✅' : '❌'}`);
    console.log(`Tags data: ${hasTags ? '✅' : '❌'}`);
    console.log(`Post-taxonomy mapping: ${hasPostMapping ? '✅' : '❌'}`);
    
    const taxonomyReady = hasCategories && hasTags && hasPostMapping;
    console.log(`\n🏷️  Taxonomy migration: ${taxonomyReady ? 'COMPLETE ✅' : 'INCOMPLETE ❌'}`);
    
    return {
      ...result,
      taxonomyReady
    };
    
  } catch (error) {
    console.error('❌ Enhanced verification failed:', error);
    return { ready: false, error: error.message };
  }
}

if (require.main === module) {
  enhancedVerification();
}

module.exports = enhancedVerification;
