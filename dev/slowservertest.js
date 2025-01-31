const http = require('http');

// Embedded small base64 test image (1x1 pixel black JPEG)
const base64Image = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

const server = http.createServer((req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  // Delay response by 10 seconds
  setTimeout(() => {
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');
    
    res.writeHead(200, { 
      'Content-Type': 'image/jpeg',
      'Content-Length': imageBuffer.length 
    });
    res.end(imageBuffer);
  }, 10000);
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});