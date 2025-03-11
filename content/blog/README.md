
# Blog Content

This directory contains markdown files that will be used to generate blog posts on the website.

## How to Add New Blog Posts

1. Create a new `.md` file in this directory
2. The filename will become the URL slug (e.g., `my-post.md` becomes `/blog/my-post`)
3. Include the following frontmatter at the top of the file:

```md
---
title: "Your Blog Post Title"
excerpt: "A brief summary of your blog post"
date: "YYYY-MM-DD"
category: "cybersecurity" | "teaching" | "f&b" | "entrepreneurship"
author: "Your Name"
image: "URL to header image"
---
```

4. Write your blog post content below the frontmatter using Markdown syntax
5. The site will automatically load your new blog post

## Markdown Tips

- Use `##` for section headings (H2)
- Use `###` for subsection headings (H3)
- Use `-` or `*` for bullet points
- Use `1.`, `2.`, etc. for numbered lists
- Use `**text**` for bold text
- Use `*text*` for italic text
- Use `[link text](URL)` for links
- Use `![alt text](image URL)` for images

## Categories

Blog posts should use one of the following categories:
- cybersecurity
- teaching
- f&b (Food & Beverage)
- entrepreneurship
