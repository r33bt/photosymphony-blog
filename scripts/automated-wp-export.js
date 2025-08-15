const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class AutomatedWPExporter {
  constructor(config) {
    this.wpUrl = config.wpUrl;
    this.username = config.username;
    this.password = config.password;
    this.siteName = config.siteName || 'wordpress-site';
    this.exportDir = path.join(process.cwd(), '..', 'wp-export');
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🚀 Starting automated WordPress export...');
    
    // Ensure export directory exists
    if (!fs.existsSync(this.exportDir)) {
      fs.mkdirSync(this.exportDir, { recursive: true });
      console.log('📁 Created wp-export directory');
    }
    
    // Launch browser
    this.browser = await puppeteer.launch({ 
      headless: false, // Show browser for debugging
      defaultViewport: null,
      args: ['--start-maximized']
    });
    this.page = await this.browser.newPage();
    
    // Set download behavior
    await this.page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: this.exportDir
    });
  }

  async login() {
    console.log('🔑 Logging into WordPress...');
    
    const loginUrl = `${this.wpUrl}/wp-admin/`;
    await this.page.goto(loginUrl, { waitUntil: 'networkidle2' });
    
    // Fill login form
    await this.page.waitForSelector('#user_login');
    await this.page.type('#user_login', this.username);
    await this.page.type('#user_pass', this.password);
    
    // Click login
    await this.page.click('#wp-submit');
    await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // Check if login successful
    const isLoggedIn = await this.page.$('.wp-admin-bar-my-account') !== null;
    if (!isLoggedIn) {
      throw new Error('❌ WordPress login failed');
    }
    
    console.log('✅ Successfully logged into WordPress');
  }

  async navigateToExport() {
    console.log('📤 Navigating to export page...');
    
    const exportUrl = `${this.wpUrl}/wp-admin/export.php`;
    await this.page.goto(exportUrl, { waitUntil: 'networkidle2' });
    
    // Select "All content" option (default is usually selected)
    const allContentRadio = await this.page.$('input[value="all"]');
    if (allContentRadio) {
      await allContentRadio.click();
    }
    
    console.log('✅ Export page loaded, "All content" selected');
  }

  async downloadExport() {
    console.log('⬇️ Starting export download...');
    
    // Click the download export file button
    const downloadButton = await this.page.$('#submit');
    if (!downloadButton) {
      throw new Error('❌ Download button not found');
    }
    
    // Start download
    await downloadButton.click();
    
    // Wait for download to complete
    console.log('⏳ Waiting for download to complete...');
    await this.page.waitForTimeout(5000); // Wait 5 seconds for download
    
    // Find the downloaded file
    const files = fs.readdirSync(this.exportDir);
    const xmlFiles = files.filter(f => f.endsWith('.xml'));
    
    if (xmlFiles.length === 0) {
      throw new Error('❌ No XML file found after download');
    }
    
    // Get the most recent XML file
    const downloadedFile = xmlFiles
      .map(f => ({ name: f, path: path.join(this.exportDir, f), time: fs.statSync(path.join(this.exportDir, f)).mtime }))
      .sort((a, b) => b.time - a.time)[0];
    
    console.log(`✅ Downloaded: ${downloadedFile.name}`);
    return downloadedFile;
  }

  async standardizeFileName(downloadedFile) {
    const timestamp = new Date().toISOString().split('T')[0];
    const standardName = `${this.siteName}-export-${timestamp}.xml`;
    const standardPath = path.join(this.exportDir, standardName);
    
    if (downloadedFile.path !== standardPath) {
      fs.renameSync(downloadedFile.path, standardPath);
      console.log(`📋 Renamed to: ${standardName}`);
    }
    
    return standardPath;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async export() {
    try {
      await this.init();
      await this.login();
      await this.navigateToExport();
      const downloadedFile = await this.downloadExport();
      const standardizedPath = await this.standardizeFileName(downloadedFile);
      
      console.log('\n🎉 WordPress export completed successfully!');
      console.log(`📁 File location: ${standardizedPath}`);
      console.log(`📊 File size: ${Math.round(fs.statSync(standardizedPath).size / 1024)}KB`);
      
      return standardizedPath;
      
    } catch (error) {
      console.error('❌ Export failed:', error.message);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Configuration loader
function loadConfig() {
  const configPath = path.join(process.cwd(), 'wp-config.json');
  
  if (!fs.existsSync(configPath)) {
    console.log('📝 Creating wp-config.json template...');
    const template = {
      wpUrl: "https://your-wordpress-site.com",
      username: "your-admin-username",
      password: "your-admin-password",
      siteName: "your-site-name"
    };
    
    fs.writeFileSync(configPath, JSON.stringify(template, null, 2));
    
    console.log('❌ Please update wp-config.json with your WordPress credentials');
    console.log('   Then run this script again');
    return null;
  }
  
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// Main execution
async function main() {
  const config = loadConfig();
  if (!config) return;
  
  const exporter = new AutomatedWPExporter(config);
  const xmlPath = await exporter.export();
  
  console.log('\n🎯 Next steps:');
  console.log('   1. Run migration script with this XML');
  console.log('   2. Run verification script');
  console.log('   3. Deploy to Vercel');
  
  return xmlPath;
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = AutomatedWPExporter;
