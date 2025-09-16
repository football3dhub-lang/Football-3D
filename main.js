// تهيئة المشهد ثلاثي الأبعاد
function initThreeJS() {
    const container = document.getElementById('pitch-3d');
    if (!container) return; // لا تقم بتشغيل الكود إذا لم يكن العنصر موجوداً

    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // إنشاء المشهد والكاميرا والعرض
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    
    // إضافة الإضاءة
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // إنشاء ملعب كرة قدم
    createFootballPitch(scene);
    
    // إضافة عناصر التحكم بالمشهد
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // ضبط وضع الكاميرا
    camera.position.set(0, 8, 12);
    controls.update();
    
    // دورة العرض
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    // إعادة ضبط الأبعاد عند تغيير حجم النافذة
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize(newWidth, newHeight);
    });
}

// إنشاء ملعب كرة قدم
function createFootballPitch(scene) {
    // إنشاء أرضية الملعب
    const pitchGeometry = new THREE.PlaneGeometry(20, 30);
    const pitchMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x22c55e,
        roughness: 0.8,
        metalness: 0.2
    });
    const pitch = new THREE.Mesh(pitchGeometry, pitchMaterial);
    pitch.rotation.x = -Math.PI / 2;
    scene.add(pitch);
    
    // إضافة خطوط الملعب
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    
    // خط منتصف الملعب
    const midLinePoints = [
        new THREE.Vector3(0, 0.1, -15),
        new THREE.Vector3(0, 0.1, 15)
    ];
    const midLineGeometry = new THREE.BufferGeometry().setFromPoints(midLinePoints);
    const midLine = new THREE.Line(midLineGeometry, lineMaterial);
    scene.add(midLine);
    
    // دائرة منتصف الملعب
    const circleGeometry = new THREE.RingGeometry(3, 3.2, 32);
    const circleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        side: THREE.DoubleSide 
    });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.rotation.x = -Math.PI / 2;
    circle.position.y = 0.1;
    scene.add(circle);
    
    // إضافة المرمى
    const goalGeometry = new THREE.BoxGeometry(5, 2, 1);
    const goalMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.7,
        metalness: 0.3
    });
    
    const goal1 = new THREE.Mesh(goalGeometry, goalMaterial);
    goal1.position.set(0, 1, -14.5);
    scene.add(goal1);
    
    const goal2 = new THREE.Mesh(goalGeometry, goalMaterial);
    goal2.position.set(0, 1, 14.5);
    scene.add(goal2);
    
    // إضافة بعض اللاعبين
    addPlayer(scene, -3, 0, -5, 0x1e40af);
    addPlayer(scene, 3, 0, -5, 0x1e40af);
    addPlayer(scene, 0, 0, -8, 0x1e40af);
    addPlayer(scene, -3, 0, 5, 0xdc2626);
    addPlayer(scene, 3, 0, 5, 0xdc2626);
    addPlayer(scene, 0, 0, 8, 0xdc2626);
    
    // إضافة كرة
    const ballGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.8
    });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, 0.4, 0);
    scene.add(ball);
}

// إضافة لاعب إلى الملعب
function addPlayer(scene, x, y, z, color) {
    const playerGroup = new THREE.Group();
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: color });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    playerGroup.add(body);
    
    const headGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xfcd34d });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.8;
    playerGroup.add(head);

    playerGroup.position.set(x, y, z);
    scene.add(playerGroup);
}

// بدء تحميل المشهد ثلاثي الأبعاد عند تحميل الصفحة
initThreeJS();

function initializeActiveNavLinks() {
    // اسم الملف الرئيسي الذي يعمل كصفحة البداية
    const homePageFile = 'blackbox-output-code-RTX7MLD937.html';
    // احصل على اسم الملف للصفحة الحالية من الرابط
    const currentPage = window.location.pathname.split("/").pop();
    // اختر جميع روابط التنقل في الرأس والتذييل
    const navLinks = document.querySelectorAll('header nav a, .footer-links a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split("/").pop();
        // تحقق إذا كان رابط الصفحة يطابق الصفحة الحالية، أو إذا كانت الصفحة الحالية هي الرئيسية
        if (linkPage === currentPage || (currentPage === '' && linkPage === homePageFile)) {
            link.classList.add('active');
        }
    });
}

function initializeCookieNotice() {
    const cookieNotice = document.getElementById('cookie-notice');
    const acceptBtn = document.getElementById('cookie-accept-btn');

    if (!cookieNotice || !acceptBtn) return;

    // تحقق مما إذا كان المستخدم قد وافق بالفعل
    if (!localStorage.getItem('cookiesAccepted')) {
        cookieNotice.classList.add('show');
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieNotice.classList.remove('show');
    });
}

function initializePlayerSearch() {
    const searchInput = document.getElementById('player-search');
    if (!searchInput) return;

    const playerCards = document.querySelectorAll('.player-card');

    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        playerCards.forEach(card => {
            const playerName = card.querySelector('.player-name').textContent.toLowerCase();
            
            if (playerName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

function initializeLiveMatches() {
    const scoreboardGrid = document.querySelector('.scoreboard-grid');
    if (!scoreboardGrid) return;

    // مفتاح API لخدمة api-football (api-sports)
    const API_KEY = 'fc4a47e7f3c9e852d56c26a1b699a10c';
    // جلب مباريات اليوم
    const today = new Date().toISOString().slice(0, 10);
    const API_URL = `https://v3.football.api-sports.io/fixtures?date=${today}`;

    // دالة لجلب البيانات
    async function fetchMatches() {
        // مسح المحتوى التجريبي أولاً
        scoreboardGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">جاري تحميل المباريات...</p>';

        try {
            const response = await fetch(API_URL, {
                headers: {
                    'x-apisports-key': API_KEY
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.response && data.response.length > 0) {
                displayMatches(data.response.slice(0, 6)); // عرض أول 6 مباريات فقط
            } else {
                console.error("API Error:", data.message || 'No matches found');
                scoreboardGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">لا توجد مباريات اليوم أو حدث خطأ. تأكد من صحة مفتاح الـ API.</p>';
            }

        } catch (error) {
            console.error("Could not fetch matches:", error);
            scoreboardGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">عفواً، حدث خطأ أثناء تحميل المباريات. تأكد من اتصالك بالإنترنت وصحة مفتاح الـ API.</p>';
        }
    }

    // دالة لعرض المباريات في الصفحة
    function displayMatches(matches) {
        scoreboardGrid.innerHTML = ''; // مسح رسالة التحميل
        matches.forEach(matchData => {
            const fixture = matchData.fixture;
            const league = matchData.league;
            const teams = matchData.teams;
            const goals = matchData.goals;

            const live_statuses = ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE'];
            const finished_statuses = ['FT', 'AET', 'PEN'];
            
            let matchStatus;
            if (live_statuses.includes(fixture.status.short)) {
                matchStatus = 'live';
            } else if (finished_statuses.includes(fixture.status.short)) {
                matchStatus = 'finished';
            } else {
                matchStatus = 'upcoming';
            }

            const score = (matchStatus === 'live' || matchStatus === 'finished') 
                ? `${goals.home ?? 0} - ${goals.away ?? 0}` 
                : 'VS';

            let time;
            if (matchStatus === 'live') {
                time = `'${fixture.status.elapsed}`;
            } else if (matchStatus === 'finished') {
                time = 'انتهت';
            } else { // upcoming
                time = new Date(fixture.date).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'});
            }

            const matchCardHTML = `
                <div class="match-card ${matchStatus}">
                    <div class="match-header">${league.name}</div>
                    <div class="match-body">
                        <div class="team"><img src="${teams.home.logo}" alt="${teams.home.name}" class="team-logo"><span>${teams.home.name}</span></div>
                        <div class="score">${score}</div>
                        <div class="team"><img src="${teams.away.logo}" alt="${teams.away.name}" class="team-logo"><span>${teams.away.name}</span></div>
                    </div>
                    <div class="match-footer"><span class="match-time">${time}</span></div>
                </div>`;
            scoreboardGrid.insertAdjacentHTML('beforeend', matchCardHTML);
        });
    }

    fetchMatches();
}

function initializeStandings() {
    const standingsContainer = document.getElementById('standings');
    if (!standingsContainer) return;

    // --- Custom Select Logic ---
    const customSelectWrapper = document.querySelector('.custom-select-wrapper');
    if (!customSelectWrapper) return;

    const customSelect = customSelectWrapper.querySelector('.custom-select');
    const trigger = customSelect.querySelector('.custom-select__trigger');
    const options = customSelect.querySelectorAll('.custom-option');

    trigger.addEventListener('click', () => {
        customSelect.classList.toggle('open');
    });

    window.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove('open');
        }
    });

    options.forEach(option => {
        option.addEventListener('click', function() {
            if (!this.classList.contains('selected')) {
                const previouslySelected = customSelect.querySelector('.custom-option.selected');
                if (previouslySelected) {
                    previouslySelected.classList.remove('selected');
                }
                this.classList.add('selected');
                trigger.querySelector('span').textContent = this.textContent;
                fetchStandings(this.dataset.value);
            }
            customSelect.classList.remove('open');
        });
    });
    // --- End Custom Select Logic ---

    const standingsBody = document.getElementById('standings-body');
    const leagueNameTitle = document.getElementById('standings-league-name');
    const API_KEY = 'fc4a47e7f3c9e852d56c26a1b699a10c';
    const SEASON = 2023; // عرض بيانات موسم 2023-2024

    async function fetchStandings(leagueId) {
        // التأكد من وجود العناصر
        if (!standingsBody || !leagueNameTitle) return;

        // تحديث العنوان وعرض حالة التحميل فوراً
        const selectedOption = customSelect.querySelector(`.custom-option[data-value="${leagueId}"]`);
        if (selectedOption) {
            leagueNameTitle.textContent = `جدول ترتيب: ${selectedOption.textContent} - موسم ${SEASON}/${SEASON + 1}`;
        }
        standingsBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 40px 0;">جاري تحميل البيانات... <i class="fas fa-spinner fa-spin"></i></td></tr>`;


        const API_URL = `https://v3.football.api-sports.io/standings?league=${leagueId}&season=${SEASON}`;

        try {
            const response = await fetch(API_URL, {
                headers: { 'x-apisports-key': API_KEY }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.response && data.response.length > 0 && data.response[0].league.standings.length > 0) {
                const standings = data.response[0].league.standings[0];
                displayStandings(standings);
            } else {
                console.error("API Error:", data.errors || 'No standings found');
                standingsBody.innerHTML = `<tr><td colspan="8" style="text-align: center;">لا توجد بيانات ترتيب لهذا الدوري حالياً.</td></tr>`;
            }

        } catch (error) {
            console.error("Could not fetch standings:", error);
            standingsBody.innerHTML = `<tr><td colspan="8" style="text-align: center;">عفواً، حدث خطأ أثناء تحميل البيانات.</td></tr>`;
        }
    }

    function displayStandings(standings) {
        standingsBody.innerHTML = ''; // مسح رسالة التحميل
        standings.forEach(teamData => {
            const team = teamData.team;
            const row = `
                <tr>
                    <td>${teamData.rank}</td>
                    <td class="team-name-cell"><img src="${team.logo}" alt="${team.name}"> ${team.name}</td>
                    <td>${teamData.all.played}</td>
                    <td>${teamData.all.win}</td>
                    <td>${teamData.all.draw}</td>
                    <td>${teamData.all.lose}</td>
                    <td>${teamData.goalsDiff}</td>
                    <td class="points">${teamData.points}</td>
                </tr>
            `;
            standingsBody.insertAdjacentHTML('beforeend', row);
        });
    }

    // جلب بيانات الدوري المحدد افتراضياً عند تحميل الصفحة
    const initialSelected = customSelect.querySelector('.custom-option.selected');
    if (initialSelected) {
        fetchStandings(initialSelected.dataset.value);
    }
}

function initializePlayerStats() {
    const statsSection = document.getElementById('player-stats-section');
    if (!statsSection) return; // تأكد من أننا في صفحة الإحصائيات فقط
    const statsBody = statsSection.querySelector('#stats-body');
    if (!statsBody) return;

    // تم تضمين بيانات CSV هنا مباشرة لتجنب مشاكل تحميل الملفات المحلية بسبب قيود أمان المتصفح.
    const csvData = `Id;Name;Firstname;Lastname;Age;Birth date;Birth place;Birth country;Nationality;Height;Weight;Injured;Photo;Team id;Team name;Team logo;League id;League name;League country;League logo;League flag;League season;Games appearences;Games lineups;Games minutes;Games number;Games position;Games rating;Games captain;Substitutes in;Substitutes out;Substitutes bench;Shots total;Shots on;Goals total;Goals conceded;Goals assists;Goals saves;Passes total;Passes key;Passes accuracy;Tackles total;Tackles blocks;Tackles interceptions;Duels total;Duels won;Dribbles attempts;Dribbles success;Dribbles past;Fouls drawn;Fouls committed;Cards yellow;Cards yellowred;Cards red;Penalty won;Penalty commited;Penalty scored;Penalty missed;Penalty saved
141;M. Wagué;Moussa;Wagué;23;1998-10-04;Bignona;Senegal;Senegal;177 cm;70 kg;;https://media.api-sports.io/football/players/141.png;13;Senegal;https://media.api-sports.io/football/teams/13.png;1;World Cup;World;https://media.api-sports.io/football/leagues/1.png;;2018;3;2;196;;Defender;6.766666;;1;0;1;1;1;1;0;;;62;4;16;3;;4;12;7;3;3;;1;1;0;0;0;;;0;0;
468;V. Ćorluka;Vedran;Ćorluka;35;1986-02-05;Derventa;Bosnia and Herzegovina;Croatia;192 cm;84 kg;;https://media.api-sports.io/football/players/468.png;3;Croatia;https://media.api-sports.io/football/teams/3.png;1;World Cup;World;https://media.api-sports.io/football/leagues/1.png;;2018;4;1;118;;Defender;6.900000;;3;0;6;;;0;0;;;64;;14;1;;3;14;9;3;3;;;3;1;0;0;;;0;0;
868;S. Khedira;Sami;Khedira;34;1987-04-04;Stuttgart;Germany;Germany;189 cm;90 kg;;https://media.api-sports.io/football/players/868.png;25;Germany;https://media.api-sports.io/football/teams/25.png;1;World Cup;World;https://media.api-sports.io/football/leagues/1.png;;2018;2;2;118;;Midfielder;6.600000;;0;2;1;1;1;0;0;;;104;1;43;4;;1;19;7;2;1;;1;2;0;0;0;;;0;0;
878;M. Mandžukić;Mario;Mandžukić;35;1986-05-21;Slavonski Brod;Croatia;Croatia;190 cm;85 kg;;https://media.api-sports.io/football/players/878.png;3;Croatia;https://media.api-sports.io/football/teams/3.png;1;World Cup;World;https://media.api-sports.io/football/leagues/1.png;;2018;6;6;609;;Attacker;7.333333;;0;4;1;11;5;3;0;1;;176;8;19;12;1;2;101;53;3;2;;12;13;2;0;0;;;0;0;
2751;M. Leckie;Mathew Allan;Leckie;30;1991-02-04;Melbourne;Australia;Australia;181 cm;82 kg;;https://media.api-sports.io/football/players/2751.png;20;Australia;https://media.api-sports.io/football/teams/20.png;1;World Cup;World;https://media.api-sports.io/football/leagues/1.png;;2018;3;3;270;;Midfielder;6.300000;;0;0;0;6;1;0;0;;;77;2;17;2;;2;60;29;10;5;;5;6;1;0;0;;;0;0;
19243;M. Obi;Mikel John;Obi;34;1987-04-22;Jos;Nigeria;Nigeria;188 cm;86 kg;;https://media.api-sports.io/football/players/19243.png;19;Nigeria;https://media.api-sports.io/football/teams/19.png;1;World Cup;World;https://media.api-sports.io/football/leagues/1.png;;2018;3;3;268;;Midfielder;6.633333;;0;1;0;;;0;0;;;149;3;40;8;;2;40;20;7;4;;1;5;1;0;0;;;0;0;
50741;M. Fabián;Marco Jhonfai;Fabián De La Mora;32;1989-07-21;Guadalajara;Mexico;Mexico;170 cm;65 kg;;https://media.api-sports.io/football/players/50741.png;16;Mexico;https://media.api-sports.io/football/teams/16.png;1;World Cup;World;https://media.api-sports.io/football/leagues/1.png;;2018;1;0;25;;Midfielder;6.700000;;1;0;4;;;0;0;;;11;1;9;1;;;2;1;;;;;1;0;0;0;;;0;0;
105371;G. dos Santos;Giovani;dos Santos Ramírez;32;1989-05-11;Ciudad de México;Mexico;Mexico;178 cm;71 kg;;https://media.api-sports.io/football/players/105371.png;16;Mexico;https://media.api-sports.io/football/teams/16.png;1;World Cup;World;https://media.api-sports.io/football/leagues/1.png;;2018;1;0;13;;Attacker;6.300000;;1;0;4;;;0;0;;;6;;5;1;;;3;1;;;;;;0;0;0;;;0;0;
141;M. Wagué;Moussa;Wagué;23;1998-10-04;Bignona;Senegal;Senegal;177 cm;70 kg;;https://media.api-sports.io/football/players/141.png;13;Senegal;https://media.api-sports.io/football/teams/13.png;6;Africa Cup of Nations;World;https://media.api-sports.io/football/leagues/6.png;;2019;3;2;190;;Defender;6.666666;;1;0;5;2;0;0;;;;80;0;54;3;0;1;29;15;4;2;;4;6;0;0;0;;;0;0;
2989;L. Gassama;Lamine;Gassama;32;1989-10-20;Marseille;France;Senegal;181 cm;74 kg;;https://media.api-sports.io/football/players/2989.png;13;Senegal;https://media.api-sports.io/football/teams/13.png;6;Africa Cup of Nations;World;https://media.api-sports.io/football/leagues/6.png;;2019;5;5;470;;Defender;7.240000;;0;1;2;0;0;0;;2;;124;4;76;3;1;6;40;24;9;6;;10;4;1;0;0;;;0;0;
3389;S. Sessègnon;Stéphane;Sessègnon;37;1984-06-01;Allahé;Benin;Benin;172 cm;72 kg;;https://media.api-sports.io/football/players/3389.png;1516;Benin;https://media.api-sports.io/football/teams/1516.png;6;Africa Cup of Nations;World;https://media.api-sports.io/football/leagues/6.png;;2019;4;4;390;;Midfielder;6.825000;;0;0;0;6;1;0;;;;90;2;79;4;0;3;39;22;9;6;;9;4;0;0;0;;1;0;0;
19243;M. Obi;Mikel John;Obi;34;1987-04-22;Jos;Nigeria;Nigeria;188 cm;86 kg;;https://media.api-sports.io/football/players/19243.png;19;Nigeria;https://media.api-sports.io/football/teams/19.png;6;Africa Cup of Nations;World;https://media.api-sports.io/football/leagues/6.png;;2019;2;2;117;;Midfielder;6.500000;;0;2;3;2;0;0;;;;45;1;78;;0;1;16;7;2;2;;4;2;0;0;0;;;0;0;
20915;E. Seka;Ernest;Seka Boka;34;1987-06-22;Clichy;France;Guinea;185 cm;89 kg;;https://media.api-sports.io/football/players/20915.png;1509;Guinea;https://media.api-sports.io/football/teams/1509.png;6;Africa Cup of Nations;World;https://media.api-sports.io/football/leagues/6.png;;2019;3;3;270;;Defender;6.800000;;0;0;1;0;0;0;;;;112;0;79;4;0;4;22;14;0;0;;3;2;1;0;0;;;0;0;
25647;I. Traoré;Ibrahima;Traoré;33;1988-04-21;Villepinte;France;Guinea;171 cm;61 kg;;https://media.api-sports.io/football/players/25647.png;1509;Guinea;https://media.api-sports.io/football/teams/1509.png;6;Africa Cup of Nations;World;https://media.api-sports.io/football/leagues/6.png;;2019;4;4;360;;Attacker;6.925000;;0;0;0;9;1;0;;1;;112;11;78;2;0;2;40;18;15;8;;5;3;0;0;0;1;;0;0;
44789;Y. Mulumbu;Youssouf Chafiq;Mulumbu Ngangu;34;1987-01-25;Kinshasa;Congo DR;Congo DR;177 cm;65 kg;;https://media.api-sports.io/football/players/44789.png;1508;Congo DR;https://media.api-sports.io/football/teams/1508.png;6;Africa Cup of Nations;World;https://media.api-sports.io/football/leagues/6.png;;2019;2;2;143;;Midfielder;6.150000;;0;2;1;0;0;0;;;;53;0;76;5;0;5;34;11;5;2;;2;11;1;0;0;;;0;0;
50237;H. Saivet;Henri;Saivet;31;1990-10-26;Dakar;Senegal;Senegal;174 cm;76 kg;;https://media.api-sports.io/football/players/50237.png;13;Senegal;https://media.api-sports.io/football/teams/13.png;6;Africa Cup of Nations;World;https://media.api-sports.io/football/leagues/6.png;;2019;6;5;448;;Midfielder;7.183333;;1;2;2;10;4;0;;;;140;10;74;6;1;5;43;25;2;2;;6;4;0;0;0;;;0;1;
73794;L. Matampi;Vumi Ley;Matampi;32;1989-04-18;Kinshasa;Congo DR;Congo DR;180 cm;75 kg;;https://media.api-sports.io/football/players/73794.png;1508;Congo DR;https://media.api-sports.io/football/teams/1508.png;6;Africa Cup of Nations;World;https://media.api-sports.io/football/leagues/6.png;;2019;4;4;390;;Goalkeeper;6.675000;;0;0;0;0;0;0;6;;11;81;0;69;;0;0;1;1;0;0;;1;0;0;0;0;;;0;0;0
1256;V. Jovanović;Vukašin;Jovanović;25;1996-05-17;Beograd;Serbia;Serbia;189 cm;88 kg;;https://media.api-sports.io/football/players/1256.png;78;Bordeaux;https://media.api-sports.io/football/teams/78.png;65;Coupe de la Ligue;France;https://media.api-sports.io/football/leagues/65.png;https://media.api-sports.io/flags/fr.svg;2019;1;1;90;;Defender;6.800000;;0;0;0;0;0;0;;;;64;1;83;;1;4;;;0;0;;1;1;0;0;0;;;0;0;
20701;H. Bazile;Hervé;Bazile;31;1990-03-18;Creteil;France;Haiti;181 cm;78 kg;;https://media.api-sports.io/football/players/20701.png;111;LE Havre;https://media.api-sports.io/football/teams/111.png;65;Coupe de la Ligue;France;https://media.api-sports.io/football/leagues/65.png;https://media.api-sports.io/flags/fr.svg;2019;1;0;13;;Attacker;6.800000;;1;0;1;0;0;0;;;;2;0;40;;0;1;;;0;0;;0;0;0;0;0;;;0;0;
21021;Abdoulaye Sané;Abdoulaye;Sané;29;1992-10-15;Diouloulou;Senegal;Senegal;180 cm;73 kg;;https://media.api-sports.io/football/players/21021.png;115;Sochaux;https://media.api-sports.io/football/teams/115.png;65;Coupe de la Ligue;France;https://media.api-sports.io/football/leagues/65.png;https://media.api-sports.io/flags/fr.svg;2019;1;0;27;;Attacker;6.300000;;1;0;1;1;0;0;;;;3;0;75;;0;0;;;0;0;;0;2;1;0;0;;;0;0;
21571;Hilton;Vitorino;Hilton da Silva;44;1977-09-13;Brasília;Brazil;Brazil;180 cm;78 kg;;https://media.api-sports.io/football/players/21571.png;82;Montpellier;https://media.api-sports.io/football/teams/82.png;65;Coupe de la Ligue;France;https://media.api-sports.io/football/leagues/65.png;https://media.api-sports.io/flags/fr.svg;2019;2;1;113;;Defender;6.950000;;1;0;1;1;0;0;;;;51;0;76;3;0;3;;;0;0;;1;0;0;0;0;;;0;0;
22131;M. Goicoechea;Mauro Daniel;Goicoechea Furia;33;1988-03-27;Montevideo;Uruguay;Uruguay;186 cm;82 kg;;https://media.api-sports.io/football/players/22131.png;96;Toulouse;https://media.api-sports.io/football/teams/96.png;65;Coupe de la Ligue;France;https://media.api-sports.io/football/leagues/65.png;https://media.api-sports.io/flags/fr.svg;2019;2;2;180;;Goalkeeper;6.250000;;0;0;0;0;0;0;5;;8;37;0;64;;0;0;;;0;0;;0;0;0;0;0;;;0;0;0
22155;Y. Sanogo;Yaya;Sanogo;28;1993-01-27;Massy;France;France;191 cm;74 kg;;https://media.api-sports.io/football/players/22155.png;96;Toulouse;https://media.api-sports.io/football/teams/96.png;65;Coupe de la Ligue;France;https://media.api-sports.io/football/leagues/65.png;https://media.api-sports.io/flags/fr.svg;2019;1;1;90;;Attacker;7.700000;;0;0;0;2;2;1;;;;12;1;66;;0;1;;;2;2;;6;4;0;0;0;;;0;0;
22246;L. Koné;Lamine;Koné;32;1989-02-01;Paris;France;Côte d'Ivoire;189 cm;90 kg;;https://media.api-sports.io/football/players/22246.png;95;Strasbourg;https://media.api-sports.io/football/teams/95.png;65;Coupe de la Ligue;France;https://media.api-sports.io/football/leagues/65.png;https://media.api-sports.io/flags/fr.svg;2019;1;1;90;;Defender;7.000000;;0;0;0;0;0;0;;;;58;0;87;1;0;1;;;0;0;;2;0;0;0;0;;;0;0;
179492;Edmilson Indjai Correia;Edmilson;Indjai Correia;21;2000-06-06;;Guinea-Bissau;Guinea-Bissau;;;;https://media.api-sports.io/football/players/179492.png;1063;Saint Etienne;https://media.api-sports.io/football/teams/1063.png;65;Coupe de la Ligue;France;https://media.api-sports.io/football/leagues/65.png;https://media.api-sports.io/flags/fr.svg;2019;2;1;90;;Midfielder;7.350000;;1;1;1;4;3;1;;;;10;0;66;1;0;2;;;2;1;;6;0;0;0;0;1;;0;0;
36016;L. Martínez;Luis Antonio;Martínez Jiménez;32;1987-04-29;Zacapoaxtla;Mexico;Mexico;176 cm;78 kg;;https://media.api-sports.io/football/players/36016.png;2294;Veracruz;https://media.api-sports.io/football/teams/2294.png;264;Copa MX;Mexico;https://media.api-sports.io/football/leagues/264.png;https://media.api-sports.io/flags/mx.svg;2019;1;1;59;;Midfielder;;;0;1;0;;;0;;;;;;;;;;;;;;;;;0;0;0;;;;;
1220;Y. Zhirkov;Yuri;Zhirkov;38;1983-08-20;Tambov;Russia;Russia;180 cm;75 kg;;https://media.api-sports.io/football/players/1220.png;4;Russia;https://media.api-sports.io/football/teams/4.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;6;5;450;;Defender;6.666666;;1;2;1;2;;0;0;;;193;3;24;9;1;11;52;25;3;1;;6;8;1;0;0;;;0;0;
1348;R. Neustädter;Roman;Neustädter;33;1988-02-18;Dnipro;Ukraine;Russia;190 cm;81 kg;;https://media.api-sports.io/football/players/1348.png;4;Russia;https://media.api-sports.io/football/teams/4.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;1;0;13;;Midfielder;5.700000;;1;0;2;;;0;0;;;3;;2;;;;;;;;;;;0;0;0;;;0;0;
5118;Sebastiá Gómez Pérez;Sebastiá;Gómez Pérez;38;1983-11-01;Montevideo;Uruguay;Andorra;;;;https://media.api-sports.io/football/players/5118.png;1110;andorra;https://media.api-sports.io/football/teams/1110.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;0;0;0;;Attacker;;;0;0;4;;;0;0;;;;;;;;;;;;;;;;0;0;0;;;0;0;
15419;Beka Mikeltadze;Beka;Mikeltadze;24;1997-11-26;Kutaisi;Georgia;Georgia;185 cm;77 kg;;https://media.api-sports.io/football/players/15419.png;1104;Georgia;https://media.api-sports.io/football/teams/1104.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;2;0;15;;Attacker;6.250000;;2;0;2;;;0;0;;;8;;5;;;;6;3;;;;;2;0;0;0;;;0;0;
18921;R. Brady;Robbie;Brady;29;1992-01-14;Dublin;Republic of Ireland;Republic of Ireland;176 cm;71 kg;;https://media.api-sports.io/football/players/18921.png;776;Rep. Of Ireland;https://media.api-sports.io/football/teams/776.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;6;4;380;;Midfielder;7.183333;;2;3;2;5;;0;0;1;;181;13;22;7;;3;47;25;9;8;;7;8;0;0;0;;;0;0;
20232;Ryan McLaughlin;Ryan;McLaughlin;27;1994-09-30;Belfast;Northern Ireland;Northern Ireland;183 cm;75 kg;;https://media.api-sports.io/football/players/20232.png;771;Northern Ireland;https://media.api-sports.io/football/teams/771.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;0;0;0;;Defender;;;0;0;2;;;0;0;;;;;;;;;;;;;;;;0;0;0;;;0;0;
24984;M. Palionis;Markus;Palionis;34;1987-05-12;Kaunas;Lithuania;Lithuania;194 cm;89 kg;;https://media.api-sports.io/football/players/24984.png;1097;Lithuania;https://media.api-sports.io/football/teams/1097.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;4;4;360;;Defender;6.825000;;0;0;0;1;;0;0;;;145;1;28;3;1;4;32;18;;;;2;4;1;0;0;;;0;0;
30779;Oscar Hiljemark;Oscar;Hiljemark;29;1992-06-28;Gislaved;Sweden;Sweden;184 cm;77 kg;;https://media.api-sports.io/football/players/30779.png;5;Sweden;https://media.api-sports.io/football/teams/5.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;0;0;0;;Midfielder;;;0;0;0;;;0;;;;;;;;;;;;;;;;;0;0;0;;;;;
30808;Emil Hallfreðsson;Emil;Hallfreðsson;37;1984-06-29;Hafnarfjörður;Iceland;Iceland;185 cm;83 kg;;https://media.api-sports.io/football/players/30808.png;18;Iceland;https://media.api-sports.io/football/teams/18.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;2;0;50;;Midfielder;6.300000;;2;0;2;;;0;0;;;18;;8;1;;;3;1;;;;;;0;0;0;;;0;0;
31673;Hysen Memolla;Hysen;Memolla;29;1992-07-03;Kavajë;Albania;Albania;186 cm;78 kg;;https://media.api-sports.io/football/players/31673.png;778;Albania;https://media.api-sports.io/football/teams/778.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;2;1;98;;Defender;6.750000;;1;0;4;;;0;0;1;;36;1;11;2;;;12;6;2;1;;2;1;0;0;0;;;0;0;
55890;Emilijus Zubas;Emilijus;Zubas;31;1990-07-10;Panevėžys;Lithuania;Lithuania;195 cm;80 kg;;https://media.api-sports.io/football/players/55890.png;1097;Lithuania;https://media.api-sports.io/football/teams/1097.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;0;0;0;;Goalkeeper;;;0;0;0;;;0;;;;;;;;;;;;;;;;;0;0;0;;;;;
56045;Ferran Pol Pérez;Ferran;Pol Pérez;38;1983-02-28;Andorra la Vella;Andorra;Andorra;;;;https://media.api-sports.io/football/players/56045.png;1110;andorra;https://media.api-sports.io/football/teams/1110.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;0;0;0;;Goalkeeper;;;0;0;0;;;0;;;;;;;;;;;;;;;;;0;0;0;;;;;
56103;Mattia Giardi;Mattia;Giardi;30;1991-12-15;;San Marino;San Marino;;;;https://media.api-sports.io/football/players/56103.png;1115;San Marino;https://media.api-sports.io/football/teams/1115.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;0;0;0;;Midfielder;;;0;0;4;;;0;0;;;;;;;;;;;;;;;;0;0;0;;;0;0;
56109;Luca Tosi;Luca;Tosi;27;1994-07-23;;San Marino;San Marino;;;;https://media.api-sports.io/football/players/56109.png;1115;San Marino;https://media.api-sports.io/football/teams/1115.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;1;1;46;;Midfielder;;;0;1;1;;;0;;;;;;;;;;;;;;;;;0;0;0;;;;;
70402;Alex Gasperoni;Alex;Gasperoni;37;1984-06-30;Città di San Marino;San Marino;San Marino;191 cm;;;https://media.api-sports.io/football/players/70402.png;1115;San Marino;https://media.api-sports.io/football/teams/1115.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;0;0;0;;Midfielder;;;0;0;0;;;0;;;;;;;;;;;;;;;;;0;0;0;;;;;
76880;Benjamin Tatar;Benjamin;Tatar;27;1994-05-18;Sarajevo;Bosnia and Herzegovina;Bosnia and Herzegovina;180 cm;73 kg;;https://media.api-sports.io/football/players/76880.png;1113;Bosnia & Herzegovina;https://media.api-sports.io/football/teams/1113.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;3;2;145;;Attacker;6.633333;;1;2;2;2;;0;0;;;51;2;13;1;;;14;4;2;1;;2;2;0;0;0;;;0;0;
76971;Irfan Hadžić;Irfan;Hadžić;28;1993-06-15;Prozor-Rama;Bosnia and Herzegovina;Bosnia and Herzegovina;192 cm;;;https://media.api-sports.io/football/players/76971.png;1113;Bosnia & Herzegovina;https://media.api-sports.io/football/teams/1113.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;1;0;11;;Attacker;6.200000;;1;0;2;;;0;0;;;2;;1;;;;3;1;;;;;;0;0;0;;;0;0;
124179;Mattia Stefanelli;Mattia;Stefanelli;28;1993-03-12;;San Marino;San Marino;;;;https://media.api-sports.io/football/players/124179.png;1115;San Marino;https://media.api-sports.io/football/teams/1115.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;0;0;0;;Attacker;;;0;0;0;;;0;;;;;;;;;;;;;;;;;0;0;0;;;;;
124369;Luca Nanni;Luca;Nanni;26;1995-01-30;;San Marino;San Marino;;;;https://media.api-sports.io/football/players/124369.png;1115;San Marino;https://media.api-sports.io/football/teams/1115.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;0;0;0;;Defender;;;0;0;1;;;0;0;;;;;;;;;;;;;;;;0;0;0;;;0;0;
134461;Adrián Rodrígues Gonçalves;Adrián;Rodrígues Gonçalves;33;1988-08-14;;Andorra;Andorra;;;;https://media.api-sports.io/football/players/134461.png;1110;andorra;https://media.api-sports.io/football/teams/1110.png;5;UEFA Nations League;World;https://media.api-sports.io/football/leagues/5.png;;2020;0;0;0;;Defender;;;0;0;4;;;0;0;;;;;;;;;;;;;;;;0;0;0;;;0;0;
292393;Anthony Ezequiel Stella Vespa;Anthony Ezequiel;Stella Vespa;20;2000-04-07;Montevideo;Uruguay;Uruguay;172 cm;71 kg;;https://media.api-sports.io/football/players/292393.png;9589;Ejea;https://media.api-sports.io/football/teams/9589.png;692;Segunda B - Group 5;Spain;https://media.api-sports.io/football/leagues/692.png;https://media.api-sports.io/flags/es.svg;2020;0;0;0;;Attacker;;;0;0;4;;;0;;;;;;;;;;;;;;;;;0;0;0;;;;;
292393;Anthony Ezequiel Stella Vespa;Anthony Ezequiel;Stella Vespa;20;2000-04-07;Montevideo;Uruguay;Uruguay;172 cm;71 kg;;https://media.api-sports.io/football/players/292393.png;9589;Ejea;https://media.api-sports.io/football/teams/9589.png;692;Segunda B - Group 5;Spain;https://media.api-sports.io/football/leagues/692.png;https://media.api-sports.io/flags/es.svg;2020;0;0;0;;Attacker;;;0;0;4;;;0;;;;;;;;;;;;;;;;;0;0;0;;;;;
292393;Anthony Ezequiel Stella Vespa;Anthony Ezequiel;Stella Vespa;20;2000-04-07;Montevideo;Uruguay;Uruguay;172 cm;71 kg;;https://media.api-sports.io/football/players/292393.png;9589;Ejea;https://media.api-sports.io/football/teams/9589.png;692;Segunda B - Group 5;Spain;https://media.api-sports.io/football/leagues/692.png;https://media.api-sports.io/flags/es.svg;2020;0;0;0;;Attacker;;;0;0;4;;;0;;;;;;;;;;;;;;;;;0;0;0;;;;;
122991;David Rodríguez Poblador;David;Rodríguez Poblador;30;1991-09-27;Madrid;Spain;Spain;;;;https://media.api-sports.io/football/players/122991.png;5271;Navalcarnero;https://media.api-sports.io/football/teams/5271.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;4;4;267;;Midfielder;6.700000;;0;4;0;1;1;0;0;;;35;;29;2;;2;7;4;;;;2;2;0;0;0;;;0;0;
141208;Manuel Monteagudo Gil;Manuel;Monteagudo Gil;27;1994-12-19;Albacete;Spain;Spain;;;;https://media.api-sports.io/football/players/141208.png;5271;Navalcarnero;https://media.api-sports.io/football/teams/5271.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;4;3;228;;Midfielder;6.300000;;1;3;1;;;0;0;;;38;;26;;;1;4;2;;;;;;0;0;0;;;0;0;
141210;David Gómez Prieto;David;Gómez Prieto;28;1993-10-05;Madrid;Spain;Spain;;;;https://media.api-sports.io/football/players/141210.png;5271;Navalcarnero;https://media.api-sports.io/football/teams/5271.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;0;0;0;;Defender;;;0;0;0;;;0;;;;;;;;;;;;;;;;;0;0;0;;;;;
182505;Álvaro Ramón Álvarez;Álvaro;Ramón Álvarez;21;2000-05-06;Ponferrada;Spain;Spain;;;;https://media.api-sports.io/football/players/182505.png;5271;Navalcarnero;https://media.api-sports.io/football/teams/5271.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;4;1;113;;Defender;6.900000;;3;1;3;1;1;0;0;;;28;1;26;1;;2;1;1;;;;;;0;0;0;;;0;0;
184517;Gonzalo Sáiz Ramírez;Gonzalo;Sáiz Ramírez;27;1994-02-03;;Spain;Spain;;;;https://media.api-sports.io/football/players/184517.png;5271;Navalcarnero;https://media.api-sports.io/football/teams/5271.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;4;3;246;;Midfielder;6.300000;;1;2;1;1;1;0;0;;;42;2;33;1;;1;5;2;;;;1;1;0;0;0;;;0;0;
184714;Aitor González González;Aitor;González González;26;1995-01-18;;Spain;Spain;;;;https://media.api-sports.io/football/players/184714.png;5271;Navalcarnero;https://media.api-sports.io/football/teams/5271.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;0;0;0;;Goalkeeper;;;0;0;3;;;0;;;;;;;;;;;;;;;;;0;0;0;;;;;
184721;Manuel Jaimez Nieto;Manuel;Jaimez Nieto;32;1989-04-24;Madrid;Spain;Spain;;;;https://media.api-sports.io/football/players/184721.png;5271;Navalcarnero;https://media.api-sports.io/football/teams/5271.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;4;4;360;;Defender;6.000000;;0;0;0;;;1;0;;;66;;51;;2;2;5;2;;;;;;0;0;0;;;0;0;
187540;Alberto Alonso Lozano;Alberto;Alonso Lozano;27;1994-11-14;Fuensalida;Spain;Spain;;;;https://media.api-sports.io/football/players/187540.png;5271;Navalcarnero;https://media.api-sports.io/football/teams/5271.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;2;0;50;;Midfielder;6.700000;;2;0;2;;;0;0;;;31;;26;1;;1;4;4;;;;1;;0;0;0;;;0;0;
188342;Carlos Saturnino Pérez Molares;Carlos Saturnino;Pérez Molares;22;1999-02-24;;Spain;Spain;;;;https://media.api-sports.io/football/players/188342.png;15306;Ribadumia;https://media.api-sports.io/football/teams/15306.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;1;1;90;;Defender;6.700000;;0;0;0;;;0;0;;;33;;22;1;1;4;8;5;1;;;2;;0;0;0;;;0;0;
285193;Roberto Pazos Agra;Roberto;Pazos Agra;40;1981-01-21;;Spain;Spain;188 cm;83 kg;;https://media.api-sports.io/football/players/285193.png;15306;Ribadumia;https://media.api-sports.io/football/teams/15306.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;1;1;90;;Goalkeeper;9.300000;;0;0;0;;;0;2;;10;30;;15;;;;;;;;;;;0;0;0;;;0;0;1
285194;Pablo Rial Agra;Pablo;Rial Agra;20;2001-03-28;;Spain;Spain;;;;https://media.api-sports.io/football/players/285194.png;15306;Ribadumia;https://media.api-sports.io/football/teams/15306.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;0;0;0;;Goalkeeper;;;0;0;1;;;0;0;;;;;;;;;;;;;;;;0;0;0;;;0;0;1
285195;Eloy Conde Señoráns;Eloy;Conde Señoráns;27;1994-06-25;;Spain;Spain;;;;https://media.api-sports.io/football/players/285195.png;15306;Ribadumia;https://media.api-sports.io/football/teams/15306.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;0;0;0;;Defender;;;0;0;1;;;0;0;;;;;;;;;;;;;;;;0;0;0;;;0;0;
285196;Javier Domingo Salvador;Javier;Domingo Salvador;25;1996-12-06;;Spain;Spain;;;;https://media.api-sports.io/football/players/285196.png;15306;Ribadumia;https://media.api-sports.io/football/teams/15306.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;1;1;90;;Defender;6.900000;;0;0;0;;;0;0;;;32;;25;1;3;1;7;3;1;1;;;3;1;0;0;;;0;0;
285197;Santiago Padín Bermúdez;Santiago;Padín Bermúdez;28;1993-07-27;;Spain;Spain;;;;https://media.api-sports.io/football/players/285197.png;15306;Ribadumia;https://media.api-sports.io/football/teams/15306.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;1;1;66;;Defender;6.300000;;0;1;0;;;0;0;;;17;;10;2;;;7;4;1;1;;;1;1;0;0;;;0;0;
285198;Miguel Ángel Vázquez Bustelo;Miguel Ángel;Vázquez Bustelo;39;1982-02-28;;Spain;Spain;;;;https://media.api-sports.io/football/players/285198.png;15306;Ribadumia;https://media.api-sports.io/football/teams/15306.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;1;1;90;;Defender;6.900000;;0;0;0;;;0;0;;;44;;39;2;1;;7;4;;;;;;0;0;0;;;0;0;
288668;José Luis Vicente Zornoza;José Luis;Vicente Zornoza;21;2000-09-11;;Spain;Spain;;;;https://media.api-sports.io/football/players/288668.png;5264;Gimnástica Torrelavega;https://media.api-sports.io/football/teams/5264.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;1;0;10;;Midfielder;;;1;0;1;;;0;;;;;;;;;;;;;;;;;0;0;0;;;;;
288819;Ian Olivera Maxwell;Ian;Olivera Maxwell;;;;Spain;Spain;;;;https://media.api-sports.io/football/players/288819.png;5271;Navalcarnero;https://media.api-sports.io/football/teams/5271.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;0;0;0;;Attacker;;;0;0;4;;;0;0;;;;;;;;;;;;;;;;0;0;0;;;0;0;
288842;Gastón Alonso Kappes;Gastón;Alonso Kappes;20;2001-02-07;;Spain;Spain;;;;https://media.api-sports.io/football/players/288842.png;5283;Yeclano;https://media.api-sports.io/football/teams/5283.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;0;0;0;;Midfielder;7.300000;;0;0;0;1;1;0;0;;;34;;31;5;1;1;10;6;;;;;1;0;0;0;;;0;0;
295907;Romaguera;Romaguera;Romaguera;;;;Spain;Spain;;;;https://media.api-sports.io/football/players/295907.png;9381;Atlético Baleares;https://media.api-sports.io/football/teams/9381.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;0;0;0;;Midfielder;;;0;0;1;;;0;;;;;;;;;;;;;;;;;0;0;0;;;;;
296913;Alejandro Rodríguez-Caso Schwarz;Alejandro;Rodríguez-Caso Schwarz;25;1996-07-10;;Germany;Spain;188 cm;;;https://media.api-sports.io/football/players/296913.png;9408;Portugalete;https://media.api-sports.io/football/teams/9408.png;143;Copa del Rey;Spain;https://media.api-sports.io/football/leagues/143.png;https://media.api-sports.io/flags/es.svg;2020;0;0;0;;Defender;;;0;0;1;;;0;;;;;;;;;;;;;;;;;0;0;0;;;;;
6796;T. Velaphi;Tando;Velaphi;34;1987-04-17;Perth;Australia;Australia;186 cm;75 kg;;https://media.api-sports.io/football/players/6796.png;940;Perth Glory;https://media.api-sports.io/football/teams/940.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;7;7;630;;Goalkeeper;6.985714;;0;0;19;;;0;11;;29;191;;18;;;1;5;5;;;;2;;1;0;0;;;0;0;1
6858;Josh Hope;Josh;Hope;22;1998-01-07;Hobart;Australia;Australia;184 cm;;;https://media.api-sports.io/football/players/6858.png;944;Melbourne Victory;https://media.api-sports.io/football/teams/944.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;;;;;Midfielder;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
6873;J. Elsey;Jordan;Elsey;27;1994-03-02;Adelaide;Australia;Australia;188 cm;82 kg;;https://media.api-sports.io/football/players/6873.png;948;Adelaide United;https://media.api-sports.io/football/teams/948.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;27;27;2403;;Defender;6.829629;;0;0;0;8;3;1;0;;;1556;11;47;22;15;28;158;96;4;3;;8;20;4;1;0;;;0;0;
6891;P. Niyongabire;Pacifique;Niyongabire;21;2000-03-15;;Burundi;Australia;;;;https://media.api-sports.io/football/players/6891.png;948;Adelaide United;https://media.api-sports.io/football/teams/948.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;18;1;275;;Attacker;6.550000;;17;2;18;5;2;0;0;2;;102;6;4;4;;5;69;19;19;5;;6;5;0;0;0;;;0;0;
6944;N. James;Noah;James;20;2001-02-14;;Australia;Australia;;;;https://media.api-sports.io/football/players/6944.png;946;Newcastle Jets;https://media.api-sports.io/football/teams/946.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;0;0;0;;Goalkeeper;;;0;0;0;;;0;0;;;;;;;;;;;;;;;;0;0;0;;;0;0;0
6970;V. Janjetović;Vedran;Janjetović;34;1987-08-20;Zagreb;Croatia;Australia;187 cm;84 kg;;https://media.api-sports.io/football/players/6970.png;939;Western Sydney Wanderers;https://media.api-sports.io/football/teams/939.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;0;0;0;;Goalkeeper;;;0;0;0;;;0;;;;;;;;;;;;;;;;;0;0;0;;;;;
7027;C. Ngoy;Charles Lokoli;Ngoy;24;1997-03-02;;Australia;Australia;;;;https://media.api-sports.io/football/players/7027.png;942;Wellington Phoenix;https://media.api-sports.io/football/teams/942.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;9;0;115;;Attacker;6.644444;;9;0;20;5;1;0;0;;;18;2;1;1;;;23;14;8;4;;1;1;0;0;0;;;0;0;
7034;J. Clisby;Jack;Clisby;29;1992-02-16;Perth;Australia;Australia;180 cm;72 kg;;https://media.api-sports.io/football/players/7034.png;941;Central Coast Mariners;https://media.api-sports.io/football/teams/941.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;27;27;2445;;Defender;7.103703;;0;2;0;20;9;2;0;1;;1047;48;28;46;14;46;216;113;16;8;;19;33;4;0;0;;;0;0;
38841;T. Hudson-Wihongi;Te Atawhai;Hudson-Wihongi;26;1995-03-27;;New Zealand;New Zealand;187 cm;83 kg;;https://media.api-sports.io/football/players/38841.png;942;Wellington Phoenix;https://media.api-sports.io/football/teams/942.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;4;0;68;;Defender;6.266666;;4;0;9;;;0;0;;;45;;13;;;1;4;2;;;;;2;0;0;0;;;0;0;
68037;L. McGing;Liam;McGing;23;1998-12-11;;Australia;Australia;;;;https://media.api-sports.io/football/players/68037.png;942;Wellington Phoenix;https://media.api-sports.io/football/teams/942.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;7;6;562;;Defender;6.928571;;1;0;6;;;0;0;;;261;;34;8;10;7;39;19;;;;4;6;0;0;0;;;0;0;
130113;G. Colli;Giordano;Colli;20;2000-03-12;;Australia;Australia;;;;https://media.api-sports.io/football/players/130113.png;940;Perth Glory;https://media.api-sports.io/football/teams/940.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;;;;;Midfielder;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
138306;D. Hughes;Declan;Hughes;20;2000-05-27;;England;England;;;;https://media.api-sports.io/football/players/138306.png;940;Perth Glory;https://media.api-sports.io/football/teams/940.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;;;;;Midfielder;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
153633;Y. Petratos;Yerasimakis;Petratos;21;2000-09-11;;Australia;Australia;178 cm;77 kg;;https://media.api-sports.io/football/players/153633.png;946;Newcastle Jets;https://media.api-sports.io/football/teams/946.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;4;0;37;;Attacker;6.475000;;4;0;7;;;0;0;;;16;;3;2;;;9;4;1;;;1;2;0;0;0;;;0;0;
153637;T. Ostler;Trent;Ostler;18;2002-04-03;;Australia;Australia;;;;https://media.api-sports.io/football/players/153637.png;940;Perth Glory;https://media.api-sports.io/football/teams/940.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;;;;;Attacker;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
156985;Y. Abetew;Yared;Abetew;22;1999-06-15;;Australia;Australia;;;;https://media.api-sports.io/football/players/156985.png;948;Adelaide United;https://media.api-sports.io/football/teams/948.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;8;3;304;;Defender;6.571428;;5;1;11;1;1;0;0;1;;181;3;21;8;1;6;27;13;3;3;;1;7;1;0;0;;;0;0;
167015;N. Smith;Noah;Smith;21;2000-12-15;;Australia;Australia;;;;https://media.api-sports.io/football/players/167015.png;948;Adelaide United;https://media.api-sports.io/football/teams/948.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;9;9;766;;Defender;7.011111;;0;3;0;;;0;0;;;420;6;36;22;5;26;89;50;17;11;;6;8;3;0;0;;;0;0;
187948;M. Muratovic;Mirza;Muratovic;21;2000-01-14;;Australia;Australia;;;;https://media.api-sports.io/football/players/187948.png;942;Wellington Phoenix;https://media.api-sports.io/football/teams/942.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;8;3;300;;Attacker;6.512500;;5;3;12;7;4;2;0;;;58;2;5;3;;1;29;7;2;1;;3;4;1;0;0;;;0;0;
191968;D. Ochsenham;Dakota;Ochsenham;22;1999-09-28;;Australia;Australia;;;;https://media.api-sports.io/football/players/191968.png;948;Adelaide United;https://media.api-sports.io/football/teams/948.png;188;A-League;Australia;https://media.api-sports.io/football/leagues/188.png;https://media.api-sports.io/flags/au.svg;2020;0;0;0;;Goalkeeper;;;0;0;19;;;0;0;;;;;;;;;;;;;;;;0;0;0;;;0;0;1
`;

    function loadPlayerStats() {
        statsBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 40px 0;">جاري تحميل الإحصائيات... <i class="fas fa-spinner fa-spin"></i></td></tr>`;
        try {
            const players = parseCSV(csvData);
            displayPlayerStats(players); // Use a unique function name
        } catch (error) {
            console.error('Failed to parse or display player stats:', error);
            statsBody.innerHTML = `<tr><td colspan="9" style="text-align: center;">عفواً، حدث خطأ أثناء عرض الإحصائيات.</td></tr>`;
        }
    }

    function parseCSV(data) {
        const lines = data.trim().split('\n');
        const headers = lines[0].split(';');
        const players = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(';');
            if (values.length === headers.length) {
                const player = {};
                headers.forEach((header, index) => {
                    player[header.trim()] = values[index].trim();
                });
                players.push(player);
            }
        }
        return players;
    }

    function displayPlayerStats(players) { // Renamed function
        statsBody.innerHTML = '';
        if (players.length === 0) {
            statsBody.innerHTML = `<tr><td colspan="9" style="text-align: center;">لا توجد بيانات لعرضها.</td></tr>`;
            return;
        }

        players.forEach((player, index) => {
            const rating = parseFloat(player['Games rating']).toFixed(2);
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td class="team-name-cell">
                        <img src="${player['Photo']}" alt="${player['Name']}" class="player-photo">
                        <div>
                            <strong>${player['Firstname']} ${player['Lastname']}</strong>
                            <small style="display: block; color: var(--gray);">${player['Age']} سنة - ${player['Nationality']}</small>
                        </div>
                    </td>
                    <td class="team-name-cell"><img src="${player['Team logo']}" alt="${player['Team name']}"> ${player['Team name']}</td>
                    <td>${player['League name']}</td>
                    <td>${player['Games appearences'] || 0}</td>
                    <td>${player['Games minutes'] || 0}</td>
                    <td>${player['Goals total'] || 0}</td>
                    <td>${player['Goals assists'] || 0}</td>
                    <td class="points">${isNaN(rating) ? 'N/A' : rating}</td>
                </tr>
            `;
            statsBody.insertAdjacentHTML('beforeend', row);
        });
    }

    loadPlayerStats();
}

// دالة رئيسية لتشغيل كل شيء عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    initializeActiveNavLinks();
    initializeCookieNotice();
    initializePlayerSearch();
    initializeLiveMatches();
    initializeStandings();
    initializePlayerStats();
});