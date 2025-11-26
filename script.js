// קטגוריות עם שמות בעברית
const categories = {
    'all': 'הכל',
    'kids-clothes': 'בגדי ילדים',
    'photography': 'אביזרי צילום',
    'games': 'משחקים',
    'home': 'לבית',
    'houseware': 'כלי בית',
    'electronics': 'אלקטרוניקה',
    'fashion': 'אופנה',
    'kitchen': 'מטבח',
    'tools': 'כלי עבודה'
};

// טעינת קישורים מ-localStorage
let links = JSON.parse(localStorage.getItem('shoppingLinks')) || [];

// אלמנטים
const linksGrid = document.getElementById('linksGrid');
const addLinkBtn = document.getElementById('addLinkBtn');
const addLinkModal = document.getElementById('addLinkModal');
const closeModal = document.getElementById('closeModal');
const addLinkForm = document.getElementById('addLinkForm');
const tabButtons = document.querySelectorAll('.tab-btn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const quickAddBtn = document.getElementById('quickAddBtn');
const quickAddModal = document.getElementById('quickAddModal');
const closeQuickModal = document.getElementById('closeQuickModal');
const quickAddForm = document.getElementById('quickAddForm');

let currentCategory = 'all';

// אתחול
document.addEventListener('DOMContentLoaded', async () => {
    await loadLinksFromFile();
    renderLinks();
    setupEventListeners();
});

// הגדרת מאזינים לאירועים
function setupEventListeners() {
    addLinkBtn.addEventListener('click', () => {
        addLinkModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        addLinkModal.style.display = 'none';
        addLinkForm.reset();
    });

    window.addEventListener('click', (e) => {
        if (e.target === addLinkModal) {
            addLinkModal.style.display = 'none';
            addLinkForm.reset();
        }
    });

    addLinkForm.addEventListener('submit', handleAddLink);
    quickAddForm.addEventListener('submit', handleQuickAdd);

    quickAddBtn.addEventListener('click', () => {
        quickAddModal.style.display = 'block';
    });

    closeQuickModal.addEventListener('click', () => {
        quickAddModal.style.display = 'none';
        quickAddForm.reset();
    });

    window.addEventListener('click', (e) => {
        if (e.target === quickAddModal) {
            quickAddModal.style.display = 'none';
            quickAddForm.reset();
        }
    });

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderLinks();
        });
    });

    exportBtn.addEventListener('click', exportLinks);
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', handleImportFile);
}

// טיפול בהוספת קישור
function handleAddLink(e) {
    e.preventDefault();

    const newLink = {
        id: Date.now(),
        title: document.getElementById('linkTitle').value,
        url: document.getElementById('linkUrl').value,
        category: document.getElementById('linkCategory').value,
        image: document.getElementById('linkImage').value || getDefaultImage(document.getElementById('linkCategory').value),
        price: document.getElementById('linkPrice').value || '',
        date: new Date().toLocaleDateString('he-IL')
    };

    links.unshift(newLink);
    saveLinks();
    renderLinks();
    addLinkModal.style.display = 'none';
    addLinkForm.reset();
}

// טיפול בהוספה מהירה של מספר קישורים
function handleQuickAdd(e) {
    e.preventDefault();

    const urlsText = document.getElementById('quickUrls').value.trim();
    const category = document.getElementById('quickCategory').value;

    if (!urlsText || !category) {
        alert('אנא מלא קישורים וקטגוריה');
        return;
    }

    // פיצול הקישורים לפי שורות
    const urlLines = urlsText.split('\n').filter(line => line.trim() !== '');
    const newLinks = [];

    urlLines.forEach((url, index) => {
        const cleanUrl = url.trim();
        if (cleanUrl && (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://'))) {
            // ניסיון לחלץ כותרת מה-URL
            let title = cleanUrl;
            try {
                const urlObj = new URL(cleanUrl);
                title = urlObj.hostname.replace('www.', '') + urlObj.pathname;
                // הסרת סלאשים וסימנים מיוחדים
                title = title.replace(/\//g, ' ').replace(/[-_]/g, ' ').trim();
                if (title.length > 50) title = title.substring(0, 50) + '...';
            } catch (e) {
                // אם יש שגיאה, נשתמש ב-URL ככותרת
            }

            newLinks.push({
                id: Date.now() + index,
                title: title || `קישור ${index + 1}`,
                url: cleanUrl,
                category: category,
                image: getDefaultImage(category),
                price: '',
                date: new Date().toLocaleDateString('he-IL')
            });
        }
    });

    if (newLinks.length === 0) {
        alert('לא נמצאו קישורים תקינים. ודא שהקישורים מתחילים ב-http:// או https://');
        return;
    }

    // הוספת הקישורים לתחילת הרשימה
    links.unshift(...newLinks);
    saveLinks();
    renderLinks();
    quickAddModal.style.display = 'none';
    quickAddForm.reset();
    
    alert(`נוספו ${newLinks.length} קישורים בהצלחה!`);
}

// קבלת תמונה ברירת מחדל לפי קטגוריה
function getDefaultImage(category) {
    const defaultImages = {
        'kids-clothes': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
        'photography': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
        'games': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
        'home': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
        'fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
        'kitchen': 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=400',
        'houseware': 'https://images.unsplash.com/photo-1515105911711-23c0f512fdcc?w=400',
        'tools': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400'
    };
    return defaultImages[category] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400';
}

// שמירת קישורים
function saveLinks() {
    localStorage.setItem('shoppingLinks', JSON.stringify(links));
}

// מחיקת קישור
function deleteLink(id) {
    if (confirm('האם אתה בטוח שברצונך למחוק קישור זה?')) {
        links = links.filter(link => link.id !== id);
        saveLinks();
        renderLinks();
    }
}

// הצגת קישורים
function renderLinks() {
    const filteredLinks = currentCategory === 'all' 
        ? links 
        : links.filter(link => link.category === currentCategory);

    if (filteredLinks.length === 0) {
        linksGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <h3>אין קישורים בקטגוריה זו</h3>
                <p>הוסף קישור חדש כדי להתחיל</p>
            </div>
        `;
        return;
    }

    linksGrid.innerHTML = filteredLinks.map(link => `
        <div class="link-card">
            <img src="${link.image}" alt="${link.title}" class="link-card-image" 
                 onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
            <div class="link-card-content">
                <h3 class="link-card-title">${link.title}</h3>
                <span class="link-card-category">${categories[link.category] || link.category}</span>
                ${link.price ? `<div class="link-card-price">${link.price}</div>` : ''}
            </div>
            <div class="link-card-footer">
                <a href="${link.url}" target="_blank" class="btn-visit">לקנייה →</a>
                <button class="btn-delete" onclick="deleteLink(${link.id})">מחק</button>
            </div>
        </div>
    `).join('');
}

// הוספת כמה קישורים לדוגמה בהתחלה
if (links.length === 0) {
    links = [
        {
            id: 1,
            title: 'חולצת טריקו לילדים - 3 יחידות',
            url: 'https://example.com/kids-shirt',
            category: 'kids-clothes',
            image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
            price: '₪89.90',
            date: new Date().toLocaleDateString('he-IL')
        },
        {
            id: 2,
            title: 'עדשת מצלמה 50mm',
            url: 'https://example.com/camera-lens',
            category: 'photography',
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
            price: '₪450',
            date: new Date().toLocaleDateString('he-IL')
        },
        {
            id: 3,
            title: 'PlayStation 5 - קונסולת משחקים',
            url: 'https://example.com/ps5',
            category: 'games',
            image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
            price: '₪2,199',
            date: new Date().toLocaleDateString('he-IL')
        },
        {
            id: 4,
            title: 'כרית אורתופדית לבית',
            url: 'https://example.com/pillow',
            category: 'home',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
            price: '₪129',
            date: new Date().toLocaleDateString('he-IL')
        },
        {
            id: 5,
            title: 'סט כלי בית למטבח',
            url: 'https://example.com/houseware-set',
            category: 'houseware',
            image: 'https://images.unsplash.com/photo-1515105911711-23c0f512fdcc?w=400',
            price: '₪249',
            date: new Date().toLocaleDateString('he-IL')
        }
    ];
    saveLinks();
}

// ייצוא קישורים לקובץ JSON
function exportLinks() {
    const dataStr = JSON.stringify(links, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shopping-links.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('הקישורים יוצאו בהצלחה! שמור את הקובץ בפרויקט שלך ועשה commit ל-GitHub.');
}

// ייבוא קישורים מקובץ JSON
function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const importedLinks = JSON.parse(event.target.result);
            if (Array.isArray(importedLinks)) {
                if (confirm(`האם אתה בטוח שברצונך לייבא ${importedLinks.length} קישורים? זה יחליף את הקישורים הקיימים.`)) {
                    links = importedLinks;
                    saveLinks();
                    renderLinks();
                    alert('הקישורים יובאו בהצלחה!');
                }
            } else {
                alert('קובץ לא תקין. הקובץ צריך להכיל מערך של קישורים.');
            }
        } catch (error) {
            alert('שגיאה בקריאת הקובץ: ' + error.message);
        }
    };
    reader.readAsText(file);
    e.target.value = ''; // איפוס input
}

// טעינת קישורים מקובץ JSON בפרויקט (אם קיים)
async function loadLinksFromFile() {
    try {
        const response = await fetch('shopping-links.json');
        if (response.ok) {
            const fileLinks = await response.json();
            if (Array.isArray(fileLinks) && fileLinks.length > 0) {
                // אם יש קישורים ב-localStorage, נשאיר אותם. אחרת נטען מהקובץ
                if (links.length === 0) {
                    links = fileLinks;
                    saveLinks();
                    renderLinks();
                }
            }
        }
    } catch (error) {
        // הקובץ לא קיים או יש שגיאה - זה בסדר, נשתמש ב-localStorage
        console.log('לא נמצא קובץ shopping-links.json, משתמשים ב-localStorage');
    }
}

// הפונקציה deleteLink צריכה להיות גלובלית כדי לעבוד מה-HTML
window.deleteLink = deleteLink;


