// Assuming __dirname is the root where index.html is located
const getExtensionRoot = () => __dirname;

async function checkForUpdates(isManual = false) {
    try {
        const fs = require('fs');
        const path = require('path');
        const extensionRoot = getExtensionRoot();
        
        console.log("Checking for updates...");
        // 1. Get current version from package.json
        const packageJsonPath = path.join(extensionRoot, 'package.json');
        let currentVersion = '1.0.0';
        if (fs.existsSync(packageJsonPath)) {
            const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            if (pkg.version) currentVersion = pkg.version;
        }

        // 2. Fetch latest version from Firestore
        const db = firebase.firestore();
        const docRef = db.collection('system').doc('plugin_info');
        const doc = await docRef.get();

        if (doc.exists) {
            const data = doc.data();
            const latestVersion = data.latestVersion;
            const downloadUrl = data.downloadUrl;

            console.log(`Current version: ${currentVersion}, Latest version: ${latestVersion}`);

            if (latestVersion && isNewerVersion(currentVersion, latestVersion) && downloadUrl) {
                window.pendingUpdateUrl = downloadUrl;
                window.pendingUpdateVersion = latestVersion;
                
                document.getElementById('update-prompt-version').innerText = `v${latestVersion} Available`;
                document.getElementById('update-prompt-modal').style.display = 'flex';
                // small timeout to allow display: flex to apply before opacity transition
                setTimeout(() => { document.getElementById('update-prompt-modal').style.opacity = '1'; }, 10);
                
                document.getElementById('btn-update-now').onclick = async () => {
                    require('child_process').exec('start bluebirdhub://');
                    document.getElementById('update-prompt-modal').style.opacity = '0';
                    setTimeout(async () => {
                        document.getElementById('update-prompt-modal').style.display = 'none';
                    }, 300);
                };
                
                document.getElementById('btn-update-skip').onclick = () => {
                    document.getElementById('update-prompt-modal').style.opacity = '0';
                    setTimeout(() => {
                        document.getElementById('update-prompt-modal').style.display = 'none';
                        if (window.updateSettingsButtonForPending) {
                            window.updateSettingsButtonForPending(latestVersion);
                        }
                    }, 300);
                };
            } else {
                console.log("Plugin is up to date.");
                if (isManual) {
                    if (window.showCustomAlert) {
                        window.showCustomAlert(`คุณกำลังใช้งานเวอร์ชันใหม่ล่าสุดแล้ว! (v${currentVersion})`, 'success');
                    } else {
                        alert(`✅ คุณกำลังใช้งานเวอร์ชันใหม่ล่าสุดแล้ว! (v${currentVersion})`);
                    }
                }
            }
        } else {
            console.log("No update info found in Firestore.");
        }
    } catch (error) {
        console.error("Failed to check for updates:", error);
        if (isManual) {
            if (window.showCustomAlert) {
                window.showCustomAlert("ไม่สามารถตรวจสอบอัปเดตได้ในขณะนี้ โปรดลองใหม่ภายหลัง", 'error');
            } else {
                alert("❌ ไม่สามารถตรวจสอบอัปเดตได้ในขณะนี้ โปรดลองใหม่ภายหลัง");
            }
        }
    }
}

function isNewerVersion(current, latest) {
    const c = current.split('.').map(Number);
    const l = latest.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
        const cv = c[i] || 0;
        const lv = l[i] || 0;
        if (lv > cv) return true;
        if (lv < cv) return false;
    }
    return false;
}

async function downloadAndApplyUpdate(url, newVersion) {
    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    const axios = require('axios');
    const AdmZip = require('adm-zip');
    const extensionRoot = getExtensionRoot();

    const statusText = document.getElementById('update-status');
    const progressBar = document.getElementById('update-progress-bar');
    const percentText = document.getElementById('update-percent');
    
    const zipPath = path.join(os.tmpdir(), `bluebird-update-${Date.now()}.zip`);

    try {
        statusText.innerText = "กำลังดาวน์โหลดไฟล์อัปเดต...";
        
        // Download Zip
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        const totalLength = response.headers['content-length'];
        let downloaded = 0;

        const writer = fs.createWriteStream(zipPath);

        response.data.on('data', (chunk) => {
            downloaded += chunk.length;
            if (totalLength) {
                const percent = Math.round((downloaded / totalLength) * 100);
                progressBar.style.width = `${percent}%`;
                percentText.innerText = `${percent}%`;
            }
        });

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Extract Zip
        statusText.innerText = "กำลังติดตั้งอัปเดต...";
        progressBar.style.width = "100%";
        percentText.innerText = "Extracting...";

        // Add small delay for UI to update
        await new Promise(resolve => setTimeout(resolve, 500));

        const zip = new AdmZip(zipPath);
        
        // 1. Clean up any previous .old files (now that they are unlocked)
        function cleanOldFiles(dir) {
            try {
                const files = fs.readdirSync(dir);
                for (const file of files) {
                    const fullPath = path.join(dir, file);
                    if (fs.statSync(fullPath).isDirectory()) {
                        cleanOldFiles(fullPath);
                    } else if (fullPath.endsWith('.old')) {
                        try { fs.unlinkSync(fullPath); } catch(e){}
                    }
                }
            } catch(e){}
        }
        cleanOldFiles(extensionRoot);

        // 2. Rename existing files to .old to bypass Windows EBUSY file lock
        zip.getEntries().forEach(function(zipEntry) {
            if (!zipEntry.isDirectory) {
                let targetPath = path.join(extensionRoot, zipEntry.entryName);
                if (fs.existsSync(targetPath)) {
                    try {
                        fs.renameSync(targetPath, targetPath + '.old');
                    } catch (e) {}
                }
            }
        });

        // 3. Extract all files (will write fresh files since originals are renamed)
        zip.extractAllTo(extensionRoot, true);

        // Update package.json version
        const packageJsonPath = path.join(extensionRoot, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            pkg.version = newVersion;
            fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
        }

        statusText.innerText = "ติดตั้งสำเร็จ! กำลังรีสตาร์ท...";
        
        // Cleanup temp zip
        if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
        }

        // Add small delay before reload
        setTimeout(() => {
            window.location.reload(true);
        }, 1500);

    } catch (error) {
        console.error("Update failed:", error);
        statusText.innerText = "การอัปเดตล้มเหลว: " + (error.message || "เกิดข้อผิดพลาด");
        statusText.style.color = "#ef4444";
        
        // Hide modal after 3 seconds on error
        setTimeout(() => {
            document.getElementById('update-modal').style.display = 'none';
        }, 3000);
    }
}
