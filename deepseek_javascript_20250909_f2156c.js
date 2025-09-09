document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('news-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');
    
    // Ключ API (замените на свой собственный)
    const API_KEY = 'ВАШ_API_КЛЮЧ';
    const API_URL = `https://newsapi.org/v2/everything?q=technology&language=ru&apiKey=${API_KEY}`;
    
    let allNews = [];
    let currentFilter = 'all';
    
    // Функция для загрузки новостей
    async function fetchNews() {
        try {
            newsContainer.innerHTML = '<div class="loading">Загрузка новостей...</div>';
            
            const response = await fetch(API_URL);
            const data = await response.json();
            
            if (data.status === 'ok') {
                allNews = data.articles;
                displayNews(allNews);
            } else {
                throw new Error(data.message || 'Не удалось загрузить новости');
            }
        } catch (error) {
            console.error('Ошибка загрузки новостей:', error);
            newsContainer.innerHTML = `<div class="loading">Ошибка загрузки новостей: ${error.message}</div>`;
        }
    }
    
    // Функция для отображения новостей
    function displayNews(news) {
        if (news.length === 0) {
            newsContainer.innerHTML = '<div class="loading">Новости не найдены</div>';
            return;
        }
        
        newsContainer.innerHTML = '';
        
        news.forEach(item => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            
            // Определяем категорию на основе содержания
            let category = 'technology';
            let categoryText = 'Технологии';
            
            if (item.title && item.title.toLowerCase().includes('программир')) {
                category = 'programming';
                categoryText = 'Программирование';
            } else if (item.title && (item.title.toLowerCase().includes('безопасност') || item.title.toLowerCase().includes('хакер'))) {
                category = 'security';
                categoryText = 'Кибербезопасность';
            } else if (item.title && (item.title.toLowerCase().includes('ии') || item.title.toLowerCase().includes('искусственный интеллект'))) {
                category = 'ai';
                categoryText = 'ИИ';
            }
            
            newsCard.innerHTML = `
                <img src="${item.urlToImage || 'https://placehold.co/600x400/6e8efb/white?text=Новость'}" alt="${item.title}" class="news-img">
                <div class="news-content">
                    <h3 class="news-title">${item.title || 'Без названия'}</h3>
                    <p class="news-desc">${item.description || 'Описание отсутствует'}</p>
                    <div class="news-meta">
                        <span class="category">${categoryText}</span>
                        <span class="date">${new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <a href="${item.url}" target="_blank" style="display: block; margin-top: 10px; color: #6e8efb; text-decoration: none;">Читать далее</a>
                </div>
            `;
            
            newsCard.dataset.category = category;
            newsContainer.appendChild(newsCard);
        });
    }
    
    // Фильтрация по категориям
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            currentFilter = button.dataset.filter;
            filterNews();
        });
    });
    
    // Функция фильтрации новостей
    function filterNews() {
        let filteredNews = allNews;
        
        // Применяем фильтр по категории
        if (currentFilter !== 'all') {
            const newsCards = document.querySelectorAll('.news-card');
            newsCards.forEach(card => {
                if (currentFilter === 'all' || card.dataset.category === currentFilter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            return;
        } else {
            const newsCards = document.querySelectorAll('.news-card');
            newsCards.forEach(card => card.style.display = 'block');
        }
        
        // Применяем поисковый запрос
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            const newsCards = document.querySelectorAll('.news-card');
            newsCards.forEach(card => {
                const title = card.querySelector('.news-title').textContent.toLowerCase();
                const desc = card.querySelector('.news-desc').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    }
    
    // Поиск новостей
    searchInput.addEventListener('keyup', filterNews);
    searchButton.addEventListener('click', filterNews);
    
    // Загружаем новости при загрузке страницы
    fetchNews();
});