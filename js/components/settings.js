window.App = window.App || {};

window.App.Settings = (function() {
    let settingsForm;

    function init() {
        settingsForm = document.getElementById('settingsForm');
        const autoReportsForm = document.getElementById('autoReportsForm');
        const autoReportsToggle = document.getElementById('autoReportsToggle');
        const autoReportsConfig = document.getElementById('autoReportsConfig');

        App.Store.subscribe(render);

        if(settingsForm) {
            settingsForm.addEventListener('change', (e) => {
                if(e.target.type === 'checkbox') {
                    App.Store.updateSettings(e.target.name, e.target.checked);
                    App.Notifications.show('Settings Updated', `Your preferences have been saved.`, 'sync');
                }
            });
        }

        if(autoReportsForm && autoReportsToggle && autoReportsConfig) {
            autoReportsToggle.addEventListener('change', (e) => {
                autoReportsConfig.style.display = e.target.checked ? 'flex' : 'none';
                if(!e.target.checked) {
                    const currentSettings = App.Store.getState().settings.automatedReports || {};
                    App.Store.updateSettings('automatedReports', { ...currentSettings, enabled: false });
                    App.Notifications.show('Automated Reports', 'Automated reports have been disabled.', 'sync');
                }
            });

            autoReportsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const freq = document.getElementById('autoReportsFreq').value;
                const email = document.getElementById('autoReportsEmail').value;
                
                App.Store.updateSettings('automatedReports', { enabled: true, frequency: freq, email: email });
                App.Notifications.show('Reports Scheduled', `${freq} summary reports will be sent to ${email}`, 'success');
            });
        }
    }

    function render(state) {
        if(settingsForm) {
            const settings = state.settings;
            if(settingsForm.elements['emailAlerts']) settingsForm.elements['emailAlerts'].checked = settings.emailAlerts;
            if(settingsForm.elements['smsAlerts']) settingsForm.elements['smsAlerts'].checked = settings.smsAlerts;
            if(settingsForm.elements['autoSync']) settingsForm.elements['autoSync'].checked = settings.autoSync;
        }

        const autoReportsToggle = document.getElementById('autoReportsToggle');
        const autoReportsConfig = document.getElementById('autoReportsConfig');
        const autoReportsFreq = document.getElementById('autoReportsFreq');
        const autoReportsEmail = document.getElementById('autoReportsEmail');

        if(autoReportsToggle && state.settings.automatedReports) {
            const rptSettings = state.settings.automatedReports;
            autoReportsToggle.checked = rptSettings.enabled;
            autoReportsConfig.style.display = rptSettings.enabled ? 'flex' : 'none';
            if (rptSettings.frequency) autoReportsFreq.value = rptSettings.frequency;
            if (rptSettings.email) autoReportsEmail.value = rptSettings.email;
        }
    }

    return { init };
})();
