window.App = window.App || {};

window.App.Notifications = (function() {
    let notificationsWrapper = null;

    function init() {
        notificationsWrapper = document.getElementById('notificationsWrapper');
    }

    function show(title, message, type = "default") {
        if (!notificationsWrapper) init();

        const notification = document.createElement('div');
        notification.className = 'notification';
        
        let icon = "🔔";
        if(type === "error") icon = "⚠️";
        if(type === "sync" || type === "success") icon = "✅";

        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;

        notificationsWrapper.appendChild(notification);

        // Close Button Event
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.add('closing');
            setTimeout(() => {
                notification.remove();
            }, 400); 
        });

        // Auto dismiss
        setTimeout(() => {
            if(notification.parentNode) {
                notification.classList.add('closing');
                setTimeout(() => {
                    if(notification.parentNode) notification.remove();
                }, 400);
            }
        }, 5000);
    }

    return {
        init,
        show
    };
})();
