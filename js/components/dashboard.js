window.App = window.App || {};

window.App.Dashboard = (function() {
    let totalItemsCount, lowStockCount;

    function init() {
        totalItemsCount = document.getElementById('totalItemsCount');
        lowStockCount = document.getElementById('lowStockCount');

        App.Store.subscribe(render);
    }

    function render(state) {
        let totalItems = 0;
        let lowStock = 0;
        
        const currentData = state.inventory[state.currentLocation] || [];
        
        currentData.forEach(item => {
            totalItems += item.quantity;
            if(item.status === 'Low Stock') {
                lowStock++;
            }
        });

        totalItemsCount.textContent = totalItems;
        lowStockCount.textContent = lowStock;
    }

    return { init };
})();
