# Зелёная дверь — GitHub Pages site

Статический лендинг для репозитория `antonkurenkov/openbook`.

## Состав

- `index.html` — главная страница цикла.
- `styles.css` — лайнарт-стиль, адаптивная сетка, high-key оформление.
- `main.js` — мягкая анимация фона, раскрытие карточек, lightbox для обложки.
- `assets/` — favicon, обложка в высоком ключе и SVG-карточки книг.
- `.nojekyll` — отключает Jekyll-обработку на GitHub Pages.

## Деплой

1. Скопируйте содержимое архива в папку `/docs` репозитория `openbook`.
2. В настройках GitHub Pages выберите:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/docs`
3. После деплоя сайт будет доступен по адресу:

```text
https://antonkurenkov.github.io/openbook/
```

## Основные ссылки

- Openbook: <https://github.com/antonkurenkov/openbook>
- Oblivio Duorum: <https://github.com/antonkurenkov/oblivio.duorum>
- Лендинг первой книги: <https://antonkurenkov.github.io/oblivio.duorum/>

## Примечания

Страница заменяет старую витрину первой книги в `/docs` и делает сайт репозитория полноценной входной страницей цикла «Зелёная дверь».
