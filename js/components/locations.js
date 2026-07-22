window.App = window.App || {};

window.App.Locations = (function() {
    let locationsGrid, addLocationForm, globalLocationSelector;

    function init() {
        locationsGrid = document.getElementById('locationsGrid');
        addLocationForm = document.getElementById('addLocationForm');
        globalLocationSelector = document.getElementById('locationSelector');

        App.Store.subscribe(render);

        if(addLocationForm) {
            addLocationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('locName').value;
                const address = document.getElementById('locAddress').value;
                const contact = document.getElementById('locContact').value;
                
                App.Store.addLocation(name, address, contact);
                App.Notifications.show('Location Added', `Successfully added ${name} branch.`, 'success');
                addLocationForm.reset();
            });
        }

        // Global Location Selector delegation
        if(globalLocationSelector) {
            globalLocationSelector.addEventListener('click', (e) => {
                if(e.target.classList.contains('location-btn')) {
                    const loc = e.target.getAttribute('data-location');
                    App.Store.setCurrentLocation(loc);
                }
            });
        }
    }

    function render(state) {
        if(locationsGrid) {
            locationsGrid.innerHTML = '';
            state.locations.forEach(loc => {
                const card = document.createElement('div');
                card.className = 'card location-card';
                card.innerHTML = `
                    <h3>${loc.name} Branch</h3>
                    <p><i class="ph ph-map-pin"></i> ${loc.address}</p>
                    <p><i class="ph ph-phone"></i> ${loc.contact}</p>
                `;
                locationsGrid.appendChild(card);
            });
        }

        // Render global location selector buttons
        if(globalLocationSelector) {
            globalLocationSelector.innerHTML = '';
            state.locations.forEach(loc => {
                const btn = document.createElement('button');
                btn.className = `location-btn ${state.currentLocation === loc.name ? 'active' : ''}`;
                btn.setAttribute('data-location', loc.name);
                btn.textContent = loc.name;
                globalLocationSelector.appendChild(btn);
            });
        }
    }

    return { init };
})();
