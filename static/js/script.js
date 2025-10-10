console.log('%cCopyright © 2024 zyyo.net',
    'background-color: #ff00ff; color: white; font-size: 24px; font-weight: bold; padding: 10px;'
);
console.log('%c   /\\_/\\', 'color: #8B4513; font-size: 20px;');
console.log('%c  ( o.o )', 'color: #8B4513; font-size: 20px;');
console.log(' %c  > ^ <', 'color: #8B4513; font-size: 20px;');
console.log('  %c /  ~ \\', 'color: #8B4513; font-size: 20px;');
console.log('  %c/______\\', 'color: #8B4513; font-size: 20px;');

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

function handlePress(event) {
    this.classList.add('pressed');
}

function handleRelease(event) {
    this.classList.remove('pressed');
}

function handleCancel(event) {
    this.classList.remove('pressed');
}

var buttons = document.querySelectorAll('.projectItem');
buttons.forEach(function (button) {
    button.addEventListener('mousedown', handlePress);
    button.addEventListener('mouseup', handleRelease);
    button.addEventListener('mouseleave', handleCancel);
    button.addEventListener('touchstart', handlePress);
    button.addEventListener('touchend', handleRelease);
    button.addEventListener('touchcancel', handleCancel);
});

function toggleClass(selector, className) {
    var elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
        element.classList.toggle(className);
    });
}

function pop(imageURL) {
    var tcMainElement = document.querySelector(".tc-img");
    if (imageURL) {
        tcMainElement.src = imageURL;
    }
    toggleClass(".tc-main", "active");
    toggleClass(".tc", "active");
}

var tc = document.getElementsByClassName('tc');
var tc_main = document.getElementsByClassName('tc-main');
tc[0].addEventListener('click', function (event) {
    pop();
});
tc_main[0].addEventListener('click', function (event) {
    event.stopPropagation();
});



function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}















document.addEventListener('DOMContentLoaded', function () {






    var html = document.querySelector('html');
    var themeState = getCookie("themeState") || "Dark";
    var tanChiShe = document.getElementById("tanChiShe");






    function changeTheme(theme) {
        tanChiShe.src = "./static/svg/snake-" + theme + ".svg";
        html.dataset.theme = theme;
        setCookie("themeState", theme, 365);
        themeState = theme;
    }







    var Checkbox = document.getElementById('myonoffswitch')
    Checkbox.addEventListener('change', function () {
        if (themeState == "Dark") {
            changeTheme("Light");
        } else if (themeState == "Light") {
            changeTheme("Dark");
        } else {
            changeTheme("Dark");
        }
    });



    if (themeState == "Dark") {
        Checkbox.checked = false;
    }

    changeTheme(themeState);

















   

    var fpsElement = document.createElement('div');
    fpsElement.id = 'fps';
    fpsElement.style.zIndex = '10000';
    fpsElement.style.position = 'fixed';
    fpsElement.style.left = '0';
    document.body.insertBefore(fpsElement, document.body.firstChild);

    var showFPS = (function () {
        var requestAnimationFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };

        var fps = 0,
            last = Date.now(),
            offset, step, appendFps;

        step = function () {
            offset = Date.now() - last;
            fps += 1;

            if (offset >= 1000) {
                last += offset;
                appendFps(fps);
                fps = 0;
            }

            requestAnimationFrame(step);
        };

        appendFps = function (fpsValue) {
            fpsElement.textContent = 'FPS: ' + fpsValue;
        };

        step();
    })();
    
    
    
    //pop('./static/img/tz.jpg')
    
    
    
});




var pageLoading = document.querySelector("#zyyo-loading");
window.addEventListener('load', function() {
    setTimeout(function () {
        pageLoading.style.opacity = '0';
    }, 100);
});

// Message Board Functionality
(function() {
    const blackboard = document.getElementById('blackboard');
    const addTextBtn = document.getElementById('addTextBtn');
    const addImageBtn = document.getElementById('addImageBtn');
    const imageInput = document.getElementById('imageInput');
    const clearBoardBtn = document.getElementById('clearBoardBtn');
    const fontSizeRange = document.getElementById('fontSizeRange');
    const fontFamilySelect = document.getElementById('fontFamilySelect');
    const colorPicker = document.getElementById('colorPicker');

    if (!blackboard) return;

    let draggedItem = null;
    let offsetX = 0;
    let offsetY = 0;
    let selectedItem = null;

    // 获取或生成用户唯一ID
    function getUserId() {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('userId', userId);
        }
        return userId;
    }

    // 检查是否是管理员
    function isAdmin() {
        return localStorage.getItem('isAdmin') === 'true';
    }

    // 管理员登录
    function adminLogin() {
        const password = prompt('Enter admin password:');
        const correctPassword = 'admin123'; // 可以修改这个密码
        if (password === correctPassword) {
            localStorage.setItem('isAdmin', 'true');
            alert('Admin access granted!');
            updateDeleteButtons();
            return true;
        } else if (password) {
            alert('Incorrect password!');
        }
        return false;
    }

    const currentUserId = getUserId();

    // Wait for Firebase to be ready
    function waitForFirebase(callback) {
        if (window.firebaseDB) {
            callback();
        } else {
            setTimeout(() => waitForFirebase(callback), 100);
        }
    }

    // Load saved items from Firebase
    function loadBoardItems() {
        waitForFirebase(() => {
            const itemsRef = window.firebaseRef(window.firebaseDB, 'messageBoardItems');
            window.firebaseOnValue(itemsRef, (snapshot) => {
                // Clear existing items
                blackboard.querySelectorAll('.boardItem').forEach(item => item.remove());

                const items = snapshot.val();
                if (items) {
                    Object.keys(items).forEach(key => {
                        const item = items[key];
                        if (item.type === 'text') {
                            createTextItem(item.content, item.x, item.y, item.fontSize, item.fontFamily, item.color, item.userId, key, item.rotation, item.zIndex, item.width, item.height);
                        } else if (item.type === 'image') {
                            createImageItem(item.src, item.x, item.y, item.userId, key, item.width, item.height, item.rotation, item.zIndex);
                        }
                    });
                }
            });
        });
    }

    // Save item to Firebase
    function saveItemToFirebase(itemId, data) {
        waitForFirebase(() => {
            const itemRef = window.firebaseRef(window.firebaseDB, `messageBoardItems/${itemId}`);
            window.firebaseSet(itemRef, data);
        });
    }

    // Delete item from Firebase
    function deleteItemFromFirebase(itemId) {
        waitForFirebase(() => {
            const itemRef = window.firebaseRef(window.firebaseDB, `messageBoardItems/${itemId}`);
            window.firebaseRemove(itemRef);
        });
    }

    // Save items position/rotation updates to Firebase
    function saveBoardItems() {
        blackboard.querySelectorAll('.boardItem').forEach(item => {
            const data = {
                id: item.dataset.id,
                userId: item.dataset.userId,
                x: parseFloat(item.style.left) || 0,
                y: parseFloat(item.style.top) || 0,
                rotation: parseFloat(item.dataset.rotation) || 0,
                zIndex: parseInt(item.style.zIndex) || 1
            };

            if (item.classList.contains('textItem')) {
                const textEl = item.querySelector('.boardText');
                data.type = 'text';
                data.content = textEl.textContent;
                data.fontSize = textEl.style.fontSize;
                data.fontFamily = textEl.style.fontFamily;
                data.color = textEl.style.color;
                data.width = parseFloat(item.style.width) || 300;
                data.height = parseFloat(item.style.height) || 100;
            } else if (item.classList.contains('imageItem')) {
                const imgEl = item.querySelector('.boardImage');
                data.type = 'image';
                data.src = imgEl.src;
                data.width = parseFloat(item.style.width) || 200;
                data.height = parseFloat(item.style.height) || 200;
            }

            saveItemToFirebase(item.dataset.id, data);
        });
    }

    // 检查是否可以删除该项
    function canDelete(itemUserId) {
        return isAdmin() || itemUserId === currentUserId;
    }

    // 更新所有删除按钮的可见性
    function updateDeleteButtons() {
        blackboard.querySelectorAll('.boardItem').forEach(item => {
            const deleteBtn = item.querySelector('.deleteItemBtn');
            const itemUserId = item.dataset.userId;
            if (canDelete(itemUserId)) {
                deleteBtn.style.display = 'block';
            } else {
                deleteBtn.style.display = 'none';
            }
        });
    }

    // Create text item
    function createTextItem(text, x, y, fontSize, fontFamily, color, userId, id, rotation, zIndex, width, height) {
        userId = userId || currentUserId;
        id = id || 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        rotation = rotation || 0;
        zIndex = zIndex || 1;
        width = width || 300;
        height = height || 100;

        const item = document.createElement('div');
        item.className = 'boardItem textItem';
        item.style.left = x + 'px';
        item.style.top = y + 'px';
        item.style.width = width + 'px';
        item.style.height = height + 'px';
        item.style.zIndex = zIndex;
        item.dataset.userId = userId;
        item.dataset.id = id;
        item.dataset.rotation = rotation;
        item.style.transform = `rotate(${rotation}deg)`;

        const textDiv = document.createElement('div');
        textDiv.className = 'boardText';
        textDiv.textContent = text;
        textDiv.style.fontSize = fontSize || '24px';
        textDiv.style.fontFamily = fontFamily || "'b', 'a', sans-serif";
        textDiv.style.color = color || '#ffffff';

        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'deleteItemBtn';
        deleteBtn.innerHTML = '×';
        if (!canDelete(userId)) {
            deleteBtn.style.display = 'none !important';
        }
        deleteBtn.onclick = function(e) {
            e.stopPropagation();
            if (canDelete(userId)) {
                deleteItemFromFirebase(id);
            }
        };

        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resizeHandle';
        resizeHandle.innerHTML = '⇲';

        const rotateHandle = document.createElement('div');
        rotateHandle.className = 'rotateHandle';
        rotateHandle.innerHTML = '↻';

        const editBtn = document.createElement('div');
        editBtn.className = 'editTextBtn';
        editBtn.innerHTML = '✎ Edit';
        editBtn.onclick = function(e) {
            e.stopPropagation();
            editText(item, textDiv);
        };

        const toolbar = createToolbar(item);

        item.appendChild(textDiv);
        item.appendChild(deleteBtn);
        item.appendChild(resizeHandle);
        item.appendChild(rotateHandle);
        item.appendChild(editBtn);
        item.appendChild(toolbar);
        blackboard.appendChild(item);

        makeDraggable(item);
        makeResizable(item, resizeHandle);
        makeRotatable(item, rotateHandle);
        item.addEventListener('click', (e) => selectItem(item, e));
        return item;
    }

    // Create image item
    function createImageItem(src, x, y, userId, id, width, height, rotation, zIndex) {
        userId = userId || currentUserId;
        id = id || 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        width = width || 200;
        height = height || 200;
        rotation = rotation || 0;
        zIndex = zIndex || 1;

        const item = document.createElement('div');
        item.className = 'boardItem imageItem';
        item.style.left = x + 'px';
        item.style.top = y + 'px';
        item.style.width = width + 'px';
        item.style.height = height + 'px';
        item.style.zIndex = zIndex;
        item.dataset.userId = userId;
        item.dataset.id = id;
        item.dataset.rotation = rotation;
        item.style.transform = `rotate(${rotation}deg)`;

        const img = document.createElement('img');
        img.className = 'boardImage';
        img.src = src;

        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'deleteItemBtn';
        deleteBtn.innerHTML = '×';
        if (!canDelete(userId)) {
            deleteBtn.style.display = 'none !important';
        }
        deleteBtn.onclick = function(e) {
            e.stopPropagation();
            if (canDelete(userId)) {
                deleteItemFromFirebase(id);
            }
        };

        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resizeHandle';
        resizeHandle.innerHTML = '⇲';

        const rotateHandle = document.createElement('div');
        rotateHandle.className = 'rotateHandle';
        rotateHandle.innerHTML = '↻';

        const toolbar = createToolbar(item);

        item.appendChild(img);
        item.appendChild(deleteBtn);
        item.appendChild(resizeHandle);
        item.appendChild(rotateHandle);
        item.appendChild(toolbar);
        blackboard.appendChild(item);

        makeDraggable(item);
        makeResizable(item, resizeHandle);
        makeRotatable(item, rotateHandle);
        item.addEventListener('click', (e) => selectItem(item, e));
        return item;
    }

    // Make image resizable
    function makeResizable(item, handle) {
        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        handle.addEventListener('mousedown', function(e) {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(item.style.width);
            startHeight = parseInt(item.style.height);
            e.stopPropagation();
            e.preventDefault();
        });

        handle.addEventListener('touchstart', function(e) {
            isResizing = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startWidth = parseInt(item.style.width);
            startHeight = parseInt(item.style.height);
            e.stopPropagation();
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;

            const width = startWidth + (e.clientX - startX);
            const height = startHeight + (e.clientY - startY);

            if (width > 50 && height > 50) {
                item.style.width = width + 'px';
                item.style.height = height + 'px';
            }
        });

        document.addEventListener('touchmove', function(e) {
            if (!isResizing) return;

            const touch = e.touches[0];
            const width = startWidth + (touch.clientX - startX);
            const height = startHeight + (touch.clientY - startY);

            if (width > 50 && height > 50) {
                item.style.width = width + 'px';
                item.style.height = height + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            if (isResizing) {
                isResizing = false;
                saveBoardItems();
            }
        });

        document.addEventListener('touchend', function() {
            if (isResizing) {
                isResizing = false;
                saveBoardItems();
            }
        });
    }

    // Make item rotatable
    function makeRotatable(item, handle) {
        let isRotating = false;
        let startAngle = 0;
        let currentRotation = parseFloat(item.dataset.rotation) || 0;

        handle.addEventListener('mousedown', function(e) {
            isRotating = true;
            const rect = item.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
            e.stopPropagation();
            e.preventDefault();
        });

        handle.addEventListener('touchstart', function(e) {
            isRotating = true;
            const touch = e.touches[0];
            const rect = item.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            startAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * 180 / Math.PI;
            e.stopPropagation();
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isRotating) return;

            const rect = item.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
            const rotation = currentRotation + (angle - startAngle);

            item.dataset.rotation = rotation;
            item.style.transform = `rotate(${rotation}deg)`;
        });

        document.addEventListener('touchmove', function(e) {
            if (!isRotating) return;

            const touch = e.touches[0];
            const rect = item.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * 180 / Math.PI;
            const rotation = currentRotation + (angle - startAngle);

            item.dataset.rotation = rotation;
            item.style.transform = `rotate(${rotation}deg)`;
        });

        document.addEventListener('mouseup', function() {
            if (isRotating) {
                isRotating = false;
                currentRotation = parseFloat(item.dataset.rotation) || 0;
                saveBoardItems();
            }
        });

        document.addEventListener('touchend', function() {
            if (isRotating) {
                isRotating = false;
                currentRotation = parseFloat(item.dataset.rotation) || 0;
                saveBoardItems();
            }
        });
    }

    // Select item
    function selectItem(item, e) {
        if (e) e.stopPropagation();

        if (selectedItem) {
            selectedItem.classList.remove('selected');
        }

        selectedItem = item;
        item.classList.add('selected');
    }

    // Deselect item when clicking blackboard
    blackboard.addEventListener('click', function(e) {
        if (e.target === blackboard || e.target.classList.contains('boardTexture')) {
            if (selectedItem) {
                selectedItem.classList.remove('selected');
                selectedItem = null;
            }
        }
    });

    // Edit text
    function editText(item, textDiv) {
        const newText = prompt('Edit text:', textDiv.textContent);
        if (newText !== null && newText.trim()) {
            textDiv.textContent = newText;
            saveBoardItems();
        }
    }

    // Create toolbar
    function createToolbar(item) {
        const toolbar = document.createElement('div');
        toolbar.className = 'itemToolbar';

        const bringFrontBtn = document.createElement('button');
        bringFrontBtn.className = 'toolbarBtn';
        bringFrontBtn.innerHTML = '↑ Front';
        bringFrontBtn.onclick = function(e) {
            e.stopPropagation();
            const maxZ = Math.max(...Array.from(blackboard.querySelectorAll('.boardItem')).map(i => parseInt(i.style.zIndex) || 1));
            item.style.zIndex = maxZ + 1;
            saveBoardItems();
        };

        const sendBackBtn = document.createElement('button');
        sendBackBtn.className = 'toolbarBtn';
        sendBackBtn.innerHTML = '↓ Back';
        sendBackBtn.onclick = function(e) {
            e.stopPropagation();
            const minZ = Math.min(...Array.from(blackboard.querySelectorAll('.boardItem')).map(i => parseInt(i.style.zIndex) || 1));
            item.style.zIndex = Math.max(1, minZ - 1);
            saveBoardItems();
        };

        const duplicateBtn = document.createElement('button');
        duplicateBtn.className = 'toolbarBtn';
        duplicateBtn.innerHTML = '⊕ Copy';
        duplicateBtn.onclick = function(e) {
            e.stopPropagation();
            duplicateItem(item);
        };

        toolbar.appendChild(bringFrontBtn);
        toolbar.appendChild(sendBackBtn);
        toolbar.appendChild(duplicateBtn);

        // Add font/size/color controls for text items
        if (item.classList.contains('textItem')) {
            const fontBtn = document.createElement('button');
            fontBtn.className = 'toolbarBtn';
            fontBtn.innerHTML = '🖋 Font';
            fontBtn.onclick = function(e) {
                e.stopPropagation();
                changeTextStyle(item);
            };
            toolbar.appendChild(fontBtn);
        }

        return toolbar;
    }

    // Change text style
    function changeTextStyle(item) {
        const textDiv = item.querySelector('.boardText');
        const size = prompt('Font size (12-72):', parseInt(textDiv.style.fontSize));
        if (size && !isNaN(size)) {
            textDiv.style.fontSize = Math.max(12, Math.min(72, parseInt(size))) + 'px';
        }

        const fonts = ['Default', 'Pacifico', 'Dancing Script', 'Fredoka One', 'Permanent Marker', 'Bebas Neue', 'Righteous', 'Lobster', 'Indie Flower'];
        const fontChoice = prompt('Font:\n' + fonts.map((f, i) => `${i}: ${f}`).join('\n'));
        if (fontChoice !== null && !isNaN(fontChoice)) {
            const fontMap = {
                '0': "'b', 'a', sans-serif",
                '1': "'Pacifico', cursive",
                '2': "'Dancing Script', cursive",
                '3': "'Fredoka One', cursive",
                '4': "'Permanent Marker', cursive",
                '5': "'Bebas Neue', cursive",
                '6': "'Righteous', cursive",
                '7': "'Lobster', cursive",
                '8': "'Indie Flower', cursive"
            };
            if (fontMap[fontChoice]) {
                textDiv.style.fontFamily = fontMap[fontChoice];
            }
        }

        const color = prompt('Text color (hex):', textDiv.style.color);
        if (color && color.trim()) {
            textDiv.style.color = color;
        }

        saveBoardItems();
    }

    // Duplicate item
    function duplicateItem(item) {
        const x = parseFloat(item.style.left) + 30;
        const y = parseFloat(item.style.top) + 30;

        if (item.classList.contains('textItem')) {
            const textDiv = item.querySelector('.boardText');
            createTextItem(
                textDiv.textContent,
                x, y,
                textDiv.style.fontSize,
                textDiv.style.fontFamily,
                textDiv.style.color,
                currentUserId
            );
        } else if (item.classList.contains('imageItem')) {
            const img = item.querySelector('.boardImage');
            createImageItem(
                img.src,
                x, y,
                currentUserId,
                null,
                parseFloat(item.style.width),
                parseFloat(item.style.height)
            );
        }
        saveBoardItems();
    }

    // Make item draggable
    function makeDraggable(item) {
        item.addEventListener('mousedown', startDrag);
        item.addEventListener('touchstart', startDrag);
    }

    function startDrag(e) {
        draggedItem = this;
        draggedItem.classList.add('dragging');

        const rect = blackboard.getBoundingClientRect();
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        offsetX = clientX - rect.left - parseFloat(draggedItem.style.left);
        offsetY = clientY - rect.top - parseFloat(draggedItem.style.top);

        e.preventDefault();
    }

    function drag(e) {
        if (!draggedItem) return;

        const rect = blackboard.getBoundingClientRect();
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        let x = clientX - rect.left - offsetX;
        let y = clientY - rect.top - offsetY;

        // Keep within bounds
        x = Math.max(0, Math.min(x, rect.width - draggedItem.offsetWidth));
        y = Math.max(0, Math.min(y, rect.height - draggedItem.offsetHeight));

        draggedItem.style.left = x + 'px';
        draggedItem.style.top = y + 'px';

        e.preventDefault();
    }

    function stopDrag() {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            saveBoardItems();
            draggedItem = null;
        }
    }

    // Event listeners
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);

    // Add text button
    addTextBtn.addEventListener('click', function() {
        const text = prompt('Enter your message:');
        if (text && text.trim()) {
            const x = Math.random() * (blackboard.offsetWidth - 200);
            const y = Math.random() * (blackboard.offsetHeight - 100);
            const fontSize = fontSizeRange.value + 'px';
            const fontFamily = fontFamilySelect.value;
            const color = colorPicker.value;

            createTextItem(text, x, y, fontSize, fontFamily, color);
            saveBoardItems();

            // Track achievements
            localStorage.setItem('has_sent_message', 'true');
            const count = parseInt(localStorage.getItem('items_created_count') || '0') + 1;
            localStorage.setItem('items_created_count', count.toString());
        }
    });

    // Add image button
    addImageBtn.addEventListener('click', function() {
        imageInput.click();
    });

    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const x = Math.random() * (blackboard.offsetWidth - 250);
                const y = Math.random() * (blackboard.offsetHeight - 250);
                createImageItem(event.target.result, x, y);
                saveBoardItems();

                // Track achievements
                localStorage.setItem('has_sent_message', 'true');
                localStorage.setItem('has_uploaded_image', 'true');
                const count = parseInt(localStorage.getItem('items_created_count') || '0') + 1;
                localStorage.setItem('items_created_count', count.toString());
            };
            reader.readAsDataURL(file);
        }
        imageInput.value = '';
    });

    // Clear board button - 管理员功能
    clearBoardBtn.addEventListener('click', function() {
        if (!isAdmin()) {
            if (adminLogin()) {
                // 登录成功后继续清空操作
                if (confirm('Are you sure you want to clear the entire board?')) {
                    waitForFirebase(() => {
                        const itemsRef = window.firebaseRef(window.firebaseDB, 'messageBoardItems');
                        window.firebaseRemove(itemsRef);
                    });
                }
            }
        } else {
            if (confirm('Are you sure you want to clear the entire board?')) {
                waitForFirebase(() => {
                    const itemsRef = window.firebaseRef(window.firebaseDB, 'messageBoardItems');
                    window.firebaseRemove(itemsRef);
                });
            }
        }
    });

    // Admin login button
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', function() {
            if (isAdmin()) {
                const logout = confirm('You are already logged in as admin. Do you want to logout?');
                if (logout) {
                    localStorage.removeItem('isAdmin');
                    alert('Logged out successfully!');
                    updateDeleteButtons();
                    adminLoginBtn.textContent = 'Admin';
                }
            } else {
                if (adminLogin()) {
                    adminLoginBtn.textContent = 'Admin ✓';
                }
            }
        });

        // Update button text on load
        if (isAdmin()) {
            adminLoginBtn.textContent = 'Admin ✓';
        }
    }

    // Load saved items on page load
    loadBoardItems();
})();

// A Researcher's Day Timeline
(function() {
    const timeSlider = document.getElementById('timeSlider');
    const currentTime = document.getElementById('currentTime');
    const currentActivity = document.getElementById('currentActivity');
    const sceneIcon = document.querySelector('.sceneIcon');
    const sceneBubble = document.getElementById('sceneBubble');

    if (!timeSlider) return;

    const schedule = {
        0: { activity: 'Late night coding session 💻', icon: '💻', bubble: 'Bug fixing at midnight!' },
        1: { activity: 'Still coding... 🌙', icon: '🌙', bubble: 'Almost there...' },
        2: { activity: 'Finally going to sleep 😴', icon: '😴', bubble: 'Tomorrow is another day' },
        3: { activity: 'Deep sleep 💤', icon: '💤', bubble: 'Zzz...' },
        4: { activity: 'Deep sleep 💤', icon: '💤', bubble: 'Zzz...' },
        5: { activity: 'Deep sleep 💤', icon: '💤', bubble: 'Zzz...' },
        6: { activity: 'Waking up 🌅', icon: '🌅', bubble: 'New day begins!' },
        7: { activity: 'Morning coffee ☕', icon: '☕', bubble: 'First coffee!' },
        8: { activity: 'Breakfast and news 📰', icon: '🍳', bubble: 'Checking research updates' },
        9: { activity: 'Starting work - emails 📧', icon: '📧', bubble: 'Replying to collaborators' },
        10: { activity: 'Deep work on research 🔬', icon: '🔬', bubble: 'EEG data analysis' },
        11: { activity: 'Paper writing ✍️', icon: '✍️', bubble: 'Working on NeurIPS paper' },
        12: { activity: 'Lunch break 🍜', icon: '🍜', bubble: 'Ramen time!' },
        13: { activity: 'Reading papers 📚', icon: '📚', bubble: 'Latest arXiv papers' },
        14: { activity: 'Lab meeting 👥', icon: '👥', bubble: 'Discussing results' },
        15: { activity: 'Coffee break ☕', icon: '☕', bubble: 'Third coffee of the day' },
        16: { activity: 'Model training 🤖', icon: '🤖', bubble: 'Training neural networks' },
        17: { activity: 'Code review & debugging 🐛', icon: '🐛', bubble: 'Fixing bugs' },
        18: { activity: 'Gym time 💪', icon: '💪', bubble: 'Staying healthy!' },
        19: { activity: 'Dinner 🍱', icon: '🍱', bubble: 'Cooking time' },
        20: { activity: 'Gaming session 🎮', icon: '🎮', bubble: 'CS2 ranked match!' },
        21: { activity: 'Reading & relaxing 📖', icon: '📖', bubble: 'Novel reading' },
        22: { activity: 'Personal projects 💡', icon: '💡', bubble: 'Working on side projects' },
        23: { activity: 'Late night research 🌃', icon: '🌃', bubble: 'Best ideas come at night' }
    };

    function updateTimeline() {
        const hour = parseInt(timeSlider.value);
        const data = schedule[hour];

        currentTime.textContent = `${hour.toString().padStart(2, '0')}:00`;
        currentActivity.textContent = data.activity;
        sceneIcon.textContent = data.icon;
        sceneBubble.textContent = data.bubble;
    }

    timeSlider.addEventListener('input', updateTimeline);
    updateTimeline();
})();

// Achievement System
(function() {
    const achievementGrid = document.getElementById('achievementGrid');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (!achievementGrid) return;

    const achievements = [
        { id: 'first_visit', name: 'First Visit', desc: 'Welcome!', icon: '👋', condition: () => true },
        { id: 'scroll_master', name: 'Scroll Master', desc: 'Scrolled to bottom', icon: '📜', condition: () => checkScrolled() },
        { id: 'message_sender', name: 'Messenger', desc: 'Left a message', icon: '✉️', condition: () => checkMessageSent() },
        { id: 'paper_reader', name: 'Paper Reader', desc: 'Clicked a paper', icon: '📄', condition: () => checkPaperClicked() },
        { id: 'time_traveler', name: 'Time Traveler', desc: 'Explored timeline', icon: '⏰', condition: () => checkTimelineUsed() },
        { id: 'night_owl', name: 'Night Owl', desc: 'Visited at night', icon: '🦉', condition: () => checkNightVisit() },
        { id: 'explorer', name: 'Explorer', desc: 'Visited all sections', icon: '🗺️', condition: () => checkAllSections() },
        { id: 'dedicated', name: 'Dedicated', desc: 'Spent 5+ minutes', icon: '⭐', condition: () => checkTimeSpent() },
        { id: 'code_explorer', name: 'Code Explorer', desc: 'Clicked GitHub', icon: '💻', condition: () => checkGitHubClicked() },
        { id: 'scholar', name: 'Scholar', desc: 'Clicked Google Scholar', icon: '🎓', condition: () => checkScholarClicked() },
        { id: 'early_bird', name: 'Early Bird', desc: 'Visited in morning', icon: '🌅', condition: () => checkMorningVisit() },
        { id: 'afternoon_surfer', name: 'Afternoon Surfer', desc: 'Visited afternoon', icon: '☀️', condition: () => checkAfternoonVisit() },
        { id: 'image_uploader', name: 'Image Uploader', desc: 'Uploaded an image', icon: '🖼️', condition: () => checkImageUploaded() },
        { id: 'artist', name: 'Artist', desc: 'Created 3+ items', icon: '🎨', condition: () => checkMultipleItems() },
        { id: 'speedrunner', name: 'Speedrunner', desc: '5 badges in 2 min', icon: '⚡', condition: () => checkSpeedrun() },
        { id: 'theme_switcher', name: 'Theme Switcher', desc: 'Changed theme', icon: '🌓', condition: () => checkThemeSwitched() },
        { id: 'social_butterfly', name: 'Social Butterfly', desc: 'Clicked 3+ social links', icon: '🦋', condition: () => checkSocialClicks() },
        { id: 'researcher', name: 'Researcher', desc: 'Read 2+ papers', icon: '🔬', condition: () => checkMultiplePapers() },
        { id: 'curious', name: 'Curious', desc: 'Clicked all hours', icon: '🔍', condition: () => checkAllHours() },
        { id: 'completionist', name: 'Completionist', desc: 'Unlocked all', icon: '🏆', condition: () => checkAllUnlocked() }
    ];

    let unlockedAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    let visitTime = Date.now();

    function checkScrolled() {
        return localStorage.getItem('scrolled_bottom') === 'true';
    }

    function checkMessageSent() {
        return localStorage.getItem('has_sent_message') === 'true';
    }

    function checkPaperClicked() {
        return localStorage.getItem('paper_clicked') === 'true';
    }

    function checkTimelineUsed() {
        return localStorage.getItem('timeline_used') === 'true';
    }

    function checkNightVisit() {
        const hour = new Date().getHours();
        return hour >= 22 || hour < 6;
    }

    function checkAllSections() {
        return localStorage.getItem('all_sections_visited') === 'true';
    }

    function checkTimeSpent() {
        return Date.now() - visitTime > 300000; // 5 minutes
    }

    function checkGitHubClicked() {
        return localStorage.getItem('github_clicked') === 'true';
    }

    function checkScholarClicked() {
        return localStorage.getItem('scholar_clicked') === 'true';
    }

    function checkMorningVisit() {
        const hour = new Date().getHours();
        return hour >= 6 && hour < 12;
    }

    function checkAfternoonVisit() {
        const hour = new Date().getHours();
        return hour >= 12 && hour < 18;
    }

    function checkImageUploaded() {
        return localStorage.getItem('has_uploaded_image') === 'true';
    }

    function checkMultipleItems() {
        return parseInt(localStorage.getItem('items_created_count') || '0') >= 3;
    }

    function checkSpeedrun() {
        const firstUnlock = parseInt(localStorage.getItem('first_unlock_time') || Date.now());
        const timeDiff = Date.now() - firstUnlock;
        return unlockedAchievements.length >= 5 && timeDiff < 120000; // 2 minutes
    }

    function checkThemeSwitched() {
        return localStorage.getItem('theme_switched') === 'true';
    }

    function checkSocialClicks() {
        return parseInt(localStorage.getItem('social_click_count') || '0') >= 3;
    }

    function checkMultiplePapers() {
        return parseInt(localStorage.getItem('paper_click_count') || '0') >= 2;
    }

    function checkAllHours() {
        const hoursClicked = JSON.parse(localStorage.getItem('hours_clicked') || '[]');
        return hoursClicked.length >= 24;
    }

    function checkAllUnlocked() {
        return unlockedAchievements.length >= achievements.length - 1;
    }

    function unlockAchievement(id) {
        if (!unlockedAchievements.includes(id)) {
            if (unlockedAchievements.length === 0) {
                localStorage.setItem('first_unlock_time', Date.now().toString());
            }
            unlockedAchievements.push(id);
            localStorage.setItem('achievements', JSON.stringify(unlockedAchievements));
            updateAchievements();
        }
    }

    function createBadge(achievement) {
        const isUnlocked = unlockedAchievements.includes(achievement.id);
        const badge = document.createElement('div');
        badge.className = `achievementBadge ${isUnlocked ? 'unlocked' : 'locked'}`;
        badge.innerHTML = `
            <div class="badgeIcon">${achievement.icon}</div>
            <div class="badgeName">${achievement.name}</div>
            <div class="badgeDesc">${achievement.desc}</div>
        `;
        return badge;
    }

    function updateAchievements() {
        achievementGrid.innerHTML = '';
        achievements.forEach(achievement => {
            if (achievement.condition()) {
                unlockAchievement(achievement.id);
            }
            achievementGrid.appendChild(createBadge(achievement));
        });

        const progress = (unlockedAchievements.length / achievements.length) * 100;
        progressFill.style.width = progress + '%';
        progressText.textContent = `${unlockedAchievements.length} / ${achievements.length} Achievements Unlocked`;
    }

    // Track scroll
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
            localStorage.setItem('scrolled_bottom', 'true');
            updateAchievements();
        }
    });

    // Track timeline usage
    const timeSlider = document.getElementById('timeSlider');
    if (timeSlider) {
        timeSlider.addEventListener('input', () => {
            localStorage.setItem('timeline_used', 'true');
            updateAchievements();
        });
    }

    // Track paper clicks
    document.querySelectorAll('.paperLink').forEach(link => {
        link.addEventListener('click', () => {
            localStorage.setItem('paper_clicked', 'true');
            const count = parseInt(localStorage.getItem('paper_click_count') || '0') + 1;
            localStorage.setItem('paper_click_count', count.toString());
            updateAchievements();
        });
    });

    // Track GitHub clicks
    document.querySelectorAll('a[href*="github.com"]').forEach(link => {
        link.addEventListener('click', () => {
            localStorage.setItem('github_clicked', 'true');
            const count = parseInt(localStorage.getItem('social_click_count') || '0') + 1;
            localStorage.setItem('social_click_count', count.toString());
            updateAchievements();
        });
    });

    // Track Google Scholar clicks
    document.querySelectorAll('a[href*="scholar.google.com"]').forEach(link => {
        link.addEventListener('click', () => {
            localStorage.setItem('scholar_clicked', 'true');
            const count = parseInt(localStorage.getItem('social_click_count') || '0') + 1;
            localStorage.setItem('social_click_count', count.toString());
            updateAchievements();
        });
    });

    // Track other social clicks
    document.querySelectorAll('.iconItem').forEach(link => {
        link.addEventListener('click', () => {
            const count = parseInt(localStorage.getItem('social_click_count') || '0') + 1;
            localStorage.setItem('social_click_count', count.toString());
            updateAchievements();
        });
    });

    // Track theme switch
    const checkbox = document.getElementById('myonoffswitch');
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            localStorage.setItem('theme_switched', 'true');
            updateAchievements();
        });
    }

    // Track all hours clicked in timeline
    if (timeSlider) {
        timeSlider.addEventListener('input', () => {
            const hoursClicked = JSON.parse(localStorage.getItem('hours_clicked') || '[]');
            const hour = parseInt(timeSlider.value);
            if (!hoursClicked.includes(hour)) {
                hoursClicked.push(hour);
                localStorage.setItem('hours_clicked', JSON.stringify(hoursClicked));
            }
        });
    }

    // Check time spent
    setInterval(() => {
        if (checkTimeSpent()) {
            updateAchievements();
        }
    }, 60000); // Check every minute

    updateAchievements();
})();

// World Map Visualization
(function() {
    const totalVisitorsEl = document.getElementById('totalVisitors');
    const uniqueCountriesEl = document.getElementById('uniqueCountries');
    const activityListEl = document.getElementById('activityList');
    const worldMap = document.getElementById('worldMap');

    if (!worldMap) return;

    // Visitor location coordinates for different continents (scaled for viewBox 0 0 2000 1000)
    const locations = [
        { x: 750, y: 240, continent: 'Europe' },
        { x: 840, y: 250, continent: 'Europe' },
        { x: 1200, y: 280, continent: 'Asia' },
        { x: 1400, y: 300, continent: 'Asia' },
        { x: 1100, y: 320, continent: 'Asia' },
        { x: 800, y: 500, continent: 'Africa' },
        { x: 850, y: 550, continent: 'Africa' },
        { x: 280, y: 250, continent: 'North America' },
        { x: 350, y: 280, continent: 'North America' },
        { x: 450, y: 550, continent: 'South America' },
        { x: 500, y: 600, continent: 'South America' },
        { x: 1550, y: 640, continent: 'Australia' }
    ];

    // Update visitor stats
    function updateStats() {
        if (!window.firebaseDB) {
            setTimeout(updateStats, 100);
            return;
        }

        const visitsRef = window.firebaseRef(window.firebaseDB, 'stats/totalVisits');

        // Increment visit count
        window.firebaseGet(visitsRef).then((snapshot) => {
            const currentVisits = snapshot.val() || 0;
            const newVisits = currentVisits + 1;
            window.firebaseSet(visitsRef, newVisits);

            // Animate counter
            animateValue(totalVisitorsEl, 0, newVisits, 1000);

            // Simulate countries based on visits
            const countries = Math.min(Math.floor(newVisits / 2) + 1, locations.length);
            animateValue(uniqueCountriesEl, 0, countries, 1000);

            // Add visitor markers to map
            addVisitorMarkers(countries);
        });

        // Listen for real-time updates
        window.firebaseOnValue(visitsRef, (snapshot) => {
            const visits = snapshot.val() || 0;
            totalVisitorsEl.textContent = visits;

            const countries = Math.min(Math.floor(visits / 2) + 1, locations.length);
            uniqueCountriesEl.textContent = countries;
            addVisitorMarkers(countries);
        });
    }

    function animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    // Add visitor markers to world map
    function addVisitorMarkers(count) {
        const svg = worldMap.querySelector('svg');

        // Remove old markers
        svg.querySelectorAll('.visitor-marker').forEach(m => m.remove());

        // Add new markers
        for (let i = 0; i < count && i < locations.length; i++) {
            const location = locations[i];
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('class', 'visitor-marker');
            circle.setAttribute('cx', location.x);
            circle.setAttribute('cy', location.y);
            circle.setAttribute('r', '6');
            circle.setAttribute('data-continent', location.continent);

            svg.appendChild(circle);
        }
    }

    // Add recent activities
    function addActivity(icon, text) {
        const activities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
        activities.unshift({ icon, text, time: new Date().toLocaleTimeString() });
        if (activities.length > 5) activities.pop();
        localStorage.setItem('recentActivities', JSON.stringify(activities));
        renderActivities();
    }

    function renderActivities() {
        const activities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
        activityListEl.innerHTML = '';

        activities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activityItem';
            item.innerHTML = `
                <div class="activityIcon">${activity.icon}</div>
                <div class="activityContent">
                    <div class="activityText">${activity.text}</div>
                    <div class="activityTime">${activity.time}</div>
                </div>
            `;
            activityListEl.appendChild(item);
        });
    }

    // Generate diverse random activities
    function addRandomActivity() {
        const activityTypes = [
            { icon: '👋', text: 'New visitor arrived' },
            { icon: '📝', text: 'Someone left a message' },
            { icon: '🎵', text: 'Music player opened' },
            { icon: '🏆', text: 'Achievement unlocked' },
            { icon: '🗺️', text: 'New country visited' },
            { icon: '🌙', text: 'Theme switched to dark mode' },
            { icon: '☀️', text: 'Theme switched to light mode' },
            { icon: '🖼️', text: 'Image uploaded to board' },
            { icon: '🎨', text: 'Message board customized' },
            { icon: '👀', text: 'Project section viewed' }
        ];

        const randomActivity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        addActivity(randomActivity.icon, randomActivity.text);
    }

    updateStats();
    renderActivities();
    addRandomActivity();

    // Add random activities periodically
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every interval
            addRandomActivity();
        }
    }, 15000); // Check every 15 seconds
})();

