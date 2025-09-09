# Parsa Decor - Premium Interior Design Website

A modern, premium website for Parsa Decor interior design studio with a comprehensive admin panel and static-first content management system.

## 🏗️ Architecture Overview

This project consists of two main components:

1. **Frontend Website** - Static-first Next.js site that reads content from local JSON files
2. **Admin Panel** - Content management system with export/sync capabilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd parsa-decor
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Configure the following variables:
   \`\`\`env
   ADMIN_API_URL=http://localhost:3000
   ADMIN_API_KEY=your-secure-api-key
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Access the application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## 📁 Project Structure

\`\`\`
parsa-decor/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel pages
│   │   ├── layout.tsx           # Admin-specific layout
│   │   ├── page.tsx             # Admin dashboard
│   │   ├── hero/                # Hero content editor
│   │   ├── portfolio/           # Portfolio management
│   │   └── export/              # Content export interface
│   ├── api/                     # API routes
│   │   └── admin/               # Admin API endpoints
│   ├── projects/[id]/           # Dynamic project pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── admin/                   # Admin panel components
│   ├── ui/                      # Reusable UI components
│   ├── hero.tsx                 # Homepage hero section
│   ├── portfolio.tsx            # Portfolio showcase
│   └── ...                      # Other page components
├── lib/                         # Utility libraries
│   ├── content.ts               # Content loading utilities
│   ├── content-validator.ts     # Content validation
│   └── content-export.ts        # Export functionality
├── data/                        # Content data
│   ├── content.json             # Main content file
│   └── content-schema.json      # Content validation schema
├── scripts/                     # Utility scripts
│   ├── validate-content.js      # Content validation
│   ├── sync-content.js          # Content sync script
│   └── build-time-sync.js       # CI/CD sync script
└── public/                      # Static assets
    └── images/                  # Image assets
\`\`\`

## 🎨 Features

### Frontend Website
- **Static-First Architecture** - Reads content from local JSON files
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Performance Optimized** - Image optimization, lazy loading, SEO
- **Accessibility** - WCAG compliant with proper ARIA attributes
- **Interactive Elements** - Smooth animations, parallax effects, lightboxes

### Admin Panel
- **Brand-Consistent Design** - Matches Parsa Decor visual identity
- **Content Management** - Edit hero, services, projects, gallery, and contact info
- **Media Upload** - Drag-and-drop image upload with optimization
- **Content Validation** - Real-time validation against JSON schema
- **Export/Import** - Export content as deployable packages

### Content Management
- **Hero Section** - Background images, video, neon text effects
- **Services** - Service cards with icons and descriptions
- **Color Palettes** - Interior design color schemes
- **Portfolio** - Filterable project showcase with detail pages
- **Gallery** - Masonry layout with lightbox modal
- **About & Contact** - Company info and contact form

## 🔧 Content Management Workflow

### Option A: Manual Export (Recommended)

1. **Edit Content** in the admin panel at `/admin`
2. **Export Content** from `/admin/export`
3. **Extract ZIP** to your repository
4. **Commit Changes** to git
5. **Deploy** your static site

### Option B: Automated Sync

1. **Set Environment Variables**
   \`\`\`bash
   export ADMIN_API_URL="https://your-admin-panel.com"
   export ADMIN_API_KEY="your-api-key"
   \`\`\`

2. **Run Sync Script**
   \`\`\`bash
   node scripts/build-time-sync.js
   \`\`\`

3. **Build and Deploy**
   \`\`\`bash
   npm run build
   npm run start
   \`\`\`

## 🧪 Testing

### Run Content Validation
\`\`\`bash
node scripts/validate-content.js
\`\`\`

### Run Development Tests
\`\`\`bash
npm run test
\`\`\`

### Test Export Functionality
\`\`\`bash
# Test content export
curl -H "Authorization: Bearer $ADMIN_API_KEY" \
     http://localhost:3000/api/admin/content/export \
     -o content-export.zip
\`\`\`

## 🚀 Deployment

### Static Site Generation

1. **Build the site**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Export static files**
   \`\`\`bash
   npm run export
   \`\`\`

3. **Deploy to your hosting provider**
   - Vercel: `vercel deploy`
   - Netlify: Drag `out/` folder to Netlify
   - GitHub Pages: Push to `gh-pages` branch

### Environment Variables for Production

\`\`\`env
ADMIN_API_URL=https://your-domain.com
ADMIN_API_KEY=your-secure-production-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
\`\`\`

## 🔒 Security Considerations

- **API Authentication** - Secure admin endpoints with API keys
- **Input Validation** - Validate all content against JSON schema
- **File Upload Security** - Restrict file types and sizes
- **Environment Variables** - Never commit sensitive keys to git

## 🎯 Performance Optimization

- **Image Optimization** - WebP format with fallbacks
- **Lazy Loading** - Images load as they enter viewport
- **Code Splitting** - Dynamic imports for admin panel
- **Static Generation** - Pre-rendered pages for fast loading
- **CDN Ready** - Optimized for content delivery networks

## 🛠️ Development

### Adding New Content Types

1. **Update Content Schema** in `data/content-schema.json`
2. **Update TypeScript Types** in `lib/content.ts`
3. **Create Admin Component** in `components/admin/`
4. **Add API Route** in `app/api/admin/`
5. **Update Export Logic** in `lib/content-export.ts`

### Customizing the Design

1. **Brand Colors** - Update CSS variables in `app/globals.css`
2. **Typography** - Modify font imports in `app/layout.tsx`
3. **Components** - Edit components in `components/`
4. **Admin Theme** - Update admin components to match brand

## 📚 API Documentation

### Admin API Endpoints

- `GET /api/admin/content` - Fetch current content
- `POST /api/admin/content` - Update content
- `GET /api/admin/content/export` - Export content package
- `POST /api/admin/media/upload` - Upload media files

### Content Structure

See `data/content-schema.json` for the complete content structure specification.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and validation
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@parsadecor.com
- Documentation: See `/docs` folder for detailed guides

---

Built with ❤️ for Parsa Decor Interior Design Studio
\`\`\`

```json file="" isHidden
# ParsaDecoreV4
