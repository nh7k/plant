# PlantGift - Plant Gifting Website

## Overview

PlantGift is a static website that allows users to browse and gift plants. The site features a clean, nature-inspired design with interactive elements and animations. It's built as a multi-page HTML website with modern CSS styling and JavaScript functionality.

## System Architecture

### Frontend Architecture
- **Multi-page HTML website** with 5 main pages (Home, Browse Plants, Bulk Order, About, Contact)
- **Static file serving** using Python's built-in HTTP server for development
- **Modular CSS architecture** with separate files for main styles, animations, components, and responsive design
- **JavaScript module system** with separate files for different functionalities (main, animations, form validation, scroll effects)
- **Mobile-first responsive design** using CSS media queries

### Technology Stack
- **HTML5** for page structure and semantic markup
- **CSS3** with custom properties (CSS variables) for consistent theming
- **Vanilla JavaScript** for interactive functionality
- **Python HTTP server** for local development serving
- **Font Awesome** for iconography
- **Google Fonts (Poppins)** for typography

## Key Components

### 1. Navigation System
- Responsive navbar with mobile hamburger menu
- Sticky scroll behavior with visual feedback
- Active page highlighting
- Smooth scrolling between sections

### 2. Styling System
- **CSS Custom Properties** for consistent color palette and spacing
- **Green nature theme** with primary colors: dark green (#14532d), forest green (#166534), light green (#bbf7d0)
- **Component-based CSS** with reusable button styles and UI elements
- **Animation system** with keyframes for fade effects and transitions

### 3. Interactive Features
- **Form validation system** for contact, bulk order, and gift forms
- **Scroll-based animations** including parallax effects and reveal animations
- **Floating leaves animation** for visual appeal
- **Advanced hover effects** and micro-interactions

### 4. Development Server
- **Python HTTP server** on port 5000 with cache-busting headers
- **Static file serving** from the root directory
- **Development-friendly** with no-cache headers for easier testing

## Data Flow

Currently, this is a static website with no backend data persistence. Form submissions and user interactions are handled client-side with JavaScript. The data flow is:

1. **User Interaction** → JavaScript event handlers
2. **Form Validation** → Client-side validation with visual feedback
3. **Animation Triggers** → Scroll position and user actions trigger CSS/JS animations
4. **Navigation** → Client-side routing between HTML pages

## External Dependencies

### CDN Resources
- **Google Fonts API** for Poppins font family
- **Font Awesome CDN** (v6.4.0) for icons

### Development Dependencies
- **Python 3** for the development server
- **Modern web browser** with ES6+ support

## Deployment Strategy

### Current Setup
- **Local development** using Python HTTP server
- **Static file hosting** ready for deployment to any static hosting service

### Deployment Options
1. **Static hosting services** (Netlify, Vercel, GitHub Pages)
2. **Traditional web servers** (Apache, Nginx)
3. **Cloud storage with CDN** (AWS S3 + CloudFront, Google Cloud Storage)

### Considerations
- All assets are self-contained except for external fonts and icons
- No build process required - direct deployment of HTML/CSS/JS files
- Cache-busting can be implemented at the server level

## Changelog

```
Changelog:
- July 06, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## Notes for Development

### File Structure
- **HTML files** in root directory for each page
- **CSS files** organized in `/css/` directory by purpose
- **JavaScript files** organized in `/js/` directory by functionality
- **Python server script** in root for development serving

### Key Design Decisions
1. **Static website approach** chosen for simplicity and fast loading
2. **Modular CSS/JS structure** for maintainability and scalability
3. **Mobile-first responsive design** to ensure good mobile experience
4. **Nature-inspired design theme** to align with plant gifting concept
5. **Component-based styling** for consistent UI elements across pages

### Future Enhancement Opportunities
- Add backend functionality for form processing
- Implement e-commerce features for actual plant ordering
- Add user authentication and accounts
- Integrate with payment processing systems
- Add plant inventory management system
- Implement search and filtering functionality