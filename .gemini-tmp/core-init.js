const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const csInterface = new CSInterface();



csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, syncThemeColor);

let allFiles = [];
let currentSelectedDir = null;
let selectedPathToConfirm = "";

let folderColors = {};
try {
    folderColors = JSON.parse(bluebirdStorage.getItem('bluebird_folder_colors')) || {};
} catch (e) { }

let audioPlayer = new Audio();
let currentPlayingFile = null;
let animationFrameId;

let audioCtx = null;
let originalAudioBuffer = null;
let reversedBlobUrl = null;



window.previewQueue = [];
window.isGenerating = false;
window.stopRequested = false;

const svgFolderIcon = `<svg class="folder-svg" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`;

const resizer = document.getElementById('resizer');
const sidebar = document.getElementById('sidebar');
let isResizing = false;
resizer.addEventListener('mousedown', () => { isResizing = true; resizer.classList.add('resizing'); document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none'; });

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    let newWidth = e.clientX;
    if (newWidth < 200) newWidth = 200;
    if (newWidth > 500) newWidth = 500;
    sidebar.style.width = newWidth + 'px';

    const currentSize = document.getElementById('size-slider').value;
    changeGridSize(currentSize);

    if (document.getElementById('audio-player-panel').style.display === 'flex') {
        drawWaveform();
    }
});
document.addEventListener('mouseup', () => { if (isResizing) { isResizing = false; resizer.classList.remove('resizing'); document.body.style.cursor = 'default'; document.body.style.userSelect = ''; } });

window.addEventListener('resize', () => {
    const currentSize = document.getElementById('size-slider').value;
    changeGridSize(currentSize);
    if (document.getElementById('audio-player-panel').style.display === 'flex') {
        drawWaveform();
    }
});



window.onload = () => {
    syncThemeColor();
    loadSavedFolders();
    setupAudioPlayer();
    audioPlayer.volume = 0.5;
    updateSliderFill(document.getElementById('volume-slider'));
};

// 🌟 CSS สำหรับเฟดอินคลื่นเสียงแบบ Cinematic (เฟดจากสีดำ)
if (!document.getElementById('bluebird-v27-styles')) {
    
}

let lastAudioBuffer = null;





































































// 🌟 เรดาร์สแกนหา aerender.exe แบบอัตโนมัติ (อัปเกรดสแกนหลายไดรฟ์) 🌟




let contextTarget = null;

document.addEventListener('click', (e) => {
    if (!e.target.closest('.contextmenu')) {
        const menu = document.getElementById('context-menu');
        if (menu) menu.style.display = 'none';
    }
});











// 🌟 Blue Bird Smart Theme Adjuster 🌟
var myCsInterface = new CSInterface();



// สั่งให้ทำงานทันทีตอนเปิดปลั๊กอิน (หน่วงเวลาไว้เผื่อระบบโหลด)
setTimeout(applyCustomDarkTheme, 100);

// สั่งให้คอยดักฟังเวลาผู้ใช้เปลี่ยนสีในตั้งค่า Premiere Pro
myCsInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, applyCustomDarkTheme);
// 🚫 ระบบป้องกันเมนูคลิกขวา และอนุญาตให้คลิกขวาที่การ์ด/ไฟล์ 🚫
document.addEventListener('contextmenu', function (e) {
    if (!e.target.closest('.folder-label') &&
        !e.target.closest('.file-label') &&
        !e.target.closest('.card') &&
        !e.target.closest('.contextmenu')) {
        e.preventDefault();
    }
});

// 🌟 ระบบดาวแบบสมูท (กรองทั้งโปรแกรม) 🌟
let favorites = JSON.parse(bluebirdStorage.getItem('bluebird_favorites')) || [];
let showOnlyFavorites = false;







// 🎨 โหลดโฟลเดอร์ (ไม่มีรายการโปรด + มีพื้นหลังโปร่งใส) 🎨
// 🎨 โหลดโฟลเดอร์ (ล็อคสีไม่ให้หายตอนกดไฟล์) 🎨
// 🌟 6. ฟังก์ชันจัดการไลบรารี่ (สร้าง, ล็อค, เปลี่ยนชื่อ) 🌟






// 🌟 7. เขียนทับระบบโหลดโฟลเดอร์ (อัปเกรดให้รองรับ Multi-Library) 🌟
loadSavedFolders = function () {
    let savedFolders = [];
    try { savedFolders = JSON.parse(bluebirdStorage.getItem('bluebird_folders')) || []; } catch (e) { }

    // ระบบแปลงโครงสร้างเก่าให้รองรับไลบรารี่อัตโนมัติ (ถ้าเปิดมาไม่มีไลบรารี่เลย มันจะสร้างให้ 1 อัน)
    if (savedFolders.length === 0 || typeof savedFolders[0] === 'string') {
        savedFolders.unshift({ type: 'library', id: 'lib_init', name: 'MY LIBRARY', locked: false });
        bluebirdStorage.setItem('bluebird_folders', JSON.stringify(savedFolders));
    }

    const menu = document.getElementById('folder-list');
    menu.innerHTML = '';
    allFiles = [];

    let currentLibLocked = false; // ตัวแปรคอยเช็คว่าโซนที่เรากำลังดูอยู่ ล็อคอยู่ไหม

    savedFolders.forEach(item => {
        const rootNode = document.createElement('div');
        rootNode.className = 'tree-root';

        // เช็คว่าไอเทมนี้คือ "ไลบรารี่(แถบดำ)" หรือ "โฟลเดอร์ธรรมดา"
        const isLibrary = (item && item.type === 'library');
        const targetId = isLibrary ? item.id : item;

        // อัปเดตสถานะล็อค ถ้าตัวที่อ่านอยู่คือไลบรารี่
        if (isLibrary) currentLibLocked = item.locked;

        // 🚀 ระบบลากสลับตำแหน่ง (Drag & Drop) 🚀
        // ถ้าโซนนี้ล็อคอยู่ จะไม่อนุญาตให้ลาก
        rootNode.draggable = !(isLibrary ? item.locked : currentLibLocked);

        rootNode.addEventListener('dragstart', function (e) {
            if (showOnlyFavorites || (isLibrary ? item.locked : currentLibLocked)) { e.preventDefault(); return; }
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', targetId);
            this.classList.add('dragging');
        });

        rootNode.addEventListener('dragend', function () {
            this.classList.remove('dragging');
            document.querySelectorAll('.tree-root').forEach(el => el.classList.remove('drag-over-top', 'drag-over-bottom'));
        });

        rootNode.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const targetEl = this.querySelector(isLibrary ? '.menu-title' : '.folder-label');
            if (!targetEl) return;
            const bounding = targetEl.getBoundingClientRect();
            const offset = bounding.y + (bounding.height / 2);
            if (e.clientY - offset > 0) {
                this.classList.add('drag-over-bottom');
                this.classList.remove('drag-over-top');
            } else {
                this.classList.add('drag-over-top');
                this.classList.remove('drag-over-bottom');
            }
        });

        rootNode.addEventListener('dragleave', function () {
            this.classList.remove('drag-over-top', 'drag-over-bottom');
        });

        rootNode.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('drag-over-top', 'drag-over-bottom');
            const draggedId = e.dataTransfer.getData('text/plain');
            if (draggedId === targetId) return;

            let savedList = JSON.parse(bluebirdStorage.getItem('bluebird_folders')) || [];

            const targetEl = this.querySelector(isLibrary ? '.menu-title' : '.folder-label');
            if (!targetEl) return;
            const bounding = targetEl.getBoundingClientRect();
            const dropAfter = (e.clientY - (bounding.y + (bounding.height / 2)) > 0);

            // ตรวจสอบว่ากำลังลากของไปใส่โซนที่ล็อคอยู่หรือไม่
            let checkTargetIndex = savedList.findIndex(p => (p.type === 'library' ? p.id : p) === targetId);
            if (dropAfter) checkTargetIndex++;
            let destLocked = false;
            for (let i = 0; i < checkTargetIndex; i++) {
                if (savedList[i] && savedList[i].type === 'library') destLocked = savedList[i].locked;
            }

            // ถ้าโซนปลายทางล็อคอยู่ จะเด้งเตือนและห้ามวางเด็ดขาด
            if (destLocked && typeof savedList.find(p => (p.type === 'library' ? p.id : p) === draggedId) === 'string') {
                alert("🔒 ไม่สามารถย้ายโฟลเดอร์เข้าไปในไลบรารี่ที่ล็อคอยู่ได้ครับ");
                return;
            }

            // ดึงไอเทมที่ถูกลากออกมาชั่วคราว
            let draggedObj = savedList.find(p => (p.type === 'library' ? p.id : p) === draggedId);
            savedList = savedList.filter(p => (p.type === 'library' ? p.id : p) !== draggedId);

            // หาตำแหน่งใหม่ที่จะเสียบกลับเข้าไป
            let newTargetIndex = savedList.findIndex(p => (p.type === 'library' ? p.id : p) === targetId);
            if (dropAfter) newTargetIndex++;

            savedList.splice(newTargetIndex, 0, draggedObj);
            bluebirdStorage.setItem('bluebird_folders', JSON.stringify(savedList));
            loadSavedFolders();
        });

        // 🎨 เรนเดอร์ UI 🎨
        if (isLibrary) {
            // วาดไอคอนกุญแจล็อค และปุ่มเครื่องหมายบวก แบบมินิมอล (SVG)
            const lockSvg = item.locked
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>'
                : '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/></svg>';

            const plusSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>';

            rootNode.innerHTML = `
                        <div class="menu-title" title="ลากเพื่อสลับตำแหน่งไลบรารี่">
                            <span onclick="renameLibrary('${item.id}')" title="คลิกเพื่อเปลี่ยนชื่อ" style="flex:1; cursor:text; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.name}</span>
                            <div style="display:flex; gap: 8px; align-items:center;">
                                <span class="lib-action-btn" onclick="toggleLibLock('${item.id}')" title="ล็อค / ปลดล็อค">${lockSvg}</span>
                                <span class="lib-action-btn" onclick="addNewLibrary('${item.id}')" title="เพิ่มไลบรารี่ใหม่ด้านล่าง">${plusSvg}</span>
                            </div>
                        </div>
                    `;
            menu.appendChild(rootNode);
        }
        else {
            const dirPath = item;
            if (fs.existsSync(dirPath)) {
                const folderName = path.basename(dirPath);
                let ownColor = folderColors[dirPath] || '';
                let stripColor = ownColor || 'transparent';
                let bgColor = 'transparent';
                if (ownColor) {
                    let r = parseInt(ownColor.slice(1, 3), 16);
                    let g = parseInt(ownColor.slice(3, 5), 16);
                    let b = parseInt(ownColor.slice(5, 7), 16);
                    bgColor = `rgba(${r}, ${g}, ${b}, 0.2) !important`;
                }

                let isExpanded = expandedFolders.has(dirPath) || !expandedFolders.has(dirPath + "_init");
                let caretClass = isExpanded ? 'caret caret-down' : 'caret';
                if (isExpanded) {
                    expandedFolders.add(dirPath);
                    expandedFolders.add(dirPath + "_init");
                } else {
                    expandedFolders.add(dirPath + "_init");
                }

                rootNode.innerHTML = `
                            <div class="folder-label" data-path="${dirPath.replace(/"/g, '&quot;')}" style="border-left-color: ${stripColor}; background-color: ${bgColor}; padding-left: 12px;" oncontextmenu="showContextMenu(event, '${dirPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this, 'main-folder')">
                                <span class="${caretClass}" onclick="toggleNode(this)">▶</span>
                                ${svgFolderIcon}
                                <span class="folder-name" onclick="selectFolder('${dirPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this)">${folderName}</span>
                            </div>
                        `;

                const subUl = scanFolderRecursive(dirPath, 1, stripColor);
                if (showOnlyFavorites && !subUl) return;
                if (subUl) {
                    subUl.style.display = isExpanded ? 'block' : 'none';
                    rootNode.appendChild(subUl);
                }
                else { rootNode.querySelector('.caret').style.visibility = 'hidden'; }
                menu.appendChild(rootNode);
            }
        }
    });

    if (currentSelectedDir) {
        renderGrid();
        if (typeof changeGridSize === "function") changeGridSize(document.getElementById('size-slider').value);
    }
};

// 🎨 สแกนไฟล์ (กำกับคลิกขวา + กรองดาว) 🎨
scanFolderRecursive = function (dir, depth, parentColor) {
    try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        const ul = document.createElement('ul');
        ul.className = 'tree-children';
        ul.style.display = 'none';
        let hasContent = false;

        const mediaBaseNames = items.filter(i => !i.isDirectory() && i.name.match(/\.(mp4|mov|mogrt|wav|mp3)$/i)).map(i => path.basename(i.name, path.extname(i.name)).toLowerCase());
        const folders = items.filter(i => i.isDirectory() && i.name !== '_Blue Bird Previews');
        let files = items.filter(i => !i.isDirectory() && i.name.toLowerCase() !== '_album_cover.jpg');

        if (showOnlyFavorites) {
            files = files.filter(f => favorites.includes(path.join(dir, f.name)));
        }

        folders.forEach(item => {
            const fullPath = path.join(dir, item.name);
            const subUl = scanFolderRecursive(fullPath, depth + 1, parentColor);
            if (showOnlyFavorites && !subUl) return;

            hasContent = true;
            const li = document.createElement('li');
            li.className = 'tree-node';
            let ownColor = folderColors[fullPath] || '';
            let stripColor = ownColor || parentColor || 'transparent';
            let paddingLeft = 12 + (depth * 15);

            li.innerHTML = `
                        <div class="folder-label" data-path="${fullPath.replace(/"/g, '&quot;')}" style="border-left-color: ${stripColor}; padding-left: ${paddingLeft}px;" oncontextmenu="showContextMenu(event, '${fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this, 'sub-folder')">
                            <span class="caret" onclick="toggleNode(this)">▶</span>
                            ${svgFolderIcon}
                            <span class="folder-name" onclick="selectFolder('${fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this)">${item.name}</span>
                        </div>
                    `;
            if (subUl) li.appendChild(subUl); else li.querySelector('.caret').style.visibility = 'hidden';
            ul.appendChild(li);
        });

        files.forEach(item => {
            const fullPath = path.join(dir, item.name);
            const ext = path.extname(item.name).toLowerCase();
            const baseName = path.basename(item.name, ext).toLowerCase();
            let isMedia = false; let type = ''; let badgeClass = '';

            if (['.wav', '.mp3', '.mogrt', '.mp4', '.mov'].includes(ext)) {
                isMedia = true; type = (ext === '.mogrt') ? 'Graphics' : (['.mp4', '.mov'].includes(ext) ? 'Video' : 'Audio'); badgeClass = (ext === '.mogrt') ? 'badge mogrt' : (['.mp4', '.mov'].includes(ext) ? 'badge video' : 'badge audio');
            } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                if (!mediaBaseNames.includes(baseName)) { isMedia = true; type = 'Image'; badgeClass = 'badge image'; }
            }

            if (isMedia) {
                hasContent = true;
                const fileObj = { name: item.name, fullPath: fullPath, ext: ext, type: type, dir: dir };
                allFiles.push(fileObj);

                const li = document.createElement('li');
                li.className = 'tree-node';
                let paddingLeft = 12 + (depth * 15) + 18;
                const isFav = favorites.includes(fullPath);
                const starClass = isFav ? "star-icon active" : "star-icon";

                li.innerHTML = `
                            <div class="file-label" style="padding-left: ${paddingLeft}px;" title="${item.name}" oncontextmenu="showContextMenu(event, '${fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this, 'file')">
                                <span class="${starClass}" onclick="toggleFavorite('${fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', event)">★</span>
                                <span class="${badgeClass}" style="display: inline-block; width: 8px; height: 8px; min-width: 8px; padding: 0; border-radius: 2px; flex-shrink: 0; margin-right: 6px;"></span>
                                <span class="folder-name">${item.name}</span>
                            </div>
                        `;

                li.onclick = (e) => {
                    e.stopPropagation();
                    currentSelectedDir = dir;
                    document.querySelectorAll('.folder-label').forEach(el => el.classList.remove('active'));
                    const parentLabel = ul.previousElementSibling;
                    if (parentLabel && parentLabel.classList.contains('folder-label')) parentLabel.classList.add('active');
                    document.querySelectorAll('.file-label').forEach(el => el.classList.remove('active'));
                    li.querySelector('.file-label').classList.add('active');
                    document.getElementById('search').value = "";
                    renderGrid();

                    const allCards = document.querySelectorAll('.card');
                    let targetCard = null;
                    allCards.forEach(card => {
                        const titleEl = card.querySelector('.card-title');
                        if (titleEl && titleEl.getAttribute('title') === item.name) { targetCard = card; card.style.display = 'block'; } else { card.style.display = 'none'; }
                    });
                    if (typeof changeGridSize === "function") changeGridSize(document.getElementById('size-slider').value);
                    setTimeout(() => { if (targetCard) playAsset(fileObj, targetCard, true); }, 10);
                };
                li.ondblclick = (e) => { e.stopPropagation(); addSelectedToTimeline(); };
                ul.appendChild(li);
            }
        });
        return hasContent ? ul : null;
    } catch (e) { return null; }
};

// 🌟 ปั้นการ์ดฝั่งขวา (คลิกขวาที่การ์ด + ซ่อนดาว) 🌟
renderGrid = function () {
    const grid = document.getElementById('asset-grid');
    grid.innerHTML = '';
    const searchTerm = document.getElementById('search').value.toLowerCase().trim();

    if (!currentSelectedDir && searchTerm === '' && !showOnlyFavorites) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-light); margin-top: 40px;">โปรดเลือกโฟลเดอร์จากคลังสื่อ</p>';
        return;
    }

    let filtered = allFiles;
    if (showOnlyFavorites) {
        filtered = filtered.filter(file => favorites.includes(file.fullPath));
    } else if (currentSelectedDir) {
        filtered = filtered.filter(file => file.dir === currentSelectedDir);
    }
    if (searchTerm !== '') {
        filtered = filtered.filter(f => f.name.toLowerCase().includes(searchTerm));
    }

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-light); margin-top: 40px;">ไม่มีไฟล์ในรายการนี้</p>';
        return;
    }

    filtered.forEach(file => {
        const card = document.createElement('div');
        card.className = `card`;

        card.setAttribute('oncontextmenu', `showContextMenu(event, '${file.fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this, 'file')`);

        const previewDir = path.join(file.dir, '_Blue Bird Previews');
        const previewImg = path.join(previewDir, file.name + '.png');
        const hasPreview = fs.existsSync(previewImg);
        const isVideo = ['.mp4', '.mov'].includes(file.ext.toLowerCase());
        const isGraphic = file.ext.toLowerCase() === '.mogrt';
        const isImage = ['.jpg', '.jpeg', '.png'].includes(file.ext.toLowerCase());
        const hasScrub = isVideo || isGraphic;

        let bgStyle = '';
        if (isImage) bgStyle = `background-image: url('file:///${hasPreview ? previewImg.replace(/\\/g, '/') : file.fullPath.replace(/\\/g, '/')}?t=${Date.now()}'); background-size: contain; background-repeat: no-repeat; background-position: center; background-color: var(--waveform-bg);`;
        else if (hasPreview) bgStyle = hasScrub ? `background-image: url('file:///${previewImg.replace(/\\/g, '/')}?t=${Date.now()}'); background-size: 100% 1000%; background-position: 0% 55.55%;` : `background-image: url('file:///${previewImg.replace(/\\/g, '/')}?t=${Date.now()}'); background-size: 100% 100%; background-position: center; background-color: var(--waveform-bg);`;

        if (currentPlayingFile && currentPlayingFile.fullPath === file.fullPath) card.classList.add('playing');

        let badgeClass = isVideo ? 'badge video' : (isGraphic ? 'badge mogrt' : (isImage ? 'badge image' : 'badge audio'));
        let badgeText = isVideo ? 'VIDEO' : (isGraphic ? 'MOGRT' : (isImage ? 'IMAGE' : 'AUDIO'));
        let iconPlaceholder = (hasPreview || isImage) ? '' : `<div class="icon-center">${isVideo ? '🎬' : (isGraphic ? '📝' : '🎵')}</div>`;
        const scrubLineHtml = hasScrub ? `<div class="scrub-line"></div>` : '';
        const mouseEvents = hasScrub ? `onmousemove="handleScrub(event, this, 10)" onmouseleave="resetScrub(this)" style="cursor: ew-resize;"` : `style="cursor: pointer;"`;

        const isFav = favorites.includes(file.fullPath);
        const starClass = isFav ? "star-icon active" : "star-icon";

        card.innerHTML = `
                    <div class="card-waveform-container" style="position: relative;">
                        <div class="card-waveform" style="${bgStyle}" ${mouseEvents}>
                            ${iconPlaceholder}
                            ${scrubLineHtml}
                        </div>
                    </div>
                    <div class="card-info" style="gap: 5px;">
                        <span class="${starClass}" style="margin-right: 0;" onclick="toggleFavorite('${file.fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', event)">★</span>
                        <div class="card-title" title="${file.name}">${file.name}</div>
                        <span class="${badgeClass}">${badgeText}</span>
                    </div>
                `;
        let clickTimer = null;
        card.onclick = (e) => {
            if (e.target.classList.contains('star-icon')) return;
            if (clickTimer) clearTimeout(clickTimer);
            clickTimer = setTimeout(() => { playAsset(file, card, true); }, 250);
        };
        card.ondblclick = (e) => {
            if (e.target.classList.contains('star-icon')) return;
            if (clickTimer) clearTimeout(clickTimer);
            playAsset(file, card, false); addSelectedToTimeline();
        };
        grid.appendChild(card);
    });

    setTimeout(() => { if (typeof changeGridSize === "function") changeGridSize(document.getElementById('size-slider').value); }, 10);
};
// =========================================================================
// 🌟 แพทช์อัปเกรด V.2: แก้บั๊กสีรวน & ระบบจดจำการกางโฟลเดอร์อัจฉริยะ 🌟
// =========================================================================

// 🌟 1. ระบบจำสถานะ และหุบร่มอัตโนมัติ (Auto-Collapse / Accordion Mode) 🌟
let expandedFolders = new Set();



// 🌟 2. อัปเกรดระบบเปลี่ยนสี (เทสีทับทันทีทั้งพื้นหลังและแถบซ้าย ไม่ต้องรอโหลดหน้า) 🌟


// 🌟 3. อัปเกรดระบบดาว (ให้รีเฟรชหน้าจอแบบสมูทๆ ดึงความจำมาใช้) 🌟


// 🌟 4. เขียนทับระบบโหลดโฟลเดอร์ (ให้จำสถานะการกางโฟลเดอร์) 🌟
loadSavedFolders = function () {
    let savedFolders = [];
    try { savedFolders = JSON.parse(bluebirdStorage.getItem('bluebird_folders')) || []; } catch (e) { }

    const menu = document.getElementById('folder-list');
    menu.innerHTML = '<div class="menu-title">MY LIBRARY</div>';
    allFiles = [];

    savedFolders.forEach(dirPath => {
        if (fs.existsSync(dirPath)) {
            const folderName = path.basename(dirPath);
            const rootNode = document.createElement('div');
            rootNode.className = 'tree-root';

            // ระบบลากโฟลเดอร์
            rootNode.draggable = true;
            rootNode.addEventListener('dragstart', function (e) {
                if (showOnlyFavorites) { e.preventDefault(); return; }
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', dirPath);
                this.classList.add('dragging');
            });
            rootNode.addEventListener('dragend', function () {
                this.classList.remove('dragging');
                document.querySelectorAll('.tree-root').forEach(el => el.classList.remove('drag-over-top', 'drag-over-bottom'));
            });
            rootNode.addEventListener('dragover', function (e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                const bounding = this.querySelector('.folder-label').getBoundingClientRect();
                const offset = bounding.y + (bounding.height / 2);
                if (e.clientY - offset > 0) {
                    this.classList.add('drag-over-bottom');
                    this.classList.remove('drag-over-top');
                } else {
                    this.classList.add('drag-over-top');
                    this.classList.remove('drag-over-bottom');
                }
            });
            rootNode.addEventListener('dragleave', function () {
                this.classList.remove('drag-over-top', 'drag-over-bottom');
            });
            rootNode.addEventListener('drop', function (e) {
                e.preventDefault();
                this.classList.remove('drag-over-top', 'drag-over-bottom');
                const draggedPath = e.dataTransfer.getData('text/plain');
                if (draggedPath === dirPath) return;

                let savedList = JSON.parse(bluebirdStorage.getItem('bluebird_folders')) || [];
                const bounding = this.querySelector('.folder-label').getBoundingClientRect();
                const dropAfter = (e.clientY - (bounding.y + (bounding.height / 2)) > 0);

                savedList = savedList.filter(p => p !== draggedPath);
                let newTargetIndex = savedList.indexOf(dirPath);
                if (dropAfter) newTargetIndex++;
                savedList.splice(newTargetIndex, 0, draggedPath);
                bluebirdStorage.setItem('bluebird_folders', JSON.stringify(savedList));
                loadSavedFolders();
            });

            let ownColor = folderColors[dirPath] || '';
            let stripColor = ownColor || 'transparent';
            let bgColor = 'transparent';
            if (ownColor) {
                let r = parseInt(ownColor.slice(1, 3), 16);
                let g = parseInt(ownColor.slice(3, 5), 16);
                let b = parseInt(ownColor.slice(5, 7), 16);
                bgColor = `rgba(${r}, ${g}, ${b}, 0.2) !important`;
            }

            // จัดการความจำการกางโฟลเดอร์หลัก
            let isExpanded = expandedFolders.has(dirPath) || !expandedFolders.has(dirPath + "_init");
            let caretClass = isExpanded ? 'caret caret-down' : 'caret';
            if (isExpanded) {
                expandedFolders.add(dirPath);
                expandedFolders.add(dirPath + "_init");
            } else {
                expandedFolders.add(dirPath + "_init");
            }

            rootNode.innerHTML = `
                        <div class="folder-label" data-path="${dirPath.replace(/"/g, '&quot;')}" style="border-left-color: ${stripColor}; background-color: ${bgColor}; padding-left: 12px;" oncontextmenu="showContextMenu(event, '${dirPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this, 'main-folder')">
                            <span class="${caretClass}" onclick="toggleNode(this)">▶</span>
                            ${svgFolderIcon}
                            <span class="folder-name" onclick="selectFolder('${dirPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this)">${folderName}</span>
                        </div>
                    `;

            const subUl = scanFolderRecursive(dirPath, 1, stripColor);
            if (showOnlyFavorites && !subUl) return;
            if (subUl) {
                subUl.style.display = isExpanded ? 'block' : 'none';
                rootNode.appendChild(subUl);
            }
            else { rootNode.querySelector('.caret').style.visibility = 'hidden'; }
            menu.appendChild(rootNode);
        }
    });
    if (currentSelectedDir) {
        renderGrid();
        if (typeof changeGridSize === "function") changeGridSize(document.getElementById('size-slider').value);
    }
};

// 🌟 5. เขียนทับระบบสแกนไฟล์ (ให้ดึงความจำการกางโฟลเดอร์มาใช้เช่นกัน) 🌟
scanFolderRecursive = function (dir, depth, parentColor) {
    try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        const ul = document.createElement('ul');
        ul.className = 'tree-children';
        ul.style.display = 'none';
        let hasContent = false;

        const mediaBaseNames = items.filter(i => !i.isDirectory() && i.name.match(/\.(mp4|mov|mogrt|wav|mp3)$/i)).map(i => path.basename(i.name, path.extname(i.name)).toLowerCase());
        const folders = items.filter(i => i.isDirectory() && i.name !== '_Blue Bird Previews');
        let files = items.filter(i => !i.isDirectory() && i.name.toLowerCase() !== '_album_cover.jpg');

        if (showOnlyFavorites) {
            files = files.filter(f => favorites.includes(path.join(dir, f.name)));
        }

        folders.forEach(item => {
            const fullPath = path.join(dir, item.name);
            const subUl = scanFolderRecursive(fullPath, depth + 1, parentColor);
            if (showOnlyFavorites && !subUl) return;

            hasContent = true;
            const li = document.createElement('li');
            li.className = 'tree-node';
            let ownColor = folderColors[fullPath] || '';
            let stripColor = ownColor || parentColor || 'transparent';
            let paddingLeft = 12 + (depth * 15);

            let caretClass = expandedFolders.has(fullPath) ? 'caret caret-down' : 'caret';

            li.innerHTML = `
                        <div class="folder-label" data-path="${fullPath.replace(/"/g, '&quot;')}" style="border-left-color: ${stripColor}; padding-left: ${paddingLeft}px;" oncontextmenu="showContextMenu(event, '${fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this, 'sub-folder')">
                            <span class="${caretClass}" onclick="toggleNode(this)">▶</span>
                            ${svgFolderIcon}
                            <span class="folder-name" onclick="selectFolder('${fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this)">${item.name}</span>
                        </div>
                    `;
            if (subUl) {
                subUl.style.display = expandedFolders.has(fullPath) ? 'block' : 'none';
                li.appendChild(subUl);
            } else {
                li.querySelector('.caret').style.visibility = 'hidden';
            }
            ul.appendChild(li);
        });

        files.forEach(item => {
            const fullPath = path.join(dir, item.name);
            const ext = path.extname(item.name).toLowerCase();
            const baseName = path.basename(item.name, ext).toLowerCase();
            let isMedia = false; let type = ''; let badgeClass = '';

            if (['.wav', '.mp3', '.mogrt', '.mp4', '.mov'].includes(ext)) {
                isMedia = true; type = (ext === '.mogrt') ? 'Graphics' : (['.mp4', '.mov'].includes(ext) ? 'Video' : 'Audio');
                badgeClass = (ext === '.mogrt') ? 'badge mogrt' : (['.mp4', '.mov'].includes(ext) ? 'badge video' : 'badge audio');
            } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                if (!mediaBaseNames.includes(baseName)) { isMedia = true; type = 'Image'; badgeClass = 'badge image'; }
            }

            if (isMedia) {
                hasContent = true;
                const fileObj = { name: item.name, fullPath: fullPath, ext: ext, type: type, dir: dir };
                allFiles.push(fileObj);

                const li = document.createElement('li');
                li.className = 'tree-node';
                let paddingLeft = 12 + (depth * 15) + 18;
                const isFav = favorites.includes(fullPath);
                const starClass = isFav ? "star-icon active" : "star-icon";
                li.innerHTML = `
                            <div class="file-label" style="padding-left: ${paddingLeft}px;" title="${item.name}" oncontextmenu="showContextMenu(event, '${fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this, 'file')">
                                <span class="${starClass}" onclick="toggleFavorite('${fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', event)">★</span>
                                <span class="${badgeClass}" style="display: inline-block; width: 8px; height: 8px; min-width: 8px; padding: 0; border-radius: 2px; flex-shrink: 0; margin-right: 6px;"></span>
                                <span class="folder-name">${item.name}</span>
                            </div>
                        `;
                li.onclick = (e) => {
                    e.stopPropagation();
                    currentSelectedDir = dir;
                    document.querySelectorAll('.folder-label').forEach(el => el.classList.remove('active'));
                    const parentLabel = ul.previousElementSibling;
                    if (parentLabel && parentLabel.classList.contains('folder-label')) parentLabel.classList.add('active');
                    document.querySelectorAll('.file-label').forEach(el => el.classList.remove('active'));
                    li.querySelector('.file-label').classList.add('active');
                    document.getElementById('search').value = "";
                    renderGrid();
                    const allCards = document.querySelectorAll('.card');
                    let targetCard = null;
                    allCards.forEach(card => {
                        const titleEl = card.querySelector('.card-title');
                        if (titleEl && titleEl.getAttribute('title') === item.name) { targetCard = card; card.style.display = 'block'; } else { card.style.display = 'none'; }
                    });
                    if (typeof changeGridSize === "function") changeGridSize(document.getElementById('size-slider').value);
                    setTimeout(() => { if (targetCard) playAsset(fileObj, targetCard, true); }, 10);
                };
                li.ondblclick = (e) => { e.stopPropagation(); addSelectedToTimeline(); };
                ul.appendChild(li);
            }
        });
        return hasContent ? ul : null;
    } catch (e) { return null; }
};
// =======================================================
// 🌟 MASTER PATCH V.12: Playhead สไตล์ FL Studio + ปิดบั๊กเด้งดึ้ง 🌟
// =======================================================

if (!document.getElementById('bluebird-v12-styles')) {
    

    const modalHtml = `
                <div id="custom-prompt-modal" class="dialog-overlay" style="z-index: 20050; display: none;">
                    <div class="dialog-box" style="animation: popIn 0.2s ease-out; background: var(--card-bg); border: 1px solid var(--input-border); border-radius: 8px; width: 350px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
                        <div id="custom-prompt-title" style="color: var(--text-hover); border-bottom: 1px solid var(--border-light); padding-bottom: 12px; margin-bottom: 15px; font-weight: 500; font-size: 14px;"></div>
                        <input type="text" id="custom-prompt-input" style="width: 100%; margin-bottom: 15px; box-sizing: border-box; background: var(--input-bg); border: 1px solid var(--input-border); color: var(--text-hover); padding: 8px 12px; border-radius: 4px; font-size: 13px; outline: none;">
                        <div style="display: flex; justify-content: flex-end; gap: 10px;">
                            <button id="custom-prompt-cancel" onclick="closeCustomDialog()" style="border: 1px solid var(--text-light); color: var(--text-color); padding: 6px 15px; background: transparent; border-radius: 4px; cursor: pointer; transition: 0.2s; font-family: 'Mitr', sans-serif;">Cancel</button>
                            <button id="custom-prompt-ok" onclick="submitCustomDialog()" style="border: 1px solid var(--accent-color); background: var(--accent-color); color: white; padding: 6px 15px; border-radius: 4px; cursor: pointer; transition: 0.2s; font-weight: 500; font-family: 'Mitr', sans-serif;">OK</button>
                        </div>
                    </div>
                </div>

                <!-- 🪄 Magic Tools Modal -->
                <div id="magic-tools-modal" class="magic-modal-overlay">
                    <div class="magic-modal-box">
                        <div class="magic-modal-header">
                            <div class="magic-modal-title" data-i18n="main_btn_magic_tools">🪄 Blue Bird Magic Tools</div>
                            <button class="magic-modal-close" onclick="closeMagicTools()">×</button>
                        </div>
                        <div class="magic-tools-grid">
                            <!-- Tool 1 -->
                            <div class="magic-tool-card" onclick="openAutoCutModal()">
                                <div class="magic-badge-new">NEW</div>
                                <div class="magic-tool-icon">✂️</div>
                                <div class="magic-tool-name" data-i18n="magic_auto_cut">Auto Cut<br>Dead Air</div>
                            </div>
                            <div class="magic-tool-card" onclick="openBeatSyncModal()">
                                <div class="magic-tool-icon" style="color: #f43f5e;">🎬</div>
                                <div class="magic-tool-name" data-i18n="magic_auto_beat_sync">Auto Beat<br>Sync</div>
                            </div>
                            
                            <!-- Clear Cache Tool -->
                            <div class="magic-tool-card" id="btn-clear-cache-card" onclick="document.getElementById('clear-cache-modal').style.display='flex'">
                                <div class="magic-tool-icon" style="color: #ef4444;">🧹</div>
                                <div class="magic-tool-name" data-i18n="magic_clear_cache">Clear AE Cache</div>
                            </div>
                            
                            <!-- Coming Soon Tools -->
                            <div class="magic-tool-card coming-soon">
                                <div class="magic-tool-icon">🎚️</div>
                                <div class="magic-tool-name" data-i18n="magic_auto_ducking">Auto<br>Ducking</div>
                            </div>
                            <div class="magic-tool-card coming-soon">
                                <div class="magic-tool-icon">🔊</div>
                                <div class="magic-tool-name" data-i18n="magic_loudness_match">Loudness<br>Match</div>
                            </div>
                            <div class="magic-tool-card coming-soon">
                                <div class="magic-tool-icon">🎬</div>
                                <div class="magic-tool-name" data-i18n="magic_beat_sync">Beat<br>Sync</div>
                            </div>
                            <div class="magic-tool-card coming-soon">
                                <div class="magic-tool-icon">🎙️</div>
                                <div class="magic-tool-name" data-i18n="magic_voice_enhance">Voice<br>Enhance</div>
                            </div>
                            <div class="magic-tool-card coming-soon">
                                <div class="magic-tool-icon">🧹</div>
                                <div class="magic-tool-name" data-i18n="magic_noise_removal">Noise<br>Removal</div>
                            </div>
                            <div class="magic-tool-card coming-soon">
                                <div class="magic-tool-icon">🌈</div>
                                <div class="magic-tool-name" data-i18n="magic_auto_color">Auto<br>Color</div>
                            </div>
                            <div class="magic-tool-card coming-soon">
                                <div class="magic-tool-icon">⌨️</div>
                                <div class="magic-tool-name" data-i18n="magic_auto_subtitle">Auto<br>Subtitle</div>
                            </div>
                            <div class="magic-tool-card coming-soon">
                                <div class="magic-tool-icon">📂</div>
                                <div class="magic-tool-name" data-i18n="magic_project_cleaner">Project<br>Cleaner</div>
                            </div>
                            <div class="magic-tool-card coming-soon">
                                <div class="magic-tool-icon">🚀</div>
                                <div class="magic-tool-name" data-i18n="magic_smart_render">Smart<br>Render</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ✂️ Auto Cut Settings Modal -->
                <div id="auto-cut-modal" class="dialog-overlay" style="z-index: 20001; display: none;">
                    <div class="dialog-box" style="animation: popIn 0.2s ease-out; background: var(--card-bg); border: 1px solid var(--input-border); border-radius: 8px; width: 650px; padding: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); position: relative; display: flex; flex-direction: column; gap: 15px;">
                        
                        <!-- Close Button -->
                        <button onclick="closeAutoCutModal()" style="position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: var(--text-light); font-size: 20px; cursor: pointer; transition: 0.2s;">&times;</button>
                        
                        <div style="color: white; font-family: 'Mitr', sans-serif; font-size: 16px; font-weight: 500; display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                            <span>✂️</span> <span data-i18n="autocut_title">Auto Cut Dead Air</span>
                        </div>

                        <!-- Custom Styles for Auto Cut Modal -->
                        <style>
                        @keyframes pulse-red-border {
                            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
                            70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                        }
                        .autocut-warning-btn:hover .autocut-warning-tooltip {
                            display: block !important;
                        }
                        .autocut-scan-btn-purple {
                            border: 1px solid #8b5cf6;
                            background: linear-gradient(135deg, #8b5cf6, #c026d3);
                            color: white;
                            padding: 12px;
                            border-radius: 4px;
                            cursor: pointer;
                            transition: filter 0.2s, background 0.3s, color 0.3s, border 0.3s;
                            font-family: 'Mitr', sans-serif;
                            width: 100%;
                            font-size: 14px;
                            font-weight: 500;
                            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            gap: 10px;
                        }
                        .autocut-scan-btn-purple:hover {
                            filter: brightness(1.15);
                        }
                        
                        /* Disabled State */
                        .autocut-scan-btn-disabled {
                            border: 1px solid #555 !important;
                            background: #333 !important;
                            color: #888 !important;
                            cursor: not-allowed;
                            box-shadow: none !important;
                        }
                        .autocut-scan-btn-disabled:hover {
                            filter: none;
                        }
                        .autocut-scan-btn-disabled .arrow-icon {
                            display: none !important;
                        }

                        /* Tooltip Wrapper */
                        .autocut-scan-btn-wrapper {
                            position: relative;
                            width: 100%;
                        }
                        .scan-btn-tooltip {
                            display: none;
                            position: absolute;
                            bottom: 115%;
                            left: 50%;
                            transform: translateX(-50%);
                            background: #2a2a2a;
                            border: 1px solid #ffd700;
                            color: #ffd700;
                            padding: 8px 14px;
                            border-radius: 6px;
                            font-size: 13px;
                            white-space: nowrap;
                            z-index: 100;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                            font-family: 'Mitr', sans-serif;
                            pointer-events: none;
                        }
                        .autocut-scan-btn-wrapper:hover .scan-btn-tooltip.show-tooltip {
                            display: block;
                        }

                        @keyframes arr-left-in {
                            0% { transform: translateX(-10px); opacity: 0; }
                            50% { opacity: 1; }
                            100% { transform: translateX(5px); opacity: 0; }
                        }
                        @keyframes arr-right-in {
                            0% { transform: translateX(10px); opacity: 0; }
                            50% { opacity: 1; }
                            100% { transform: translateX(-5px); opacity: 0; }
                        }
                        .arrow-r { display: inline-block; animation: arr-left-in 1.5s infinite; color: #fff; }
                        .arrow-l { display: inline-block; animation: arr-right-in 1.5s infinite; color: #fff; }
                        </style>

                        <!-- Warning Banner -->
                        <div class="autocut-warning-btn" style="background-color: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #fca5a5; padding: 10px; border-radius: 6px; font-size: 13px; text-align: center; cursor: default; position: relative; animation: pulse-red-border 2s infinite; margin-bottom: 2px;">
                            ⚠️ <span style="font-weight: 500;" data-i18n="autocut_warning_title">ข้อควรระวัง (โปรดอ่านสำคัญมาก)</span>
                            <div class="autocut-warning-tooltip" style="display: none; position: absolute; top: 110%; left: 50%; transform: translateX(-50%); background: #1a1a1a; border: 1px solid #ef4444; padding: 15px; border-radius: 8px; width: 450px; z-index: 100; text-align: left; box-shadow: 0 8px 25px rgba(0,0,0,0.8); color: #fff; font-family: 'Mitr', sans-serif;">
                                <div style="color: #fca5a5; font-weight: bold; margin-bottom: 5px; font-size: 14px;" data-i18n="autocut_warning_title">ข้อควรระวัง</div>
                                <div style="font-size: 13px; color: #ccc;" data-i18n="autocut_warning_desc_1">เอฟเฟกต์วิดีโอจะถูกล้างค่าทั้งหมด (ยกเว้น Scale)</div>
                                <div style="color: #4ade80; font-weight: bold; margin-top: 10px; margin-bottom: 5px; font-size: 14px;" data-i18n="autocut_warning_desc_2">คำแนะนำ</div>
                                <div style="font-size: 13px; color: #ccc; line-height: 1.5;" data-i18n="autocut_warning_desc_3">ให้ทำ Auto Cut Dead Air ให้เสร็จสมบูรณ์<br>ก่อนนำคลิปไปปรับแต่งสีหรือใส่เอฟเฟกต์เพิ่มเติม</div>
                            </div>
                        </div>

                        <!-- Top: Controls -->
                        <div style="display: flex; flex-direction: column; gap: 15px; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; border: 1px solid var(--border-light);">
                            
                            <div class="autocut-scan-btn-wrapper">
                                <div class="scan-btn-tooltip show-tooltip" id="autocut-scan-tooltip" data-i18n="autocut_scan_tooltip">💡 แนะนำ กรุณาเลือกแทร็กวิดีโอก่อน</div>
                                <button id="autocut-load-preview-btn" onclick="initAutoCutPreview()" class="autocut-scan-btn-purple autocut-scan-btn-disabled">
                                    <span class="arrow-r arrow-icon">▶▶</span> <span data-i18n="autocut_scan_btn">สแกนและวิเคราะห์เสียง</span> <span class="arrow-l arrow-icon">◀◀</span>
                                </button>
                            </div>

                            <div id="autocut-settings-panel" style="display: none; flex-direction: column; gap: 10px;">
                                <!-- Threshold Control -->
                                <div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                        <label style="color: var(--text-light); font-size: 13px;" data-i18n="autocut_threshold">Silence Threshold (dB)</label>
                                        <span id="autocut-threshold-val" style="color: var(--accent-color); font-size: 13px; font-weight: bold;">-35</span>
                                    </div>
                                    <input type="range" id="autocut-threshold-slider" min="-60" max="0" value="-35" style="width: 100%; cursor: pointer;" oninput="updateAutoCutLivePreview()">
                                </div>
                                
                                <!-- Duration Control -->
                                <div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                        <label style="color: var(--text-light); font-size: 13px;" data-i18n="autocut_duration">Min Duration (sec)</label>
                                        <span id="autocut-duration-val" style="color: var(--accent-color); font-size: 13px; font-weight: bold;">0.5</span>
                                    </div>
                                    <input type="range" id="autocut-duration-slider" min="0.1" max="3" step="0.1" value="0.5" style="width: 100%; cursor: pointer;" oninput="updateAutoCutLivePreview()">
                                </div>
                                

                                <!-- Padding Control -->
                                <div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                        <label style="color: var(--text-light); font-size: 13px;" data-i18n="autocut_padding">Audio Padding (sec)</label>
                                        <span id="autocut-padding-val" style="color: var(--accent-color); font-size: 13px; font-weight: bold;">0.2</span>
                                    </div>
                                    <input type="range" id="autocut-padding-slider" min="0" max="1" step="0.1" value="0.2" style="width: 100%; cursor: pointer;" oninput="updateAutoCutLivePreview()">
                                </div>
                                
                                <div style="background: var(--input-bg); border: 1px solid var(--border-light); padding: 10px; border-radius: 6px; margin-top: 5px;">
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <input type="checkbox" id="autocut-ripple" checked style="accent-color: var(--accent-color); width: 16px; height: 16px; cursor: pointer;">
                                        <label for="autocut-ripple" style="color: var(--text-hover); font-size: 13px; cursor: pointer; font-family: 'Mitr', sans-serif;" data-i18n="autocut_ripple">Ripple Delete (ลบช่องว่างให้คลิปชนกันสนิท)</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Bottom: Waveform Preview (Hidden initially) -->
                        <div id="autocut-preview-container" style="display: none; flex-direction: column; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; border: 1px solid var(--border-light); min-height: 180px; position: relative;">
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <div style="color: var(--text-hover); font-size: 12px;" data-i18n="autocut_live_preview">Live Preview</div>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <label style="color: var(--text-light); font-size: 11px;" data-i18n="autocut_zoom">Zoom</label>
                                    <input type="range" id="autocut-zoom-slider" min="10" max="1000" value="50" style="width: 120px; cursor: pointer;" oninput="updateAutoCutZoom()">
                                </div>
                            </div>

                            <!-- Loading / Status Overlay for Waveform -->
                            <div id="autocut-waveform-loading" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(0,0,0,0.8); z-index: 10; border-radius: 8px;">
                                <div style="width: 25px; height: 25px; border: 3px solid var(--border-light); border-top: 3px solid var(--accent-color); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                                <div id="autocut-waveform-status" style="color: white; margin-top: 10px; font-size: 12px;">กำลังโหลด...</div>
                            </div>

                            <div style="position: relative; flex-grow: 1; border: 1px solid var(--input-border); border-radius: 4px; overflow: hidden; background: #000000;">
                                <div id="autocut-minimap" style="border-bottom: 1px solid #222; background: #111; cursor: pointer;"></div>
                                <div id="autocut-timeline" style="border-bottom: 1px solid #222; background: #0a0a0a;" onwheel="handleAutoCutZoomWheel(event)"></div>
                                <div id="autocut-waveform" style="width: 100%; height: 140px; cursor: col-resize;" onwheel="handleAutoCutZoomWheel(event)"></div>
                            </div>

                            <div style="display: flex; justify-content: center; margin-top: 10px; gap: 4px;">
                                <button id="autocut-autoscroll-btn" class="autocut-icon-btn active" onclick="toggleAutoCutScroll()" title="Auto Scroll (Follow Playhead)">
                                    ➔
                                </button>
                                <button id="autocut-play-btn" class="autocut-icon-btn" onclick="playPauseAutoCutPreview()" title="Play / Pause">
                                    ▶
                                </button>
                            </div>
                        </div>

                        <div style="color: #ef4444; font-size: 12px; text-align: center; display: none;" id="autocut-error-msg"></div>
                        
                        <!-- Progress Area for Cutting -->
                        <div id="autocut-cut-progress-area" style="display: none; flex-direction: column; gap: 5px; margin-top: 5px;">
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: var(--text-hover); font-size: 12px;">กำลังหั่นคลิปและลบช่องว่าง...</span>
                                <span style="color: var(--accent-color); font-size: 12px; font-weight: bold;">Processing...</span>
                            </div>
                            <div style="width: 100%; height: 6px; background: rgba(0,0,0,0.5); border-radius: 3px; overflow: hidden; position: relative;">
                                <div style="width: 50%; height: 100%; background: linear-gradient(90deg, #8b5cf6, #c026d3); border-radius: 3px; animation: loadingSweep 1s infinite linear; position: absolute; left: -50%;"></div>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 5px;" id="autocut-action-buttons">
                            <button id="autocut-cancel-btn" onclick="cancelAutoCut()" style="display: none; border: 1px solid #ef4444; color: #ef4444; padding: 10px; background: transparent; border-radius: 4px; cursor: pointer; transition: 0.2s; font-family: 'Mitr', sans-serif; width: 100%;">Cancel Process</button>
                            <button id="autocut-start-btn" onclick="startAutoCut()" style="display: none; border: 1px solid #8b5cf6; background: linear-gradient(135deg, #8b5cf6, #c026d3); color: white; padding: 10px; border-radius: 4px; cursor: pointer; transition: 0.2s; font-weight: 500; font-family: 'Mitr', sans-serif; width: 100%;" data-i18n="autocut_start_btn">✂️ ตัดคลิปทันที (Start Cut)</button>
                        </div>
                        
                        <!-- Success Alert Overlay -->
                        <div id="autocut-success-alert" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 9999; border-radius: 8px; flex-direction: column; justify-content: center; align-items: center; animation: fadeIn 0.3s ease-out;">
                            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-bottom: 15px; box-shadow: 0 0 20px rgba(34, 197, 94, 0.5); animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                                <span style="color: white; font-size: 30px;">✓</span>
                            </div>
                            <div style="color: white; font-size: 18px; font-weight: 500; font-family: 'Mitr', sans-serif; margin-bottom: 5px;">ตัดคลิปสำเร็จแล้ว!</div>
                            <div style="color: var(--text-light); font-size: 13px;">ลบช่องว่าง (Dead Air) เรียบร้อย</div>
                        </div>

                    </div>
                </div>
                
                <style>
                    @keyframes loadingSweep {
                        0% { left: -50%; }
                        100% { left: 100%; }
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    #autocut-waveform ::part(cursor) {
                        width: 1px !important;
                        background-color: #3b82f6 !important;
                        box-shadow: 
                            -1px 0 3px rgba(59,130,246, 1.0),
                            -4px 0 6px rgba(59,130,246, 0.9),
                            -10px 0 12px rgba(59,130,246, 0.7),
                            -20px 0 20px rgba(59,130,246, 0.5),
                            -35px 0 30px rgba(59,130,246, 0.3),
                            -50px 0 40px rgba(59,130,246, 0.1) !important;
                        z-index: 10 !important;
                    }
                    
                    .autocut-icon-btn {
                        background: transparent;
                        border: 1px solid var(--border-light);
                        color: white;
                        width: 32px;
                        height: 32px;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: 0.2s;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .autocut-icon-btn.active {
                        background: linear-gradient(180deg, #f97316, #ea580c) !important;
                        border-color: #ea580c !important;
                        box-shadow: 0 0 15px rgba(249, 115, 22, 0.6) !important;
                        color: white !important;
                    }
                    
                    #auto-cut-modal input[type="range"] {
                        -webkit-appearance: none;
                        height: 6px;
                        border-radius: 3px;
                        background: #000000;
                        outline: none;
                    }
                    #auto-cut-modal input[type="range"]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        width: 14px;
                        height: 14px;
                        border-radius: 50%;
                        background: #3b82f6;
                        cursor: pointer;
                        box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
                    }
                </style>

                <!-- 🎬 Auto Beat Sync Modal -->
                <div id="beat-sync-modal" class="dialog-overlay" style="z-index: 20001; display: none;">
                    <div class="dialog-box" style="animation: popIn 0.2s ease-out; background: var(--card-bg); border: 1px solid var(--input-border); border-radius: 8px; width: 650px; padding: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); position: relative; display: flex; flex-direction: column; gap: 15px;">
                        
                        <!-- Close Button -->
                        <button onclick="closeBeatSyncModal()" style="position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: var(--text-light); font-size: 20px; cursor: pointer; transition: 0.2s;">&times;</button>
                        
                        <div style="color: white; font-family: 'Mitr', sans-serif; font-size: 16px; font-weight: 500; display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                            <span style="color: #f43f5e;">🎬</span> Auto Beat Sync (Metronome)
                        </div>

                        <!-- Top Controls: Mode Selection & Input -->
                        <div style="display: flex; gap: 15px;">
                            <!-- Detection Mode -->
                            <div style="flex: 1; background: var(--input-bg); border: 1px solid var(--border-light); padding: 12px; border-radius: 6px;">
                                <div style="color: var(--text-light); font-size: 12px; margin-bottom: 8px;">1. วิธีหาจังหวะ (Detection Mode)</div>
                                <div style="display: flex; gap: 10px;">
                                    <button id="beat-mode-bpm" onclick="setBeatMode('bpm')" class="beatsync-tab-btn active">🔢 พิมพ์ BPM</button>
                                    <button id="beat-mode-audio" onclick="setBeatMode('audio')" class="beatsync-tab-btn">🥁 วิเคราะห์เสียง</button>
                                </div>
                                <div id="beat-bpm-controls" style="margin-top: 10px;">
                                    <div style="display: flex; gap: 5px;">
                                        <input type="number" id="beatsync-bpm-input" value="120" style="flex: 1; background: #111; border: 1px solid var(--border-light); color: white; padding: 8px; border-radius: 4px; font-size: 14px; text-align: center;" placeholder="เช่น 120" onchange="updateBeatSyncPreview()">
                                        <button onclick="autoDetectBPM()" style="background: #3b82f6; border: none; color: white; padding: 0 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-family: 'Mitr', sans-serif; font-weight: bold;" title="ให้ AI คำนวณ BPM จากเพลง">🤖 Auto</button>
                                    </div>
                                </div>
                                <div id="beat-audio-controls" style="margin-top: 10px; display: none;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                        <label style="color: var(--text-light); font-size: 12px;">ความไว (Sensitivity)</label>
                                        <span id="beatsync-sens-val" style="color: var(--accent-color); font-size: 12px; font-weight: bold;">50%</span>
                                    </div>
                                    <input type="range" id="beatsync-sens-slider" min="1" max="100" step="1" value="50" style="width: 100%; cursor: pointer;" oninput="updateBeatSyncPreview()">
                                </div>
                            </div>
                            
                            <!-- Action Mode (Mark/Cut) -->
                            <div style="flex: 1; background: var(--input-bg); border: 1px solid var(--border-light); padding: 12px; border-radius: 6px;">
                                <div style="color: var(--text-light); font-size: 12px; margin-bottom: 8px;">2. การทำงาน (Action)</div>
                                
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                    <input type="checkbox" id="beatsync-do-mark" checked style="cursor: pointer;">
                                    <label for="beatsync-do-mark" style="color: white; font-size: 13px; cursor: pointer;">📍 สร้าง Marker</label>
                                    <select id="beatsync-color" style="background: #111; color: white; border: 1px solid var(--border-light); padding: 2px 5px; border-radius: 4px; font-size: 12px; margin-left: auto; cursor: pointer;">
                                        <option value="0">Green</option>
                                        <option value="1">Red</option>
                                        <option value="2">Purple</option>
                                        <option value="3">Orange</option>
                                        <option value="4">Yellow</option>
                                        <option value="5">White</option>
                                        <option value="6">Blue</option>
                                        <option value="7">Cyan</option>
                                        <option value="8">Magenta</option>
                                    </select>
                                </div>
                                
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                                    <input type="checkbox" id="beatsync-do-cut" onchange="toggleBeatCutOptions()" style="cursor: pointer;">
                                    <label for="beatsync-do-cut" style="color: white; font-size: 13px; cursor: pointer;">✂️ ตัดคลิป (Razor Cut)</label>
                                </div>
                                
                                <div id="beatsync-cut-options" style="margin-left: 20px; opacity: 0.5; pointer-events: none; display: flex; flex-direction: column; gap: 5px;">
                                    <label style="color: var(--text-light); font-size: 12px; cursor: pointer;">
                                        <input type="radio" name="beat-cut-type" value="selected" checked> เฉพาะคลิปที่เลือก
                                    </label>
                                    <label style="color: var(--text-light); font-size: 12px; cursor: pointer;">
                                        <input type="radio" name="beat-cut-type" value="all"> หั่นทุกแทร็ก
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Scan & Preview Action -->
                        <div style="margin-top: 5px;">
                            <button id="beatsync-scan-btn" onclick="initBeatSyncPreview()" class="autocut-scan-btn-purple" style="background: linear-gradient(135deg, #f43f5e, #e11d48); border-color: #f43f5e;">
                                🎵 โหลดเสียงเพื่อพรีวิว (Load Audio)
                            </button>
                        </div>
                        
                        <!-- Waveform Preview Box -->
                        <div id="beatsync-preview-container" style="background: #000000; border: 1px solid var(--border-light); border-radius: 6px; height: 120px; display: none; position: relative; overflow: hidden;">
                            <div id="beatsync-loading-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10; display: flex; flex-direction: column; justify-content: center; align-items: center; color: white; display: none;">
                                <div style="width: 25px; height: 25px; border: 3px solid var(--border-light); border-top: 3px solid #f43f5e; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                                <div style="font-size: 12px; margin-top: 10px; font-family: 'Mitr', sans-serif;">กำลังวิเคราะห์...</div>
                            </div>
                            <div id="beatsync-waveform" style="width: 100%; height: 100%;"></div>
                        </div>

                        <!-- Apply Button -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px;">
                            <button id="beatsync-play-btn" onclick="toggleBeatSyncPlay()" style="background: #111; border: 1px solid var(--border-light); color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; display: none; font-family: 'Mitr', sans-serif; opacity: 0.5; pointer-events: none;">▶️ เล่นเสียง (Play)</button>
                            <div style="display: flex; gap: 10px; margin-left: auto;">
                                <button onclick="closeBeatSyncModal()" style="background: transparent; border: 1px solid var(--border-light); color: var(--text-light); padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: 'Mitr', sans-serif;">ยกเลิก</button>
                                <button id="beatsync-apply-btn" onclick="applyBeatSyncAction()" style="background: #eab308; border: none; color: black; padding: 8px 24px; border-radius: 4px; font-weight: bold; cursor: pointer; opacity: 0.5; pointer-events: none; font-family: 'Mitr', sans-serif;">✨ สั่งทำงาน (Apply)</button>
                            </div>
                        </div>

                        <style>
                            .beatsync-tab-btn {
                                flex: 1;
                                background: #111;
                                border: 1px solid var(--border-light);
                                color: var(--text-light);
                                padding: 8px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                                transition: 0.2s;
                                font-family: 'Mitr', sans-serif;
                            }
                            .beatsync-tab-btn.active {
                                background: #f43f5e;
                                border-color: #e11d48;
                                color: white;
                                font-weight: bold;
                            }
                        </style>
                    </div>
                </div>
            `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // 🪄 Magic Tools Functions
    window.openMagicTools = function() {
        const modal = document.getElementById('magic-tools-modal');
        if (modal) modal.classList.add('active');
    };
    window.closeMagicTools = function() {
        const modal = document.getElementById('magic-tools-modal');
        if (modal) modal.classList.remove('active');
    };

    window.openBeatSyncModal = function() {
        closeMagicTools();
        const modal = document.getElementById('beat-sync-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    };
    window.closeBeatSyncModal = function() {
        const modal = document.getElementById('beat-sync-modal');
        if (modal) modal.style.display = 'none';
        if (window.beatSyncPollInterval) clearInterval(window.beatSyncPollInterval);
    };

    window.openAutoCutModal = function() {
        closeMagicTools();
        const modal = document.getElementById('auto-cut-modal');
        if (modal) {
            modal.style.display = 'flex';
            // Reset UI
            document.getElementById('autocut-preview-container').style.display = 'none';
            document.getElementById('autocut-settings-panel').style.display = 'none';
            document.getElementById('autocut-cancel-btn').style.display = 'none';
            document.getElementById('autocut-start-btn').style.display = 'none';
            document.getElementById('autocut-start-btn').innerText = '✂️ ตัดคลิปทันที (Start Cut)';
            document.getElementById('autocut-error-msg').style.display = 'none';
            document.getElementById('autocut-load-preview-btn').style.display = 'block';
            document.getElementById('autocut-cut-progress-area').style.display = 'none';
            document.getElementById('autocut-action-buttons').style.display = 'flex';
            document.getElementById('autocut-success-alert').style.display = 'none';
            
            // Start Selection Polling
            if (window.autoCutPollInterval) clearInterval(window.autoCutPollInterval);
            window.autoCutPollInterval = setInterval(() => {
                const csInterface = new CSInterface();
                csInterface.evalScript('getSelectedClipAudioPath()', (result) => {
                    const btn = document.getElementById('autocut-load-preview-btn');
                    const tooltip = document.getElementById('autocut-scan-tooltip');
                    if (!btn) return;
                    if (result && result !== 'null' && result !== '') {
                        btn.classList.remove('autocut-scan-btn-disabled');
                        if (tooltip) tooltip.classList.remove('show-tooltip');
                    } else {
                        btn.classList.add('autocut-scan-btn-disabled');
                        if (tooltip) tooltip.classList.add('show-tooltip');
                    }
                });
            }, 800);
        }
    };
    window.closeAutoCutModal = function() {
        if (window.autoCutPollInterval) {
            clearInterval(window.autoCutPollInterval);
            window.autoCutPollInterval = null;
        }
        const modal = document.getElementById('auto-cut-modal');
        if (modal) modal.style.display = 'none';
        if (typeof destroyAutoCutPreview === 'function') {
            destroyAutoCutPreview();
        }
    };
    window.cancelAutoCut = function() {
        if (typeof cancelAutoCutProcess === 'function') {
            cancelAutoCutProcess();
        }
    };
    window.startAutoCut = function() {
        if (typeof runAutoCutProcess === 'function') {
            runAutoCutProcess();
        }
    };

    // จัดการปุ่มและการสร้าง SVG แว่นขยาย
    setTimeout(() => {
        const addFolderBtn = document.querySelector('.add-folder-btn');
        const zoomControl = document.querySelector('.zoom-control');
        if (addFolderBtn && zoomControl && addFolderBtn.parentElement !== zoomControl.parentElement) {
            addFolderBtn.innerHTML = `+ Add Folder`;
            zoomControl.insertAdjacentElement('afterend', addFolderBtn);
        }

        const searchInput = document.getElementById('search');
        if (searchInput && !document.getElementById('search-svg-wrapper')) {
            searchInput.placeholder = "Search";
            const wrapper = document.createElement('div');
            wrapper.id = 'search-svg-wrapper';
            wrapper.style.position = 'relative'; wrapper.style.flex = '1'; wrapper.style.display = 'flex'; wrapper.style.alignItems = 'center'; wrapper.style.minWidth = '0';
            searchInput.parentNode.insertBefore(wrapper, searchInput);
            wrapper.appendChild(searchInput);

            const svgIcon = document.createElement('div');
            svgIcon.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="#888888"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 12.01 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 12.01 14 9.5 14z"/></svg>`;
            svgIcon.style.position = 'absolute'; svgIcon.style.left = '10px'; svgIcon.style.display = 'flex'; svgIcon.style.pointerEvents = 'none';
            wrapper.appendChild(svgIcon);
        }

        const zoomIconSpan = document.querySelector('.zoom-icon');
        if (zoomIconSpan && !zoomIconSpan.hasAttribute('data-svg')) {
            zoomIconSpan.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="#888888" style="margin-top:2px;"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 12.01 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 12.01 14 9.5 14z"/></svg>`;
            zoomIconSpan.setAttribute('data-svg', 'true');
        }
    }, 50);

    // สร้าง/อัปเดตแถบเมนูขวาบน
    let topNav = document.querySelector('.top-nav-bar');
    if (!topNav) {
        topNav = document.createElement('div');
        topNav.className = 'top-nav-bar';
        const mainArea = document.querySelector('.main-area');
        const progBanner = document.getElementById('progress-banner');
        if (progBanner) mainArea.insertBefore(topNav, progBanner);
        else mainArea.prepend(topNav);
    }
    topNav.innerHTML = `
                <button class="magic-tools-btn" style="height: 24px; font-size: 11px; padding: 0 10px; border-radius: 4px; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4); margin-right: auto; white-space: nowrap; flex-shrink: 0;" onclick="openMagicTools()">🪄 Magic Tools</button>
                <button class="user-btn" onclick="showWhatsNew()" title="What's New">
                    <svg viewBox="0 0 28.092 28.092" width="16" height="16" fill="currentColor">
                        <g>
                            <polygon points="9.717,20.67 8.623,18.895 6.313,19.31 9.351,13.922 3.427,13.922 3.427,28.092 13.521,28.092 13.521,13.922"></polygon>
                            <path d="M26.331,7.16h-6.703c0.392-0.202,0.742-0.413,1.052-0.637c1.192-0.854,1.825-1.936,1.823-3.01 c0-0.881-0.417-2.143-1.023-2.669C20.873,0.312,20.068,0,19.209,0c-0.918,0-1.771,0.315-2.502,0.805 c-1.099,0.736-1.959,2.33-2.572,3.546c-0.031,0.061-0.062,0.12-0.092,0.179c-0.224-0.469-0.486-1.408-0.783-1.836 c-0.52-0.742-1.145-1.398-1.879-1.889C10.652,0.315,9.8,0,8.883,0C7.969,0.003,7.132,0.386,6.506,0.977 C5.883,1.562,5.447,2.879,5.443,3.82C5.439,4.369,5.599,4.944,5.93,5.467C6.346,6.122,7.005,6.693,7.915,7.16H1.744l0.014,5.635 h11.588V7.16h1.412v5.635h11.59L26.331,7.16z M8.315,5.398C7.85,5.104,7.564,4.809,7.396,4.544 c-0.163-0.263-0.22-0.725-0.22-0.952C7.172,3.213,7.361,2.548,7.697,2.236C8.025,1.923,8.471,1.73,8.871,1.73h0.012 c0.515,0.004,1.025,0.176,1.539,0.515c0.765,0.505,1.486,1.878,1.987,2.884c0.262,0.512,0.462,1.047,0.597,1.57 C10.685,6.459,9.185,5.947,8.315,5.398z M16.248,4.173c0.418-0.599,0.911-1.587,1.422-1.928c0.508-0.339,1.024-0.511,1.539-0.515 h0.005c0.429,0,0.842,0.168,1.123,0.417C20.619,2.4,20.77,2.863,20.77,3.189c-0.006,0.385-0.205,1.271-1.104,1.928 c-0.853,0.622-2.334,1.259-4.611,1.705C15.27,5.919,15.691,4.963,16.248,4.173z"></path>
                            <polygon points="21.791,19.287 19.482,18.895 18.392,20.691 14.637,14.013 14.637,28.092 24.68,28.092 24.68,13.922 18.756,13.922"></polygon>
                        </g>
                    </svg>
                </button>
                <button class="user-btn" onclick="showAboutCreator()" title="About Creator">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </button>
            `;
}



// 🌟 2. อัปเกรดระบบเล่นเพลง (แก้ปัญหาแผง Player บังไฟล์ด้านล่างสุด) 🌟
playAsset = function (fileData, cardElement, autoPlay = true) {
    document.querySelectorAll('.card').forEach(el => el.classList.remove('playing'));
    if (cardElement) cardElement.classList.add('playing');
    currentPlayingFile = fileData;

    const btnAdd = document.getElementById('btn-add-selected');
    if (btnAdd) btnAdd.disabled = false;

    const audioSrc = "file:///" + fileData.fullPath.replace(/\\/g, '/');
    const isAudio = ['.wav', '.mp3'].includes(fileData.ext.toLowerCase());
    const panel = document.getElementById('audio-player-panel');
    const grid = document.getElementById('asset-grid');

    if (panel) {
        if (isAudio) {
            panel.style.display = 'flex';
            if (grid) grid.style.paddingBottom = '180px';

            const revCheck = document.getElementById('reverse-checkbox');
            if (revCheck) revCheck.checked = false;
            document.getElementById('audio-waveform-area').style.transform = 'none';
            if (typeof reversedBlobUrl !== 'undefined' && reversedBlobUrl) { URL.revokeObjectURL(reversedBlobUrl); reversedBlobUrl = null; }

            if (typeof loadAndDrawWaveform === "function") loadAndDrawWaveform(fileData.fullPath);

            if (audioPlayer.src !== audioSrc) audioPlayer.src = audioSrc;

            if (autoPlay) { audioPlayer.play().catch(e => console.log(e)); }
            else {
                audioPlayer.pause(); audioPlayer.currentTime = 0;
                const playhead = document.getElementById('audio-playhead');
                if (playhead) playhead.style.left = '0%';
            }
        } else {
            panel.style.display = 'none';
            if (grid) grid.style.paddingBottom = '20px';
            audioPlayer.pause(); audioPlayer.src = "";
        }
    }
};

closeAudioPanel = function () {
    const panel = document.getElementById('audio-player-panel');
    if (panel) panel.style.display = 'none';
    const grid = document.getElementById('asset-grid');
    if (grid) grid.style.paddingBottom = '20px';
    audioPlayer.pause();
};

// 3. ระบบ Custom Dialog
let customPromptCallback = null;




// 4. จัดการ Context Menu และสมองกลไลบรารี่
let contextTargetType = 'folder';


// ฟังก์ชันหลอกๆ เตรียมไว้ให้ปุ่มทำงาน (เดี๋ยวเรามาเขียนระบบเต็มๆ ในสเต็ป 3)












// 5. โหลดโฟลเดอร์แบบสมบูรณ์
loadSavedFolders = function () {
    let savedFolders = [];
    try { savedFolders = JSON.parse(bluebirdStorage.getItem('bluebird_folders')) || []; } catch (e) { }

    let hasMainLib = savedFolders.some(p => p && p.type === 'library' && p.id === 'lib_init');
    if (!hasMainLib) {
        savedFolders.unshift({ type: 'library', id: 'lib_init', name: 'MY LIBRARY', locked: false });
        bluebirdStorage.setItem('bluebird_folders', JSON.stringify(savedFolders));
    }

    const menu = document.getElementById('folder-list');
    menu.innerHTML = '';
    allFiles = [];
    let currentLibLocked = false;

    savedFolders.forEach(item => {
        const rootNode = document.createElement('div');
        rootNode.className = 'tree-root';
        const isLibrary = (item && item.type === 'library');
        const targetId = isLibrary ? item.id : item;
        const isMainLib = (isLibrary && item.id === 'lib_init');

        if (isLibrary) currentLibLocked = item.locked;

        // 🌟 แช่แข็งสถานะล็อคของแต่ละโฟลเดอร์ ณ วินาทีนั้น (แก้บั๊กล็อคข้ามไลบรารี่) 🌟
        const isCurrentlyLocked = currentLibLocked;
        const isThisNodeLocked = isLibrary ? (item.locked || isMainLib) : isCurrentlyLocked;

        rootNode.draggable = !isThisNodeLocked;

        rootNode.addEventListener('dragstart', function (e) {
            if (showOnlyFavorites || isThisNodeLocked) { e.preventDefault(); return; }
            e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', targetId); this.classList.add('dragging');
        });
        rootNode.addEventListener('dragend', function () {
            this.classList.remove('dragging');
            document.querySelectorAll('.tree-root').forEach(el => el.classList.remove('drag-over-top', 'drag-over-bottom'));
            document.querySelectorAll('.menu-title').forEach(el => el.classList.remove('drag-target'));
        });
        rootNode.addEventListener('dragover', function (e) {
            e.preventDefault(); e.dataTransfer.dropEffect = 'move';
            const targetEl = this.querySelector(isLibrary ? '.menu-title' : '.folder-label');
            if (!targetEl) return;
            if (isLibrary) { targetEl.classList.add('drag-target'); }
            else {
                const offset = targetEl.getBoundingClientRect().y + (targetEl.getBoundingClientRect().height / 2);
                if (isMainLib && e.clientY - offset <= 0) return;
                if (e.clientY - offset > 0) { this.classList.add('drag-over-bottom'); this.classList.remove('drag-over-top'); }
                else { this.classList.add('drag-over-top'); this.classList.remove('drag-over-bottom'); }
            }
        });
        rootNode.addEventListener('dragleave', function () {
            this.classList.remove('drag-over-top', 'drag-over-bottom');
            const targetEl = this.querySelector(isLibrary ? '.menu-title' : '.folder-label');
            if (targetEl) targetEl.classList.remove('drag-target');
        });
        rootNode.addEventListener('drop', function (e) {
            e.preventDefault(); this.classList.remove('drag-over-top', 'drag-over-bottom');
            const targetEl = this.querySelector(isLibrary ? '.menu-title' : '.folder-label');
            if (targetEl) targetEl.classList.remove('drag-target');

            const draggedId = e.dataTransfer.getData('text/plain');
            if (draggedId === targetId) return;

            let savedList = JSON.parse(bluebirdStorage.getItem('bluebird_folders')) || [];
            if (!targetEl) return;

            let dropAfter = isLibrary ? true : (e.clientY - (targetEl.getBoundingClientRect().y + (targetEl.getBoundingClientRect().height / 2)) > 0);
            if (isMainLib && !dropAfter) return;

            let checkTargetIndex = savedList.findIndex(p => (p.type === 'library' ? p.id : p) === targetId);
            if (dropAfter) checkTargetIndex++;
            let destLocked = false;
            for (let i = 0; i < checkTargetIndex; i++) { if (savedList[i] && savedList[i].type === 'library') destLocked = savedList[i].locked; }

            if (destLocked && typeof savedList.find(p => (p.type === 'library' ? p.id : p) === draggedId) === 'string') {
                showCustomDialog('alert', "🔒 ไม่สามารถย้ายโฟลเดอร์เข้าไปในไลบรารี่ที่ล็อคอยู่ได้ครับ"); return;
            }

            let draggedObj = savedList.find(p => (p.type === 'library' ? p.id : p) === draggedId);
            savedList = savedList.filter(p => (p.type === 'library' ? p.id : p) !== draggedId);
            let newTargetIndex = savedList.findIndex(p => (p.type === 'library' ? p.id : p) === targetId);
            if (dropAfter) newTargetIndex++;
            savedList.splice(newTargetIndex, 0, draggedObj);
            bluebirdStorage.setItem('bluebird_folders', JSON.stringify(savedList)); loadSavedFolders();
        });

        if (isLibrary) {
            const lockSvg = item.locked
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>'
                : '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/></svg>';
            const plusSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>';
            const upSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>';
            const downSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>';
            const editSvg = '<svg class="edit-icon" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';

            let lockColor = item.locked ? '#facc15' : '#888888';
            let lockGlow = item.locked ? 'drop-shadow(0 0 4px rgba(250,204,21,0.6))' : 'none';
            let bgColor = isMainLib ? '#0a0a0a' : '#262626';
            let borderBot = isMainLib ? '#1a1a1a' : '#303030';

            let controlsHtml = ``;
            if (isMainLib) {
                controlsHtml = `
                            <span class="lib-action-btn" onclick="toggleLibLock('${item.id}')" title="ล็อค / ปลดล็อค" style="color: ${lockColor}; filter: ${lockGlow}; transition: 0.2s;">${lockSvg}</span>
                            <span class="lib-action-btn" onclick="addNewLibrary()" title="เพิ่มไลบรารี่ย่อยใหม่" style="color: #888888;">${plusSvg}</span>
                        `;
            } else {
                if (item.locked) {
                    controlsHtml = `<span class="lib-action-btn" onclick="toggleLibLock('${item.id}')" title="ปลดล็อคเพื่อแก้ไข" style="color: ${lockColor}; filter: ${lockGlow}; transition: 0.2s;">${lockSvg}</span>`;
                } else {
                    controlsHtml = `
                                <span class="lib-action-btn" onclick="moveLibraryChunk('${item.id}', 'up')" title="ย้ายขึ้น" style="color: #888888;">${upSvg}</span>
                                <span class="lib-action-btn" onclick="moveLibraryChunk('${item.id}', 'down')" title="ย้ายลง" style="color: #888888;">${downSvg}</span>
                                <span class="lib-action-btn" onclick="toggleLibLock('${item.id}')" title="ล็อค / ปลดล็อค" style="color: ${lockColor}; filter: ${lockGlow}; transition: 0.2s;">${lockSvg}</span>
                            `;
                }
            }

            rootNode.innerHTML = `
                        <div class="menu-title" oncontextmenu="showContextMenu(event, '${item.id}', this, '${isMainLib ? 'main-library' : 'sub-library'}')" style="display: flex; justify-content: space-between; align-items: center; background-color: ${bgColor}; padding: 8px 15px; border-top: 1px solid #000000; border-bottom: 1px solid ${borderBot}; margin: 0; transition: background-color 0.2s;">
                            <div class="lib-name-group" onclick="renameLibrary('${item.id}')" title="คลิกเพื่อเปลี่ยนชื่อ">
                                <span class="lib-name-text">${item.name}</span>
                                ${editSvg}
                            </div>
                            <div style="display:flex; gap: 6px; align-items:center;">
                                ${controlsHtml}
                            </div>
                        </div>
                    `;
            menu.appendChild(rootNode);
        }
        else {
            const dirPath = item;
            if (typeof dirPath === 'string' && fs.existsSync(dirPath)) {
                const folderName = path.basename(dirPath);
                let ownColor = folderColors[dirPath] || '';
                let stripColor = ownColor || 'transparent';
                let bgColor = 'transparent';
                if (ownColor) {
                    let r = parseInt(ownColor.slice(1, 3), 16); let g = parseInt(ownColor.slice(3, 5), 16); let b = parseInt(ownColor.slice(5, 7), 16);
                    bgColor = `rgba(${r}, ${g}, ${b}, 0.2) !important`;
                }

                let isExpanded = expandedFolders.has(dirPath) || !expandedFolders.has(dirPath + "_init");
                let caretClass = isExpanded ? 'caret caret-down' : 'caret';
                if (isExpanded) { expandedFolders.add(dirPath); expandedFolders.add(dirPath + "_init"); }
                else { expandedFolders.add(dirPath + "_init"); }

                rootNode.innerHTML = `
                            <div class="folder-label" data-path="${dirPath.replace(/"/g, '&quot;')}" style="border-left-color: ${stripColor}; background-color: ${bgColor}; padding-left: 12px;" oncontextmenu="showContextMenu(event, '${dirPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this, 'main-folder')">
                                <span class="${caretClass}" onclick="toggleNode(this)">▶</span>
                                ${svgFolderIcon}
                                <span class="folder-name" onclick="selectFolder('${dirPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this)">${folderName}</span>
                            </div>
                        `;

                const subUl = scanFolderRecursive(dirPath, 1, stripColor);
                if (showOnlyFavorites && !subUl) return;
                if (subUl) { subUl.style.display = isExpanded ? 'block' : 'none'; rootNode.appendChild(subUl); }
                else { rootNode.querySelector('.caret').style.visibility = 'hidden'; }
                menu.appendChild(rootNode);
            }
        }
    });

    if (currentSelectedDir) {
        renderGrid();
        if (typeof changeGridSize === "function") changeGridSize(document.getElementById('size-slider').value);
    }
};
// =======================================================
// 🌟 MASTER PATCH V.13: แอนิเมชันเส้นเพลย์เลื่อนทะลุขอบ (Smooth Exit) 🌟
// =======================================================

// 1. ล้างเครื่องเล่นเพลงตัวเก่าทิ้ง เพื่อสลายคำสั่งวาร์ปเส้นกลับ 0% แบบแข็งๆ
const oldVol = audioPlayer.volume;
audioPlayer.pause();
audioPlayer = new Audio();
audioPlayer.volume = oldVol;

let playheadAnimTimer = null;

// 2. ปลูกถ่ายระบบดักฟังเพลงใหม่
setupAudioPlayer = function () {
    audioPlayer.addEventListener('loadedmetadata', () => {
        const audioDur = document.getElementById('audio-duration');
        if (audioDur) audioDur.innerText = formatTimeDetailed(audioPlayer.duration);
    });
    audioPlayer.addEventListener('play', () => {
        document.getElementById('icon-play').style.display = 'none';
        document.getElementById('icon-pause').style.display = 'block';

        const playhead = document.getElementById('audio-playhead');
        if (playhead) {
            playhead.style.transition = 'none';
            playhead.style.opacity = '1';
        }
        if (playheadAnimTimer) clearTimeout(playheadAnimTimer);

        requestAnimationFrame(updatePlayheadUI);
    });
    audioPlayer.addEventListener('pause', () => {
        document.getElementById('icon-play').style.display = 'block';
        document.getElementById('icon-pause').style.display = 'none';
        cancelAnimationFrame(animationFrameId);
    });
    audioPlayer.addEventListener('ended', () => {
        const playhead = document.getElementById('audio-playhead');
        if (playhead) {
            // 🚀 เอฟเฟกต์พระเอก: สั่งให้เลื่อนทะลุขอบไปทางขวา (เหมือนข้อความเลื่อน) 🚀
            playhead.style.transition = 'left 0.4s linear, opacity 0.4s linear';
            playhead.style.left = 'calc(100% + 70px)';
            playhead.style.opacity = '0';

            // รอให้เลื่อนทะลุเสร็จ ค่อยแอบดึงเส้นกลับมาซ่อนไว้ที่ 0% แบบเนียนๆ
            if (playheadAnimTimer) clearTimeout(playheadAnimTimer);
            playheadAnimTimer = setTimeout(() => {
                if (audioPlayer.paused) {
                    playhead.style.transition = 'none';
                    playhead.style.left = '0%';
            playhead.style.opacity = '0';
                }
            }, 450);
        }

        const audioCurTime = document.getElementById('audio-current-time');
        if (audioCurTime) audioCurTime.innerText = '00:00:00';
    });
};
setupAudioPlayer(); // สั่งรันดักฟังทันที

// 3. ปิด Transition เวลาอัปเดตเส้นเฟรมต่อเฟรม (กันเส้นหน่วงเวลาเล่นเพลง)
updatePlayheadUI = function () {
    if (!audioPlayer.paused) {
        if (audioPlayer.duration) {
            const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            const playhead = document.getElementById('audio-playhead');
            if (playhead) {
                playhead.style.transition = 'none';
                playhead.style.left = percent + '%';
            }

            const audioCurTime = document.getElementById('audio-current-time');
            if (audioCurTime) audioCurTime.innerText = formatTimeDetailed(audioPlayer.currentTime);
        }
        animationFrameId = requestAnimationFrame(updatePlayheadUI);
    }
};

// 4. ป้องกันเส้นเอ๋อเวลาผู้ใช้คลิกข้ามเวลา (Seek)
seekAudioPanel = function (e) {
    if (!audioPlayer.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    let clickX = e.clientX - rect.left;

    const isRev = document.getElementById('reverse-checkbox').checked;
    if (isRev) clickX = rect.width - clickX;
    const percentage = clickX / rect.width;

    audioPlayer.currentTime = percentage * audioPlayer.duration;

    const playhead = document.getElementById('audio-playhead');
    if (playhead) {
        playhead.style.transition = 'none';
        playhead.style.opacity = '1';
        if (playheadAnimTimer) clearTimeout(playheadAnimTimer);
    }

    if (audioPlayer.paused) {
        if (playhead) playhead.style.left = (percentage * 100) + '%';
        const audioCurTime = document.getElementById('audio-current-time');
        if (audioCurTime) audioCurTime.innerText = formatTimeDetailed(audioPlayer.currentTime);
    }
};

// 5. ป้องกันเส้นเอ๋อเวลากดปุ่ม Restart
restartAudio = function () {
    if (audioPlayer && audioPlayer.src) {
        audioPlayer.currentTime = 0;
        audioPlayer.play().catch(e => console.log(e));

        const playhead = document.getElementById('audio-playhead');
        if (playhead) {
            playhead.style.transition = 'none';
            playhead.style.opacity = '1';
            playhead.style.left = '0%';
            if (playheadAnimTimer) clearTimeout(playheadAnimTimer);
        }
        const audioCurTime = document.getElementById('audio-current-time');
        if (audioCurTime) audioCurTime.innerText = '00:00:00';
    }
};

// 6. ป้องกันเส้นค้างเวลาเปลี่ยนไปเลือกเพลงอื่น
const oldPlayAssetV13 = playAsset;
playAsset = function (fileData, cardElement, autoPlay = true) {
    const playhead = document.getElementById('audio-playhead');
    if (playhead) {
        playhead.style.transition = 'none';
        playhead.style.opacity = '1';
        if (playheadAnimTimer) clearTimeout(playheadAnimTimer);
    }
    oldPlayAssetV13(fileData, cardElement, autoPlay);
};
// =======================================================
// 🌟 MASTER PATCH V.15: กางโล่บล็อคเสียงพรีวิวตอนดับเบิ้ลคลิก 100% 🌟
// =======================================================

let isAddingToTimelineLock = false;

addSelectedToTimeline = function () {
    if (!currentPlayingFile) return;

    // 1. 🛡️ กางโล่ป้องกันคำสั่ง Play ที่แอบค้างอยู่จากคลิกแรก (ล็อคไว้ 0.5 วินาที) 🛡️
    isAddingToTimelineLock = true;
    setTimeout(() => { isAddingToTimelineLock = false; }, 500);

    // 2. โยนไฟล์ลง Premiere Pro ปกติ
    const reverseCheck = document.getElementById('reverse-checkbox');
    const isReversed = reverseCheck ? reverseCheck.checked : false;
    importToPremiere(currentPlayingFile.fullPath, isReversed);

    // 3. 🛑 ปิดการเล่นเสียงทันทีและรีเซ็ต UI คลื่นเสียง 🛑
    if (typeof audioPlayer !== 'undefined') {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;

        // ดึงเส้นหางแสงสีฟ้ากลับมาที่ 0%
        const playhead = document.getElementById('audio-playhead');
        if (playhead) {
            playhead.style.transition = 'none';
            playhead.style.left = '0%';
            playhead.style.opacity = '0';
        }

        // รีเซ็ตตัวเลขเวลาเป็น 00:00:00
        const audioCurTime = document.getElementById('audio-current-time');
        if (audioCurTime) audioCurTime.innerText = '00:00:00';

        // รีเซ็ตไอคอนกลับเป็นปุ่ม Play
        const iconPlay = document.getElementById('icon-play');
        const iconPause = document.getElementById('icon-pause');
        if (iconPlay) iconPlay.style.display = 'block';
        if (iconPause) iconPause.style.display = 'none';

        // สลายคิวแอนิเมชันที่ค้างอยู่ทิ้งให้หมด
        if (typeof playheadAnimTimer !== 'undefined' && playheadAnimTimer) {
            clearTimeout(playheadAnimTimer);
        }
    }
};

// 4. 🧠 ดักจับและแฮกฟังก์ชัน PlayAsset ไม่ให้ทำงานถ้าโล่กางอยู่ 🧠
const oldPlayAssetV15 = playAsset;
playAsset = function (fileData, cardElement, autoPlay = true) {
    // ถ้ากำลังเบิ้ลคลิกโยนลงไทม์ไลน์อยู่ ห้ามเล่นเสียงพรีวิวเด็ดขาด! ปัดตกไปเลย!
    if (isAddingToTimelineLock) return;

    oldPlayAssetV15(fileData, cardElement, autoPlay);
};
// =======================================================
// 🌟 MASTER PATCH V.17: คืนชีพโลโก้, เปิดโฟลเดอร์อิสระ, ยกเลิกทะลุทะลวง 🌟
// =======================================================

let activeTypeFilters = { video: true, image: true, audio: true, mogrt: true };

// 1. จัดการ CSS (คืนชีพโลโก้, บีบกล่องค้นหา, ดันปุ่ม Filter ไปซ้ายสุด)
if (!document.getElementById('bluebird-v17-styles')) {
    

    setTimeout(() => {
        const searchWrapper = document.getElementById('search-svg-wrapper');
        if (searchWrapper && searchWrapper.parentElement) {
            searchWrapper.parentElement.id = 'search-container';
        }
    }, 50);

    let topNav = document.querySelector('.top-nav-bar');
    if (topNav) {
        topNav.innerHTML = `
                    <div class="filter-group">
                        <button class="filter-type-btn btn-type-v active" onclick="toggleTypeFilter('video', this)" title="Video"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2v10M18 7a8 8 0 1 1-12 0"/></svg></button>
<button class="filter-type-btn btn-type-i active" onclick="toggleTypeFilter('image', this)" title="Image"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2v10M18 7a8 8 0 1 1-12 0"/></svg></button>
<button class="filter-type-btn btn-type-a active" onclick="toggleTypeFilter('audio', this)" title="Audio"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2v10M18 7a8 8 0 1 1-12 0"/></svg></button>
<button class="filter-type-btn btn-type-m active" onclick="toggleTypeFilter('mogrt', this)" title="MOGRT"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2v10M18 7a8 8 0 1 1-12 0"/></svg></button>
                        <button class="magic-tools-btn" style="height: 24px; font-size: 11px; padding: 0 10px; border-radius: 4px; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4); white-space: nowrap; flex-shrink: 0;" onclick="openMagicTools()">🪄 Magic Tools</button>
                    </div>
                    <button class="user-btn" onclick="showWhatsNew()" title="What's New">
                    <svg viewBox="0 0 28.092 28.092" width="16" height="16" fill="currentColor">
                        <g>
                            <polygon points="9.717,20.67 8.623,18.895 6.313,19.31 9.351,13.922 3.427,13.922 3.427,28.092 13.521,28.092 13.521,13.922"></polygon>
                            <path d="M26.331,7.16h-6.703c0.392-0.202,0.742-0.413,1.052-0.637c1.192-0.854,1.825-1.936,1.823-3.01 c0-0.881-0.417-2.143-1.023-2.669C20.873,0.312,20.068,0,19.209,0c-0.918,0-1.771,0.315-2.502,0.805 c-1.099,0.736-1.959,2.33-2.572,3.546c-0.031,0.061-0.062,0.12-0.092,0.179c-0.224-0.469-0.486-1.408-0.783-1.836 c-0.52-0.742-1.145-1.398-1.879-1.889C10.652,0.315,9.8,0,8.883,0C7.969,0.003,7.132,0.386,6.506,0.977 C5.883,1.562,5.447,2.879,5.443,3.82C5.439,4.369,5.599,4.944,5.93,5.467C6.346,6.122,7.005,6.693,7.915,7.16H1.744l0.014,5.635 h11.588V7.16h1.412v5.635h11.59L26.331,7.16z M8.315,5.398C7.85,5.104,7.564,4.809,7.396,4.544 c-0.163-0.263-0.22-0.725-0.22-0.952C7.172,3.213,7.361,2.548,7.697,2.236C8.025,1.923,8.471,1.73,8.871,1.73h0.012 c0.515,0.004,1.025,0.176,1.539,0.515c0.765,0.505,1.486,1.878,1.987,2.884c0.262,0.512,0.462,1.047,0.597,1.57 C10.685,6.459,9.185,5.947,8.315,5.398z M16.248,4.173c0.418-0.599,0.911-1.587,1.422-1.928c0.508-0.339,1.024-0.511,1.539-0.515 h0.005c0.429,0,0.842,0.168,1.123,0.417C20.619,2.4,20.77,2.863,20.77,3.189c-0.006,0.385-0.205,1.271-1.104,1.928 c-0.853,0.622-2.334,1.259-4.611,1.705C15.27,5.919,15.691,4.963,16.248,4.173z"></path>
                            <polygon points="21.791,19.287 19.482,18.895 18.392,20.691 14.637,14.013 14.637,28.092 24.68,28.092 24.68,13.922 18.756,13.922"></polygon>
                        </g>
                    </svg>
                </button>
                    <button class="user-btn" onclick="showAboutCreator()" title="About Creator">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </button>
                `;
    }
}

toggleTypeFilter = function (type, btnElement) {
    activeTypeFilters[type] = !activeTypeFilters[type];
    if (activeTypeFilters[type]) btnElement.classList.add('active');
    else btnElement.classList.remove('active');
    renderGrid();
};

// 2. หุบกางโฟลเดอร์แบบ "อิสระ" (เปิดพร้อมกัน 2-3 โฟลเดอร์ได้เลย)
toggleNode = function (element) {
    const currentFolderLabel = element.closest('.folder-label');
    const childrenContainer = currentFolderLabel.nextElementSibling;

    if (childrenContainer && childrenContainer.tagName === 'UL') {
        const isHidden = childrenContainer.style.display === 'none';

        // สลับแสดง/ซ่อน แบบอิสระ ไม่แคร์ชาวบ้าน
        childrenContainer.style.display = isHidden ? 'block' : 'none';
        element.classList.toggle('caret-down', isHidden);

        if (currentFolderLabel) {
            const path = currentFolderLabel.getAttribute('data-path');
            if (isHidden) expandedFolders.add(path);
            else expandedFolders.delete(path);
        }
    }
};

// 3. โหลดโฟลเดอร์ตอนเปิดแอป (หุบทั้งหมด) และฝังปุ่ม 3 ขีดเฉพาะไลบรารี่หลัก
const oldLoadSavedFoldersV17 = loadSavedFolders;
loadSavedFolders = function () {
    // บังคับเคลียร์ความจำให้หุบทั้งหมด ตอนเปิดปลั๊กอินครั้งแรก
    if (!window.hasLoadedOnce) {
        expandedFolders.clear();
        window.hasLoadedOnce = true;
    }
    oldLoadSavedFoldersV17();

    // เอาปุ่ม 3 ขีดไปใส่ "เฉพาะ" MY LIBRARY (lib_init)
    setTimeout(() => {
        document.querySelectorAll('.menu-title').forEach(menu => {
            const libIdMatch = menu.innerHTML.match(/renameLibrary\('([^']+)'\)/);
            if (libIdMatch) {
                const libId = libIdMatch[1];

                // หาปุ่ม 3 ขีดเดิมแล้วลบทิ้งก่อน
                const oldBtn = menu.querySelector('.toggle-all-btn');
                if (oldBtn) oldBtn.remove();

                // ใส่ให้แค่ lib_init เท่านั้น
                if (libId === 'lib_init') {
                    const controlDiv = menu.querySelector('div[style*="display:flex; gap: 6px;"]');
                    if (controlDiv) {
                        const listIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>';
                        const btn = document.createElement('span');
                        btn.className = 'lib-action-btn toggle-all-btn';
                        btn.innerHTML = listIcon;
                        btn.title = "กดเพื่อพับเก็บทุกโฟลเดอร์";
                        btn.style.color = '#888888';
                        btn.onclick = () => {
                            // พอกดปุ่มนี้ปุ๊บ จะเคลียร์การกางทั้งหมดและโหลดเมนูใหม่
                            expandedFolders.clear();
                            loadSavedFolders();
                        };
                        controlDiv.insertBefore(btn, controlDiv.firstChild);
                    }
                }
            }
        });
    }, 100);
};

// 4. ยกเลิกโชว์ไฟล์แบบทะลุทะลวง (โชว์เฉพาะโฟลเดอร์ที่คลิกเป๊ะๆ) + ใช้ระบบ Filter
renderGrid = function () {
    const grid = document.getElementById('asset-grid');
    grid.innerHTML = '';
    const searchTerm = document.getElementById('search').value.toLowerCase().trim();

    if (!currentSelectedDir && searchTerm === '' && !showOnlyFavorites) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-light); margin-top: 40px;">โปรดเลือกโฟลเดอร์จากคลังสื่อ</p>';
        return;
    }

    let filtered = allFiles.filter(file => {
        // กรองจากปุ่มสี
        let fType = 'video';
        if (file.type === 'Audio') fType = 'audio';
        else if (file.type === 'Image') fType = 'image';
        else if (file.type === 'Graphics') fType = 'mogrt';

        if (!activeTypeFilters[fType]) return false;

        if (showOnlyFavorites) return favorites.includes(file.fullPath);

        // 🛑 ยกเลิกทะลุทะลวง กลับไปใช้การเช็คโฟลเดอร์ตรงตัวแบบเดิม 🛑
        let isMatchPath = false;
        if (currentSelectedDir) {
            const cleanDir = currentSelectedDir.replace(/\\\\/g, '\\');
            isMatchPath = (file.dir === cleanDir);
        } else {
            isMatchPath = true;
        }

        if (searchTerm !== '') {
            return isMatchPath && file.name.toLowerCase().includes(searchTerm);
        }
        return isMatchPath;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-light); margin-top: 40px;">ไม่มีไฟล์ในรายการนี้</p>';
        return;
    }

    filtered.forEach(file => {
        const card = document.createElement('div');
        card.className = `card`;
        card.setAttribute('oncontextmenu', `showContextMenu(event, '${file.fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this, 'file')`);

        const previewDir = path.join(file.dir, '_Blue Bird Previews');
        const previewImg = path.join(previewDir, file.name + '.png');
        const hasPreview = fs.existsSync(previewImg);
        const isVideo = ['.mp4', '.mov'].includes(file.ext.toLowerCase());
        const isGraphic = file.ext.toLowerCase() === '.mogrt';
        const isImage = ['.jpg', '.jpeg', '.png'].includes(file.ext.toLowerCase());
        const hasScrub = isVideo || isGraphic;

        let bgStyle = '';
        if (isImage) {
            bgStyle = `background-image: url('file:///${hasPreview ? previewImg.replace(/\\/g, '/') : file.fullPath.replace(/\\/g, '/')}?t=${Date.now()}'); background-size: contain; background-repeat: no-repeat; background-position: center; background-color: var(--waveform-bg);`;
        } else if (hasPreview) {
            bgStyle = hasScrub
                ? `background-image: url('file:///${previewImg.replace(/\\/g, '/')}?t=${Date.now()}'); background-size: 100% 1000%; background-position: 0% 55.55%;`
                : `background-image: url('file:///${previewImg.replace(/\\/g, '/')}?t=${Date.now()}'); background-size: 100% 100%; background-position: center; background-color: var(--waveform-bg);`;
        }

        if (currentPlayingFile && currentPlayingFile.fullPath === file.fullPath) card.classList.add('playing');

        let badgeClass = isVideo ? 'badge video' : (isGraphic ? 'badge mogrt' : (isImage ? 'badge image' : 'badge audio'));
        let badgeText = isVideo ? 'VIDEO' : (isGraphic ? 'MOGRT' : (isImage ? 'IMAGE' : 'AUDIO'));
        let iconPlaceholder = (hasPreview || isImage) ? '' : `<div class="icon-center">${isVideo ? '🎬' : (isGraphic ? '📝' : '🎵')}</div>`;
        const scrubLineHtml = hasScrub ? `<div class="scrub-line"></div>` : '';
        const mouseEvents = hasScrub ? `onmousemove="handleScrub(event, this, 10)" onmouseleave="resetScrub(this)" style="cursor: ew-resize;"` : `style="cursor: pointer;"`;

        const isFav = favorites.includes(file.fullPath);
        const starClass = isFav ? "star-icon active" : "star-icon";

        card.innerHTML = `
                    <div class="card-waveform-container" style="position: relative;">
                        <div class="card-waveform" style="${bgStyle}" ${mouseEvents}>
                            ${iconPlaceholder}
                            ${scrubLineHtml}
                        </div>
                    </div>
                    <div class="card-info" style="gap: 5px;">
                        <span class="${starClass}" style="margin-right: 0;" onclick="toggleFavorite('${file.fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', event)">★</span>
                        <div class="card-title" title="${file.name}">${file.name}</div>
                        <span class="${badgeClass}">${badgeText}</span>
                    </div>
                `;
        let clickTimer = null;
        card.onclick = (e) => {
            if (e.target.classList.contains('star-icon')) return;
            if (clickTimer) clearTimeout(clickTimer);
            clickTimer = setTimeout(() => { playAsset(file, card, true); }, 250);
        };
        card.ondblclick = (e) => {
            if (e.target.classList.contains('star-icon')) return;
            if (clickTimer) clearTimeout(clickTimer);
            playAsset(file, card, false); addSelectedToTimeline();
        };
        grid.appendChild(card);
    });

    setTimeout(() => { if (typeof changeGridSize === "function") changeGridSize(document.getElementById('size-slider').value); }, 10);
};
// ==========================================
// 🌟 MASTER PATCH V.20: สมองกล ปกอัลบั้ม + ซูม + ลบปก 🌟
// ==========================================
let cropImg = document.getElementById('crop-image-preview');
let cropGuide = document.getElementById('crop-guide');
let cropPlaceholder = document.getElementById('crop-placeholder');
let fileInput = document.getElementById('cover-file-input');
let zoomSlider = document.getElementById('crop-zoom-slider');

let isDraggingCrop = false;
let cropStartX, cropStartY, cropCurrentX = 0, cropCurrentY = 0;
let cropZoom = 1;

// 1. เปิดหน้าต่าง
window.triggerSetCover = function () {
    document.getElementById('context-menu').style.display = 'none';
    document.getElementById('album-crop-modal').style.display = 'flex';
    cropImg.src = ""; cropImg.style.display = 'none';
    cropGuide.style.display = 'none';
    cropPlaceholder.style.display = 'block';
    if (fileInput) fileInput.value = "";
    cropCurrentX = 0; cropCurrentY = 0; cropZoom = 1;
    if (zoomSlider) zoomSlider.value = 1;
    cropImg.style.transform = `translate(0px, 0px) scale(1)`;
};

// 2. ปิดหน้าต่าง
window.closeCoverModal = function () { document.getElementById('album-crop-modal').style.display = 'none'; };

// 3. ระบบโหลดรูปภาพ
if (fileInput) {
    fileInput.addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function (event) {
                cropImg.src = event.target.result;
                cropImg.style.display = 'block';

                // 🌟 พระเอกข้อ 1: บังคับให้รูปกว้าง 100% ทันที พออัปรปแนวนอนมาจะลงล็อกเป๊ะ! 🌟
                cropImg.style.width = '100%';
                cropImg.style.height = 'auto';

                cropPlaceholder.style.display = 'none';
                cropGuide.style.display = 'block';
                cropGuide.style.width = '100%';
                cropGuide.style.height = '120px';
                cropGuide.style.top = '60px';
                cropCurrentX = 0; cropCurrentY = 3; cropZoom = 1;
                if (zoomSlider) zoomSlider.value = 1;
                cropImg.style.transform = `translate(0px, 3px) scale(1)`;
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });
}

// 4. ระบบเลื่อนภาพและซูม (Drag & Zoom)
if (zoomSlider) {
    zoomSlider.addEventListener('input', function () {
        cropZoom = parseFloat(this.value);
        cropImg.style.transform = `translate(${cropCurrentX}px, ${cropCurrentY}px) scale(${cropZoom})`;
    });
}
if (cropImg) {
    cropImg.addEventListener('mousedown', function (e) {
        e.preventDefault(); // 🌟 พระเอกข้อ 2: บล็อคระบบลากรูปของเบราว์เซอร์ เมาส์จะไม่ติดหนึบอีกต่อไป! 🌟
        isDraggingCrop = true;
        cropStartX = e.clientX - cropCurrentX;
        cropStartY = e.clientY - cropCurrentY;
    });
    window.addEventListener('mousemove', function (e) {
        if (!isDraggingCrop) return;
        cropCurrentX = e.clientX - cropStartX;
        cropCurrentY = e.clientY - cropStartY;
        cropImg.style.transform = `translate(${cropCurrentX}px, ${cropCurrentY}px) scale(${cropZoom})`;
    });
    window.addEventListener('mouseup', function () { isDraggingCrop = false; });
    // 🌟 เพิ่มตัวช่วย: ถ้าลากเมาส์หลุดออกนอกหน้าต่าง ให้หยุดลากทันที 🌟
    window.addEventListener('mouseleave', function () { isDraggingCrop = false; });
}

// ฟังก์ชันรีเซ็ตภาพให้กลับมาลงล็อก 100%
window.resetCropView = function () {
    cropCurrentX = 0;
    cropCurrentY = 0;
    cropZoom = 1;
    if (zoomSlider) zoomSlider.value = 1;
    if (cropImg) cropImg.style.transform = `translate(0px, 0px) scale(1)`;
};

// 🌟 ประกาศตัวแปรความจำระดับเซียน (อัปเกรด) 🌟
window.bluebirdCoverVer = window.bluebirdCoverVer || Date.now();

// 5. ระบบบันทึกและตัดภาพ
window.saveAlbumCover = function () {
    if (!cropImg.src || cropImg.src === window.location.href) { alert("กรุณาเลือกรูปภาพก่อนครับ"); return; }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const guideRect = cropGuide.getBoundingClientRect();
    const imgRect = cropImg.getBoundingClientRect();

    canvas.width = 3000; canvas.height = 660;

    const scaleX = cropImg.naturalWidth / imgRect.width;
    const scaleY = cropImg.naturalHeight / imgRect.height;
    const cropX = (guideRect.left - imgRect.left) * scaleX;
    const cropY = (guideRect.top - imgRect.top) * scaleY;
    const cropW = guideRect.width * scaleX;
    const cropH = guideRect.height * scaleY;

    ctx.drawImage(cropImg, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
    const base64Data = canvas.toDataURL('image/jpeg', 0.9).replace(/^data:image\/jpeg;base64,/, "");

    const coverPath = path.join(contextTarget, '_album_cover.jpg');
    try {
        fs.writeFileSync(coverPath, base64Data, 'base64');
        let subSettings = JSON.parse(bluebirdStorage.getItem('bluebird_album_subs')) || {};

        if (document.getElementById('apply-subfolders-checkbox').checked) {
            subSettings[contextTarget] = true;
        } else {
            delete subSettings[contextTarget];
        }
        bluebirdStorage.setItem('bluebird_album_subs', JSON.stringify(subSettings));

        closeCoverModal();

        // อัปเดตเวอร์ชัน และสั่งล้างความจำเพื่อบังคับให้มันโหลดภาพใหม่
        window.bluebirdCoverVer = Date.now();
        const bannerContainer = document.getElementById('album-banner-container');
        if (bannerContainer) bannerContainer.removeAttribute('data-current-cover');

        updateAlbumBanner(currentSelectedDir);
    } catch (err) { alert("เกิดข้อผิดพลาดในการบันทึกภาพ: " + err); }
};

// 6. ระบบลบภาพปก
window.deleteAlbumCover = function () {
    document.getElementById('context-menu').style.display = 'none';
    if (!contextTarget) return;

    showCustomDialog('confirm', 'ต้องการลบภาพปกอัลบั้มนี้ใช่หรือไม่?', '', function (isOk) {
        if (isOk) {
            const coverPath = path.join(contextTarget, '_album_cover.jpg');
            if (fs.existsSync(coverPath)) {
                try {
                    fs.unlinkSync(coverPath);

                    window.bluebirdCoverVer = Date.now();
                    const bannerContainer = document.getElementById('album-banner-container');
                    if (bannerContainer) bannerContainer.removeAttribute('data-current-cover');

                    updateAlbumBanner(currentSelectedDir);
                } catch (err) { alert('ไม่สามารถลบภาพได้: ' + err); }
            }
        }
    });
};

// 7. ฟังก์ชันเรียกปกมาโชว์เวลาคลิกโฟลเดอร์ (รุ่นนิ่งกริ๊บ + ไม่ลามมั่ว)
window.updateAlbumBanner = function (dirPath) {
    const bannerContainer = document.getElementById('album-banner-container');
    const bannerContent = document.getElementById('album-banner-content');
    if (!bannerContainer || !dirPath) return;

    let foundCover = null;
    const directCover = path.join(dirPath, '_album_cover.jpg');

    // 1. เช็คว่ามีรูปปกในโฟลเดอร์นี้ตรงๆ ไหม
    if (fs.existsSync(directCover)) {
        foundCover = directCover;
    } else {
        // 2. ถ้าไม่มี ให้ถอยหลังไปหาโฟลเดอร์แม่ทีละชั้น (ใช้คำสั่ง path.dirname ชัวร์สุด ไม่พลาดสแลช)
        let subSettings = JSON.parse(bluebirdStorage.getItem('bluebird_album_subs')) || {};
        let currentCheck = dirPath;

        while (currentCheck && currentCheck !== path.dirname(currentCheck)) {
            currentCheck = path.dirname(currentCheck);

            if (subSettings[currentCheck] === true) {
                const parentCover = path.join(currentCheck, '_album_cover.jpg');
                if (fs.existsSync(parentCover)) {
                    foundCover = parentCover;
                    break;
                }
            }
        }
    }

    // 🛑 3. ระบบป้องกันการกระพริบ: เช็คว่ารูปที่จะโหลด คือรูปเดิมที่โชว์อยู่ไหม 🛑
    const targetCoverId = foundCover ? foundCover : 'NONE';
    if (bannerContainer.getAttribute('data-current-cover') === targetCoverId) {
        return; // ถ้าเป็นรูปเดิม เบรกเลย! ไม่ต้องโหลดให้กระพริบ
    }

    // ถ้ารูปเปลี่ยนไปจากเดิม ค่อยจดจำค่าใหม่ แล้วโชว์รูป
    bannerContainer.setAttribute('data-current-cover', targetCoverId);

    if (foundCover) {
        bannerContainer.style.display = 'flex';
        bannerContainer.style.border = 'none';
        // ใช้ตัวแปรเวอร์ชันแทน Date.now() รูปจะได้ไม่ถูกโหลดซ้ำพร่ำเพรื่อ
        const safeUrl = foundCover.replace(/\\/g, '/');
        bannerContent.style.backgroundImage = `url('file:///${safeUrl}?v=${window.bluebirdCoverVer}')`;
        bannerContent.innerHTML = '';
    } else {
        bannerContainer.style.display = 'none';
        bannerContent.style.backgroundImage = 'none';
    }
};

// 8. แอบฝังคำสั่งโหลดแบนเนอร์ เข้าไปในระบบโหลดโฟลเดอร์เดิม
if (typeof oldSelectFolderAlbum === 'undefined') {
    window.oldSelectFolderAlbum = selectFolder;
    selectFolder = function (dirPath, element) {
        oldSelectFolderAlbum(dirPath, element);
        updateAlbumBanner(dirPath);
    };
}
// =======================================================
// 🌟 MASTER PATCH V.18: โหมดหุบร่มอัจฉริยะ (Accordion Mode) & แก้โฟลเดอร์เด้งกางเอง 🌟
// =======================================================

window.bluebirdAccordionMode = false; // เริ่มต้นด้วยโหมดอิสระ (เปิดกี่อันก็ได้)

// 1. อัปเดตฟังก์ชันโหลดโฟลเดอร์ เพื่อดักตีหัวโฟลเดอร์ที่ชอบเด้งกางเอง
const oldLoadSavedFoldersV18 = loadSavedFolders;
loadSavedFolders = function () {
    if (!window.hasLoadedOnceV18) {
        expandedFolders.clear();
    }

    oldLoadSavedFoldersV18();

    setTimeout(() => {
        // 🛑 จัดการหุบโฟลเดอร์ 100% (แก้บั๊กเด้งกางเอง) 🛑
        document.querySelectorAll('.tree-children').forEach(ul => {
            const label = ul.previousElementSibling;
            if (label && label.classList.contains('folder-label')) {
                const path = label.getAttribute('data-path');
                const caret = label.querySelector('.caret');

                if (!window.hasLoadedOnceV18) {
                    // รอบแรกที่เปิดโปรแกรม: บังคับหุบให้หมดทุกอัน!
                    ul.style.display = 'none';
                    if (caret) caret.classList.remove('caret-down');
                    expandedFolders.delete(path);
                } else {
                    // รอบต่อๆ ไป: กาง/หุบ ตามความจำจริงๆ ไม่กางมั่ว
                    if (!expandedFolders.has(path)) {
                        ul.style.display = 'none';
                        if (caret) caret.classList.remove('caret-down');
                    } else {
                        ul.style.display = 'block';
                        if (caret) caret.classList.add('caret-down');
                    }
                }
            }
        });
        window.hasLoadedOnceV18 = true;

        // 🎯 แปลงร่างปุ่ม 3 ขีด ให้เป็นสวิตช์โหมด Accordion 🎯
        document.querySelectorAll('.menu-title').forEach(menu => {
            const libIdMatch = menu.innerHTML.match(/renameLibrary\('([^']+)'\)/);
            if (libIdMatch && libIdMatch[1] === 'lib_init') {
                const controlDiv = menu.querySelector('div[style*="display:flex; gap: 6px;"]');
                if (controlDiv) {
                    const oldBtn = menu.querySelector('.toggle-all-btn');
                    if (oldBtn) oldBtn.remove();

                    const listIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>';
                    const btn = document.createElement('span');
                    btn.className = 'lib-action-btn toggle-all-btn';
                    btn.innerHTML = listIcon;

                    // สีฟ้า = ทำงาน (หุบร่ม), สีเทา = ปิด (เปิดอิสระ)
                    btn.style.color = window.bluebirdAccordionMode ? '#0078FF' : '#888888';
                    btn.title = window.bluebirdAccordionMode ? "โหมดหุบร่ม: เปิด (คลิกโฟลเดอร์นึง โฟลเดอร์อื่นจะปิดอัตโนมัติ)" : "โหมดหุบร่ม: ปิด (เปิดอิสระ)";

                    btn.onclick = () => {
                        window.bluebirdAccordionMode = !window.bluebirdAccordionMode;
                        btn.style.color = window.bluebirdAccordionMode ? '#0078FF' : '#888888';
                        btn.title = window.bluebirdAccordionMode ? "โหมดหุบร่ม: เปิด" : "โหมดหุบร่ม: ปิด";

                        // ถ้าเปิดโหมดนี้ปุ๊บ สั่งพับทุกอันเลยเพื่อความคลีน
                        if (window.bluebirdAccordionMode) {
                            expandedFolders.clear();
                            loadSavedFolders();
                        }
                    };
                    controlDiv.insertBefore(btn, controlDiv.firstChild);
                }
            }
        });
    }, 100);
};

// 2. อัปเกรดสมองกลการคลิกกางโฟลเดอร์ ให้รู้จักโหมด Accordion
toggleNode = function (element) {
    const currentFolderLabel = element.closest('.folder-label');
    const childrenContainer = currentFolderLabel.nextElementSibling;

    if (childrenContainer && childrenContainer.tagName === 'UL') {
        const isHidden = childrenContainer.style.display === 'none';

        // 🚀 ถ้าเปิดโหมดนี้อยู่ และกำลังจะกางโฟลเดอร์ ให้ไปสั่งพับเพื่อนบ้าน! 🚀
        if (isHidden && window.bluebirdAccordionMode) {
            const parentItem = currentFolderLabel.parentElement;
            const parentList = parentItem.parentElement;

            Array.from(parentList.children).forEach(child => {
                if (child !== parentItem && (child.classList.contains('tree-root') || child.classList.contains('tree-node'))) {
                    const label = child.querySelector('.folder-label');
                    if (label) {
                        const caret = label.querySelector('.caret');
                        const ul = label.nextElementSibling;
                        if (caret && caret.classList.contains('caret-down')) {
                            caret.classList.remove('caret-down');
                            if (ul && ul.tagName === 'UL') ul.style.display = 'none';
                            expandedFolders.delete(label.getAttribute('data-path'));
                        }
                    }
                }
            });
        }

        // สลับสถานะให้โฟลเดอร์ที่เรากำลังคลิก
        childrenContainer.style.display = isHidden ? 'block' : 'none';
        element.classList.toggle('caret-down', isHidden);

        if (currentFolderLabel) {
            const path = currentFolderLabel.getAttribute('data-path');
            if (isHidden) expandedFolders.add(path);
            else expandedFolders.delete(path);
        }
    }
};
// =======================================================
// 🌟 MASTER PATCH V.21: ระบบพับเก็บไลบรารี่ (Collapse Library) 🌟
// =======================================================

if (typeof window.oldLoadSavedFoldersV21 === 'undefined') {
    // สำรองฟังก์ชันโหลดโฟลเดอร์ตัวเดิมเอาไว้
    window.oldLoadSavedFoldersV21 = loadSavedFolders;

    // ฟังก์ชันสลับสถานะพับ/กาง พร้อมบันทึกความจำ
    window.toggleLibCollapse = function (libId) {
        let collapsedLibs = JSON.parse(bluebirdStorage.getItem('bluebird_collapsed_libs')) || [];
        if (collapsedLibs.includes(libId)) {
            collapsedLibs = collapsedLibs.filter(id => id !== libId); // ถ้าพับอยู่ ให้กางออก
        } else {
            collapsedLibs.push(libId); // ถ้ากางอยู่ ให้พับเก็บ
        }
        bluebirdStorage.setItem('bluebird_collapsed_libs', JSON.stringify(collapsedLibs));
        loadSavedFolders(); // สั่งวาด UI ใหม่
    };

    // แฮกฟังก์ชันโหลดโฟลเดอร์ ให้รู้จักการพับเก็บ
    loadSavedFolders = function () {
        // รันระบบโหลดโฟลเดอร์เดิมตามปกติก่อน
        window.oldLoadSavedFoldersV21();

        let collapsedLibs = JSON.parse(bluebirdStorage.getItem('bluebird_collapsed_libs')) || [];
        let currentLibCollapsed = false;

        const menu = document.getElementById('folder-list');
        if (!menu) return;

        // ไล่เช็คทีละบรรทัดในแถบเมนูด้านซ้าย
        Array.from(menu.children).forEach(child => {
            const title = child.querySelector('.menu-title');

            if (title) {
                // ถ้าบรรทัดนี้คือ "หัวข้อไลบรารี่"
                const match = title.innerHTML.match(/renameLibrary\('([^']+)'\)/);
                if (match) {
                    const libId = match[1];
                    currentLibCollapsed = collapsedLibs.includes(libId);

                    const nameGroup = title.querySelector('.lib-name-group');
                    // ถ้ายางไม่มีลูกศร ให้สร้างลูกศรขึ้นมา
                    if (nameGroup && !nameGroup.querySelector('.lib-caret')) {
                        const caret = document.createElement('span');
                        caret.className = 'lib-caret';
                        caret.style.cursor = 'pointer';
                        caret.style.marginRight = '8px';
                        caret.style.transition = 'transform 0.2s';
                        caret.style.color = '#aaaaaa';
                        caret.style.display = 'inline-block';
                        caret.style.fontSize = '10px';
                        caret.innerHTML = '▼';

                        // สั่งให้ลูกศรคลิกเพื่อพับ/กางได้
                        caret.onclick = (e) => {
                            e.stopPropagation();
                            window.toggleLibCollapse(libId);
                        };

                        nameGroup.insertBefore(caret, nameGroup.firstChild);
                    }

                    // หมุนลูกศรตามสถานะ พับ/กาง
                    const existingCaret = title.querySelector('.lib-caret');
                    if (existingCaret) {
                        existingCaret.style.transform = currentLibCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
                    }
                }
            } else {
                // ถ้าบรรทัดนี้คือ "โฟลเดอร์ย่อย" ที่อยู่ใต้ไลบรารี่
                // เช็คว่าไลบรารี่แม่มันพับอยู่ไหม ถ้าพับอยู่ให้ซ่อนบรรทัดนี้ไปเลย
                child.style.display = currentLibCollapsed ? 'none' : 'block';
            }
        });
    };
}
// =======================================================
// 🌟 MASTER PATCH V.24 (Part 2): สั่งเฟดภาพปกทุกครั้งที่รูปเปลี่ยน 🌟
// =======================================================
if (typeof window.oldUpdateAlbumBannerV24 === 'undefined') {
    // สำรองฟังก์ชันเดิมเอาไว้
    window.oldUpdateAlbumBannerV24 = window.updateAlbumBanner;

    window.updateAlbumBanner = function (dirPath) {
        const bannerContent = document.getElementById('album-banner-content');
        const bannerContainer = document.getElementById('album-banner-container');

        // 1. จำชื่อรูปปกตัวเก่าเอาไว้ก่อน
        const currentCover = bannerContainer ? bannerContainer.getAttribute('data-current-cover') : null;

        // 2. ปล่อยให้ระบบเดิมทำงานดึงรูปใหม่มาใส่
        window.oldUpdateAlbumBannerV24(dirPath);

        // 3. ดูว่าได้รูปใหม่มาชื่ออะไร
        const newCover = bannerContainer ? bannerContainer.getAttribute('data-current-cover') : null;

        // 4. ถ้ารูปมีการเปลี่ยนใหม่จริงๆ (ไม่ใช่มุดโฟลเดอร์ย่อยที่ใช้ปกเดียวกัน) ให้สั่งเฟดอิน!
        if (bannerContent && newCover !== 'NONE' && currentCover !== newCover) {
            bannerContent.style.animation = 'none';
            // 👈 วิชามาร Trigger Reflow: สั่งให้เบราว์เซอร์ลบความจำแอนิเมชันเก่าทิ้ง
            bannerContent.offsetHeight;
            // 👈 ใส่แอนิเมชันเฟดอินเข้าไปใหม่ (ตั้งไว้ 0.8 วินาที อาจารย์ปรับเลขตรงนี้ได้เลยครับ)
            bannerContent.style.animation = 'bannerFadeIn 0.8s ease-out forwards';
        }
    };
}
// =======================================================
// 🌟 MASTER PATCH V.26 (Clean Version): สครับ 20 เฟรม + ปรับศูนย์กลางเป๊ะ 🌟
// =======================================================

// 1. สาด CSS ใหม่เข้าไปขยายความยาวฟิล์มสครับเป็น 2000% (20 เฟรม) และตั้งจุดพักกึ่งกลาง 47.36%
if (!document.getElementById('bluebird-v26-styles')) {
    
}

// 2. เขียนทับระบบลากเมาส์เลื่อนเฟรม (Scrub) ให้หารเฉลี่ย 20 ช่องเป๊ะๆ
handleScrub = function (e, element, totalFrames = 20) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));

    const frameIndex = Math.floor(percent * (totalFrames - 1));
    // คำนวณขยับช่องแนวดิ่ง: 100 หาร 19 ช่องว่าง = ช่องละ 5.2631%
    const yPos = frameIndex * (100 / (totalFrames - 1));
    element.style.setProperty('background-position', `0% ${yPos}%`, 'important');

    const scrubLine = element.querySelector('.scrub-line');
    if (scrubLine) scrubLine.style.width = (percent * 100) + '%';
};

// 3. เขียนทับระบบรีเซ็ตเวลาเมาส์เลื่อนออก ให้กลับมานิ่งที่เฟรมกึ่งกลาง (47.36%)
resetScrub = function (element) {
    element.style.setProperty('background-position', '0% 47.36%', 'important');
    const scrubLine = element.querySelector('.scrub-line');
    if (scrubLine) scrubLine.style.width = '0%';
};

// 4. ฝัง Class ลงไปเฉพาะการ์ดที่เป็นวิดีโอ (ป้องกันไม่ให้ลามไปพัง Audio)
if (typeof window.oldRenderGridV26 === 'undefined') {
    window.oldRenderGridV26 = renderGrid;
    renderGrid = function () {
        window.oldRenderGridV26();

        document.querySelectorAll('.card-waveform').forEach(el => {
            // ถ้ามีการเลื่อนเมาส์ แสดงว่าเป็นวิดีโอ ให้ใส่ Class 20 เฟรม
            if (el.getAttribute('onmousemove')) {
                el.classList.add('scrub-20-frames');
                el.setAttribute('onmousemove', "handleScrub(event, this, 20)");
            } else {
                // 🌟 เปลี่ยนจาก 100% 100% เป็น contain เพื่อให้ภาพอิสระ ไม่เสียทรง 🌟
                el.classList.remove('scrub-20-frames');
                el.style.setProperty('background-size', 'contain', 'important');
                el.style.setProperty('background-position', 'center', 'important');
            }
        });
    };
}
// =======================================================
// 🌟 MASTER PATCH V.30 (Ultimate): เตาอบ FFmpeg + โล่ป้องกัน Double Click 🌟
// =======================================================

// 1. 🛡️ โล่ป้องกัน Checkbox Reverse หายตอนดับเบิ้ลคลิก (จาก V.29)
if (typeof window.oldPlayAssetV30 === 'undefined') {
    window.oldPlayAssetV30 = playAsset;

    playAsset = function (fileData, cardElement, autoPlay = true) {
        // ดักจับจังหวะดับเบิ้ลคลิก (autoPlay = false) ถ้าเป็นไฟล์เดิม ให้เบรก! ห้ามล้างค่า Checkbox
        if (autoPlay === false && currentPlayingFile && currentPlayingFile.fullPath === fileData.fullPath) {
            return;
        }
        window.oldPlayAssetV30(fileData, cardElement, autoPlay);
    };
}

// 2. 🎬 เตาอบ FFmpeg: หมุนหลังกลับหน้า + เปลี่ยนคีย์เสียง (จาก V.30)
addSelectedToTimeline = function () {
    if (!currentPlayingFile) return;

    isAddingToTimelineLock = true;
    setTimeout(() => { isAddingToTimelineLock = false; }, 500);

    const reverseCheck = document.getElementById('reverse-checkbox');
    const isReversed = reverseCheck ? reverseCheck.checked : false;

    const pitchSlider = document.getElementById('pitch-slider');
    const pitchVal = pitchSlider ? parseInt(pitchSlider.value) : 0;

    const isAudio = ['.wav', '.mp3', '.aac', '.m4a'].includes(currentPlayingFile.ext.toLowerCase());

    if (isAudio && (isReversed || pitchVal !== 0)) {

        const btnAdd = document.getElementById('btn-add-selected');
        const oldText = btnAdd.innerHTML;
        if (btnAdd) {
            btnAdd.innerHTML = "⏳ Processing...";
            btnAdd.disabled = true;
        }

        const os = require('os');
        const path = require('path');
        const { exec } = require('child_process');

        const ffmpegExe = path.join(__dirname, 'bin', 'ffmpeg.exe');
        const tempDir = os.tmpdir();
        const processedFileName = 'processed_audio_' + Date.now() + '.wav';
        const processedFilePath = path.join(tempDir, processedFileName);

        let audioFilters = [];

        // ถ้าย้อนกลับ
        if (isReversed) audioFilters.push('areverse');

        // ถ้าดัดคีย์ (Pitch)
        if (pitchVal !== 0) {
            const factor = Math.pow(2, pitchVal / 12).toFixed(4);
            audioFilters.push(`aresample=48000,asetrate=48000*${factor},aresample=48000`);
        }

        const filterStr = audioFilters.join(',');
        const cmd = `chcp 65001 >nul & "${ffmpegExe}" -i "${currentPlayingFile.fullPath}" -af "${filterStr}" -y "${processedFilePath}"`;

        exec(cmd, (error, stdout, stderr) => {
            if (btnAdd) {
                btnAdd.innerHTML = oldText;
                btnAdd.disabled = false;
            }

            if (error) {
                console.error("FFmpeg error:", error);
                importToPremiere(currentPlayingFile.fullPath, false);
            } else {
                importToPremiere(processedFilePath, false);
            }
        });
    } else {
        importToPremiere(currentPlayingFile.fullPath, isReversed);
    }

    // 3. 🛑 ปิดการเล่นเสียงทันทีและรีเซ็ต UI (โล่จาก V.15)
    if (typeof audioPlayer !== 'undefined') {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;

        const playhead = document.getElementById('audio-playhead');
        if (playhead) {
            playhead.style.transition = 'none';
            playhead.style.left = '0%';
            playhead.style.opacity = '0';
        }

        const audioCurTime = document.getElementById('audio-current-time');
        if (audioCurTime) audioCurTime.innerText = '00:00:00';

        const iconPlay = document.getElementById('icon-play');
        const iconPause = document.getElementById('icon-pause');
        if (iconPlay) iconPlay.style.display = 'block';
        if (iconPause) iconPause.style.display = 'none';

        if (typeof playheadAnimTimer !== 'undefined' && playheadAnimTimer) {
            clearTimeout(playheadAnimTimer);
        }
    }
};
// =======================================================
// 🌟 MASTER PATCH V.31 (Update): ฟอนต์ Mitr แบบบาง + บนล่างเท่ากันเป๊ะ 🌟
// =======================================================

if (document.getElementById('bluebird-v31-styles')) {
    document.getElementById('bluebird-v31-styles').remove(); // ลบตัวเก่าทิ้ง
}


// =======================================================
// 🌟 MASTER PATCH V.32: บีบความสูงแถบบน + เวลาเรียงแนวนอน 🌟
// =======================================================

if (document.getElementById('bluebird-v32-styles')) {
    document.getElementById('bluebird-v32-styles').remove();
}


// =======================================================
// 🌟 MASTER PATCH V.33: ไอคอน Reverse สไตล์มินิมอล 🌟
// =======================================================

// 1. แฮกเปลี่ยนโครงสร้าง HTML ของปุ่ม Reverse ทันทีตอนโหลดหน้า
const revControl = document.querySelector('.reverse-control');
if (revControl) {
    revControl.innerHTML = `
                <input type="checkbox" id="reverse-checkbox" onchange="toggleReverse()" style="display: none;">
                <label for="reverse-checkbox" class="custom-reverse-label">
                    <svg class="rev-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/>
                    </svg>
                    <span>Reverse</span>
                </label>
            `;
}

// 2. สาด CSS ควบคุมความสวยงามและเอฟเฟกต์สีฟ้า
if (document.getElementById('bluebird-v33-styles')) {
    document.getElementById('bluebird-v33-styles').remove();
}


// =======================================================
// 🌟 MASTER PATCH V.34: แก้บั๊กเส้นเพลย์ถอยหลัง + เล่น Auto ทันที 🌟
// =======================================================

// 1. เขียนฟังก์ชัน toggleReverse ใหม่ทั้งหมด
toggleReverse = async function () {
    const reverseCheck = document.getElementById('reverse-checkbox');
    const isRev = reverseCheck.checked;

    // 🛑 แก้บั๊กเส้นเพลย์ถอยหลัง: พลิกเฉพาะรูปคลื่น (Canvas) ห้ามพลิกกรอบนอก
    const waveformCanvas = document.getElementById('waveform-canvas');
    if (waveformCanvas) {
        waveformCanvas.style.transform = isRev ? 'scaleX(-1)' : 'none';
    }

    if (!originalAudioBuffer) return;

    // หยุดเสียงเดิมที่กำลังเล่นอยู่ก่อน
    audioPlayer.pause();

    // 2. สลับไฟล์เสียงเป็นแบบหน้าไปหลัง / หลังไปหน้า
    if (isRev) {
        if (!reversedBlobUrl) {
            const ctx = getAudioContext();
            const reversedBuffer = ctx.createBuffer(originalAudioBuffer.numberOfChannels, originalAudioBuffer.length, originalAudioBuffer.sampleRate);
            for (let i = 0; i < originalAudioBuffer.numberOfChannels; i++) {
                const dest = reversedBuffer.getChannelData(i);
                const src = originalAudioBuffer.getChannelData(i);
                for (let j = 0; j < src.length; j++) dest[j] = src[src.length - 1 - j];
            }
            reversedBlobUrl = URL.createObjectURL(audioBufferToWavBlob(reversedBuffer));
        }
        audioPlayer.src = reversedBlobUrl;
    } else {
        audioPlayer.src = "file:///" + currentPlayingFile.fullPath.replace(/\\/g, '/');
    }

    // 🛑 3. บังคับให้เริ่มเล่นจากหัวคลิปเสมอ (0%)
    audioPlayer.currentTime = 0;
    const playhead = document.getElementById('audio-playhead');
    if (playhead) {
        playhead.style.transition = 'none';
        playhead.style.left = '0%';
            playhead.style.opacity = '0';
        if (typeof playheadAnimTimer !== 'undefined' && playheadAnimTimer) clearTimeout(playheadAnimTimer);
    }

    // 🛑 4. สั่งให้เล่นทันทีโดยไม่ต้องรอให้ผู้ใช้กด Play
    audioPlayer.play().catch(e => console.log(e));
};

// 5. ดักแก้บั๊กจังหวะกดเปลี่ยนไปฟังเพลงอื่น (ต้องล้างค่าการพลิก Canvas กลับมาให้เป็นปกติ)
if (typeof window.oldPlayAssetV34 === 'undefined') {
    window.oldPlayAssetV34 = playAsset;

    playAsset = function (fileData, cardElement, autoPlay = true) {
        // ล้างค่าพลิกกลับด้านเฉพาะ Canvas ให้เป็นปกติทุกครั้งที่เปลี่ยนเพลง
        const waveformCanvas = document.getElementById('waveform-canvas');
        if (waveformCanvas) waveformCanvas.style.transform = 'none';

        // (เผื่อไว้) ล้างค่ากรอบนอกที่เคยโดนคำสั่งเก่าทำบั๊กเอาไว้
        const area = document.getElementById('audio-waveform-area');
        if (area) area.style.transform = 'none';

        window.oldPlayAssetV34(fileData, cardElement, autoPlay);
    };
}
// =======================================================
// 🌟 MASTER PATCH V.35 (Update): ย้ายปุ่มลูป + จัดช่องไฟใหม่ 🌟
// =======================================================

// 1. ถอนรากถอนโคนปุ่มลูปตัวเก่าที่อยู่ฝั่งขวาทิ้ง (แก้บั๊กกระตุก)
const oldLoopBtn = document.getElementById('loop-btn');
if (oldLoopBtn) oldLoopBtn.remove();

// 2. สร้างปุ่ม Loop แทรกเข้าไปข้างหลังปุ่ม Play (ฝั่งซ้าย)
const playBtn = document.getElementById('audio-play-btn');
if (playBtn) {
    const loopBtnHtml = `
                <button id="loop-btn" class="icon-btn" onclick="toggleAudioLoop()" title="เปิด/ปิด วนลูป (Loop)">
                    <svg viewBox="0 0 24 24" width="16" height="16" id="loop-icon" style="fill: #555555; transition: all 0.2s ease;">
                        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                    </svg>
                </button>
            `;
    playBtn.insertAdjacentHTML('afterend', loopBtnHtml);
}

// 3. ดันกลุ่มปุ่มปรับเสียง (ลำโพง + สไลเดอร์) ให้ขยับไปทางขวาเพื่อแบ่งโซน
const muteBtn = document.getElementById('mute-btn');
if (muteBtn) {
    muteBtn.style.marginLeft = '0px'; // 👈 ปรับระยะห่างตรงนี้ได้เลยครับ (ผมตั้งไว้ 15px กำลังสวย)
}

// 4. ฟังก์ชันสลับสถานะเปิด-ปิดการวนลูป
window.isAudioLooping = window.isAudioLooping || false; // จำค่าเดิมไว้

window.toggleAudioLoop = function () {
    window.isAudioLooping = !window.isAudioLooping;

    if (typeof audioPlayer !== 'undefined') {
        audioPlayer.loop = window.isAudioLooping;
    }

    // เปลี่ยนสีปุ่มให้เรืองแสงสีฟ้า
    const loopIcon = document.getElementById('loop-icon');
    if (loopIcon) {
        if (window.isAudioLooping) {
            loopIcon.style.fill = 'var(--accent-color)';
            loopIcon.style.filter = 'drop-shadow(0 0 4px rgba(0, 120, 255, 0.5))';
            loopIcon.style.transform = 'scale(1.15)';
        } else {
            loopIcon.style.fill = '#555555';
            loopIcon.style.filter = 'none';
            loopIcon.style.transform = 'scale(1)';
        }
    }
};

// 5. ปกป้องสถานะความจำ Loop เวลาคลิกเปลี่ยนเพลง
if (typeof window.oldPlayAssetV35 === 'undefined') {
    window.oldPlayAssetV35 = playAsset;

    playAsset = function (fileData, cardElement, autoPlay = true) {
        window.oldPlayAssetV35(fileData, cardElement, autoPlay);

        if (typeof audioPlayer !== 'undefined') {
            audioPlayer.loop = window.isAudioLooping;
        }
    };
}
// =======================================================
// 🌟 MASTER PATCH V.42: PRO Badge (Armor Glow) & License Modal 🌟
// =======================================================

// 1. สาด CSS ตกแต่งป้าย PRO และเอฟเฟกต์ตีบวก
if (document.getElementById('bluebird-v42-styles')) {
    document.getElementById('bluebird-v42-styles').remove();
}


// 2. เสกป้าย PRO ใส่เข้าไปข้างโลโก้
const brandArea = document.querySelector('.brand');
if (brandArea && !document.getElementById('pro-badge-group')) {
    const badgeHtml = `
                <div id="pro-badge-group" class="pro-badge-group" onclick="showLicensePopup()" title="คลิกเพื่ออ่านเงื่อนไขลิขสิทธิ์">
                    <div class="pro-box">PRO</div>
                    <div class="v-text">V.${window.GLOBAL_APP_VERSION}</div>
                </div>
            `;
    brandArea.insertAdjacentHTML('beforeend', badgeHtml);
}

// 3. เสกหน้าต่าง Popup ลิขสิทธิ์ (หัวสีฟ้าสุดหล่อ)
if (!document.getElementById('license-modal')) {
    const licenseHtml = `
                <div id="license-modal" class="dialog-overlay" style="z-index: 10005; display: none;">
                    <div class="dialog-box" style="width: 500px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.9); padding: 0;">
                        
                        <!-- Header สีฟ้า -->
                        <div style="background: #0078FF; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 18px; color: #facc15; line-height: 1;">✨</span>
                                <h3 style="margin: 0; color: white; font-family: 'Mitr', sans-serif; font-size: 14px; font-weight: 500;" data-i18n="license_title">BLUE BIRD PRO - License Agreement</h3>
                            </div>
                            <button onclick="closeLicensePopup()" style="background: transparent; border: none; color: white; font-size: 20px; cursor: pointer; transition: 0.2s; padding: 0; line-height: 1; font-weight: 300;" onmouseover="this.style.color='#facc15'" onmouseout="this.style.color='white'">✕</button>
                        </div>
                        
                        <!-- Content Area -->
                        <div id="license-scroll-area" style="padding: 25px; height: 280px; overflow-y: auto; color: #d4d4d4; font-size: 13px; line-height: 1.8; font-family: 'Mitr', sans-serif; text-align: left;">
                            <h4 style="color: #facc15; margin-top: 0; font-size: 15px; font-weight: 500;" data-i18n="license_h4">ข้อตกลงและเงื่อนไขการใช้งาน (Terms of Use)</h4>
                            <p style="color: #aaa;" data-i18n="license_p1" data-i18n-html="true">ยินดีต้อนรับสู่ <b>Blue Bird Composer (PRO V.${window.GLOBAL_APP_VERSION})</b> ซอฟต์แวร์และคลังทรัพยากรระดับสตูดิโอโปรดักชัน การใช้งานซอฟต์แวร์และสินทรัพย์ดิจิทัลทั้งหมดอยู่ภายใต้เงื่อนไขดังต่อไปนี้:</p>
                            
                            <p style="color: #60a5fa; font-weight: 500; margin-bottom: 2px; margin-top: 20px;" data-i18n="license_h_comm">1. สิทธิ์การใช้งานเชิงพาณิชย์ (Commercial Use)</p>
                            <p style="margin-top: 0; color: #aaa;" data-i18n="license_p_comm">อนุญาตให้นำเสียง ซาวด์เอฟเฟกต์ กราฟิก และเทมเพลตทั้งหมด ไปใช้ประกอบสร้างสรรค์ผลงานได้อย่างอิสระ เช่น ภาพยนตร์โฆษณา, ภาพยนตร์สารคดี, วิดีโอ YouTube, รายการโทรทัศน์ และสื่อโซเชียลมีเดียทุกแพลตฟอร์ม โดยไม่มีการเรียกเก็บค่าลิขสิทธิ์เพิ่มเติม (Royalty-Free) ทั่วโลก</p>
                            
                            <p style="color: #60a5fa; font-weight: 500; margin-bottom: 2px; margin-top: 20px;" data-i18n="license_h_rest">2. ข้อห้ามในการใช้งาน (Restrictions)</p>
                            <p style="margin-top: 0; color: #aaa;" data-i18n="license_p_rest">ไม่อนุญาตให้นำไฟล์เสียงหรือเทมเพลตต้นฉบับ (Raw Assets) ไปทำซ้ำ, แจกจ่าย, อัปโหลดเพื่อให้ดาวน์โหลดฟรี, หรือดัดแปลงเพื่อนำไปขายต่อ (Resell) ในรูปแบบของคลังเสียงหรือเทมเพลตแพ็กเกจโดยเด็ดขาด</p>
                            
                            <p style="color: #60a5fa; font-weight: 500; margin-bottom: 2px; margin-top: 20px;" data-i18n="license_h_supp">3. การสนับสนุนและการอัปเดต (Support & Updates)</p>
                            <p style="margin-top: 0; color: #aaa;" data-i18n="license_p_supp">ผู้ใช้งานระดับ PRO จะได้รับการอัปเดตฟีเจอร์ของแอปพลิเคชันให้เสถียรอยู่เสมอ และได้รับสิทธิ์เข้าถึงแพ็กเกจเสียง/เทมเพลตชุดใหม่ๆ ที่จะอัปเดตในอนาคตฟรีตลอดอายุการใช้งาน</p>
                            
                            <p style="text-align: center; margin-top: 50px; margin-bottom: 20px; color: #666; font-size: 12px;" data-i18n="license_end" data-i18n-html="true">-- สิ้นสุดข้อตกลงการใช้งาน --<br><br><b>Blue Bird Pictures Studio © 2026</b></p>
                        </div>
                    </div>
                </div>
            `;
    document.body.insertAdjacentHTML('beforeend', licenseHtml);
}

// 4. สมองกล Auto-Scroll (เลื่อนขึ้นเอง + หยุดตอนเมาส์ชี้)
window.licenseScrollTimer = null;

window.showLicensePopup = function () {
    const modal = document.getElementById('license-modal');
    const scrollArea = document.getElementById('license-scroll-area');
    if (modal) modal.style.display = 'flex';

    scrollArea.scrollTop = 0;
    if (window.licenseScrollTimer) clearInterval(window.licenseScrollTimer);

    let isHovering = false;

    scrollArea.onmouseenter = () => isHovering = true;
    scrollArea.onmouseleave = () => isHovering = false;

    window.licenseScrollTimer = setInterval(() => {
        if (!isHovering) {
            scrollArea.scrollTop += 1;

            if (scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 1) {
                setTimeout(() => {
                    if (!isHovering) scrollArea.scrollTop = 0;
                }, 2000);
            }
        }
    }, 60);
};

window.closeLicensePopup = function () {
    const modal = document.getElementById('license-modal');
    if (modal) modal.style.display = 'none';
    if (window.licenseScrollTimer) clearInterval(window.licenseScrollTimer);
};
// =======================================================
// 🌟 MASTER PATCH V.44.3: Smooth Logo (ลดความคม กลับมาละมุน) 🌟
// =======================================================
if (document.getElementById('bluebird-v44-styles')) {
    document.getElementById('bluebird-v44-styles').remove();
}


// =======================================================
// 🌟 MASTER PATCH V.51.1: Badge Position Adjust (ปรับป้าย PRO ลงมานิดนึง) 🌟
// =======================================================

// ลบ CSS เก่าทิ้ง
if (document.getElementById('bluebird-v50-styles')) document.getElementById('bluebird-v50-styles').remove();
if (document.getElementById('bluebird-v51-styles')) document.getElementById('bluebird-v51-styles').remove();

const sidebarEl = document.getElementById('sidebar');
if (sidebarEl && !window.bluebirdSidebarObserver) {
    window.bluebirdSidebarObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            document.documentElement.style.setProperty('--sidebar-w', entry.contentRect.width + 'px');
        }
    });
    window.bluebirdSidebarObserver.observe(sidebarEl);
}

if (sidebarEl) {
    document.documentElement.style.setProperty('--sidebar-w', sidebarEl.offsetWidth + 'px');
}


// =======================================================
// 🌟 MASTER PATCH V.52: Dark Mode License Popup (หน้าต่างลิขสิทธิ์สีดำ) 🌟
// =======================================================
if (document.getElementById('bluebird-v52-styles')) document.getElementById('bluebird-v52-styles').remove();


// =======================================================
// 🌟 MASTER PATCH V.55: Full License Details & Custom Scrollbar 🌟
// =======================================================

// 1. ลบหน้าต่างลิขสิทธิ์อันเก่าทิ้งก่อน เพื่อสร้างใหม่ที่ยาวกว่าเดิม
const oldModal = document.getElementById('license-modal');
if (oldModal) oldModal.remove();

// 2. CSS แต่ง Scrollbar ด้านขวาให้หล่อเท่ (Dark Theme)
if (document.getElementById('bluebird-v55-styles')) document.getElementById('bluebird-v55-styles').remove();


// 3. สร้างหน้าต่างใหม่ที่ข้อความยาวขึ้น และช่องไฟเป๊ะขึ้น
const licenseHtml = `
            <div id="license-modal" class="dialog-overlay" style="z-index: 10005; display: none;">
                <!-- เพิ่มความกว้างกล่องนิดนึงให้ตัวหนังสือมีที่หายใจ -->
                <div class="dialog-box" style="width: 530px; background: #1a1a1a; border: 1px solid #000000; border-radius: 8px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.9); padding: 0;">
                    
                    <!-- Header สีดำ -->
                    <div style="background: #000000; border-bottom: 1px solid #111111; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 18px; color: #facc15; line-height: 1;">✨</span>
                            <h3 style="margin: 0; color: white; font-family: 'Mitr', sans-serif; font-size: 14px; font-weight: 500;" data-i18n="license_title">BLUE BIRD PRO - License Agreement</h3>
                        </div>
                        <button onclick="closeLicensePopup()" style="background: transparent; border: none; color: white; font-size: 20px; cursor: pointer; transition: 0.2s; padding: 0; line-height: 1; font-weight: 300;" onmouseover="this.style.color='#facc15'" onmouseout="this.style.color='white'">✕</button>
                    </div>
                    
                    <!-- Content Area (มี Scrollbar อัตโนมัติ) -->
                    <div id="license-scroll-area" style="padding: 25px 15px 25px 25px; height: 320px; overflow-y: auto; color: #d4d4d4; font-size: 13px; line-height: 1.8; font-family: 'Mitr', sans-serif; text-align: left;">
                        <h4 style="color: #facc15; margin-top: 0; font-size: 15px; font-weight: 500;" data-i18n="license_h4">ข้อตกลงและเงื่อนไขการใช้งาน (Terms of Use)</h4>
                        <p style="color: #aaa;" data-i18n="license_p1" data-i18n-html="true">ยินดีต้อนรับสู่ <b>Blue Bird Composer (PRO V.${window.GLOBAL_APP_VERSION})</b> ซอฟต์แวร์และคลังทรัพยากรระดับสตูดิโอโปรดักชัน การใช้งานซอฟต์แวร์และสินทรัพย์ดิจิทัลทั้งหมดอยู่ภายใต้เงื่อนไขดังต่อไปนี้:</p>
                        
                        <p style="color: #60a5fa; font-weight: 500; margin-bottom: 2px; margin-top: 20px;" data-i18n="license_h_comm">1. สิทธิ์การใช้งานเชิงพาณิชย์ (Commercial Use)</p>
                        <p style="margin-top: 0; color: #aaa;" data-i18n="license_p_comm">อนุญาตให้นำเสียง ซาวด์เอฟเฟกต์ กราฟิก และเทมเพลตทั้งหมด ไปใช้ประกอบสร้างสรรค์ผลงานได้อย่างอิสระ เช่น ภาพยนตร์โฆษณา, ภาพยนตร์สารคดี, วิดีโอ YouTube, รายการโทรทัศน์ และสื่อโซเชียลมีเดียทุกแพลตฟอร์ม โดยไม่มีการเรียกเก็บค่าลิขสิทธิ์เพิ่มเติม (Royalty-Free) ทั่วโลก</p>
                        
                        <p style="color: #60a5fa; font-weight: 500; margin-bottom: 2px; margin-top: 20px;" data-i18n="license_h_rest">2. ข้อห้ามในการใช้งาน (Restrictions)</p>
                        <p style="margin-top: 0; color: #aaa;" data-i18n="license_p_rest">ไม่อนุญาตให้นำไฟล์เสียงหรือเทมเพลตต้นฉบับ (Raw Assets) ไปทำซ้ำ, แจกจ่าย, อัปโหลดเพื่อให้ดาวน์โหลดฟรี, ดัดแปลงเพื่อนำไปขายต่อ (Resell) หรือนำไปจดลิขสิทธิ์ซ้ำ (Copyright Claim) ในรูปแบบของคลังเสียงหรือเทมเพลตแพ็กเกจโดยเด็ดขาด</p>
                        
                        <p style="color: #60a5fa; font-weight: 500; margin-bottom: 2px; margin-top: 20px;" data-i18n="license_h_supp">3. การสนับสนุนและการอัปเดต (Support & Updates)</p>
                        <p style="margin-top: 0; color: #aaa;" data-i18n="license_p_supp">ผู้ใช้งานระดับ PRO จะได้รับการอัปเดตฟีเจอร์ของแอปพลิเคชันให้เสถียรอยู่เสมอ และได้รับสิทธิ์เข้าถึงแพ็กเกจเสียง/เทมเพลตชุดใหม่ๆ ที่จะอัปเดตในอนาคตฟรีตลอดอายุการใช้งาน</p>

                        <p style="color: #60a5fa; font-weight: 500; margin-bottom: 2px; margin-top: 20px;" data-i18n="license_h_liab">4. ความรับผิดชอบ (Liability)</p>
                        <p style="margin-top: 0; color: #aaa;" data-i18n="license_p_liab">ทีมผู้พัฒนา Blue Bird Pictures Studio จะไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดขึ้นจากการใช้งานไฟล์ หรือการสูญหายของข้อมูลโปรเจกต์ ผู้ใช้ควรสำรองข้อมูล (Backup) อย่างสม่ำเสมอ</p>

                        <p style="color: #60a5fa; font-weight: 500; margin-bottom: 2px; margin-top: 20px;" data-i18n="license_h_term">5. การยกเลิกสิทธิ์ (Termination)</p>
                        <p style="margin-top: 0; color: #aaa;" data-i18n="license_p_term">หากพบว่าผู้ใช้งานมีการละเมิดข้อตกลง โดยเฉพาะการนำไปแจกจ่ายหรือขายต่อ ทางสตูดิโอขอสงวนสิทธิ์ในการยกเลิก License และระงับการเข้าถึงระบบอัปเดตทันที โดยไม่ต้องแจ้งให้ทราบล่วงหน้า</p>
                        
                        <!-- 👈 ลด Margin ด้านบนลงมาให้กระชับ ไม่ห่างเกินไป -->
                        <div style="text-align: center; margin-top: 35px; margin-bottom: 10px; color: #666; font-size: 12px;" data-i18n="license_end" data-i18n-html="true">
                            -- สิ้นสุดข้อตกลงการใช้งาน --<br><br><b>Blue Bird Pictures Studio © 2026</b>
                        </div>
                    </div>
                </div>
            </div>
        `;
document.body.insertAdjacentHTML('beforeend', licenseHtml);

// 4. ระบบ Auto-Scroll อัจฉริยะ (ใช้ร่วมกับ Scrollbar ได้ 100%)
window.showLicensePopup = function () {
    const modal = document.getElementById('license-modal');
    const scrollArea = document.getElementById('license-scroll-area');
    if (modal) modal.style.display = 'flex';

    scrollArea.scrollTop = 0;

    if (window.licenseScrollTimer) clearInterval(window.licenseScrollTimer);
    if (window.licenseScrollFrame) cancelAnimationFrame(window.licenseScrollFrame);
    if (window.licenseWaitTimer) clearTimeout(window.licenseWaitTimer);

    let isHovering = false;
    let isWaiting = false;
    let exactScroll = 0;
    const speed = 0.5; // ความเร็ว 0.5 พิกเซลต่อเฟรม (ลื่นกำลังดีและอ่านทัน)

    scrollArea.onmouseenter = () => {
        isHovering = true;
    };

    scrollArea.onmouseleave = () => {
        isHovering = false;
        // ถ้าดึงเมาส์ออก ให้ระบบจำตำแหน่งล่าสุดที่ผู้ใช้ลากไว้ แล้วเลื่อนต่อทันที
        exactScroll = scrollArea.scrollTop;
    };


    function playAutoScroll() {
        if(!isHovering && !isWaiting) {
            exactScroll += speed;
            scrollArea.scrollTop = exactScroll;
            
            // เช็คว่าเลื่อนชนขอบล่างหรือยัง
            if(scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 1) {
                isWaiting = true; 
                window.licenseWaitTimer = setTimeout(() => { 
                    if(!isHovering) {
                        exactScroll = 0;
                        scrollArea.scrollTop = 0;
                    }
                    isWaiting = false;
                }, 3000);
            }
        } else if(isHovering) {
            exactScroll = scrollArea.scrollTop;
        }
        window.licenseScrollFrame = requestAnimationFrame(playAutoScroll);
    }

    window.licenseScrollFrame = requestAnimationFrame(playAutoScroll);
};

window.closeLicensePopup = function () {
    const modal = document.getElementById('license-modal');
    if (modal) modal.style.display = 'none';
    if (window.licenseScrollTimer) clearInterval(window.licenseScrollTimer);
    if (window.licenseScrollFrame) cancelAnimationFrame(window.licenseScrollFrame);
    if (window.licenseWaitTimer) clearTimeout(window.licenseWaitTimer);
};
// =======================================================
// 🌟 MASTER PATCH V.58: Audio Waveform Protector (แก้ไฟล์เสียงดึงวิดีโอมาโชว์มั่ว) 🌟
// =======================================================

// =======================================================
// 🌟 MASTER PATCH V.59: Thai Folder Explorer Fix (แก้บั๊กเปิดโฟลเดอร์ภาษาไทย) 🌟
// =======================================================

showInExplorer = function () {
    if (!contextTarget) return;
    document.getElementById('context-menu').style.display = 'none';

    const path = require('path');
    const fs = require('fs');
    const { exec } = require('child_process');

    // 1. ทำความสะอาด Path เผื่อมี Slash กลับด้าน
    let cleanPath = path.normalize(contextTarget);

    // 2. ป้องกันบั๊ก Windows ท้าย Path มี Slash แล้วไปชนกับโควต (")
    if (cleanPath.endsWith('\\')) {
        cleanPath += '\\';
    }

    // 3. 🛑 พระเอกอยู่ตรงนี้! บังคับให้ Windows อ่านภาษาไทย (chcp 65001) ก่อนเปิดโฟลเดอร์ 🛑
    try {
        if (fs.statSync(contextTarget).isFile()) {
            exec(`chcp 65001 >nul & explorer /select,"${cleanPath}"`);
        } else {
            exec(`chcp 65001 >nul & explorer "${cleanPath}"`);
        }
    } catch (e) {
        exec(`chcp 65001 >nul & explorer "${cleanPath}"`);
    }
};
// =======================================================
// 🌟 MASTER PATCH V.60: Add Settings Button (ปุ่มฟันเฟืองสำหรับตั้งค่าอนาคต) 🌟
// =======================================================



// หน่วงเวลาเล็กน้อยเพื่อให้เบราว์เซอร์วาดเมนูด้านบนให้เสร็จก่อน แล้วค่อยสอดแทรกปุ่มเข้าไป
setTimeout(injectSettingsButton, 200);
// =======================================================
// 🌟 MASTER PATCH V.61: MOGRT Warning & One-Click AE Cache Cleaner 🌟
// =======================================================

// 1. 🎨 เสกหน้าต่างแจ้งเตือน (MOGRT Alert) และ หน้าต่างตั้งค่า (Settings) 🎨
const modalsHtml = `
            <!-- 🛑 หน้าต่างเตือน MOGRT -->
            <div id="mogrt-warning-modal" class="dialog-overlay" style="z-index: 10010; display: none;">
                <div class="dialog-box" style="width: 480px; background: #1a1a1a; border: 1px solid #444; border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.9); overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #d97706, #f59e0b); padding: 15px 20px; display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 22px;">⚠️</span>
                        <h3 style="margin: 0; color: #111; font-family: 'Mitr', sans-serif; font-size: 15px; font-weight: 600;">ตรวจพบไฟล์กราฟิก (MOGRT) ในโฟลเดอร์!</h3>
                    </div>
                    <div style="padding: 20px; color: #d4d4d4; font-family: 'Mitr', sans-serif; font-size: 13px; line-height: 1.6;">
                        <p style="margin-top: 0;">ระบบจำเป็นต้องเรียกใช้ <b>After Effects</b> เบื้องหลังเพื่อสร้างภาพพรีวิว ซึ่งกระบวนการนี้อาจดึง <b>พื้นที่ฮาร์ดดิสก์ (Disk Cache)</b> ไปใช้งานชั่วคราวค่อนข้างสูง (อาจถึงหลายสิบ GB)</p>
                        
                        <div style="background: #222; border-left: 3px solid #facc15; padding: 10px 15px; margin: 15px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #facc15; font-weight: 500;">💡 แต่ไม่ต้องกังวลเรื่องพื้นที่หาย!</p>
                            <p style="margin: 5px 0 0 0; color: #aaa; font-size: 12px;">เมื่อพรีวิวเสร็จสิ้น คุณสามารถไปที่ปุ่ม <b>ตั้งค่า (⚙️) > Clear AE Cache</b> เพื่อเรียกพื้นที่ทั้งหมดกลับคืนมาได้ 100% ในคลิกเดียว</p>
                        </div>
                        
                        <p style="margin-bottom: 0; color: #888;">โปรดตรวจสอบให้แน่ใจว่าไดรฟ์ของคุณมีพื้นที่ว่างเพียงพอก่อนเริ่มทำงาน</p>
                    </div>
                    <div style="padding: 15px 20px; border-top: 1px solid #333; display: flex; justify-content: flex-end; gap: 10px; background: #111;">
                        <button onclick="document.getElementById('mogrt-warning-modal').style.display='none'" style="background: transparent; border: 1px solid #555; color: #ccc; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: 'Mitr', sans-serif; transition: 0.2s;" onmouseover="this.style.background='#333'" onmouseout="this.style.background='transparent'">ยกเลิก</button>
                        <button onclick="proceedMogrtGeneration()" style="background: #0078FF; border: none; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: 'Mitr', sans-serif; font-weight: 500; transition: 0.2s;" onmouseover="this.style.background='#005bb5'" onmouseout="this.style.background='#0078FF'">รับทราบ ลุยเลย!</button>
                    </div>
                </div>
            </div>

            <!-- 🧹 หน้าต่างล้างขยะ (Clear Cache Modal) -->
            <div id="clear-cache-modal" class="dialog-overlay" style="z-index: 20010; display: none;">
                <div class="dialog-box" style="width: 400px; background: #1a1a1a; border: 1px solid #000; border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.9); overflow: hidden;">
                    <div style="background: #000; border-bottom: 1px solid #111; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <h3 data-i18n="magic_clear_cache_title" style="margin: 0; color: white; font-family: 'Mitr', sans-serif; font-size: 15px; font-weight: 500;">🧹 Clear Cache</h3>
                        </div>
                        <button onclick="document.getElementById('clear-cache-modal').style.display='none'" style="background: transparent; border: none; color: #888; font-size: 20px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#888'">✕</button>
                    </div>
                    
                    <div style="padding: 20px; font-family: 'Mitr', sans-serif;">
                        <div style="background: #222; border: 1px solid #333; border-radius: 6px; padding: 20px; text-align: center; position: relative; overflow: hidden;">
                            <div style="font-size: 30px; margin-bottom: 10px;">🧹</div>
                            <h4 style="margin: 0 0 8px 0; color: #fff; font-size: 14px;">Clear After Effects Cache</h4>
                            <p style="font-size: 12px; color: #888; margin: 0 0 20px 0; line-height: 1.5;">กดปุ่มเดียวเพื่อล้างไฟล์ขยะ (Temp & Disk Cache) ที่เกิดจากการพรีวิว MOGRT คืนพื้นที่ฮาร์ดดิสก์ให้กลับมาว่าง 100%</p>
                            
                            <button id="btn-clear-cache" onclick="executeClearCache()" style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-family: 'Mitr', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; width: 100%; transition: 0.2s; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);">
                                เริ่มล้างไฟล์ขยะทันที (One-Click Clean)
                            </button>
                        </div>
                        <div style="text-align: center; margin-top: 15px; font-size: 11px; color: #555;">Blue Bird Composer V.${window.GLOBAL_APP_VERSION} PRO</div>
                    </div>
                </div>
            </div>

            <!-- ⚙️ หน้าต่างตั้งค่า (Settings & Clear Cache) -->
            <style>
                @keyframes tabFadeIn {
                    from { opacity: 0; transform: translateX(10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .tab-fade-in {
                    animation: tabFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            </style>
            <div id="settings-main-modal" class="dialog-overlay" style="z-index: 10010; display: none;">
                <div class="dialog-box" style="width: 580px; background: #1a1a1a; border: 1px solid #000; border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.9); overflow: hidden;">
                    <div style="background: #000; border-bottom: 1px solid #111; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <h3 data-i18n="settings_title" style="margin: 0; color: white; font-family: 'Mitr', sans-serif; font-size: 15px; font-weight: 500;">⚙️ Settings (การตั้งค่า)</h3>
                        </div>
                        <button onclick="document.getElementById('settings-main-modal').style.display='none'" style="background: transparent; border: none; color: #888; font-size: 20px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#888'">✕</button>
                    </div>
                    
                    <div style="display: flex; height: 460px; font-family: 'Mitr', sans-serif;">
                        <!-- Sidebar -->
                        <div style="width: 140px; background: #111; border-right: 1px solid #333; display: flex; flex-direction: column; padding: 10px 0;">
                            <div class="settings-tab active" onclick="switchSettingsTab('general')" style="padding: 10px 15px; color: #fff; cursor: pointer; background: #222; border-left: 3px solid #0078FF; font-size: 13px;" data-i18n="settings_general">🌐 ทั่วไป</div>
                            <div class="settings-tab" onclick="switchSettingsTab('advanced')" style="padding: 10px 15px; color: #888; cursor: pointer; border-left: 3px solid transparent; font-size: 13px;" data-i18n="settings_advanced">🛠️ ขั้นสูง</div>
                            <div class="settings-tab" onclick="switchSettingsTab('update')" style="padding: 10px 15px; color: #888; cursor: pointer; border-left: 3px solid transparent; font-size: 13px;">🔄 อัปเดต</div>
                            <div class="settings-tab" onclick="switchSettingsTab('about')" style="padding: 10px 15px; color: #888; cursor: pointer; border-left: 3px solid transparent; font-size: 13px;" data-i18n="settings_about">💡 เกี่ยวกับ</div>
                        </div>
                        <!-- Content -->
                        <div style="flex: 1; padding: 20px; background: #1a1a1a; position: relative; overflow-y: auto;">
                            
                            <!-- General Tab -->
                            <div id="settings-tab-general" style="display: block;">
                                <label style="color: #aaa; font-size: 13px; display: block; margin-bottom: 8px;" data-i18n="settings_language">Language</label>
                                <select id="settings-lang-select" onchange="if(window.confirmLanguageChange) { window.confirmLanguageChange(this.value, this); } else { window.i18n.setLanguage(this.value); }" style="width: 100%; padding: 8px; background: #222; color: #fff; border: 1px solid #444; border-radius: 4px; font-family: 'Mitr', sans-serif; cursor: pointer;">
                                    <option value="en">English</option>
                                    <option value="th">ภาษาไทย (Thai)</option>
                                    <option value="ja">日本語 (Japanese)</option>
                                    <option value="ko">한국어 (Korean)</option>
                                    <option value="zh">中文 (Chinese)</option>
                                    <option value="es">Español (Spanish)</option>
                                    <option value="fr">Français (French)</option>
                                    <option value="de">Deutsch (German)</option>
                                    <option value="pt">Português (Portuguese)</option>
                                    <option value="ru">Русский (Russian)</option>
                                    <option value="id">Bahasa Indonesia (Indonesian)</option>
                                    <option value="ar">العربية (Arabic)</option>
                                </select>
                            </div>
                            
                            <!-- Update Tab -->
                            <div id="settings-tab-update" style="display: none; height: 100%; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 10px 20px;">
                                <style>
                                    .update-btn-premium {
                                        background: #0ea5e9;
                                        color: #fff;
                                        border: none;
                                        padding: 12px 28px;
                                        border-radius: 8px;
                                        font-family: 'Mitr', sans-serif;
                                        font-size: 14px;
                                        font-weight: 500;
                                        cursor: pointer;
                                        display: inline-flex;
                                        align-items: center;
                                        justify-content: center;
                                        transition: all 0.2s ease;
                                    }
                                    .update-btn-premium:hover {
                                        background: #0284c7;
                                        transform: translateY(-2px);
                                        box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
                                    }
                                </style>
                                
                                <!-- Hero Icon -->
                                <div style="display: flex; justify-content: center; margin-bottom: 25px; margin-top: 10px; width: 100%;">
                                    <div style="width: 76px; height: 76px; background: linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(0, 0, 0, 0)); border-radius: 24px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(14, 165, 233, 0.3); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 2px 10px rgba(255, 255, 255, 0.05);">
                                        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#0ea5e9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                        </svg>
                                    </div>
                                </div>

                                <!-- Title & Version -->
                                <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px; white-space: nowrap;">
                                    <h2 style="color: #fff; font-size: 18px; font-weight: 500; margin: 0; letter-spacing: 0.5px;">Blue Bird Composer</h2>
                                    <div style="background: #0ea5e9; color: #fff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; letter-spacing: 1px; box-shadow: 0 2px 6px rgba(14,165,233,0.5);">PRO</div>
                                </div>
                                
                                <div style="color: #888; font-size: 13px; margin-bottom: 25px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                    เวอร์ชันปัจจุบัน <span style="color: #0ea5e9; font-weight: bold; font-family: monospace; font-size: 16px; text-shadow: 0 0 10px rgba(14,165,233,0.4);">v${window.GLOBAL_APP_VERSION}</span>
                                </div>

                                <!-- Divider -->
                                <div style="width: 30px; height: 2px; background: #333; margin: 0 auto 20px auto; border-radius: 2px;"></div>

                                <!-- Description -->
                                <p style="color: #999; font-size: 12px; line-height: 1.6; max-width: 240px; margin: 0 auto 25px auto;">
                                    อัปเดตปลั๊กอินเพื่อรับฟีเจอร์ใหม่ การปรับปรุงประสิทธิภาพ และแก้ไขข้อผิดพลาดล่าสุด
                                </p>

                                <!-- Action Button -->
                                <button class="update-btn-premium" onclick="if(window.checkForUpdates) { window.checkForUpdates(true); } else { alert('กำลังโหลดระบบอัปเดต...'); }">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                                    Check for Updates
                                </button>
                                
                                <style>
                                    @keyframes yellowGlow {
                                        0% { box-shadow: 0 0 10px rgba(234, 179, 8, 0.4); }
                                        50% { box-shadow: 0 0 20px rgba(234, 179, 8, 0.8), 0 0 30px rgba(234, 179, 8, 0.4); }
                                        100% { box-shadow: 0 0 10px rgba(234, 179, 8, 0.4); }
                                    }
                                    .update-btn-pending {
                                        background: linear-gradient(135deg, #eab308, #f59e0b);
                                        color: #fff;
                                        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                                        border: 1px solid #fcd34d;
                                        padding: 12px 28px;
                                        border-radius: 8px;
                                        font-family: 'Mitr', sans-serif;
                                        font-size: 14px;
                                        font-weight: 500;
                                        cursor: pointer;
                                        display: none;
                                        align-items: center;
                                        justify-content: center;
                                        margin-top: 15px;
                                        animation: yellowGlow 2s infinite;
                                        transition: all 0.2s ease;
                                    }
                                    .update-btn-pending:hover {
                                        background: linear-gradient(135deg, #facc15, #fbbf24);
                                        transform: translateY(-2px);
                                    }
                                </style>
                                <button id="btn-settings-update-pending" class="update-btn-pending" onclick="require('child_process').exec('start bluebirdhub://'); document.getElementById('settings-main-modal').style.display = 'none';">
                                    ⭐ อัปเดตเวอร์ชันใหม่
                                </button>
                            </div>

                            <!-- About Tab -->
                            <div id="settings-tab-about" style="display: none; text-align: center; margin-top: 5px;">
                                <div style="width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 2px solid #222;">
                                    <img src="assets/bird.PNG" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/bird.png'" />
                                </div>
                                <h3 style="color: white; margin: 0 0 5px 0; font-size: 16px; font-weight: 500;">Blue Bird Composer <span style="color:#00b4db;">PRO</span></h3>
                                <p style="color: #aaa; margin: 0 0 15px 0; font-size: 12px;">Version ${window.GLOBAL_APP_VERSION} (Build 2026)</p>
                                
                                <div style="background: #222; border: 1px solid #333; border-radius: 8px; padding: 12px 15px; text-align: left; margin-bottom: 15px;">
                                    <div style="margin-bottom: 8px; border-bottom: 1px solid #333; padding-bottom: 8px;">
                                        <div style="color: #888; font-size: 11px; margin-bottom: 2px;">ขับเคลื่อนโดย (Powered by)</div>
                                        <div style="color: #ddd; font-size: 13px; font-weight: 500;">Blue Bird Pictures Studio</div>
                                    </div>
                                    <div>
                                        <div style="color: #888; font-size: 11px; margin-bottom: 2px;">เว็บไซต์ (Website)</div>
                                        <a href="#" onclick="if(window.cep) window.cep.util.openURLInDefaultBrowser('https://bluebirdpicturesstudio.com'); else window.open('https://bluebirdpicturesstudio.com'); return false;" style="color: #00b4db; font-size: 13px; text-decoration: none;">bluebirdpicturesstudio.com</a>
                                    </div>
                                </div>
                                

                            </div>
                            
                            <!-- Advanced Tab -->
                            <div id="settings-tab-advanced" style="display: none; color: #888; font-size: 13px; text-align: center; margin-top: 40px;" data-i18n="settings_placeholder_advanced">
                                การตั้งค่าขั้นสูงจะเปิดให้ใช้งานเร็วๆ นี้...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

window.switchSettingsTab = function(tabName) {
    document.querySelectorAll('.settings-tab').forEach(el => {
        el.style.color = '#888';
        el.style.background = 'transparent';
        el.style.borderLeftColor = 'transparent';
        el.classList.remove('active');
    });
    
    document.getElementById('settings-tab-general').style.display = 'none';
    document.getElementById('settings-tab-about').style.display = 'none';
    document.getElementById('settings-tab-advanced').style.display = 'none';
    if(document.getElementById('settings-tab-update')) document.getElementById('settings-tab-update').style.display = 'none';
    
    const activeTab = document.querySelector('.settings-tab[onclick*="'+tabName+'"]');
    if (activeTab) {
        activeTab.style.color = '#fff';
        activeTab.style.background = '#222';
        activeTab.style.borderLeftColor = '#0078FF';
        activeTab.classList.add('active');
    }
    
    const contentTab = document.getElementById('settings-tab-' + tabName);
    if (contentTab) {
        // Apply smooth transition
        contentTab.classList.remove('tab-fade-in');
        void contentTab.offsetWidth; // trigger reflow
        contentTab.classList.add('tab-fade-in');
        
        // Preserve flex layout for update tab
        if (tabName === 'update') {
            contentTab.style.display = 'flex';
        } else {
            contentTab.style.display = 'block';
        }
    }
};

// Also translate UI when rendering
setTimeout(() => {
    if (window.i18n) window.i18n.translateUI();
}, 500);
document.body.insertAdjacentHTML('beforeend', modalsHtml);

// 2. 🔗 ผูกปุ่มฟันเฟือง (จาก V.60) ให้เปิดหน้าต่าง Settings
setTimeout(() => {
    const gearBtn = document.getElementById('settings-btn-main');
    if (gearBtn) {
        gearBtn.onclick = () => { document.getElementById('settings-main-modal').style.display = 'flex'; };
    }
}, 300);

// 3. 🧠 แฮกระบบเพิ่มโฟลเดอร์ ให้แสกนหา MOGRT ก่อนทำงาน
const oldStartGenV61 = startGeneratingPreviews;

// 4. 🟢 ฟังก์ชัน "ยอมรับและดำเนินการต่อ"

// 5. 🧹 ฟังก์ชันสมองกล "ล้างบางไฟล์ขยะ (AE Cache Cleaner)"
window.executeClearCache = function () {
    const os = require('os');
    const path = require('path');
    const { exec } = require('child_process');

    const btn = document.getElementById('btn-clear-cache');
    
    if (!btn) return;

    btn.innerHTML = window.i18n && window.i18n.lang === 'th' ? "⏳ กำลังกวาดล้างไฟล์ขยะ... (โปรดรอสักครู่)" : "⏳ Cleaning cache... (Please wait)";
    btn.style.pointerEvents = "none";
    btn.style.opacity = "0.7";
    btn.style.background = "#555";
    btn.style.boxShadow = "none";

    const tempDir = os.tmpdir();
    const winUser = process.env.USERPROFILE;
    const appDataRoam = process.env.APPDATA;
    const localAppData = process.env.LOCALAPPDATA;

    // 🎯 กำหนดเป้าหมายโฟลเดอร์ขยะของ Adobe & Blue Bird
    const targets = [
        path.join(tempDir, 'bluebird_temp_*'), // ไฟล์บีบอัดของเราเอง
        path.join(localAppData, 'Temp', 'Adobe', 'After Effects', 'Disk Caches'), // Disk cache มาตรฐาน
        path.join(appDataRoam, 'Adobe', 'Common', 'Media Cache Files'), // Media Cache (CFA, PEK)
        path.join(appDataRoam, 'Adobe', 'Common', 'Media Cache')        // Database Cache
    ];

    // คำสั่งจับลบไฟล์แคชทั้งหมดแบบถอนรากถอนโคน
    const clearAeCacheCmd = `Get-ChildItem -Path '${tempDir}' -Filter *.aecache -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue`;
    let clearCmds = targets.map(t => `Get-ChildItem -Path '${t}' -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue`).join(' ; ');
    const fullCmd = `powershell -Command "${clearCmds} ; ${clearAeCacheCmd}"`;

    // สั่งประหาร!
    exec(fullCmd, (err) => {
        btn.innerHTML = window.i18n && window.i18n.lang === 'th' ? "✅ ล้างไฟล์ขยะสำเร็จ! ได้พื้นที่คืนแล้ว" : "✅ Cache cleared successfully!";
        btn.style.background = "#10b981"; // สีเขียว
        btn.style.opacity = "1";

        // ดีเลย์ 3 วินาที แล้วรีเซ็ตปุ่มกลับมาเหมือนเดิม
        setTimeout(() => {
            btn.innerHTML = window.i18n && window.i18n.lang === 'th' ? "เริ่มล้างไฟล์ขยะทันที (One-Click Clean)" : "One-Click Clean";
            btn.style.pointerEvents = "auto";
            btn.style.background = "#ef4444";
            btn.style.boxShadow = "0 4px 10px rgba(239, 68, 68, 0.3)";
        }, 3000);
    });
};
// =======================================================
// 🌟 MASTER PATCH V.61: Auto Motion Preview (Mister Horse Style) 🌟
// =======================================================

// 1. สร้าง CSS สำหรับแอนิเมชัน Flipbook และปุ่ม Toggle
if (document.getElementById('bluebird-v61-styles')) document.getElementById('bluebird-v61-styles').remove();


// 2. สร้างสมองกลจดจำสถานะการเปิด/ปิด (ให้จำค่าข้ามวันได้)
window.isAutoPreviewEnabled = bluebirdStorage.getItem('bluebird_auto_preview') === 'true';
if (window.isAutoPreviewEnabled) document.body.classList.add('auto-preview-enabled');

// 3. ฟังก์ชันสลับการทำงาน
window.toggleAutoPreview = function () {
    window.isAutoPreviewEnabled = !window.isAutoPreviewEnabled;
    bluebirdStorage.setItem('bluebird_auto_preview', window.isAutoPreviewEnabled);

    const btn = document.getElementById('auto-preview-btn');
    if (window.isAutoPreviewEnabled) {
        document.body.classList.add('auto-preview-enabled');
        if (btn) btn.classList.add('active');
    } else {
        document.body.classList.remove('auto-preview-enabled');
        if (btn) btn.classList.remove('active');
    }
};

// 4. เสียบปุ่มเข้าไปในแถบด้านบน (ข้างๆ ปุ่มฟันเฟือง)


setTimeout(injectAutoPreviewButton, 300);
// =======================================================
// 🌟 MASTER PATCH V.60 + V.62: Settings Gear & Auto Motion Engine (FIXED) 🌟
// =======================================================

// 1. สร้างปุ่มฟันเฟือง (V.60)

setTimeout(injectSettingsButton, 200);

// 2. ล้าง CSS เก่าที่ชนกันทิ้งให้หมด
if (document.getElementById('bluebird-v61-styles')) document.getElementById('bluebird-v61-styles').remove();
if (document.getElementById('bluebird-v62-styles')) document.getElementById('bluebird-v62-styles').remove();

// 3. CSS เครื่องยนต์ Auto Motion


// 4. ระบบเปิด/ปิด Auto Preview Button
window.isAutoPreviewEnabled = bluebirdStorage.getItem('bluebird_auto_preview') === 'true';
if (window.isAutoPreviewEnabled) document.body.classList.add('auto-preview-enabled');

window.toggleAutoPreview = function () {
    window.isAutoPreviewEnabled = !window.isAutoPreviewEnabled;
    bluebirdStorage.setItem('bluebird_auto_preview', window.isAutoPreviewEnabled);

    const btn = document.getElementById('auto-preview-btn');
    if (window.isAutoPreviewEnabled) {
        document.body.classList.add('auto-preview-enabled');
        if (btn) btn.classList.add('active');
    } else {
        document.body.classList.remove('auto-preview-enabled');
        if (btn) btn.classList.remove('active');
    }
};


setTimeout(injectAutoPreviewButton, 300);

// 5. คืนสิทธิ์ให้เมาส์สครับ (Scrub) ทำงาน (แก้ไขจุดที่บั๊กแล้ว 100%)
handleScrub = function (e, element, totalFrames = 20) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));

    const frameIndex = Math.floor(percent * (totalFrames - 1));
    const yPos = frameIndex * (100 / (totalFrames - 1));

    // 🛑 เอาตัว Backslash ที่สร้างปัญหาออกให้แล้วครับ 🛑
    element.style.setProperty('background-position', `0% ${yPos}%`, 'important');

    const scrubLine = element.querySelector('.scrub-line');
    if (scrubLine) scrubLine.style.width = (percent * 100) + '%';
};

resetScrub = function (element) {
    element.style.removeProperty('background-position');
    const scrubLine = element.querySelector('.scrub-line');
    if (scrubLine) scrubLine.style.width = '0%';
};

// 6. เดินเครื่องยนต์ Auto Motion Engine
if (window.autoPreviewInterval) clearInterval(window.autoPreviewInterval);
window.bluebirdCurrentAutoFrame = 0;

window.autoPreviewInterval = setInterval(() => {
    if (window.isAutoPreviewEnabled) {
        window.bluebirdCurrentAutoFrame++;
        if (window.bluebirdCurrentAutoFrame > 19) window.bluebirdCurrentAutoFrame = 0;
        document.body.style.setProperty('--auto-frame', window.bluebirdCurrentAutoFrame);
    }
}, 80);
// =======================================================
// 🌟 MASTER PATCH V.62.1: Speed Boost (เร่งสปีด Auto Preview) 🌟
// =======================================================

if (window.autoPreviewInterval) clearInterval(window.autoPreviewInterval);
window.bluebirdCurrentAutoFrame = 0;

window.autoPreviewInterval = setInterval(() => {
    if (window.isAutoPreviewEnabled) {
        window.bluebirdCurrentAutoFrame++;
        if (window.bluebirdCurrentAutoFrame > 19) window.bluebirdCurrentAutoFrame = 0;

        document.body.style.setProperty('--auto-frame', window.bluebirdCurrentAutoFrame);
    }
}, 80); // 👈 จุดเร่งสปีด! (เปลี่ยนจาก 80 เป็น 45) ยิ่งตัวเลขน้อย = ยิ่งเร็ว
// =======================================================
// 🌟 MASTER PATCH V.64: CEP Zoom Lock (ล็อคหน้าจอ ป้องกันตัวหนังสือหด/ขยาย) 🌟
// =======================================================

// 1. 🛡️ บล็อคการกดปุ่ม Ctrl + ลูกกลิ้งเมาส์ (Mouse Wheel Zoom)
document.addEventListener('wheel', function (e) {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
    }
}, { passive: false });

// 2. 🛡️ บล็อคการกดปุ่มคีย์บอร์ด Ctrl + เครื่องหมาย บวก/ลบ/ศูนย์ (Keyboard Zoom)
document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '-' || e.key === '0')) {
        e.preventDefault();
    }
});

// 3. 🛡️ ฝัง CSS บังคับล็อคขนาดฟอนต์ฐานให้ตายตัว ไม่ให้แกว่งตามความละเอียดจอ (High DPI)
if (document.getElementById('bluebird-v64-styles')) document.getElementById('bluebird-v64-styles').remove();
const lockZoomCss = `
            html, body {
                /* บังคับล็อค Base Font Size เอาไว้ที่ 13px เสมอ */
                font-size: 13px !important;
                
                /* ปิดระบบขยายตัวหนังสืออัตโนมัติของเบราว์เซอร์ */
                -webkit-text-size-adjust: 100% !important;
                text-size-adjust: 100% !important;
            }
        `;
const styleSheetZoom = document.createElement("style");
styleSheetZoom.id = 'bluebird-v64-styles';
styleSheetZoom.innerText = lockZoomCss;
document.head.appendChild(styleSheetZoom);
// =======================================================
// 🌟 MASTER PATCH V.66: Universal GPU Engine (ระบบทดเกียร์อัตโนมัติ รองรับทุกสเปค) 🌟
// =======================================================

// =======================================================
// 🌟 MASTER PATCH V.68: Right-Click Generate Previews (สแกนพรีวิวเฉพาะโฟลเดอร์) 🌟
// =======================================================

// 1. แอบฝังปุ่ม "สร้างพรีวิว" ลงไปในเมนูคลิกขวาเดิม
if (!document.getElementById('menu-generate-preview-btn')) {
    const menu = document.getElementById('context-menu');
    if (menu) {
        const divider = menu.querySelector('.context-divider');
        if (divider) {
            // ใช้สีเขียวมินิมอล (#10b981) เพื่อให้ดูปลอดภัยและเข้ากับธีม
            const genBtnHtml = `<div id="menu-generate-preview-btn" class="context-item" style="color: #10b981;" onclick="triggerContextGeneratePreview()">🔄 สร้างพรีวิวเสียง/วิดีโอ (Generate Previews)</div>`;
            divider.insertAdjacentHTML('beforebegin', genBtnHtml);
        }
    }
}

// 2. แฮกสมองกลเมนูคลิกขวา ให้เปิด/ปิดปุ่มนี้ให้ถูกจังหวะ
if (typeof window.oldShowContextMenuV68 === 'undefined') {
    window.oldShowContextMenuV68 = showContextMenu;
    showContextMenu = function (e, targetPath, element, type = 'folder') {
        // เรียกใช้ฟังก์ชันเมนูเดิมก่อน
        window.oldShowContextMenuV68(e, targetPath, element, type);

        // คุมการโชว์ปุ่มสร้างพรีวิว
        const genBtn = document.getElementById('menu-generate-preview-btn');
        if (genBtn) {
            // 🛑 ป้องกันชั้นที่ 1: อนุญาตให้โชว์ปุ่มนี้ เฉพาะตอนที่คลิกขวาบน "โฟลเดอร์" เท่านั้น (ไฟล์หรือไลบรารี่หลักห้ามโชว์)
            if (type === 'main-folder' || type === 'sub-folder') {
                genBtn.style.display = 'block';
            } else {
                genBtn.style.display = 'none';
            }
        }
    };
}

// 3. ฟังก์ชันลงมือสแกน + ระบบป้องกันการกดพลาด
// =======================================================
// 🌟 MASTER PATCH V.69: Auto-Heal & Duplicate Fix (แก้บั๊กรูปลงซ้อน 2 อัน) 🌟
// =======================================================

if (typeof window.oldLoadSavedFoldersV69 === 'undefined') {
    window.oldLoadSavedFoldersV69 = loadSavedFolders;

    loadSavedFolders = function () {
        // 1. 🧹 สมองกล Auto-Heal: ตรวจจับและลบโฟลเดอร์ย่อยที่แอบหลุดเข้าไปในความจำ
        let savedList = JSON.parse(bluebirdStorage.getItem('bluebird_folders')) || [];
        let cleanList = savedList.filter((item, index, arr) => {
            if (typeof item === 'object') return true; // ถ้าเป็นไลบรารี่หลัก (แถบดำ) ปล่อยผ่าน

            // เช็คว่าไอเทมนี้ เป็น "ซับโฟลเดอร์" ของโฟลเดอร์หลักอันอื่นในลิสต์หรือไม่?
            let isSubfolder = arr.some(parent => {
                if (typeof parent === 'string' && parent !== item) {
                    // ทำความสะอาด Path ป้องกันเรื่อง Slash กลับด้าน
                    let cleanParent = parent.replace(/[\\\\/]+$/, '') + '\\\\';
                    let cleanItem = item.replace(/[\\\\/]+$/, '') + '\\\\';
                    return cleanItem.startsWith(cleanParent);
                }
                return false;
            });

            return !isSubfolder; // ถ้าจับได้ว่าเป็นซับโฟลเดอร์ซ้ำซ้อน ให้เตะทิ้งไปเลย!
        });

        // ถ้าระบบจับได้ว่ามีของแปลกปลอมซ่อนอยู่ ให้เซฟความจำทับใหม่ทันที
        if (cleanList.length !== savedList.length) {
            bluebirdStorage.setItem('bluebird_folders', JSON.stringify(cleanList));
        }

        // 2. รันฟังก์ชันวาดเมนูด้านซ้ายตามปกติ
        window.oldLoadSavedFoldersV69();

        // 3. 🧹 สมองกล Deduplicate: กวาดล้างไฟล์ที่แสดงผลซ้ำซ้อนในหน้าต่างขวา (Asset Grid)
        setTimeout(() => {
            const uniqueFiles = [];
            const seenPaths = new Set();

            allFiles.forEach(file => {
                // ถ้ายังไม่เคยมีไฟล์นี้ (ดูจากที่อยู่ไฟล์เป๊ะๆ) ค่อยอนุญาตให้โชว์
                if (!seenPaths.has(file.fullPath)) {
                    seenPaths.add(file.fullPath);
                    uniqueFiles.push(file);
                }
            });

            // อัปเดตรายชื่อไฟล์ให้เหลือแต่อันที่ไม่ซ้ำ แล้วสั่งวาดหน้าจอการ์ดใหม่
            if (allFiles.length !== uniqueFiles.length) {
                allFiles = uniqueFiles;
                if (currentSelectedDir) {
                    renderGrid();
                    if (typeof changeGridSize === "function") {
                        changeGridSize(document.getElementById('size-slider').value);
                    }
                }
            }
        }, 100); // ดีเลย์นิดนึงให้ระบบเดิมวาดเสร็จก่อน แล้วค่อยตามไปกวาด
    };

    // ปลุกสมองกลให้ทำงานทันที 1 รอบ เพื่อล้างความจำที่ตกค้างอยู่ของอาจารย์
    loadSavedFolders();
}
// =======================================================
// 🌟 MASTER PATCH V.70: Safe URL Encoding (แก้บั๊กภาพดำ/เพลงไม่เล่นเพราะเครื่องหมาย #) 🌟
// =======================================================

// 1. ฟังก์ชันตัวกรองเวทมนตร์: แปลงเครื่องหมายแปลกๆ ให้เป็นภาษาที่เบราว์เซอร์เข้าใจ
window.encodeSafeUrl = function (rawPath) {
    if (!rawPath) return "";
    // แปลง \ เป็น / ก่อน
    // แล้วเข้ารหัส # เป็น %23, % เป็น %25, ? เป็น %3F
    return rawPath.replace(/\\/g, '/')
        .replace(/%/g, '%25')
        .replace(/#/g, '%23')
        .replace(/\?/g, '%3F');
};

// 2. แฮกเครื่องเล่นเพลง (playAsset) ให้ใช้ตัวกรองเวทมนตร์
playAsset = function (fileData, cardElement, autoPlay = true) {
    // เช็คโล่ป้องกันจาก V.15
    if (typeof isAddingToTimelineLock !== 'undefined' && isAddingToTimelineLock) return;

    document.querySelectorAll('.card').forEach(el => el.classList.remove('playing'));
    if (cardElement) cardElement.classList.add('playing');
    currentPlayingFile = fileData;

    const btnAdd = document.getElementById('btn-add-selected');
    if (btnAdd) btnAdd.disabled = false;

    // 🌟 จุดแก้บั๊ก: สวมชุดเกราะให้ที่อยู่ไฟล์เสียง (Safe URL)
    const audioSrc = "file:///" + window.encodeSafeUrl(fileData.fullPath);

    const isAudio = ['.wav', '.mp3'].includes(fileData.ext.toLowerCase());
    const panel = document.getElementById('audio-player-panel');
    const grid = document.getElementById('asset-grid');

    if (panel) {
        if (isAudio) {
            panel.style.display = 'flex';
            if (grid) grid.style.paddingBottom = '180px';

            const revCheck = document.getElementById('reverse-checkbox');
            if (revCheck) revCheck.checked = false;
            document.getElementById('audio-waveform-area').style.transform = 'none';

            const waveformCanvas = document.getElementById('waveform-canvas');
            if (waveformCanvas) waveformCanvas.style.transform = 'none';

            if (typeof reversedBlobUrl !== 'undefined' && reversedBlobUrl) { URL.revokeObjectURL(reversedBlobUrl); reversedBlobUrl = null; }

            // Node.js ไม่กลัว # เลยส่งดิบๆ ได้
            if (typeof loadAndDrawWaveform === "function") loadAndDrawWaveform(fileData.fullPath);

            // เบราว์เซอร์กลัว # เราเลยต้องส่งตัวที่แปลงแล้วไปให้
            if (audioPlayer.src !== audioSrc) audioPlayer.src = audioSrc;

            if (autoPlay) { audioPlayer.play().catch(e => console.log(e)); }
            else {
                audioPlayer.pause(); audioPlayer.currentTime = 0;
                const playhead = document.getElementById('audio-playhead');
                if (playhead) playhead.style.left = '0%';
            }
        } else {
            panel.style.display = 'none';
            if (grid) grid.style.paddingBottom = '20px';
            audioPlayer.pause(); audioPlayer.src = "";
        }
    }
    // ป้องกันสถานะลูป V.35
    if (typeof audioPlayer !== 'undefined' && typeof window.isAudioLooping !== 'undefined') {
        audioPlayer.loop = window.isAudioLooping;
    }
};

// 3. แฮกปุ่ม Reverse (ตอนกดกลับมาเป็นเสียงปกติ ต้องใช้ Safe URL)
toggleReverse = async function () {
    const reverseCheck = document.getElementById('reverse-checkbox');
    const isRev = reverseCheck ? reverseCheck.checked : false;

    const waveformCanvas = document.getElementById('waveform-canvas');
    if (waveformCanvas) waveformCanvas.style.transform = isRev ? 'scaleX(-1)' : 'none';

    if (!originalAudioBuffer) return;
    audioPlayer.pause();

    if (isRev) {
        if (!reversedBlobUrl) {
            const ctx = getAudioContext();
            const reversedBuffer = ctx.createBuffer(originalAudioBuffer.numberOfChannels, originalAudioBuffer.length, originalAudioBuffer.sampleRate);
            for (let i = 0; i < originalAudioBuffer.numberOfChannels; i++) {
                const dest = reversedBuffer.getChannelData(i);
                const src = originalAudioBuffer.getChannelData(i);
                for (let j = 0; j < src.length; j++) dest[j] = src[src.length - 1 - j];
            }
            reversedBlobUrl = URL.createObjectURL(audioBufferToWavBlob(reversedBuffer));
        }
        audioPlayer.src = reversedBlobUrl;
    } else {
        // 🌟 จุดแก้บั๊ก: สวมชุดเกราะให้ไฟล์ตอนสลับกลับเป็นเสียงปกติ
        audioPlayer.src = "file:///" + window.encodeSafeUrl(currentPlayingFile.fullPath);
    }

    audioPlayer.currentTime = 0;
    const playhead = document.getElementById('audio-playhead');
    if (playhead) {
        playhead.style.transition = 'none';
        playhead.style.left = '0%';
            playhead.style.opacity = '0';
        if (typeof playheadAnimTimer !== 'undefined' && playheadAnimTimer) clearTimeout(playheadAnimTimer);
    }

    audioPlayer.play().catch(e => console.log(e));
};

// 4. แฮกกระดานวาดรูป (renderGrid) ให้โชว์รูปภาพที่มีตัว # ได้
renderGrid = function () {
    const grid = document.getElementById('asset-grid');
    grid.innerHTML = '';
    const searchTerm = document.getElementById('search').value.toLowerCase().trim();

    if (!currentSelectedDir && searchTerm === '' && !showOnlyFavorites) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-light); margin-top: 40px;">โปรดเลือกโฟลเดอร์จากคลังสื่อ</p>';
        return;
    }

    let filtered = allFiles.filter(file => {
        let fType = 'video';
        if (file.type === 'Audio') fType = 'audio';
        else if (file.type === 'Image') fType = 'image';
        else if (file.type === 'Graphics') fType = 'mogrt';

        if (!activeTypeFilters[fType]) return false;
        if (showOnlyFavorites) return favorites.includes(file.fullPath);

        let isMatchPath = false;
        if (currentSelectedDir) {
            const cleanDir = currentSelectedDir.replace(/\\\\/g, '\\');
            isMatchPath = (file.dir === cleanDir);
        } else {
            isMatchPath = true;
        }

        if (searchTerm !== '') {
            return isMatchPath && file.name.toLowerCase().includes(searchTerm);
        }
        return isMatchPath;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-light); margin-top: 40px;">ไม่มีไฟล์ในรายการนี้</p>';
        return;
    }

    filtered.forEach(file => {
        const card = document.createElement('div');
        card.className = `card`;
        card.setAttribute('oncontextmenu', `showContextMenu(event, '${file.fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this, 'file')`);

        const previewDir = path.join(file.dir, '_Blue Bird Previews');
        const previewImg = path.join(previewDir, file.name + '.png');
        const hasPreview = fs.existsSync(previewImg);
        const isVideo = ['.mp4', '.mov'].includes(file.ext.toLowerCase());
        const isGraphic = file.ext.toLowerCase() === '.mogrt';
        const isImage = ['.jpg', '.jpeg', '.png'].includes(file.ext.toLowerCase());
        const hasScrub = isVideo || isGraphic;

        let bgStyle = '';

        // 🌟 จุดแก้บั๊ก: สวมชุดเกราะให้ลิงก์รูปภาพทั้งหมด!
        const safeFilePath = window.encodeSafeUrl(file.fullPath);
        const safePreviewPath = window.encodeSafeUrl(previewImg);

        if (isImage) {
            bgStyle = `background-image: url('file:///${hasPreview ? safePreviewPath : safeFilePath}?t=${Date.now()}'); background-size: contain; background-repeat: no-repeat; background-position: center; background-color: var(--waveform-bg);`;
        } else if (hasPreview) {
            bgStyle = hasScrub
                ? `background-image: url('file:///${safePreviewPath}?t=${Date.now()}'); background-size: 100% 1000%; background-position: 0% 55.55%;`
                : `background-image: url('file:///${safePreviewPath}?t=${Date.now()}'); background-size: 100% 100%; background-position: center; background-color: var(--waveform-bg);`;
        }

        if (currentPlayingFile && currentPlayingFile.fullPath === file.fullPath) card.classList.add('playing');

        let badgeClass = isVideo ? 'badge video' : (isGraphic ? 'badge mogrt' : (isImage ? 'badge image' : 'badge audio'));
        let badgeText = isVideo ? 'VIDEO' : (isGraphic ? 'MOGRT' : (isImage ? 'IMAGE' : 'AUDIO'));
        let iconPlaceholder = (hasPreview || isImage) ? '' : `<div class="icon-center">${isVideo ? '🎬' : (isGraphic ? '📝' : '🎵')}</div>`;
        const scrubLineHtml = hasScrub ? `<div class="scrub-line"></div>` : '';

        const scrubAction = (isVideo || isGraphic) ? 20 : 10;
        const mouseEvents = hasScrub ? `onmousemove="handleScrub(event, this, ${scrubAction})" onmouseleave="resetScrub(this)" style="cursor: ew-resize;"` : `style="cursor: pointer;"`;

        const isFav = favorites.includes(file.fullPath);
        const starClass = isFav ? "star-icon active" : "star-icon";

        card.innerHTML = `
                    <div class="card-waveform-container" style="position: relative;">
                        <div class="card-waveform ${hasScrub ? 'scrub-20-frames' : ''}" style="${bgStyle}" ${mouseEvents}>
                            ${iconPlaceholder}
                            ${scrubLineHtml}
                        </div>
                    </div>
                    <div class="card-info" style="gap: 5px;">
                        <span class="${starClass}" style="margin-right: 0;" onclick="toggleFavorite('${file.fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', event)">★</span>
                        <div class="card-title" title="${file.name}">${file.name}</div>
                        <span class="${badgeClass}">${badgeText}</span>
                    </div>
                `;
        let clickTimer = null;
        card.onclick = (e) => {
            if (e.target.classList.contains('star-icon')) return;
            if (clickTimer) clearTimeout(clickTimer);
            clickTimer = setTimeout(() => { playAsset(file, card, true); }, 250);
        };
        card.ondblclick = (e) => {
            if (e.target.classList.contains('star-icon')) return;
            if (clickTimer) clearTimeout(clickTimer);
            playAsset(file, card, false); addSelectedToTimeline();
        };
        grid.appendChild(card);
    });

    setTimeout(() => { if (typeof changeGridSize === "function") changeGridSize(document.getElementById('size-slider').value); }, 10);
};

// 5. แถม! ป้องกันบั๊กหน้าปกอัลบั้มดำ ถ้าตั้งชื่อโฟลเดอร์มีเครื่องหมาย #
window.updateAlbumBanner = function (dirPath) {
    const bannerContainer = document.getElementById('album-banner-container');
    const bannerContent = document.getElementById('album-banner-content');
    if (!bannerContainer || !dirPath) return;

    let foundCover = null;
    const directCover = path.join(dirPath, '_album_cover.jpg');

    if (fs.existsSync(directCover)) {
        foundCover = directCover;
    } else {
        let subSettings = JSON.parse(bluebirdStorage.getItem('bluebird_album_subs')) || {};
        let currentCheck = dirPath;
        while (currentCheck && currentCheck !== path.dirname(currentCheck)) {
            currentCheck = path.dirname(currentCheck);
            if (subSettings[currentCheck] === true) {
                const parentCover = path.join(currentCheck, '_album_cover.jpg');
                if (fs.existsSync(parentCover)) {
                    foundCover = parentCover;
                    break;
                }
            }
        }
    }

    const targetCoverId = foundCover ? foundCover : 'NONE';
    const currentCoverAttr = bannerContainer.getAttribute('data-current-cover');

    if (currentCoverAttr === targetCoverId) return;

    bannerContainer.setAttribute('data-current-cover', targetCoverId);

    if (foundCover) {
        bannerContainer.style.display = 'flex';
        bannerContainer.style.border = 'none';

        // 🌟 จุดแก้บั๊ก: สวมชุดเกราะให้รูปลิงก์หน้าปก
        const safeUrl = window.encodeSafeUrl(foundCover);

        bannerContent.style.animation = 'none';
        bannerContent.offsetHeight;

        bannerContent.style.backgroundImage = `url('file:///${safeUrl}?v=${window.bluebirdCoverVer}')`;
        bannerContent.innerHTML = '';
        bannerContent.style.animation = 'bannerFadeIn 0.8s ease-out forwards';
    } else {
        bannerContainer.style.display = 'none';
        bannerContent.style.backgroundImage = 'none';
    }
};
// =======================================================
// 🌟 MASTER PATCH V.73: Targeted Scan & No-Ghost Fix (แก้ต้นตอโฟลเดอร์ย่อยงอกถาวร) 🌟
// =======================================================

// 1. ฟังก์ชันคลิกขวาสั่งสร้างพรีวิว (ฝังธงพิเศษบอกว่านี่คือสแกนเฉพาะกิจ)

// 2. ปรับแต่งเตาอบ startGeneratingPreviews ให้เคารพธง isTargetedScan
if (typeof window.oldStartGenV73 === 'undefined') {
    window.oldStartGenV73 = startGeneratingPreviews;

}
// =======================================================
// 🌟 MASTER PATCH V.74: Folder Cards Grid (โชว์การ์ดโฟลเดอร์ย่อยเมื่อไม่มีไฟล์สื่อ) 🌟
// =======================================================

// 1. สร้างระบบ "มุดโฟลเดอร์" (เมื่อดับเบิ้ลคลิกที่การ์ดโฟลเดอร์ ให้มันกางแถบซ้ายอัตโนมัติ)
window.navigateToFolder = function (targetPath) {
    // ทำความสะอาดชื่อ Path ให้ตรงกับระบบของแถบเมนูด้านซ้าย
    const safePath = targetPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const sidebarLabel = document.querySelector(`.folder-label[data-path="${safePath}"]`);

    if (sidebarLabel) {
        // สั่งกางโฟลเดอร์แม่ (ร่ม) ทุกชั้นที่ครอบมันอยู่
        let parentUl = sidebarLabel.closest('.tree-children');
        while (parentUl) {
            parentUl.style.display = 'block';
            const parentLabel = parentUl.previousElementSibling;
            if (parentLabel) {
                const caret = parentLabel.querySelector('.caret');
                if (caret) caret.classList.add('caret-down');
            }
            parentUl = parentUl.parentElement.closest('.tree-children');
        }

        // สั่งคลิกเลือกโฟลเดอร์นั้น
        if (typeof selectFolder === 'function') {
            selectFolder(targetPath, sidebarLabel.querySelector('.folder-name') || sidebarLabel);
        }

        // เลื่อนหน้าจอแถบซ้ายให้โฟลเดอร์ที่เราเพิ่งมุดเข้ามา อยู่ตรงกลางจอพอดีแบบสมูทๆ
        sidebarLabel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        // เผื่อเหนียว ถ้าหาแถบซ้ายไม่เจอ ก็บังคับเปิดฝั่งขวาไปเลย
        currentSelectedDir = targetPath;
        if (typeof renderGrid === 'function') renderGrid();
    }
};

// 2. แฮกกระดานวาดรูป (renderGrid) ให้โชว์โฟลเดอร์แทน เมื่อไม่พบไฟล์สื่อ!
window.oldRenderGridV74 = renderGrid; // เก็บของเก่าไว้เผื่อฉุกเฉิน
renderGrid = function () {
    const grid = document.getElementById('asset-grid');
    grid.innerHTML = '';
    const searchTerm = document.getElementById('search').value.toLowerCase().trim();

    if (!currentSelectedDir && searchTerm === '' && !showOnlyFavorites) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-light); margin-top: 40px;">โปรดเลือกโฟลเดอร์จากคลังสื่อ</p>';
        return;
    }

    // กรองหาไฟล์สื่อตามปกติ
    let filtered = allFiles.filter(file => {
        let fType = 'video';
        if (file.type === 'Audio') fType = 'audio';
        else if (file.type === 'Image') fType = 'image';
        else if (file.type === 'Graphics') fType = 'mogrt';

        if (!activeTypeFilters[fType]) return false;
        if (showOnlyFavorites) return favorites.includes(file.fullPath);

        let isMatchPath = false;
        if (currentSelectedDir) {
            const cleanDir = currentSelectedDir.replace(/\\\\/g, '\\');
            isMatchPath = (file.dir === cleanDir);
        } else {
            isMatchPath = true;
        }

        if (searchTerm !== '') {
            return isMatchPath && file.name.toLowerCase().includes(searchTerm);
        }
        return isMatchPath;
    });

    // 🌟 พระเอกอยู่ตรงนี้: ถ้าค้นหาแล้ว "ไม่มีไฟล์สื่อ" ให้ลองดึง "โฟลเดอร์ย่อย" มาโชว์! 🌟
    if (filtered.length === 0) {
        let foundSubFolders = false;

        // จะดึงโฟลเดอร์ย่อยมาโชว์ ก็ต่อเมื่อ "ไม่ได้กำลังพิมพ์ค้นหา" และ "ไม่ได้อยู่ในโหมดรายการโปรด"
        if (currentSelectedDir && searchTerm === '' && !showOnlyFavorites) {
            try {
                const fs = require('fs');
                const path = require('path');
                // อ่านไฟล์แบบน้ำตื้น (Shallow Read) กินแรมน้อยมาก
                const items = fs.readdirSync(currentSelectedDir, { withFileTypes: true });
                // กรองเอาเฉพาะที่เปน Directory และซ่อนโฟลเดอร์ระบบพรีวิว
                const subdirs = items.filter(i => i.isDirectory() && i.name !== '_Blue Bird Previews');

                if (subdirs.length > 0) {
                    foundSubFolders = true;

                    // วาดการ์ดโฟลเดอร์ทีละอัน
                    subdirs.forEach(dir => {
                        const fullPath = path.join(currentSelectedDir, dir.name);
                        const card = document.createElement('div');
                        card.className = `card`;

                        // ไอคอนโฟลเดอร์ยักษ์กลางการ์ด
                        const folderSvgBig = `<svg viewBox="0 0 24 24" width="45" height="45" fill="var(--text-light)" style="transition: fill 0.2s;"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`;

                        card.innerHTML = `
                                    <div class="card-waveform-container" style="background-color: var(--card-bg); display: flex; align-items: center; justify-content: center;">
                                        ${folderSvgBig}
                                    </div>
                                    <div class="card-info" style="justify-content: center; border-top: 1px solid var(--border-color);">
                                        <div class="card-title" title="${dir.name}" style="text-align: center; font-weight: 500; font-size: 13px;">${dir.name}</div>
                                    </div>
                                `;

                        // เอฟเฟกต์ตอนเอาเมาส์ชี้ (เปลี่ยนสีแฟ้มเป็นสีฟ้า)
                        card.onmouseenter = () => { card.querySelector('svg').style.fill = 'var(--accent-color)'; };
                        card.onmouseleave = () => { card.querySelector('svg').style.fill = 'var(--text-light)'; };

                        // 🌟 เมื่อดับเบิ้ลคลิก ให้มุดเข้าไปในโฟลเดอร์นั้นทันที!
                        card.ondblclick = (e) => {
                            window.navigateToFolder(fullPath);
                        };

                        grid.appendChild(card);
                    });
                }
            } catch (e) { console.error("Error loading subfolders:", e); }
        }

        // ถ้ามุดมาจนสุดทางแล้ว ไม่มีทั้งโฟลเดอร์ย่อย และไม่มีทั้งไฟล์สื่อจริงๆ ค่อยโชว์ข้อความนี้
        if (!foundSubFolders) {
            // ใช้คำที่ดูซอฟต์และเป็นมิตรขึ้น
            grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-light); margin-top: 40px;">โฟลเดอร์นี้ว่างเปล่า (ไม่มีไฟล์สื่อ)</p>';
        }

        setTimeout(() => { if (typeof changeGridSize === "function") changeGridSize(document.getElementById('size-slider').value); }, 10);
        return; // จบการทำงาน เพราะไม่มีไฟล์สื่อต้องวาดต่อ
    }

    // ==========================================
    // โค้ดด้านล่างนี้คือระบบวาดการ์ด "ไฟล์สื่อ" ตัวเดิมของ V.70 ครับ
    // ==========================================
    filtered.forEach(file => {
        const card = document.createElement('div');
        card.className = `card`;
        card.setAttribute('oncontextmenu', `showContextMenu(event, '${file.fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this, 'file')`);

        const path = require('path');
        const fs = require('fs');
        const previewDir = path.join(file.dir, '_Blue Bird Previews');
        const previewImg = path.join(previewDir, file.name + '.png');
        const hasPreview = fs.existsSync(previewImg);
        const isVideo = ['.mp4', '.mov'].includes(file.ext.toLowerCase());
        const isGraphic = file.ext.toLowerCase() === '.mogrt';
        const isImage = ['.jpg', '.jpeg', '.png'].includes(file.ext.toLowerCase());
        const hasScrub = isVideo || isGraphic;

        let bgStyle = '';

        const safeFilePath = window.encodeSafeUrl(file.fullPath);
        const safePreviewPath = window.encodeSafeUrl(previewImg);

        if (isImage) {
            bgStyle = `background-image: url('file:///${hasPreview ? safePreviewPath : safeFilePath}?t=${Date.now()}'); background-size: contain; background-repeat: no-repeat; background-position: center; background-color: var(--waveform-bg);`;
        } else if (hasPreview) {
            bgStyle = hasScrub
                ? `background-image: url('file:///${safePreviewPath}?t=${Date.now()}'); background-size: 100% 1000%; background-position: 0% 55.55%;`
                : `background-image: url('file:///${safePreviewPath}?t=${Date.now()}'); background-size: 100% 100%; background-position: center; background-color: var(--waveform-bg);`;
        }

        if (currentPlayingFile && currentPlayingFile.fullPath === file.fullPath) card.classList.add('playing');

        let badgeClass = isVideo ? 'badge video' : (isGraphic ? 'badge mogrt' : (isImage ? 'badge image' : 'badge audio'));
        let badgeText = isVideo ? 'VIDEO' : (isGraphic ? 'MOGRT' : (isImage ? 'IMAGE' : 'AUDIO'));
        let iconPlaceholder = (hasPreview || isImage) ? '' : `<div class="icon-center">${isVideo ? '🎬' : (isGraphic ? '📝' : '🎵')}</div>`;
        const scrubLineHtml = hasScrub ? `<div class="scrub-line"></div>` : '';

        const scrubAction = (isVideo || isGraphic) ? 20 : 10;
        const mouseEvents = hasScrub ? `onmousemove="handleScrub(event, this, ${scrubAction})" onmouseleave="resetScrub(this)" style="cursor: ew-resize;"` : `style="cursor: pointer;"`;

        const isFav = favorites.includes(file.fullPath);
        const starClass = isFav ? "star-icon active" : "star-icon";

        card.innerHTML = `
                    <div class="card-waveform-container" style="position: relative;">
                        <div class="card-waveform ${hasScrub ? 'scrub-20-frames' : ''}" style="${bgStyle}" ${mouseEvents}>
                            ${iconPlaceholder}
                            ${scrubLineHtml}
                        </div>
                    </div>
                    <div class="card-info" style="gap: 5px;">
                        <span class="${starClass}" style="margin-right: 0;" onclick="toggleFavorite('${file.fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', event)">★</span>
                        <div class="card-title" title="${file.name}">${file.name}</div>
                        <span class="${badgeClass}">${badgeText}</span>
                    </div>
                `;
        let clickTimer = null;
        card.onclick = (e) => {
            if (e.target.classList.contains('star-icon')) return;
            if (clickTimer) clearTimeout(clickTimer);
            clickTimer = setTimeout(() => { playAsset(file, card, true); }, 250);
        };
        card.ondblclick = (e) => {
            if (e.target.classList.contains('star-icon')) return;
            if (clickTimer) clearTimeout(clickTimer);
            playAsset(file, card, false); addSelectedToTimeline();
        };
        grid.appendChild(card);
    });

    setTimeout(() => { if (typeof changeGridSize === "function") changeGridSize(document.getElementById('size-slider').value); }, 10);
};
// =======================================================
// 🌟 MASTER PATCH V.78: Full Folder List UI + Zebra Striping 🌟
// =======================================================

// 1. สาด CSS ควบคุมความสวยงาม บีบช่องไฟ และจัดเรียงแนวนอน
if (document.getElementById('bluebird-v76-styles')) document.getElementById('bluebird-v76-styles').remove();
if (document.getElementById('bluebird-v77-styles')) document.getElementById('bluebird-v77-styles').remove();
if (!document.getElementById('bluebird-v78-styles')) {
    
}

// 2. ระบบมุดเข้าโฟลเดอร์
window.navigateToFolder = function (targetPath) {
    const safePath = targetPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const sidebarLabel = document.querySelector(`.folder-label[data-path="${safePath}"]`);

    if (sidebarLabel) {
        let parentUl = sidebarLabel.closest('.tree-children');
        while (parentUl) {
            parentUl.style.display = 'block';
            const parentLabel = parentUl.previousElementSibling;
            if (parentLabel) {
                const caret = parentLabel.querySelector('.caret');
                if (caret) caret.classList.add('caret-down');
                expandedFolders.add(parentLabel.getAttribute('data-path'));
            }
            parentUl = parentUl.parentElement.closest('.tree-children');
        }
        if (typeof selectFolder === 'function') {
            selectFolder(targetPath, sidebarLabel.querySelector('.folder-name') || sidebarLabel);
        }
        sidebarLabel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        currentSelectedDir = targetPath;
        if (typeof renderGrid === 'function') renderGrid();
    }
};

// 3. เขียนทับกระดานวาดรูป ให้วาด List View สลับสีม้าลาย
window.oldRenderGridV78 = renderGrid;
renderGrid = function () {
    const grid = document.getElementById('asset-grid');
    grid.innerHTML = '';
    const searchTerm = document.getElementById('search').value.toLowerCase().trim();

    if (!currentSelectedDir && searchTerm === '' && !showOnlyFavorites) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-light); margin-top: 40px;">โปรดเลือกโฟลเดอร์จากคลังสื่อ</p>';
        return;
    }

    let filtered = allFiles.filter(file => {
        let fType = 'video';
        if (file.type === 'Audio') fType = 'audio';
        else if (file.type === 'Image') fType = 'image';
        else if (file.type === 'Graphics') fType = 'mogrt';

        if (!activeTypeFilters[fType]) return false;
        if (showOnlyFavorites) return favorites.includes(file.fullPath);

        let isMatchPath = false;
        if (currentSelectedDir) {
            const cleanDir = currentSelectedDir.replace(/\\\\/g, '\\');
            isMatchPath = (file.dir === cleanDir);
        } else {
            isMatchPath = true;
        }

        if (searchTerm !== '') {
            return isMatchPath && file.name.toLowerCase().includes(searchTerm);
        }
        return isMatchPath;
    });

    // 🌟 สร้างระบบ List View (เมื่อไม่มีไฟล์สื่อ)
    if (filtered.length === 0) {
        let foundSubFolders = false;

        if (currentSelectedDir && searchTerm === '' && !showOnlyFavorites) {
            try {
                const fs = require('fs');
                const path = require('path');
                const items = fs.readdirSync(currentSelectedDir, { withFileTypes: true });
                const subdirs = items.filter(i => i.isDirectory() && i.name !== '_Blue Bird Previews');

                if (subdirs.length > 0) {
                    foundSubFolders = true;

                    const listWrapper = document.createElement('div');
                    listWrapper.className = 'folder-list-wrapper';

                    const header = document.createElement('div');
                    header.style.width = '100%';
                    header.style.marginBottom = '2px';
                    header.style.color = 'var(--text-light)';
                    header.style.fontSize = '12px';
                    header.style.fontFamily = "'Mitr', sans-serif";
                    header.innerHTML = `📁 โฟลเดอร์ย่อย (${subdirs.length} รายการ)`;
                    listWrapper.appendChild(header);

                    // 🦓 วนลูปวาดการ์ดโฟลเดอร์ พร้อมสลับสีม้าลาย 🦓
                    subdirs.forEach((dir, index) => {
                        const fullPath = path.join(currentSelectedDir, dir.name);
                        const listCard = document.createElement('div');
                        listCard.className = 'folder-list-card';

                        listCard.setAttribute('oncontextmenu', `showContextMenu(event, '${fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this, 'sub-folder')`);

                        let ownColor = folderColors[fullPath] || '';
                        let iconColor = 'var(--text-light)';

                        // สลับสี แถวคู่สีการ์ดปกติ แถวคี่สีมืดกว่านิดนึง
                        let bgColor = (index % 2 === 0) ? 'var(--card-bg)' : 'rgba(0, 0, 0, 0.18)';

                        if (ownColor) {
                            iconColor = ownColor;
                            let r = parseInt(ownColor.slice(1, 3), 16);
                            let g = parseInt(ownColor.slice(3, 5), 16);
                            let b = parseInt(ownColor.slice(5, 7), 16);
                            bgColor = `rgba(${r}, ${g}, ${b}, 0.08)`;
                            listCard.style.setProperty('--card-color', ownColor);
                        }

                        listCard.style.setProperty('background-color', bgColor, 'important');

                        const folderSvg = `<svg class="folder-list-icon" style="fill: ${iconColor};" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`;

                        listCard.innerHTML = `
                                    ${folderSvg}
                                    <div class="folder-list-title" title="${dir.name}">${dir.name}</div>
                                    <div class="folder-list-arrow">❯</div>
                                `;

                        listCard.onmouseenter = () => {
                            listCard.querySelector('.folder-list-icon').style.fill = ownColor ? ownColor : 'var(--accent-color)';
                            listCard.querySelector('.folder-list-arrow').style.color = ownColor ? ownColor : 'var(--accent-color)';
                        };
                        listCard.onmouseleave = () => {
                            listCard.querySelector('.folder-list-icon').style.fill = iconColor;
                            listCard.querySelector('.folder-list-arrow').style.color = 'var(--text-light)';
                        };

                        // 🌟 คลิกเดียวเข้าโฟลเดอร์
                        listCard.onclick = (e) => {
                            window.navigateToFolder(fullPath);
                        };

                        listWrapper.appendChild(listCard);
                    });

                    grid.appendChild(listWrapper);
                }
            } catch (e) { console.error("Error loading subfolders:", e); }
        }

        if (!foundSubFolders) {
            grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-light); margin-top: 40px; font-family: Mitr, sans-serif;">โฟลเดอร์นี้ว่างเปล่า (ไม่มีไฟล์สื่อ)</p>';
        }

        setTimeout(() => { if (typeof changeGridSize === "function") changeGridSize(document.getElementById('size-slider').value); }, 10);
        return;
    }

    // ==========================================
    // โค้ดด้านล่างนี้คือระบบวาดการ์ด "ไฟล์สื่อ" ตัวเดิมครับ
    // ==========================================
    filtered.forEach(file => {
        const card = document.createElement('div');
        card.className = `card`;
        card.setAttribute('oncontextmenu', `showContextMenu(event, '${file.fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this, 'file')`);

        const path = require('path');
        const fs = require('fs');
        const previewDir = path.join(file.dir, '_Blue Bird Previews');
        const previewImg = path.join(previewDir, file.name + '.png');
        const hasPreview = fs.existsSync(previewImg);
        const isVideo = ['.mp4', '.mov'].includes(file.ext.toLowerCase());
        const isGraphic = file.ext.toLowerCase() === '.mogrt';
        const isImage = ['.jpg', '.jpeg', '.png'].includes(file.ext.toLowerCase());
        const hasScrub = isVideo || isGraphic;

        let bgStyle = '';
        const safeFilePath = window.encodeSafeUrl(file.fullPath);
        const safePreviewPath = window.encodeSafeUrl(previewImg);

        if (isImage) {
            bgStyle = `background-image: url('file:///${hasPreview ? safePreviewPath : safeFilePath}?t=${Date.now()}'); background-size: contain; background-repeat: no-repeat; background-position: center; background-color: var(--waveform-bg);`;
        } else if (hasPreview) {
            bgStyle = hasScrub
                ? `background-image: url('file:///${safePreviewPath}?t=${Date.now()}'); background-size: 100% 1000%; background-position: 0% 55.55%;`
                : `background-image: url('file:///${safePreviewPath}?t=${Date.now()}'); background-size: 100% 100%; background-position: center; background-color: var(--waveform-bg);`;
        }

        if (currentPlayingFile && currentPlayingFile.fullPath === file.fullPath) card.classList.add('playing');

        let badgeClass = isVideo ? 'badge video' : (isGraphic ? 'badge mogrt' : (isImage ? 'badge image' : 'badge audio'));
        let badgeText = isVideo ? 'VIDEO' : (isGraphic ? 'MOGRT' : (isImage ? 'IMAGE' : 'AUDIO'));
        let iconPlaceholder = (hasPreview || isImage) ? '' : `<div class="icon-center">${isVideo ? '🎬' : (isGraphic ? '📝' : '🎵')}</div>`;
        const scrubLineHtml = hasScrub ? `<div class="scrub-line"></div>` : '';

        const scrubAction = (isVideo || isGraphic) ? 20 : 10;
        const mouseEvents = hasScrub ? `onmousemove="handleScrub(event, this, ${scrubAction})" onmouseleave="resetScrub(this)" style="cursor: ew-resize;"` : `style="cursor: pointer;"`;

        const isFav = favorites.includes(file.fullPath);
        const starClass = isFav ? "star-icon active" : "star-icon";

        card.innerHTML = `
                    <div class="card-waveform-container" style="position: relative;">
                        <div class="card-waveform ${hasScrub ? 'scrub-20-frames' : ''}" style="${bgStyle}" ${mouseEvents}>
                            ${iconPlaceholder}
                            ${scrubLineHtml}
                        </div>
                    </div>
                    <div class="card-info" style="gap: 5px;">
                        <span class="${starClass}" style="margin-right: 0;" onclick="toggleFavorite('${file.fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', event)">★</span>
                        <div class="card-title" title="${file.name}">${file.name}</div>
                        <span class="${badgeClass}">${badgeText}</span>
                    </div>
                `;
        let clickTimer = null;
        card.onclick = (e) => {
            if (e.target.classList.contains('star-icon')) return;
            if (clickTimer) clearTimeout(clickTimer);
            clickTimer = setTimeout(() => { playAsset(file, card, true); }, 250);
        };
        card.ondblclick = (e) => {
            if (e.target.classList.contains('star-icon')) return;
            if (clickTimer) clearTimeout(clickTimer);
            playAsset(file, card, false); addSelectedToTimeline();
        };
        grid.appendChild(card);
    });

    setTimeout(() => { if (typeof changeGridSize === "function") changeGridSize(document.getElementById('size-slider').value); }, 10);
};
// =======================================================
// 🌟 MASTER PATCH V.81: Hover-to-Scroll + Black Border (FIX BUG) 🌟
// =======================================================

// 1. สร้างกล่องล่องหนสำหรับพรีวิว (กรอบดำ) และ CSS สำหรับข้อความเลื่อน
if (document.getElementById('bluebird-v79-styles')) document.getElementById('bluebird-v79-styles').remove();
if (document.getElementById('bluebird-v80-styles')) document.getElementById('bluebird-v80-styles').remove();

if (!document.getElementById('hover-cover-tooltip')) {
    const tooltip = document.createElement('div');
    tooltip.id = 'hover-cover-tooltip';
    document.body.appendChild(tooltip);
}

if (!document.getElementById('bluebird-v81-styles')) {
    
}

// 🌟 2. เอากลับมาแล้ว! ฟังก์ชันหารูปปกที่ผมลืมใส่ไปใน V.80 (ขาดตัวนี้รูปเลยดำ) 🌟
window.getFolderCoverPath = function (dirPath) {
    const fs = require('fs');
    const path = require('path');
    let foundCover = null;
    const directCover = path.join(dirPath, '_album_cover.jpg');

    if (fs.existsSync(directCover)) {
        foundCover = directCover;
    } else {
        let subSettings = JSON.parse(bluebirdStorage.getItem('bluebird_album_subs')) || {};
        let currentCheck = dirPath;
        while (currentCheck && currentCheck !== path.dirname(currentCheck)) {
            currentCheck = path.dirname(currentCheck);
            if (subSettings[currentCheck] === true) {
                const parentCover = path.join(currentCheck, '_album_cover.jpg');
                if (fs.existsSync(parentCover)) {
                    foundCover = parentCover;
                    break;
                }
            }
        }
    }
    return foundCover;
};

// 3. แฮกกระดานวาดรูป ให้รองรับกลไกทั้งหมด
window.oldRenderGridV81 = renderGrid;
renderGrid = function () {
    const grid = document.getElementById('asset-grid');
    grid.innerHTML = '';
    const searchTerm = document.getElementById('search').value.toLowerCase().trim();

    if (!currentSelectedDir && searchTerm === '' && !showOnlyFavorites) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-light); margin-top: 40px;">โปรดเลือกโฟลเดอร์จากคลังสื่อ</p>';
        return;
    }

    let filtered = allFiles.filter(file => {
        let fType = 'video';
        if (file.type === 'Audio') fType = 'audio';
        else if (file.type === 'Image') fType = 'image';
        else if (file.type === 'Graphics') fType = 'mogrt';

        if (!activeTypeFilters[fType]) return false;
        if (showOnlyFavorites) return favorites.includes(file.fullPath);

        let isMatchPath = false;
        if (currentSelectedDir) {
            const cleanDir = currentSelectedDir.replace(/\\\\/g, '\\');
            isMatchPath = (file.dir === cleanDir);
        } else {
            isMatchPath = true;
        }

        if (searchTerm !== '') {
            return isMatchPath && file.name.toLowerCase().includes(searchTerm);
        }
        return isMatchPath;
    });

    // 🌟 สร้างระบบ List View (เมื่อไม่มีไฟล์สื่อ)
    if (filtered.length === 0) {
        let foundSubFolders = false;

        if (currentSelectedDir && searchTerm === '' && !showOnlyFavorites) {
            try {
                const fs = require('fs');
                const path = require('path');
                const items = fs.readdirSync(currentSelectedDir, { withFileTypes: true });
                const subdirs = items.filter(i => i.isDirectory() && i.name !== '_Blue Bird Previews');

                if (subdirs.length > 0) {
                    foundSubFolders = true;

                    const listWrapper = document.createElement('div');
                    listWrapper.className = 'folder-list-wrapper';

                    const header = document.createElement('div');
                    header.style.width = '100%';
                    header.style.marginBottom = '2px';
                    header.style.color = 'var(--text-light)';
                    header.style.fontSize = '12px';
                    header.style.fontFamily = "'Mitr', sans-serif";
                    header.innerHTML = `📁 โฟลเดอร์ย่อย (${subdirs.length} รายการ)`;
                    listWrapper.appendChild(header);

                    subdirs.forEach((dir, index) => {
                        const fullPath = path.join(currentSelectedDir, dir.name);
                        const listCard = document.createElement('div');
                        listCard.className = 'folder-list-card';

                        listCard.setAttribute('oncontextmenu', `showContextMenu(event, '${fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this, 'sub-folder')`);

                        let ownColor = folderColors[fullPath] || '';
                        let iconColor = 'var(--text-light)';
                        let bgColor = (index % 2 === 0) ? 'var(--card-bg)' : 'rgba(0, 0, 0, 0.18)';

                        if (ownColor) {
                            iconColor = ownColor;
                            let r = parseInt(ownColor.slice(1, 3), 16);
                            let g = parseInt(ownColor.slice(3, 5), 16);
                            let b = parseInt(ownColor.slice(5, 7), 16);
                            bgColor = `rgba(${r}, ${g}, ${b}, 0.08)`;
                            listCard.style.setProperty('--card-color', ownColor);
                        }

                        listCard.style.setProperty('background-color', bgColor, 'important');

                        const folderSvg = `<svg class="folder-list-icon" style="fill: ${iconColor};" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`;

                        // 🛑 นำ title ออก เพื่อไม่ให้เกิดกล่องข้อความเทาๆ เด้งกวนใจ และใส่ span สำหรับข้อความเลื่อน
                        listCard.innerHTML = `
                                    ${folderSvg}
                                    <div class="folder-list-title">
                                        <span class="folder-list-title-inner">${dir.name}</span>
                                    </div>
                                    <div class="folder-list-arrow">❯</div>
                                `;

                        listCard.onmouseenter = () => {
                            listCard.querySelector('.folder-list-icon').style.fill = ownColor ? ownColor : 'var(--accent-color)';
                            listCard.querySelector('.folder-list-arrow').style.color = ownColor ? ownColor : 'var(--accent-color)';

                            // โชว์ภาพปก
                            const coverPath = window.getFolderCoverPath(fullPath);
                            if (coverPath) {
                                const tooltip = document.getElementById('hover-cover-tooltip');
                                if (tooltip) {
                                    const safeUrl = window.encodeSafeUrl(coverPath);
                                    tooltip.style.backgroundImage = `url('file:///${safeUrl}?v=${window.bluebirdCoverVer}')`;
                                    tooltip.style.display = 'block';
                                    setTimeout(() => { tooltip.style.opacity = '1'; }, 10);
                                }
                            }

                            // 🌟 สมองกล: คำนวณความยาวข้อความและสั่งเลื่อน
                            const titleContainer = listCard.querySelector('.folder-list-title');
                            const titleInner = listCard.querySelector('.folder-list-title-inner');

                            if (titleInner.scrollWidth > titleContainer.clientWidth) {
                                const scrollDist = titleContainer.clientWidth - titleInner.scrollWidth - 10;
                                // คำนวณความเร็วคงที่ ไม่ว่าชื่อจะยาวแค่ไหนก็ไม่ตาลาย
                                const duration = Math.max(Math.abs(scrollDist) * 0.02, 1.5);

                                titleInner.style.setProperty('--scroll-dist', scrollDist + 'px');
                                titleInner.style.setProperty('--scroll-duration', duration + 's');
                                titleInner.classList.add('needs-scroll');
                            }
                        };

                        listCard.onmousemove = (e) => {
                            const tooltip = document.getElementById('hover-cover-tooltip');
                            if (tooltip && tooltip.style.display === 'block') {
                                let x = e.clientX + 15;
                                let y = e.clientY + 15;
                                if (x + 300 > window.innerWidth) x = e.clientX - 315;
                                if (y + 66 > window.innerHeight) y = e.clientY - 80;
                                tooltip.style.left = x + 'px';
                                tooltip.style.top = y + 'px';
                            }
                        };

                        listCard.onmouseleave = () => {
                            listCard.querySelector('.folder-list-icon').style.fill = iconColor;
                            listCard.querySelector('.folder-list-arrow').style.color = 'var(--text-light)';

                            // ซ่อนและลบภาพปกออกจาก RAM
                            const tooltip = document.getElementById('hover-cover-tooltip');
                            if (tooltip) {
                                tooltip.style.opacity = '0';
                                setTimeout(() => {
                                    if (tooltip.style.opacity === '0') {
                                        tooltip.style.display = 'none';
                                        tooltip.style.backgroundImage = 'none';
                                    }
                                }, 150);
                            }

                            // รีเซ็ตข้อความให้กลับมาจุดเดิม
                            const titleInner = listCard.querySelector('.folder-list-title-inner');
                            if (titleInner) {
                                titleInner.classList.remove('needs-scroll');
                                titleInner.style.transform = 'none';
                            }
                        };

                        listCard.onclick = (e) => {
                            const tooltip = document.getElementById('hover-cover-tooltip');
                            if (tooltip) {
                                tooltip.style.opacity = '0';
                                tooltip.style.display = 'none';
                                tooltip.style.backgroundImage = 'none';
                            }
                            window.navigateToFolder(fullPath);
                        };

                        listWrapper.appendChild(listCard);
                    });

                    grid.appendChild(listWrapper);
                }
            } catch (e) { console.error("Error loading subfolders:", e); }
        }

        if (!foundSubFolders) {
            grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-light); margin-top: 40px; font-family: Mitr, sans-serif;">โฟลเดอร์นี้ว่างเปล่า (ไม่มีไฟล์สื่อ)</p>';
        }

        setTimeout(() => { if (typeof changeGridSize === "function") changeGridSize(document.getElementById('size-slider').value); }, 10);
        return;
    }

    // ==========================================
    // โค้ดด้านล่างนี้คือระบบวาดการ์ด "ไฟล์สื่อ" ตัวเดิมครับ
    // ==========================================
    filtered.forEach(file => {
        const card = document.createElement('div');
        card.className = `card`;
        card.setAttribute('oncontextmenu', `showContextMenu(event, '${file.fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', this, 'file')`);

        const path = require('path');
        const fs = require('fs');
        const previewDir = path.join(file.dir, '_Blue Bird Previews');
        const previewImg = path.join(previewDir, file.name + '.png');
        const hasPreview = fs.existsSync(previewImg);
        const isVideo = ['.mp4', '.mov'].includes(file.ext.toLowerCase());
        const isGraphic = file.ext.toLowerCase() === '.mogrt';
        const isImage = ['.jpg', '.jpeg', '.png'].includes(file.ext.toLowerCase());
        const hasScrub = isVideo || isGraphic;

        let bgStyle = '';
        const safeFilePath = window.encodeSafeUrl(file.fullPath);
        const safePreviewPath = window.encodeSafeUrl(previewImg);

        if (isImage) {
            bgStyle = `background-image: url('file:///${hasPreview ? safePreviewPath : safeFilePath}?t=${Date.now()}'); background-size: contain; background-repeat: no-repeat; background-position: center; background-color: var(--waveform-bg);`;
        } else if (hasPreview) {
            bgStyle = hasScrub
                ? `background-image: url('file:///${safePreviewPath}?t=${Date.now()}'); background-size: 100% 1000%; background-position: 0% 55.55%;`
                : `background-image: url('file:///${safePreviewPath}?t=${Date.now()}'); background-size: 100% 100%; background-position: center; background-color: var(--waveform-bg);`;
        }

        if (currentPlayingFile && currentPlayingFile.fullPath === file.fullPath) card.classList.add('playing');

        let badgeClass = isVideo ? 'badge video' : (isGraphic ? 'badge mogrt' : (isImage ? 'badge image' : 'badge audio'));
        let badgeText = isVideo ? 'VIDEO' : (isGraphic ? 'MOGRT' : (isImage ? 'IMAGE' : 'AUDIO'));
        let iconPlaceholder = (hasPreview || isImage) ? '' : `<div class="icon-center">${isVideo ? '🎬' : (isGraphic ? '📝' : '🎵')}</div>`;
        const scrubLineHtml = hasScrub ? `<div class="scrub-line"></div>` : '';

        const scrubAction = (isVideo || isGraphic) ? 20 : 10;
        const mouseEvents = hasScrub ? `onmousemove="handleScrub(event, this, ${scrubAction})" onmouseleave="resetScrub(this)" style="cursor: ew-resize;"` : `style="cursor: pointer;"`;

        const isFav = favorites.includes(file.fullPath);
        const starClass = isFav ? "star-icon active" : "star-icon";

        card.innerHTML = `
                    <div class="card-waveform-container" style="position: relative;">
                        <div class="card-waveform ${hasScrub ? 'scrub-20-frames' : ''}" style="${bgStyle}" ${mouseEvents}>
                            ${iconPlaceholder}
                            ${scrubLineHtml}
                        </div>
                    </div>
                    <div class="card-info" style="gap: 5px;">
                        <span class="${starClass}" style="margin-right: 0;" onclick="toggleFavorite('${file.fullPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', event)">★</span>
                        <div class="card-title" title="${file.name}">${file.name}</div>
                        <span class="${badgeClass}">${badgeText}</span>
                    </div>
                `;
        let clickTimer = null;
        card.onclick = (e) => {
            if (e.target.classList.contains('star-icon')) return;
            if (clickTimer) clearTimeout(clickTimer);
            clickTimer = setTimeout(() => { playAsset(file, card, true); }, 250);
        };
        card.ondblclick = (e) => {
            if (e.target.classList.contains('star-icon')) return;
            if (clickTimer) clearTimeout(clickTimer);
            playAsset(file, card, false); addSelectedToTimeline();
        };
        grid.appendChild(card);
    });

    setTimeout(() => { if (typeof changeGridSize === "function") changeGridSize(document.getElementById('size-slider').value); }, 10);
};
// =======================================================
// 🌟 MASTER PATCH V.82: UI Polish (Golden Arrows, Drag Fix & Sibling Caret) 🌟
// =======================================================

// 1. 🎨 สาด CSS เปลี่ยนสีลูกศรเป็นสีทองเวลาเอาเมาส์ชี้
if (!document.getElementById('bluebird-v82-styles')) {
    
}

// 2. 🛡️ แก้บั๊กลากเส้นคั่นแล้วเผลอหยิบโฟลเดอร์ติดมือ (แช่แข็ง Sidebar ตอนลาก)
const v82Resizer = document.getElementById('resizer');
const v82Sidebar = document.getElementById('sidebar');
if (v82Resizer && v82Sidebar) {
    v82Resizer.addEventListener('mousedown', () => {
        // ระหว่างลากเส้นคั่น ปิดการรับสัมผัสฝั่งซ้ายทั้งหมด (เมาส์จะไม่ไปโดนโฟลเดอร์)
        v82Sidebar.style.pointerEvents = 'none';
    });
    window.addEventListener('mouseup', () => {
        // ปล่อยเมาส์ปุ๊บ คืนค่าให้กลับมาใช้งาน คลิก/ลากโฟลเดอร์ ได้ปกติ
        v82Sidebar.style.pointerEvents = '';
    });
}

// 3. ✂️ แยกวงลูกศรไลบรารี่หลัก ออกจากปุ่มเปลี่ยนชื่อ (แก้บั๊กรูปดินสอเด้ง & ค้าง)
const oldLoadSavedFoldersV82 = loadSavedFolders;
loadSavedFolders = function () {
    // ปล่อยให้ระบบเดิมวาดทุกอย่างให้เสร็จก่อน
    oldLoadSavedFoldersV82();

    const menu = document.getElementById('folder-list');
    if (!menu) return;

    // วนลูปหาแถบไลบรารี่หลักทีละอัน
    Array.from(menu.children).forEach(child => {
        const title = child.querySelector('.menu-title');
        if (title) {
            const match = title.innerHTML.match(/renameLibrary\('([^']+)'\)/);
            if (match) {
                const nameGroup = title.querySelector('.lib-name-group');
                const carets = title.querySelectorAll('.lib-caret');

                if (carets.length > 0) {
                    // เก็บลูกศรตัวจริงไว้แค่ 1 อัน
                    const mainCaret = carets[0];

                    // ลบลูกศรที่อาจจะสร้างซ้อนทิ้งให้หมด
                    for (let i = 1; i < carets.length; i++) {
                        carets[i].remove();
                    }

                    // 🚀 ถอนรากถอนโคน! ย้ายลูกศรออกมาอยู่นอกกล่องชื่อ (nameGroup)
                    if (nameGroup && mainCaret.parentElement === nameGroup) {
                        title.insertBefore(mainCaret, nameGroup);
                    }

                    // จัดระยะช่องไฟใหม่ให้สวยงาม และขยายพื้นที่คลิกให้กดง่ายขึ้น
                    mainCaret.style.marginRight = '8px';
                    mainCaret.style.padding = '2px 8px 2px 0px';
                }
            }
        }
    });
};

// 🔄 ปลุกสมองกล 1 รอบเพื่อให้การแยกวงลูกศรทำงานทันที
loadSavedFolders();
// =======================================================
// 🌟 MASTER PATCH V.83: SVG Caret Engine (แก้บั๊กลูกศรเบี้ยวด้วยไอคอน SVG) 🌟
// =======================================================

// 1. สาด CSS ตกแต่ง SVG Caret ให้จัดกลางเป๊ะ และเปลี่ยนสีตอน Hover
if (!document.getElementById('bluebird-v83-styles')) {
    
}

// 2. สร้างแม่แบบไอคอนลูกศร SVG (หน้าตาหันไปทางขวา)
window.bluebirdSvgArrow = `<svg class="caret-svg" viewBox="0 0 24 24"><path d="M8.59,16.59L13.17,12L8.59,7.41L10,6l6,6l-6,6L8.59,16.59z"/></svg>`;

// 3. แฮกฟังก์ชันวาด Sidebar ซ้ายมือ เพื่อเสียบลูกศร SVG แทนตัวอักษร
if (typeof window.oldLoadSavedFoldersV83 === 'undefined') {
    window.oldLoadSavedFoldersV83 = loadSavedFolders;
    loadSavedFolders = function () {
        // ปล่อยให้ระบบเดิมวาดกล่องข้อความให้เสร็จก่อน
        window.oldLoadSavedFoldersV83();

        // 🎯 จัดการลูกศรไลบรารี่หลัก (แถบดำ)
        document.querySelectorAll('.lib-caret').forEach(caret => {
            caret.innerHTML = window.bluebirdSvgArrow;
            caret.style.transform = 'none'; // ลบคำสั่งหมุนตะแคงแกนเบี้ยวๆ ของระบบเก่าทิ้งไปเลย

            const title = caret.closest('.menu-title');
            if (title) {
                const match = title.innerHTML.match(/renameLibrary\('([^']+)'\)/);
                if (match) {
                    const libId = match[1];
                    let collapsedLibs = JSON.parse(bluebirdStorage.getItem('bluebird_collapsed_libs')) || [];
                    let isCollapsed = collapsedLibs.includes(libId);

                    const svgEl = caret.querySelector('.caret-svg');
                    if (svgEl) {
                        // 🌟 สั่งหมุนที่ตัว SVG โดยตรง: พับอยู่=ชี้ขวา(0deg) | กางอยู่=ชี้ลง(90deg)
                        svgEl.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)';
                    }
                }
            }
        });

        // 🎯 จัดการลูกศรโฟลเดอร์ย่อยด้านซ้าย (แทนที่เครื่องหมาย ▶)
        document.querySelectorAll('.caret').forEach(caret => {
            caret.innerHTML = window.bluebirdSvgArrow;
            // โฟลเดอร์ย่อยมันมี CSS เดิมชื่อ .caret-down คอยหมุนให้อยู่แล้วครับ เลยไม่ต้องเขียน JS เพิ่ม
        });
    };

    // ปลุกสมองกลให้ทำงานทันทีเพื่อเปลี่ยนหน้าตาให้ครบทุกจุด
    loadSavedFolders();
}

// 4. แฮกกระดานวาดรูปฝั่งขวา (List View) เพื่อเสียบ SVG แทนตัวอักษร ❯
if (typeof window.oldRenderGridV83 === 'undefined') {
    window.oldRenderGridV83 = renderGrid;
    renderGrid = function () {
        window.oldRenderGridV83(); // วาดทุกอย่างตามเดิม

        // ตามไปเปลี่ยนลูกศรทางขวาสุดของการ์ด
        document.querySelectorAll('.folder-list-arrow').forEach(arrow => {
            arrow.innerHTML = window.bluebirdSvgArrow;
        });
    };
}
// =======================================================
// 🌟 MASTER PATCH V.84: Larger SVG Carets (ขยายขนาดลูกศร) 🌟
// =======================================================

if (document.getElementById('bluebird-v84-styles')) {
    document.getElementById('bluebird-v84-styles').remove();
}

window.confirmLanguageChange = function(langCode, selectElement) {
    const messages = {
        en: "Are you sure you want to change the language?",
        th: "คุณต้องการเปลี่ยนภาษาของระบบใช่หรือไม่?",
        ja: "言語を変更しますか？",
        ko: "언어를 변경하시겠습니까?",
        zh: "确定要更改系统语言吗？ (Change Language?)",
        es: "¿Estás seguro de que quieres cambiar el idioma? (Change Language?)",
        fr: "Voulez-vous vraiment changer la langue du système ? (Change Language?)",
        de: "Möchten Sie die Systemsprache wirklich ändern? (Change Language?)",
        pt: "Tem certeza de que deseja alterar o idioma do sistema? (Change Language?)",
        ru: "Вы уверены, что хотите изменить язык системы? (Change Language?)",
        id: "Apakah Anda yakin ingin mengubah bahasa sistem? (Change Language?)",
        ar: "هل أنت متأكد أنك تريد تغيير لغة النظام؟ (Change Language?)"
    };
    
    // ดึงภาษาเดิมเก็บไว้ก่อน เผื่อผู้ใช้กดยกเลิก
    const prevLang = window.i18n.lang;
    
    showCustomDialog('confirm', messages[langCode] || messages.en, "", function(confirmed) {
        if (confirmed) {
            window.i18n.setLanguage(langCode);
        } else {
            selectElement.value = prevLang;
        }
    });
};


// --- What's New Modal ---
window.showWhatsNew = function() {
    const modal = document.getElementById('whats-new-modal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.style.opacity = '1', 10);
    }
};

window.closeWhatsNew = function() {
    const modal = document.getElementById('whats-new-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => modal.style.display = 'none', 300);
    }
};

window.updateSettingsButtonForPending = function(version) {
    const btnPending = document.getElementById('btn-settings-update-pending');
    if (btnPending) {
        btnPending.style.display = 'inline-flex';
        btnPending.innerText = `⭐ อัปเดตเวอร์ชัน v${version}`;
    }
};
