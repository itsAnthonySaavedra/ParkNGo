window.App = window.App || {};

window.App.Reports = (function() {
    let generateBtn, timeframeSelect, reportTemplate;

    function init() {
        generateBtn = document.getElementById('generateReportBtn');
        timeframeSelect = document.getElementById('reportTimeframe');
        reportTemplate = document.getElementById('reportTemplate');

        if (generateBtn) {
            generateBtn.addEventListener('click', generatePDF);
        }
    }

    function generatePDF() {
        if (typeof html2pdf === 'undefined') {
            App.Notifications.show('Error', 'PDF library not loaded.', 'error');
            return;
        }

        const timeframe = timeframeSelect.value;
        const state = App.Store.getState();
        const location = state.currentLocation;
        const inventory = state.inventory[location] || [];
        const staff = state.staff[location] || [];

        // Basic stats
        const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
        const lowStockItems = inventory.filter(i => i.status === 'Low Stock');
        const activeStaff = staff.filter(s => s.status === 'Active').length;

        // Populate Template
        reportTemplate.innerHTML = `
            <div style="border-bottom: 2px solid #C8A97E; padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="color: #3F332A; font-family: 'Playfair Display', serif; margin: 0 0 10px 0;">GlutenTag Summary Report</h1>
                <p style="color: #8C7A6B; margin: 0;"><strong>Branch:</strong> ${location}</p>
                <p style="color: #8C7A6B; margin: 0;"><strong>Timeframe:</strong> ${timeframe}</p>
                <p style="color: #8C7A6B; margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h2 style="color: #3F332A; font-family: 'Playfair Display', serif; border-bottom: 1px solid #eee; padding-bottom: 10px;">Inventory Overview</h2>
                <div style="display: flex; gap: 20px; margin-top: 20px;">
                    <div style="flex: 1; background: #FAF6F0; padding: 20px; border-radius: 8px;">
                        <h3 style="margin: 0 0 10px 0; color: #8C7A6B; font-size: 14px;">Total Items in Stock</h3>
                        <p style="margin: 0; font-size: 24px; font-weight: bold; color: #3F332A;">${totalItems}</p>
                    </div>
                    <div style="flex: 1; background: #FEEBC8; padding: 20px; border-radius: 8px;">
                        <h3 style="margin: 0 0 10px 0; color: #C05621; font-size: 14px;">Low Stock Alerts</h3>
                        <p style="margin: 0; font-size: 24px; font-weight: bold; color: #C05621;">${lowStockItems.length}</p>
                    </div>
                </div>
            </div>

            ${lowStockItems.length > 0 ? `
            <div style="margin-bottom: 30px;">
                <h3 style="color: #3F332A; font-family: 'Playfair Display', serif;">Items Needing Restock</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background: #FAF6F0;">
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Category</th>
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Current Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lowStockItems.map(item => `
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.item}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.category}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #C05621; font-weight: bold;">${item.quantity} ${item.unit}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ` : '<p style="color: #6BA885; font-weight: bold;">All inventory levels are optimal.</p>'}

            <div style="margin-bottom: 30px;">
                <h2 style="color: #3F332A; font-family: 'Playfair Display', serif; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 40px;">Staff Overview</h2>
                <p style="margin-top: 10px;"><strong>Active Staff Members:</strong> ${activeStaff}</p>
                <ul style="list-style-type: none; padding: 0;">
                    ${staff.map(s => `
                        <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                            <strong>${s.name}</strong> - ${s.role} (${s.status})
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div style="margin-top: 50px; text-align: center; color: #8C7A6B; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
                <p>Generated automatically by GlutenTag Inventory System.</p>
            </div>
        `;

        // Temporarily display to render, then hide
        reportTemplate.style.display = 'block';
        
        App.Notifications.show('Generating Report', 'Please wait while your PDF is being generated...', 'success');

        const opt = {
            margin:       0.5,
            filename:     `GlutenTag-${location}-${timeframe}-Report.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(reportTemplate).save().then(() => {
            reportTemplate.style.display = 'none';
        }).catch(err => {
            console.error(err);
            reportTemplate.style.display = 'none';
            App.Notifications.show('Error', 'Failed to generate PDF.', 'error');
        });
    }

    return { init };
})();
