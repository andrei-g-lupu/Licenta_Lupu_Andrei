const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setupAdminTables() {
  try {
    console.log('🚀 Setting up admin dashboard tables...');
    
    // Read and execute the SQL setup script
    const sqlScript = fs.readFileSync(path.join(__dirname, 'setup_admin_tables.sql'), 'utf8');
    await pool.query(sqlScript);
    
    console.log('✅ Admin tables created successfully!');
    
    // Prompt for admin user email
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Enter email address to make admin (or press Enter to skip): ', async (email) => {
      if (email.trim()) {
        try {
          const result = await pool.query(
            'UPDATE users SET role = $1 WHERE email = $2 RETURNING username, email',
            ['admin', email.trim()]
          );
          
          if (result.rows.length > 0) {
            console.log(`✅ User ${result.rows[0].username} (${result.rows[0].email}) is now an admin!`);
          } else {
            console.log(`❌ No user found with email: ${email.trim()}`);
          }
        } catch (error) {
          console.error('❌ Error updating user role:', error.message);
        }
      }
      
      console.log('\n🎉 Admin dashboard setup complete!');
      console.log('📊 You can now access the admin dashboard at: /admin/dashboard');
      console.log('⚙️  Basic admin panel at: /admin');
      
      rl.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error setting up admin tables:', error);
    process.exit(1);
  }
}

setupAdminTables(); 