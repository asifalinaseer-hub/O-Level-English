/* ===========================
   DARK MODE TOGGLE
   =========================== */

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Initialize on page load
initializeTheme();

/* ===========================
   NAVIGATION
   =========================== */

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Sticky navbar background on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
});

/* ===========================
   PROGRESS BAR
   =========================== */

const progressBar = document.getElementById('progressBar');

window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

/* ===========================
   BACK TO TOP BUTTON
   =========================== */

const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/* ===========================
   ACCORDION FUNCTIONALITY
   =========================== */

function toggleAccordion(header) {
    const item = header.parentElement;
    const wasActive = item.classList.contains('active');
    
    // Close all other accordions in the same container
    const container = item.parentElement;
    const items = container.querySelectorAll('.accordion-item');
    items.forEach(accordionItem => {
        accordionItem.classList.remove('active');
    });
    
    // Toggle current item
    if (!wasActive) {
        item.classList.add('active');
    }
}

/* ===========================
   MODEL ANSWER MODALS
   =========================== */

function toggleModel(modelType) {
    const modalId = modelType + 'Modal';
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModel(modelType) {
    const modalId = modelType + 'Modal';
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
document.querySelectorAll('.model-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

/* ===========================
   PAST PAPERS SEARCH/FILTER
   =========================== */

function filterPastPapers() {
    const searchInput = document.getElementById('yearFilter').value.toLowerCase();
    const yearGroups = document.querySelectorAll('.paper-year-group');
    
    yearGroups.forEach(group => {
        const year = group.getAttribute('data-year');
        if (year.includes(searchInput)) {
            group.style.display = 'block';
        } else {
            group.style.display = 'none';
        }
    });
}

/* ===========================
   DOWNLOAD FUNCTIONS
   =========================== */

function downloadPaper(paperId) {
    // In a real implementation, this would trigger actual PDF downloads
    const fileName = `Past_Paper_${paperId}.pdf`;
    showDownloadMessage(`Downloading ${fileName}...`);
}

function downloadResource(resourceId) {
    // In a real implementation, this would trigger actual PDF downloads
    const fileName = `Resource_${resourceId}.pdf`;
    showDownloadMessage(`Downloading ${fileName}...`);
}

function showDownloadMessage(message) {
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #10B981, #22C55E);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 2000;
        animation: slideInRight 0.3s ease-out;
    `;
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

/* ===========================
   PROGRESS TRACKER
   =========================== */

const progressData = {
    summary: 0,
    comprehension: 0,
    writer: 0,
    directed: 0,
    descriptive: 0,
    narrative: 0
};

function updateProgress(skillType, value) {
    progressData[skillType] = value;
    
    // Update progress bar
    const progressId = skillType + 'Progress';
    const valueId = skillType + 'Value';
    const progressBar = document.getElementById(progressId);
    const valueDisplay = document.getElementById(valueId);
    
    if (progressBar && valueDisplay) {
        progressBar.style.width = value + '%';
        valueDisplay.textContent = value + '%';
    }
}

function saveProgress() {
    localStorage.setItem('progressData', JSON.stringify(progressData));
    showNotification('Progress saved successfully!', 'success');
}

function loadProgress() {
    const savedData = localStorage.getItem('progressData');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            if (progressData.hasOwnProperty(key)) {
                updateProgress(key, data[key]);
                progressData[key] = data[key];
            }
        });
        showNotification('Progress loaded successfully!', 'success');
    } else {
        showNotification('No saved progress found.', 'warning');
    }
}

function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
        Object.keys(progressData).forEach(key => {
            updateProgress(key, 0);
            progressData[key] = 0;
        });
        localStorage.removeItem('progressData');
        showNotification('All progress has been reset.', 'success');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#F59E0B';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 2000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Load progress on page load
window.addEventListener('load', () => {
    const savedData = localStorage.getItem('progressData');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            if (progressData.hasOwnProperty(key)) {
                updateProgress(key, data[key]);
                progressData[key] = data[key];
            }
        });
    }
});

/* ===========================
   CONTACT FORM
   =========================== */

function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const formMessage = document.getElementById('formMessage');
    
    // Validate form
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (!name || !email || !message) {
        formMessage.textContent = 'Please fill in all required fields.';
        formMessage.className = 'form-message error';
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        formMessage.textContent = 'Please enter a valid email address.';
        formMessage.className = 'form-message error';
        return;
    }
    
    // In a real implementation, this would send data to a server
    // For now, we'll just show a success message
    formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
    formMessage.className = 'form-message success';
    
    // Reset form
    form.reset();
    
    // Clear message after 5 seconds
    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }, 5000);
}

/* ===========================
   FAQ ACCORDION
   =========================== */

function toggleFAQ(button) {
    const item = button.parentElement;
    const wasActive = item.classList.contains('active');
    
    // Close all other FAQs
    const allFAQs = document.querySelectorAll('.faq-item');
    allFAQs.forEach(faq => {
        faq.classList.remove('active');
    });
    
    // Toggle current FAQ
    if (!wasActive) {
        item.classList.add('active');
    }
}

/* ===========================
   STATISTICS COUNTER ANIMATION
   =========================== */

function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(element => {
        const target = parseInt(element.getAttribute('data-target'));
        const increment = target / 50;
        let current = 0;
        
        const updateCounter = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(updateCounter);
            }
            element.textContent = Math.floor(current);
        }, 30);
    });
}

// Trigger counter animation when section is in view
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('statistics-section')) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.statistics-section');
if (statsSection) {
    observer.observe(statsSection);
}

/* ===========================
   LAZY LOADING IMAGES
   =========================== */

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

/* ===========================
   SMOOTH SCROLL OFFSET FOR FIXED NAVBAR
   =========================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80; // Navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

/* ===========================
   SEARCH FUNCTIONALITY
   =========================== */

function searchWebsite(query) {
    // This would implement a full-text search across the website
    const lowerQuery = query.toLowerCase();
    const results = [];
    
    // Search in headings
    document.querySelectorAll('h1, h2, h3, h4').forEach(heading => {
        if (heading.textContent.toLowerCase().includes(lowerQuery)) {
            results.push({
                title: heading.textContent,
                element: heading,
                relevance: 'high'
            });
        }
    });
    
    // Search in paragraphs
    document.querySelectorAll('p').forEach(paragraph => {
        if (paragraph.textContent.toLowerCase().includes(lowerQuery)) {
            results.push({
                title: paragraph.textContent.substring(0, 100) + '...',
                element: paragraph,
                relevance: 'medium'
            });
        }
    });
    
    return results;
}

/* ===========================
   PRINT FUNCTIONALITY
   =========================== */

function printContent(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(section.innerHTML);
        printWindow.document.close();
        printWindow.print();
    }
}

/* ===========================
   SHARE FUNCTIONALITY
   =========================== */

function shareContent(title, text) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
        window.open(shareUrl, '_blank');
    }
}

/* ===========================
   EXPORT CONTENT
   =========================== */

function exportAsCSV() {
    const data = JSON.stringify(progressData, null, 2);
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'progress_' + new Date().getTime() + '.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

/* ===========================
   UTILITY FUNCTIONS
   =========================== */

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add animation on scroll
function observeElements() {
    const elements = document.querySelectorAll('.card, .glass-effect, .btn');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInScale 0.5s ease-out';
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    elements.forEach(element => {
        scrollObserver.observe(element);
    });
}

// Initialize on page load
window.addEventListener('load', () => {
    observeElements();
});

/* ===========================
   KEYBOARD SHORTCUTS
   =========================== */

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Future: Open search modal
        console.log('Search shortcut triggered');
    }
    
    // Esc to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.model-modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

/* ===========================
   PERFORMANCE OPTIMIZATION
   =========================== */

// Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        if (!inThrottle) {
            func.apply(this, arguments);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Use throttled scroll handler
window.addEventListener('scroll', throttle(() => {
    // Scroll-based updates
}, 100));

/* ===========================
   ACCESSIBILITY ENHANCEMENTS
   =========================== */

// Add keyboard navigation for modals
document.querySelectorAll('.model-modal').forEach(modal => {
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.classList.remove('active');
        }
    });
});

// Set focus management
function setFocusToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.focus();
    }
}

/* ===========================
   PAGE VISIBILITY API
   =========================== */

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden
        console.log('Page hidden');
    } else {
        // Page is visible
        console.log('Page visible');
    }
});

/* ===========================
   BROWSER STORAGE MANAGEMENT
   =========================== */

function clearAllStorage() {
    if (confirm('Are you sure you want to clear all saved data?')) {
        localStorage.clear();
        sessionStorage.clear();
        showNotification('All data cleared successfully!', 'success');
    }
}

/* ===========================
   ERROR HANDLING
   =========================== */

window.addEventListener('error', (event) => {
    console.error('Error occurred:', event.error);
    // In production, you might want to send this to an error tracking service
});

/* ===========================
   SERVICE WORKER (OPTIONAL)
   =========================== */

if ('serviceWorker' in navigator) {
    // Uncomment to enable service worker for offline functionality
    // navigator.serviceWorker.register('sw.js')
    //     .then(registration => console.log('SW registered:', registration))
    //     .catch(error => console.log('SW registration failed:', error));
}

/* ===========================
   DOCUMENT READY EQUIVALENT
   =========================== */

function documentReady(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

// Initialize all functionality
documentReady(() => {
    console.log('Cambridge O Level English Language 1123 - Loaded Successfully');
    
    // Initialize all components
    initializeTheme();
    observeElements();
    
    // Load saved progress
    const savedData = localStorage.getItem('progressData');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            updateProgress(key, data[key]);
        });
    }
});

/* ===========================
   ANALYTICS PLACEHOLDER
   =========================== */

// Google Analytics or similar would go here
// Track user interactions for learning insights
function trackUserAction(action, category, label) {
    // In production, send to analytics service
    console.log(`Action: ${action}, Category: ${category}, Label: ${label}`);
}

// Example usage:
// trackUserAction('button_click', 'downloads', 'past_paper_2024');