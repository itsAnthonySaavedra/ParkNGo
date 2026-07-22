window.App = window.App || {};

window.App.Staff = (function() {
    let staffBody, currentStaffLocationLabel, addStaffForm;

    function init() {
        staffBody = document.getElementById('staffBody');
        currentStaffLocationLabel = document.getElementById('currentStaffLocationLabel');
        addStaffForm = document.getElementById('addStaffForm');

        App.Store.subscribe(render);

        if(addStaffForm) {
            addStaffForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('staffName').value;
                const role = document.getElementById('staffRole').value;
                
                const state = App.Store.getState();
                App.Store.addStaff(state.currentLocation, name, role);
                App.Notifications.show('Staff Added', `Successfully added ${name} as ${role} to ${state.currentLocation}`, 'success');
                addStaffForm.reset();
            });
        }
    }

    function render(state) {
        if(currentStaffLocationLabel) currentStaffLocationLabel.textContent = `${state.currentLocation} Branch`;
        
        if(staffBody) {
            staffBody.innerHTML = '';
            const staffList = state.staff[state.currentLocation] || [];
            
            if(staffList.length === 0) {
                staffBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-light);">No staff found for this branch.</td></tr>`;
            } else {
                staffList.forEach(person => {
                    const statusClass = person.status === 'Active' ? 'in-stock' : 'low-stock';
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><strong>${person.name}</strong></td>
                        <td>${person.role}</td>
                        <td><span class="status-badge ${statusClass}">${person.status}</span></td>
                        <td>
                            <button class="action-btn" title="Edit Staff"><i class="ph ph-pencil-simple"></i></button>
                        </td>
                    `;
                    staffBody.appendChild(tr);
                });
            }
        }
    }

    return { init };
})();
