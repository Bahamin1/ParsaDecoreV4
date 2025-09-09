# Deployment Guide

## Overview

This guide covers deploying the Parsa Decor website and admin panel to various hosting platforms.

## Prerequisites

- Node.js 18+
- Git repository
- Content exported from admin panel

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   \`\`\`bash
   vercel --prod
   \`\`\`

2. **Set Environment Variables**
   \`\`\`bash
   vercel env add ADMIN_API_KEY
   vercel env add NEXT_PUBLIC_SITE_URL
   \`\`\`

3. **Deploy**
   \`\`\`bash
   vercel deploy --prod
   \`\`\`

### Option 2: Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `out`

2. **Environment Variables**
   \`\`\`
   ADMIN_API_KEY=your-secure-key
   NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
   \`\`\`

### Option 3: Static Export

1. **Build Static Site**
   \`\`\`bash
   npm run build
   npm run export
   \`\`\`

2. **Upload `out/` Directory**
   Upload the generated `out/` directory to any static hosting service.

## CI/CD Pipeline

### GitHub Actions Example

\`\`\`yaml
name: Deploy Parsa Decor

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Sync content
        run: npm run build-time-sync
        env:
          ADMIN_API_URL: ${{ secrets.ADMIN_API_URL }}
          ADMIN_API_KEY: ${{ secrets.ADMIN_API_KEY }}
          
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
\`\`\`

## Performance Optimization

### Image Optimization
- Use WebP format with fallbacks
- Implement responsive images
- Enable lazy loading

### Caching Strategy
- Static assets: 1 year cache
- HTML pages: 1 hour cache
- API responses: No cache

### CDN Configuration
- Enable gzip compression
- Set proper cache headers
- Use image optimization service

## Monitoring

### Analytics
- Vercel Analytics enabled
- Google Analytics (optional)
- Performance monitoring

### Error Tracking
- Sentry integration (optional)
- Custom error boundaries
- API error logging

## Security

### Content Security Policy
\`\`\`javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
  }
]
\`\`\`

### Environment Variables
- Never commit secrets to git
- Use different keys for staging/production
- Rotate API keys regularly

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version
   - Verify all dependencies installed
   - Run content validation

2. **Missing Images**
   - Ensure images are in `public/images/`
   - Check image paths in content.json
   - Verify upload permissions

3. **API Errors**
   - Check environment variables
   - Verify API key permissions
   - Review server logs

### Debug Commands

\`\`\`bash
# Check content validity
npm run validate-content

# Test build locally
npm run build && npm run start

# Check TypeScript errors
npm run type-check
