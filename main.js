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

// --- Global Configuration ---
// تنبيه أمني: في بيئة الإنتاج، يجب عدم عرض مفتاح الـ API في كود الواجهة الأمامية.
// يجب أن يتم استدعاء الـ API من خلال خادم خلفي (backend) للحفاظ على سرية المفتاح.
const API_KEY = '97b0f94e37aa62b6718ab11d4ef0f9ce';
const API_HOST = 'v3.football.api-sports.io';
const SEASON = 2023; // تم التحديث إلى الموسم المكتمل لضمان توفر الإحصائيات

// --- Global Data ---
// News data is hardcoded for demonstration purposes. In a real application, this would come from a CMS or a news API.
const newsData = [
    {
        id: 1,
        category: 'تحليل تكتيكي',
        title: 'ثورة جوارديولا: كيف أعاد "الظهير الوهمي" تعريف كرة القدم الحديثة؟',
        image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1907&auto=format&fit=crop',
        date: 'منذ ساعتين',
        link: 'news-article.html?id=1',
        content: `لم يعد مركز الظهير مجرد لاعب يركض على الخط الجانبي لإرسال العرضيات. في عالم بيب جوارديولا، تحول الظهير إلى قطعة شطرنج استراتيجية تتحرك بذكاء في عمق الملعب، وهو ما يُعرف بـ "الظهير الوهمي" أو "Inverted Full-back". هذه الثورة التكتيكية لم تغير فقط طريقة لعب مانشستر سيتي، بل ألهمت مدربين في جميع أنحاء العالم لإعادة التفكير في أدوار لاعبيهم.\n\nالفكرة بسيطة في جوهرها ولكنها معقدة في تنفيذها. بدلاً من البقاء على الأطراف، يتحرك الظهير (مثل كايل ووكر أو جواو كانسيلو سابقاً) إلى وسط الملعب عند امتلاك الكرة. هذا التحرك يخلق زيادة عددية في منطقة حيوية، مما يمنح الفريق سيطرة أكبر على إيقاع اللعب ويفتح زوايا تمرير جديدة لم تكن متاحة. الأهم من ذلك، أنه يوفر حماية دفاعية فورية ضد الهجمات المرتدة، حيث يكون الفريق أكثر تماسكاً في الوسط عند فقدان الكرة.\n\nتطبيق هذا الأسلوب يتطلب لاعبين بمهارات استثنائية. يجب أن يمتلك الظهير رؤية لاعب خط الوسط، القدرة على المراوغة في المساحات الضيقة، ودقة التمرير، بالإضافة إلى واجباته الدفاعية التقليدية. لقد نجح جوارديولا في تطوير لاعبين مثل فيليب لام في بايرن ميونخ، وأعاد اكتشاف لاعبين مثل جون ستونز في مانشستر سيتي ليقوموا بهذا الدور ببراعة. النتيجة؟ هيمنة شبه كاملة على المباريات، وقدرة على تفكيك أقوى الدفاعات، ونظام لعب مرن يصعب على الخصوم مواجهته.`
    },
    {
        id: 2,
        category: 'سوق الانتقالات',
        title: 'صفقة القرن: كيليان مبابي إلى ريال مدريد.. ما الذي يعنيه هذا للعالم؟',
        image: 'https://images.unsplash.com/photo-1599422442439-773d3d34341a?q=80&w=1974&auto=format&fit=crop',
        date: 'منذ 8 ساعات',
        link: 'news-article.html?id=2',
        content: `بعد سنوات من التكهنات والشد والجذب، أصبح الحلم حقيقة. أعلن ريال مدريد رسمياً عن ضم النجم الفرنسي كيليان مبابي في صفقة انتقال حر تاريخية. هذا الانتقال لا يمثل مجرد تعزيز هائل لصفوف النادي الملكي، بل هو حدث سيعيد تشكيل خريطة القوة في كرة القدم الأوروبية لسنوات قادمة.\n\nبالنسبة لريال مدريد، يمثل وصول مبابي تتويجاً لاستراتيجية طويلة الأمد لجلب أفضل المواهب في العالم. سينضم مبابي إلى كوكبة من النجوم مثل فينيسيوس جونيور، جود بيلينجهام، ورودريجو، ليشكلوا خط هجوم مرعباً قد يكون الأقوى في العالم. يتوقع المحللون أن يمنح هذا الهجوم ريال مدريد أفضلية حاسمة في جميع البطولات التي ينافس عليها.\n\nعلى الجانب الآخر، يواجه باريس سان جيرمان تحدي بناء فريق جديد في حقبة ما بعد مبابي. خسارة لاعب بحجمه لا يمكن تعويضها بسهولة، وسيتعين على النادي الفرنسي أن يكون ذكياً في سوق الانتقالات لإعادة بناء مشروعه. أما بالنسبة للدوري الإسباني، فإن قدوم مبابي يعزز من قيمته التنافسية والتسويقية، ويعيد الصراع الكلاسيكي بين ريال مدريد وبرشلونة إلى الواجهة بقوة، حيث سيتعين على برشلونة إيجاد طريقة لمواجهة هذا العملاق الجديد.`
    },
    {
        id: 3,
        category: 'أساطير اللعبة',
        title: 'ليونيل ميسي في أمريكا: تأثير يتجاوز حدود الملعب',
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1924&auto=format&fit=crop',
        date: 'أمس',
        link: 'news-article.html?id=3',
        content: `عندما انتقل ليونيل ميسي إلى إنتر ميامي، لم يكن مجرد انتقال لاعب كرة قدم، بل كان ظاهرة ثقافية واقتصادية. منذ لحظة وصوله، أحدث الأسطورة الأرجنتينية تأثيراً هائلاً على الدوري الأمريكي (MLS) وعلى رياضة كرة القدم في الولايات المتحدة بشكل عام.\n\nعلى أرض الملعب، قاد ميسي فريقه إنتر ميامي لتحقيق أول بطولة في تاريخه (كأس الدوريات)، وقدم لمحات فنية أعادت تعريف ما هو ممكن في الدوري. لكن تأثيره الأكبر كان خارج الملعب. ارتفعت أسعار تذاكر مباريات إنتر ميامي بشكل جنوني، وحققت منصة Apple TV+، الناقل الحصري للدوري، أرقام اشتراكات قياسية. أصبح قميص ميسي الوردي هو الأكثر مبيعاً في العالم، وتحولت مدينة ميامي إلى قبلة لعشاق كرة القدم.\n\nيمثل "تأثير ميسي" نقطة تحول في تاريخ كرة القدم في أمريكا. لقد جذب انتباه وسائل الإعلام العالمية والمشجعين العاديين على حد سواء، مما يمهد الطريق لنمو هائل للعبة قبل استضافة كأس العالم 2026. إن وجود ميسي لا يرفع فقط من مستوى المنافسة، بل يلهم جيلاً جديداً من اللاعبين والمشجعين في بلد كانت كرة القدم فيه دائماً تكافح من أجل الحصول على مكانة بين الرياضات الكبرى.`
    },
    {
        id: 4,
        category: 'الدوري السعودي',
        title: 'دوري روشن: كيف تحول إلى وجهة لنجوم العالم؟',
        image: 'https://images.unsplash.com/photo-1674537623981-a43a7f991332?q=80&w=1932&auto=format&fit=crop',
        date: 'منذ يومين',
        link: 'news-article.html?id=4',
        content: `لم يعد الدوري السعودي مجرد دوري محلي، بل تحول في غضون أشهر قليلة إلى أحد أبرز الدوريات في العالم، جاذباً نجوماً من العيار الثقيل مثل كريستيانو رونالدو، نيمار، كريم بنزيما، وساديو ماني. هذا التحول المذهل هو نتاج مشروع استثماري ضخم يهدف إلى جعل المملكة العربية السعودية مركزاً رياضياً عالمياً.\n\nبدأ كل شيء مع انتقال كريستيانو رونالدو إلى نادي النصر، وهي الصفقة التي فتحت الباب أمام سلسلة من الانتقالات التاريخية. استثمر صندوق الاستثمارات العامة السعودي في أربعة من أكبر أندية الدوري (الهلال، النصر، الاتحاد، والأهلي)، مما منحها قوة مالية هائلة للمنافسة على أفضل اللاعبين في العالم. هذا الاستثمار لم يرفع فقط من المستوى الفني للدوري، بل زاد أيضاً من متابعته عالمياً، حيث تم بيع حقوق بث المباريات لأكثر من 100 دولة.\n\nالهدف لا يقتصر فقط على كرة القدم. يرى الخبراء أن هذا المشروع هو جزء من رؤية 2030 لتنويع اقتصاد المملكة وتعزيز قوتها الناعمة على الساحة الدولية. ومع استمرار تدفق النجوم، أصبح دوري روشن السعودي قوة لا يستهان بها، ويطرح تساؤلات حول مستقبل موازين القوى في كرة القدم العالمية.`
    },
    {
        id: 5,
        category: 'كرة نسائية',
        title: 'هيمنة إسبانية: كيف سيطر برشلونة والمنتخب على كرة القدم النسائية؟',
        image: 'https://images.unsplash.com/photo-1594464405979-49c9a39812a4?q=80&w=1974&auto=format&fit=crop',
        date: 'منذ 3 أيام',
        link: 'news-article.html?id=5',
        content: `تشهد كرة القدم النسائية حقبة من الهيمنة الإسبانية المطلقة، بقيادة نادي برشلونة والمنتخب الوطني. لقد أصبح أسلوب "التيكي تاكا" المعتمد على الاستحواذ والتمرير القصير هو السمة المميزة للكرة الإسبانية، وقد أثبت نجاحه الساحق على أعلى المستويات.\n\nفريق برشلونة للسيدات، بقيادة نجمات مثل أيتانا بونماتي وأليكسيا بوتياس، حقق إنجازات تاريخية، بما في ذلك الفوز بدوري أبطال أوروبا عدة مرات وإكمال ثلاثيات ورباعيات محلية. هذا النجاح لم يأت من فراغ، بل هو نتاج استثمار طويل الأمد في أكاديمية "لا ماسيا" وتطبيق نفس فلسفة اللعب التي اشتهر بها فريق الرجال.\n\nامتد هذا النجاح إلى المنتخب الوطني، الذي توج بكأس العالم للسيدات لأول مرة في تاريخه، ثم تبعه بلقب دوري الأمم الأوروبية. أصبحت إسبانيا القوة المهيمنة في كرة القدم النسائية، حيث تجمع بين الموهبة الفردية والتفوق التكتيكي. هذا النجاح لا يلهم فقط الفتيات في إسبانيا، بل يضع معياراً جديداً للعبة على مستوى العالم.`
    },
    {
        id: 6,
        category: 'تكنولوجيا الرياضة',
        title: 'الذكاء الاصطناعي في التحكيم: هل ينهي الـ VAR الجدل إلى الأبد؟',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop',
        date: 'منذ 4 أيام',
        link: 'news-article.html?id=6',
        content: `منذ إدخال تقنية حكم الفيديو المساعد (VAR)، كان الهدف هو تقليل الأخطاء التحكيمية وزيادة العدالة. ومع ذلك، لم تخلُ التجربة من الجدل، حيث أثارت قرارات الـ VAR نقاشات واسعة حول التسلل ولمسات اليد. الآن، تدخل التكنولوجيا مرحلة جديدة مع الذكاء الاصطناعي، فهل ستكون الحل النهائي؟\n\nيعمل الاتحاد الدولي لكرة القدم (فيفا) على تطوير تقنيات جديدة تعتمد على الذكاء الاصطناعي، مثل تقنية التسلل شبه الآلية التي تم استخدامها في كأس العالم. تستخدم هذه التقنية عشرات الكاميرات لتتبع حركة اللاعبين والكرة بدقة متناهية، وتقوم بإرسال تنبيه فوري إلى غرفة الـ VAR في حالة وجود تسلل، مما يقلل من وقت اتخاذ القرار ويزيد من دقته.\n\nبالإضافة إلى التسلل، يتم تطوير أنظمة ذكاء اصطناعي لتحليل لمسات اليد وتحديد ما إذا كانت متعمدة أم لا بناءً على حركة الجسم وسرعة الكرة. بينما يرى المؤيدون أن هذه التقنيات ستقضي على الجدل وتجعل اللعبة أكثر عدلاً، يخشى البعض الآخر أن تفقد كرة القدم روحها الإنسانية وتتحول إلى لعبة تدار بالكامل بواسطة الآلات. يبقى السؤال مفتوحاً، ولكن من المؤكد أن التكنولوجيا ستستمر في لعب دور أكبر في مستقبل التحكيم.`
    }
];

// --- New Global Leagues Data ---
const leagues = [
    { id: 39, name: 'الدوري الإنجليزي الممتاز', logo: 'https://media.api-sports.io/football/leagues/39.png' },
    { id: 140, name: 'الدوري الإسباني', logo: 'https://media.api-sports.io/football/leagues/140.png' },
    { id: 135, name: 'الدوري الإيطالي', logo: 'https://media.api-sports.io/football/leagues/135.png' },
    { id: 78, name: 'الدوري الألماني', logo: 'https://media.api-sports.io/football/leagues/78.png' },
    { id: 61, name: 'الدوري الفرنسي', logo: 'https://media.api-sports.io/football/leagues/61.png' },
    { id: 307, name: 'دوري روشن السعودي', logo: 'https://media.api-sports.io/football/leagues/307.png' },
    { id: 233, name: 'الدوري المصري الممتاز', logo: 'https://media.api-sports.io/football/leagues/233.png' },
    { id: 2, name: 'دوري أبطال أوروبا', logo: 'https://media.api-sports.io/football/leagues/2.png' },
    { id: 3, name: 'الدوري الأوروبي', logo: 'https://media.api-sports.io/football/leagues/3.png' },
    { id: 88, name: 'الدوري الهولندي', logo: 'https://media.api-sports.io/football/leagues/88.png' },
    { id: 94, name: 'الدوري البرتغالي', logo: 'https://media.api-sports.io/football/leagues/94.png' },
    { id: 71, name: 'الدوري البرازيلي', logo: 'https://media.api-sports.io/football/leagues/71.png' },
    { id: 253, name: 'الدوري الأمريكي', logo: 'https://media.api-sports.io/football/leagues/253.png' }
];

// --- Global Messages ---
const API_ERROR_MESSAGE = 'عفواً، حدث خطأ في جلب البيانات. قد يكون سبب ذلك انتهاء صلاحية مفتاح الـ API أو تجاوز الحد اليومي للطلبات. يرجى مراجعة لوحة التحكم الخاصة بـ API-Football.';
const NO_DATA_MESSAGE = (season) => `لا توجد بيانات لهذا الدوري في موسم ${season}/${season + 1} حالياً. قد تبدأ البيانات بالظهور مع انطلاق الموسم.`;

// --- Helper Functions ---
async function fetchData(url) {
    try {
        const response = await fetch(url, { headers: { 'x-apisports-key': API_KEY } });
        if (!response.ok) {
            // Handles network errors, 5xx, 404s etc.
            throw new Error(API_ERROR_MESSAGE);
        }
        const data = await response.json();
        // Handles API-specific errors returned with a 200 status
        // e.g. invalid key, subscription issues, bad parameters
        if (data.errors && (Array.isArray(data.errors) ? data.errors.length > 0 : Object.keys(data.errors).length > 0)) {
            console.error("API Error Response:", data.errors);
            throw new Error(API_ERROR_MESSAGE);
        }
        return data;
    } catch (error) {
        console.error(`FetchData Error for ${url}:`, error);
        throw new Error(error.message || API_ERROR_MESSAGE);
    }
}
function initializeActiveNavLinks() {
    // اسم الملف الرئيسي الذي يعمل كصفحة البداية
    const homePageFile = 'index.html';
    // احصل على اسم الملف للصفحة الحالية من الرابط
    const currentPage = window.location.pathname.split("/").pop() || homePageFile;
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

function initializeLiveMatches() {
    const scoreboardGrid = document.querySelector('.scoreboard-grid');
    if (!scoreboardGrid) return;

    // دالة لجلب المباريات المباشرة
    async function fetchLiveMatches() {
        scoreboardGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 20px;">جاري تحميل المباريات المباشرة... <i class="fas fa-spinner fa-spin"></i></p>';
        const API_URL = `https://${API_HOST}/fixtures?live=all`;

        try {
            const data = await fetchData(API_URL);
            if (data.response && data.response.length > 0) {
                // تحديث عنوان القسم
                const sectionTitle = document.querySelector('#scoreboard .section-title');
                if (sectionTitle) sectionTitle.textContent = 'مباريات مباشرة';
                displayMatches(data.response);
            } else {
                fetchTodaysMatches();
            }

        } catch (error) {
            console.error("Could not fetch live matches:", error);
            scoreboardGrid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">${error.message}</p>`;
        }
    }

    // دالة لجلب مباريات اليوم كبديل
    async function fetchTodaysMatches() {
        const today = new Date().toISOString().slice(0, 10);
        // جلب المباريات القادمة، المباشرة، والمنتهية لليوم
        const today_API_URL = `https://${API_HOST}/fixtures?date=${today}&status=NS-LIVE-FT-AET-PEN-SUSP-INT`;
        
        scoreboardGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 20px;">لا توجد مباريات مباشرة حالياً. جاري تحميل مباريات اليوم... <i class="fas fa-spinner fa-spin"></i></p>';

        try {
            const data = await fetchData(today_API_URL);
            if (data.response && data.response.length > 0) {
                displayMatches(data.response);
            } else {
                scoreboardGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">لا توجد مباريات مجدولة اليوم.</p>';
            }
        } catch (error) {
            console.error("Could not fetch today's matches:", error);
            scoreboardGrid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">${error.message}</p>`;
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
                : '-';

            let time;
            if (matchStatus === 'live') {
                time = fixture.status.short === 'HT' 
                    ? 'استراحة' 
                    : `مباشر ${fixture.status.elapsed}'`;
            } else if (matchStatus === 'finished') {
                time = 'انتهت';
            } else { // upcoming
                const matchDate = new Date(fixture.date);
                const dateString = matchDate.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' });
                const timeString = matchDate.toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'});
                time = `${dateString} - ${timeString}`;
            }

            const matchCardHTML = `
                <a href="match-details.html?id=${fixture.id}" class="match-card-link">
                    <div class="match-card ${matchStatus}">
                        <div class="match-header">${league.name}</div>
                        <div class="match-body">
                            <div class="team"><img src="${teams.home.logo}" alt="${teams.home.name}" class="team-logo"><span>${teams.home.name}</span></div>
                            <div class="score">${score}</div>
                            <div class="team"><img src="${teams.away.logo}" alt="${teams.away.name}" class="team-logo"><span>${teams.away.name}</span></div>
                        </div>
                        <div class="match-footer"><span class="match-time ${fixture.status.short === 'HT' ? 'استراحة' : ''}">${time}</span></div>
                    </div>
                </a>`;
            scoreboardGrid.insertAdjacentHTML('beforeend', matchCardHTML);
        });
    }

    // البدء بمحاولة جلب المباريات المباشرة
    fetchLiveMatches();
}

function initializeLeagueSelector(wrapper, onSelectCallback) {
    if (!wrapper) return;

    const defaultLeague = leagues[0];

    // Build the selector HTML
    wrapper.innerHTML = `
        <div class="league-select-trigger">
            <img src="${defaultLeague.logo}" alt="${defaultLeague.name}" onerror="this.style.display='none'">
            <span>${defaultLeague.name}</span>
            <div class="arrow"><i class="fas fa-chevron-down"></i></div>
        </div>
        <div class="league-select-options">
            <div class="league-search-container">
                <i class="fas fa-search"></i>
                <input type="text" class="league-search-input" placeholder="ابحث عن دوري...">
            </div>
            <div class="league-options-list">
                ${leagues.map(league => `
                    <div class="league-option ${league.id === defaultLeague.id ? 'selected' : ''}" data-value="${league.id}" data-name="${league.name}" data-logo="${league.logo}">
                        <img src="${league.logo}" alt="${league.name}" onerror="this.style.display='none'">
                        <span>${league.name}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Add event listeners
    const trigger = wrapper.querySelector('.league-select-trigger');
    const optionsContainer = wrapper.querySelector('.league-select-options');
    const searchInput = wrapper.querySelector('.league-search-input');
    const options = wrapper.querySelectorAll('.league-option');

    trigger.addEventListener('click', () => wrapper.classList.toggle('open'));

    window.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) wrapper.classList.remove('open');
    });

    options.forEach(option => {
        option.addEventListener('click', function() {
            wrapper.querySelector('.league-option.selected')?.classList.remove('selected');
            this.classList.add('selected');
            trigger.innerHTML = `<img src="${this.dataset.logo}" alt="${this.dataset.name}" onerror="this.style.display='none'"> <span>${this.dataset.name}</span> <div class="arrow"><i class="fas fa-chevron-down"></i></div>`;
            wrapper.classList.remove('open');
            onSelectCallback(this.dataset.value);
        });
    });

    searchInput.addEventListener('keyup', function() {
        const filter = this.value.toLowerCase();
        options.forEach(opt => {
            opt.style.display = opt.dataset.name.toLowerCase().includes(filter) ? '' : 'none';
        });
    });
}

function initializeStandings() {
    const standingsContainer = document.getElementById('standings');
    if (!standingsContainer) return;

    const standingsBody = document.getElementById('standings-body');
    const leagueNameTitle = document.getElementById('standings-league-name');

    async function fetchStandings(leagueId) {
        // التأكد من وجود العناصر
        if (!standingsBody || !leagueNameTitle) return;

        // تحديث العنوان وعرض حالة التحميل فوراً
        const selectedLeague = leagues.find(l => l.id == leagueId);
        if (selectedLeague) {
            leagueNameTitle.textContent = `جدول ترتيب: ${selectedLeague.name} - موسم ${SEASON}/${SEASON + 1}`;
        }
        standingsBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 40px 0;">جاري تحميل البيانات... <i class="fas fa-spinner fa-spin"></i></td></tr>`;


        const API_URL = `https://${API_HOST}/standings?league=${leagueId}&season=${SEASON}`;
        try {
            const data = await fetchData(API_URL);

            if (data.response && data.response.length > 0 && data.response[0].league.standings.length > 0) {
                const standings = data.response[0].league.standings[0];
                displayStandings(standings);
            } else {
                standingsBody.innerHTML = `<tr><td colspan="8" style="text-align: center;">${NO_DATA_MESSAGE(SEASON)}</td></tr>`;
            }

        } catch (error) {
            console.error("Could not fetch standings:", error);
            standingsBody.innerHTML = `<tr><td colspan="8" style="text-align: center;">${error.message}</td></tr>`;
        }
    }

    function displayStandings(standings) {
        standingsBody.innerHTML = ''; // مسح رسالة التحميل
        standings.forEach(teamData => {
            const team = teamData.team;
            const row = `
                <tr>
                    <td>${teamData.rank}</td>
                    <td class="team-name-cell">
                        <a href="team-details.html?id=${team.id}">
                            <img src="${team.logo}" alt="${team.name}"> ${team.name}
                        </a>
                    </td>
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

    initializeLeagueSelector(document.querySelector('#standings .league-select-wrapper'), fetchStandings);
    fetchStandings(leagues[0].id); // Fetch for the default league on page load
}

// دالة جديدة لجلب أفضل اللاعبين حسب الأهداف
async function fetchTopPlayersByGoals(leagueId, count) {
    // استخدام نقطة النهاية المخصصة للهدافين لزيادة الكفاءة والدقة
    const API_URL = `https://${API_HOST}/players/topscorers?league=${leagueId}&season=${SEASON}`;
    try {
        const data = await fetchData(API_URL);
        if (data.response && data.response.length > 0) {
            // The API returns players sorted by goals. We just slice to the desired count.
            return data.response.slice(0, count);
        } else {
            // Return an empty array if the API returns no players for this league.
            return [];
        }
    } catch (error) {
        console.error(`Could not fetch top scorers for league ${leagueId}:`, error);
        // Return an empty array on error to prevent Promise.all from failing.
        return [];
    }
}

function initializeTopScorers() {
    const statsSection = document.getElementById('player-stats-section');
    if (!statsSection) return; // تأكد من أننا في صفحة الإحصائيات فقط

    const statsBody = document.getElementById('stats-body');
    const leagueNameTitle = document.getElementById('stats-league-name');

    async function fetchTopScorers(leagueId) {
        if (!statsBody || !leagueNameTitle) return;

        const selectedLeague = leagues.find(l => l.id == leagueId);
        if (selectedLeague) {
            leagueNameTitle.textContent = `قائمة هدافي: ${selectedLeague.name} - موسم ${SEASON}/${SEASON + 1}`;
        }
        statsBody.innerHTML = `<tr><td colspan="11" style="text-align: center; padding: 40px 0;">جاري تحميل البيانات... <i class="fas fa-spinner fa-spin"></i></td></tr>`;

        try {
            // استخدام الدالة الجديدة لجلب أفضل 30 هدافاً
            const topPlayers = await fetchTopPlayersByGoals(leagueId, 30);

            if (topPlayers && topPlayers.length > 0) {
                displayTopScorers(topPlayers);
            } else {
                statsBody.innerHTML = `<tr><td colspan="11" style="text-align: center;">${NO_DATA_MESSAGE(SEASON)}</td></tr>`;
            }
        } catch (error) {
            console.error("Could not fetch top scorers:", error);
            statsBody.innerHTML = `<tr><td colspan="11" style="text-align: center;">${error.message}</td></tr>`;
        }
    }

    function displayTopScorers(players) {
        statsBody.innerHTML = '';
        players.forEach((playerData, index) => {
            if (!playerData.statistics || playerData.statistics.length === 0) return;

            const player = playerData.player;
            const stats = playerData.statistics[0];
            
            // إضافة التنقل الآمن لجميع الكائنات التي قد تكون فارغة
            const games = stats.games || {};
            const goals = stats.goals || {};
            const shots = stats.shots || {};
            const penalty = stats.penalty || {};
            const birth = player.birth || {};

            const ratingValue = games.rating ? parseFloat(games.rating) : null;
            const rating = (ratingValue !== null && !isNaN(ratingValue)) ? ratingValue.toFixed(2) : '-';

            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td class="team-name-cell">
                        <img src="${player.photo}" alt="${player.name}" class="player-photo" onerror="this.style.display='none'">
                        <div>
                            <strong>${player.name || 'غير معروف'}</strong>
                            <small style="display: block; color: var(--gray);">${player.age || '-'} سنة - ${player.nationality || 'غير معروف'}</small>
                        </div>
                    </td>
                    <td class="team-name-cell">
                        <a href="team-details.html?id=${stats.team.id}">
                            <img src="${stats.team.logo}" alt="${stats.team.name}" onerror="this.style.display='none'"> ${stats.team.name || 'غير معروف'}
                        </a>
                    </td>
                    <td>${games.position || '-'}</td>
                    <td>${birth.date || '-'}</td>
                    <td>${games.appearences || 0}</td>
                    <td class="points">${goals.total || 0}</td>
                    <td>${goals.assists || 0}</td>
                    <td>${shots.on || 0}</td>
                    <td>${penalty.scored || 0}</td>
                    <td class="points">${rating}</td>
                </tr>
            `;
            statsBody.insertAdjacentHTML('beforeend', row);
        });
    }

    initializeLeagueSelector(document.querySelector('#player-stats-section .league-select-wrapper'), fetchTopScorers);
    fetchTopScorers(leagues[0].id); // Fetch for the default league on page load
}

function initializeTeamsPage() {
    const teamsSection = document.getElementById('teams-section');
    if (!teamsSection) return;

    const teamsGrid = document.getElementById('teams-grid');

    async function fetchTeams(leagueId) {
        if (!teamsGrid) return;

        teamsGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 40px 0;">جاري تحميل الفرق... <i class="fas fa-spinner fa-spin"></i></p>';

        const API_URL = `https://${API_HOST}/teams?league=${leagueId}&season=${SEASON}`;

        try {
            const data = await fetchData(API_URL);
            if (data.response && data.response.length > 0) {
                displayTeams(data.response);
            } else {
                teamsGrid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">${NO_DATA_MESSAGE(SEASON)}</p>`;
            }
        } catch (error) {
            console.error("Could not fetch teams:", error);
            teamsGrid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">${error.message}</p>`;
        }
    }

    function displayTeams(teams) {
        teamsGrid.innerHTML = '';
        teams.forEach(teamData => {
            const team = teamData.team;
            const venue = teamData.venue;

            const teamCardHTML = `
                <a href="team-details.html?id=${team.id}" class="team-card-link">
                    <div class="team-card">
                        <div class="team-logo">
                            <img src="${team.logo}" alt="شعار ${team.name}" loading="lazy" onerror="this.style.display='none'">
                        </div>
                        <div class="team-info">
                            <h3 class="team-name">${team.name}</h3>
                            <p class="team-country">${team.country} <span class="team-founded">(${team.founded})</span></p>
                            <small style="color: var(--gray); display: block; margin-top: 5px;">${venue.name || ''}</small>
                        </div>
                    </div>
                </a>
            `;
            teamsGrid.insertAdjacentHTML('beforeend', teamCardHTML);
        });
    }

    initializeLeagueSelector(document.querySelector('#teams-section .league-select-wrapper'), fetchTeams);
    fetchTeams(leagues[0].id); // Fetch for the default league on page load
}

// دالة لتهيئة قسم الأخبار
function initializeNews() {
    const newsGridOnIndex = document.querySelector('#news .news-grid');
    const newsGridOnNewsPage = document.querySelector('section.news#news .news-grid');

    // The newsData is now a global constant.

    function createNewsCard(article) {
        return `
            <div class="news-card">
                <a href="${article.link}" class="news-card-link">
                    <div class="news-image">
                        <img src="${article.image}" alt="${article.title}" loading="lazy" onerror="this.parentElement.style.display='none'">
                    </div>
                    <div class="news-content">
                        <span class="news-category">${article.category}</span>
                        <h3 class="news-title">${article.title}</h3>
                        <div class="news-meta">
                            <span><i class="far fa-calendar-alt"></i> ${article.date}</span>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }

    if (newsGridOnNewsPage) {
        // On news.html, display all articles
        newsGridOnNewsPage.innerHTML = newsData.map(createNewsCard).join('');
    } else if (newsGridOnIndex) {
        // On index.html, display first 3 articles
        newsGridOnIndex.innerHTML = newsData.slice(0, 3).map(createNewsCard).join('');
    }
}

// --- Translation Logic ---
const translations = {
    ar: {
        navHome: "الرئيسية",
        navTeams: "الفرق",
        navPlayers: "اللاعبين",
        navStandings: "الترتيب",
        navStats: "الإحصائيات",
        navNews: "الأخبار",
        navContact: "اتصل بنا",
        heroTitle: "استكشف عالم كرة القدم بمنظور ثلاثي الأبعاد",
        heroSubtitle: "Football 3D Hub يمنحك تجربة فريدة لمشاهدة إحصائيات اللاعبين، تشكيلات الفرق، وأداء الأندية في بيئة تفاعلية ثلاثية الأبعاد غامرة.",
        quickLinks: "روابط سريعة",
        aboutUs: "عن الموقع",
        features: "المميزات",
        aboutTitle: "عن Football 3D Hub",
    },
    en: {
        navHome: "Home",
        navTeams: "Teams",
        navPlayers: "Players",
        navStandings: "Standings",
        navStats: "Stats",
        navNews: "News",
        navContact: "Contact Us",
        heroTitle: "Explore the World of Football in a 3D Perspective",
        heroSubtitle: "Football 3D Hub offers a unique experience to view player stats, team formations, and club performance in an immersive 3D interactive environment.",
        quickLinks: "Quick Links",
        aboutUs: "About",
        features: "Features",
        aboutTitle: "About Football 3D Hub",
    },
    es: {
        navHome: "Inicio",
        navTeams: "Equipos",
        navPlayers: "Jugadores",
        navStandings: "Clasificación",
        navStats: "Estadísticas",
        navNews: "Noticias",
        navContact: "Contacto",
        heroTitle: "Explora el mundo del fútbol en una perspectiva 3D",
        heroSubtitle: "Football 3D Hub te ofrece una experiencia única para ver estadísticas de jugadores, formaciones de equipos y rendimiento de clubes en un entorno interactivo 3D inmersivo.",
        quickLinks: "Enlaces Rápidos",
        aboutUs: "Sobre Nosotros",
        features: "Características",
        aboutTitle: "Sobre Football 3D Hub",
    }
    ,
    fr: {
        navHome: "Accueil",
        navTeams: "Équipes",
        navPlayers: "Joueurs",
        navStandings: "Classement",
        navStats: "Statistiques",
        navNews: "Actualités",
        navContact: "Contact",
        heroTitle: "Explorez le monde du football en 3D",
        heroSubtitle: "Football 3D Hub offre une expérience unique pour voir les statistiques des joueurs, les formations d'équipes et les performances des clubs dans un environnement 3D interactif immersif.",
        quickLinks: "Liens Rapides",
        aboutUs: "À Propos",
        features: "Fonctionnalités",
        aboutTitle: "À propos de Football 3D Hub",
    },
    de: {
        navHome: "Startseite",
        navTeams: "Mannschaften",
        navPlayers: "Spieler",
        navStandings: "Tabelle",
        navStats: "Statistiken",
        navNews: "Nachrichten",
        navContact: "Kontakt",
        heroTitle: "Entdecken Sie die Welt des Fußballs in 3D",
        heroSubtitle: "Football 3D Hub bietet ein einzigartiges Erlebnis, um Spielerstatistiken, Mannschaftsaufstellungen und Vereinsleistungen in einer immersiven interaktiven 3D-Umgebung anzuzeigen.",
        quickLinks: "Schnell-Links",
        aboutUs: "Über Uns",
        features: "Merkmale",
        aboutTitle: "Über Football 3D Hub",
    },
    it: {
        navHome: "Home",
        navTeams: "Squadre",
        navPlayers: "Giocatori",
        navStandings: "Classifiche",
        navStats: "Statistiche",
        navNews: "Notizie",
        navContact: "Contatti",
        heroTitle: "Esplora il mondo del calcio in una prospettiva 3D",
        heroSubtitle: "Football 3D Hub offre un'esperienza unica per visualizzare statistiche dei giocatori, formazioni delle squadre e prestazioni dei club in un ambiente 3D interattivo e coinvolgente.",
        quickLinks: "Link Rapidi",
        aboutUs: "Chi Siamo",
        features: "Caratteristiche",
        aboutTitle: "Informazioni su Football 3D Hub",
    }
};

function translatePage(lang) {
    const dict = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (dict[key]) element.textContent = dict[key];
    });
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('preferredLanguage', lang);
}

// دالة لتهيئة واجهة تغيير اللغة
function initializeLanguageSwitcher() {
    const switcherContainer = document.getElementById('language-switcher');
    if (!switcherContainer) return;

    const languages = [
        { code: 'ar', name: 'العربية', flag: 'https://flagcdn.com/w20/sa.png' },
        { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/gb.png' },
        { code: 'es', name: 'Español', flag: 'https://flagcdn.com/w20/es.png' },
        { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/w20/fr.png' },
        { code: 'de', name: 'Deutsch', flag: 'https://flagcdn.com/w20/de.png' },
        { code: 'pt', name: 'Português', flag: 'https://flagcdn.com/w20/pt.png' },
        { code: 'it', name: 'Italiano', flag: 'https://flagcdn.com/w20/it.png' },
        { code: 'ru', name: 'Русский', flag: 'https://flagcdn.com/w20/ru.png' },
        { code: 'zh', name: '中文', flag: 'https://flagcdn.com/w20/cn.png' },
        { code: 'ja', name: '日本語', flag: 'https://flagcdn.com/w20/jp.png' },
        { code: 'hi', name: 'हिन्दी', flag: 'https://flagcdn.com/w20/in.png' },
        { code: 'tr', name: 'Türkçe', flag: 'https://flagcdn.com/w20/tr.png' },
        { code: 'nl', name: 'Nederlands', flag: 'https://flagcdn.com/w20/nl.png' },
        { code: 'ko', name: '한국어', flag: 'https://flagcdn.com/w20/kr.png' },
        { code: 'pl', name: 'Polski', flag: 'https://flagcdn.com/w20/pl.png' },
        { code: 'sv', name: 'Svenska', flag: 'https://flagcdn.com/w20/se.png' },
        { code: 'no', name: 'Norsk', flag: 'https://flagcdn.com/w20/no.png' },
        { code: 'da', name: 'Dansk', flag: 'https://flagcdn.com/w20/dk.png' },
        { code: 'fi', name: 'Suomi', flag: 'https://flagcdn.com/w20/fi.png' },
        { code: 'el', name: 'Ελληνικά', flag: 'https://flagcdn.com/w20/gr.png' }
    ];

    let optionsHTML = languages.map(lang => `<div class="lang-option" data-lang="${lang.code}"><img src="${lang.flag}" alt="${lang.name}"> ${lang.name}</div>`).join('');

    // Set initial state from the first language in the array
    let initialLang = languages.find(l => l.code === localStorage.getItem('preferredLanguage')) || languages[0];
    switcherContainer.innerHTML = `
        <div class="lang-select">
            <div class="lang-trigger">
                <img src="${initialLang.flag}" alt="${initialLang.name}"> ${initialLang.name} <i class="fas fa-chevron-up"></i>
            </div>
            <div class="lang-options">
                ${optionsHTML}
            </div>
        </div>
    `;

    const select = switcherContainer.querySelector('.lang-select');
    const trigger = switcherContainer.querySelector('.lang-trigger');
    const options = switcherContainer.querySelectorAll('.lang-option');

    trigger.addEventListener('click', () => {
        select.classList.toggle('open');
    });

    window.addEventListener('click', (e) => {
        if (!select.contains(e.target)) {
            select.classList.remove('open');
        }
    });

    options.forEach(option => {
        option.addEventListener('click', function() {
            const langCode = this.dataset.lang;
            const selectedLang = languages.find(l => l.code === langCode);
            if (selectedLang) {
                trigger.innerHTML = `<img src="${selectedLang.flag}" alt="${selectedLang.name}"> ${selectedLang.name} <i class="fas fa-chevron-up"></i>`;
                translatePage(langCode);
                console.log(`Language changed to: ${selectedLang.name}`);
            }
            select.classList.remove('open');
        });
    });

    // On page load, apply the saved language or default
    const savedLang = localStorage.getItem('preferredLanguage') || 'ar';
    translatePage(savedLang);
}

// دالة لتهيئة قسم اللاعبين المميزين في الصفحة الرئيسية
function initializeFeaturedPlayers() {
    const grid = document.getElementById('featured-players-grid');
    if (!grid) return;

    grid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 40px 0;">جاري تحميل اللاعبين المميزين... <i class="fas fa-spinner fa-spin"></i></p>';

    async function fetchAndDisplay() {
        try {
            const topLeagueIds = [39, 140, 135, 78, 61]; // Premier League, La Liga, Serie A, Bundesliga, Ligue 1
            const playersPerLeague = 8; // Fetch more to get a good pool

            const promises = topLeagueIds.map(id => fetchTopPlayersByGoals(id, playersPerLeague));
            const results = await Promise.all(promises);

            // Flatten the array of arrays and remove duplicates by player ID
            const allPlayers = results.flat();
            const uniquePlayers = Array.from(new Map(allPlayers.map(p => [p.player.id, p])).values());

            // Sort all unique players by goals
            const sortedPlayers = uniquePlayers.sort((a, b) => {
                const goalsA = a.statistics[0]?.goals?.total || 0;
                const goalsB = b.statistics[0]?.goals?.total || 0;
                return goalsB - goalsA;
            });

            // Get the top 24 players
            const topGlobalPlayers = sortedPlayers.slice(0, 24);

            if (topGlobalPlayers.length > 0) {
                renderFeaturedPlayers(topGlobalPlayers);
            } else {
                grid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">لا يمكن تحميل اللاعبين المميزين حالياً.</p>`;
            }
        } catch (error) {
            console.error("Could not fetch featured players:", error);
            grid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">${error.message}</p>`;
        }
    }

    function renderFeaturedPlayers(players) {
        grid.innerHTML = '';
        players.forEach(playerData => {
            if (!playerData.statistics || playerData.statistics.length === 0) return;

            const player = playerData.player;
            const stats = playerData.statistics[0];
            const games = stats.games || {};
            const goals = stats.goals || {};
            const rating = games.rating ? parseFloat(games.rating).toFixed(1) : '-';

            const playerCardHTML = `
                <a href="player-details.html?id=${player.id}" class="player-card-link">
                    <div class="player-card">
                        <div class="player-image">
                            <img src="${player.photo}" alt="${player.name}" loading="lazy" onerror="this.parentElement.style.display='none'">
                        </div>
                        <div class="player-info">
                            <h3 class="player-name">${player.name || 'غير معروف'}</h3>
                            <div class="player-team">
                                <img src="${stats.team.logo}" alt="${stats.team.name}" class="team-logo-small" onerror="this.style.display='none'">
                                ${stats.team.name || 'غير معروف'}
                            </div>
                            <div class="player-card-stats">
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <span class="stat-value">${games.appearences || 0}</span>
                                        <span class="stat-label">مباريات</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-value">${goals.total || 0}</span>
                                        <span class="stat-label">أهداف</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-value">${goals.assists || 0}</span>
                                        <span class="stat-label">صناعة</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-value">${rating}</span>
                                        <span class="stat-label">تقييم</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>`;
            grid.insertAdjacentHTML('beforeend', playerCardHTML);
        });
    }

    fetchAndDisplay(); // استدعاء الدالة لبدء عملية جلب وعرض اللاعبين
}

// دالة لتهيئة صفحة تفاصيل الخبر
function initializeNewsArticle() {
    const articleContainer = document.getElementById('article-container');
    if (!articleContainer) return;

    // استخراج id المقال من رابط الصفحة
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = parseInt(urlParams.get('id'));

    // newsData is now a global constant
    const article = newsData.find(art => art.id === articleId);

    if (article) {
        document.title = `${article.title} - Football 3D Hub`; // تحديث عنوان الصفحة
        articleContainer.innerHTML = `
            <img src="${article.image}" alt="${article.title}" id="article-image" onerror="this.style.display='none'">
            <h3 id="article-title">${article.title}</h3>
            <div class="article-meta">
                <span class="news-category">${article.category}</span>
                <span><i class="far fa-calendar-alt"></i> ${article.date}</span>
            </div>
            <div id="article-body">
                ${article.content.split('\n').map(p => `<p>${p}</p>`).join('')}
            </div>
        `;
    } else {
        articleContainer.innerHTML = '<h3 style="text-align: center;">عفواً، المقال المطلوب غير موجود.</h3>';
    }
}

// دالة لتهيئة صفحة تفاصيل المباراة
function initializeMatchDetails() {
    const matchDetailsContainer = document.getElementById('match-details-container');
    if (!matchDetailsContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const fixtureId = urlParams.get('id');

    if (!fixtureId) {
        matchDetailsContainer.innerHTML = '<p class="error-message">لم يتم تحديد المباراة.</p>';
        return;
    }

    async function fetchMatchDetails() {
        matchDetailsContainer.innerHTML = '<p style="text-align: center; padding: 50px;">جاري تحميل تفاصيل المباراة... <i class="fas fa-spinner fa-spin"></i></p>';
        const API_URL = `https://${API_HOST}/fixtures?id=${fixtureId}`;

        try {
            const data = await fetchData(API_URL);
            if (data.response && data.response.length > 0) {
                displayMatchDetails(data.response[0]);
            } else {
                matchDetailsContainer.innerHTML = `<p class="error-message">لا توجد تفاصيل لهذه المباراة.</p>`;
            }
        } catch (error) {
            console.error("Could not fetch match details:", error);
            matchDetailsContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
        }
    }

    function displayMatchDetails(data) {
        const { fixture, league, teams, lineups } = data;
        const homeTeam = lineups.find(l => l.team.id === teams.home.id) || { team: teams.home, formation: 'N/A', startXI: [], substitutes: [] };
        const awayTeam = lineups.find(l => l.team.id === teams.away.id) || { team: teams.away, formation: 'N/A', startXI: [], substitutes: [] };

        document.title = `${teams.home.name} ضد ${teams.away.name} - تفاصيل المباراة`;

        matchDetailsContainer.innerHTML = `
            <div class="match-info-header">
                <h2>${league.name} - ${league.round}</h2>
                <p><i class="fas fa-calendar-alt"></i> ${new Date(fixture.date).toLocaleString('ar-EG')} | <i class="fas fa-map-marker-alt"></i> ${fixture.venue.name || 'غير محدد'}</p>
                <p><i class="fas fa-user"></i> الحكم: ${fixture.referee || 'غير محدد'}</p>
            </div>
            <div class="lineups-container">
                ${createTeamLineupHTML(homeTeam)}
                ${createTeamLineupHTML(awayTeam)}
            </div>
        `;
    }

    function createTeamLineupHTML(teamData) {
        const { team, formation, startXI, substitutes } = teamData;
        return `
            <div class="team-lineup">
                <div class="team-lineup-header">
                    <img src="${team.logo}" alt="${team.name}" onerror="this.style.display='none'">
                    <h3>${team.name}</h3>
                    <span>الخطة: ${formation || 'غير محددة'}</span>
                </div>
                <h4>اللاعبون الأساسيون</h4>
                <ul class="player-list">
                    ${startXI.map(p => `<li><span class="player-number">${p.player.number}</span> ${p.player.name} <span class="player-pos">${p.player.pos}</span></li>`).join('')}
                </ul>
                <h4>اللاعبون الاحتياط</h4>
                <ul class="player-list">
                    ${substitutes.map(s => `<li><span class="player-number">${s.player.number}</span> ${s.player.name}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    fetchMatchDetails();
}

// دالة لتهيئة صفحة تفاصيل اللاعب
async function initializePlayerDetails() {
    const container = document.getElementById('player-details-container');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const playerId = urlParams.get('id');

    if (!playerId) {
        container.innerHTML = '<p class="error-message">لم يتم تحديد اللاعب.</p>';
        return;
    }

    container.innerHTML = '<p style="text-align: center; padding: 50px;">جاري تحميل بيانات اللاعب... <i class="fas fa-spinner fa-spin"></i></p>';

    try {
        // Fetch player data for the current season
        const API_URL = `https://${API_HOST}/players?id=${playerId}&season=${SEASON}`;
        const data = await fetchData(API_URL);

        if (data.response && data.response.length > 0) {
            displayPlayerDetails(data.response[0]);
        } else {
            throw new Error('لم يتم العثور على بيانات اللاعب.');
        }
    } catch (error) {
        console.error("Could not fetch player details:", error);
        container.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

function displayPlayerDetails(playerData) {
    const container = document.getElementById('player-details-container');
    const player = playerData.player;
    const stats = playerData.statistics[0] || {}; // Use first stats object, or empty if none
    
    document.title = `${player.name || 'تفاصيل اللاعب'} - Football 3D Hub`;

    const games = stats.games || {};
    const goals = stats.goals || {};
    const passes = stats.passes || {};
    const tackles = stats.tackles || {};
    const duels = stats.duels || {};
    const dribbles = stats.dribbles || {};
    const penalty = stats.penalty || {};
    const rating = games.rating ? parseFloat(games.rating).toFixed(2) : '-';

    const detailsHTML = `
        <div class="player-details-header">
            <div class="player-details-photo">
                <img src="${player.photo}" alt="${player.name}" onerror="this.style.display='none'">
            </div>
            <div class="player-details-info">
                <h1>${player.firstname || ''} ${player.lastname || ''}</h1>
                <div class="player-details-team">
                    <img src="${stats.team?.logo}" alt="${stats.team?.name}" onerror="this.style.display='none'">
                    <span>${stats.team?.name || 'غير معروف'}</span>
                </div>
                <div class="player-quick-info">
                    <span><strong>العمر:</strong> ${player.age || '-'}</span>
                    <span><strong>الجنسية:</strong> ${player.nationality || '-'}</span>
                    <span><strong>المركز:</strong> ${games.position || '-'}</span>
                    <span><strong>الطول:</strong> ${player.height || '-'}</span>
                    <span><strong>الوزن:</strong> ${player.weight || '-'}</span>
                </div>
            </div>
        </div>

        <div class="player-details-body">
            <h3>إحصائيات موسم ${SEASON}/${SEASON + 1}</h3>
            <div class="player-stats-grid">
                <div class="stat-category"><h4><i class="fas fa-futbol"></i> الهجوم</h4><div class="stat-item"><span>المباريات</span> <span>${games.appearences || 0}</span></div><div class="stat-item"><span>الأهداف</span> <span>${goals.total || 0}</span></div><div class="stat-item"><span>صناعة الأهداف</span> <span>${goals.assists || 0}</span></div><div class="stat-item"><span>التسديدات (على المرمى)</span> <span>${stats.shots?.total || 0} (${stats.shots?.on || 0})</span></div><div class="stat-item"><span>ركلات الجزاء (مسجلة)</span> <span>${penalty.taken || 0} (${penalty.scored || 0})</span></div></div>
                <div class="stat-category"><h4><i class="fas fa-exchange-alt"></i> التمرير</h4><div class="stat-item"><span>إجمالي التمريرات</span> <span>${passes.total || 0}</span></div><div class="stat-item"><span>التمريرات المفتاحية</span> <span>${passes.key || 0}</span></div><div class="stat-item"><span>دقة التمرير</span> <span>${passes.accuracy || '-'}%</span></div></div>
                <div class="stat-category"><h4><i class="fas fa-shield-alt"></i> الدفاع</h4><div class="stat-item"><span>التدخلات الناجحة</span> <span>${tackles.total || 0}</span></div><div class="stat-item"><span>اعتراضات</span> <span>${tackles.interceptions || 0}</span></div><div class="stat-item"><span>الالتحامات (فوز)</span> <span>${duels.total || 0} (${duels.won || 0})</span></div></div>
                <div class="stat-category"><h4><i class="fas fa-star-half-alt"></i> عام</h4><div class="stat-item"><span>دقائق اللعب</span> <span>${games.minutes || 0}</span></div><div class="stat-item"><span>التقييم العام</span> <span class="points">${rating}</span></div><div class="stat-item"><span>المراوغات الناجحة</span> <span>${dribbles.success || 0}</span></div></div>
            </div>
        </div>
    `;
    container.innerHTML = detailsHTML;
}

// دالة لتهيئة صفحة تفاصيل الفريق
function initializeTeamDetails() {
    const container = document.getElementById('team-details-container');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const teamId = urlParams.get('id');

    if (!teamId) {
        container.innerHTML = '<p class="error-message">لم يتم تحديد الفريق.</p>';
        return;
    }

    async function fetchTeamDetails() {
        container.innerHTML = '<p style="text-align: center; padding: 50px;">جاري تحميل تفاصيل الفريق... <i class="fas fa-spinner fa-spin"></i></p>';
        
        try {
            const teamData = await fetchData(`https://${API_HOST}/teams?id=${teamId}`);
            const squadData = await fetchData(`https://${API_HOST}/players/squads?team=${teamId}`);

            if (!teamData.response || teamData.response.length === 0) throw new Error('Team not found');
            
            const teamInfo = teamData.response[0];

            // البحث عن دوري صالح لجلب الإحصائيات
            const leaguesData = await fetchData(`https://${API_HOST}/leagues?team=${teamId}&season=${SEASON}`);
            
            let statsData = null;
            if (leaguesData.response && leaguesData.response.length > 0) {
                // إعطاء الأولوية للدوريات الكبرى ثم أي دوري من نوع "League"
                const majorLeagueIds = [39, 140, 135, 78, 61, 2, 307, 233];
                let league = leaguesData.response.find(l => majorLeagueIds.includes(l.league.id));
                if (!league) league = leaguesData.response.find(l => l.league.type.toLowerCase() === 'league');
                if (!league) league = leaguesData.response[0]; // اختيار أول دوري كحل أخير

                const leagueId = league.league.id;
                try {
                    const statsJson = await fetchData(`https://${API_HOST}/teams/statistics?league=${leagueId}&season=${SEASON}&team=${teamId}`);
                    if (statsJson.response) statsData = statsJson.response;
                } catch (statsError) {
                    console.error("Could not fetch team statistics, continuing without them.", statsError);
                    statsData = null;
                }
            }

            displayTeamDetails(teamInfo, statsData, squadData.response[0]);

        } catch (error) {
            console.error("Could not fetch team details:", error);
            container.innerHTML = `<p class="error-message">${error.message}</p>`;
        }
    }

    function displayTeamDetails(teamInfo, stats, squad) {
        const team = teamInfo.team;
        const venue = teamInfo.venue;
        document.title = `${team.name} - تفاصيل الفريق`;

        const statsHTML = stats ? `
            <h3>إحصائيات الفريق (${stats.league.name} ${SEASON}/${SEASON+1})</h3>
            <div class="team-stats-grid">
                <div class="stat-item"><span>لعب</span><span>${stats.fixtures.played.total}</span></div>
                <div class="stat-item"><span>فاز</span><span>${stats.fixtures.wins.total}</span></div>
                <div class="stat-item"><span>تعادل</span><span>${stats.fixtures.draws.total}</span></div>
                <div class="stat-item"><span>خسر</span><span>${stats.fixtures.loses.total}</span></div>
            </div>
            <h4>الأهداف</h4>
            <div class="team-stats-grid">
                <div class="stat-item"><span>سجل</span><span>${stats.goals.for.total.total || 0}</span></div>
                <div class="stat-item"><span>استقبل</span><span>${stats.goals.against.total.total || 0}</span></div>
                <div class="stat-item"><span>متوسط التسجيل</span><span>${stats.goals.for.average.total || 0}</span></div>
                <div class="stat-item"><span>متوسط الاستقبال</span><span>${stats.goals.against.average.total || 0}</span></div>
            </div>
            <h4>التشكيلات الأكثر استخداماً</h4>
            <ul class="formations-list">
                ${stats.lineups.map(f => `<li>${f.formation} <span>(${f.played} مباريات)</span></li>`).join('')}
            </ul>
        ` : '<p>لا توجد إحصائيات متاحة لهذا الفريق في الموسم الحالي.</p>';

        const squadHTML = squad && squad.players ? `
            <h3>قائمة اللاعبين</h3>
            <ul class="squad-player-list">
                ${squad.players.map(p => `
                    <li>
                        <img src="${p.photo}" alt="${p.name}" class="player-photo" onerror="this.style.display='none'">
                        <div class="squad-player-info">
                            <strong>${p.name}</strong>
                            <span>العمر: ${p.age} | المركز: ${p.position}</span>
                        </div>
                    </li>
                `).join('')}
            </ul>
        ` : '<p>لا توجد بيانات عن قائمة اللاعبين.</p>';

        container.innerHTML = `
            <div class="team-details-header">
                <img src="${team.logo}" alt="${team.name}" class="team-details-logo">
                <div class="team-details-info">
                    <h1>${team.name}</h1>
                    <p>${team.country} - تأسس عام ${team.founded}</p>
                    <p><i class="fas fa-map-marker-alt"></i> الملعب: ${venue.name} (${venue.city}) | السعة: ${venue.capacity ? venue.capacity.toLocaleString('ar-EG') : 'غير معروف'}</p>
                </div>
            </div>
            <div class="team-details-content">
                <div class="team-stats-container">${statsHTML}</div>
                <div class="team-squad-container">${squadHTML}</div>
            </div>
        `;
    }

    fetchTeamDetails();
}

// دالة لتهيئة قسم الإحصائيات في الصفحة الرئيسية
async function initializeHomepageStats() {
    const goalsElement = document.querySelector('#stat-goals .stat-number');
    const goalsDescElement = document.querySelector('#stat-goals .stat-desc');
    const playersElement = document.querySelector('#stat-players .stat-number');
    const teamsElement = document.querySelector('#stat-teams .stat-number');
    const leaguesElement = document.querySelector('#stat-leagues .stat-number');

    if (!goalsElement) return; // We are not on the homepage

    // تحديث الأرقام الثابتة لتكون أكثر واقعية
    if (playersElement) playersElement.textContent = '15,000+';
    if (teamsElement) teamsElement.textContent = '400+';
    if (leaguesElement) leaguesElement.textContent = '8'; // بناءً على عدد الدوريات في القوائم المنسدلة

    // جلب إجمالي الأهداف ديناميكيًا لأحد الدوريات الكبرى
    goalsElement.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i>';
    const LEAGUE_ID_FOR_GOALS = 39; // Premier League
    const API_URL = `https://${API_HOST}/standings?league=${LEAGUE_ID_FOR_GOALS}&season=${SEASON}`;

    try {
        const data = await fetchData(API_URL);

        if (data.response && data.response.length > 0 && data.response[0].league.standings.length > 0) {
            const standings = data.response[0].league.standings[0];
            const totalGoals = standings.reduce((sum, team) => sum + team.all.goals.for, 0);
            goalsElement.textContent = totalGoals.toLocaleString('ar-EG');
            if (goalsDescElement) goalsDescElement.textContent = `هدف في الدوري الإنجليزي موسم ${SEASON}/${(SEASON + 1).toString().slice(-2)}`;
        } else {
            goalsElement.textContent = '950+'; // قيمة احتياطية
            if (goalsDescElement) goalsDescElement.textContent = `هدف في الدوريات الكبرى`;
        }
    } catch (error) {
        console.error('Could not fetch homepage stats:', error);
        goalsElement.textContent = '950+'; // قيمة احتياطية عند حدوث خطأ
        if (goalsDescElement) goalsDescElement.textContent = `هدف في الدوريات الكبرى`;
    }
}

// دالة لتفعيل نموذج الاتصال
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (!form || !status) return;

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        // التحقق من الحقول قبل الإرسال
        if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
            status.textContent = 'يرجى ملء جميع الحقول الإلزامية.';
            status.style.color = 'var(--secondary)';
            return;
        }

        status.textContent = 'جاري إرسال الرسالة...';
        status.style.color = 'var(--gray)';

        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                status.textContent = 'شكراً لك! تم إرسال رسالتك بنجاح.';
                status.style.color = 'var(--accent)';
                form.reset();
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    status.textContent = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    status.textContent = 'عفواً، حدث خطأ أثناء إرسال الرسالة.';
                }
                status.style.color = 'var(--secondary)';
            }
        } catch (error) {
            console.error('Contact form submission error:', error);
            status.textContent = 'عفواً، حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى.';
            status.style.color = 'var(--secondary)';
        }
    }

    form.addEventListener("submit", handleSubmit);
}

function initializeHeaderSearch() {
    const forms = document.querySelectorAll('.header-search-form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const input = form.querySelector('input[name="q"]');
            if (!input || !input.value.trim()) {
                e.preventDefault(); // Prevent submitting an empty search
                input?.focus();
            }
        });
    });
}

function initializeSearchPage() {
    const searchPage = document.getElementById('search-results-page');
    if (!searchPage) return;

    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    const titleEl = document.getElementById('search-title');
    const resultsContainer = document.getElementById('search-results-container');

    if (!query) {
        titleEl.textContent = 'الرجاء إدخال مصطلح للبحث';
        resultsContainer.innerHTML = '';
        return;
    }

    document.title = `نتائج البحث عن "${query}" - Football 3D Hub`;
    titleEl.textContent = `نتائج البحث عن: "${query}"`;
    resultsContainer.innerHTML = '<p style="text-align: center; padding: 50px;">جاري البحث... <i class="fas fa-spinner fa-spin"></i></p>';

    performSearch(query);
}

async function performSearch(query) {
    const resultsContainer = document.getElementById('search-results-container');
    
    try {
        const [teams, players, news] = await Promise.all([
            fetchData(`https://${API_HOST}/teams?search=${query}`),
            fetchData(`https://${API_HOST}/players?search=${query}&season=${SEASON}`),
            searchNews(query) // This will be a local search
        ]);

        let resultsHTML = '';
        let resultsFound = false;

        // Display Teams
        if (teams.response && teams.response.length > 0) {
            resultsFound = true;
            resultsHTML += `<div class="search-results-section"><h3><i class="fas fa-shield-alt"></i> الفرق (${teams.response.length})</h3><div class="teams-grid">${teams.response.map(teamData => { const team = teamData.team; return `<a href="team-details.html?id=${team.id}" class="team-card-link"><div class="team-card"><div class="team-logo"><img src="${team.logo}" alt="${team.name}" loading="lazy" onerror="this.style.display='none'"></div><h3 class="team-name">${team.name}</h3><p class="team-country">${team.country}</p></div></a>`; }).join('')}</div></div>`;
        }

        // Display Players
        if (players.response && players.response.length > 0) {
            resultsFound = true;
            resultsHTML += `<div class="search-results-section"><h3><i class="fas fa-star"></i> اللاعبون (${players.response.length})</h3><div class="players-grid">${players.response.map(playerData => { const player = playerData.player; const stats = playerData.statistics[0] || {}; return `<a href="player-details.html?id=${player.id}" class="player-card-link"><div class="player-card"><div class="player-image"><img src="${player.photo}" alt="${player.name}" loading="lazy" onerror="this.parentElement.style.display='none'"></div><div class="player-info"><h3 class="player-name">${player.name}</h3><div class="player-team"><img src="${stats.team?.logo}" alt="${stats.team?.name}" class="team-logo-small" onerror="this.style.display='none'">${stats.team?.name || 'N/A'}</div></div></div></a>`; }).join('')}</div></div>`;
        }

        // Display News
        if (news.length > 0) {
            resultsFound = true;
            resultsHTML += `<div class="search-results-section"><h3><i class="far fa-newspaper"></i> الأخبار (${news.length})</h3><div class="news-grid">${news.map(article => { return `<div class="news-card"><a href="${article.link}" class="news-card-link"><div class="news-image"><img src="${article.image}" alt="${article.title}" loading="lazy" onerror="this.parentElement.style.display='none'"></div><div class="news-content"><span class="news-category">${article.category}</span><h3 class="news-title">${article.title}</h3><div class="news-meta"><span><i class="far fa-calendar-alt"></i> ${article.date}</span></div></div></a></div>`; }).join('')}</div></div>`;
        }

        if (!resultsFound) {
            resultsContainer.innerHTML = `<div class="no-results-message">لم يتم العثور على نتائج للبحث عن "${query}".</div>`;
        } else {
            resultsContainer.innerHTML = resultsHTML;
        }

    } catch (error) {
        console.error("Search failed:", error);
        resultsContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

function searchNews(query) {
    const lowerCaseQuery = query.toLowerCase();
    // newsData is a global constant
    return newsData.filter(article => 
        article.title.toLowerCase().includes(lowerCaseQuery) || 
        article.content.toLowerCase().includes(lowerCaseQuery) ||
        article.category.toLowerCase().includes(lowerCaseQuery)
    );
}

// دالة رئيسية لتشغيل كل شيء عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    initThreeJS();
    initializeActiveNavLinks();
    initializeCookieNotice();    
    initializeFeaturedPlayers();
    initializeLiveMatches();
    initializeHomepageStats();
    initializeStandings();
    initializeTopScorers();
    initializeTeamsPage();
    initializeNews();
    initializeNewsArticle();
    initializeMatchDetails();
    initializeTeamDetails();
    initializePlayersPage();
    initializePlayerDetails();
    initializeLanguageSwitcher();
    initializeContactForm();
    initializeHeaderSearch();
    initializeSearchPage();
});

function initializePlayersPage() {
    const playersSection = document.getElementById('players-page');
    if (!playersSection) return;

    // --- Filter and Search Logic ---
    const searchInput = document.getElementById('player-search');
    const filterContainer = playersSection.querySelector('.filter-container');

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const activePositionFilter = filterContainer?.querySelector('.active')?.dataset.position || 'All';
        
        const playerCards = document.querySelectorAll('#players-grid-dynamic .player-card-link');
        
        playerCards.forEach(card => {
            const playerName = card.querySelector('.player-name')?.textContent.toLowerCase() || '';
            const playerPosition = card.dataset.position;

            const nameMatch = playerName.includes(searchTerm);
            const positionMatch = (activePositionFilter === 'All' || playerPosition === activePositionFilter);

            if (nameMatch && positionMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('keyup', applyFilters);

    if (filterContainer) {
        filterContainer.querySelectorAll('.segmented-btn').forEach(button => {
            button.addEventListener('click', function() {
                filterContainer.querySelector('.segmented-btn.active')?.classList.remove('active');
                this.classList.add('active');
                applyFilters();
            });
        });
    }
    // --- End Filter and Search Logic ---

    const leagueSubtitle = document.getElementById('players-league-subtitle');

    const playersGrid = document.getElementById('players-grid-dynamic');

    async function fetchPlayers(leagueId) {
        if (!playersGrid) return;

        const selectedLeague = leagues.find(l => l.id == leagueId);
        if (selectedLeague && leagueSubtitle) {
            const leagueName = selectedLeague.name;
            document.title = `لاعبو ${leagueName} - Football 3D Hub`;
            leagueSubtitle.textContent = `استعرض لاعبي ${leagueName} لموسم ${SEASON}/${SEASON + 1}`;
        }

        playersGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 40px 0;">جاري تحميل اللاعبين... <i class="fas fa-spinner fa-spin"></i></p>';
        
        try {
            let allPlayers = [];
            let currentPage = 1;
            const maxPages = 5; // جلب 5 صفحات للحصول على ~100 لاعب
            let hasMorePages = true;

            while (currentPage <= maxPages && hasMorePages) {
                const API_URL = `https://${API_HOST}/players?league=${leagueId}&season=${SEASON}&page=${currentPage}`;
                try {
                    const data = await fetchData(API_URL);
                    if (data.response && data.response.length > 0) {
                        allPlayers.push(...data.response);
                        // Check if there are more pages to fetch from the API's paging info
                        if (data.paging.current >= data.paging.total) {
                            hasMorePages = false;
                        } else {
                            currentPage++;
                        }
                    } else {
                        // No more players returned from the API
                        hasMorePages = false;
                    }
                } catch (error) {
                    console.error(`Could not fetch players for page ${currentPage}:`, error);
                    // If the first page fails, throw the error to show the message.
                    // For subsequent pages, just stop fetching.
                    if (currentPage === 1) throw error;
                    hasMorePages = false;
                }
            }

            if (allPlayers.length > 0) {
                displayPlayers(allPlayers);
            } else {
                playersGrid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">${NO_DATA_MESSAGE(SEASON)}</p>`;
            }
        } catch (error) {
            console.error("Could not fetch players:", error);
            playersGrid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">${error.message}</p>`;
        }
    }

    function displayPlayers(players) {
        playersGrid.innerHTML = '';
        players.forEach(playerData => { if (!playerData.statistics || playerData.statistics.length === 0) return;
            const player = playerData.player;
            const stats = playerData.statistics[0];
            const games = stats.games || {};
            const goals = stats.goals || {};

            const playerCardHTML = `
                <a href="player-details.html?id=${player.id}" class="player-card-link" data-position="${games.position || 'Unknown'}">
                    <div class="player-card">
                        <div class="player-image">
                            <img src="${player.photo}" alt="${player.name}" loading="lazy" onerror="this.parentElement.style.display='none'">
                        </div>
                        <div class="player-info">
                            <h3 class="player-name">${player.name || 'غير معروف'}</h3>
                            <div class="player-team">
                                <img src="${stats.team.logo}" alt="${stats.team.name}" class="team-logo-small" onerror="this.style.display='none'">
                                ${stats.team.name || 'غير معروف'}
                            </div>
                            <div class="player-details">
                                <span><strong>المركز:</strong> ${games.position || '-'}</span>
                            </div>
                            <div class="player-card-stats">
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <span class="stat-value">${games.appearences || 0}</span>
                                        <span class="stat-label"><i class="fas fa-tshirt"></i> مباريات</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-value">${goals.total || 0}</span>
                                        <span class="stat-label"><i class="fas fa-futbol"></i> أهداف</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-value">${goals.assists || 0}</span>
                                        <span class="stat-label"><i class="fas fa-hands-helping"></i> صناعة</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            `;
            playersGrid.insertAdjacentHTML('beforeend', playerCardHTML);
        });

        // Reset filters after loading new league
        searchInput.value = '';
        if (filterContainer) {
            filterContainer.querySelector('.segmented-btn.active')?.classList.remove('active');
            filterContainer.querySelector('.segmented-btn[data-position="All"]')?.classList.add('active');
        }
    }

    initializeLeagueSelector(document.querySelector('#players-page .league-select-wrapper'), fetchPlayers);
    fetchPlayers(leagues[0].id); // Fetch for the default league on page load
}