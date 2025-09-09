class StorageService {
    constructor() {
        this.usersKey = 'blog_users';
        this.currentUserKey = 'blog_current_user';
        this.postsKey = 'blog_posts';
    }

    // Users methods
    getUsers() {
        return JSON.parse(localStorage.getItem(this.usersKey)) || [];
    }

    saveUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    // Current user methods
    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.currentUserKey));
    }

    saveCurrentUser(user) {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    }

    removeCurrentUser() {
        localStorage.removeItem(this.currentUserKey);
    }

    // Posts methods
    getPosts() {
        return JSON.parse(localStorage.getItem(this.postsKey)) || [];
    }

    savePosts(posts) {
        localStorage.setItem(this.postsKey, JSON.stringify(posts));
    }

    // Clear all data (for debugging)
    clearAll() {
        localStorage.removeItem(this.usersKey);
        localStorage.removeItem(this.currentUserKey);
        localStorage.removeItem(this.postsKey);
    }
}

const storageService = new StorageService();
