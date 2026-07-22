window.App = window.App || {};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Utilities
    App.Notifications.init();

    // Initialize Components
    App.Dashboard.init();
    App.Inventory.init();
    App.Locations.init();
    App.Staff.init();
    App.Settings.init();
    App.Reports.init();
    App.Theming.init();

    // Setup Tab Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const views = {
        'dashboard': document.getElementById('dashboardView'),
        'inventory': document.getElementById('inventoryView'),
        'locations': document.getElementById('locationsView'),
        'staff': document.getElementById('staffView'),
        'settings': document.getElementById('settingsView')
    };

    // User Switcher & RBAC Logic
    const userSwitcher = document.getElementById('userSwitcher');
    const userAvatar = document.getElementById('userAvatar');
    const locationSelector = document.getElementById('locationSelector');

    const state = App.Store.getState();
    state.users.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.id;
        opt.textContent = `${u.name} (${u.role})`;
        if(u.id === state.currentUser.id) opt.selected = true;
        userSwitcher.appendChild(opt);
    });

    userSwitcher.addEventListener('change', (e) => {
        App.Store.switchUser(e.target.value);
    });

    App.Store.subscribe((newState) => {
        const user = newState.currentUser;
        if(userAvatar) userAvatar.textContent = user.role.charAt(0);
        
        const isManager = user.role === 'Branch Manager';

        if (locationSelector) {
            locationSelector.style.display = isManager ? 'none' : 'flex';
        }

        const headerBranchIndicator = document.getElementById('headerBranchIndicator');
        const headerBranchText = document.getElementById('headerBranchText');
        if (headerBranchText) {
            headerBranchText.textContent = newState.currentLocation;
        }
        if (headerBranchIndicator) {
            // Only strictly necessary for Branch Managers since they lack the location selector,
            // but it looks nice as a persistent badge for everyone.
            headerBranchIndicator.style.display = 'inline-flex';
        }

        navItems.forEach(tab => {
            const tabName = tab.getAttribute('data-tab');
            if (isManager && (tabName === 'locations' || tabName === 'settings')) {
                tab.style.display = 'none';
                if (tab.classList.contains('active')) {
                    document.querySelector('.nav-item[data-tab="dashboard"]').click();
                }
            } else {
                tab.style.display = 'flex';
            }
        });
    });

    navItems.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            const tabName = target.getAttribute('data-tab');
            
            navItems.forEach(t => t.classList.remove('active'));
            target.classList.add('active');

            // Hide all views
            Object.values(views).forEach(view => {
                if(view) view.style.display = 'none';
            });

            // Show selected view
            if(views[tabName]) {
                views[tabName].style.display = 'block';
            }
        });
    });

    // Initial render of state
    App.Store.setCurrentLocation('Manila'); // Triggers first render
    App.Store.switchUser(state.currentUser.id); // Trigger RBAC UI updates initially
});
