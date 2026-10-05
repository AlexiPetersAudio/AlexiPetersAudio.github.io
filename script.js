// Set up observer options
const appearOptions = {
    threshold: 0.15, // Triggers when 15% of the element is visible
    rootMargin: "0px 0px -50px 0px"
};

// Create the Intersection Observer
const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, appearOptions);

// 1. OBSERVE STATIC ELEMENTS (Header, Contact section, etc. already in index.html)
document.addEventListener('DOMContentLoaded', () => {
    const staticFaders = document.querySelectorAll('.fade-in');
    staticFaders.forEach(fader => appearOnScroll.observe(fader));
});

// 2. FETCH PORTFOLIO DATA & OBSERVE DYNAMIC ALBUM CARDS
async function loadPortfolioData() {
    try {
        const response = await fetch('portfolio.json');
        const albums = await response.json();
        const container = document.getElementById('portfolio-grid');

        albums.forEach(album => {
            let tagsHtml = '';
            if (album.credits && Array.isArray(album.credits)) {
                tagsHtml = `<div class="credits-tags">` + 
                    album.credits.map(credit => `<span class="tag">${credit}</span>`).join('') + 
                    `</div>`;
            }

            const html = `
                <a href="${album.link}" target="_blank" class="album-wrapper fade-in">
                    <img src="${album.image}" alt="Album Cover" class="album-cover">
                    <div class="floating-box">
                        <h3>${album.title}</h3>
                        <p class="artist">${album.artist}</p>
                        ${tagsHtml}
                    </div>
                </a>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });

        // Query the album wrappers after they are injected into the DOM
        const albumWrappers = document.querySelectorAll('.album-wrapper');
        
        albumWrappers.forEach(wrapper => {
            // Observe dynamic album cards for scroll fade-in
            appearOnScroll.observe(wrapper);

            // Attach random tilt on hover (skipping -2deg to +2deg)
            wrapper.addEventListener('mouseenter', () => {
                const magnitude = 2 + Math.random() * 4; // 2deg to 6deg
                const sign = Math.random() < 0.5 ? -1 : 1; // Left or Right
                const randomAngle = (magnitude * sign).toFixed(1);
                wrapper.style.setProperty('--hover-tilt', `${randomAngle}deg`);
            });
        });

    } catch (error) {
        console.error("Error loading portfolio data:", error);
    }
}

// Run the portfolio loader
loadPortfolioData();