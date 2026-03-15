(function() {
    // --- product data with LOCAL image paths (images stored inside project) ---
    const images = [
        'images/laptop-x1.jpg',
        'images/ultrabook-pro.jpg',
        'images/gaming-16.jpg',
        'images/thin-air.jpg',
        'images/smart-s23.jpg',
        'images/iphone-15.jpg',
        'images/pixel-8.jpg',
        'images/galaxy-z.jpg',
        'images/dslr-mark2.jpg',
        'images/mirrorless-z5.jpg',
        'images/action-cam.jpg',
        'images/zoom-lens.jpg',
        'images/mouse-pro.jpg',
        'images/mech-kb.jpg',
        'images/headphones.jpg',
        'images/powerbank.jpg'
    ];

    const names = [
        'Apple MacBook Neo', 'Apple MacBook Air 15‑inch M4', 'Acer Swift 16 AI"', 'Lenovo ThinkPad X1 Carbon Gen 13',
        'Google Pixel 10 Pro XL', 'Apple iPhone 17 Pro Max', 'Samsung Galaxy S26 Ultra', 'Xiaomi 17 Ultra',
        'Sony A7 IV', 'Canon EOS R6 II', 'Fujifilm X‑T5', 'Panasonic Lumix GH6 II',
        'Mouse Pro', 'Mech KB', 'Headphones', 'PowerBank'
    ];

    const prices = [1299, 1599, 1899, 1099, 899, 1199, 799, 1399, 1999, 1799, 399, 649, 79, 159, 249, 69];

    // 1. build 16 cards inside track
    const track = document.getElementById('productTrack');
    if (track) {
        for (let i = 0; i < 16; i++) {
            const card = document.createElement('div');
            card.setAttribute('data-card', '');

            // image with local path
            const img = document.createElement('img');
            img.setAttribute('data-card-img', '');
            img.src = images[i];
            img.alt = names[i];

            // name
            const nameEl = document.createElement('div');
            nameEl.setAttribute('data-card-name', '');
            nameEl.textContent = names[i];

            // price
            const priceEl = document.createElement('div');
            priceEl.setAttribute('data-card-price', '');
            priceEl.textContent = `$${prices[i]}`;

            card.appendChild(img);
            card.appendChild(nameEl);
            card.appendChild(priceEl);
            track.appendChild(card);
        }
    }

    // 2. slideshow logic
    const viewport = document.querySelector('[data-role="viewport"]');
    const container = document.querySelector('[data-role="slideContainer"]');
    let currentIndex = 0;
    const cardCount = 16;
    let cardWidth = 210;
    let gap = 24;
    let autoScrollInterval = null;

    function refreshMetrics() {
        const firstCard = track.querySelector('[data-card]');
        if (firstCard) {
            const style = window.getComputedStyle(firstCard);
            cardWidth = firstCard.offsetWidth;
            gap = 24;
        }
    }

    function getMaxScroll() {
        const step = cardWidth + gap;
        return (cardCount - 1) * step;
    }

    function updateScrollPosition(index, smooth = true) {
        if (!track) return;
        refreshMetrics();
        const step = cardWidth + gap;
        let translateX = index * step;
        const maxTranslate = (cardCount - 1) * step;
        if (translateX > maxTranslate) translateX = maxTranslate;
        if (translateX < 0) translateX = 0;
        track.style.transition = smooth ? 'transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1)' : 'none';
        track.style.transform = `translateX(-${translateX}px)`;
    }

    function startAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            if (!track) return;
            let nextIndex = currentIndex + 1;
            if (nextIndex >= cardCount) {
                nextIndex = 0;
            }
            currentIndex = nextIndex;
            updateScrollPosition(currentIndex, true);
        }, 4000);
    }

    function restartAutoScroll() {
        startAutoScroll();
    }

    function goToCardIndex(targetIndex) {
        if (targetIndex < 0 || targetIndex >= cardCount) return;
        currentIndex = targetIndex;
        updateScrollPosition(currentIndex, true);
        restartAutoScroll();
    }

    const btnLaptops = document.getElementById('navLaptops');
    const btnSmart = document.getElementById('navSmartphones');
    const btnCam = document.getElementById('navCameras');
    const btnAcc = document.getElementById('navAccessories');

    function clearActiveNav() {
        document.querySelectorAll('[data-nav-btn]').forEach(btn => btn.classList.remove('activeTab'));
    }

    if (btnLaptops) {
        btnLaptops.addEventListener('click', () => {
            goToCardIndex(0);
            clearActiveNav();
            btnLaptops.classList.add('activeTab');
        });
    }
    if (btnSmart) {
        btnSmart.addEventListener('click', () => {
            goToCardIndex(4);
            clearActiveNav();
            btnSmart.classList.add('activeTab');
        });
    }
    if (btnCam) {
        btnCam.addEventListener('click', () => {
            goToCardIndex(8);
            clearActiveNav();
            btnCam.classList.add('activeTab');
        });
    }
    if (btnAcc) {
        btnAcc.addEventListener('click', () => {
            goToCardIndex(12);
            clearActiveNav();
            btnAcc.classList.add('activeTab');
        });
    }

    window.addEventListener('load', () => {
        refreshMetrics();
        currentIndex = 0;
        updateScrollPosition(0, false);
        startAutoScroll();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            refreshMetrics();
            updateScrollPosition(currentIndex, false);
        }, 100);
    });

    if (btnLaptops) btnLaptops.classList.add('activeTab');
})();