// Blog Posts Management
let allPosts = [];
let currentFilter = 'all';

// Load blog posts from JSON file
async function loadBlogPosts() {
  try {
    const response = await fetch('assets/data/blog-posts.json');
    const data = await response.json();
    allPosts = data.posts;
    renderBlogPosts(allPosts);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    displayErrorMessage();
  }
}

// Render blog posts to the page
function renderBlogPosts(posts) {
  const container = document.getElementById('blogPostsContainer');

  if (!posts || posts.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
        <h2 style="font-size: 1.75rem; margin-bottom: 1rem;">No Posts Yet</h2>
        <p style="opacity: 0.7;">Check back soon for new content!</p>
      </div>
    `;
    return;
  }

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  container.innerHTML = posts.map(post => createPostCard(post)).join('');

  // Re-initialize feather icons if available
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
}

// Create individual post card HTML
function createPostCard(post) {
  const formattedDate = formatDate(post.date);
  const readTime = calculateReadTime(post.content);

  return `
    <article class="blog-post-card" data-category="${post.category}" style="background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';" onclick="openPost('${post.id}')">
      ${post.image ? `
        <div style="width: 100%; height: 200px; overflow: hidden;">
          <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      ` : ''}

      <div style="padding: 1.5rem;">
        ${post.featured ? '<div style="display: inline-block; background: var(--primary); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; margin-bottom: 1rem;">FEATURED</div>' : ''}

        <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 1rem; font-size: 0.85rem; opacity: 0.7;">
          <span style="display: flex; align-items: center; gap: 0.25rem;">
            <i data-feather="calendar" width="14" height="14"></i>
            ${formattedDate}
          </span>
          <span>•</span>
          <span style="display: flex; align-items: center; gap: 0.25rem;">
            <i data-feather="clock" width="14" height="14"></i>
            ${readTime} min read
          </span>
        </div>

        <h3 style="font-size: 1.5rem; margin-bottom: 0.75rem; color: var(--text-primary);">${post.title}</h3>

        <p style="opacity: 0.85; margin-bottom: 1rem; line-height: 1.6;">${post.excerpt}</p>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border);">
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span style="display: inline-block; background: rgba(99, 102, 241, 0.1); color: var(--primary); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">${post.category}</span>
          </div>
          <span style="color: var(--primary); font-weight: 600; display: flex; align-items: center; gap: 0.25rem; font-size: 0.9rem;">
            Read More
            <i data-feather="arrow-right" width="16" height="16"></i>
          </span>
        </div>
      </div>
    </article>
  `;
}

// Filter posts by category
function filterPosts(category) {
  currentFilter = category;

  // Update active button
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    if (btn.dataset.category === category) {
      btn.classList.add('active');
      btn.style.background = 'var(--primary)';
      btn.style.color = 'white';
    } else {
      btn.classList.remove('active');
      btn.style.background = 'var(--surface)';
      btn.style.color = 'var(--text-primary)';
    }
  });

  // Filter and render posts
  const filteredPosts = category === 'all'
    ? allPosts
    : allPosts.filter(post => post.category === category);

  renderBlogPosts(filteredPosts);
}

// Open individual blog post
function openPost(postId) {
  const post = allPosts.find(p => p.id === postId);
  if (!post) return;

  // Create modal for full post
  const modal = document.createElement('div');
  modal.id = 'blogPostModal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    overflow-y: auto;
  `;

  const formattedDate = formatDate(post.date);
  const readTime = calculateReadTime(post.content);

  modal.innerHTML = `
    <div style="background: var(--background); max-width: 800px; width: 100%; border-radius: 16px; position: relative; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
      <button onclick="closePostModal()" style="position: sticky; top: 1rem; right: 1rem; float: right; background: var(--surface); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; z-index: 10; transition: background 0.3s ease;" onmouseover="this.style.background='var(--surface-2)'" onmouseout="this.style.background='var(--surface)'">&times;</button>

      ${post.image ? `
        <div style="width: 100%; height: 300px; overflow: hidden; border-radius: 16px 16px 0 0;">
          <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      ` : ''}

      <div style="padding: 3rem;">
        <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 1.5rem; font-size: 0.9rem; opacity: 0.7;">
          <span style="display: inline-block; background: rgba(99, 102, 241, 0.1); color: var(--primary); padding: 0.35rem 1rem; border-radius: 12px; font-weight: 500;">${post.category}</span>
          <span>•</span>
          <span>${formattedDate}</span>
          <span>•</span>
          <span>${readTime} min read</span>
        </div>

        <h1 style="font-size: 2.5rem; margin-bottom: 1rem; line-height: 1.2;">${post.title}</h1>

        ${post.author ? `
          <p style="opacity: 0.7; margin-bottom: 2rem; font-style: italic;">By ${post.author}</p>
        ` : ''}

        <div class="blog-content" style="line-height: 1.8; font-size: 1.05rem;">
          ${post.content}
        </div>

        ${post.tags && post.tags.length > 0 ? `
          <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border);">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
              <span style="opacity: 0.7; font-size: 0.9rem;">Tags:</span>
              ${post.tags.map(tag => `<span style="background: var(--surface); padding: 0.35rem 1rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid var(--border);">#${tag}</span>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // Re-initialize feather icons
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
}

// Close blog post modal
function closePostModal() {
  const modal = document.getElementById('blogPostModal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
  }
}

// Helper function to format date
function formatDate(dateString) {
  // Parse date string to avoid timezone issues
  const [year, month, day] = dateString.split('-');
  const date = new Date(year, month - 1, day);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Helper function to calculate read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Display error message
function displayErrorMessage() {
  const container = document.getElementById('blogPostsContainer');
  container.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
      <h2 style="font-size: 1.75rem; margin-bottom: 1rem;">Unable to Load Posts</h2>
      <p style="opacity: 0.7;">Please try refreshing the page.</p>
    </div>
  `;
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePostModal();
  }
});

// Initialize blog when page loads
document.addEventListener('DOMContentLoaded', loadBlogPosts);
