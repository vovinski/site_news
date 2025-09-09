class BlogSystem {
    constructor(storageService) {
        this.storage = storageService;
        this.posts = this.storage.getPosts();
        this.currentEditId = null;
    }

    createPost(postData) {
        const newPost = {
            id: Date.now(),
            ...postData,
            createdAt: new Date().toISOString(),
            author: authSystem.currentUser.name,
            authorId: authSystem.currentUser.id,
            views: 0,
            likes: 0
        };

        this.posts.unshift(newPost);
        this.storage.savePosts(this.posts);
        return newPost;
    }

    updatePost(id, updates) {
        const index = this.posts.findIndex(post => post.id === id);
        if (index !== -1) {
            this.posts[index] = { 
                ...this.posts[index], 
                ...updates, 
                updatedAt: new Date().toISOString() 
            };
            this.storage.savePosts(this.posts);
            return this.posts[index];
        }
        return null;
    }

    deletePost(id) {
        this.posts = this.posts.filter(post => post.id !== id);
        this.storage.savePosts(this.posts);
    }

    getPosts(category = null) {
        let posts = [...this.posts];
        
        if (category && category !== 'all') {
            posts = posts.filter(post => post.category === category);
        }
        
        return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    getPost(id) {
        return this.posts.find(post => post.id === id);
    }

    getUserPosts(userId) {
        return this.posts.filter(post => post.authorId === userId)
                         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    getPostsByCategory(category) {
        return this.posts.filter(post => post.category === category);
    }

    incrementViews(postId) {
        const post = this.getPost(postId);
        if (post) {
            post.views = (post.views || 0) + 1;
            this.storage.savePosts(this.posts);
        }
    }
}

const blogSystem = new BlogSystem(storageService);
