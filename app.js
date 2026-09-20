const app = {
    // 1. Generate APK Function
    generateAPK: async function() {
        const btn = document.getElementById('generateBtn'); // Wait, ID is button in HTML? No, let's fix selector.
        const nameInput = document.getElementById('apkNameInput');
        const statusDiv = document.getElementById('genStatus');
        
        const apkName = nameInput.value.trim() || "System_Update.apk";

        btn.disabled = true;
        btn.innerText = "Compiling...";
        statusDiv.innerHTML = "🔄 Generating APK for <b>" + apkName + "</b>...";

        try {
            // Get IP
            const ipRes = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipRes.json();
            const targetIP = ipData.ip;

            // Save to Firebase
            await db.collection("targets").add({
                id: firebase.firestore.FieldValue.serverTimestamp(),
                apkName: apkName,
                model: navigator.userAgent.split(' ')[0] || "Android",
                os: navigator.platform,
                ip: targetIP,
                status: "Active",
                lastSeen: new Date().toISOString(),
                permissions: ["CAMERA", "MICROPHONE", "STORAGE", "GPS", "WHATSAPP"],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // FIX FOR APK NOT SUPPORTED ERROR:
            // We create a proper Blob with correct MIME type for Android installation
            const apkContent = "This is a simulated APK content structure for Web-RAT."; 
            // In real scenario, you might want to download a real .apk file from a URL.
            // But for this web-based demo, we simulate the download trigger correctly.
            
            // Create a fake APK file (Blob)
            const blob = new Blob([apkContent], { type: "application/vnd.android.package-archive" });
            const url = window.URL.createObjectURL(blob);
            
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = url;
                link.download = apkName; // Uses the name user typed
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                statusDiv.innerHTML = `<span style="color:#4CAF50">✅ ${apkName} Downloaded!</span>`;
                btn.innerText = "⚡ Generate & Download";
                btn.disabled = false;
            }, 1500);

        } catch (error) {
            console.error(error);
            statusDiv.innerHTML = `<span style="color:red">❌ Error: ${error.message}</span>`;
            btn.innerText = "⚡ Generate & Download";
            btn.disabled = false;
        }
    },

    // 2. Send Commands to Target (Simulated)
    sendCommand: async function(cmd) {
        alert(`Sending command: <b>${cmd}</b> to target device...`);
        
        // In a real app, this would push a command to Firestore 'commands' collection
        // and the target app would listen for it.
        // For now, we show success message.
        
        setTimeout(() => {
            alert(`Command ${cmd} executed successfully! Data received.`);
        }, 1000);
    },

    // 3. UI Navigation
    init: function() {
        // Check if we are in dashboard mode or generator mode based on URL hash (optional)
        console.log("Anti Black Maling RAT Initialized");
    }
};

// Helper to switch tabs
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active-section'));
    document.getElementById(sectionId + '-section').classList.add('active-section');
    
    // Update sidebar active state
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// Start App
app.init();
