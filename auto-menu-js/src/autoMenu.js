/*!
 * AutoMenu v1.0.0
 * Adaptive horizontal menu with “More” overflow handling
 * Author: Zyryanov Kirill Andreevich / Regilios
 * License: MIT
 */

class AutoMenu {
    constructor(selector = '.mul-am', options = {}) {
        this.selector = selector;

        // Настройки с умолчаниями
        this.options = Object.assign({
                reservePadding: 25,
                menuHeight: 56
            },
            options
        );

        // Автоинициализация
        this._init();
    }

    // ================= ИНИЦИАЛИЗАЦИЯ =================
    _init() {
        document.querySelectorAll(this.selector).forEach((ul) => {
            requestAnimationFrame(() => this._initMenu(ul));
        });
    }

    // ================= ОСНОВНОЙ ПРОЦЕСС =================
    _initMenu(ul) {
        // ------------------- созданные элементы -------------------
        const liMore = document.createElement('li');
        liMore.className = 'mul-more-am';
        const liClean = document.createElement('li');
        liClean.className = 'mul-clean-am';
        const divMoreText = document.createElement('div');
        divMoreText.className = 'mul-more-text';
        divMoreText.textContent = 'Ещё';
        const ulDrop = document.createElement('ul');
        ulDrop.className = 'mul-more-drop-am';
        liMore.append(divMoreText, ulDrop);

        // ------------------- внутренние состояния -------------------
        let flagMoreCreated = false // проверка создания more (ещё)
        let itemsFirstLi = null // первый li в drop
        let itemsWidthFirstLi = null // ширина первого li в drop
        let widthliInner = null // ширина первого li в drop с учётом паддингов
        let widthLiClean = null // ширина заполнителя на месте убранных li
        let pLeft = null // padding left li
        let pRight = null // padding right li
        let listLiUpdated = null // текущий список li с учётом more clean
        let listLi = null // основной список li без more clean
        let ulBound = 0 // right позиция ul на экране
        let widthMore = 0 // ширина элемента more (ещё)
        let openListneer = false // проверка создания слушателя для more (ещё)
        let previousWidth = ul.getBoundingClientRect().width // отслеживаем предыдущую ширину

        // ------------------- ХЕЛПЕРЫ -------------------
        // свои dropdown
        const initAppointDropdown = () => {
            const dropdownMenu = ul.querySelectorAll('.mul-dropdown');

            dropdownMenu.forEach((element) => {
                const dropMenuList = element.querySelector('.mul-dropdown-menu');
                dropMenuList.style.setProperty('--height-dropdown', this.options.menuHeight + 'px');

                element.addEventListener('click', (event) => {
                    if (event.target.closest('.mul-dropdown-btn')) {
                        event.preventDefault();
                        event.stopPropagation();
                        dropMenuList.classList.toggle('mul-open-dropdown');
                    }
                });
            });

            document.addEventListener('click', (event) => {
                dropdownMenu.forEach((element) => {
                    const menu = element.querySelector('.mul-dropdown-menu');
                    if (!element.contains(event.target)) {
                        menu.classList.remove('mul-open-dropdown');
                    }
                });
            });
        };

        // dropdown для пункта Ещё	
        const openDrop = (liMore, ulDrop) => {
            ulDrop.style.setProperty('--height-more', this.options.menuHeight + 'px');
            liMore.addEventListener('mouseenter', () => liMore.classList.add('mul-open-am'));
            liMore.addEventListener('mouseleave', () => liMore.classList.remove('mul-open-am'));
            ulDrop.addEventListener('mouseleave', () => {
                document.querySelectorAll('.mul-dropdown-menu').forEach((element) => {
                    element.classList.remove('mul-open-dropdown');
                });
                liMore.classList.remove('mul-open-am');
            });
        };

        // ========= отдельные методы =========
        const wrapContent = (element, wrapperTag = 'div') => this._wrapContent(element, wrapperTag);
        const unWrapContent = (element) => this._unWrapContent(element);
        const getList = () => this._getList(ul);
        const resetVariables = () => {
            listLiUpdated = null;
            itemsFirstLi = null;
            itemsWidthFirstLi = null;
            listLi = null;
            pLeft = null;
            pRight = null;
        };

        // ------------------- основная логика -------------------
        const buildMenu = () => {
            if (!listLi) listLi = getList();
            if (listLi.length === 0) return;

            if (!pLeft && !pRight) {
                pLeft = parseInt(getComputedStyle(listLi[0]).paddingLeft);
                pRight = parseInt(getComputedStyle(listLi[0]).paddingRight);
            }

            ulBound = ul.getBoundingClientRect().right;

            Array.from(listLi)
                .reverse()
                .forEach((element) => {
                    let liBound = element.getBoundingClientRect().right;
                    if (flagMoreCreated) {
                        widthMore = ul.querySelector('.mul-more-am').getBoundingClientRect().width;
                        liBound += widthMore + this.options.reservePadding;
                    }

                    if (ulBound <= liBound) {
                        if (!flagMoreCreated) {
                            ul.append(liClean, liMore);
                            flagMoreCreated = true;
                        }
                        wrapContent(element);
                        ulDrop.prepend(element);

                        if (!openListneer) {
                            openDrop(liMore, ulDrop);
                            openListneer = true;
                        }

                        itemsFirstLi = null;
                        itemsWidthFirstLi = null;
                    }
                });

            resetVariables();
        };

        const disassemblyMenu = () => {
            if (!flagMoreCreated) return;
            if (!itemsFirstLi) itemsFirstLi = ul.querySelector('ul.mul-more-drop-am li:first-child');

            if (!itemsFirstLi) {
                liMore.remove();
                liClean.remove();
                flagMoreCreated = false;
                openListneer = false;
                resetVariables();
                return;
            }

            let processedAny = false;

            while (itemsFirstLi) {
                itemsWidthFirstLi = itemsFirstLi.querySelector('.mul-wrapper-am');
                if (!itemsWidthFirstLi) break;

                if (ulDrop.childNodes.length > 1) {
                    widthLiClean = liClean.getBoundingClientRect().width;
                } else {
                    widthLiClean = liClean.getBoundingClientRect().width + widthMore - this.options.reservePadding;
                }

                widthliInner = pLeft + pRight + itemsWidthFirstLi.getBoundingClientRect().width;

                if (widthLiClean > widthliInner) {
                    unWrapContent(itemsFirstLi);

                    if (!listLiUpdated) {
                        listLiUpdated = Array.from(ul.children).filter((node) =>
                            node.tagName === 'LI' &&
                            !node.classList.contains('mul-more-am') &&
                            !node.classList.contains('mul-clean-am')
                        );
                    }

                    const refNode = ul.querySelector('li.mul-clean-am') || ul.querySelector('li.mul-more-am') || null;

                    ul.insertBefore(itemsFirstLi, refNode);
                    processedAny = true;

                    itemsFirstLi = ul.querySelector('ul.mul-more-drop-am li:first-child');

                    if (!itemsFirstLi) {
                        liMore.remove();
                        liClean.remove();
                        flagMoreCreated = false;
                        openListneer = false;
                        break;
                    }
                } else {
                    break;
                }
            }

            if (processedAny) resetVariables();
        };

        const handleResize = (entries) => {
            for (let entry of entries) {
                const currentWidth = entry.contentRect.width;
                if (currentWidth > previousWidth && flagMoreCreated) disassemblyMenu();
                else if (currentWidth < previousWidth) buildMenu();
                previousWidth = currentWidth;
            }
        };

        // ------------------- запуск -------------------
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(ul);

        initAppointDropdown();
        buildMenu();
        ul.classList.add('mul-ready');
    }

    // ================== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==================

    // Обёртка для элементов внутри ещё для вычисления точной ширины
    _wrapContent(element, wrapperTag = 'div') {
        if (!element || element.classList.contains('mul-inner-am')) return null;
        const wrapper = document.createElement(wrapperTag);
        wrapper.className = 'mul-wrapper-am';

        const subMenu = Array.from(element.children).find((c) => c.tagName === 'UL');
        const children = Array.from(element.childNodes);
        children.forEach((child) => {
            if (child !== subMenu) wrapper.appendChild(child);
        });

        element.innerHTML = '';
        element.appendChild(wrapper);
        if (subMenu) element.appendChild(subMenu);
        element.classList.add('mul-inner-am');
        return wrapper;
    }

    // Удаление обёртки когда возвращаем пунткты назад в меню	
    _unWrapContent(element) {
        if (!element) return null;
        element.classList.remove('mul-inner-am');
        const wrapperDiv = Array.from(element.children).find((c) =>
            c.classList ? c.classList.contains('mul-wrapper-am') : false
        );
        const subMenu = Array.from(element.children).find((c) => c.tagName === 'UL');

        if (wrapperDiv) {
            const wrapperChildren = Array.from(wrapperDiv.childNodes);
            element.innerHTML = '';
            wrapperChildren.forEach((child) => element.appendChild(child));
            if (subMenu) element.appendChild(subMenu);
        }

        return element;
    }

    // получаем список меню без управляющих элементов
    _getList(ul) {
        return Array.from(ul.children).filter(
            (node) =>
            node.tagName === 'LI' &&
            !node.classList.contains('mul-more-am') &&
            !node.classList.contains('mul-clean-am')
        );
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new AutoMenu();
});

if (typeof module !== 'undefined') {
    module.exports = AutoMenu;
}