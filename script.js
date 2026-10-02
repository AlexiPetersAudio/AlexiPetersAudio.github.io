// Grab all elements with the 'fade-in' class
const faders = document.querySelectorAll('.fade-in');

// Set up the observer options
const appearOptions = {
    threshold: 0.15, // Triggers when 15% of the element is visible
    rootMargin: "0px 0px -50px 0px"
};

// Create the observer
const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            // Add the 'visible' class to trigger the CSS transition
            entry.target.classList.add('visible');
            // Stop observing once it has faded in
            observer.unobserve(entry.target);
        }
    });
}, appearOptions);

// Apply the observer to each fade-in element
faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

async function loadPortfolioData() {
    try {
        // Fetch the data from your JSON file
        const response = await fetch('portfolio.json');
        const albums = await response.json();
        const container = document.getElementById('portfolio-grid');

        // Loop through each album and inject the HTML
        albums.forEach(album => {
            const html = `
                <a href="${album.link}" target="_blank" class="album-wrapper fade-in">
                    <img src="${album.image}" alt="Album Cover" class="album-cover">
                    <div class="floating-box">
                        <h3>${album.title}</h3>
                        <p class="artist">${album.artist}</p>
                    </div>
                </a>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });

        // Apply the fade-in observer to the newly generated elements
        const newFaders = document.querySelectorAll('.fade-in');
        newFaders.forEach(fader => {
            appearOnScroll.observe(fader);
        });

    } catch (error) {
        console.error("Error loading portfolio data:", error);
    }
}

// Run the function when the page loads
loadPortfolioData();