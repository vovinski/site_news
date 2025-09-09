class AuthSystem {
    constructor(storageService) {
        this.storage = storageService;
        this.currentUser = null;
        this.users = this.storage.getUsers();
        this.init();
    }

    init() {
        const savedUser = this.storage.getCurrentUser();
        if (savedUser) {
            this.currentUser = savedUser;
        }
    }

    register(name, email, password) {
        // Check if user already exists
        if (this.users.find(user => user.email === email)) {
            throw new Error('Пользователь с таким email уже существует');
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password, // In production, password should be hashed!
            role: 'author',
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.storage.saveUsers(this.users);
        
        return this.login(email, password);
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) {
            throw new Error('Неверный email или пароль');
        }

        this.currentUser = user;
        this.storage.saveCurrentUser(user);
        
        return user;
    }

    logout() {
        this.currentUser = null;
        this.storage.removeCurrentUser();
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    isAuthor() {
        return this.isAuthenticated() && (this.currentUser.role === 'author' || this.currentUser.role === 'admin');
    }

    isAdmin() {
        return this.isAuthenticated() && this.currentUser.role === 'admin';
    }
}

const authSystem = new AuthSystem(storageService);
