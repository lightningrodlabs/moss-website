# Blog Authors Reference

This file contains information about available blog authors and their images.

## Available Authors

### Eric Harris-Braun
- **Name**: `Eric Harris-Braun`
- **Image**: `/blog/assets/images/authors/eric.jpg`

### Damien
- **Name**: `Damien`
- **Image**: `/blog/assets/images/authors/damien.jpg`

### Leo
- **Name**: `Leo`
- **Image**: `/blog/assets/images/authors/leo.jpg`

### Ira
- **Name**: `Ira`
- **Image**: `/blog/assets/images/authors/ira.jpg`

## Usage in Blog Posts

To use an author in a blog post, add these fields to the front matter:

```yaml
---
layout: post
title: "Your Post Title"
date: 2025-12-19
author: Eric Harris-Braun
author_image: /blog/assets/images/authors/eric.jpg
image: /blog/assets/images/posts/your-featured-image.png
tags: [tag1, tag2]
excerpt: "Brief summary of your post"
---
```

## Blog Post Images

Featured images for blog posts should be placed in:
- Source: `assets/images/posts/`
- Built: `build/blog/assets/images/posts/`
- Reference in front matter: `/blog/assets/images/posts/filename.png`

### Available Post Images

- `welcome-hero.png` - Moss dashboard screenshot (5.7MB)
