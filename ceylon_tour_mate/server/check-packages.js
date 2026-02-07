const pool = require('./config/db');

async function checkPackages() {
  try {
    const result = await pool.query(`
      SELECT id, package_name, package_code, status, category, created_at
      FROM packages 
      ORDER BY created_at DESC
    `);
    
    console.log('\n========================================');
    console.log(`Total packages in database: ${result.rows.length}`);
    console.log('========================================\n');
    
    if (result.rows.length === 0) {
      console.log('⚠️  No packages found in database!\n');
    } else {
      result.rows.forEach((pkg, idx) => {
        console.log(`${idx + 1}. Package Name: ${pkg.package_name}`);
        console.log(`   Code: ${pkg.package_code}`);
        console.log(`   Status: ${pkg.status}`);
        console.log(`   Category: ${pkg.category}`);
        console.log(`   Created: ${pkg.created_at}`);
        console.log('   ---');
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkPackages();
