// Generate VAPID keys for Web Push notifications
// Run with: npx tsx scripts/generate-vapid-keys.ts

import webpush from 'web-push';

const vapidKeys = webpush.generateVAPIDKeys();

console.log('\n🔐 VAPID Keys Generated!\n');
console.log('Add these to your .env.local and Vercel environment variables:\n');
console.log('─'.repeat(60));
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log('─'.repeat(60));
console.log('\n⚠️  Keep the private key secret! Never commit it to git.\n');
