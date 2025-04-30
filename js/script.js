// ну типо логика?


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
    // Получаем элементы управления
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    // Проверяем наличие необходимых элементов
    if (!hamburger || !mobileMenu) {
        console.error('Mobile menu elements not found!');
        return;
    }

    // Функция переключения состояния меню
    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Блокировка скролла страницы
        if (mobileMenu.classList.contains('active')) {
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = '';
        }
    };

    // Функция закрытия меню
    const closeMenu = () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
        document.documentElement.style.overflow = '';
    };

    // Обработчик клика по гамбургеру
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Обработчик кликов по документу
    document.addEventListener('click', function(e) {
        const isClickInsideMenu = mobileMenu.contains(e.target);
        const isClickOnHamburger = hamburger.contains(e.target);
        
        // Закрываем меню только если клик вне меню и не по гамбургеру
        if (!isClickInsideMenu && !isClickOnHamburger) {
            closeMenu();
        }
    });

    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Блокировка всплытия событий для всех элементов меню
    mobileMenu.querySelectorAll('*').forEach(element => {
        element.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Обработчики для выпадающих меню (если есть)
    document.querySelectorAll('.mobile-dropdown-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.closest('.mobile-dropdown');
            const content = dropdown.querySelector('.mobile-dropdown-content');
            const arrow = this.querySelector('.mobile-arrow');

            dropdown.classList.toggle('open');

            // Анимация выпадающего контента
            if (dropdown.classList.contains('open')) {
                content.style.maxHeight = content.scrollHeight + 'px';
                if (arrow) arrow.style.transform = 'rotate(90deg)';
            } else {
                content.style.maxHeight = '0';
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            }
        });
    });

    // Обработка свайпов для мобильных устройств
    let touchStartX = 0;
    const SWIPE_THRESHOLD = 50;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;

        // Закрываем меню при свайпе вправо
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