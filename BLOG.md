# Moss Blog Documentation

## Overview

The Moss blog is built with Jekyll and integrated with the main static site. Blog files are generated into `build/blog/` and deployed alongside the main site.

## Directory Structure

```
moss.social/
├── _config.yml           # Jekyll configuration
├── _layouts/             # Blog layouts (default, post)
├── _posts/               # Blog posts (markdown files)
├── _includes/            # Reusable components
├── assets/               # Blog assets (CSS, images)
│   └── css/
│       └── blog.css      # Blog-specific styles
├── index.html            # Blog index page
├── Gemfile               # Ruby dependencies
└── build/
    ├── index.html        # Main site (unchanged)
    ├── download.html     # Main site (unchanged)
    ├── style.css         # Main site (unchanged)
    └── blog/             # Generated blog (gitignored)
        ├── index.html    # Blog home at /blog/
        ├── 2025/12/19/...# Blog posts
        ├── feed.xml      # RSS feed
        └── assets/       # Blog assets
```

## Writing Blog Posts

### Create a New Post

1. Create a file in `_posts/` with the format: `YYYY-MM-DD-title.md`
2. Add front matter:

```markdown
---
layout: post
title: "Your Post Title"
date: 2025-12-19
author: Moss Team
tags: [tag1, tag2, tag3]
excerpt: "A short summary for the blog index"
---

Your content here in Markdown...
```

### Front Matter Options

- `layout`: Always use "post"
- `title`: Post title (required)
- `date`: Publication date (required)
- `author`: Author name (optional, defaults to "Moss Team")
- `author_image`: Path to author avatar image (optional, shows placeholder if not provided)
  - Images located at: `/blog/assets/images/authors/[name].jpg`
- `image`: Path to featured image (optional, shows gradient placeholder if not provided)
  - Place images in: `assets/images/posts/`
  - Reference as: `/blog/assets/images/posts/filename.png`
- `tags`: Array of tags (optional, max 2 shown on cards)
- `excerpt`: Summary text (optional, auto-generated if not provided)

See `AUTHORS.md` for complete author reference.

## Building the Blog

### Local Build (Option A - Recommended)

```bash
# Build the blog
bundle exec jekyll build

# The blog will be generated in build/blog/
# Commit the build/blog/ directory to Git
git add build/blog/
git commit -m "Update blog"
git push

# Cloudflare will auto-deploy the changes
```

### Development Server

build and serve via python:

```
cd build
python3 -m http.server 8000
```

## Styling

The blog uses the Moss design system with Vonge-inspired layout:

- **Fonts**: Mossville-v2 (headings), Inter (body)
- **Colors**: From `styleguide.css` (forest-dark, moss-primary, leaf-accent, earth-bg)
- **Spacing**: CSS variables from the design system
- **Layout Features**:
  - Featured images on blog post cards
  - Author avatars with name and date
  - Two-column post hero (content left, image right)
  - Dropcap on first paragraph of posts
  - Gradient placeholders when images not provided
  - Responsive design (single column on mobile)

Blog-specific styles are in `assets/css/blog.css`.

## Navigation

The main site has a "Blog" link added to the navigation that points to `/blog/`.

## Important Notes

### Gotchas Avoided

✅ Jekyll outputs to `build/blog/` only - main site files are never touched
✅ The `build/blog/` directory is gitignored (generated files)
✅ Main site remains a simple static site
✅ Blog uses same fonts, colors, and design language as main site

### What NOT to Do

❌ Don't edit files in `build/blog/` directly (they're regenerated)
❌ Don't change the `destination` in `_config.yml` (it would overwrite the main site)
❌ Don't forget to run `bundle exec jekyll build` before committing

## Deployment

1. Write your blog post in `_posts/`
2. Run `bundle exec jekyll build`
3. Commit changes including `build/blog/`
4. Push to GitHub
5. Cloudflare auto-deploys

## RSS Feed

The blog automatically generates an RSS feed at `/blog/feed.xml`

## SEO

Posts automatically get:
- SEO meta tags (via jekyll-seo-tag)
- Sitemap entry (via jekyll-sitemap)
- Open Graph tags
- Twitter Card tags

## Troubleshooting

**Blog not building?**
```bash
# Install dependencies
bundle install

# Try a clean build
rm -rf build/blog/
bundle exec jekyll build
```

**Main site broken?**
The blog should never touch main site files. Check that `_config.yml` has:
- `destination: build/blog`
- `exclude:` includes `build/`

**Posts not showing?**
- Check filename format: `YYYY-MM-DD-title.md`
- Ensure front matter is valid YAML
- Check date isn't in the future
