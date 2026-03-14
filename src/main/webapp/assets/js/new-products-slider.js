(function() {
    // *******************************
    // separate JavaScript file – no inline
    // *******************************

    // ----- real image links (unplash / placeholder – real photos) -----
    const images = [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=300&fit=crop&auto=format", // laptop 1
        "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=300&h=300&fit=crop&auto=format", // laptop 2
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop&auto=format", // laptop 3
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300&h=300&fit=crop&auto=format", // laptop 4
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop&auto=format", // smartphone 5
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&auto=format", // smartphone 6
        "https://images.unsplash.com/photo-1565849904461-af22c6c56ea9?w=300&h=300&fit=crop&auto=format", // smartphone 7
        "https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?w=300&h=300&fit=crop&auto=format", // smartphone 8
        "https://images.unsplash.com/photo-1502920917128-1aa5007642bd?w=300&h=300&fit=crop&auto=format", // camera 9
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop&auto=format", // camera 10
        "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=300&h=300&fit=crop&auto=format", // camera 11
        "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=300&h=300&fit=crop&auto=format", // camera 12
        "https://images.unsplash.com/photo-1521296797187-726205347bc9?w=300&h=300&fit=crop&auto=format", // accessory 13
        "https://images.unsplash.com/photo-1625773049546-f625f248cccd?w=300&h=300&fit=crop&auto=format", // accessory 14
        "https://images.unsplash.com/photo-1541807652-4b8f3cee7c2d?w=300&h=300&fit=crop&auto=format", // accessory 15
        "https://images.unsplash.com/photo-1503602642458-232111445657?w=300&h=300&fit=crop&auto=format"  // accessory 16
    ];

    // names & prices (diverse)
    const names = [
        "XPS 15", "Swift 3", "ROG Zephyrus", "MacBook Air",
        "Galaxy S23", "iPhone 15", "Pixel 8", "Xperia 1",
        "Alpha A7", "EOS R6", "Lumix GH6", "Z 30",
        "QuickCharge Pro", "Carbon Tripod", "ND Filter", "Backpack 20L"
    ];

    const prices = [
        "$1,299", "$799", "$1,899", "$1,099",
        "$899", "$1,199", "$699", "$1,079",
        "$2,199", "$2,499", "$1,799", "$999",
        "$49", "$189", "$79", "$129"
    ];

    // get track element
    const track = document.getElementById('cardTrack');
    if (!track) return;

    // build 16 cards (no class names, only attributes)
    for (let i = 0; i < 16; i++) {
        const card = document.createElement('div');
        card.setAttribute('data-card', i + 1); // 1..16 (just for consistency)

        // image element
        const img = document.createElement('img');
        img.setAttribute('data-card-image', '');
        img.src = images[i];
        img.alt = names[i] + ' photo';
        img.loading = 'lazy';

        // name element
        const nameEl = document.createElement('div');
        nameEl.setAttribute('data-card-name', '');
        nameEl.textContent = names[i];

        // price element
        const priceEl = document.createElement('div');
        priceEl.setAttribute('data-card-price', '');
        priceEl.textContent = prices[i];

        card.appendChild(img);
        card.appendChild(nameEl);
        card.appendChild(priceEl);
        track.appendChild(card);
    }

    // ----- stage and auto-scroll logic -----
    const stage = document.getElementById('slideshowStage');
    if (!stage) return;

    // calculate card width including gap (gap 1.5rem = 24px)
    let cardWidth = 0;
    function getCardUnit() {
        const firstCard = track.querySelector('[data-card]');
        if (!firstCard) return 264; // fallback ~ width+gap
        const style = window.getComputedStyle(firstCard);
        const width = parseFloat(style.width) || 240;
        const gap = 24; // 1.5rem = 24px
        return width + gap;
    }

    let autoScrollInterval;
    let currentIndex = 0;  // zero based, card index to scroll to next

    function scrollToCard(index) {
        if (!stage || !track) return;
        const unit = getCardUnit();
        // index is zero-based: 0 => first card, 4 => 5th card, etc.
        const scrollLeft = index * unit;
        stage.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }

    // advance to next card modulo 16
    function advanceSlide() {
        if (!stage || !track) return;
        const unit = getCardUnit();
        const maxIndex = 15; // 0..15
        // determine next index based on current scroll
        const currentScroll = stage.scrollLeft;
        // estimate which card is mostly visible (simple rounding)
        const approxIndex = Math.round(currentScroll / unit);
        let nextIndex = (approxIndex + 1) % 16;
        // boundary safety
        if (nextIndex > 15) nextIndex = 0;
        scrollToCard(nextIndex);
    }

    // start auto scroll (4 seconds)
    function startAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(advanceSlide, 3000);
    }

    // restart timer after manual interaction or jump
    function restartAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(advanceSlide, 2000);
        }
    }

    // ----- navigation jump: laptops->card0, smartphones->card4, cameras->card8, accessories->card12
    const navButtons = document.querySelectorAll('[data-role="nav-btn"]');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const jumpRaw = this.getAttribute('data-jump');
            if (jumpRaw === null) return;
            const targetIndex = parseInt(jumpRaw, 10); // 0,4,8,12
            if (!isNaN(targetIndex)) {
                scrollToCard(targetIndex);
                restartAutoScroll();
            }
        });
    });

    // stop auto scroll during manual scrolling, then restart after a short idle
    let scrollTimeout;
    stage.addEventListener('scroll', () => {
        // clear existing timeout
        if (scrollTimeout) clearTimeout(scrollTimeout);
        // pause autoScroll while user drags / touches
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
        // restart after 700ms idle
        scrollTimeout = setTimeout(() => {
            startAutoScroll();
        }, 700);
    });

    // also restart after a potential programmatic scroll (but we don't want to double)
    // we handle by restartAutoScroll inside click only. startAutoScroll also on load.

    // initial card width might not be ready immediately, wait for layout
    window.addEventListener('load', function() {
        // make sure stage starts at first card (index 0)
        setTimeout(() => {
            stage.scrollLeft = 0;  // no smooth, just set
            startAutoScroll();
        }, 30);
    });

    // if images load later, unit may change; update on resize
    window.addEventListener('resize', () => {
        // restart from current index to avoid misalignment, keep same relative index
        if (!stage) return;
        const unit = getCardUnit();
        const currentScroll = stage.scrollLeft;
        const idx = Math.round(currentScroll / unit);
        // re-sync using same index
        scrollToCard(idx);
    });

})();