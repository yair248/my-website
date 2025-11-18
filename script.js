// קטגוריות עם שמות בעברית
const categories = {
    'all': 'הכל',
    'kids-clothes': 'בגדי ילדים',
    'photography': 'אביזרי צילום',
    'games': 'משחקים',
    'home': 'לבית',
    'electronics': 'אלקטרוניקה',
    'fashion': 'אופנה'
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

let currentCategory = 'all';

// אתחול
document.addEventListener('DOMContentLoaded', () => {
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

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderLinks();
        });
    });
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

// קבלת תמונה ברירת מחדל לפי קטגוריה
function getDefaultImage(category) {
    const defaultImages = {
        'kids-clothes': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
        'photography': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
        'games': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
        'home': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
        'fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'
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
        }
    ];
    saveLinks();
}

// הפונקציה deleteLink צריכה להיות גלובלית כדי לעבוד מה-HTML
window.deleteLink = deleteLink;


