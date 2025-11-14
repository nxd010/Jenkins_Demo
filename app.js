const http = require('http');

const hostname = '0.0.0.0';
const port = 3000;

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jenkins CI/CD Demo</title>
    <style>
        html, body {
            height: 100%; /* Make sure HTML and body fill the screen */
            margin: 0;     /* Remove default browser margins */
            padding: 0;  /* Remove default browser padding */
        }

        body {
            /* 1. Set up Flexbox */
            display: flex;
            
            /* 2. Stack elements vertically (h1 on top of p) */
            flex-direction: column; 
            
            /* 3. Center vertically */
            justify-content: center; 
            
            /* 4. Center horizontally */
            align-items: center; 
            
            /* Your original styles */
            background-color: #292947ff; /* darkblue */
            color: white;
            
            /* This ensures text inside the <p> tag is also centered if it wraps */
            text-align: center; 
        }
    </style>
</head>
<body>
    <h1>Welcome to Jenkins CI/CD Demo</h1>
    <p>This is a simple Node.js application served over HTTP.</p>
    <p>Build Number: 1 Update Readme </p>
    <p>Build Number: 2 Build Trigger </p>
    <p> Build Number: 3 Webhook Trigger </p>
    <p> Build Number: 4 Dockerfile Added </p>
    <p> Build Number: 5 Kubernetes Manifest Added </p>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(htmlContent);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
