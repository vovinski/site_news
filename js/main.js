// UI Functions
function loadPublicPosts(category = 'all') {
    const postsContainer = document.getElementById('posts');
    const posts = blogSystem.getPosts(category);
    
    postsContainer.innerHTML = '';
    
    if (posts.length === 0) {
        postsContainer.innerHTML = '<p class="no-posts">Статьи не найдены</p>';
        return;
    }
    
    posts.forEach(post => {
        const postCard = document.createElement('article');
        postCard.className = 'post-card';
        postCard.innerHTML = `
            <img src="${post.image || 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3'}" alt="${post.title}" class="post-img">
            <div class="post-content">
                <span class="post-category">${post.category}</span>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-meta">
                    <span>${new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>${post.readTime || '5 мин'}</span>
                </div>
            </div>
        `;
        postsContainer.appendChild(postCard);
    });
}

function loadAdminPosts() {
    const postsList = document.getElementById('posts-list');
    const userPosts = blogSystem.getUserPosts(authSystem.currentUser.id);
    
    postsList.innerHTML = '';
    
    if (userPosts.length === 0) {
        postsList.innerHTML = '<div style="padding: 20px; text-align: center;">У вас пока нет статей</div>';
        return;
    }
    
    userPosts.forEach(post => {
        const postItem = document.createElement('div');
        postItem.className = 'post-item';
        postItem.innerHTML = `
            <div class="post-info">
                <h3>${post.title}</h3>
                <div class="post-meta">
                    ${new Date(post.createdAt).toLocaleDateString()} • ${post.category} • ${post.readTime || '5 мин'}
                </div>
            </div>
            <div class="post-actions">
                <button class="action-btn edit-btn" data-id="${post.id}">Редактировать</button>
                <button class="action-btn delete-btn" data-id="${post.id}">Удалить</button>
            </div>
        `;
        postsList.appendChild(postItem);
    });
    
    // Add event listeners for action buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const postId = parseInt(e.target.dataset.id);
            editor.openEditor(postId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const postId = parseInt(e.target.dataset.id);
            if (confirm('Вы уверены, что хотите удалить эту статью?')) {
                blogSystem.deletePost(postId);
                loadAdminPosts();
                loadPublicPosts();
            }
        });
    });
}

function updateAuthUI() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const userAvatar = document.getElementById('user-avatar');
    const adminPanel = document.getElementById('admin-panel');

    if (authSystem.isAuthenticated()) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        userAvatar.textContent = authSystem.currentUser.name.charAt(0).toUpperCase();
        
        if (authSystem.isAuthor()) {
            adminPanel.style.display = 'block';
            loadAdminPosts();
        }
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
        adminPanel.style.display = 'none';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    loadPublicPosts();
    updateAuthUI();
    
    // Auth modals
    document.getElementById('login-btn').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('login-modal').style.display = 'flex';
    });
    
    document.getElementById('register-btn').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('register-modal').style.display = 'flex';
    });
    
    document.getElementById('switch-to-register').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('register-modal').style.display = 'flex';
    });
    
    document.getElementById('switch-to-login').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('register-modal').style.display = 'none';
        document.getElementById('login-modal').style.display = 'flex';
    });
    
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Auth forms
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            authSystem.login(email, password);
            document.getElementById('login-modal').style.display = 'none';
            this.reset();
            updateAuthUI();
        } catch (error) {
            alert(error.message);
        }
    });
    
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const passwordConfirm = document.getElementById('register-password-confirm').value;
        
        if (password !== passwordConfirm) {
            alert('Пароли не совпадают');
            return;
        }
        
        try {
            authSystem.register(name, email, password);
            document.getElementById('register-modal').style.display = 'none';
            this.reset();
            updateAuthUI();
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        authSystem.logout();
        updateAuthUI();
    });
    
    // Editor actions
    document.getElementById('create-new-post').addEventListener('click', function() {
        editor.openEditor();
    });
    
    document.getElementById('save-post').addEventListener('click', function() {
        editor.savePost();
    });
    
    document.getElementById('cancel-edit').addEventListener('click', function() {
        editor.closeEditor();
    });
    
    // Category filter
    document.getElementById('category-filter').addEventListener('change', function() {
        loadPublicPosts(this.value);
    });
    
    // Close modals on outside click
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Newsletter form
    document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        alert(`Спасибо за подписку! На адрес ${email} будут приходить уведомления о новых статьях.`);
        this.reset();
    });
});
