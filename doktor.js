/* ==================== FIREBASE CONFIG ==================== */
var firebaseConfig = {
    apiKey: "AIzaSyB1A5flcC2cZYQszjvnzrTDXYH3UIKBl4Q",
    authDomain: "doctorai-84595.firebaseapp.com",
    projectId: "doctorai-84595",
    storageBucket: "doctorai-84595.firebasestorage.app",
    messagingSenderId: "109454873990",
    appId: "1:109454873990:web:bb77554ecb159359984807"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

window.fbReady = (async function () {
    var base = "https://www.gstatic.com/firebasejs/10.12.2/";
    var appMod = await import(base + "firebase-app.js");
    var fs = await import(base + "firebase-firestore.js");
    var app = appMod.initializeApp(firebaseConfig);
    window.fb = {
        db: fs.getFirestore(app),
        doc: fs.doc, setDoc: fs.setDoc, getDoc: fs.getDoc, getDocs: fs.getDocs,
        collection: fs.collection, collectionGroup: fs.collectionGroup,
        query: fs.query, where: fs.where,
        serverTimestamp: fs.serverTimestamp, deleteDoc: fs.deleteDoc,
        addDoc: fs.addDoc, orderBy: fs.orderBy, limit: fs.limit,
        onSnapshot: fs.onSnapshot
    };
    return window.fb;
})();
window.fbReady.catch(function (e) { console.error('Firebase init failed:', e); });
async function getFB() {
    try { return await window.fbReady; }
    catch (e) { throw new Error('تعذر الاتصال بـ Firebase'); }
}

/* ==================== GLOBAL STATE ==================== */
var currentUserKey = null;
var currentAvatar = null;
var currentCover = null;
var currentJoinedDate = null;
var currentProfilePrivacy = 'public';
var postImageFiles = [];
var postPrivacy = 'public';
var currentViewingProfileKey = null;
var currentPublicProfileCache = null;
var pendingVerificationEmail = null;
var currentBadgeType = 'none';
var appealsUnsubscribe = null;
var viewedPosts = {};
var currentPage = 'homePage';
var currentChatPartner = null;
var currentChatPartnerBadge = 'none';
var currentChatPartnerName = '';
var chatUnsubscribe = null;
var viewerImages = [], viewerIndex = 0;
var adminTargetKey = null;
var storiesList = [];
var currentStoryIndex = 0;
var storyTimer = null;
var currentBgSelection = 'default';
var currentStoryCreateTab = 'story';
var currentProductCategory = 'all';

/* ==================== CONSTANTS ==================== */
var IMGBB_API_KEY = "af3d93f81d6477d7859d22e79094bda2";
var NORMAL_BADGE_URL = 'https://res.cloudinary.com/dtdnb4yp1/image/upload/v1794862678/Twitter_Verified_Badge.svg_qqheob.png';
var OWNER_BADGE_URL  = 'https://res.cloudinary.com/dtdnb4yp1/image/upload/v1794862679/Twitter_Verified_Badge_Gold.svg_suieqe.png';
var BLACK_BADGE_URL  = 'https://res.cloudinary.com/dtdnb4yp1/image/upload/v1795016192/Twitter_Verified_Badge_Gray.svg_1_hr48kq.png';
var DEFAULT_AVATAR = 'https://res.cloudinary.com/dtdnb4yp1/image/upload/v1738530112/ConvertedWebP12_y05y2c.webp';

function badgeSrc(type) {
    if (type === 'owner') return OWNER_BADGE_URL;
    if (type === 'black') return BLACK_BADGE_URL;
    return NORMAL_BADGE_URL;
}
function profileKeyFrom(email) {
    var e = (email || '').trim().toLowerCase();
    return e || null;
}
function isAdminType(type) {
    return type === 'owner' || type === 'black';
}

/* ==================== I18N SYSTEM ==================== */
var TRANSLATIONS = {
    ar: {
        home: 'الرئيسية', more: 'المزيد', products: 'المنتجات', games: 'الألعاب',
        premium: 'بريميوم', account: 'حسابي', chat: 'الدردشات',
        more_apps: 'المزيد من التطبيقات', buy_coffee: 'اشتري لي القهوة',
        admin_panel: 'لوحة التحكم', settings_support: 'الإعدادات والدعم',
        settings: 'الإعدادات', my_account: 'حسابي', theme: 'مظهر التطبيق',
        all: 'الكل', electronics: 'إلكترونيات', clothes: 'ملابس', accessories: 'إكسسوارات',
        loading_posts: 'جاري تحميل المنشورات...', no_posts: 'لا توجد منشورات بعد',
        chats: 'الدردشات', chat_with_following: 'تواصل مع من تتابعهم',
        no_chats: 'لا توجد محادثات بعد', open_profile_to_message: 'افتح بروفايل شخص واضغط "مراسلة"',
        type_message: 'اكتب رسالة...', start_chat: 'ابدأ المحادثة...',
        edit: 'تعديل', follow: 'متابعة', unfollow: 'إلغاء المتابعة', message: 'مراسلة',
        followers: 'متابع', following: 'يتابع', joined: 'انضم في',
        my_posts: 'منشوراتي', no_my_posts: 'لا توجد منشورات بعد',
        login: 'تسجيل الدخول', register: 'إنشاء حساب', logout: 'خروج',
        email: 'البريد الإلكتروني', password: 'كلمة المرور', name: 'الاسم الكامل',
        username: 'اسم المستخدم', bio: 'نبذة تعريفية', website: 'رابط الموقع الإلكتروني',
        privacy: 'خصوصية البروفايل', public: 'عام', private: 'خاص',
        save: 'حفظ البيانات', welcome: 'مرحباً بك',
        welcome_desc: 'قم بتسجيل الدخول إلى حسابك أو أنشئ حساباً جديداً.',
        no_account: 'ليس لديك حساب؟', create_account: 'إنشاء حساب',
        back: 'رجوع', forgot_password: 'نسيت كلمة المرور؟',
        notifications: 'الإشعارات', messages: 'الرسائل', appeals: 'طلبات المراجعة',
        no_messages: 'لا توجد رسائل', no_appeals: 'لا توجد طلبات',
        create_post: 'إنشاء منشور', choose_images: 'اختيار صور',
        publish: 'نشر', cancel: 'إلغاء',
        pin: 'تثبيت', unpin: 'إلغاء التثبيت', delete_chat: 'حذف المحادثة',
        delete_user: 'حذف المستخدم', change_bg: 'تغيير الخلفية', delete: 'حذف',
        confirm_delete: 'هل أنت متأكد من الحذف؟',
        saved: 'تم الحفظ', deleted: 'تم الحذف', pinned: 'تم التثبيت', unpinned: 'تم إلغاء التثبيت',
        language: 'اللغة', login_first: 'سجل الدخول أولاً', chat_settings: 'إعدادات الشات',
        light: 'فاتح', dark: 'داكن', blue: 'أزرق',
        verify_request: 'طلب التوثيق', info: 'معلومات',
        privacy_policy: 'سياسة الخصوصية', terms: 'شروط الخدمة',
        what_to_publish: 'ماذا تريد أن تنشر؟', post: 'منشور', story: 'ستوري',
        post_desc: 'شارك صور مع وصف', story_desc: 'صورة أو بث مباشر يختفي بعد 24 ساعة',
        no_products: 'لا توجد منتجات في هذه الفئة',
        footer_home: 'الرئيسية',
        footer_premium: 'بريميوم',
        footer_games: 'الألعاب',
        footer_products: 'المتجر',
        footer_chat: 'الدردشات',
        footer_account: 'انت',
        footer_labels_show: 'إظهار النصوص',
        footer_labels_hide: 'إخفاء النصوص'
    },
    en: {
        home: 'Home', more: 'More', products: 'Products', games: 'Games',
        premium: 'Premium', account: 'Account', chat: 'Chats',
        more_apps: 'More Apps', buy_coffee: 'Buy me a coffee',
        admin_panel: 'Admin Panel', settings_support: 'Settings & Support',
        settings: 'Settings', my_account: 'My Account', theme: 'App Theme',
        all: 'All', electronics: 'Electronics', clothes: 'Clothes', accessories: 'Accessories',
        loading_posts: 'Loading posts...', no_posts: 'No posts yet',
        chats: 'Chats', chat_with_following: 'Chat with people you follow',
        no_chats: 'No chats yet', open_profile_to_message: 'Open someone profile and tap "Message"',
        type_message: 'Type a message...', start_chat: 'Start the conversation...',
        edit: 'Edit', follow: 'Follow', unfollow: 'Unfollow', message: 'Message',
        followers: 'Followers', following: 'Following', joined: 'Joined',
        my_posts: 'My Posts', no_my_posts: 'No posts yet',
        login: 'Login', register: 'Sign Up', logout: 'Logout',
        email: 'Email', password: 'Password', name: 'Full Name',
        username: 'Username', bio: 'Bio', website: 'Website URL',
        privacy: 'Profile Privacy', public: 'Public', private: 'Private',
        save: 'Save', welcome: 'Welcome',
        welcome_desc: 'Sign in to your account or create a new one.',
        no_account: "Don't have an account?", create_account: 'Create Account',
        back: 'Back', forgot_password: 'Forgot password?',
        notifications: 'Notifications', messages: 'Messages', appeals: 'Appeals',
        no_messages: 'No messages', no_appeals: 'No appeals',
        create_post: 'Create Post', choose_images: 'Choose images',
        publish: 'Publish', cancel: 'Cancel',
        pin: 'Pin', unpin: 'Unpin', delete_chat: 'Delete Chat',
        delete_user: 'Delete User', change_bg: 'Change background', delete: 'Delete',
        confirm_delete: 'Are you sure you want to delete?',
        saved: 'Saved', deleted: 'Deleted', pinned: 'Pinned', unpinned: 'Unpinned',
        language: 'Language', login_first: 'Please login first', chat_settings: 'Chat Settings',
        light: 'Light', dark: 'Dark', blue: 'Blue',
        verify_request: 'Verification Request', info: 'Information',
        privacy_policy: 'Privacy Policy', terms: 'Terms of Service',
        what_to_publish: 'What do you want to publish?', post: 'Post', story: 'Story',
        post_desc: 'Share photos with caption', story_desc: 'Photo or live stream disappears after 24h',
        no_products: 'No products in this category',
        no_products: 'No products in this category',
        footer_home: 'Home',
        footer_premium: 'Premium',
        footer_games: 'Games',
        footer_products: 'Store',
        footer_chat: 'Chats',
        footer_account: 'Account',
        footer_labels_show: 'Show labels',
        footer_labels_hide: 'Hide labels'
    }
};

function t(key) {
    var lang = localStorage.getItem('lang') || 'ar';
    return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || key;
}

function applyTranslations() {
    var lang = localStorage.getItem('lang') || 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    var tabHome = document.getElementById('tab-home');
    if (tabHome) tabHome.querySelector('span').textContent = t('home');
    var tabMore = document.getElementById('tab-more');
    if (tabMore) tabMore.querySelector('span').textContent = t('more');

    var sidebarLinks = document.querySelectorAll('.sidebar .icon-text-item a span b');
    if (sidebarLinks[0]) sidebarLinks[0].textContent = t('home');
    if (sidebarLinks[1]) sidebarLinks[1].textContent = t('more_apps');
    if (sidebarLinks[2]) sidebarLinks[2].textContent = t('premium');
    if (sidebarLinks[3]) sidebarLinks[3].textContent = t('buy_coffee');
    if (sidebarLinks[4]) sidebarLinks[4].textContent = t('admin_panel');
    var supportHeader = document.querySelector('#professionalToolsHeader span');
    if (supportHeader) supportHeader.textContent = t('settings_support');

    var cats = document.querySelectorAll('#categoriesBar .cat-btn');
    if (cats[0]) cats[0].textContent = t('all');
    if (cats[1]) cats[1].textContent = t('electronics');
    if (cats[2]) cats[2].textContent = t('clothes');
    if (cats[3]) cats[3].textContent = t('accessories');

    var chatHeader = document.querySelector('#chatPage .products-header h2');
    if (chatHeader) chatHeader.textContent = t('chats');
    var chatDesc = document.querySelector('#chatPage .products-header p');
    if (chatDesc) chatDesc.textContent = t('chat_with_following');
    var chatInput = document.getElementById('chatInput');
    if (chatInput) chatInput.placeholder = t('type_message');

    var welcomeH2 = document.querySelector('#authChoiceScreen h2');
    if (welcomeH2) welcomeH2.textContent = t('welcome');
    var welcomeP = document.querySelector('#authChoiceScreen p');
    if (welcomeP) welcomeP.textContent = t('welcome_desc');
    var loginBtn = document.querySelector('#authChoiceScreen .auth-choice-btn.primary');
    if (loginBtn) loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> ' + t('login');
    var switchText = document.querySelector('#authChoiceScreen .auth-switch-text');
    if (switchText) switchText.innerHTML = t('no_account') + ' <a onclick="showCreateAccountForm()">' + t('create_account') + '</a>';

    var loginH3 = document.querySelector('#loginForm .auth-form-header h3');
    if (loginH3) loginH3.innerHTML = '<i class="fas fa-key"></i> ' + t('login');
    var loginBtn2 = document.querySelector('#loginForm button[onclick="loginWithEmail()"]');
    if (loginBtn2) loginBtn2.innerHTML = '<i class="fas fa-sign-in-alt"></i> ' + t('login');
    var resetBtn = document.querySelector('#loginForm button[onclick="resetPassword()"]');
    if (resetBtn) resetBtn.textContent = t('forgot_password');

    var saveBtn = document.getElementById('saveProfileBtn');
    if (saveBtn) saveBtn.innerHTML = '<i class="fas fa-save"></i> ' + t('save');

    var createPostH = document.querySelector('#createPostModal p[style*="font-weight:bold"]');
    if (createPostH) createPostH.innerHTML = '<i class="fas fa-camera"></i> ' + t('create_post');
    var publishBtn = document.getElementById('publishPostBtn');
    if (publishBtn) publishBtn.textContent = t('publish');

    var settingsHeader = document.querySelector('#settingsPage .products-header h2');
    if (settingsHeader) settingsHeader.innerHTML = '<i class="fas fa-cog"></i> ' + t('settings');

    var chatSettingsHeader = document.querySelector('#chatSettingsPage .products-header h2');
    if (chatSettingsHeader) chatSettingsHeader.innerHTML = '<i class="fas fa-cog"></i> ' + t('chat_settings');

    // Bottom Sheet
    var sheetTitle = document.querySelector('#postActionSheet p[style*="font-weight:bold"]');
    if (sheetTitle) sheetTitle.textContent = t('what_to_publish');
    var sheetBtns = document.querySelectorAll('#postActionSheet button');
    if (sheetBtns[0]) {
        var postLabel = sheetBtns[0].querySelector('div div:first-child');
        var postDesc = sheetBtns[0].querySelector('div div:last-child');
        if (postLabel) postLabel.textContent = t('post');
        if (postDesc) postDesc.textContent = t('post_desc');
    }
    if (sheetBtns[1]) {
        var storyLabel = sheetBtns[1].querySelector('div div:first-child');
        var storyDesc = sheetBtns[1].querySelector('div div:last-child');
        if (storyLabel) storyLabel.textContent = t('story');
        if (storyDesc) storyDesc.textContent = t('story_desc');
    }
    if (sheetBtns[2]) sheetBtns[2].textContent = t('cancel');

    // Re-render
    if (currentPage === 'morePage') loadPublicPosts();
    if (currentPage === 'chatPage') loadChatList();
    if (currentPage === 'chatRoomPage' && currentChatPartner) openChatWith(currentChatPartner);
    if (document.getElementById('pfName')) renderProfileView();
    renderChatBgPicker();
    renderPinnedChats();
    filterProducts(currentProductCategory);
}

function changeLanguage(lang) {
    localStorage.setItem('lang', lang);
    applyTranslations();
    toast(t('saved'));
}

function applySavedTheme() {
    var saved = localStorage.getItem('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    var savedLang = localStorage.getItem('lang');
    if (savedLang) {
        document.documentElement.lang = savedLang;
        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    }
    setTimeout(updateThemeIcons, 100);
    setTimeout(applyAccountAvatarIcon, 200);
}

function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var next = current === 'light' ? 'dark' : (current === 'dark' ? 'blue' : 'light');
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcons();
    applyAccountAvatarIcon();
    toast(t('saved'));
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcons();
    applyAccountAvatarIcon();
    toast(t('saved'));
}

function updateThemeIcons() {
    var theme = document.documentElement.getAttribute('data-theme') || 'light';
    document.querySelectorAll('footer img[data-light]').forEach(function(img){
        if (img.id === 'account-icon' && localStorage.getItem('app_avatar_url')) return;
        var src = img.getAttribute('data-' + theme) || img.getAttribute('data-light');
        if (src) img.src = src;
    });
}

function applyAccountAvatarIcon() {
    var url = localStorage.getItem('app_avatar_url');
    var acc = document.getElementById('account-icon');
    if (url && acc) {
        acc.src = url;
        acc.style.borderRadius = '50%';
        acc.style.objectFit = 'cover';
        acc.style.border = '2px solid var(--avatar-border-color)';
    }
}

/* ==================== TOAST ==================== */
function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timeout);
    el._timeout = setTimeout(function(){ el.classList.remove('show'); }, 2000);
}

/* ==================== BADGE TOOLTIP ==================== */
function showBadgeTooltip(e, imgEl) {
    e.stopPropagation();
    var inProfile = imgEl.closest('#profileView') || imgEl.closest('#publicProfilePage');
    if (!inProfile) return;
    var tooltip = document.getElementById('badgeTooltip');
    var src = imgEl.src || '';
    var isOwner = src === OWNER_BADGE_URL || src.indexOf('Gold') >= 0;
    var isBlack = src === BLACK_BADGE_URL;
    var lang = localStorage.getItem('lang') || 'ar';
    var text;
    if (isBlack) text = lang === 'en' ? 'Black Verified Account' : 'حساب موثّق (توثيق أسود)';
    else if (isOwner) text = lang === 'en' ? 'Owner / Partner Account' : 'حساب مالك التطبيق أو أحد شركائه';
    else text = lang === 'en' ? 'Verified Account' : 'حساب تم التحقق منه';
    tooltip.textContent = text;
    tooltip.className = 'badge-tooltip show ' + (isBlack ? 'black' : (isOwner ? 'gold' : 'blue'));
    var rect = imgEl.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top - 10) + 'px';
    tooltip.style.transform = 'translate(-50%, -100%)';
    tooltip.style.display = 'block';
    tooltip.style.opacity = '1';
    clearTimeout(tooltip._timeout);
    tooltip._timeout = setTimeout(function () {
        tooltip.classList.remove('show');
        setTimeout(function(){ tooltip.style.display = 'none'; }, 250);
    }, 3000);
}

/* ==================== IMAGE VIEWER ==================== */
function openImageViewer(urls, index) {
    viewerImages = Array.isArray(urls) ? urls : [urls];
    viewerIndex = index || 0;
    if (viewerImages.length === 0) return;
    document.getElementById('imageViewer').style.display = 'flex';
    updateViewer();
    document.body.style.overflow = 'hidden';
}
function updateViewer() {
    document.getElementById('viewerImg').src = viewerImages[viewerIndex];
    document.getElementById('viewerCounter').textContent = (viewerIndex + 1) + ' / ' + viewerImages.length;
    var prev = document.querySelector('#imageViewer .iv-prev');
    var next = document.querySelector('#imageViewer .iv-next');
    if (prev) prev.style.display = viewerImages.length > 1 ? 'flex' : 'none';
    if (next) next.style.display = viewerImages.length > 1 ? 'flex' : 'none';
}
function closeImageViewer() {
    document.getElementById('imageViewer').style.display = 'none';
    document.body.style.overflow = '';
}
function nextImage() { viewerIndex = (viewerIndex + 1) % viewerImages.length; updateViewer(); }
function prevImage() { viewerIndex = (viewerIndex - 1 + viewerImages.length) % viewerImages.length; updateViewer(); }

/* ==================== SWIPE NAVIGATION (PROFESSIONAL) ==================== */
var swipePages = ['homePage', 'morePage', 'productsPage', 'gamesPage', 'premiumPage', 'chatPage', 'accountPage'];
var swipeStartX = 0, swipeStartY = 0, swipeTracking = false;
var swipeThreshold = 80;
var swipeIgnoredElements = ['INPUT', 'TEXTAREA', 'SELECT'];
var swipeMinMove = 15;

function isSwipeIgnored(target) {
    if (!target) return false;
    var tag = target.tagName;
    if (swipeIgnoredElements.indexOf(tag) > -1) return true;
    if (target.closest('.carousel') || target.closest('.modal') || target.closest('.flickity-enabled')) return true;
    if (target.closest('#imageViewer') || target.closest('#storyViewer')) return true;
    if (target.closest('.categories-bar') || target.closest('#storiesBar')) return true;
    if (target.closest('#postActionSheet')) return true;
    return false;
}

function showSwipeIndicator(text) {
    var ind = document.getElementById('swipeIndicator');
    if (!ind) return;
    ind.innerHTML = '<i class="fas fa-arrow-left"></i> ' + text;
    ind.classList.add('show');
    clearTimeout(ind._timeout);
    ind._timeout = setTimeout(function(){ ind.classList.remove('show'); }, 1400);
}

function applySwipeTransform(diffX) {
    var active = document.querySelector('.content.active');
    if (!active) return;
    // حركة احترافية أثناء السحب
    var translate = diffX * 0.3;
    var opacity = 1 - Math.abs(diffX) / 800;
    active.style.transition = 'none';
    active.style.transform = 'translateX(' + translate + 'px)';
    active.style.opacity = Math.max(0.7, opacity);
}

function resetSwipeTransform() {
    var active = document.querySelector('.content.active');
    if (!active) return;
    active.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';
    active.style.transform = '';
    active.style.opacity = '';
}

function handleSwipeNavigation(startX, startY, endX, endY) {
    var diffX = startX - endX;
    var diffY = startY - endY;
    if (Math.abs(diffY) > Math.abs(diffX)) { resetSwipeTransform(); return; }
    if (Math.abs(diffX) < swipeThreshold) { resetSwipeTransform(); return; }
    
    var isRTL = document.documentElement.dir === 'rtl';
    var currentIdx = swipePages.indexOf(currentPage);
    if (currentIdx === -1) { resetSwipeTransform(); return; }
    
    var nextIdx = null;
    if (isRTL) {
        if (diffX > 0) nextIdx = currentIdx + 1;
        else nextIdx = currentIdx - 1;
    } else {
        if (diffX < 0) nextIdx = currentIdx + 1;
        else nextIdx = currentIdx - 1;
    }
    if (nextIdx < 0) nextIdx = 0;
    if (nextIdx >= swipePages.length) nextIdx = swipePages.length - 1;
    
    resetSwipeTransform();
    
    if (nextIdx !== currentIdx) {
        var targetPage = swipePages[nextIdx];
        var pageNames = {
            homePage: t('home'), morePage: t('more'), productsPage: t('products'),
            gamesPage: t('games'), premiumPage: t('premium'), chatPage: t('chat'), accountPage: t('account')
        };
        showSwipeIndicator(pageNames[targetPage] || targetPage);
        switchTab(targetPage);
    }
}

document.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    if (isSwipeIgnored(e.target)) return;
    swipeStartX = e.touches[0].screenX;
    swipeStartY = e.touches[0].screenY;
    swipeTracking = true;
}, { passive: true });

document.addEventListener('touchmove', function (e) {
    if (!swipeTracking || e.touches.length !== 1) return;
    var currentX = e.touches[0].screenX;
    var currentY = e.touches[0].screenY;
    var diffX = swipeStartX - currentX;
    var diffY = swipeStartY - currentY;
    if (Math.abs(diffY) > Math.abs(diffX)) return;
    if (Math.abs(diffX) > swipeMinMove) {
        applySwipeTransform(diffX);
    }
}, { passive: true });

document.addEventListener('touchend', function (e) {
    if (!swipeTracking) return;
    swipeTracking = false;
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    handleSwipeNavigation(swipeStartX, swipeStartY, e.changedTouches[0].screenX, e.changedTouches[0].screenY);
}, { passive: true });

/* ==================== TAB SWITCHING ==================== */
function switchTab(pageId) {
    document.querySelectorAll('.content').forEach(function(el){ el.classList.remove('active'); });
    var target = document.getElementById(pageId);
    if (target) {
        // إعادة تعيين أي transform من السحب
        target.style.transition = 'none';
        target.style.transform = '';
        target.style.opacity = '';
        target.classList.add('active');
        currentPage = pageId;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (pageId === 'chatPage' || pageId === 'chatRoomPage' || pageId === 'chatSettingsPage') {
        document.body.classList.add('chat-mode');
    } else {
        document.body.classList.remove('chat-mode');
    }

    if (pageId === 'chatPage') loadChatList();
    if (pageId === 'chatSettingsPage') { renderChatBgPicker(); renderPinnedChats(); }
    if (pageId === 'morePage') loadPublicPosts();
    if (pageId === 'productsPage') filterProducts(currentProductCategory);
    if (pageId === 'accountPage') {
        if (currentUserKey) loadProfileAndShow();
        else showAuthChoice();
    }
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function(t){ t.classList.toggle('active', t.getAttribute('data-target') === pageId); });

    var pcb = document.getElementById('postCreateBtn');
    if (pcb) {
        pcb.style.display = (pageId === 'morePage') ? 'flex' : 'none';
    }
}

function closeChatRoom() {
    if (chatUnsubscribe) {
        try { chatUnsubscribe(); } catch(e){}
        chatUnsubscribe = null;
    }
    currentChatPartner = null;
    switchTab('chatPage');
}

/* ==================== POST ACTION SHEET ==================== */
function openPostActionSheet() {
    if (!currentUserKey) { alert(t('login_first')); return; }
    document.getElementById('postActionSheet').style.display = 'flex';
}
function closePostActionSheet() {
    document.getElementById('postActionSheet').style.display = 'none';
}

/* ==================== PRODUCTS ==================== */
function filterProducts(category) {
    currentProductCategory = category;
    var cards = document.querySelectorAll('#productsGrid .product-card');
    var visibleCount = 0;
    cards.forEach(function(card, idx){
        var cat = card.getAttribute('data-category');
        var shouldShow = (category === 'all' || cat === category);
        
        if (shouldShow) {
            card.classList.remove('hidden', 'fade-out');
            card.style.display = '';
            // إعادة تشغيل الأنيميشن
            card.classList.remove('fade-in');
            void card.offsetWidth; // force reflow
            card.classList.add('fade-in');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.add('hidden');
        }
    });
    
    // إضافة رسالة فارغة إذا لم توجد منتجات
    var grid = document.getElementById('productsGrid');
    var emptyMsg = document.getElementById('productsEmptyMsg');
    if (visibleCount === 0) {
        if (!emptyMsg) {
            emptyMsg = document.createElement('div');
            emptyMsg.id = 'productsEmptyMsg';
            emptyMsg.style.cssText = 'grid-column:1/-1;text-align:center;padding:50px 20px;opacity:0.6;';
            emptyMsg.innerHTML = '<i class="fas fa-box-open" style="font-size:50px;color:var(--tab-active-color);opacity:0.4;display:block;margin-bottom:15px;"></i><p>' + t('no_products') + '</p>';
            grid.appendChild(emptyMsg);
        } else {
            emptyMsg.style.display = 'block';
        }
    } else if (emptyMsg) {
        emptyMsg.style.display = 'none';
    }
    
    // تحديث الفئة النشطة
    document.querySelectorAll('#categoriesBar .cat-btn').forEach(function(btn){
        btn.classList.toggle('active', btn.getAttribute('data-cat') === category);
    });
}

function openProduct(id) {
    document.getElementById('productModal').classList.add('show');
    var card = document.querySelector('.product-card[onclick*="openProduct(\'' + id + '\')"]');
    if (card) {
        var name = card.querySelector('.prod-name').textContent;
        var cat = card.querySelector('.prod-cat').textContent;
        var price = card.querySelector('.prod-price').textContent;
        var oldPrice = card.querySelector('.prod-old') ? card.querySelector('.prod-old').textContent : '';
        var img = card.querySelector('.prod-img-wrap img').src;
        
        document.getElementById('pmName').textContent = name;
        document.getElementById('pmCat').textContent = cat;
        document.getElementById('pmDesc').textContent = 'منتج مميز بأفضل سعر وجودة عالية';
        document.getElementById('pmImage').src = img;
        document.getElementById('pmPrice').textContent = price;
        document.getElementById('pmOldPrice').textContent = oldPrice;
    }
}
function closeProductModal() { document.getElementById('productModal').classList.remove('show'); }
function buyProduct() { alert('تم إضافة المنتج إلى السلة'); }

/* ==================== AUTH SCREENS ==================== */
function hideAllAuthScreens() {
    ['authChoiceScreen','loginForm','createAccountForm','profileView','profileEditForm','pendingVerificationScreen'].forEach(function(id){
        var el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    var sec = document.getElementById('myPostsSection');
    if (sec) sec.style.display = 'none';
}
function showAuthChoice() {
    hideAllAuthScreens();
    document.getElementById('authChoiceScreen').style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function showLoginForm() {
    hideAllAuthScreens();
    document.getElementById('loginForm').style.display = 'block';
}
function showCreateAccountForm() {
    hideAllAuthScreens();
    document.getElementById('createAccountForm').style.display = 'block';
    document.getElementById('createStep1').style.display = 'block';
    document.getElementById('verifyMessageBox').style.display = 'none';
}

/* ==================== CREATE ACCOUNT ==================== */
async function createAccountAndSendVerification() {
    var name = document.getElementById('regName').value.trim();
    var username = document.getElementById('regUsername').value.trim().replace(/^@/, '');
    var email = document.getElementById('regEmail').value.trim();
    var password = document.getElementById('regPassword').value;
    if (!name || !username || !email || !password) { alert('يرجى ملء جميع الحقول'); return; }
    if (password.length < 6) { alert('كلمة المرور 6 أحرف على الأقل'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('البريد غير صالح'); return; }

    var btn = document.getElementById('registerBtn');
    var originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ...';

    try {
        var userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        var user = userCredential.user;
        await user.sendEmailVerification();

        var fb = await getFB();
        var key = profileKeyFrom(email);
        await fb.setDoc(fb.doc(fb.db, 'profiles', key), {
            name: name, username: username, email: email,
            bio: '', website: '', avatar: null, cover: null,
            emailVerified: false, privacy: 'public',
            followers: [], following: [], pinnedChats: [],
            joined: new Date().toISOString(),
            updatedAt: fb.serverTimestamp()
        }, { merge: true });

        currentUserKey = key;
        currentJoinedDate = new Date().toISOString();
        localStorage.setItem('app_last_profile_key', key);
        pendingVerificationEmail = email;

        document.getElementById('verifySentEmail').textContent = email;
        document.getElementById('createStep1').style.display = 'none';
        document.getElementById('verifyMessageBox').style.display = 'block';

        document.getElementById('regName').value = '';
        document.getElementById('regUsername').value = '';
        document.getElementById('regEmail').value = '';
        document.getElementById('regPassword').value = '';

        setTimeout(function () { showPendingVerificationScreen(); }, 2000);
    } catch (err) {
        console.error(err);
        var msg = err.message;
        if (err.code === 'auth/email-already-in-use') msg = 'هذا البريد مستخدم بالفعل. جرّب تسجيل الدخول.';
        else if (err.code === 'auth/invalid-email') msg = 'البريد الإلكتروني غير صالح.';
        else if (err.code === 'auth/weak-password') msg = 'كلمة المرور ضعيفة جداً.';
        alert('خطأ: ' + msg);
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

function showPendingVerificationScreen() {
    hideAllAuthScreens();
    document.getElementById('pendingVerificationScreen').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function resendVerificationEmail() {
    var user = firebase.auth().currentUser;
    if (!user) { alert('يرجى تسجيل الدخول أولاً.'); showLoginForm(); return; }
    try {
        await user.sendEmailVerification();
        alert('تم إعادة إرسال رابط التفعيل إلى بريدك.');
    } catch (err) { alert('تعذر الإرسال: ' + err.message); }
}

async function checkVerificationStatus() {
    var user = firebase.auth().currentUser;
    if (!user) { alert('يرجى تسجيل الدخول أولاً.'); showLoginForm(); return; }
    try {
        await user.reload();
        if (user.emailVerified) {
            var fb = await getFB();
            var key = profileKeyFrom(user.email);
            await fb.setDoc(fb.doc(fb.db, 'profiles', key), {
                emailVerified: true, updatedAt: fb.serverTimestamp()
            }, { merge: true });
            currentUserKey = key;
            alert('تم تفعيل حسابك بنجاح!');
            await loadProfileAndShow();
        } else {
            alert('لم يتم تفعيل البريد بعد. افتح الرابط ثم حاول مرة أخرى.');
        }
    } catch (err) { alert('خطأ: ' + err.message); }
}

async function loadProfileAndShow() {
    var user = firebase.auth().currentUser;
    if (!user) { showAuthChoice(); return; }
    var key = profileKeyFrom(user.email);
    currentUserKey = key;
    localStorage.setItem('app_last_profile_key', key);
    try {
        var fb = await getFB();
        var snap = await fb.getDoc(fb.doc(fb.db, 'profiles', key));
        if (snap.exists()) applyProfileToUI(snap.data());
        else {
            await fb.setDoc(fb.doc(fb.db, 'profiles', key), {
                name: (user.email || '').split('@')[0],
                username: (user.email || '').split('@')[0],
                email: user.email, emailVerified: user.emailVerified,
                followers: [], following: [], pinnedChats: [],
                joined: new Date().toISOString(), privacy: 'public'
            }, { merge: true });
            var snap2 = await fb.getDoc(fb.doc(fb.db, 'profiles', key));
            if (snap2.exists()) applyProfileToUI(snap2.data());
        }
    } catch (e) { console.warn(e); }
    showProfileView();
}

/* ==================== LOGIN / LOGOUT ==================== */
async function loginWithEmail() {
    var email = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value;
    if (!email || !password) { alert('أدخل البريد وكلمة المرور'); return; }
    try {
        var userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        var user = userCredential.user;
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        if (!user.emailVerified) {
            pendingVerificationEmail = user.email;
            showPendingVerificationScreen();
            return;
        }
        alert('تم تسجيل الدخول!');
        await loadProfileAndShow();
    } catch (err) {
        var msg = err.message;
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
            msg = 'البريد أو كلمة المرور غير صحيحة.';
        }
        alert('خطأ: ' + msg);
    }
}

function logoutUser() {
    firebase.auth().signOut().then(function () {
        alert('تم تسجيل الخروج.');
        currentUserKey = null;
        pendingVerificationEmail = null;
        currentBadgeType = 'none';
        viewedPosts = {};
        currentChatPartner = null;
        if (appealsUnsubscribe) { try { appealsUnsubscribe(); } catch(e){} appealsUnsubscribe = null; }
        if (chatUnsubscribe) { try { chatUnsubscribe(); } catch(e){} chatUnsubscribe = null; }
        localStorage.removeItem('app_last_profile_key');
        localStorage.removeItem('app_avatar_url');
        var acc = document.getElementById('account-icon');
        if (acc) {
            acc.src = acc.getAttribute('data-light') || DEFAULT_AVATAR;
            acc.style.borderRadius = '';
            acc.style.objectFit = '';
            acc.style.border = '';
        }
        document.getElementById('pfName').value = '';
        document.getElementById('pfUsername').value = '';
        document.getElementById('pfBio').value = '';
        document.getElementById('pfWebsite').value = '';
        document.getElementById('pfEmail').value = '';
        currentAvatar = null; currentCover = null;
        setAvatar(null); setVerified('none');
        var wrow = document.getElementById('pvWebsiteRow');
        if (wrow) wrow.style.display = 'none';
        var banner = document.getElementById('suspendedBanner');
        if (banner) banner.remove();
        var adminMenu = document.getElementById('adminPanelMenuItem');
        if (adminMenu) adminMenu.style.display = 'none';
        var bellCount = document.getElementById('bellCount');
        if (bellCount) bellCount.style.display = 'none';
        var footerDot = document.getElementById('footerDot');
        if (footerDot) footerDot.style.display = 'none';
        var chatDot = document.getElementById('chatDot');
        if (chatDot) chatDot.style.display = 'none';
        document.body.classList.remove('chat-mode');
        showAuthChoice();
    }).catch(function (error) { alert('خطأ: ' + error.message); });
}

function resetPassword() {
    var email = document.getElementById('loginEmail').value.trim();
    if (!email) { alert('أدخل بريدك أولاً'); return; }
    firebase.auth().sendPasswordResetEmail(email)
        .then(function () { alert('تم إرسال رابط إعادة تعيين كلمة المرور.'); })
        .catch(function (error) { alert(error.message); });
}

/* ==================== AUTH STATE ==================== */
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUserKey = profileKeyFrom(user.email);
        localStorage.setItem('app_last_profile_key', currentUserKey);
        document.getElementById('loginEmail').value = user.email || '';
        document.getElementById('pfEmail').value = user.email || '';

        (async function () {
            try {
                var fb = await getFB();
                var snap = await fb.getDoc(fb.doc(fb.db, 'profiles', currentUserKey));
                var adminMenu = document.getElementById('adminPanelMenuItem');
                if (snap.exists()) {
                    var d = snap.data();
                    var bt = d.badgeType || (d.owner ? 'owner' : (d.blackBadge ? 'black' : (d.verified ? 'normal' : 'none')));
                    currentBadgeType = bt;
                    if (isAdminType(bt) && adminMenu) adminMenu.style.display = 'flex';
                    else if (adminMenu) adminMenu.style.display = 'none';
                    if (bt === 'black') setupAppealsListener();
                    if (d.avatar) {
                        localStorage.setItem('app_avatar_url', d.avatar);
                        setTimeout(applyAccountAvatarIcon, 500);
                    }
                }
                setTimeout(refreshBellCount, 1000);
                setTimeout(checkUnreadMessages, 1500);
                loadGlobalChatBg();
            } catch (e) {}
        })();

        if (currentPage === 'accountPage') {
            if (user.emailVerified) loadProfileAndShow();
            else { pendingVerificationEmail = user.email; showPendingVerificationScreen(); }
        }
    } else {
        currentUserKey = null;
        currentBadgeType = 'none';
        var adminMenu = document.getElementById('adminPanelMenuItem');
        if (adminMenu) adminMenu.style.display = 'none';
    }
});

/* ==================== PROFILE VIEW ==================== */
function showEditProfile() {
    hideAllAuthScreens();
    document.getElementById('profileEditForm').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function showProfileView() {
    hideAllAuthScreens();
    document.getElementById('profileView').style.display = 'block';
    renderProfileView();
    if (currentUserKey) loadMyPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function changeAvatar() { showEditProfile(); }
function changeCover() {
    var input = document.getElementById('coverInput');
    if (input) input.click();
}
function setAvatar(url) {
    currentAvatar = url;
    setTimeout(function(){
        var pv = document.getElementById('pvAvatar');
        if (pv) pv.src = url || DEFAULT_AVATAR;
        var ed = document.getElementById('profileAvatarImg');
        if (ed) ed.src = url || DEFAULT_AVATAR;
        var acc = document.getElementById('account-icon');
        if (acc) {
            if (url) {
                acc.src = url;
                acc.style.borderRadius = '50%';
                acc.style.objectFit = 'cover';
                acc.style.border = '2px solid var(--avatar-border-color)';
                localStorage.setItem('app_avatar_url', url);
            } else {
                localStorage.removeItem('app_avatar_url');
                var theme = document.documentElement.getAttribute('data-theme') || 'light';
                acc.src = acc.getAttribute('data-' + theme) || acc.getAttribute('data-light') || DEFAULT_AVATAR;
                acc.style.borderRadius = '';
                acc.style.objectFit = '';
                acc.style.border = '';
            }
        }
    }, 300);
}
function setVerified(type) {
    currentBadgeType = type || 'none';
    var pvIcon = document.getElementById('pvBadgeIcon');
    if (pvIcon) {
        if (type === 'none') { pvIcon.style.display = 'none'; pvIcon.removeAttribute('src'); }
        else { pvIcon.src = badgeSrc(type); pvIcon.style.display = 'inline-block'; }
    }
}
function applyProfileToUI(data) {
    if (!data) return;
    document.getElementById('pfName').value = data.name || '';
    document.getElementById('pfUsername').value = data.username || '';
    document.getElementById('pfBio').value = data.bio || '';
    document.getElementById('pfWebsite').value = data.website || '';
    document.getElementById('pfEmail').value = data.email || '';
    document.getElementById('pfPrivacy').value = data.privacy || 'public';
    currentProfilePrivacy = data.privacy || 'public';

    var bt = 'none';
    if (data.badgeType === 'owner' || data.owner === true) bt = 'owner';
    else if (data.badgeType === 'black' || data.blackBadge === true) bt = 'black';
    else if (data.badgeType === 'normal' || data.verified === true) bt = 'normal';
    setVerified(bt);

    var adminMenu = document.getElementById('adminPanelMenuItem');
    if (adminMenu) adminMenu.style.display = isAdminType(bt) ? 'flex' : 'none';

    setAvatar(data.avatar || null);
    if (data.cover) {
        currentCover = data.cover;
        var ci = document.getElementById('pvCoverImg');
        if (ci) { ci.src = data.cover; ci.style.display = 'block'; }
    } else {
        currentCover = null;
        var ci2 = document.getElementById('pvCoverImg');
        if (ci2) ci2.style.display = 'none';
    }
    currentJoinedDate = data.joined || null;

    if (data.suspended) {
        var banner = document.getElementById('suspendedBanner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'suspendedBanner';
            banner.innerHTML = 'حسابك معلّق. السبب: ' + (data.suspendReason || 'مخالفة الشروط') +
                ' <button onclick="submitAppeal()">تقديم طلب مراجعة</button>';
            document.body.appendChild(banner);
        }
    } else {
        var b = document.getElementById('suspendedBanner');
        if (b) b.remove();
    }

    renderProfileView();
    if (bt === 'black') setupAppealsListener();
    else if (appealsUnsubscribe) {
        try { appealsUnsubscribe(); } catch(e){}
        appealsUnsubscribe = null;
    }
    setTimeout(refreshBellCount, 500);
    setTimeout(checkUnreadMessages, 1000);

    var pcb = document.getElementById('postCreateBtn');
    if (pcb && currentPage === 'morePage') pcb.style.display = 'flex';
}
function renderProfileView() {
    if (!document.getElementById('pfName')) return;
    var name = document.getElementById('pfName').value || 'مستخدم';
    var username = document.getElementById('pfUsername').value || 'user';
    var bio = document.getElementById('pfBio').value || '';
    var email = document.getElementById('pfEmail').value || '';
    var website = document.getElementById('pfWebsite').value || '';
    document.getElementById('pvName').textContent = name;
    document.getElementById('pvUsername').textContent = '@' + username;
    document.getElementById('pvBio').textContent = bio;
    document.getElementById('pvEmail').textContent = email;
    if (currentJoinedDate) {
        try { document.getElementById('pvJoined').textContent = new Date(currentJoinedDate).toLocaleDateString(localStorage.getItem('lang') === 'en' ? 'en-US' : 'ar-EG'); }
        catch (e) { document.getElementById('pvJoined').textContent = currentJoinedDate; }
    }
    if (website) {
        document.getElementById('pvWebsite').textContent = website;
        document.getElementById('pvWebsite').href = website;
        document.getElementById('pvWebsiteRow').style.display = 'block';
    } else {
        document.getElementById('pvWebsiteRow').style.display = 'none';
    }
    (async function(){
        if (!currentUserKey) return;
        try {
            var fb = await getFB();
            var snap = await fb.getDoc(fb.doc(fb.db, 'profiles', currentUserKey));
            if (snap.exists()) {
                var d = snap.data();
                var followers = Array.isArray(d.followers) ? d.followers : [];
                var following = Array.isArray(d.following) ? d.following : [];
                var fc = document.getElementById('pvFollowersCount');
                var gc = document.getElementById('pvFollowingCount');
                if (fc) fc.textContent = followers.length;
                if (gc) gc.textContent = following.length;
            }
        } catch(e){}
    })();
}

/* ==================== SAVE PROFILE ==================== */
async function saveProfile() {
    if (!currentUserKey) { alert(t('login_first')); return; }
    try {
        var fb = await getFB();
        await fb.setDoc(fb.doc(fb.db, 'profiles', currentUserKey), {
            name: document.getElementById('pfName').value.trim(),
            username: document.getElementById('pfUsername').value.trim(),
            bio: document.getElementById('pfBio').value.trim(),
            website: document.getElementById('pfWebsite').value.trim(),
            email: document.getElementById('pfEmail').value.trim(),
            privacy: document.getElementById('pfPrivacy').value,
            updatedAt: fb.serverTimestamp()
        }, { merge: true });
        alert('تم حفظ البيانات');
        renderProfileView();
        showProfileView();
    } catch (e) { alert(e.message); }
}

/* ==================== IMAGE UPLOAD ==================== */
async function uploadImageToImgBB(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = async function () {
            try {
                var base64 = reader.result.split(',')[1];
                var formData = new FormData();
                formData.append('key', IMGBB_API_KEY);
                formData.append('image', base64);
                var response = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: formData });
                var data = await response.json();
                if (data && data.success) resolve(data.data.display_url);
                else reject(new Error('فشل رفع الصورة'));
            } catch (e) { reject(e); }
        };
        reader.onerror = function () { reject(new Error('تعذر قراءة الملف')); };
        reader.readAsDataURL(file);
    });
}
async function handleAvatarUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    if (!currentUserKey) { alert(t('login_first')); return; }
    if (!file.type.startsWith('image/')) { alert('يجب اختيار صورة'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('حجم الصورة أكبر من 5 ميجا'); return; }
    try {
        var previewUrl = URL.createObjectURL(file);
        document.getElementById('profileAvatarImg').src = previewUrl;
        document.getElementById('pvAvatar').src = previewUrl;
        var url = await uploadImageToImgBB(file);
        currentAvatar = url;
        setAvatar(url);
        var fb = await getFB();
        await fb.setDoc(fb.doc(fb.db, 'profiles', currentUserKey), {
            avatar: url, updatedAt: fb.serverTimestamp()
        }, { merge: true });
        alert('تم تحديث الصورة الشخصية');
    } catch (e) { alert('فشل رفع الصورة: ' + e.message); }
}
async function handleCoverUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    if (!currentUserKey) { alert(t('login_first')); return; }
    if (!file.type.startsWith('image/')) { alert('يجب اختيار صورة'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('حجم الصورة أكبر من 5 ميجا'); return; }
    try {
        var previewUrl = URL.createObjectURL(file);
        var ci = document.getElementById('pvCoverImg');
        if (ci) { ci.src = previewUrl; ci.style.display = 'block'; }
        var url = await uploadImageToImgBB(file);
        currentCover = url;
        var fb = await getFB();
        await fb.setDoc(fb.doc(fb.db, 'profiles', currentUserKey), {
            cover: url, updatedAt: fb.serverTimestamp()
        }, { merge: true });
        alert('تم تحديث صورة الغلاف');
    } catch (e) { alert('فشل رفع الغلاف: ' + e.message); }
}

/* ==================== POSTS ==================== */
async function loadMyPosts() {
    if (!currentUserKey) return;
    var grid = document.getElementById('myPostsGrid');
    var empty = document.getElementById('myPostsEmpty');
    var sec = document.getElementById('myPostsSection');
    if (!grid || !sec) return;
    sec.style.display = 'block';
    try {
        var fb = await getFB();
        var q = fb.query(fb.collection(fb.db, 'posts'), fb.where('author', '==', currentUserKey));
        var snap = await fb.getDocs(q);
        grid.innerHTML = '';
        if (snap.empty) { if (empty) empty.style.display = 'block'; return; }
        if (empty) empty.style.display = 'none';
        var posts = [];
        snap.forEach(function (ds) { posts.push({ id: ds.id, data: ds.data() }); });
        posts.sort(function (a, b) { return new Date(b.data.createdAt || 0) - new Date(a.data.createdAt || 0); });
        posts.forEach(function (p) {
            var thumb = document.createElement('div');
            thumb.className = 'my-post-thumb';
            var urls = Array.isArray(p.data.mediaUrls) ? p.data.mediaUrls : [p.data.mediaUrl];
            var firstUrl = urls[0];
            var countBadge = urls.length > 1
                ? '<div style="position:absolute;top:5px;left:5px;background:rgba(0,0,0,0.7);color:#fff;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:bold;"><i class="fas fa-images"></i> ' + urls.length + '</div>'
                : '';
            thumb.innerHTML = '<img src="' + firstUrl + '" alt="">' + countBadge;
            thumb.onclick = function () { openImageViewer(urls, 0); };
            grid.appendChild(thumb);
        });
    } catch (e) { console.warn(e); }
}

async function loadUserPosts(userKey) {
    var section = document.getElementById('pubPostsSection');
    var grid = document.getElementById('pubPostsGrid');
    if (!section || !grid) return;
    try {
        var fb = await getFB();
        var q = fb.query(fb.collection(fb.db, 'posts'), fb.where('author', '==', userKey));
        var snap = await fb.getDocs(q);
        grid.innerHTML = '';
        if (snap.empty) { section.style.display = 'none'; return; }
        var posts = [];
        snap.forEach(function(ds){ posts.push({ id: ds.id, data: ds.data() }); });
        posts = posts.filter(function(p){ return p.data.privacy !== 'private' || p.data.author === currentUserKey; });
        if (posts.length === 0) { section.style.display = 'none'; return; }
        section.style.display = 'block';
        posts.sort(function(a,b){ return new Date(b.data.createdAt||0) - new Date(a.data.createdAt||0); });
        posts.forEach(function(p){
            var urls = Array.isArray(p.data.mediaUrls) ? p.data.mediaUrls : [p.data.mediaUrl];
            var thumb = document.createElement('div');
            thumb.className = 'my-post-thumb';
            var countBadge = urls.length > 1
                ? '<div style="position:absolute;top:5px;left:5px;background:rgba(0,0,0,0.7);color:#fff;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:bold;"><i class="fas fa-images"></i> ' + urls.length + '</div>'
                : '';
            thumb.innerHTML = '<img src="' + urls[0] + '" alt="">' + countBadge;
            thumb.onclick = function(){ openImageViewer(urls, 0); };
            grid.appendChild(thumb);
        });
    } catch (e) {}
}

async function loadPublicPosts() {
    var container = document.getElementById('publicPostsContainer');
    if (!container) return;
    var lang = localStorage.getItem('lang') || 'ar';
    container.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><p>' + t('loading_posts') + '</p></div>';
    try {
        var fb = await getFB();
        var snap = await fb.getDocs(fb.collection(fb.db, 'posts'));
        container.innerHTML = '';
        if (snap.empty) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-images"></i><p>' + t('no_posts') + '</p></div>';
            return;
        }
        var posts = [];
        snap.forEach(function (ds) {
            var d = ds.data();
            if (d.privacy !== 'private') posts.push({ id: ds.id, data: d });
        });
        posts.sort(function (a, b) { return new Date(b.data.createdAt || 0) - new Date(a.data.createdAt || 0); });
        if (posts.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-images"></i><p>' + t('no_posts') + '</p></div>';
            return;
        }

        var authorsCache = {};
        for (var i = 0; i < posts.length; i++) {
            var p = posts[i];
            var authorKey = p.data.author;
            if (authorKey && !authorsCache[authorKey]) {
                try {
                    var aSnap = await fb.getDoc(fb.doc(fb.db, 'profiles', authorKey));
                    if (aSnap.exists()) authorsCache[authorKey] = aSnap.data();
                } catch (e) {}
            }
            var author = authorsCache[authorKey] || { name: 'مستخدم', username: 'user', avatar: null, badgeType: null };
            var authorBt = author.badgeType || (author.owner ? 'owner' : (author.blackBadge ? 'black' : (author.verified ? 'normal' : 'none')));
            var card = document.createElement('div');
            card.className = 'post-card';

            var badgeHtml = '';
            if (authorBt && authorBt !== 'none') {
                badgeHtml = '<img class="post-header-badge" src="' + badgeSrc(authorBt) + '">';
            }

            var mediaUrls = Array.isArray(p.data.mediaUrls) ? p.data.mediaUrls : [p.data.mediaUrl];
            var mediaHtml = '';
            if (author.imagesBlocked === true && authorKey !== currentUserKey && currentBadgeType !== 'black') {
                mediaHtml = '<div style="padding:30px;text-align:center;background:var(--content-bg);opacity:0.6;"><i class="fas fa-ban" style="font-size:30px;margin-bottom:8px;"></i><p>الصور محجوبة من قِبل الإدارة</p></div>';
            } else if (mediaUrls.length === 1) {
                mediaHtml = '<div class="post-image-wrap" onclick="openImageViewer(' + JSON.stringify(mediaUrls).replace(/"/g,"'") + ',0)"><img src="' + mediaUrls[0] + '" alt=""></div>';
            } else if (mediaUrls.length === 2) {
                mediaHtml = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;">' +
                    mediaUrls.map(function(u,i){ return '<div style="aspect-ratio:1;overflow:hidden;cursor:pointer;" onclick="openImageViewer(' + JSON.stringify(mediaUrls).replace(/"/g,"'") + ',' + i + ')"><img src="' + u + '" style="width:100%;height:100%;object-fit:cover;"></div>'; }).join('') +
                    '</div>';
            } else if (mediaUrls.length === 3) {
                mediaHtml = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;grid-auto-rows:1fr;">' +
                    '<div style="grid-row:span 2;overflow:hidden;cursor:pointer;" onclick="openImageViewer(' + JSON.stringify(mediaUrls).replace(/"/g,"'") + ',0)"><img src="' + mediaUrls[0] + '" style="width:100%;height:100%;object-fit:cover;"></div>' +
                    mediaUrls.slice(1).map(function(u,i){ return '<div style="aspect-ratio:1;overflow:hidden;cursor:pointer;" onclick="openImageViewer(' + JSON.stringify(mediaUrls).replace(/"/g,"'") + ',' + (i+1) + ')"><img src="' + u + '" style="width:100%;height:100%;object-fit:cover;"></div>'; }).join('') +
                    '</div>';
            } else {
                var displayUrls = mediaUrls.slice(0, 4);
                mediaHtml = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;">' +
                    displayUrls.map(function(u,i){
                        var extra = (i === 3 && mediaUrls.length > 4)
                            ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.65);color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:bold;">+' + (mediaUrls.length - 4) + '</div>'
                            : '';
                        return '<div style="aspect-ratio:1;overflow:hidden;cursor:pointer;position:relative;" onclick="openImageViewer(' + JSON.stringify(mediaUrls).replace(/"/g,"'") + ',' + i + ')"><img src="' + u + '" style="width:100%;height:100%;object-fit:cover;">' + extra + '</div>';
                    }).join('') +
                    '</div>';
            }

            var dateStr = p.data.createdAt ? new Date(p.data.createdAt).toLocaleString(lang === 'en' ? 'en-US' : 'ar-EG') : '';
            var likes = Array.isArray(p.data.likes) ? p.data.likes : [];
            var dislikes = Array.isArray(p.data.dislikes) ? p.data.dislikes : [];
            var views = p.data.views || 0;
            var isLiked = currentUserKey && likes.indexOf(currentUserKey) > -1;
            var isDisliked = currentUserKey && dislikes.indexOf(currentUserKey) > -1;

            var actionsHtml =
                '<div class="post-actions">' +
                    '<button class="post-action-btn' + (isLiked ? ' liked' : '') + '" onclick="toggleLike(\'' + p.id + '\', this)">' +
                        '<i class="fas fa-heart"></i><span class="count">' + likes.length + '</span>' +
                    '</button>' +
                    '<button class="post-action-btn' + (isDisliked ? ' disliked' : '') + '" onclick="toggleDislike(\'' + p.id + '\', this)">' +
                        '<i class="fas fa-thumbs-down"></i><span class="count">' + dislikes.length + '</span>' +
                    '</button>' +
                    '<button class="post-action-btn" onclick="openImageViewer(' + JSON.stringify(mediaUrls).replace(/"/g,"'") + ',0)">' +
                        '<i class="fas fa-eye"></i><span class="count" id="views-' + p.id + '">' + views + '</span>' +
                    '</button>' +
                '</div>';

            card.innerHTML =
                '<div class="post-header" onclick="openPublicProfile(\'' + (authorKey || '') + '\')">' +
                '<img class="post-header-avatar" src="' + (author.avatar || DEFAULT_AVATAR) + '" alt="">' +
                '<div class="post-header-info">' +
                '<div class="post-header-name">' + escapeHtml(author.name || 'مستخدم') + ' ' + badgeHtml + '</div>' +
                '<div class="post-header-username">@' + escapeHtml(author.username || 'user') + '</div>' +
                '</div></div>' +
                (p.data.caption ? '<div class="post-caption">' + escapeHtml(p.data.caption) + '</div>' : '') +
                '<div class="post-date"><i class="fas fa-clock"></i> ' + dateStr + '</div>' +
                mediaHtml +
                actionsHtml;

            var canDelete = (currentUserKey === authorKey) || isAdminType(currentBadgeType);
            if (canDelete) {
                var delBtn = document.createElement('button');
                delBtn.className = 'post-delete-btn';
                delBtn.innerHTML = '<i class="fas fa-trash"></i>';
                delBtn.title = t('delete');
                delBtn.onclick = (function(postId){
                    return function (e) { e.stopPropagation(); deletePost(postId); };
                })(p.id);
                card.appendChild(delBtn);
            }

            container.appendChild(card);
            autoIncrementViews(p.id);
        }
    } catch (e) {
        console.error(e);
        container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>خطأ: ' + e.message + '</p></div>';
    }
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
async function deletePost(postId) {
    if (!isAdminType(currentBadgeType) && !currentUserKey) {
        alert(t('login_first')); return;
    }
    if (!confirm(t('confirm_delete'))) return;
    try {
        var fb = await getFB();
        await fb.deleteDoc(fb.doc(fb.db, 'posts', postId));
        toast(t('deleted'));
        loadPublicPosts();
        if (currentUserKey) loadMyPosts();
    } catch (e) { toast(e.message); }
}

/* ==================== AUTO VIEWS COUNTER ==================== */
async function autoIncrementViews(postId) {
    if (viewedPosts[postId]) return;
    viewedPosts[postId] = true;
    try {
        var fb = await getFB();
        var postRef = fb.doc(fb.db, 'posts', postId);
        var snap = await fb.getDoc(postRef);
        if (!snap.exists()) return;
        var d = snap.data();
        var newViews = (d.views || 0) + 1;
        await fb.setDoc(postRef, { views: newViews }, { merge: true });
        var el = document.getElementById('views-' + postId);
        if (el) el.textContent = newViews;
    } catch (e) { console.warn(e); }
}

/* ==================== LIKE / DISLIKE ==================== */
async function toggleLike(postId, btnEl) {
    if (!currentUserKey) { alert(t('login_first')); return; }
    try {
        var fb = await getFB();
        var postRef = fb.doc(fb.db, 'posts', postId);
        var snap = await fb.getDoc(postRef);
        if (!snap.exists()) return;
        var d = snap.data();
        var likes = Array.isArray(d.likes) ? d.likes.slice() : [];
        var dislikes = Array.isArray(d.dislikes) ? d.dislikes.slice() : [];
        var idx = likes.indexOf(currentUserKey);
        if (idx > -1) { likes.splice(idx, 1); btnEl.classList.remove('liked'); }
        else {
            likes.push(currentUserKey);
            btnEl.classList.add('liked');
            var dIdx = dislikes.indexOf(currentUserKey);
            if (dIdx > -1) dislikes.splice(dIdx, 1);
        }
        await fb.setDoc(postRef, { likes: likes, dislikes: dislikes }, { merge: true });
        btnEl.querySelector('.count').textContent = likes.length;
        var disBtn = btnEl.parentElement.querySelectorAll('.post-action-btn')[1];
        if (disBtn) {
            disBtn.querySelector('.count').textContent = dislikes.length;
            if (dislikes.indexOf(currentUserKey) === -1) disBtn.classList.remove('disliked');
        }
    } catch (e) { console.warn(e); }
}
async function toggleDislike(postId, btnEl) {
    if (!currentUserKey) { alert(t('login_first')); return; }
    try {
        var fb = await getFB();
        var postRef = fb.doc(fb.db, 'posts', postId);
        var snap = await fb.getDoc(postRef);
        if (!snap.exists()) return;
        var d = snap.data();
        var likes = Array.isArray(d.likes) ? d.likes.slice() : [];
        var dislikes = Array.isArray(d.dislikes) ? d.dislikes.slice() : [];
        var idx = dislikes.indexOf(currentUserKey);
        if (idx > -1) { dislikes.splice(idx, 1); btnEl.classList.remove('disliked'); }
        else {
            dislikes.push(currentUserKey);
            btnEl.classList.add('disliked');
            var lIdx = likes.indexOf(currentUserKey);
            if (lIdx > -1) likes.splice(lIdx, 1);
        }
        await fb.setDoc(postRef, { likes: likes, dislikes: dislikes }, { merge: true });
        btnEl.querySelector('.count').textContent = dislikes.length;
        var likeBtn = btnEl.parentElement.querySelectorAll('.post-action-btn')[0];
        if (likeBtn) {
            likeBtn.querySelector('.count').textContent = likes.length;
            if (likes.indexOf(currentUserKey) === -1) likeBtn.classList.remove('liked');
        }
    } catch (e) { console.warn(e); }
}

/* ==================== CREATE POST ==================== */
function openCreatePost() {
    if (!currentUserKey) { alert(t('login_first')); return; }
    document.getElementById('createPostModal').style.display = 'flex';
    document.getElementById('postPreview').style.display = 'none';
    document.getElementById('postPreview').innerHTML = '';
    document.getElementById('postCaption').value = '';
    document.getElementById('postImageInput').value = '';
    postImageFiles = [];
    setPostPrivacy('public');
    var btn = document.querySelector('#createPostModal button[onclick*="postImageInput"]');
    if (btn) btn.innerHTML = '<i class="fas fa-image"></i> ' + t('choose_images') + ' (0/5)';
}
function closeCreatePost() {
    document.getElementById('createPostModal').style.display = 'none';
}
function handlePostImageSelect(event) {
    var files = Array.from(event.target.files);
    if (files.length > 5) {
        alert('الحد الأقصى 5 صور');
        files = files.slice(0, 5);
    }
    postImageFiles = files;
    var preview = document.getElementById('postPreview');
    preview.innerHTML = '';
    preview.style.display = files.length > 0 ? 'grid' : 'none';
    files.forEach(function(file){
        var div = document.createElement('div');
        div.style.cssText = 'aspect-ratio:1;background:var(--content-bg);border-radius:8px;overflow:hidden;';
        var img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
        div.appendChild(img);
        preview.appendChild(div);
    });
    var btn = document.querySelector('#createPostModal button[onclick*="postImageInput"]');
    if (btn) btn.innerHTML = '<i class="fas fa-image"></i> ' + t('choose_images') + ' (' + files.length + '/5)';
}
function setPostPrivacy(mode) {
    postPrivacy = mode;
    var pubBtn = document.getElementById('postPrivacyPublic');
    var privBtn = document.getElementById('postPrivacyPrivate');
    if (mode === 'public') { pubBtn.classList.add('active'); privBtn.classList.remove('active'); }
    else { privBtn.classList.add('active'); pubBtn.classList.remove('active'); }
}
async function publishPost() {
    if (!currentUserKey) { alert(t('login_first')); return; }
    if (postImageFiles.length === 0) { alert('اختر صورة واحدة على الأقل'); return; }

    var btn = document.getElementById('publishPostBtn');
    var originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '...';

    try {
        var mediaUrls = [];
        for (var i = 0; i < postImageFiles.length; i++) {
            var url = await uploadImageToImgBB(postImageFiles[i]);
            mediaUrls.push(url);
        }
        var fb = await getFB();
        await fb.addDoc(fb.collection(fb.db, 'posts'), {
            author: currentUserKey,
            mediaUrls: mediaUrls,
            mediaUrl: mediaUrls[0],
            caption: document.getElementById('postCaption').value.trim(),
            privacy: postPrivacy,
            likes: [],
            dislikes: [],
            views: 0,
            createdAt: new Date().toISOString(),
            updatedAt: fb.serverTimestamp()
        });
        alert('تم نشر المنشور بنجاح');
        closeCreatePost();
        loadPublicPosts();
        loadMyPosts();
    } catch (e) {
        alert('خطأ في النشر: ' + e.message);
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

/* ==================== PUBLIC PROFILE ==================== */
async function openPublicProfile(targetKey) {
    if (!targetKey) return;
    currentViewingProfileKey = targetKey;
    switchTab('publicProfilePage');

    try {
        var fb = await getFB();
        var snap = await fb.getDoc(fb.doc(fb.db, 'profiles', targetKey));
        if (!snap.exists()) { alert('المستخدم غير موجود'); return; }
        var d = snap.data();
        currentPublicProfileCache = d;

        var bt = d.badgeType || (d.owner ? 'owner' : (d.blackBadge ? 'black' : (d.verified ? 'normal' : 'none')));

        document.getElementById('pubName').textContent = d.name || 'مستخدم';
        document.getElementById('pubUsername').textContent = '@' + (d.username || 'user');
        document.getElementById('pubBio').textContent = d.bio || '';
        document.getElementById('pubAvatar').src = d.avatar || DEFAULT_AVATAR;
        document.getElementById('pubFollowersCount').textContent = (d.followers || []).length;
        document.getElementById('pubFollowingCount').textContent = (d.following || []).length;

        if (d.cover) {
            document.getElementById('pubCoverImg').src = d.cover;
            document.getElementById('pubCoverImg').style.display = 'block';
        } else {
            document.getElementById('pubCoverImg').style.display = 'none';
        }

        if (d.joined) {
            var lang = localStorage.getItem('lang') || 'ar';
            try { document.getElementById('pubJoined').textContent = new Date(d.joined).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG'); }
            catch(e) { document.getElementById('pubJoined').textContent = d.joined; }
        }

        if (d.website) {
            document.getElementById('pubWebsite').textContent = d.website;
            document.getElementById('pubWebsite').href = d.website;
            document.getElementById('pubWebsiteRow').style.display = 'block';
        } else {
            document.getElementById('pubWebsiteRow').style.display = 'none';
        }

        var badgeEl = document.getElementById('pubBadgeIcon');
        if (bt !== 'none') {
            badgeEl.src = badgeSrc(bt);
            badgeEl.style.display = 'inline-block';
        } else {
            badgeEl.style.display = 'none';
        }

        var actionsRow = document.getElementById('pubActionsRow');
        actionsRow.innerHTML = '';
        if (targetKey !== currentUserKey && currentUserKey) {
            var followBtn = document.createElement('button');
            followBtn.className = 'pv-action-btn follow';
            followBtn.textContent = t('follow');
            followBtn.onclick = function(){ toggleFollow(targetKey, followBtn); };
            actionsRow.appendChild(followBtn);
            updateFollowButtonState(targetKey, followBtn);

            var msgBtn = document.createElement('button');
            msgBtn.className = 'pv-action-btn message';
            msgBtn.innerHTML = '<i class="fas fa-comment"></i> ' + t('message');
            msgBtn.onclick = function() { openChatWith(targetKey); };
            actionsRow.appendChild(msgBtn);
        }

        loadUserPosts(targetKey);
    } catch (e) {
        console.error(e);
        alert('خطأ: ' + e.message);
    }
}
function goBackFromPublicProfile() {
    switchTab('morePage');
}

/* ==================== FOLLOW SYSTEM ==================== */
async function toggleFollow(targetKey, btnEl) {
    if (!currentUserKey) { alert(t('login_first')); return; }
    if (targetKey === currentUserKey) { alert('لا يمكنك متابعة نفسك'); return; }

    try {
        var fb = await getFB();
        var myRef = fb.doc(fb.db, 'profiles', currentUserKey);
        var targetRef = fb.doc(fb.db, 'profiles', targetKey);

        var mySnap = await fb.getDoc(myRef);
        var targetSnap = await fb.getDoc(targetRef);
        if (!targetSnap.exists()) { alert('المستخدم غير موجود'); return; }

        var myData = mySnap.exists() ? mySnap.data() : {};
        var targetData = targetSnap.data();
        var myFollowing = Array.isArray(myData.following) ? myData.following.slice() : [];
        var targetFollowers = Array.isArray(targetData.followers) ? targetData.followers.slice() : [];

        var isFollowing = myFollowing.indexOf(targetKey) > -1;
        if (isFollowing) {
            myFollowing = myFollowing.filter(function(k){ return k !== targetKey; });
            targetFollowers = targetFollowers.filter(function(k){ return k !== currentUserKey; });
            btnEl.textContent = t('follow');
            btnEl.className = 'pv-action-btn follow';
        } else {
            if (myFollowing.indexOf(targetKey) === -1) myFollowing.push(targetKey);
            if (targetFollowers.indexOf(currentUserKey) === -1) targetFollowers.push(currentUserKey);
            btnEl.textContent = t('unfollow');
            btnEl.className = 'pv-action-btn following';
        }

        await Promise.all([
            fb.setDoc(myRef, { following: myFollowing, updatedAt: fb.serverTimestamp() }, { merge: true }),
            fb.setDoc(targetRef, { followers: targetFollowers, updatedAt: fb.serverTimestamp() }, { merge: true })
        ]);

        var fc = document.getElementById('pubFollowersCount');
        if (fc) fc.textContent = targetFollowers.length;
        if (currentPublicProfileCache) currentPublicProfileCache.followers = targetFollowers;
    } catch (e) {
        console.error(e);
        alert('خطأ: ' + e.message);
    }
}
async function updateFollowButtonState(targetKey, btnEl) {
    if (!currentUserKey) return;
    try {
        var fb = await getFB();
        var snap = await fb.getDoc(fb.doc(fb.db, 'profiles', currentUserKey));
        if (snap.exists()) {
            var myFollowing = snap.data().following || [];
            if (myFollowing.indexOf(targetKey) > -1) {
                btnEl.textContent = t('unfollow');
                btnEl.className = 'pv-action-btn following';
            } else {
                btnEl.textContent = t('follow');
                btnEl.className = 'pv-action-btn follow';
            }
        }
    } catch (e) {}
}

/* ==================== CHAT SYSTEM ==================== */
var CHAT_BG_PRESETS = [
    { id: 'default', color: 'var(--content-bg)', label: 'افتراضي / Default' },
    { id: 'blue', color: '#dbeafe', label: 'أزرق / Blue' },
    { id: 'green', color: '#d1fae5', label: 'أخضر / Green' },
    { id: 'pink', color: '#fce7f3', label: 'وردي / Pink' },
    { id: 'dark', color: '#1e293b', label: 'داكن / Dark' },
    { id: 'pattern1', image: 'https://www.transparenttextures.com/patterns/cubes.png', label: 'نمط 1 / Pattern 1' },
    { id: 'pattern2', image: 'https://www.transparenttextures.com/patterns/diagmonds-light.png', label: 'نمط 2 / Pattern 2' }
];

async function openChatWith(partnerKey) {
    if (!currentUserKey) { alert(t('login_first')); return; }
    if (partnerKey === currentUserKey) { alert('لا يمكنك مراسلة نفسك'); return; }

    currentChatPartner = partnerKey;
    switchTab('chatRoomPage');

    try {
        var fb = await getFB();
        var snap = await fb.getDoc(fb.doc(fb.db, 'profiles', partnerKey));
        if (snap.exists()) {
            var d = snap.data();
            currentChatPartnerName = d.name || 'مستخدم';
            currentChatPartnerBadge = d.badgeType || (d.owner ? 'owner' : (d.blackBadge ? 'black' : (d.verified ? 'normal' : 'none')));
            
            document.getElementById('chatRoomAvatar').src = d.avatar || DEFAULT_AVATAR;
            
            var nameHtml = escapeHtml(currentChatPartnerName);
            if (currentChatPartnerBadge !== 'none') {
                nameHtml += ' <img class="chat-badge" src="' + badgeSrc(currentChatPartnerBadge) + '">';
            }
            document.getElementById('chatRoomName').innerHTML = nameHtml;
            document.getElementById('chatRoomUsername').textContent = '@' + (d.username || 'user');
        }

        var chatId = [currentUserKey, partnerKey].sort().join('__');
        applyChatBackground(currentBgSelection);

        var msgsRef = fb.collection(fb.db, 'chats', chatId, 'messages');

        if (chatUnsubscribe) chatUnsubscribe();
        chatUnsubscribe = fb.onSnapshot(
            fb.query(msgsRef, fb.orderBy('createdAt', 'asc')),
            function(snapshot) {
                var box = document.getElementById('chatMessages');
                box.innerHTML = '';
                if (snapshot.empty) {
                    box.innerHTML = '<div style="text-align:center;opacity:0.5;padding:30px;">' + t('start_chat') + '</div>';
                    return;
                }
                snapshot.forEach(function(ds) {
                    var m = ds.data();
                    var isMe = m.from === currentUserKey;
                    var row = document.createElement('div');
                    row.className = 'chat-msg-row ' + (isMe ? 'me' : 'other');

                    var bubble = document.createElement('div');
                    bubble.className = 'chat-msg ' + (isMe ? 'me' : 'other');
                    var timeStr = '';
                    if (m.createdAt) {
                        try { timeStr = new Date(m.createdAt).toLocaleTimeString(localStorage.getItem('lang') === 'en' ? 'en-US' : 'ar-EG', {hour:'2-digit', minute:'2-digit'}); } catch(e){}
                    }
                    bubble.innerHTML = escapeHtml(m.text || '') + (timeStr ? '<span class="msg-time">' + timeStr + '</span>' : '');

                    if (isMe || isAdminType(currentBadgeType)) {
                        bubble.onclick = (function(mid, chatId2){
                            return function(){
                                if (confirm(t('confirm_delete'))) {
                                    (async function(){
                                        try {
                                            var fb2 = await getFB();
                                            await fb2.deleteDoc(fb2.doc(fb2.db, 'chats', chatId2, 'messages', mid));
                                            toast(t('deleted'));
                                        } catch (e) { toast(e.message); }
                                    })();
                                }
                            };
                        })(ds.id, chatId);
                    }

                    row.appendChild(bubble);
                    box.appendChild(row);
                });
                box.scrollTop = box.scrollHeight;
                markChatAsRead(chatId);
            }
        );
    } catch (e) {
        console.error(e);
        toast('خطأ: ' + e.message);
    }
}

function applyChatBackground(bgId) {
    var box = document.getElementById('chatMessages');
    if (!box) return;
    var preset = CHAT_BG_PRESETS.find(function(p){ return p.id === bgId; }) || CHAT_BG_PRESETS[0];
    if (preset.color) {
        box.style.background = preset.color;
        box.style.backgroundImage = '';
    } else if (preset.image) {
        box.style.background = 'var(--content-bg)';
        box.style.backgroundImage = 'url(' + preset.image + ')';
    }
}

function openChatSettings() {
    switchTab('chatSettingsPage');
    renderChatBgPicker();
    renderPinnedChats();
}

function renderChatBgPicker() {
    var picker = document.getElementById('chatBgPicker');
    if (!picker) return;
    picker.innerHTML = '';
    CHAT_BG_PRESETS.forEach(function(p){
        var btn = document.createElement('button');
        btn.title = p.label;
        btn.className = p.id === currentBgSelection ? 'selected' : '';
        if (p.color) {
            btn.style.background = p.color;
        } else {
            btn.style.background = 'var(--content-bg)';
            btn.style.backgroundImage = 'url(' + p.image + ')';
        }
        btn.onclick = function(){
            currentBgSelection = p.id;
            renderChatBgPicker();
            saveGlobalChatBg(p.id);
            applyChatBackground(p.id);
        };
        picker.appendChild(btn);
    });
}

async function saveGlobalChatBg(bgId) {
    if (!currentUserKey) return;
    try {
        var fb = await getFB();
        await fb.setDoc(fb.doc(fb.db, 'profiles', currentUserKey), { chatBg: bgId }, { merge: true });
        toast(t('saved'));
    } catch (e) { toast(e.message); }
}

async function loadGlobalChatBg() {
    if (!currentUserKey) return;
    try {
        var fb = await getFB();
        var snap = await fb.getDoc(fb.doc(fb.db, 'profiles', currentUserKey));
        if (snap.exists()) currentBgSelection = snap.data().chatBg || 'default';
    } catch (e) {}
}

async function renderPinnedChats() {
    var container = document.getElementById('pinnedChatsList');
    if (!container || !currentUserKey) return;
    try {
        var fb = await getFB();
        var snap = await fb.getDoc(fb.doc(fb.db, 'profiles', currentUserKey));
        var pinned = snap.exists() ? (snap.data().pinnedChats || []) : [];
        if (pinned.length === 0) {
            container.innerHTML = '<p style="opacity:0.6;font-size:13px;">لا يوجد مثبتون بعد</p>';
            return;
        }
        container.innerHTML = '';
        for (var i = 0; i < pinned.length; i++) {
            var partner = pinned[i];
            var ps = await fb.getDoc(fb.doc(fb.db, 'profiles', partner));
            var pd = ps.exists() ? ps.data() : { name: partner, avatar: null };
            var div = document.createElement('div');
            div.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px;margin-bottom:6px;background:var(--card-bg);border-radius:10px;';
            div.innerHTML = 
                '<img src="' + (pd.avatar || DEFAULT_AVATAR) + '" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">' +
                '<div style="flex:1;text-align:right;"><b style="font-size:13px;">' + escapeHtml(pd.name) + '</b></div>' +
                '<button onclick="unpinFromSettings(\'' + partner + '\')" style="background:transparent;border:none;color:#e0245e;cursor:pointer;font-size:16px;"><i class="fas fa-times"></i></button>';
            container.appendChild(div);
        }
    } catch (e) {}
}

async function unpinFromSettings(partnerKey) {
    if (!currentUserKey) return;
    try {
        var fb = await getFB();
        var myRef = fb.doc(fb.db, 'profiles', currentUserKey);
        var snap = await fb.getDoc(myRef);
        var pinned = (snap.data().pinnedChats || []).filter(function(k){ return k !== partnerKey; });
        await fb.setDoc(myRef, { pinnedChats: pinned }, { merge: true });
        toast(t('unpinned'));
        renderPinnedChats();
    } catch (e) { toast(e.message); }
}

async function deleteChatMessage(chatId, msgId) {
    if (!confirm(t('confirm_delete'))) return;
    try {
        var fb = await getFB();
        await fb.deleteDoc(fb.doc(fb.db, 'chats', chatId, 'messages', msgId));
        toast(t('deleted'));
    } catch (e) { toast(e.message); }
}

async function pinChat(partnerKey, btnEl) {
    if (!currentUserKey) return;
    try {
        var fb = await getFB();
        var myRef = fb.doc(fb.db, 'profiles', currentUserKey);
        var snap = await fb.getDoc(myRef);
        var pinned = snap.exists() ? (snap.data().pinnedChats || []) : [];
        var idx = pinned.indexOf(partnerKey);
        if (idx > -1) {
            pinned.splice(idx, 1);
            if (btnEl) btnEl.innerHTML = '<i class="fas fa-thumbtack"></i> ' + t('pin');
            toast(t('unpinned'));
        } else {
            pinned.push(partnerKey);
            if (btnEl) btnEl.innerHTML = '<i class="fas fa-thumbtack"></i> ' + t('unpin');
            toast(t('pinned'));
        }
        await fb.setDoc(myRef, { pinnedChats: pinned }, { merge: true });
    } catch (e) { toast(e.message); }
}

async function deleteChat(chatId, partnerKey) {
    if (!confirm(t('confirm_delete'))) return;
    try {
        var fb = await getFB();
        var chatRef = fb.doc(fb.db, 'chats', chatId);
        var snap = await fb.getDoc(chatRef);
        if (snap.exists()) {
            var d = snap.data();
            var hidden = d.hiddenFor || [];
            if (hidden.indexOf(currentUserKey) === -1) hidden.push(currentUserKey);
            await fb.setDoc(chatRef, { hiddenFor: hidden }, { merge: true });
        }
        var myRef = fb.doc(fb.db, 'profiles', currentUserKey);
        var mySnap = await fb.getDoc(myRef);
        if (mySnap.exists()) {
            var pinned = (mySnap.data().pinnedChats || []).filter(function(k){ return k !== partnerKey; });
            await fb.setDoc(myRef, { pinnedChats: pinned }, { merge: true });
        }
        toast(t('deleted'));
        switchTab('chatPage');
    } catch (e) { toast(e.message); }
}

async function deleteUserFromChat(partnerKey) {
    if (!isAdminType(currentBadgeType)) { toast('غير مصرح'); return; }
    if (!confirm(t('confirm_delete'))) return;
    try {
        var fb = await getFB();
        var chatId = [currentUserKey, partnerKey].sort().join('__');
        var chatRef = fb.doc(fb.db, 'chats', chatId);
        var snap = await fb.getDoc(chatRef);
        if (snap.exists()) {
            var hidden = snap.data().hiddenFor || [];
            if (hidden.indexOf(currentUserKey) === -1) hidden.push(currentUserKey);
            await fb.setDoc(chatRef, { hiddenFor: hidden }, { merge: true });
        }
        toast(t('deleted'));
        switchTab('chatPage');
    } catch (e) { toast(e.message); }
}

async function sendChatMessage() {
    if (!currentUserKey || !currentChatPartner) return;
    var input = document.getElementById('chatInput');
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    try {
        var fb = await getFB();
        var chatId = [currentUserKey, currentChatPartner].sort().join('__');
        await fb.addDoc(
            fb.collection(fb.db, 'chats', chatId, 'messages'),
            {
                from: currentUserKey,
                to: currentChatPartner,
                text: text,
                createdAt: new Date().toISOString(),
                read: false
            }
        );
        await fb.setDoc(fb.doc(fb.db, 'chats', chatId), {
            participants: [currentUserKey, currentChatPartner],
            lastMessage: text,
            lastAt: new Date().toISOString(),
            lastFrom: currentUserKey
        }, { merge: true });
    } catch (e) { toast(e.message); }
}

async function loadChatList() {
    var container = document.getElementById('chatListContainer');
    if (!container || !currentUserKey) {
        if (container) container.innerHTML = '<div class="empty-state"><i class="fas fa-comments"></i><p>' + t('login_first') + '</p></div>';
        return;
    }
    container.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><p>' + t('loading_posts') + '</p></div>';

    try {
        var fb = await getFB();
        var q = fb.query(fb.collection(fb.db, 'chats'), fb.where('participants', 'array-contains', currentUserKey));
        var snap = await fb.getDocs(q);
        container.innerHTML = '';
        if (snap.empty) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-comments"></i><p>' + t('no_chats') + '<br><small>' + t('open_profile_to_message') + '</small></p></div>';
            return;
        }

        var mySnap = await fb.getDoc(fb.doc(fb.db, 'profiles', currentUserKey));
        var pinnedChats = mySnap.exists() ? (mySnap.data().pinnedChats || []) : [];

        var chats = [];
        snap.forEach(function(ds){
            var d = ds.data();
            if (d.hiddenFor && d.hiddenFor.indexOf(currentUserKey) > -1) return;
            chats.push({ id: ds.id, data: d });
        });

        chats.sort(function(a,b){
            var aPinned = (a.data.participants || []).find(function(p){ return p !== currentUserKey && pinnedChats.indexOf(p) > -1; });
            var bPinned = (b.data.participants || []).find(function(p){ return p !== currentUserKey && pinnedChats.indexOf(p) > -1; });
            if (aPinned && !bPinned) return -1;
            if (!aPinned && bPinned) return 1;
            return new Date(b.data.lastAt||0) - new Date(a.data.lastAt||0);
        });

        for (var i = 0; i < chats.length; i++) {
            var c = chats[i];
            var partner = (c.data.participants || []).find(function(p){ return p !== currentUserKey; });
            if (!partner) continue;
            var ps = await fb.getDoc(fb.doc(fb.db, 'profiles', partner));
            var pd = ps.exists() ? ps.data() : { name: 'مستخدم', username: 'user', avatar: null, badgeType: 'none' };
            var pBt = pd.badgeType || (pd.owner ? 'owner' : (pd.blackBadge ? 'black' : (pd.verified ? 'normal' : 'none')));

            var isPinned = pinnedChats.indexOf(partner) > -1;
            var item = document.createElement('div');
            item.className = 'chat-list-item' + (isPinned ? ' pinned' : '');

            var nameHtml = escapeHtml(pd.name || 'مستخدم');
            if (pBt !== 'none') {
                nameHtml += ' <img src="' + badgeSrc(pBt) + '" style="width:14px;height:14px;vertical-align:-2px;">';
            }

            item.innerHTML =
                '<img src="' + (pd.avatar || DEFAULT_AVATAR) + '" class="ci-avatar">' +
                '<div class="ci-info">' +
                    '<div class="ci-name">' + nameHtml + '</div>' +
                    '<div class="ci-last">' + escapeHtml(c.data.lastMessage || '') + '</div>' +
                '</div>' +
                '<button class="chat-pin-btn" title="' + (isPinned ? t('unpin') : t('pin')) + '"><i class="fas fa-thumbtack"></i></button>' +
                '<button class="chat-del-btn" title="' + t('delete') + '"><i class="fas fa-trash"></i></button>';

            item.querySelector('.ci-avatar').onclick = (function(pk){ return function(){ openChatWith(pk); }; })(partner);
            item.querySelector('.ci-info').onclick = (function(pk){ return function(){ openChatWith(pk); }; })(partner);
            item.querySelector('.chat-pin-btn').onclick = (function(pk, btn, itm){ return function(e){
                e.stopPropagation();
                togglePinFromList(pk, btn, itm);
            }; })(partner, item.querySelector('.chat-pin-btn'), item);
            item.querySelector('.chat-del-btn').onclick = (function(cid, pk){ return function(e){
                e.stopPropagation();
                deleteChat(cid, pk);
            }; })(c.id, partner);

            container.appendChild(item);
        }
    } catch (e) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>خطأ: ' + e.message + '</p></div>';
    }
}

async function togglePinFromList(partnerKey, btnEl, itemEl) {
    if (!currentUserKey) return;
    try {
        var fb = await getFB();
        var myRef = fb.doc(fb.db, 'profiles', currentUserKey);
        var snap = await fb.getDoc(myRef);
        var pinned = snap.exists() ? (snap.data().pinnedChats || []) : [];
        var idx = pinned.indexOf(partnerKey);
        if (idx > -1) {
            pinned.splice(idx, 1);
            itemEl.classList.remove('pinned');
            toast(t('unpinned'));
        } else {
            pinned.push(partnerKey);
            itemEl.classList.add('pinned');
            toast(t('pinned'));
        }
        await fb.setDoc(myRef, { pinnedChats: pinned }, { merge: true });
        loadChatList();
    } catch (e) { toast(e.message); }
}

async function markChatAsRead(chatId) {
    try {
        var fb = await getFB();
        var q = fb.query(
            fb.collection(fb.db, 'chats', chatId, 'messages'),
            fb.where('to', '==', currentUserKey)
        );
        var snap = await fb.getDocs(q);
        snap.forEach(function(ds){
            if (!ds.data().read) {
                fb.setDoc(fb.doc(fb.db, 'chats', chatId, 'messages', ds.id), { read: true }, { merge: true });
            }
        });
    } catch (e) {}
}

async function checkUnreadMessages() {
    if (!currentUserKey) return;
    try {
        var fb = await getFB();
        var chatQ = fb.query(fb.collection(fb.db, 'chats'), fb.where('participants', 'array-contains', currentUserKey));
        var chatSnap = await fb.getDocs(chatQ);
        var hasUnread = false;
        var promises = [];
        chatSnap.forEach(function(cds){
            var q = fb.query(
                fb.collection(fb.db, 'chats', cds.id, 'messages'),
                fb.where('to', '==', currentUserKey),
                fb.where('read', '==', false)
            );
            promises.push(fb.getDocs(q).then(function(mSnap){
                if (mSnap.size > 0) hasUnread = true;
            }));
        });
        await Promise.all(promises);
        var dot = document.getElementById('chatDot');
        if (dot) dot.style.display = hasUnread ? 'block' : 'none';
    } catch (e) { console.warn(e); }
}
setInterval(checkUnreadMessages, 30000);

/* ==================== BELL NOTIFICATIONS ==================== */
async function refreshBellCount() {
    if (!currentUserKey) return;
    try {
        var fb = await getFB();
        var q = fb.query(
            fb.collection(fb.db, 'systemMessages'),
            fb.where('to', '==', currentUserKey)
        );
        var snap = await fb.getDocs(q);
        var unread = 0;
        snap.forEach(function(ds){ if (!ds.data().read) unread++; });

        var bellCount = document.getElementById('bellCount');
        var footerDot = document.getElementById('footerDot');
        if (bellCount) {
            bellCount.textContent = unread;
            bellCount.style.display = unread > 0 ? 'flex' : 'none';
        }
        if (footerDot) footerDot.style.display = unread > 0 ? 'block' : 'none';
    } catch (e) { console.warn(e); }
}

function openInbox() {
    var modal = document.getElementById('inboxModal');
    if (modal) modal.style.display = 'flex';
    loadInboxMessages();
    loadAppeals();
}
function closeInbox() {
    var modal = document.getElementById('inboxModal');
    if (modal) modal.style.display = 'none';
}
function switchNotifTab(tab, el) {
    document.querySelectorAll('.notif-tab').forEach(function(t){ t.classList.remove('active'); });
    el.classList.add('active');
    document.querySelectorAll('.notif-panel').forEach(function(p){ p.classList.remove('active'); });
    document.getElementById(tab === 'messages' ? 'messagesPanel' : 'appealsPanel').classList.add('active');
}
async function loadInboxMessages() {
    var list = document.getElementById('inboxList');
    if (!list || !currentUserKey) return;
    list.innerHTML = '<p style="opacity:.6;text-align:center;padding:20px 0;">...</p>';
    try {
        var fb = await getFB();
        var q = fb.query(fb.collection(fb.db, 'systemMessages'), fb.where('to', '==', currentUserKey));
        var snap = await fb.getDocs(q);
        list.innerHTML = '';
        if (snap.empty) { list.innerHTML = '<p style="opacity:.6;text-align:center;padding:20px 0;">' + t('no_messages') + '</p>'; return; }
        var msgs = [];
        snap.forEach(function(ds){ msgs.push({ id: ds.id, data: ds.data() }); });
        msgs.sort(function(a,b){ return new Date(b.data.createdAt||0) - new Date(a.data.createdAt||0); });
        msgs.forEach(function(m){
            var div = document.createElement('div');
            div.className = 'inbox-item' + (m.data.read ? '' : ' unread');
            div.innerHTML = '<b>' + escapeHtml(m.data.title || '') + '</b>' +
                '<div class="inbox-body">' + escapeHtml(m.data.body || '') + '</div>';
            list.appendChild(div);
            if (!m.data.read) {
                fb.setDoc(fb.doc(fb.db, 'systemMessages', m.id), { read: true }, { merge: true });
            }
        });
        setTimeout(refreshBellCount, 500);
    } catch (e) {
        list.innerHTML = '<p style="opacity:.6;text-align:center;padding:20px 0;">' + t('no_messages') + '</p>';
    }
}
async function loadAppeals() {
    var list = document.getElementById('appealsNotifList');
    if (!list) return;
    list.innerHTML = '<p style="opacity:.6;text-align:center;padding:20px 0;">...</p>';
    try {
        var fb = await getFB();
        var snap = await fb.getDocs(fb.collection(fb.db, 'appeals'));
        list.innerHTML = '';
        var appeals = [];
        snap.forEach(function(ds){ appeals.push({ id: ds.id, data: ds.data() }); });
        appeals = appeals.filter(function(a){ return a.data.status === 'pending'; });
        if (appeals.length === 0) { list.innerHTML = '<p style="opacity:.6;text-align:center;padding:20px 0;">' + t('no_appeals') + '</p>'; return; }
        appeals.forEach(function(a){
            var div = document.createElement('div');
            div.className = 'appeal-notif-item';
            div.innerHTML = '<b>' + escapeHtml(a.data.userName || a.data.userKey) + '</b>' + escapeHtml(a.data.reason || '');
            list.appendChild(div);
        });
    } catch (e) {
        list.innerHTML = '<p style="opacity:.6;text-align:center;padding:20px 0;">' + t('no_appeals') + '</p>';
    }
}

/* ==================== ADMIN PANEL ==================== */
function openAdminPanel() {
    if (!isAdminType(currentBadgeType)) { alert('غير مصرح'); return; }
    document.getElementById('adminModal').style.display = 'flex';
}
function closeAdminPanel() {
    document.getElementById('adminModal').style.display = 'none';
}
async function adminFetchUser() {
    if (!isAdminType(currentBadgeType)) return;
    var email = document.getElementById('adminTarget').value.trim().toLowerCase();
    if (!email) { alert('أدخل البريد'); return; }
    adminTargetKey = email;
    try {
        var fb = await getFB();
        var snap = await fb.getDoc(fb.doc(fb.db, 'profiles', email));
        if (!snap.exists()) { alert('المستخدم غير موجود'); return; }
        var d = snap.data();
        document.getElementById('adminEditFields').style.display = 'block';
        document.getElementById('adminEditName').value = d.name || '';
        document.getElementById('adminEditUsername').value = d.username || '';
        document.getElementById('adminEditBio').value = d.bio || '';
        document.getElementById('adminEditAvatar').value = d.avatar || '';
        document.getElementById('adminEditCover').value = d.cover || '';
        var bt = d.badgeType || (d.owner ? 'owner' : (d.blackBadge ? 'black' : (d.verified ? 'normal' : 'none')));
        document.getElementById('adminBadgeType').value = bt;
        alert('تم جلب المستخدم');
    } catch (e) { alert(e.message); }
}
async function adminListAllUsers() {
    if (!isAdminType(currentBadgeType)) return;
    try {
        var fb = await getFB();
        var snap = await fb.getDocs(fb.collection(fb.db, 'profiles'));
        var list = document.getElementById('adminList');
        list.innerHTML = '';
        var users = [];
        snap.forEach(function(ds){ users.push({ id: ds.id, data: ds.data() }); });
        users.forEach(function(u){
            var div = document.createElement('div');
            div.className = 'admin-user-item';
            div.innerHTML = '<div class="au-name">' + escapeHtml(u.data.name || '') + '</div>' +
                '<div class="au-key">' + u.id + '</div>' +
                '<div class="au-meta">' + escapeHtml(u.data.username || '') + '</div>';
            div.onclick = function(){ document.getElementById('adminTarget').value = u.id; adminFetchUser(); };
            list.appendChild(div);
        });
    } catch (e) { alert(e.message); }
}
async function adminSaveUserData() {
    if (!isAdminType(currentBadgeType) || !adminTargetKey) return;
    try {
        var fb = await getFB();
        await fb.setDoc(fb.doc(fb.db, 'profiles', adminTargetKey), {
            name: document.getElementById('adminEditName').value.trim(),
            username: document.getElementById('adminEditUsername').value.trim(),
            bio: document.getElementById('adminEditBio').value.trim(),
            avatar: document.getElementById('adminEditAvatar').value.trim() || null,
            cover: document.getElementById('adminEditCover').value.trim() || null,
            updatedAt: fb.serverTimestamp()
        }, { merge: true });
        alert('تم الحفظ');
    } catch (e) { alert(e.message); }
}
async function adminApplyBadge() {
    if (!isAdminType(currentBadgeType) || !adminTargetKey) return;
    var type = document.getElementById('adminBadgeType').value;
    try {
        var fb = await getFB();
        var update = { badgeType: type, owner: type==='owner', blackBadge: type==='black', verified: type!=='none' && type!=='black' };
        await fb.setDoc(fb.doc(fb.db, 'profiles', adminTargetKey), update, { merge: true });
        alert('تم التحديث');
    } catch (e) { alert(e.message); }
}
async function adminRemoveBadge() {
    if (!isAdminType(currentBadgeType) || !adminTargetKey) return;
    try {
        var fb = await getFB();
        await fb.setDoc(fb.doc(fb.db, 'profiles', adminTargetKey), {
            badgeType: 'none', owner: false, blackBadge: false, verified: false
        }, { merge: true });
        alert('تم إزالة التوثيق');
    } catch (e) { alert(e.message); }
}
async function adminBlockImages() {
    if (!isAdminType(currentBadgeType) || !adminTargetKey) return;
    try {
        var fb = await getFB();
        await fb.setDoc(fb.doc(fb.db, 'profiles', adminTargetKey), {
            imagesBlocked: true, imagesBlockedBy: currentUserKey, imagesBlockedAt: new Date().toISOString()
        }, { merge: true });
        alert('تم حظر الصور');
    } catch (e) { alert(e.message); }
}
async function adminUnblockImages() {
    if (!isAdminType(currentBadgeType) || !adminTargetKey) return;
    try {
        var fb = await getFB();
        await fb.setDoc(fb.doc(fb.db, 'profiles', adminTargetKey), {
            imagesBlocked: false, imagesBlockedBy: null, imagesBlockedAt: null
        }, { merge: true });
        alert('تم فك الحظر');
    } catch (e) { alert(e.message); }
}
async function sendMessageToUser() {
    if (!isAdminType(currentBadgeType) || !adminTargetKey) { alert('اختر مستخدم أولاً'); return; }
    var title = prompt('عنوان الرسالة:');
    if (!title) return;
    var body = prompt('نص الرسالة:');
    if (!body) return;
    try {
        var fb = await getFB();
        await fb.addDoc(fb.collection(fb.db, 'systemMessages'), {
            from: currentUserKey,
            to: adminTargetKey,
            title: title,
            body: body,
            read: false,
            createdAt: new Date().toISOString()
        });
        alert('تم الإرسال');
    } catch (e) { alert(e.message); }
}
async function adminSuspendUser() {
    if (!isAdminType(currentBadgeType) || !adminTargetKey) return;
    var reason = prompt('سبب التعليق:', 'مخالفة الشروط') || 'مخالفة الشروط';
    try {
        var fb = await getFB();
        await fb.setDoc(fb.doc(fb.db, 'profiles', adminTargetKey), {
            suspended: true, suspendReason: reason
        }, { merge: true });
        alert('تم التعليق');
    } catch (e) { alert(e.message); }
}
async function adminUnsuspendUser() {
    if (!isAdminType(currentBadgeType) || !adminTargetKey) return;
    try {
        var fb = await getFB();
        await fb.setDoc(fb.doc(fb.db, 'profiles', adminTargetKey), {
            suspended: false, suspendReason: null
        }, { merge: true });
        alert('تم فك التعليق');
    } catch (e) { alert(e.message); }
}
async function adminDeleteUserAccount() {
    if (!isAdminType(currentBadgeType) || !adminTargetKey) return;
    if (!confirm('حذف الحساب نهائياً؟')) return;
    try {
        var fb = await getFB();
        await fb.deleteDoc(fb.doc(fb.db, 'profiles', adminTargetKey));
        alert('تم الحذف');
    } catch (e) { alert(e.message); }
}

/* ==================== APPEALS ==================== */
function setupAppealsListener() {
    if (appealsUnsubscribe) return;
    (async function(){
        try {
            var fb = await getFB();
            appealsUnsubscribe = fb.onSnapshot(fb.collection(fb.db, 'appeals'), function(snap){
                var count = 0;
                snap.forEach(function(ds){ if (ds.data().status === 'pending') count++; });
                var el = document.getElementById('appealsCount');
                if (el) { el.textContent = count; el.style.display = count > 0 ? 'inline-block' : 'none'; }
            });
        } catch (e) {}
    })();
}
async function submitAppeal() {
    if (!currentUserKey) return;
    var reason = prompt('سبب طلب المراجعة:');
    if (!reason) return;
    try {
        var fb = await getFB();
        await fb.addDoc(fb.collection(fb.db, 'appeals'), {
            userKey: currentUserKey,
            userName: document.getElementById('pfName').value || currentUserKey,
            reason: reason,
            status: 'pending',
            createdAt: new Date().toISOString()
        });
        alert('تم إرسال طلب المراجعة');
    } catch (e) { alert(e.message); }
}

/* ==================== STORIES + LIVE (24H) ==================== */
async function loadStories() {
    try {
        var fb = await getFB();
        var now = Date.now();
        var snap = await fb.getDocs(fb.collection(fb.db, 'stories'));
        var bar = document.getElementById('storiesBar');
        if (!bar) return;
        bar.innerHTML = '';
        storiesList = [];

        var deletePromises = [];
        snap.forEach(function(ds){
            var d = ds.data();
            var createdAt = d.createdAt ? new Date(d.createdAt).getTime() : 0;
            var ageHours = (now - createdAt) / (1000 * 60 * 60);

            if (ageHours >= 24) {
                deletePromises.push(
                    fb.deleteDoc(fb.doc(fb.db, 'stories', ds.id)).catch(function(){})
                );
                return;
            }
            storiesList.push({ id: ds.id, data: d });
        });

        if (deletePromises.length > 0) {
            Promise.all(deletePromises).then(function(){
                console.log('حذف ' + deletePromises.length + ' ستوري منتهي');
            });
        }

        if (storiesList.length === 0) { bar.classList.remove('has-stories'); return; }
        bar.classList.add('has-stories');

        storiesList.forEach(function(s, idx){
            var item = document.createElement('div');
            item.className = 'story-item';
            var isLive = !!s.data.liveUrl;
            var liveStyle = isLive ? 'background:linear-gradient(45deg,#e0245e,#ff6b8a);' : '';
            item.innerHTML =
                '<div class="story-ring" style="' + liveStyle + '">' +
                    '<img class="story-avatar" src="' + (s.data.avatar || DEFAULT_AVATAR) + '">' +
                    (isLive ? '<span class="story-live-badge">LIVE</span>' : '') +
                '</div>';
            item.onclick = function(){ openStoryViewer(idx); };
            bar.appendChild(item);
        });
    } catch (e) { console.error(e); }
}

function openStoryViewer(index) {
    currentStoryIndex = index;
    document.getElementById('storyViewer').style.display = 'flex';
    showStory();
}

function showStory() {
    if (currentStoryIndex < 0 || currentStoryIndex >= storiesList.length) {
        closeStoryViewer();
        return;
    }
    var s = storiesList[currentStoryIndex];
    var data = s.data;
    document.getElementById('storyAuthorName').textContent = '';
    var content = document.getElementById('storyContent');
    content.innerHTML = '';
    content.style.position = 'relative';

    var isLive = !!data.liveUrl;

    if (isLive) {
        var embedUrl = convertToEmbed(data.liveUrl);
        var iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.style.cssText = 'width:100%;height:100%;border:none;border-radius:12px;';
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen; microphone';
        iframe.allowFullscreen = true;
        iframe.setAttribute('referrerpolicy', 'origin');
        content.appendChild(iframe);
        clearTimeout(storyTimer);
        storyTimer = null;
        updateProgressBars();
    } else if (data.imageUrl || data.avatar) {
        var img = document.createElement('img');
        img.src = data.imageUrl || data.avatar;
        img.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;border-radius:12px;';
        content.appendChild(img);

        var pauseIndicator = document.createElement('div');
        pauseIndicator.className = 'story-paused-indicator';
        pauseIndicator.style.display = 'none';
        pauseIndicator.innerHTML = '<i class="fas fa-pause"></i> متوقف';
        content.appendChild(pauseIndicator);

        var storyStartTime = Date.now();
        var remainingTime = 5000;
        var isPaused = false;

        function startTimer(ms) {
            clearTimeout(storyTimer);
            storyTimer = setTimeout(function(){
                if (!isPaused) nextStory();
            }, ms);
        }

        function pauseStory() {
            if (isPaused) return;
            isPaused = true;
            clearTimeout(storyTimer);
            remainingTime = remainingTime - (Date.now() - storyStartTime);
            if (remainingTime < 0) remainingTime = 0;
            pauseIndicator.style.display = 'block';
            var fill = document.querySelector('#storyProgressContainer div > div');
            if (fill) fill.style.animationPlayState = 'paused';
        }

        function resumeStory() {
            if (!isPaused) return;
            isPaused = false;
            storyStartTime = Date.now();
            pauseIndicator.style.display = 'none';
            startTimer(remainingTime);
            var fill = document.querySelector('#storyProgressContainer div > div');
            if (fill) fill.style.animationPlayState = 'running';
        }

        img.addEventListener('mousedown', pauseStory);
        img.addEventListener('mouseup', resumeStory);
        img.addEventListener('mouseleave', resumeStory);
        img.addEventListener('touchstart', function(e){ e.preventDefault(); pauseStory(); }, {passive: false});
        img.addEventListener('touchend', function(e){ e.preventDefault(); resumeStory(); }, {passive: false});
        img.addEventListener('touchcancel', resumeStory);

        updateProgressBars();
        startTimer(remainingTime);
    } else {
        clearTimeout(storyTimer);
        storyTimer = setTimeout(nextStory, 5000);
    }
}

function updateProgressBars() {
    var container = document.getElementById('storyProgressContainer');
    if (!container) return;
    container.innerHTML = '';
    var current = storiesList[currentStoryIndex];
    var isLive = current && current.data && current.data.liveUrl;

    storiesList.forEach(function(s, i){
        var bar = document.createElement('div');
        bar.style.cssText = 'width:30px;height:4px;background:rgba(255,255,255,0.3);border-radius:2px;overflow:hidden;';
        if (i < currentStoryIndex) {
            bar.style.background = '#fff';
        } else if (i === currentStoryIndex) {
            if (isLive) {
                bar.style.background = '#e0245e';
            } else {
                bar.style.background = 'rgba(255,255,255,0.3)';
                var fill = document.createElement('div');
                fill.style.cssText = 'height:100%;background:#fff;width:0;animation:storyFill 5s linear forwards;';
                bar.appendChild(fill);
            }
        }
        container.appendChild(bar);
    });
}

function convertToEmbed(url) {
    if (!url) return '';
    url = url.trim();

    if (url.indexOf('youtube.com') > -1 || url.indexOf('youtu.be') > -1) {
        var id = '';
        if (url.indexOf('youtu.be/') > -1) {
            id = url.split('youtu.be/')[1].split(/[?&]/)[0];
        } else if (url.indexOf('/live/') > -1) {
            id = url.split('/live/')[1].split(/[?&]/)[0];
        } else if (url.indexOf('/shorts/') > -1) {
            id = url.split('/shorts/')[1].split(/[?&]/)[0];
        } else {
            var vMatch = url.match(/[?&]v=([^&]+)/);
            if (vMatch) id = vMatch[1];
        }
        if (id) {
            return 'https://www.youtube.com/embed/' + id + '?autoplay=1&mute=0&rel=0&playsinline=1&enablejsapi=1';
        }
    }

    if (url.indexOf('tiktok.com') > -1) {
        var tid = '';
        if (url.indexOf('/video/') > -1) tid = url.split('/video/')[1].split(/[?&]/)[0];
        if (tid) return 'https://www.tiktok.com/embed/v2/' + tid;
    }

    if (url.indexOf('twitch.tv') > -1) {
        var parent = location.hostname || 'localhost';
        var channel = url.split('twitch.tv/')[1];
        if (channel) {
            channel = channel.split(/[?&/]/)[0];
            return 'https://player.twitch.tv/?channel=' + channel + '&parent=' + parent + '&autoplay=true&muted=false';
        }
    }

    return url;
}

function closeStoryViewer() {
    document.getElementById('storyViewer').style.display = 'none';
    clearTimeout(storyTimer);
}

function nextStory() {
    currentStoryIndex++;
    if (currentStoryIndex >= storiesList.length) {
        closeStoryViewer();
        return;
    }
    showStory();
}
function prevStory() {
    currentStoryIndex--;
    if (currentStoryIndex < 0) currentStoryIndex = 0;
    showStory();
}

function openCreateStory() {
    if (!currentUserKey) { alert(t('login_first')); return; }
    document.getElementById('createStoryModal').style.display = 'flex';
    switchStoryCreateTab('story');
    document.getElementById('storyImageUrl').value = '';
    document.getElementById('storyLiveUrl').value = '';
    document.getElementById('storyImageFile').value = '';
    document.getElementById('storyImagePreview').style.display = 'none';
}

function switchStoryCreateTab(tab) {
    currentStoryCreateTab = tab;
    document.getElementById('storyTabStory').classList.toggle('active', tab === 'story');
    document.getElementById('storyTabLive').classList.toggle('active', tab === 'live');
    document.getElementById('storyCreatePanel').classList.toggle('active', tab === 'story');
    document.getElementById('liveCreatePanel').classList.toggle('active', tab === 'live');
}

document.addEventListener('change', function(e){
    if (e.target && e.target.id === 'storyImageFile') {
        var file = e.target.files[0];
        if (!file) return;
        var preview = document.getElementById('storyImagePreview');
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
    }
});

async function publishStory() {
    if (!currentUserKey) { alert(t('login_first')); return; }

    var btn = document.getElementById('publishStoryBtn');
    var originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ...';

    try {
        var fb = await getFB();
        var mySnap = await fb.getDoc(fb.doc(fb.db, 'profiles', currentUserKey));
        var myData = mySnap.exists() ? mySnap.data() : {};

        var storyData = {
            author: currentUserKey,
            name: myData.name || 'مستخدم',
            avatar: myData.avatar || null,
            createdAt: new Date().toISOString()
        };

        if (currentStoryCreateTab === 'live') {
            var liveUrl = document.getElementById('storyLiveUrl').value.trim();
            if (!liveUrl) { alert('أدخل رابط البث'); btn.disabled = false; btn.innerHTML = originalText; return; }
            storyData.liveUrl = liveUrl;
            storyData.imageUrl = null;
        } else {
            var imageUrl = document.getElementById('storyImageUrl').value.trim();
            var fileInput = document.getElementById('storyImageFile');
            var file = fileInput.files[0];

            if (file) {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> رفع...';
                var uploadedUrl = await uploadImageToImgBB(file);
                storyData.imageUrl = uploadedUrl;
            } else if (imageUrl) {
                storyData.imageUrl = imageUrl;
            } else {
                alert('أدخل رابط صورة أو اختر صورة');
                btn.disabled = false;
                btn.innerHTML = originalText;
                return;
            }
            storyData.liveUrl = null;
        }

        await fb.addDoc(fb.collection(fb.db, 'stories'), storyData);
        alert('تم النشر بنجاح — سيختفي بعد 24 ساعة');
        document.getElementById('createStoryModal').style.display = 'none';
        loadStories();
    } catch (e) {
        alert('خطأ: ' + e.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

/* ==================== STUBS ==================== */
function openFollowersList() { alert('قائمة المتابعين'); }
function openFollowingList() { alert('قائمة المتابعة'); }
function remindLater(m) { document.getElementById('customizeModal').style.display='none'; }
function neverShowAgain() { document.getElementById('customizeModal').style.display='none'; localStorage.setItem('neverSupport', '1'); }
function showExceptionDialog() { return true; }

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', function(){
    applySavedTheme();
    applyTranslations();

    setTimeout(function(){
        var preloader = document.getElementById('smart-preloader');
        if (preloader) preloader.classList.add('done');
    }, 1200);

    var menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.onclick = function(){
            document.getElementById('sidebar').classList.add('active');
            document.getElementById('sidebar-overlay').classList.add('active');
        };
    }
    var overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
        overlay.onclick = function(){
            document.getElementById('sidebar').classList.remove('active');
            overlay.classList.remove('active');
        };
    }

    document.querySelectorAll('.tab').forEach(function(t){
        t.onclick = function(){ switchTab(t.getAttribute('data-target')); };
    });

    var header = document.getElementById('professionalToolsHeader');
    if (header) {
        header.onclick = function(){
            header.classList.toggle('active');
            document.getElementById('professionalToolsContent').classList.toggle('open');
        };
    }

    // Product category filter
    document.querySelectorAll('#categoriesBar .cat-btn').forEach(function(btn){
        btn.onclick = function(){
            var cat = btn.getAttribute('data-cat');
            filterProducts(cat);
        };
    });

    loadStories();
    loadPublicPosts();
});

loadStories();
setInterval(loadStories, 60 * 1000);
</script>
<script>
/* ==================== ✨ نصوص الفوتر + المؤشر النشط + الترجمة ==================== */

// خريطة: صفحة → id الأيقونة
var FOOTER_PAGE_MAP = {
    'homePage':     'home-icon',
    'premiumPage':  'grok-icon',
    'gamesPage':    'games-icon',
    'productsPage': 'store-icon',
    'chatPage':     'chat-icon',
    'accountPage':  'account-icon'
};

// ✅ صحيح: مفاتيح ترجمة تُقرأ من TRANSLATIONS
var FOOTER_LABEL_MAP = {
    'home-icon':    'footer_home',
    'grok-icon':    'footer_premium',
    'games-icon':   'footer_games',
    'store-icon':   'footer_products',
    'chat-icon':    'footer_chat',
    'account-icon': 'footer_account'
};

// ✨ 1. تحديث مؤشر القسم النشط (الخط الأزرق)
function updateFooterActiveIndicator(pageId) {
    Object.keys(FOOTER_PAGE_MAP).forEach(function(p) {
        var el = document.getElementById(FOOTER_PAGE_MAP[p]);
        if (el && el.parentElement) el.parentElement.classList.remove('footer-active');
    });
    var activeId = FOOTER_PAGE_MAP[pageId];
    if (activeId) {
        var activeImg = document.getElementById(activeId);
        if (activeImg && activeImg.parentElement) {
            activeImg.parentElement.classList.add('footer-active');
        }
    }
}

// ✨ 2. تحديث نصوص الفوتر حسب اللغة
function updateFooterLabels() {
    Object.keys(FOOTER_LABEL_MAP).forEach(function(iconId) {
        var img = document.getElementById(iconId);
        if (img && img.parentElement) {
            var label = img.parentElement.querySelector('.footer-label');
            if (label) label.textContent = t(FOOTER_LABEL_MAP[iconId]);
        }
    });
    var btn = document.getElementById('footerLabelsToggle');
    if (btn) {
        var withLabels = localStorage.getItem('footerLabels') === '1';
        btn.title = withLabels ? t('footer_labels_hide') : t('footer_labels_show');
    }
}

// ✨ 3. تطبيق حالة النصوص المحفوظة
function applyFooterLabelsState() {
    var withLabels = localStorage.getItem('footerLabels') === '1';
    document.body.classList.toggle('footer-with-labels', withLabels);
    var btn = document.getElementById('footerLabelsToggle');
    if (btn) {
        var icon = btn.querySelector('i');
        if (icon) icon.className = withLabels ? 'fas fa-eye-slash' : 'fas fa-font';
        btn.title = withLabels ? t('footer_labels_hide') : t('footer_labels_show');
    }
}

// ✨ 4. تبديل النصوص + الحفظ
function toggleFooterLabels() {
    var withLabels = localStorage.getItem('footerLabels') === '1';
    localStorage.setItem('footerLabels', withLabels ? '0' : '1');
    applyFooterLabelsState();
    var foot = document.getElementById('foot');
    if (foot) {
        foot.style.transition = 'transform 0.15s ease';
        foot.style.transform = 'translateY(2px)';
        setTimeout(function() { foot.style.transform = ''; }, 150);
    }
}

// ✨ 5. تغليف switchTab لتحديث المؤشر تلقائياً
(function wrapSwitchTabForIndicator() {
    function doWrap() {
        if (window.__switchTabWrapped) return;
        window.__switchTabWrapped = true;
        var original = window.switchTab;
        window.switchTab = function(pageId) {
            var result = original.apply(this, arguments);
            try { updateFooterActiveIndicator(pageId); } catch (e) {}
            return result;
        };
        try { updateFooterActiveIndicator(currentPage || 'homePage'); } catch (e) {}
    }
    if (typeof window.switchTab === 'function') doWrap();
    else {
        var iv = setInterval(function() {
            if (typeof window.switchTab === 'function') { clearInterval(iv); doWrap(); }
        }, 100);
    }
})();

// ✨ 6. تغليف applyTranslations لتحديث الفوتر تلقائياً
(function wrapApplyTranslationsForFooter() {
    function doWrap() {
        if (window.__applyTranslationsWrapped) return;
        window.__applyTranslationsWrapped = true;
        var original = window.applyTranslations;
        window.applyTranslations = function() {
            var result = original.apply(this, arguments);
            try { updateFooterLabels(); } catch (e) {}
            return result;
        };
    }
    if (typeof window.applyTranslations === 'function') doWrap();
    else {
        var iv = setInterval(function() {
            if (typeof window.applyTranslations === 'function') { clearInterval(iv); doWrap(); }
        }, 100);
    }
})();

// ✨ 7. التهيئة عند التحميل
function initFooterFeatures() {
    applyFooterLabelsState();
    updateFooterLabels();
    updateFooterActiveIndicator(currentPage || 'homePage');
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterFeatures);
} else {
    initFooterFeatures();
}