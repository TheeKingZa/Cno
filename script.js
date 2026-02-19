const DEFAULT_LOGO = 'assets/logo.png';
const PREVIEW_LIMIT = 30; // Seconds

async function loadSiteData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        // Populate Profile (Keeping your previous logic)
        document.getElementById('producer-name').innerText = data.profile.name;
        document.getElementById('producer-bio').innerText = data.profile.bio;

        // Populate Socials
        const socialContainer = document.getElementById('social-links');
        socialContainer.innerHTML = ''; // Clear loading
        for (const [platform, url] of Object.entries(data.profile.socials)) {
            if (url) {
                const link = document.createElement('a');
                link.href = url;
                link.innerText = platform.toUpperCase();
                link.target = "_blank";
                socialContainer.appendChild(link);
            }
        }

        // Populate Instrumentals Grid
        const grid = document.getElementById('instrumentals-grid');
        grid.innerHTML = ''; 

        data.instrumentals.forEach(beat => {
            const card = document.createElement('div');
            card.className = 'beat-card';

            const imgPath = beat.imageUrl ? beat.imageUrl : DEFAULT_LOGO;

            card.innerHTML = `
                <img src="${imgPath}" onerror="this.src='${DEFAULT_LOGO}'" alt="${beat.title}">
                <div class="beat-info">
                    <h3>${beat.title}</h3>
                    <p>${beat.price}</p>
                    
                    <audio class="preview-player" controls controlsList="nodownload">
                        <source src="${beat.audioUrl}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                    <p class="time-limit-msg">30s Preview Only</p>

                    <a href="${beat.link}" class="buy-btn" target="_blank">Buy Full Version</a>
                </div>
            `;
            grid.appendChild(card);
        });

        // --- THE PREVIEW LOGIC ---
        const players = document.querySelectorAll('.preview-player');
        
        players.forEach(player => {
            player.addEventListener('timeupdate', () => {
                if (player.currentTime >= PREVIEW_LIMIT) {
                    player.pause();
                    player.currentTime = 0; // Reset to start
                    alert("Click 'Buy Full Version' to hear the rest!");
                }
            });

            // Pause other players if a new one starts
            player.addEventListener('play', () => {
                players.forEach(otherPlayer => {
                    if (otherPlayer !== player) otherPlayer.pause();
                });
            });
        });

    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

loadSiteData();