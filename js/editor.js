class Editor {
    constructor(quill) {
        this.quill = quill;
        this.currentPostId = null;
        this.init();
    }

    init() {
        this.quill = new Quill('#editor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image', 'code-block'],
                    ['clean']
                ]
            },
            placeholder: 'Напишите вашу статью здесь...'
        });
    }

    openEditor(postId = null) {
        const editorContainer = document.getElementById('editor-container');
        const editorTitle = document.getElementById('editor-title');
        const postTitle = document.getElementById('post-title');
        const postExcerpt = document.getElementById('post-excerpt');
        const postCategory = document.getElementById('post-category');
        
        this.currentPostId = postId;

        if (postId) {
            // Edit existing post
            const post = blogSystem.getPost(postId);
            if (post) {
                editorTitle.textContent = 'Редактирование статьи';
                postTitle.value = post.title;
                postExcerpt.value = post.excerpt;
                postCategory.value = post.category;
                this.quill.root.innerHTML = post.content || '';
            }
        } else {
            // New post
            editorTitle.textContent = 'Новая статья';
            postTitle.value = '';
            postExcerpt.value = '';
            postCategory.value = 'programming';
            this.quill.root.innerHTML = '';
        }
        
        editorContainer.style.display = 'block';
        window.scrollTo(0, 0);
    }

    closeEditor() {
        document.getElementById('editor-container').style.display = 'none';
        this.currentPostId = null;
    }

    savePost() {
        const title = document.getElementById('post-title').value;
        const excerpt = document.getElementById('post-excerpt').value;
        const category = document.getElementById('post-category').value;
        const content = this.quill.root.innerHTML;
        
        if (!title || !excerpt || !content) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        const postData = {
            title,
            excerpt,
            category,
            content,
            image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3'
        };
        
        if (this.currentPostId) {
            blogSystem.updatePost(this.currentPostId, postData);
        } else {
            blogSystem.createPost(postData);
        }
        
        this.closeEditor();
        
        // Refresh UI
        if (typeof loadAdminPosts === 'function') loadAdminPosts();
        if (typeof loadPublicPosts === 'function') loadPublicPosts();
    }

    getContent() {
        return this.quill.root.innerHTML;
    }

    setContent(content) {
        this.quill.root.innerHTML = content;
    }

    clear() {
        this.quill.root.innerHTML = '';
        this.currentPostId = null;
    }
}

// Initialize editor when DOM is loaded
let editor;
document.addEventListener('DOMContentLoaded', function() {
    editor = new Editor();
});
