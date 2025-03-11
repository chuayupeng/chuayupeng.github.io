
#!/usr/bin/env node

// This is a simple helper script to create new blog posts
// Usage: node createPost.js "My New Blog Post"

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get title from command line arguments or prompt for it
const getTitle = () => {
  return new Promise((resolve) => {
    const cmdTitle = process.argv[2];
    if (cmdTitle) {
      resolve(cmdTitle);
    } else {
      rl.question('Enter blog post title: ', (title) => {
        resolve(title);
      });
    }
  });
};

// Generate a slug from the title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
};

// Get the next ID based on existing files
const getNextId = (files) => {
  // If no files, start with 1
  if (files.length === 0) return 1;
  
  // Extract IDs from front matter of all files
  const ids = files.map(file => {
    const content = fs.readFileSync(file, 'utf8');
    const match = content.match(/^---[\s\S]*?id:\s*(\d+)[\s\S]*?---/);
    return match ? parseInt(match[1], 10) : 0;
  });
  
  // Return max ID + 1
  return Math.max(...ids) + 1;
};

// Get the date in the format "Month Day, Year"
const getFormattedDate = () => {
  const date = new Date();
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

// Create a new blog post file
const createBlogPost = async () => {
  try {
    const title = await getTitle();
    const contentDir = path.join(process.cwd(), 'src/content/blog');
    
    // Ensure the directory exists
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }
    
    // Get all existing Markdown files
    const files = fs.readdirSync(contentDir)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(contentDir, file));
    
    const id = getNextId(files);
    const slug = generateSlug(title);
    const date = getFormattedDate();
    
    // Prompt for category
    rl.question('Enter category (cybersecurity/teaching/f&b/entrepreneurship): ', (category) => {
      // Validate category
      const validCategories = ['cybersecurity', 'teaching', 'f&b', 'entrepreneurship'];
      if (!validCategories.includes(category)) {
        console.error(`Error: Category must be one of: ${validCategories.join(', ')}`);
        rl.close();
        return;
      }
      
      rl.question('Enter author name: ', (author) => {
        rl.question('Enter excerpt: ', (excerpt) => {
          // Create front matter
          const frontMatter = `---
id: ${id}
title: ${title}
excerpt: ${excerpt}
date: ${date}
category: ${category}
author: ${author}
image: https://images.unsplash.com/photo-1558494949-ef010cbdcc31
slug: ${slug}
---

Write your markdown content here. This is the first paragraph of your blog post.

## Section Heading

This is the content of the first section.

- Bullet point 1
- Bullet point 2
- Bullet point 3

## Another Section

Continue writing your blog post here...
`;

          // Write the file
          const filePath = path.join(contentDir, `${slug}.md`);
          fs.writeFileSync(filePath, frontMatter);
          
          console.log(`Blog post created successfully: ${filePath}`);
          console.log('You should update the image URL and add your content.');
          
          rl.close();
        });
      });
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    rl.close();
  }
};

createBlogPost();
