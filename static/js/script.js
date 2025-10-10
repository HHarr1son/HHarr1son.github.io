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
    var themeState = getCookie("themeState") || "Light";
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

    // Load saved items from localStorage
    function loadBoardItems() {
        const saved = localStorage.getItem('messageBoardItems');
        if (saved) {
            try {
                const items = JSON.parse(saved);
                items.forEach(item => {
                    if (item.type === 'text') {
                        createTextItem(item.content, item.x, item.y, item.fontSize, item.fontFamily, item.color, item.userId, item.id);
                    } else if (item.type === 'image') {
                        createImageItem(item.src, item.x, item.y, item.userId, item.id, item.width, item.height);
                    }
                });
            } catch (e) {
                console.error('Failed to load board items:', e);
            }
        }
    }

    // Save items to localStorage
    function saveBoardItems() {
        const items = [];
        blackboard.querySelectorAll('.boardItem').forEach(item => {
            const data = {
                id: item.dataset.id,
                userId: item.dataset.userId,
                x: parseFloat(item.style.left) || 0,
                y: parseFloat(item.style.top) || 0
            };

            if (item.classList.contains('textItem')) {
                const textEl = item.querySelector('.boardText');
                data.type = 'text';
                data.content = textEl.textContent;
                data.fontSize = textEl.style.fontSize;
                data.fontFamily = textEl.style.fontFamily;
                data.color = textEl.style.color;
            } else if (item.classList.contains('imageItem')) {
                const imgEl = item.querySelector('.boardImage');
                data.type = 'image';
                data.src = imgEl.src;
                data.width = parseFloat(item.style.width) || 200;
                data.height = parseFloat(item.style.height) || 200;
            }

            items.push(data);
        });
        localStorage.setItem('messageBoardItems', JSON.stringify(items));
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
    function createTextItem(text, x, y, fontSize, fontFamily, color, userId, id) {
        userId = userId || currentUserId;
        id = id || 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        const item = document.createElement('div');
        item.className = 'boardItem textItem';
        item.style.left = x + 'px';
        item.style.top = y + 'px';
        item.dataset.userId = userId;
        item.dataset.id = id;

        const textDiv = document.createElement('div');
        textDiv.className = 'boardText';
        textDiv.textContent = text;
        textDiv.style.fontSize = fontSize || '24px';
        textDiv.style.fontFamily = fontFamily || "'b', 'a', sans-serif";
        textDiv.style.color = color || '#ffffff';

        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'deleteItemBtn';
        deleteBtn.innerHTML = '×';
        deleteBtn.style.display = canDelete(userId) ? 'block' : 'none';
        deleteBtn.onclick = function(e) {
            e.stopPropagation();
            if (canDelete(userId)) {
                item.remove();
                saveBoardItems();
            }
        };

        item.appendChild(textDiv);
        item.appendChild(deleteBtn);
        blackboard.appendChild(item);

        makeDraggable(item);
        return item;
    }

    // Create image item
    function createImageItem(src, x, y, userId, id, width, height) {
        userId = userId || currentUserId;
        id = id || 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        width = width || 200;
        height = height || 200;

        const item = document.createElement('div');
        item.className = 'boardItem imageItem';
        item.style.left = x + 'px';
        item.style.top = y + 'px';
        item.style.width = width + 'px';
        item.style.height = height + 'px';
        item.dataset.userId = userId;
        item.dataset.id = id;

        const img = document.createElement('img');
        img.className = 'boardImage';
        img.src = src;

        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'deleteItemBtn';
        deleteBtn.innerHTML = '×';
        deleteBtn.style.display = canDelete(userId) ? 'block' : 'none';
        deleteBtn.onclick = function(e) {
            e.stopPropagation();
            if (canDelete(userId)) {
                item.remove();
                saveBoardItems();
            }
        };

        // 添加缩放手柄
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resizeHandle';
        resizeHandle.innerHTML = '⇲';

        item.appendChild(img);
        item.appendChild(deleteBtn);
        item.appendChild(resizeHandle);
        blackboard.appendChild(item);

        makeDraggable(item);
        makeResizable(item, resizeHandle);
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
                    blackboard.querySelectorAll('.boardItem').forEach(item => item.remove());
                    localStorage.removeItem('messageBoardItems');
                }
            }
        } else {
            if (confirm('Are you sure you want to clear the entire board?')) {
                blackboard.querySelectorAll('.boardItem').forEach(item => item.remove());
                localStorage.removeItem('messageBoardItems');
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

