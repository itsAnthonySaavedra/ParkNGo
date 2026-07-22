window.App = window.App || {};

window.App.Inventory = (function() {
    let inventoryBody, currentLocationLabel, updateForm, itemSelect;
    let updatePriceForm, priceItemSelect;
    
    let sortColumn = 'item';
    let sortDirection = 'asc';

    function init() {
        inventoryBody = document.getElementById('inventoryBody');
        currentLocationLabel = document.getElementById('currentLocationLabel');
        updateForm = document.getElementById('updateForm');
        itemSelect = document.getElementById('itemSelect');
        
        updatePriceForm = document.getElementById('updatePriceForm');
        priceItemSelect = document.getElementById('priceItemSelect');

        // Subscribe to state changes
        App.Store.subscribe(render);

        // Bind sorting events
        document.querySelectorAll('.sortable').forEach(th => {
            th.addEventListener('click', (e) => {
                const col = e.currentTarget.getAttribute('data-sort');
                if (sortColumn === col) {
                    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    sortColumn = col;
                    sortDirection = 'asc';
                }
                render(App.Store.getState());
            });
        });

        // Bind update stock form
        if (updateForm) {
            updateForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const action = document.getElementById('actionSelect').value;
                const quantity = parseInt(document.getElementById('quantityInput').value);
                const item = itemSelect.value;
                
                const state = App.Store.getState();
                
                if (App.Store.updateInventory(state.currentLocation, item, action, quantity)) {
                    App.Notifications.show('Inventory Updated', `Successfully updated stock for ${item}`, 'success');
                    updateForm.reset();
                }
            });
        }

        // Bind update price form
        if (updatePriceForm) {
            updatePriceForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newPrice = parseFloat(document.getElementById('priceInput').value);
                const item = priceItemSelect.value;
                
                const state = App.Store.getState();
                
                if (App.Store.updatePrice(state.currentLocation, item, newPrice)) {
                    App.Notifications.show('Price Updated', `Successfully set new price for ${item}`, 'success');
                    updatePriceForm.reset();
                }
            });
        }

        if (inventoryBody) {
            inventoryBody.addEventListener('click', (e) => {
                const btn = e.target.closest('.edit-btn');
                if(btn) {
                    const itemName = btn.getAttribute('data-item');
                    itemSelect.value = itemName;
                    document.getElementById('actionSelect').value = 'add';
                    document.getElementById('quantityInput').focus();
                }
            });
        }
    }

    function render(state) {
        if (!inventoryBody) return;
        
        currentLocationLabel.textContent = `${state.currentLocation} Branch`;
        inventoryBody.innerHTML = '';
        
        let currentData = [...(state.inventory[state.currentLocation] || [])];

        // Apply Sorting
        currentData.sort((a, b) => {
            let valA = a[sortColumn];
            let valB = b[sortColumn];

            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        currentData.forEach(item => {
            const statusClass = item.status === 'Low Stock' ? 'low-stock' : 'in-stock';
            const formattedPrice = item.price !== undefined ? `₱${item.price.toFixed(2)}` : '₱0.00';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.item}</strong></td>
                <td>${item.category}</td>
                <td><strong>${item.quantity}</strong></td>
                <td>${formattedPrice}</td>
                <td>${item.unit}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                <td>
                    <button class="action-btn edit-btn" data-item="${item.item}" title="Edit Item"><i class="ph ph-pencil-simple"></i></button>
                </td>
            `;
            inventoryBody.appendChild(tr);
        });

        // Update item select dropdowns
        const updateDropdown = (selectEl) => {
            if(!selectEl) return;
            const currentVal = selectEl.value;
            selectEl.innerHTML = '<option value="" disabled selected>Select an item...</option>';
            currentData.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.item;
                opt.textContent = item.item;
                selectEl.appendChild(opt);
            });
            if(currentVal) selectEl.value = currentVal;
        };

        updateDropdown(itemSelect);
        updateDropdown(priceItemSelect);
    }

    return { init };
})();
