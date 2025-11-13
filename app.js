cat > app.js << 'EOF'
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
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
            animation: fadeIn 0.6s ease-in;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .logo {
            font-size: 64px;
            margin-bottom: 20px;
            animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }
        
        h1 {
            color: #333;
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .subtitle {
            color: #666;
            font-size: 18px;
            margin-bottom: 30px;
        }
        
        .status {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            display: inline-block;
            font-weight: bold;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 30px;
            text-align: left;
        }
        
        .info-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        
        .info-card h3 {
            color: #667eea;
            font-size: 14px;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .info-card p {
            color: #333;
            font-size: 16px;
            font-weight: bold;
        }
        
        .footer {
            margin-top: 30px;
            color: #999;
            font-size: 14px;
        }
        
        .badge {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            margin: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo"></div>
        <h1>Jenkins CI/CD Pipeline Demo</h1>
        <p class="subtitle">Automated Deployment Successful!</p>
        
        <div class="status">
            ✅ Application Running
        </div>
        
        <div class="info-grid">
            <div class="info-card">
                <h3>Server</h3>
                <p>Node.js ${process.version}</p>
            </div>
            <div class="info-card">
                <h3>Port</h3>
                <p>${port}</p>
            </div>
            <div class="info-card">
                <h3>Environment</h3>
                <p>Development</p>
            </div>
            <div class="info-card">
                <h3>Status</h3>
                <p>Healthy</p>
            </div>
        </div>
        
        <div style="margin-top: 30px;">
            <span class="badge">Docker</span>
            <span class="badge">Jenkins</span>
            <span class="badge">GitHub</span>
            <span class="badge">CI/CD</span>
        </div>
        
        <div class="footer">
            <p>Deployed via Jenkins Pipeline</p>
            <p>Automatically built from GitHub repository</p>
        </div>
    </div>
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
EOF