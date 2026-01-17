// 窗口管理类
class WindowManager {
    constructor() {
        this.windows = []; // 已打开窗口列表
        this.initEventListeners();
    }

    // 初始化事件监听
    initEventListeners() {
        // 任务栏应用点击事件
        document.querySelectorAll('.taskbar-app').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const appType = e.currentTarget.dataset.app;
                this.openWindow(appType);
            });
        });

        // 开始菜单应用点击事件
        document.querySelectorAll('.sm-app').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const appType = e.currentTarget.dataset.app;
                this.openWindow(appType);
                document.getElementById('start-menu').classList.add('hidden');
            });
        });

        // 窗口关闭/最小化/最大化事件（委托）
        document.addEventListener('click', (e) => {
            if (e.target.closest('.win-close')) {
                const windowEl = e.target.closest('.window');
                this.closeWindow(windowEl);
            }
            if (e.target.closest('.win-min')) {
                const windowEl = e.target.closest('.window');
                this.minimizeWindow(windowEl);
            }
            if (e.target.closest('.win-max')) {
                const windowEl = e.target.closest('.window');
                this.maximizeWindow(windowEl);
            }
        });

        // 窗口拖拽（标题栏）
        document.addEventListener('mousedown', (e) => {
            const titbar = e.target.closest('.titbar');
            if (!titbar) return;
            const windowEl = titbar.closest('.window');
            this.dragWindow(windowEl, e);
        });
    }

    // 打开窗口
    openWindow(appType) {
        // 检查是否已打开该应用
        const existingWindow = document.querySelector(`.window[data-app="${appType}"].active`);
        if (existingWindow) {
            existingWindow.style.zIndex = ++this.zIndexMax;
            return;
        }

        // 克隆模板
        const template = document.querySelector(`#window-templates .window[data-app="${appType}"]`);
        const newWindow = template.cloneNode(true);
        newWindow.classList.remove('hidden');
        newWindow.classList.add('active');
        newWindow.style.zIndex = ++this.zIndexMax;

        // 随机位置（避免重叠）
        newWindow.style.top = `${Math.random() * 30 + 10}%`;
        newWindow.style.left = `${Math.random() * 30 + 10}%`;
        newWindow.style.transform = 'none';

        // 添加到桌面
        document.getElementById('desktop').appendChild(newWindow);
        this.windows.push(newWindow);

        // 触发应用初始化
        window.dispatchEvent(new CustomEvent(`app:${appType}:init`, { detail: newWindow }));
    }

    // 关闭窗口
    closeWindow(windowEl) {
        windowEl.remove();
        this.windows = this.windows.filter(w => w !== windowEl);
    }

    // 最小化窗口
    minimizeWindow(windowEl) {
        windowEl.style.top = 'calc(100% - 10px)';
        windowEl.style.left = `${this.windows.indexOf(windowEl) * 60 + 20}px`;
        windowEl.style.width = '150px';
        windowEl.style.height = '50px';
        windowEl.style.transform = 'scale(0.8)';
    }

    // 最大化/还原窗口
    maximizeWindow(windowEl) {
        if (windowEl.classList.contains('maximized')) {
            // 还原
            windowEl.classList.remove('maximized');
            windowEl.style.top = windowEl.dataset.originalTop;
            windowEl.style.left = windowEl.dataset.originalLeft;
            windowEl.style.width = windowEl.dataset.originalWidth;
            windowEl.style.height = windowEl.dataset.originalHeight;
        } else {
            // 最大化
            windowEl.dataset.originalTop = windowEl.style.top;
            windowEl.dataset.originalLeft = windowEl.style.left;
            windowEl.dataset.originalWidth = windowEl.style.width;
            windowEl.dataset.originalHeight = windowEl.style.height;
            windowEl.classList.add('maximized');
            windowEl.style.top = '0';
            windowEl.style.left = '0';
            windowEl.style.width = '100vw';
            windowEl.style.height = 'calc(100vh - 50px)';
        }
    }

    // 拖拽窗口
    dragWindow(windowEl, e) {
        if (windowEl.classList.contains('maximized')) return; // 最大化时禁止拖拽
        const startX = e.clientX;
        const startY = e.clientY;
        const windowLeft = parseInt(windowEl.style.left);
        const windowTop = parseInt(windowEl.style.top);

        // 鼠标移动事件
        const onMouseMove = (e) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            windowEl.style.left = `${windowLeft + dx}px`;
            windowEl.style.top = `${windowTop + dy}px`;
        };

        // 鼠标松开事件
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
}

// 初始化窗口管理器
window.zIndexMax = 100;
const windowManager = new WindowManager();
