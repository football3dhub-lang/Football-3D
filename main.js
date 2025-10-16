document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // وظائف عامة وواجهة المستخدم (UI)
    // =================================================================

    // --- تهيئة مبدل الوضع (داكن/فاتح) ---
    function initializeThemeSwitcher() {
        const themeCheckbox = document.getElementById('theme-checkbox');
        if (!themeCheckbox) return;

        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            themeCheckbox.checked = theme === 'dark';
        };

        themeCheckbox.addEventListener('change', () => {
            const newTheme = themeCheckbox.checked ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        }
    }

    // --- تهيئة مبدل اللغة ---
    function initializeLanguageSwitcher() {
        const switcherContainer = document.getElementById('language-switcher-dropdown');
        if (!switcherContainer) return;

        const languages = [
            { code: 'ar', name: 'العربية', flag: '🇪🇬' },
            { code: 'en', name: 'English', flag: '🇬🇧' },
            { code: 'es', name: 'Español', flag: '🇪🇸' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
        ];
        const translations = {
            ar: { navHome: "الرئيسية", navTeams: "الفرق", navPlayers: "اللاعبين", navStandings: "الترتيب", navStats: "الإحصائيات", navNews: "الأخبار", navAI: "Football 3D AI", navContact: "اتصل بنا", navTransfers: "الانتقالات" },
            en: { navHome: "Home", navTeams: "Teams", navPlayers: "Players", navStandings: "Standings", navStats: "Stats", navNews: "News", navAI: "Football 3D AI", navContact: "Contact Us", navTransfers: "Transfers" },
            es: { navHome: "Inicio", navTeams: "Equipos", navPlayers: "Jugadores", navStandings: "Clasificación", navStats: "Estadísticas", navNews: "Noticias", navAI: "Football 3D AI", navContact: "Contacto", navTransfers: "Fichajes" },
            fr: { navHome: "Accueil", navTeams: "Équipes", navPlayers: "Joueurs", navStandings: "Classement", navStats: "Statistiques", navNews: "Actualités", navAI: "Football 3D AI", navContact: "Contact", navTransfers: "Transferts" },
        };

        function translatePage(lang) {
            const dict = translations[lang] || translations.ar;
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (dict[key]) element.textContent = dict[key];
            });
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
            localStorage.setItem('preferredLanguage', lang);
        }

        const savedLang = localStorage.getItem('preferredLanguage') || 'ar';
        const trigger = switcherContainer.querySelector('.lang-switcher-trigger');
        const optionsList = switcherContainer.querySelector('.lang-switcher-options');

        function updateTrigger(langCode) {
            const lang = languages.find(l => l.code === langCode) || languages[0];
            trigger.innerHTML = `${lang.flag} ${lang.name} <i class="fas fa-chevron-down"></i>`;
        }

        optionsList.innerHTML = languages.map(lang =>
            `<div class="lang-option ${lang.code === savedLang ? 'selected' : ''}" data-lang="${lang.code}">
                ${lang.flag} <span>${lang.name}</span>
            </div>`
        ).join('');

        optionsList.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const newLang = option.dataset.lang;
                translatePage(newLang);
                updateTrigger(newLang);
                optionsList.querySelector('.selected')?.classList.remove('selected');
                option.classList.add('selected');
                switcherContainer.classList.remove('open');
            });
        });

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            switcherContainer.classList.toggle('open');
        });

        document.addEventListener('click', () => switcherContainer.classList.remove('open'));

        updateTrigger(savedLang);
        translatePage(savedLang);
    }

    // --- تهيئة الساعة العالمية ---
    function initializeWorldClock() {
        const clockDropdown = document.getElementById('world-clock-dropdown');
        if (!clockDropdown) return;

        const cities = [
            { name: 'القاهرة', timeZone: 'Africa/Cairo', flag: '🇪🇬' },
            { name: 'لندن', timeZone: 'Europe/London', flag: '🇬🇧' },
            { name: 'مدريد', timeZone: 'Europe/Madrid', flag: '🇪🇸' },
            { name: 'الرياض', timeZone: 'Asia/Riyadh', flag: '🇸🇦' },
        ];

        const optionsContainer = clockDropdown.querySelector('.world-clock-options');
        const trigger = clockDropdown.querySelector('.world-clock-trigger');

        function updateClocks() {
            const now = new Date();
            optionsContainer.innerHTML = cities.map(city => {
                const timeString = now.toLocaleTimeString('en-US', { timeZone: city.timeZone, hour: '2-digit', minute: '2-digit', hour12: false });
                return `<div class="world-clock-item"><span>${city.flag} ${city.name}</span><strong>${timeString}</strong></div>`;
            }).join('');
        }

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            clockDropdown.classList.toggle('open');
        });

        document.addEventListener('click', () => clockDropdown.classList.remove('open'));

        updateClocks();
        setInterval(updateClocks, 60000);
    }

    // --- تهيئة الملعب ثلاثي الأبعاد ---
    function initThreeJS() {
        const container = document.getElementById('pitch-3d');
        if (!container || !window.THREE) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        scene.add(directionalLight);

        // أرضية الملعب
        const pitchGeometry = new THREE.PlaneGeometry(20, 30);
        const pitchMaterial = new THREE.MeshStandardMaterial({ color: 0x22c55e });
        const pitch = new THREE.Mesh(pitchGeometry, pitchMaterial);
        pitch.rotation.x = -Math.PI / 2;
        scene.add(pitch);

        // خطوط الملعب
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const points = [
            new THREE.Vector3(-10, 0.01, -15), new THREE.Vector3(10, 0.01, -15),
            new THREE.Vector3(10, 0.01, 15), new THREE.Vector3(-10, 0.01, 15),
            new THREE.Vector3(-10, 0.01, -15), new THREE.Vector3(-10, 0.01, 15),
            new THREE.Vector3(10, 0.01, -15), new THREE.Vector3(10, 0.01, 15),
            new THREE.Vector3(-10, 0.01, 0), new THREE.Vector3(10, 0.01, 0)
        ];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const fieldLines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(fieldLines);

        // دائرة المنتصف
        const circleGeometry = new THREE.RingGeometry(2.8, 3, 64);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const centerCircle = new THREE.Mesh(circleGeometry, circleMaterial);
        centerCircle.rotation.x = -Math.PI / 2;
        centerCircle.position.y = 0.01;
        scene.add(centerCircle);

        // الكرة
        const ballGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.1 });
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        ball.position.set(0, 0.3, 0);
        scene.add(ball);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        camera.position.set(0, 10, 18);
        controls.update();

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    // --- تهيئة الروابط النشطة في شريط التنقل ---
    function initializeActiveNavLinks() {
        const currentPage = window.location.pathname.split("/").pop() || 'index.html';
        const navLinks = document.querySelectorAll('header nav a');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split("/").pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // =================================================================
    // الإعدادات العامة والوظائف المساعدة
    // =================================================================

    const API_HOST = 'v3.football.api-sports.io';

    const API_HEADERS = { 'x-rapidapi-host': API_HOST, 'x-rapidapi-key': (typeof API_CONFIG !== 'undefined') ? API_CONFIG.KEY : '' };
    async function fetchData(endpoint, params = {}) {
        // التحقق من مفتاح الـ API قبل كل طلب
        if (typeof API_CONFIG === 'undefined' || !API_CONFIG.KEY || API_CONFIG.KEY === "YOUR_API_KEY") {
            console.error("خطأ: مفتاح الـ API غير موجود أو غير صحيح في ملف config.js");
            return null; // إيقاف الطلب إذا كان المفتاح غير صالح
        }

        const url = new URL(`https://${API_HOST}/${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        try {
            const response = await fetch(url, { headers: API_HEADERS });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.errors && Object.keys(data.errors).length > 0) {
                console.error('API Errors:', data.errors);
                return null;
            }
            return data.response;
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    // دالة لعرض رسالة تحميل
    function showLoader(container) {
        container.innerHTML = '<div class="loader"></div>';
    }
    // =================================================================
    // تهيئة الصفحة الرئيسية (index.html)
    // =================================================================
    // جلب وعرض مباريات اليوم
    async function initializeScoreboard() {
        const scoreboardGrid = document.querySelector('.scoreboard-grid');
        if (!scoreboardGrid) return;

        showLoader(scoreboardGrid);

        const today = new Date().toISOString().slice(0, 10);
        const fixtures = await fetchData('fixtures', { date: today, first: '20' });

        if (!fixtures || fixtures.length === 0) {
            scoreboardGrid.innerHTML = '<p>لا توجد مباريات اليوم.</p>';
            return;
        }

        scoreboardGrid.innerHTML = fixtures.map(fixture => {
            const homeTeam = fixture.teams.home;
            const awayTeam = fixture.teams.away;
            const goals = fixture.goals;
            const status = fixture.fixture.status;

            return `
                <div class="match-card">
                    <div class="match-header">
                        <img src="${fixture.league.logo}" alt="${fixture.league.name}" class="league-logo" loading="lazy">
                        <span>${fixture.league.name}</span>
                    </div>
                    <div class="match-content">
                        <div class="team">
                            <img src="${homeTeam.logo}" alt="${homeTeam.name}" loading="lazy">
                            <span>${homeTeam.name}</span>
                        </div>
                        <div class="score">
                            ${status.short === 'FT' ? `${goals.home} - ${goals.away}` : new Date(fixture.fixture.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                            <div class="match-status">${status.long}</div>
                        </div>
                        <div class="team">
                            <img src="${awayTeam.logo}" alt="${awayTeam.name}" loading="lazy">
                            <span>${awayTeam.name}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // جلب وعرض اللاعبين المميزين
    async function initializeFeaturedPlayers() {
        const playersGrid = document.getElementById('featured-players-grid');
        if (!playersGrid) return;

        showLoader(playersGrid);

        // مثال: جلب أفضل هدافي دوري أبطال أوروبا للموسم الحالي
        const season = new Date().getFullYear();
        const topScorers = await fetchData('players/topscorers', { league: '2', season: season });
        if (!topScorers || topScorers.length === 0) {
            playersGrid.innerHTML = '<p>لا يمكن تحميل بيانات اللاعبين حالياً.</p>';
            return;
        }

        playersGrid.innerHTML = topScorers.slice(0, 4).map(data => {
            const player = data.player;
            const stats = data.statistics[0];
            return `
                <div class="player-card">
                    <div class="player-image">
                        <img src="${player.photo}" alt="${player.name}" loading="lazy">
                    </div>
                    <div class="player-info">
                        <h3 class="player-name">${player.name}</h3>
                        <p class="player-team">${stats.team.name}</p>
                        <div class="player-stats">
                            <div><i class="fas fa-futbol"></i> ${stats.goals.total || 0} أهداف</div>
                            <div><i class="fas fa-user-friends"></i> ${stats.goals.assists || 0} صناعة</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
}

    // جلب وعرض الإحصائيات العامة
    async function initializeHomepageStats() {
        const statGoals = document.querySelector('#stat-goals .stat-number');
        const statPlayers = document.querySelector('#stat-players .stat-number');
        const statTeams = document.querySelector('#stat-teams .stat-number');
        const statLeagues = document.querySelector('#stat-leagues .stat-number');

        if (statGoals) {
            // مثال: جلب عدد الأهداف في الدوري الإنجليزي هذا الموسم
            const season = new Date().getFullYear();
            const fixtures = await fetchData('fixtures', { league: '39', season: season, first: '1' });
            // هذه القيمة ليست دقيقة 100% لكنها مثال توضيحي
            if (fixtures) statGoals.textContent = '2500+'; 
        }
        if (statPlayers) statPlayers.textContent = '65,000+'; // قيمة تقديرية
        if (statTeams) statTeams.textContent = '4,000+'; // قيمة تقديرية
        if (statLeagues) {
            const leagues = await fetchData('leagues');
            if (leagues) statLeagues.textContent = leagues.length;
        }
    }

    // =================================================================
    // تهيئة صفحة الإحصائيات (stats.html)
    // =================================================================
    let topScorersChart = null;

    async function initializeStatsPage() {
        const statsSection = document.getElementById('player-stats-section');
        if (!statsSection) return;

        const leagueSelectorWrapper = document.querySelector('.league-select-wrapper');
        const seasonSelectorWrapper = document.querySelector('.season-select-wrapper');
        
        // إنشاء قائمة اختيار الدوريات
        const leagues = [
            { id: 39, name: 'الدوري الإنجليزي' },
            { id: 140, name: 'الدوري الإسباني' },
            { id: 135, name: 'الدوري الإيطالي' },
            { id: 78, name: 'الدوري الألماني' },
            { id: 61, name: 'الدوري الفرنسي' },
            { id: 2, name: 'دوري أبطال أوروبا' }
        ];
        const leagueSelect = document.createElement('select');
        leagueSelect.id = 'league-select';
        leagues.forEach(league => {
            leagueSelect.innerHTML += `<option value="${league.id}">${league.name}</option>`;
        });
        leagueSelectorWrapper.appendChild(leagueSelect);

        // إنشاء قائمة اختيار المواسم
        const seasonSelect = document.createElement('select');
        seasonSelect.id = 'season-select';
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= 2018; year--) {
            seasonSelect.innerHTML += `<option value="${year}">${year}-${year + 1}</option>`;
        }
        seasonSelectorWrapper.appendChild(seasonSelect);

        // جلب البيانات عند تغيير الاختيار
        leagueSelect.addEventListener('change', () => fetchAndDisplayTopScorers());
        seasonSelect.addEventListener('change', () => fetchAndDisplayTopScorers());
        // الجلب الأولي للبيانات
        fetchAndDisplayTopScorers();
    }

    async function fetchAndDisplayTopScorers() {
        const leagueId = document.getElementById('league-select').value;
        const season = document.getElementById('season-select').value;
        const leagueName = document.getElementById('league-select').options[document.getElementById('league-select').selectedIndex].text;

        const statsBody = document.getElementById('stats-body');
        const leagueNameTitle = document.getElementById('stats-league-name');
        const chartCanvas = document.getElementById('top-scorers-chart');

        if (!statsBody || !leagueNameTitle || !chartCanvas) return;

        statsBody.innerHTML = `<tr><td colspan="11"><div class="loader"></div></td></tr>`;
        leagueNameTitle.textContent = `قائمة هدافي ${leagueName} - موسم ${season}`;

        const topScorers = await fetchData('players/topscorers', { league: leagueId, season: season });

        if (!topScorers || topScorers.length === 0) {
            statsBody.innerHTML = `<tr><td colspan="11">لا توجد بيانات متاحة لهذا الدوري أو الموسم.</td></tr>`;
            if (topScorersChart) topScorersChart.destroy();
            return;
        }

        statsBody.innerHTML = topScorers.map((data, index) => {
            const player = data.player;
            const stats = data.statistics[0];
            const birthDate = new Date(player.birth.date).toLocaleDateString('ar-EG');

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td class="player-cell">
                        <img src="${player.photo}" alt="${player.name}" class="player-photo" loading="lazy">
                        ${player.name}
                    </td>
                    <td class="team-cell">
                        <img src="${stats.team.logo}" alt="${stats.team.name}" class="team-logo-small" loading="lazy">
                        ${stats.team.name}
                    </td>
                    <td>${stats.games.position || 'N/A'}</td>
                    <td>${birthDate}</td>
                    <td>${stats.games.appearences || 0}</td>
                    <td><strong>${stats.goals.total || 0}</strong></td>
                    <td>${stats.goals.assists || 0}</td>
                    <td>${stats.shots.total || 0}</td>
                    <td>${stats.penalty.scored || 0} / ${stats.penalty.total || 0}</td>
                    <td>${parseFloat(stats.games.rating || 0).toFixed(1)}</td>
                </tr>
            `;
        }).join('');

        // تحديث الرسم البياني
        updateTopScorersChart(topScorers.slice(0, 10));
    }

    function updateTopScorersChart(top10) {
        const ctx = document.getElementById('top-scorers-chart').getContext('2d');
        
        const labels = top10.map(p => p.player.name);
        const goalsData = top10.map(p => p.statistics[0].goals.total);
        const assistsData = top10.map(p => p.statistics[0].goals.assists);

        if (topScorersChart) {
            topScorersChart.destroy();
        }

        topScorersChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'الأهداف',
                        data: goalsData,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'صناعة الأهداف',
                        data: assistsData,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                family: "'Cairo', sans-serif"
                            }
                        }
                    },
                    tooltip: {
                        bodyFont: {
                            family: "'Cairo', sans-serif"
                        },
                        titleFont: {
                            family: "'Cairo', sans-serif"
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 5
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: "'Cairo', sans-serif"
                            }
                        }
                    }
                },
            }
        });
    }

    // =================================================================
    // وظائف عامة (مثل الساعة، تبديل اللغة، إلخ)
    // =================================================================
    
    // ... (يمكن إضافة باقي أكواد الساعة واللغة هنا لاحقاً) ...
    
    // زر العودة للأعلى
    const backToTopButton = document.getElementById("back-to-top");
    window.onscroll = function() {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    };
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // إشعار ملفات تعريف الارتباط
    const cookieNotice = document.getElementById('cookie-notice');
    const cookieAcceptBtn = document.getElementById('cookie-accept-btn');
    if (!localStorage.getItem('cookieAccepted')) {
        cookieNotice.style.display = 'block';
    }
    cookieAcceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieAccepted', 'true');
        cookieNotice.style.display = 'none';
    });

    // إغلاق الإعلان
    const adWidgetClose = document.getElementById('ad-widget-close');
    const adWidget = document.getElementById('ad-widget');
    if(adWidgetClose && adWidget) {
        adWidgetClose.addEventListener('click', () => {
            adWidget.style.display = 'none';
        });
    }

    // تهيئة الوظائف العامة التي تعمل في كل الصفحات
    initializeThemeSwitcher();
    initializeLanguageSwitcher();
    initializeWorldClock();
    initializeActiveNavLinks();

    // تحديد الصفحة الحالية لتشغيل الكود المناسب
 
    // =================================================================
    // تهيئة صفحة Football 3D AI (football-ai.html)
    // =================================================================
    async function initializeFootballAI() {
        const chatPage = document.getElementById('football-ai-page');
        if (!chatPage) return;
 
        const chatMessages = document.getElementById("chat-messages");
        const userInput = document.getElementById("chat-input");
        const sendBtn = document.getElementById("send-btn");
        const suggestionBtns = document.querySelectorAll('.suggestion-btn');
        const newChatBtn = document.getElementById('new-chat-btn');
        const micBtn = document.getElementById('mic-btn');
 
        // --- Load chat history from localStorage ---
        const CHAT_HISTORY_KEY = 'football-ai-chat-history';
        let chatHistory = JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY)) || [];
 
        // --- Function to create and display a message ---
        function displayMessage(message, sender) { // sender can be 'user' or 'model'
 
            const messageElement = document.createElement("div");
            messageElement.classList.add("message", sender === 'user' ? "user-message" : "ai-message");
 
            // Add copy button for AI messages
            const copyButtonHTML = sender !== 'user' ? `
                <button class="copy-btn" title="نسخ الرد">
                    <i class="far fa-copy"></i>
                </button>
            ` : '';
 
            const iconHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
            
            messageElement.innerHTML =  `
                <div class="message-icon">
                    ${iconHTML}
                </div>
                <div class="message-content">
                    ${copyButtonHTML}
                    <div class="message-text-content"></div>
                </div>
            `;

            // تعيين النص بشكل آمن لتجنب مشاكل HTML
            messageElement.querySelector('.message-text-content').textContent = message;

            // Add event listener for the copy button
            if (sender !== 'user') {
                const copyBtn = messageElement.querySelector('.copy-btn');
                if (copyBtn) {
                    copyBtn.addEventListener('click', (e) => copyToClipboard(message, e));
                }
            }

            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
        }

        // --- Function to show typing indicator ---
        function showTypingIndicator() {
            const typingElement = document.createElement("div");
            typingElement.id = "typing-indicator";
            typingElement.classList.add("message", "ai-message");
            typingElement.innerHTML = `
                <div class="message-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
                </div>
            `;
            chatMessages.appendChild(typingElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
 
        // --- Function to remove typing indicator ---
        function removeTypingIndicator() {
            const indicator = document.getElementById("typing-indicator");
            if (indicator) {
                indicator.remove();
            }
        }
 
        // --- Function to save chat history ---
        function saveChatHistory() {
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
        }
 
        // --- Function to copy text to clipboard ---
        function copyToClipboard(text, event) {
            navigator.clipboard.writeText(text).then(() => {
                // Optional: Show a temporary "Copied!" message
                const copyBtn = event.target.closest('.copy-btn');
                if (copyBtn) {
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => { copyBtn.innerHTML = '<i class="far fa-copy"></i>'; }, 2000);
                }
            }).catch(err => console.error('Failed to copy: ', err));
        }

        // --- Function to fetch response from the AI backend ---
        async function fetchResponse(userMessage) {
            const API_URL = "/.netlify/functions/ai-proxy";

            // رسالة النظام التي ستبدأ بها كل محادثة جديدة
            const systemInstruction = {
                role: "user", // هذه هي التعليمات التي تحدد شخصية الذكاء الاصطناعي
                parts: [{ text: "أنت 'نونو شات'، مساعد كرة قدم ذكي وودود لموقع Football3D AI. مهمتك هي التفاعل مع المستخدمين باللغة العربية بأسلوب سلس وطبيعي. يجب أن تبدأ كل رد بإيموجي كرة قدم (⚽) ثم مسافة. أجب على الأسئلة المتعلقة بكرة القدم (المباريات، الفرق، اللاعبين، التحليلات) بالإضافة إلى الأسئلة العامة. حافظ على ردودك قصيرة ومباشرة ومفهومة، وتجنب المصطلحات المعقدة. كن مهذباً دائماً. لا تتحدث عن مواضيع خارجة عن كرة القدم والمساعدة العامة." }]
            };
            const systemResponse = {
                role: "model",
                parts: [{ text: "⚽ أهلاً بيك، أنا نونو شات، مساعد كرة القدم الذكي! إسألني عن أي ماتش أو فريق تحب تعرف عنه." }]
            };

            // إذا كانت المحادثة جديدة، أضف رسالة النظام
            const historyForAPI = chatHistory.length === 0 ? [systemInstruction, systemResponse] : chatHistory;

            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        history: historyForAPI,
                        message: userMessage
                    })
                });
 
                if (!response.ok) {
                    console.error("API Error:", response.status, response.statusText);
                    const errorData = await response.json();
                    return errorData.message || "عذراً، حدث خطأ أثناء الاتصال بالخبير. يرجى المحاولة مرة أخرى لاحقاً.";
                }
 
                const data = await response.json();
                return data.text;

            } catch (error) {
                console.error("Fetch Error:", error);
                return "عذراً، هناك مشكلة في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.";
            }
        }
 
        async function handleSendMessage() {
            const userMessage = userInput.value.trim();
            if (!userMessage) return;
 
            displayMessage(userMessage, 'user');
            chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });
            saveChatHistory();
 
            userInput.value = "";
            userInput.style.height = 'auto'; // Reset height
 
            showTypingIndicator();
 
            const botResponse = await fetchResponse(userMessage);
            
            chatHistory.push({ role: 'model', parts: [{ text: botResponse }] });
            saveChatHistory();
            
            removeTypingIndicator();
            displayMessage(botResponse, 'model');
        }
 
        // --- Event Listeners ---
        sendBtn.addEventListener("click", handleSendMessage);
        userInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage();
            }
        });

        // زر محادثة جديدة
        newChatBtn.addEventListener('click', () => {
            if (confirm('هل أنت متأكد أنك تريد بدء محادثة جديدة؟ سيتم حذف السجل الحالي.')) {
                chatHistory = []; // مسح السجل
                saveChatHistory();
                chatMessages.innerHTML = ''; // مسح الرسائل من الشاشة
                // عرض رسالة الترحيب الافتراضية
                displayMessage('⚽ أهلاً بيك، أنا نونو شات، مساعد كرة القدم الذكي! إسألني عن أي ماتش أو فريق تحب تعرف عنه.', 'model');
            }
        });

        // زر الميكروفون (وظيفة أساسية)
        micBtn.addEventListener('click', () => { alert('ميزة الإدخال الصوتي قيد التطوير حالياً!'); });
 
        // Handle suggested questions
        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                userInput.value = btn.textContent;
                handleSendMessage();
            });
        });
 
        // Auto-resize textarea
        userInput.addEventListener('input', () => {
            userInput.style.height = 'auto';
            userInput.style.height = (userInput.scrollHeight) + 'px';
        });
 
        // --- Load and display initial chat history ---
        function loadInitialHistory() {
            if (chatHistory.length === 0) {
                displayMessage('⚽ أهلاً بيك، أنا نونو شات، مساعد كرة القدم الذكي! إسألني عن أي ماتش أو فريق تحب تعرف عنه.', 'model');
            } else {
                chatHistory.forEach(msg => displayMessage(msg.parts[0].text, msg.role));
            }
        }
        loadInitialHistory();
    }
 
    // تحديد الصفحة الحالية وتشغيل الكود المناسب
    const currentPage = window.location.pathname.split("/").pop() || 'index.html';

    if (currentPage === 'index.html' || currentPage === '') {
        initializeScoreboard();
        initializeFeaturedPlayers();
        initializeHomepageStats();
        setTimeout(initThreeJS, 100); 
    } else if (currentPage === 'stats.html' || currentPage === 'stats') {
        initializeStatsPage();
    } else if (currentPage === 'football-ai.html' || currentPage === 'football-ai') {
        initializeFootballAI();
    }

});