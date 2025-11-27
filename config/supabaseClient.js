const { createClient } = require('@supabase/supabase-js');

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Read Supabase credentials from environment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
  
  if (process.env.NODE_ENV === 'production') {
    console.error('💡 Please set these variables in your hosting environment dashboard.');
  } else {
    console.error('💡 Please check your local .env file.');
  }
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase client initialized');

module.exports = supabase;
