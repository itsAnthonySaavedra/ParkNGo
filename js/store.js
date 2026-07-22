window.App = window.App || {};

window.App.Store = (function() {
    // Initial State
    let state = {
        currentUser: { id: 'u2', name: 'Owner', role: 'Owner' },
        users: [
            { id: 'u1', name: 'IT Staff', role: 'IT' },
            { id: 'u2', name: 'Owner', role: 'Owner' },
            { id: 'u3', name: 'Branch Manager', role: 'Branch Manager', branch: 'Manila' }
        ],
        currentLocation: "Manila",
        locations: [
            { id: 1, name: "Manila", business: "Park n Go", address: "123 Roxas Blvd", contact: "02-8123-4567" },
            { id: 2, name: "Quezon City", business: "Judel's Cafe", address: "45 Tomas Morato Ave", contact: "02-8987-6543" },
            { id: 3, name: "Davao City", business: "Park n Go", address: "88 J.P. Laurel Ave", contact: "082-221-3456" },
            { id: 4, name: "Cebu City", business: "Judel's Cafe", address: "10 Osmeña Blvd", contact: "032-253-1234" }
        ],
        inventory: {
            "Manila": [
                { id: 1, item: "Flour", category: "Dry Goods", quantity: 20, unit: "5kg bags", price: 250.00, status: "In Stock" },
                { id: 2, item: "Sugar", category: "Dry Goods", quantity: 2, unit: "5kg bags", price: 320.00, status: "Low Stock" },
                { id: 3, item: "Yeast", category: "Baking Essentials", quantity: 8, unit: "500g packs", price: 150.00, status: "In Stock" },
                { id: 4, item: "Butter", category: "Dairy", quantity: 15, unit: "1kg blocks", price: 550.00, status: "In Stock" },
                { id: 5, item: "Eggs", category: "Dairy", quantity: 1, unit: "trays", price: 220.00, status: "Low Stock" }
            ],
            "Quezon City": [
                { id: 1, item: "Flour", category: "Dry Goods", quantity: 15, unit: "5kg bags", price: 250.00, status: "In Stock" },
                { id: 2, item: "Sugar", category: "Dry Goods", quantity: 10, unit: "5kg bags", price: 320.00, status: "In Stock" },
                { id: 3, item: "Yeast", category: "Baking Essentials", quantity: 2, unit: "500g packs", price: 150.00, status: "Low Stock" }
            ],
            "Davao City": [
                { id: 1, item: "Flour", category: "Dry Goods", quantity: 5, unit: "5kg bags", price: 255.00, status: "Low Stock" },
                { id: 2, item: "Sugar", category: "Dry Goods", quantity: 20, unit: "5kg bags", price: 325.00, status: "In Stock" }
            ],
            "Cebu City": [
                { id: 1, item: "Flour", category: "Dry Goods", quantity: 12, unit: "5kg bags", price: 245.00, status: "In Stock" },
                { id: 2, item: "Sugar", category: "Dry Goods", quantity: 14, unit: "5kg bags", price: 315.00, status: "In Stock" }
            ]
        },
        staff: {
            "Manila": [
                { id: 1, name: "Maria Santos", role: "Manager", status: "Active" },
                { id: 2, name: "Juan Dela Cruz", role: "Baker", status: "Active" },
                { id: 3, name: "Ana Reyes", role: "Cashier", status: "Off Duty" }
            ],
            "Quezon City": [
                { id: 4, name: "Pedro Gomez", role: "Manager", status: "Active" },
                { id: 5, name: "Luis Garcia", role: "Baker", status: "Active" }
            ],
            "Davao City": [],
            "Cebu City": []
        },
        settings: {
            emailAlerts: true,
            smsAlerts: false,
            autoSync: true,
            automatedReports: { enabled: false, frequency: 'Weekly', email: '' }
        }
    };

    // Observers for state changes
    const listeners = [];

    function subscribe(listener) {
        listeners.push(listener);
    }

    function notify() {
        listeners.forEach(listener => listener(state));
    }

    return {
        getState: () => state,
        
        setCurrentLocation: (location) => {
            // Branch managers cannot change location away from their assigned branch
            if (state.currentUser.role === 'Branch Manager' && state.currentUser.branch !== location) {
                return;
            }
            state.currentLocation = location;
            notify();
        },
        
        updateInventory: (location, itemSelect, action, quantity) => {
            const items = state.inventory[location];
            const item = items.find(i => i.item === itemSelect);
            if(item) {
                if(action === 'add') item.quantity += quantity;
                if(action === 'deduct') item.quantity = Math.max(0, item.quantity - quantity);
                
                item.status = item.quantity <= 5 ? "Low Stock" : "In Stock";
                notify();
                return true;
            }
            return false;
        },
        
        updatePrice: (location, itemSelect, newPrice) => {
            const items = state.inventory[location];
            const item = items.find(i => i.item === itemSelect);
            if (item && newPrice >= 0) {
                item.price = newPrice;
                notify();
                return true;
            }
            return false;
        },

        addLocation: (name, address, contact) => {
            const newId = state.locations.length + 1;
            state.locations.push({ id: newId, name, address, contact });
            state.inventory[name] = []; // Empty inventory for new location
            state.staff[name] = []; // Empty staff
            notify();
        },

        addStaff: (location, name, role) => {
            if(!state.staff[location]) state.staff[location] = [];
            const newId = Math.floor(Math.random() * 10000);
            state.staff[location].push({ id: newId, name, role, status: "Active" });
            notify();
        },

        updateSettings: (key, value) => {
            state.settings[key] = value;
            notify();
        },

        switchUser: (userId) => {
            const user = state.users.find(u => u.id === userId);
            if (user) {
                state.currentUser = user;
                if (user.role === 'Branch Manager' && user.branch) {
                    state.currentLocation = user.branch;
                }
                notify();
            }
        },

        subscribe
    };
})();
