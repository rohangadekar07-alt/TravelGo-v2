const http = require('http');

http.get('http://localhost:5000/', (res) => {
    console.log('Status Code:', res.statusCode);
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Data Length:', data.length);
        console.log('Sample Content:', data.substring(0, 100));
    });
}).on('error', (err) => {
    console.log('Error:', err.message);
});
