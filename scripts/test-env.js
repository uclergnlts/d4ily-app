// Test dotenv loading
require('dotenv').config({ path: '.env.local' });

console.log("ENV TEST:");
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
console.log("TURSO_DATABASE_URL:", process.env.TURSO_DATABASE_URL ? "EXISTS" : "MISSING");
