require('dotenv').config({ path: '.env.local' });

const secret = process.env.CRON_SECRET;
console.log('CRON_SECRET:', secret ? 'EXISTS' : 'MISSING');
console.log('Calling API...\n');

fetch('http://localhost:3000/api/cron/process-news', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${secret}`
    }
})
    .then(res => {
        console.log('Status:', res.status);
        return res.json();
    })
    .then(data => {
        console.log('Response:', JSON.stringify(data, null, 2));
    })
    .catch(err => {
        console.error('Error:', err.message);
    });
