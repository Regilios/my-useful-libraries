#### AutoMenu.js
Легкий JS-плагин, который автоматически сворачивает пункты меню в раздел «Ещё», 
если не хватает ширины экрана.
- Содержит собственные выпадающие меню без зависимостей. 
- Вариант мобильного меню создаётся отдельно.

**Установка**
###### Через `<script>` и `<link>`:
```html
<link rel="stylesheet" href="autoMenu.min.css">
<script src="autoMenu.min.js"></script>
```

###### или через `npm`:
```npm
npm install auto-menu-js
```

**Использование**
- Установите класс `mul-am` на основной **`ul`** меню.
- Для выпадающего меню установите на **`li`** класс `mul-dropdown`, внутри него создайте тег с классом `mul-dropdown-btn` он будет выступать в качестве тригера для открытия подменю, на само подменю в тег **`ul`** (или другой) добавьте класс `mul-dropdown-menu`.
- вложенность `mul-dropdown` не ограничена.

```html
<ul class="mul-am">
    <li><a href="#">Главная</a></li>
    <li><a href="#">Оплата</a></li>
    <li><a href="#">Доставка</a></li>
    <li class="mul-dropdown">
        <a class="mul-dropdown-btn">Выпадающее меню 1</a>
        <ul class="mul-dropdown-menu">
            <li><a href="#">Подпункт 1.1</a></li>
            <li><a href="#">Подпункт 1.2</a></li>
            <li class="mul-dropdown">
                <a class="mul-dropdown-btn">Выпадающее меню 2</a>
                <ul class="mul-dropdown-menu">
                    <li><a href="#">Подпункт 2.1</a></li>
                    <li><a href="#">Подпункт 2.2</a></li>
                </ul>
            </li>
        </ul>
    </li>
  ...
</ul>
```
Если ваше меню по струтурке не привязано к **`ul > li`** внесите правки в код заменив упомнинания `UL и LI` на нужный вам тег либо поменяв на привязку к классу