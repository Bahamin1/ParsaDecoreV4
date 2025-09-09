# Admin Panel User Guide

## Getting Started

The Parsa Decor admin panel allows you to manage all website content without technical knowledge.

### Accessing the Admin Panel

1. Navigate to `https://your-site.com/admin`
2. The admin panel opens with the dashboard

### Dashboard Overview

The dashboard shows:
- **Statistics** - Current content counts
- **Quick Actions** - Common tasks
- **Recent Activity** - Latest changes

## Managing Content

### Hero Section

**Location:** Admin → Hero Section

**What you can edit:**
- Main title and tagline
- Description text
- Company video URL
- Background images (slideshow)

**Best Practices:**
- Use high-quality images (1920x1080px)
- Keep descriptions under 200 characters
- Test video URLs before saving

### Services

**Location:** Admin → Services

**What you can edit:**
- Service titles and descriptions
- Service icons
- Order of services

**Tips:**
- Keep titles under 50 characters
- Use clear, benefit-focused descriptions
- Choose appropriate icons from the library

### Color Palettes

**Location:** Admin → Color Palettes

**What you can edit:**
- Palette names
- Color combinations (hex codes)
- Use cases and descriptions

**Guidelines:**
- Use 3-6 colors per palette
- Include use case examples
- Test colors for accessibility

### Portfolio Projects

**Location:** Admin → Portfolio

**What you can edit:**
- Project titles and descriptions
- Project categories
- Image galleries
- Materials and specifications

**Project Categories:**
- Residential
- Commercial
- Small Rooms
- Renovation

**Image Guidelines:**
- Upload 3-10 images per project
- Use high-resolution photos
- Include before/after shots when possible

### Gallery

**Location:** Admin → Gallery

**What you can edit:**
- Individual gallery images
- Image captions
- Image order

**Best Practices:**
- Use professional photography
- Write descriptive captions
- Organize by room type or style

### About & Contact

**Location:** Admin → About & Contact

**What you can edit:**
- Company description
- Team information
- Office address and hours
- Contact information

## Media Management

### Uploading Images

1. **Click Upload Area** or drag and drop files
2. **Supported Formats:** JPG, PNG, WebP, GIF
3. **Size Limit:** 5MB per file
4. **Recommended Size:** 1920x1080px for hero, 800x600px for projects

### Image Optimization

The system automatically:
- Compresses images for web
- Generates responsive sizes
- Converts to WebP format

### Organizing Media

- Use descriptive filenames
- Group related images
- Delete unused images regularly

## Content Export & Deployment

### Exporting Content

**Location:** Admin → Export

1. **Choose Export Options:**
   - Include media files
   - Optimize images
   - Select format (JSON recommended)

2. **Click Export Content**
3. **Download ZIP File**

### Deployment Process

1. **Export content** from admin panel
2. **Extract ZIP file** to your repository
3. **Commit changes** to git
4. **Deploy** your site

### Automated Sync (Advanced)

For automatic deployment:
1. Set up CI/CD pipeline
2. Configure API keys
3. Content syncs on save

## Best Practices

### Content Writing

- **Headlines:** Clear and compelling
- **Descriptions:** Benefit-focused, under 200 characters
- **CTAs:** Action-oriented language
- **SEO:** Include relevant keywords naturally

### Image Guidelines

- **Quality:** Professional photography only
- **Consistency:** Maintain visual style
- **Optimization:** Let the system handle compression
- **Alt Text:** Descriptive captions for accessibility

### Workflow

1. **Plan Changes:** Outline updates before starting
2. **Preview:** Check content before publishing
3. **Test:** Verify all links and images work
4. **Export:** Create deployment package
5. **Deploy:** Update live site

## Troubleshooting

### Common Issues

**Images Not Uploading**
- Check file size (under 5MB)
- Verify file format (JPG, PNG, WebP, GIF)
- Try refreshing the page

**Content Not Saving**
- Check internet connection
- Verify all required fields filled
- Try saving individual sections

**Export Failing**
- Validate content first
- Check for missing images
- Try exporting without media

### Getting Help

- **Validation Errors:** Check required fields
- **Technical Issues:** Contact developer
- **Content Questions:** Review this guide

## Keyboard Shortcuts

- **Ctrl/Cmd + S:** Save current section
- **Ctrl/Cmd + E:** Export content
- **Ctrl/Cmd + P:** Preview site
- **Esc:** Close modals/dialogs

## Security Notes

- **Never share admin URLs** publicly
- **Use strong passwords** if authentication added
- **Regular backups** via export function
- **Review changes** before deployment

---

For technical support, contact your developer or create an issue in the project repository.
