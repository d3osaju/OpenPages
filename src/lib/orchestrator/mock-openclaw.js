#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
let outputDir = '';

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' && i + 1 < args.length) {
        outputDir = args[i + 1];
        break;
    }
}

if (!outputDir) {
    console.error("Error: --output argument is required");
    process.exit(1);
}

console.log(`Mock Openclaw generating site in: ${outputDir}`);

// Simulate delay
setTimeout(() => {
    try {
        fs.mkdirSync(outputDir, { recursive: true });

        // Create package.json
        fs.writeFileSync(path.join(outputDir, 'package.json'), JSON.stringify({
            "name": path.basename(outputDir),
            "version": "0.1.0",
            "private": true,
            "scripts": {
                "dev": "next dev",
                "build": "next build",
                "start": "next start"
            },
            "dependencies": {
                "next": "latest",
                "react": "latest",
                "react-dom": "latest"
            }
        }, null, 2));

        // Create a simple Next.js page
        const appDir = path.join(outputDir, 'app');
        fs.mkdirSync(appDir, { recursive: true });
        fs.writeFileSync(path.join(appDir, 'page.tsx'), `
export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', color: '#fff', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', background: 'linear-gradient(to right, #00f2fe, #4facfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        ${path.basename(outputDir)}
      </h1>
      <p style={{ marginTop: '2rem', fontSize: '1.5rem', color: '#aaa' }}>
        Generated automatically by Openpages pipeline.
      </p>
    </main>
  );
}
    `);

        console.log("Mock generation complete!");
        process.exit(0);
    } catch (error) {
        console.error("Mock generation failed:", error);
        process.exit(1);
    }
}, 3000);
