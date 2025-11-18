# Blaze AI + n8n Blog Automation Setup

This guide explains how to set up an automated workflow using n8n and Blaze AI to publish blog posts to your TechPro Solutions website.

## Overview

Your blog is now set up to read posts from `assets/data/blog-posts.json`. The workflow will:

1. Generate content using Blaze AI
2. Format it into the proper JSON structure
3. Add it to your blog-posts.json file
4. Automatically display on your website

## Blog Post JSON Structure

Each blog post in `assets/data/blog-posts.json` follows this structure:

```json
{
  "posts": [
    {
      "id": "unique-post-id",
      "title": "Your Blog Post Title",
      "excerpt": "A brief summary (1-2 sentences) that appears on the blog listing page",
      "content": "<p>Full HTML content of your blog post. Can include paragraphs, lists, headings, etc.</p>",
      "author": "Anthony Junk",
      "date": "2025-11-16",
      "category": "QuickBooks",
      "tags": ["quickbooks", "tips", "bookkeeping"],
      "featured": false,
      "image": ""
    }
  ]
}
```

### Field Descriptions

- **id**: Unique identifier (use lowercase with hyphens, e.g., "quickbooks-tips-2025")
- **title**: The main heading of your post
- **excerpt**: Brief summary shown on the blog listing page (keep it under 200 characters)
- **content**: Full blog post content in HTML format. You can use standard HTML tags like `<p>`, `<h2>`, `<ul>`, `<li>`, `<strong>`, etc.
- **author**: Post author name
- **date**: Publication date in YYYY-MM-DD format
- **category**: Main category (QuickBooks, Bookkeeping, Business Intelligence, Technology, or General)
- **tags**: Array of relevant tags for the post
- **featured**: Set to `true` to display a "FEATURED" badge on the post
- **image**: Optional URL to a featured image (leave empty "" if no image)

## n8n Workflow Setup

### Option 1: Manual Content Creation with n8n Formatting

This is the simplest approach to get started:

1. **Create a new n8n workflow** with these nodes:

   **Node 1: Webhook Trigger**
   - Creates an endpoint to receive blog post data
   - Configure to accept POST requests
   - Path: `/blog-post-webhook`

   **Node 2: Function Node - Format Blog Post**
   - Takes input data and formats it into the blog post structure
   - Sample code:
   ```javascript
   const blogPost = {
     id: $json.id || `post-${Date.now()}`,
     title: $json.title,
     excerpt: $json.excerpt,
     content: $json.content,
     author: $json.author || "Anthony Junk",
     date: $json.date || new Date().toISOString().split('T')[0],
     category: $json.category || "General",
     tags: $json.tags || [],
     featured: $json.featured || false,
     image: $json.image || ""
   };

   return { json: blogPost };
   ```

   **Node 3: HTTP Request - Get Current Blog Posts**
   - Method: GET
   - URL: `https://techproit.solutions/assets/data/blog-posts.json`
   - (Or use a local file path if hosting locally)

   **Node 4: Function Node - Merge New Post**
   - Combines the new post with existing posts
   ```javascript
   const currentPosts = $node["HTTP Request"].json.posts;
   const newPost = $node["Format Blog Post"].json;

   currentPosts.unshift(newPost); // Add to beginning of array

   return {
     json: {
       posts: currentPosts
     }
   };
   ```

   **Node 5: Write File Node** (if self-hosted) or **HTTP Request Node** (if using GitHub API)
   - Writes the updated JSON back to `blog-posts.json`
   - For GitHub: Use GitHub API with your personal access token

### Option 2: Blaze AI Integration (Recommended)

For full automation with Blaze AI:

1. **Set up Blaze AI Account**
   - Log into your Blaze AI account at https://blaze.ai
   - Navigate to API settings or integrations
   - Generate an API key if available
   - Note: Check Blaze AI documentation for their current API/integration options

2. **Create n8n Workflow**

   **Node 1: Schedule Trigger** (Optional)
   - Set to run weekly or as desired
   - Example: Every Monday at 9 AM

   **Node 2: HTTP Request - Call Blaze AI API**
   - Method: POST
   - URL: [Blaze AI API endpoint - check their documentation]
   - Headers:
     - `Authorization: Bearer YOUR_BLAZE_API_KEY`
     - `Content-Type: application/json`
   - Body:
   ```json
   {
     "prompt": "Write a blog post about QuickBooks tips for small business owners. Make it 500-700 words, professional but approachable.",
     "format": "html"
   }
   ```

   **Node 3: Function Node - Extract and Format Content**
   - Parse Blaze AI response
   - Extract title, content, and create excerpt
   ```javascript
   const blazeResponse = $json;

   // Extract title (assuming first H1 or from Blaze AI response)
   const titleMatch = blazeResponse.content.match(/<h1>(.*?)<\/h1>/);
   const title = titleMatch ? titleMatch[1] : "Untitled Post";

   // Remove title from content
   const content = blazeResponse.content.replace(/<h1>.*?<\/h1>/, '');

   // Create excerpt (first 150 characters of text)
   const textOnly = content.replace(/<[^>]*>/g, '');
   const excerpt = textOnly.substring(0, 150) + '...';

   // Generate ID from title
   const id = title.toLowerCase()
     .replace(/[^a-z0-9\s-]/g, '')
     .replace(/\s+/g, '-');

   return {
     json: {
       id: id,
       title: title,
       excerpt: excerpt,
       content: content,
       author: "Anthony Junk",
       date: new Date().toISOString().split('T')[0],
       category: "General", // You can make this dynamic
       tags: [],
       featured: false,
       image: ""
     }
   };
   ```

   **Node 4-6**: Same as Option 1 (Get current posts, merge, and write)

### Option 3: Using Blaze AI Web Interface + n8n

If Blaze AI doesn't have an API or you prefer using their web interface:

1. Create content in Blaze AI's web interface
2. Copy the generated content
3. Send it to your n8n webhook via a simple form or API call
4. n8n formats and publishes it

You can create a simple HTML form for this:

```html
<!-- Save as blog-post-form.html in your website -->
<!DOCTYPE html>
<html>
<head>
  <title>Add Blog Post</title>
</head>
<body>
  <h1>Add New Blog Post</h1>
  <form id="blogForm">
    <label>Title: <input type="text" name="title" required></label><br>
    <label>Excerpt: <textarea name="excerpt" required></textarea></label><br>
    <label>Content (HTML): <textarea name="content" rows="10" required></textarea></label><br>
    <label>Category:
      <select name="category">
        <option>QuickBooks</option>
        <option>Bookkeeping</option>
        <option>Business Intelligence</option>
        <option>Technology</option>
        <option>General</option>
      </select>
    </label><br>
    <label>Tags (comma-separated): <input type="text" name="tags"></label><br>
    <label>Featured: <input type="checkbox" name="featured"></label><br>
    <button type="submit">Publish</button>
  </form>

  <script>
    document.getElementById('blogForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        title: formData.get('title'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        category: formData.get('category'),
        tags: formData.get('tags').split(',').map(t => t.trim()),
        featured: formData.get('featured') === 'on'
      };

      await fetch('YOUR_N8N_WEBHOOK_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      alert('Blog post published!');
      e.target.reset();
    });
  </script>
</body>
</html>
```

## GitHub Integration (For Automatic Deployment)

If you're hosting on GitHub Pages, you'll need to update the file via GitHub API:

**Add this node to your n8n workflow:**

**HTTP Request - Update GitHub File**
- Method: PUT
- URL: `https://api.github.com/repos/YOUR-USERNAME/techpro.github.io/contents/assets/data/blog-posts.json`
- Headers:
  - `Authorization: token YOUR_GITHUB_PAT`
  - `Accept: application/vnd.github.v3+json`
- Body:
```json
{
  "message": "Add new blog post",
  "content": "BASE64_ENCODED_CONTENT",
  "sha": "CURRENT_FILE_SHA"
}
```

**Note**: You'll need to:
1. Get the current file's SHA first (another HTTP GET request)
2. Base64 encode your updated JSON
3. Send the update request

## Testing Your Setup

1. **Test Locally**:
   - Open `blog.html` in a browser
   - Check that your sample post loads correctly

2. **Test Adding a Post**:
   - Manually add a new post to `blog-posts.json`
   - Refresh the blog page
   - Verify the new post appears

3. **Test n8n Workflow**:
   - Send a test POST to your webhook
   - Check that the file updates correctly
   - Verify the post appears on your live site

## Blaze AI Tips

When creating prompts for Blaze AI, be specific:

**Good Prompt Example:**
```
Write a 600-word blog post about "5 Common QuickBooks Mistakes Small Business Owners Make."

Include:
- An engaging introduction
- 5 numbered mistakes with explanations
- Practical solutions for each mistake
- A conclusion encouraging readers to contact TechPro Solutions for help

Format in HTML with proper paragraph tags, headings, and lists.
Tone: Professional but friendly and approachable.
Target audience: Small business owners with limited accounting knowledge.
```

## Maintenance

- **Regular Updates**: Schedule your n8n workflow to run weekly or bi-weekly
- **Review Content**: Always review AI-generated content before publishing
- **Categories**: Keep categories consistent with your blog filter buttons
- **Images**: Consider adding featured images to make posts more engaging
- **SEO**: Include relevant keywords in titles and content

## Troubleshooting

**Posts not appearing?**
- Check browser console for errors
- Verify JSON syntax is valid (use JSONLint.com)
- Check file path is correct in blog.js

**n8n workflow failing?**
- Check API credentials
- Verify webhook URL is accessible
- Check n8n execution logs

**GitHub updates not working?**
- Verify your Personal Access Token has repo write permissions
- Check that SHA matches current file version

## Next Steps

1. Set up your n8n account (https://n8n.io)
2. Create your first workflow using Option 1 (simplest)
3. Test with manual content
4. Once working, integrate Blaze AI (Option 2)
5. Update other pages' navigation to include the blog link

## Support

For questions or issues:
- Contact: [Your Contact Information]
- n8n Community: https://community.n8n.io
- Blaze AI Support: [Check their documentation]

---

**Pro Tip**: Start simple with manual posts and the webhook approach (Option 1), then gradually automate with Blaze AI as you get comfortable with the workflow.
