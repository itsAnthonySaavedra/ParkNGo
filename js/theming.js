window.App = window.App || {};

window.App.Theming = (function() {
    const themes = {
        "Park n Go": {
            "--primary-color": "#802F74", // Premium Purple
            "--secondary-color": "#D91A2A", // Bold Red
            "--accent-color": "#FFD100", // Yellow
            "--bg-color": "#F8F9FA", // Clean light gray
            "--card-bg": "#FFFFFF",
            "--text-dark": "#212529", // Crisp dark gray
            "--text-light": "#6C757D", // Muted gray
            "--border-color": "#DEE2E6",
            "--font-primary": "'Comic Sans MS', cursive, sans-serif",
            "--font-secondary": "'Inter', sans-serif"
        },
        "Judel's Cafe": {
            "--primary-color": "#7BCDC8",
            "--secondary-color": "#5BB5B0",
            "--accent-color": "#3F332A",
            "--bg-color": "#F8F9FA", // Keep consistent clean background
            "--card-bg": "#FFFFFF",
            "--text-dark": "#212529",
            "--text-light": "#6C757D",
            "--border-color": "#DEE2E6",
            "--font-primary": "'Playfair Display', serif",
            "--font-secondary": "'Inter', sans-serif"
        }
    };

    function init() {
        App.Store.subscribe(applyTheme);
        // Apply initial theme
        applyTheme(App.Store.getState());
    }

    function applyTheme(state) {
        const location = state.locations.find(l => l.name === state.currentLocation);
        if (!location) return;

        const business = location.business;
        const theme = themes[business];

        if (theme) {
            const root = document.documentElement;
            for (const key in theme) {
                root.style.setProperty(key, theme[key]);
            }
            
            updateLogos(business);
        }
    }

    function updateLogos(business) {
        const brandLogoText = document.querySelector('.brand-logo-text');
        if (brandLogoText) {
            if (business === "Park n Go") {
                brandLogoText.style.fontFamily = "var(--font-primary)";
                brandLogoText.style.fontWeight = "bold";
                brandLogoText.style.fontStyle = "italic";
                brandLogoText.innerHTML = `<span style="color: #D91A2A;">Park</span> <span style="color: #FFD100;">n'</span> <span style="color: #00843D;">Go</span>`;
            } else if (business === "Judel's Cafe") {
                brandLogoText.style.fontFamily = "var(--font-primary)";
                brandLogoText.style.fontWeight = "normal";
                brandLogoText.style.fontStyle = "normal";
                brandLogoText.innerHTML = `<div style="display: flex; flex-direction: column; align-items: center; color: #7BCDC8; line-height: 1;"><span style="font-size: 1rem;">Judel's</span><span style="font-size: 1.2rem; font-weight: bold; letter-spacing: 2px;">PREMIUM</span><span style="font-size: 0.6rem; letter-spacing: 4px;">CAFE</span></div>`;
            }
        }
        
        const bannerText = document.querySelector('.banner-content h2');
        if (bannerText) {
            if (business === "Park n Go") {
                bannerText.textContent = "Welcome to Park n' Go Bakeshop";
            } else {
                bannerText.textContent = "Welcome to Judel's Premium Cafe";
            }
            bannerText.style.fontFamily = "var(--font-primary)";
        }
    }

    return { init };
})();
