const http = require('http');

async function testPackagesAPI() {
  return new Promise((resolve, reject) => {
    console.log('\n🔍 Testing /api/packages endpoint...\n');
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/packages',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('Status:', res.statusCode);
          console.log('Response structure:', Object.keys(response));
          console.log('\n========================================');
          console.log(`Packages returned: ${response.packages?.length || 0}`);
          console.log('========================================\n');
          
          if (response.packages && response.packages.length > 0) {
            response.packages.forEach((pkg, idx) => {
              console.log(`${idx + 1}. ${pkg.package_name} (${pkg.package_code}) - ${pkg.status}`);
            });
          } else {
            console.log('⚠️  No packages in API response');
            console.log('Full response:', JSON.stringify(response, null, 2));
          }
          resolve();
        } catch (error) {
          console.error('❌ Error parsing response:', error.message);
          console.log('Raw response:', data);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Error calling API:', error.message);
      reject(error);
    });
    
    req.end();
  });
}

testPackagesAPI().then(() => process.exit(0)).catch(() => process.exit(1));
