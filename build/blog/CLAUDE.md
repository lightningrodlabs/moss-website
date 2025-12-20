# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the static marketing website for Moss (moss.social), a peer-to-peer, adaptable, relational environment for collective impact built by Lightningrod Labs and Holochain. The site is a simple static HTML/CSS website hosted at https://moss.social.

## Repository Structure

The repository uses a simple structure with all production files in the `build/` directory:

- `build/` - All website files are here (this is the web root)
  - `index.html` - Main landing page
  - `download.html` - Download page with links to GitHub releases
  - `access-form.html` - Early access signup form (embedded Formbricks)
  - `style.css`, `styleguide.css`, `globals.css` - Stylesheets
  - `images/` - Image assets including logos, screenshots, platform logos
  - `*.bak` files - Backup versions of older designs

## Development Workflow

### Editing the Website

All edits should be made directly to files in the `build/` directory. This is a static site with no build process.

**Important files:**
- `build/index.html` - Main landing page
- `build/download.html` - Download page
- `build/style.css` - Primary stylesheet

### Updating Version Numbers

When a new Moss version is released, update the download links in both `build/download.html` and `build/index.html` (download overlay):
1. Update all GitHub release URLs to point to the new version tag
2. Ensure all platform download links (Linux AppImage, .deb, macOS M-series, macOS Intel, Windows) are updated

Current version: **v0.15.0**

The download URLs follow this pattern:
```
https://github.com/lightningrodlabs/moss/releases/download/v{VERSION}/org.lightningrodlabs.moss-0.15-{VERSION}-{PLATFORM}
```

### Git Workflow

This repository uses GitHub Pages or similar static hosting. To deploy changes:

```bash
git add build/
git commit -m "description of changes"
git push origin main
```

Common commit patterns based on git history:
- Version bumps: "bump to 0.14.4"
- Bug fixes: "fix windows download link"
- UI updates: "responsiveness fixes", "font-size fix"

## Architecture Notes

### Static Site Structure

The website is intentionally simple - no JavaScript framework, no build process. This makes it:
- Fast to load
- Easy to maintain
- Reliable for users seeking to download Moss

### External Dependencies

- **Formbricks**: Embedded in `access-form.html` for early access signups
- **Google Fonts**: Inter font family loaded via CDN
- **GitHub Releases**: All Moss binaries are hosted on the main Moss repository releases page

### CSS Architecture

Three CSS files work together:
- `globals.css` - Base/reset styles
- `styleguide.css` - Design system tokens and shared styles
- `style.css` - Component-specific styles

The site uses a responsive design that adapts to mobile devices.
