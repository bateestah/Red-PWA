const clientId = '6FsFqDPNb1Ywxc99iMA_Ew'; // Replace with your Reddit app's client ID
const clientSecret = 'lTxV45ZlMs8oPpQIYueSkhFy-08IVQ'; // Replace with your Reddit app's client secret
const userAgent = 'YourAppName/0.1 by YourRedditUsername'; // Replace with your app name and Reddit username
const app = document.getElementById('app');

// Step 1: Obtain an OAuth token
async function getOAuthToken() {
  const basicAuth = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('Failed to obtain OAuth token');
  }

  const data = await response.json();
  return data.access_token;
}

// Step 2: Fetch posts from r/all using the token
async function fetchRedditPosts() {
  try {
    const token = await getOAuthToken();
    const response = await fetch('https://oauth.reddit.com/r/all', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': userAgent
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const data = await response.json();
    renderPosts(data.data.children);
  } catch (error) {
    app.innerHTML = `Failed to load posts: ${error.message}`;
    console.error('Error:', error);
  }
}

// Step 3: Render the posts
function renderPosts(posts) {
  app.innerHTML = ''; // Clear loading text

  if (!posts.length) {
    app.innerHTML = 'No posts found.';
    return;
  }

  posts.forEach(post => {
    const { title, subreddit, thumbnail, id } = post.data;

    // Check if the post is hidden locally
    if (localStorage.getItem(`hidden-${id}`)) return;

    const postContainer = document.createElement('div');
    postContainer.className = 'post-container';

    const thumbUrl = (thumbnail && thumbnail.startsWith('http')) ? thumbnail : 'https://via.placeholder.com/50';

    postContainer.innerHTML = `
      <img src="${thumbUrl}" alt="Thumbnail" class="thumbnail">
      <div>
        <h2>${title}</h2>
        <p>r/${subreddit}</p>
      </div>
      <button class="hide-button" onclick="hidePost('${id}')">Hide</button>
    `;

    app.appendChild(postContainer);
  });
}

// Step 4: Hide a post locally
function hidePost(id) {
  localStorage.setItem(`hidden-${id}`, true);
  location.reload(); // Refresh to reflect changes
}

// Initialize the app
fetchRedditPosts();
