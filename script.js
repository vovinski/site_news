document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('news-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');
    
    // Используем CORS-прокси для обхода ограничений
    const API_KEY = '57387b5f13cb481db9c5e6c55717909d';
    const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
    const API_URL = `${CORS_PROXY}https://newsapi.org/v2/top-headlines?category=technology&language=ru&pageSize=20&apiKey=${API_KEY}`;
    
    let allNews = [];
    let currentFilter = 'all';
    
    // Функция для загрузки новостей
    async function fetchNews() {
        try {
            newsContainer.innerHTML = '<div class="loading">Загрузка новостей...</div>';
            
            const response = await fetch(API_URL, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            // Если используем прокси, может потребоваться дополнительная обработка
            const data = await response.json();
            
            if (data.status === 'ok') {
                allNews = data.articles;
                displayNews(allNews);
            } else {
                // Если ошибка из-за CORS, попробуем альтернативный подход
                if (data.message && data.message.includes('CORS')) {
                    await fetchNewsAlternative();
                } else {
                    throw new Error(data.message || 'Не удалось загрузить новости');
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки новостей:', error);
            await fetchNewsAlternative();
        }
    }
    
    // Альтернативный источник новостей (RSS через proxy)
    async function fetchNewsAlternative() {
        try {
            // Используем RSS-ленты IT-новостей через RSS-to-JSON прокси
            const RSS_URLS = [
                'https://habr.com/ru/rss/hub/programming/',
                'https://habr.com/ru/rss/hub/infosecurity/',
                'https://habr.com/ru/rss/news/'
            ];
            
            const randomRssUrl = RSS_URLS[Math.floor(Math.random() * RSS_URLS.length)];
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(randomRssUrl)}`);
            const data = await response.json();
            
            if (data.status === 'ok' && data.items) {
                // Преобразуем формат RSS в формат новостей
                allNews = data.items.map(item => ({
                    title: item.title,
                    description: item.description,
                    url: item.link,
                    urlToImage: item.thumbnail || 'https://placehold.co/600x400/6e8efb/white?text=Новость',
                    publishedAt: item.pubDate,
                    content: item.content
                }));
                
                displayNews(allNews);
            } else {
                throw new Error('Не удалось загрузить новости из RSS');
            }
        } catch (error) {
            console.error('Ошибка загрузки альтернативных новостей:', error);
            newsContainer.innerHTML = `
                <div class="loading">
                    <p>Ошибка загрузки новостей: ${error.message}</p>
                    <p>Используются демо-данные</p>
                </div>
            `;
            loadDemoNews();
        }
    }
    
    // Демо-новости для fallback
    function loadDemoNews() {
        const demoNews = [
            {
                title: "JavaScript становится все популярнее",
                description: "Согласно последним исследованиям, JavaScript остается самым популярным языком программирования уже 9 лет подряд.",
                url: "#",
                urlToImage: "https://placehold.co/600x400/6e8efb/white?text=JavaScript",
                publishedAt: new Date().toISOString(),
                content: "Подробности о популярности JavaScript в современной веб-разработке."
            },
            {
                title: "Новый прорыв в квантовых вычислениях",
                description: "Ученые объявили о создании квантового процессора с рекордным количеством кубитов.",
                url: "#",
                urlToImage: "https://placehold.co/600x400/a777e3/white?text=Quantum",
                publishedAt: new Date(Date.now() - 86400000).toISOString(),
                content: "Достижения в области квантовых вычислений."
            },
            {
                title: "ИИ научился предсказывать погоду с точностью 99%",
                description: "Новая модель искусственного интеллекта от DeepMind революционизирует метеорологию.",
                url: "#",
                urlToImage: "https://placehold.co/600x400/6e8efb/white?text=AI+Weather",
                publishedAt: new Date(Date.now() - 172800000).toISOString(),
                content: "Применение искусственного интеллекта в метеорологии."
            },
            {
                title: "Обнаружена уязвимость в Windows 11",
                description: "Microsoft выпускает срочное обновление для исправления критической уязвимости нулевого дня.",
                url: "#",
                urlToImage: "https://placehold.co/600x400/a777e3/white?text=Windows+Security",
                publishedAt: new Date(Date.now() - 259200000).toISOString(),
                content: "Вопросы кибербезопасности в операционных системах."
            },
            {
                title: "Релиз React 19: что нового",
                description: "Команда React анонсировала выход новой версии библиотеки с революционными возможностями.",
                url: "#",
                urlToImage: "https://placehold.co/600x400/6e8efb/white?text=React+19",
                publishedAt: new Date(Date.now() - 345600000).toISOString(),
                content: "Новые возможности React 19 для разработчиков."
            },
            {
                title: "Новый алгоритм шифрования ломает все рекорды",
                description: "Разработан метод шифрования, который невозможно взломать даже квантовым компьютерам.",
                url: "#",
                urlToImage: "https://placehold.co/600x400/a777e3/white?text=Encryption",
                publishedAt: new Date(Date.now() - 432000000).toISOString(),
                content: "Достижения в области криптографии и шифрования."
            }
        ];
        
        allNews = demoNews;
        displayNews(allNews);
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
        const newsCards = document.querySelectorAll('.news-card');
        const searchTerm = searchInput.value.toLowerCase();
        
        newsCards.forEach(card => {
            const category = card.dataset.category;
            const title = card.querySelector('.news-title').textContent.toLowerCase();
            const desc = card.querySelector('.news-desc').textContent.toLowerCase();
            
            // Проверяем соответствие фильтру и поисковому запросу
            const categoryMatch = currentFilter === 'all' || category === currentFilter;
            const searchMatch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm);
            
            card.style.display = categoryMatch && searchMatch ? 'block' : 'none';
        });
        
        // Проверяем, есть ли видимые новости
        const visibleNews = Array.from(newsCards).filter(card => card.style.display !== 'none');
        if (visibleNews.length === 0) {
            newsContainer.innerHTML = '<div class="loading">Новости не найдены по вашему запросу</div>';
        }
    }
    
    // Поиск новостей
    searchInput.addEventListener('keyup', filterNews);
    searchButton.addEventListener('click', filterNews);
    
    // Загружаем новости при загрузке страницы
    fetchNews();
});
