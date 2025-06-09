// script.js
function closeMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const hamburger = document.querySelector('.hamburger');

    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }

    if (hamburger) {
        hamburger.classList.remove('active');
    }

    document.body.style.overflow = '';
}


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
  class ProductCarousel {
  constructor() {
    this.modals = Array.from(document.querySelectorAll('.tractor-modal'));
    this.carousel = document.querySelector('.product-carousel');
    this.list = document.querySelector('.carousel-list');
    this.slides = Array.from(document.querySelectorAll('.carousel-slide'));
    this.prevBtn = document.querySelector('.carousel-nav.prev');
    this.nextBtn = document.querySelector('.carousel-nav.next');
    this.currentIndex = 1;
    this.totalSlides = this.slides.length;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateCarousel();
  }

  setupEventListeners() {
    this.prevBtn.addEventListener('click', () => this.move(-1));
    this.nextBtn.addEventListener('click', () => this.move(1));

    document.querySelectorAll('.slide-details-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.modalTarget;
        this.openModal(modalId);
      });
    });

    document.querySelectorAll('.tractor-modal .close').forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
        const modal = closeBtn.closest('.tractor-modal');
        this.closeModal(modal);
      });
    });

    document.querySelectorAll('.tractor-modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal(modal);
      });
    });
  }

  move(direction) {
    this.currentIndex = (this.currentIndex + direction + this.totalSlides) % this.totalSlides;
    this.updateCarousel();
  }

  updateCarousel() {
    this.slides.forEach((slide, index) => {
      slide.classList.remove('active');
      const position = (index - this.currentIndex + this.totalSlides) % this.totalSlides;

      if (position === 0) {
        slide.classList.add('active');
      }

      const offset = (index - this.currentIndex) * 25;
      slide.style.transform = `translateX(${offset}%) scale(${position === 0 ? 1.1 : 1})`;
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modal) {
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
  }


    setupEventListeners() {
    this.prevBtn.addEventListener('click', () => this.move(-1));
    this.nextBtn.addEventListener('click', () => this.move(1));

    document.querySelectorAll('.slide-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
        const modalId = btn.dataset.modalTarget;
        this.openModal(modalId);
        });
    });

    document.querySelectorAll('.tractor-modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
        const modal = closeBtn.closest('.tractor-modal');
        this.closeModal(modal);
        });
    });

    document.querySelectorAll('.tractor-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal(modal);
        });
    });
    }

    updateCarousel() {
      this.slides.forEach((slide, index) => {
        slide.classList.remove('active');
        const position = (index - this.currentIndex + this.totalSlides) % this.totalSlides;

        if (position === 0) {
          slide.classList.add('active');
        }

        const offset = (index - this.currentIndex) * 25;
        slide.style.transform = `translateX(${offset}%) scale(${position === 0 ? 1.1 : 1})`;
      });
    }
  }

  new ProductCarousel();
});
