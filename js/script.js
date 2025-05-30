// script.js


//скрипт для динамической регулировки линии под текстом
function updateUnderline() {
    const logo = document.querySelector('.logo');
    const underline = document.querySelector('.subtitle::before');
    
    if(logo && underline) {
        const logoWidth = logo.offsetWidth;
        underline.style.width = `${logoWidth}px`;
    }
}

window.addEventListener('load', updateUnderline);
window.addEventListener('resize', updateUnderline);

// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    const mobileOverlay = document.querySelector('.mobile-overlay');

    if (!hamburger || !mobileMenu) {
        console.error('Mobile menu elements not found!');
        return;
    }

    const animateClose = () => {
        mobileMenu.classList.add('closing');
        if(mobileOverlay) mobileOverlay.classList.add('closing');
        
        setTimeout(() => {
            mobileMenu.classList.remove('active', 'closing');
            if(mobileOverlay) mobileOverlay.classList.remove('active', 'closing');
            body.classList.remove('no-scroll');
            document.documentElement.style.overflow = '';
            hamburger.classList.remove('active');
        }, 400);
    };

    const redirectToIndex = () => {
        if (!window.location.href.endsWith('index.html')) {
            window.location.href = 'index.html';
        }
    };

    const toggleMenu = () => {
        const isOpening = !mobileMenu.classList.contains('active');
    
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        if(mobileOverlay) mobileOverlay.classList.toggle('active');
        body.classList.toggle('no-scroll');
        
        if (isOpening) {
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = '';
        }
    };

    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            animateClose();
            setTimeout(redirectToIndex, 400);
        });
        
        const closeIcon = mobileCloseBtn.querySelector('svg');
        if (closeIcon) {
            closeIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                mobileCloseBtn.dispatchEvent(new Event('click'));
            });
        }
    }

    mobileCloseBtn.addEventListener('click', function() {
        console.log('Close button clicked');
        animateClose();
        setTimeout(() => {
            console.log('Redirecting to index.html');
            window.location.href = 'index.html';
        }, 400);
    });

    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    document.addEventListener('click', function(e) {
        const isClickInsideMenu = mobileMenu.contains(e.target);
        const isClickOnHamburger = hamburger.contains(e.target);

        if (!isClickInsideMenu && !isClickOnHamburger) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    mobileMenu.querySelectorAll('*').forEach(element => {
        element.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    document.querySelectorAll('.mobile-dropdown-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const dropdown = this.closest('.mobile-dropdown');
            const content = dropdown.querySelector('.mobile-dropdown-content');
            
            dropdown.classList.toggle('open');
            content.style.maxHeight = dropdown.classList.contains('open') 
                ? content.scrollHeight + 'px'
                : '0';
            
            // Прокрутка к открытому элементу
            if(dropdown.classList.contains('open')) {
                setTimeout(() => {
                    dropdown.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 300);
            }
        });
    });

    let touchStartX = 0;
    const SWIPE_THRESHOLD = 50;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;

        if (deltaX > SWIPE_THRESHOLD && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    }, { passive: true });

    document.querySelector('.hamburger').addEventListener('click', function() {
        document.body.classList.toggle('menu-open');
    });
    
    document.body.addEventListener('click', function(e) {
        if (e.target === document.body && document.body.classList.contains('menu-open')) {
            document.body.classList.remove('menu-open');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    class InfiniteCarousel {
        constructor() {
            this.container = document.querySelector('.gallery-container');
            this.track = document.querySelector('.gallery-track');
            this.items = Array.from(document.querySelectorAll('.gallery-item'));
            this.prevBtn = document.querySelector('.prev-btn');
            this.nextBtn = document.querySelector('.next-btn');

            this.currentIndex = this.items.findIndex(item => item.classList.contains('active'));

            this.totalItems = 8;
            this.visibleItems = 7;
            this.isAnimating = false;
            this.swipeThreshold = 50;
            this.animationDuration = 600;

            this.init();
        }

        init() {
            this.setupEventListeners();
            this.updateCarousel();
            this.setupAccessibility();
        }

        setupEventListeners() {
            this.prevBtn.addEventListener('click', () => this.move(-1));
            this.nextBtn.addEventListener('click', () => this.move(1));
            this.setupTouchHandlers();
        }

        setupTouchHandlers() {
            let touchStartX = 0;
            this.container.addEventListener('touchstart', e => {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });

            this.container.addEventListener('touchend', e => {
                const touchEndX = e.changedTouches[0].clientX;
                const deltaX = touchEndX - touchStartX;
                if (Math.abs(deltaX) > this.swipeThreshold) {
                    deltaX > 0 ? this.move(-1) : this.move(1);
                }
            }, { passive: true });
        }

        move(direction) {
            if (this.isAnimating) return;
            this.isAnimating = true;

            this.currentIndex = (this.currentIndex + direction + this.totalItems) % this.totalItems;
            this.updateCarousel();

            setTimeout(() => {
                this.isAnimating = false;
            }, this.animationDuration);
        }

        updateCarousel() {
            this.items.forEach((item, index) => {
                const position = this.calculatePosition(index);
                this.updateItemClasses(item, position);
                this.applyItemStyles(item, position);
            });
        }

        calculatePosition(index) {
            return (index - this.currentIndex + this.totalItems) % this.totalItems;
        }

        updateItemClasses(item, position) {
            const classes = ['prev-3', 'prev-2', 'prev-1', 'active', 'next-1', 'next-2', 'next-3', 'next-4'];
            item.classList.remove(...classes);
            
            if(position < 4) {
                item.classList.add(`prev-${4 - position}`);
            } 
            else if(position === 4) {
                item.classList.add('active');
            }
            else {
                item.classList.add(`next-${position - 4}`);
            }
        }

        applyItemStyles(item, position) {
            const styleMap = {
                0: { transform: 'translateX(-120%) scale(0.5)', opacity: 0.3, zIndex: 1, filter: 'blur(4px)' }, 
                1: { transform: 'translateX(-90%) scale(0.6)', opacity: 0.4, zIndex: 2, filter: 'blur(3px)' },  
                2: { transform: 'translateX(-60%) scale(0.8)', opacity: 0.6, zIndex: 3, filter: 'blur(2px)' },  
                3: { transform: 'translateX(-30%) scale(0.9)', opacity: 0.8, zIndex: 4, filter: 'blur(1px)' },  
                4: { transform: 'translateX(-50%) scale(1)', opacity: 1, zIndex: 5, filter: 'none' },          
                5: { transform: 'translateX(-70%) scale(0.9)', opacity: 0.8, zIndex: 4, filter: 'blur(1px)' },
                6: { transform: 'translateX(-90%) scale(0.8)', opacity: 0.6, zIndex: 3, filter: 'blur(2px)' },
                7: { transform: 'translateX(-110%) scale(0.6)', opacity: 0.4, zIndex: 2, filter: 'blur(3px)' },
            };

            Object.assign(item.style, styleMap[position] || { display: 'none' });
        }

        setupAccessibility() {
            this.container.setAttribute('role', 'region');
            this.container.setAttribute('aria-label', 'Product Gallery');
            this.items.forEach(item => {
                item.setAttribute('role', 'group');
                item.setAttribute('aria-hidden', 'true');
            });
            this.items[this.currentIndex].setAttribute('aria-hidden', 'false');
        }
    }

    new InfiniteCarousel();
});