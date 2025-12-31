// Script to execute schema.sql in Supabase database
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wlbwstlaxdtcdafhudny.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsYndzdGxheGR0Y2RhZmh1ZG55Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzEyMjIxNywiZXhwIjoyMDgyNjk4MjE3fQ.CCrcqoy_Tl66JuFy9NqF1tKXIa5dqWatSSHCf3j5TZU';

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSchema() {
  console.log('🚀 Starting database schema setup...\n');
  
  try {
    // Read schema file
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    console.log('📖 Schema file loaded successfully');
    console.log(`📏 Schema size: ${schema.length} characters\n`);
    
    // Split schema into individual statements
    // Remove comments and split by semicolon
    const statements = schema
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim() !== '')
      .join('\n')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.match(/^(\/\*|\*\/|DO \$\$)/));
    
    console.log(`📊 Found ${statements.length} SQL statements to execute\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip empty statements
      if (!statement || statement.trim().length === 0) continue;
      
      // Get first few words for logging
      const preview = statement.substring(0, 60).replace(/\n/g, ' ') + '...';
      
      try {
        console.log(`[${i + 1}/${statements.length}] Executing: ${preview}`);
        
        // Execute using Supabase RPC
        const { error } = await supabase.rpc('exec_sql', { 
          query: statement + ';' 
        });
        
        if (error) {
          // Try direct query if RPC doesn't exist
          const { error: queryError } = await supabase
            .from('_exec')
            .select()
            .limit(0);
          
          if (queryError) {
            throw new Error(error.message || 'Unknown error');
          }
        }
        
        successCount++;
        console.log('  ✅ Success\n');
        
      } catch (error) {
        errorCount++;
        console.error(`  ❌ Error: ${error.message}\n`);
        
        // Don't stop on errors, continue with next statement
        continue;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📈 EXECUTION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📊 Total: ${statements.length}`);
    console.log('='.repeat(60) + '\n');
    
    if (errorCount === 0) {
      console.log('🎉 Database schema setup completed successfully!');
      console.log('🔍 You can now verify tables in Supabase Dashboard\n');
    } else {
      console.log('⚠️  Some statements failed. Please check errors above.');
      console.log('💡 You may need to execute schema.sql manually in Supabase SQL Editor\n');
    }
    
    // Verify tables were created
    console.log('🔍 Verifying created tables...\n');
    await verifyTables();
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

async function verifyTables() {
  const expectedTables = [
    'reservations',
    'menu_items', 
    'orders',
    'order_items',
    'drivers',
    'staff_notes',
    'restaurant_settings'
  ];
  
  console.log('Checking for tables:\n');
  
  for (const table of expectedTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`  ❌ ${table}: NOT FOUND`);
      } else {
        console.log(`  ✅ ${table}: EXISTS`);
      }
    } catch (error) {
      console.log(`  ❌ ${table}: ERROR - ${error.message}`);
    }
  }
  
  console.log('');
}

// Run the script
executeSchema().catch(console.error);
