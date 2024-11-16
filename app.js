const app = document.getElementById('app');

// Fetch posts from Reddit's r/all
fetch('https://test.cors.workers.dev/https://www.reddit.com/r/all.json')
  .then(response => response.json())
  .then(data => {
    const posts = data.data.children;
    renderPosts(posts);
  })
  .catch(error => {
    app.innerHTML = 'Failed to load posts. Please try again later.';
    console.error('Error fetching data:', error);
  });

function renderPosts(posts) {
  app.innerHTML = ''; // Clear initial loading text

  posts.forEach(post => {
    const { title, subreddit, thumbnail, id } = post.data;

    // Skip rendering if the post is hidden
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

function hidePost(id) {
  localStorage.setItem(`hidden-${id}`, true);
  location.reload(); // Refresh to reflect changes
}
