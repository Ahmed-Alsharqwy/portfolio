
/**
 * Cyber Security Portfolio Scripts (Realtime Database Version)
 * Compatible with file:// protocol and Free Spark Plan
 */

window.onerror = function (msg, url, line) {
    alert("CRITICAL ERROR: " + msg + "\nLine: " + line);
    return false;
};

const firebaseConfig = {
    apiKey: "AIzaSyDOsIritLK5_BRPWuhbkKb2hgXrfstdqG0",
    authDomain: "my-new-portfolio-fced5.firebaseapp.com",
    projectId: "my-new-portfolio-fced5",
    storageBucket: "my-new-portfolio-fced5.firebasestorage.app",
    databaseURL: "https://my-new-portfolio-fced5-default-rtdb.firebaseio.com/",
    messagingSenderId: "310409324936",
    appId: "1:310409324936:web:3e2496092b3dde8678323d",
    measurementId: "G-B5MNT7XFDF"
};

// Initialize Firebase (Compat)
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var db = firebase.database(); // Realtime Database
} else {
    alert("Error: Firebase SDK not loaded. Check internet connection.");
}

// References
const PROJECTS_REF = "projects";
const SKILLS_REF = "skills";
const COURSES_REF = "courses";
const PROFILE_REF = "profile_data";

document.addEventListener('DOMContentLoaded', () => {

    // --- Translations (i18n) ---
    const i18n = {
        en: {
            nav: ["Home", "About", "Skills", "Projects", "Education", "Contact"],
            heroSubtitle: "Cyber Security Analyst | Network & IoT Specialist",
            heroBtnProject: "View Projects",
            heroBtnCV: "Download CV",
            heroBtnContact: "Contact Me",
            aboutTitle: "01. /whoami",
            aboutText1: "Cybersecurity Enthusiast & Life-long Learner",
            aboutText2: "Ahmed Elsayed is passionate about cybersecurity, building strong skills in fundamentals, penetration testing, and network defense.",
            aboutText3: "With hands-on experience using tools like Wireshark and Nmap, he is eager to apply his knowledge, contribute to the field, and keep advancing his expertise",
            skillsTitle: "02. /skills",
            coreComp: "Core Competencies",
            arsenal: "Arsenal",
            languages: "Languages",
            projectsTitle: "03. /projects",
            eduTitle: "04. /education_log",
            contactTitle: "05. /initiate_uplink",
            contactText: "I am currently seeking an internship or entry-level opportunity.",
            typing: ["Network Security.", "IoT System Defense.", "Ethical Hacking."],
        }
    };

    // --- DOM Elements ---
    const dom = {
        projectGrid: document.querySelector('.projects-grid'),
        timeline: document.querySelector('.timeline'),
        skillList: document.querySelector('.skill-list'),
        manageBtn: document.getElementById('manage-content-btn'),
        modal: document.getElementById('admin-modal'),
        closeModal: document.querySelector('.close-modal'),
        hamburger: document.querySelector('.hamburger'),
        navLinks: document.querySelector('.nav-links'),
        // Inputs
        inputProjTitle: document.getElementById('new-proj-title'),
        inputProjDesc: document.getElementById('new-proj-desc'),
        inputProjTech: document.getElementById('new-proj-tech'),
        inputProjUrl: document.getElementById('new-proj-url'),
        inputSkillName: document.getElementById('new-skill-name'),
        inputSkillLevel: document.getElementById('new-skill-level'),
        inputCourseTitle: document.getElementById('new-course-title'),
        inputCourseIssuer: document.getElementById('new-course-issuer'),
        inputCourseDate: document.getElementById('new-course-date'),
        // Profile/CV
        inputProfileImg: document.getElementById('new-profile-img'),
        inputCvFile: document.getElementById('new-cv-file'),
        // Save Buttons
        saveProjBtn: document.getElementById('save-project'),
        saveSkillBtn: document.getElementById('save-skill'),
        saveCourseBtn: document.getElementById('save-course'),
        saveProfileBtn: document.getElementById('save-profile'),
        saveCvBtn: document.getElementById('save-cv'),
    };

    let currentLang = 'en';

    // --- State ---
    let projects = [];
    let skills = [];
    let courses = [];
    let isEditing = false;
    let currentEditKey = null;

    // --- Core Functions ---

    function updateContent(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // Update Text
        const t = i18n[lang];
        document.querySelector('.subtitle').textContent = t.heroSubtitle;
        const mainBtns = document.querySelectorAll('.btn-primary');
        if (mainBtns.length > 0) mainBtns[0].innerHTML = `${t.heroBtnProject} <i class="fas fa-terminal"></i>`;

        const cvBtn = document.getElementById('download-cv-btn');
        if (cvBtn) cvBtn.innerHTML = `${t.heroBtnCV} <i class="fas fa-file-download"></i>`;

        const navLinks = document.querySelectorAll('.nav-links li a');
        navLinks.forEach((a, index) => { if (t.nav[index]) a.textContent = t.nav[index]; });

        // About
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.querySelector('h2').innerHTML = `<span class="accent">${t.aboutTitle.split('/')[0]}</span> /${t.aboutTitle.split('/')[1]}`;
            const aboutPs = aboutSection.querySelectorAll('.about-text p');
            if (aboutPs.length >= 3) {
                aboutPs[0].textContent = t.aboutText1;
                aboutPs[1].innerHTML = t.aboutText2;
                aboutPs[2].innerHTML = t.aboutText3;
            }
        }

        // Section Titles
        const secSkills = document.getElementById('skills');
        if (secSkills) secSkills.querySelector('h2').innerHTML = `<span class="accent">${t.skillsTitle.split('/')[0]}</span> /${t.skillsTitle.split('/')[1]}`;

        const secProj = document.getElementById('projects');
        if (secProj) secProj.querySelector('h2').innerHTML = `<span class="accent">${t.projectsTitle.split('/')[0]}</span> /${t.projectsTitle.split('/')[1]}`;

        const secEdu = document.getElementById('education');
        if (secEdu) secEdu.querySelector('h2').innerHTML = `<span class="accent">${t.eduTitle.split('/')[0]}</span> /${t.eduTitle.split('/')[1]}`;

        const secContact = document.getElementById('contact');
        if (secContact) secContact.querySelector('h2').innerHTML = `<span class="accent">${t.contactTitle.split('/')[0]}</span> /${t.contactTitle.split('/')[1]}`;

        const contactText = document.querySelector('.contact-text');
        if (contactText) contactText.textContent = t.contactText;

        // Typing Effect
        initTyping(t.typing);
    }

    let typingInterval;
    function initTyping(words) {
        const textElement = document.getElementById('typing-text');
        if (!textElement) return;
        if (typingInterval) clearInterval(typingInterval);

        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                textElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                textElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            typingInterval = setTimeout(type, typeSpeed);
        }
        type();
    }

    // --- Admin Authentication ---
    let clickCount = 0;
    const copyright = document.querySelector('.copyright');
    if (copyright) {
        copyright.style.cursor = 'pointer';
        copyright.title = "Admin Login";
        copyright.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 3) {
                clickCount = 0;
                attemptLogin();
            }
        });
    }

    function attemptLogin() {
        const pass = prompt("Enter Admin Password:");
        if (pass === 'admin') {
            enableAdminMode();
        } else if (pass !== null) {
            alert("Access Denied");
        }
    }

    function enableAdminMode() {
        document.body.classList.add('admin-active');
        localStorage.setItem('adminMode', 'true');
        alert("Admin Mode ON: Connected to Realtime Database.");
        location.reload();
    }

    // Logout Logic
    const logoutBtn = document.getElementById('admin-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('adminMode');
            window.location.reload();
        });
    }

    if (localStorage.getItem('adminMode') === 'true') {
        document.body.classList.add('admin-active');
    } else {
        document.body.classList.remove('admin-active');
    }

    function createControls(type, key) {
        return `
            <div class="admin-controls" onclick="event.stopPropagation()">
                <button class="icon-btn edit" onclick="window.editItem('${type}', '${key}')"><i class="fas fa-edit"></i></button>
                <button class="icon-btn delete" onclick="window.deleteItem('${type}', '${key}')"><i class="fas fa-trash"></i></button>
            </div>
        `;
    }

    // --- Realtime Database Logic ---
    function loadData() {
        if (!db) {
            alert("Database object not initialized!");
            return;
        }

        // Projects
        db.ref(PROJECTS_REF).on('value', (snap) => {
            projects = [];
            const data = snap.val();
            if (data) {
                Object.keys(data).forEach(key => projects.push({ ...data[key], key: key }));
            }
            renderAll();
        }, (error) => {
            console.error("Error projects:", error);
            alert("Database Error: " + error.message);
        });

        // Skills
        db.ref(SKILLS_REF).on('value', (snap) => {
            skills = [];
            const data = snap.val();
            if (data) {
                Object.keys(data).forEach(key => skills.push({ ...data[key], key: key }));
            }
            renderAll();
        });

        // Courses
        db.ref(COURSES_REF).on('value', (snap) => {
            courses = [];
            const data = snap.val();
            if (data) {
                Object.keys(data).forEach(key => courses.push({ ...data[key], key: key }));
            }
            renderAll();
        });

        // Profile & CV Data
        db.ref(PROFILE_REF).on('value', (snap) => {
            const data = snap.val();
            if (data) {
                if (data.image) {
                    const profileImg = document.getElementById('hero-profile-img');
                    const navProfileImg = document.getElementById('nav-profile-img');
                    if (profileImg) profileImg.src = data.image;
                    if (navProfileImg) {
                        navProfileImg.src = data.image;
                        navProfileImg.style.display = 'block';
                    }
                }
                if (data.cv) {
                    const cvBtn = document.getElementById('download-cv-btn');
                    if (cvBtn) {
                        cvBtn.href = data.cv;
                        cvBtn.download = "Ahmed_Elsayed_CV.pdf";
                        cvBtn.style.display = 'inline-flex';
                    }
                }
            }
        }, (error) => {
            console.error("Profile Load Error:", error);
            alert("Database Error (Profile): " + error.message);
        });
    }

    function renderAll() {
        if (dom.projectGrid) dom.projectGrid.innerHTML = '';
        if (dom.skillList) dom.skillList.innerHTML = '';
        if (dom.timeline) dom.timeline.innerHTML = '';

        // Projects
        projects.forEach(p => {
            const article = document.createElement('article');
            article.className = 'project-card';
            if (p.url && p.url !== '#') {
                article.style.cursor = 'pointer';
                article.onclick = () => window.open(p.url, '_blank');
            }

            // Image (if any)
            let imgHtml = p.image ? `<div style="width:100%; height:150px; overflow:hidden; border-radius:4px 4px 0 0; margin-bottom:15px;"><img src="${p.image}" style="width:100%; height:100%; object-fit:cover;"></div>` : '';

            article.innerHTML = `
                ${imgHtml}
                <div class="project-header"></div>
                <h3 class="proj-title"></h3>
                <p class="project-desc"></p>
                <ul class="project-tech-list"></ul>
                ${createControls('projects', p.key)}
            `;

            // Securely set text content
            article.querySelector('.proj-title').textContent = p.title;
            article.querySelector('.project-desc').textContent = p.desc;
            const techList = article.querySelector('.project-tech-list');
            if (p.tech) {
                p.tech.split(',').forEach(t => {
                    const li = document.createElement('li');
                    li.textContent = t.trim();
                    techList.appendChild(li);
                });
            }

            dom.projectGrid.appendChild(article);
        });
        // Add Button
        const addProj = document.createElement('article');
        addProj.className = 'project-card add-card';
        addProj.innerHTML = `<div style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; color:var(--text-secondary);"><i class="fas fa-plus" style="font-size:3rem; margin-bottom:20px; color:var(--accent);"></i><h3>Add Project</h3></div>`;
        addProj.style.border = '1px dashed #333';
        addProj.onclick = () => { openModal('form-project'); };
        if (dom.projectGrid) dom.projectGrid.appendChild(addProj);

        // Skills
        skills.forEach(s => {
            const div = document.createElement('div');
            div.className = 'skill-item';
            div.innerHTML = `
                <div class="skill-circle" style="background: conic-gradient(var(--accent) ${s.level}%, #222 0%)">
                    <i class="fas fa-shield-alt"></i>
                    <span class="percent">${s.level}%</span>
                </div>
                <div class="skill-name">${s.name}</div>
                ${createControls('skills', s.key)}
            `;
            dom.skillList.appendChild(div);
        });
        const addSkill = document.createElement('div');
        addSkill.className = 'skill-item add-card';
        addSkill.innerHTML = `
            <div class="skill-circle" style="border: 1px dashed var(--accent); background: transparent;">
                <i class="fas fa-plus"></i>
            </div>
            <div class="skill-name">Add Skill</div>
        `;
        addSkill.onclick = () => { openModal('form-skill'); };
        if (dom.skillList) dom.skillList.appendChild(addSkill);

        // Courses
        courses.forEach(c => {
            const div = document.createElement('div');
            div.className = 'timeline-item';
            div.innerHTML = `
                <div class="timeline-header">
                    <h3>${c.title}</h3>
                    <span class="company">@ ${c.issuer}</span>
                    <span class="date">${c.date}</span>
                    ${c.image ? `<div style="margin-top:10px;"><img src="${c.image}" style="max-width:100%; max-height:150px;" ></div>` : ''}
                </div>
                ${createControls('courses', c.key)}
            `;
            dom.timeline.appendChild(div);
        });
    }

    // --- Global Controls ---
    window.deleteItem = (type, key) => {
        if (!key || key === 'undefined') return;
        if (confirm('Delete from Cloud?')) {
            db.ref(type + '/' + key).remove();
        }
    };

    window.editItem = (type, key) => {
        let item;
        if (type === 'projects') item = projects.find(i => i.key === key);
        if (type === 'skills') item = skills.find(i => i.key === key);
        if (type === 'courses') item = courses.find(i => i.key === key);

        if (!item) return;
        isEditing = true; currentEditKey = key;

        if (type === 'projects') {
            openModal('form-project');
            if (dom.inputProjTitle) dom.inputProjTitle.value = item.title;
            if (dom.inputProjDesc) dom.inputProjDesc.value = item.desc;
            if (dom.inputProjTech) dom.inputProjTech.value = item.tech;
            if (dom.inputProjUrl) dom.inputProjUrl.value = item.url || '';
        } else if (type === 'skills') {
            openModal('form-skill');
            if (dom.inputSkillName) dom.inputSkillName.value = item.name;
            if (dom.inputSkillLevel) dom.inputSkillLevel.value = item.level;
        } else if (type === 'courses') {
            openModal('form-course');
            if (dom.inputCourseTitle) dom.inputCourseTitle.value = item.title;
            if (dom.inputCourseIssuer) dom.inputCourseIssuer.value = item.issuer;
            if (dom.inputCourseDate) dom.inputCourseDate.value = item.date;
        }
    };

    // --- Modal & Forms ---
    function openModal(tabId) {
        if (dom.modal) dom.modal.style.display = 'block';
        if (!isEditing) document.querySelectorAll('input, textarea').forEach(i => i.value = '');
        const targetBtn = document.querySelector(`[data-target="${tabId}"]`);
        if (targetBtn) targetBtn.click();
    }

    if (dom.manageBtn) dom.manageBtn.addEventListener('click', () => { isEditing = false; openModal('form-project'); });
    if (dom.closeModal) dom.closeModal.addEventListener('click', () => { dom.modal.style.display = 'none'; isEditing = false; });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.form-section').forEach(f => f.classList.remove('active'));
            e.target.classList.add('active');
            const targetSec = document.getElementById(e.target.dataset.target);
            if (targetSec) targetSec.classList.add('active');
        });
    });

    // Helper: Robust Resize Image
    async function resizeImage(file, maxWidth = 600) {
        return new Promise((resolve, reject) => {
            if (!file) {
                return reject(new Error("لم يتم اختيار ملف. (No file selected)"));
            }

            // Validating file type
            if (!file.type.startsWith('image/')) {
                return reject(new Error(`نوع الملف غير مدعوم: ${file.type || 'غير معروف'}. يرجى استخدام صور JPG أو PNG.`));
            }

            const reader = new FileReader();

            reader.onerror = () => {
                const errorMap = {
                    1: "NotFoundError",
                    2: "SecurityError",
                    3: "AbortError",
                    4: "NotReadableError",
                    5: "EncodingError"
                };
                const errName = reader.error ? reader.error.name : "UnknownError";
                reject(new Error(`المتصفح لا يستطيع قراءة الملف: ${errName}. (حجمه: ${(file.size / 1024 / 1024).toFixed(2)}MB)`));
            };

            reader.onload = (e) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onerror = () => reject(new Error("بيانات الصورة تالفة أو غير صالحة للتحميل."));
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;

                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                        ctx.drawImage(img, 0, 0, width, height);

                        // Fallback to lower quality if the result is still huge
                        let dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                        if (dataUrl.length > 1000000) { // If > 1MB after resize
                            dataUrl = canvas.toDataURL('image/jpeg', 0.4);
                        }
                        resolve(dataUrl);
                    } catch (err) {
                        reject(new Error("حدث خطأ أثناء معالجة أبعاد الصورة. " + err.message));
                    }
                };
                img.src = e.target.result;
            };

            // Start reading with a small delay for mobile OS file handover
            setTimeout(() => {
                try {
                    reader.readAsDataURL(file);
                } catch (err) {
                    reject(new Error("فشل البدء في قراءة الملف: " + err.message));
                }
            }, 100);
        });
    }

    // Save Logic (RTDB)
    function saveItemToFirebase(path, data) {
        let promise;
        if (isEditing && currentEditKey) {
            promise = db.ref(path + '/' + currentEditKey).update(data);
        } else {
            // For RTDB, push() generates a unique key
            promise = db.ref(path).push(data);
        }

        promise.then(() => {
            if (dom.modal) dom.modal.style.display = 'none';
            alert("Saved to Cloud!");
        }).catch((e) => {
            console.error(e);
            alert("Error saving: " + e.message);
        });
    }

    if (dom.saveProjBtn) dom.saveProjBtn.addEventListener('click', async () => {
        dom.saveProjBtn.textContent = "Processing Image...";
        dom.saveProjBtn.disabled = true;

        const newItem = {
            title: dom.inputProjTitle.value,
            desc: dom.inputProjDesc.value,
            tech: dom.inputProjTech.value,
            url: dom.inputProjUrl.value
        };

        const fileInput = document.getElementById('new-proj-img');
        if (fileInput && fileInput.files[0]) {
            try {
                // Resize to max 800px for projects
                const base64 = await resizeImage(fileInput.files[0], 800);
                newItem.image = base64;
                saveItemToFirebase(PROJECTS_REF, newItem);
            } catch (e) {
                console.error("Image processing error:", e);
                alert("Upload Failed: " + e.message);
                dom.saveProjBtn.textContent = "Save Project";
                dom.saveProjBtn.disabled = false;
                return;
            }
        } else {
            saveItemToFirebase(PROJECTS_REF, newItem);
        }

        dom.saveProjBtn.textContent = "Save Project";
        dom.saveProjBtn.disabled = false;
    });

    // Skills Save
    if (dom.saveSkillBtn) dom.saveSkillBtn.addEventListener('click', () => {
        saveItemToFirebase(SKILLS_REF, {
            name: dom.inputSkillName.value,
            level: dom.inputSkillLevel.value
        });
    });

    // Course Save
    if (dom.saveCourseBtn) dom.saveCourseBtn.addEventListener('click', async () => {
        dom.saveCourseBtn.textContent = "Saving...";
        dom.saveCourseBtn.disabled = true;

        const newItem = {
            title: dom.inputCourseTitle.value,
            issuer: dom.inputCourseIssuer.value,
            date: dom.inputCourseDate.value
        };
        const fileInput = document.getElementById('new-course-img');
        if (fileInput && fileInput.files[0]) {
            try {
                const base64 = await resizeImage(fileInput.files[0], 600);
                newItem.image = base64;
                saveItemToFirebase(COURSES_REF, newItem);
            } catch (e) {
                console.error("Course image error:", e);
                alert("Error optimizing certificate image: " + e.message);
            }
        } else {
            saveItemToFirebase(COURSES_REF, newItem);
        }
        dom.saveCourseBtn.textContent = "Save Course";
        dom.saveCourseBtn.disabled = false;
    });

    // Profile Save
    if (dom.saveProfileBtn) dom.saveProfileBtn.addEventListener('click', async () => {
        const fileInput = dom.inputProfileImg;
        if (fileInput && fileInput.files[0]) {
            dom.saveProfileBtn.textContent = "Uploading...";
            dom.saveProfileBtn.disabled = true;
            try {
                const base64 = await resizeImage(fileInput.files[0], 600);
                db.ref(PROFILE_REF).update({ image: base64 }).then(() => {
                    alert("Profile Image Updated!");
                }).finally(() => {
                    dom.saveProfileBtn.textContent = "Update Image";
                    dom.saveProfileBtn.disabled = false;
                });
            } catch (e) {
                alert("Error updating profile image: " + e.message);
                dom.saveProfileBtn.textContent = "Update Image";
                dom.saveProfileBtn.disabled = false;
            }
        } else {
            alert("Please select an image first.");
        }
    });

    // CV Save
    if (dom.saveCvBtn) dom.saveCvBtn.addEventListener('click', () => {
        const fileInput = dom.inputCvFile;
        if (fileInput && fileInput.files[0]) {
            dom.saveCvBtn.textContent = "Uploading...";
            const reader = new FileReader();
            reader.onload = (e) => {
                db.ref(PROFILE_REF).update({ cv: e.target.result }).then(() => {
                    alert("CV File Uploaded!");
                    dom.saveCvBtn.textContent = "Upload CV";
                });
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    });

    // Init
    updateContent(currentLang);
    loadData();

    // Matrix Effect
    const canvas = document.getElementById('matrix-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);
        function draw() {
            ctx.fillStyle = "rgba(5, 5, 5, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Sync matrix color with theme accent
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim() || "#0F0";
            ctx.font = fontSize + "px monospace";
            for (let i = 0; i < drops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        }
        setInterval(draw, 50);
        window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
    }

    // --- Theme Switcher ---
    const themes = ['theme-green', 'theme-blue', 'theme-red', 'theme-purple'];
    let currentThemeIndex = 0;
    const themeBtn = document.getElementById('theme-toggle');

    // Load saved theme
    const savedTheme = localStorage.getItem('site-theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        currentThemeIndex = themes.indexOf(savedTheme);
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.remove(themes[currentThemeIndex]);
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            const newTheme = themes[currentThemeIndex];
            if (newTheme !== 'theme-green') {
                document.body.classList.add(newTheme);
            }
            localStorage.setItem('site-theme', newTheme);
        });
    }

    // Mobile Menu Toggle
    if (dom.hamburger) {
        dom.hamburger.addEventListener('click', () => {
            dom.navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            dom.navLinks.classList.remove('active');
        });
    });

});
