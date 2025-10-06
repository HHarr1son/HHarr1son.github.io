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

    // Load saved items from localStorage
    function loadBoardItems() {
        const saved = localStorage.getItem('messageBoardItems');
        if (saved) {
            try {
                const items = JSON.parse(saved);
                items.forEach(item => {
                    if (item.type === 'text') {
                        createTextItem(item.content, item.x, item.y, item.fontSize, item.fontFamily, item.color);
                    } else if (item.type === 'image') {
                        createImageItem(item.src, item.x, item.y);
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
            }

            items.push(data);
        });
        localStorage.setItem('messageBoardItems', JSON.stringify(items));
    }

    // Create text item
    function createTextItem(text, x, y, fontSize, fontFamily, color) {
        const item = document.createElement('div');
        item.className = 'boardItem textItem';
        item.style.left = x + 'px';
        item.style.top = y + 'px';

        const textDiv = document.createElement('div');
        textDiv.className = 'boardText';
        textDiv.textContent = text;
        textDiv.style.fontSize = fontSize || '24px';
        textDiv.style.fontFamily = fontFamily || "'b', 'a', sans-serif";
        textDiv.style.color = color || '#ffffff';

        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'deleteItemBtn';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = function(e) {
            e.stopPropagation();
            item.remove();
            saveBoardItems();
        };

        item.appendChild(textDiv);
        item.appendChild(deleteBtn);
        blackboard.appendChild(item);

        makeDraggable(item);
        return item;
    }

    // Create image item
    function createImageItem(src, x, y) {
        const item = document.createElement('div');
        item.className = 'boardItem imageItem';
        item.style.left = x + 'px';
        item.style.top = y + 'px';

        const img = document.createElement('img');
        img.className = 'boardImage';
        img.src = src;

        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'deleteItemBtn';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = function(e) {
            e.stopPropagation();
            item.remove();
            saveBoardItems();
        };

        item.appendChild(img);
        item.appendChild(deleteBtn);
        blackboard.appendChild(item);

        makeDraggable(item);
        return item;
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

    // Clear board button
    clearBoardBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear the entire board?')) {
            blackboard.querySelectorAll('.boardItem').forEach(item => item.remove());
            localStorage.removeItem('messageBoardItems');
        }
    });

    // Load saved items on page load
    loadBoardItems();
})();

