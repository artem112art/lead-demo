# Lead Demo Lab

Один статический проект для независимых клиентских демо-сайтов. Он публикуется параллельно на Cloudflare Pages и GitHub Pages без build-step.

## Публикация

- Cloudflare Pages: `https://lead-demo.pages.dev/`
- GitHub Pages: `https://artem112art.github.io/lead-demo/`
- Источник для обоих хостов: ветка `main`, корень репозитория.

Файл `.nojekyll` отключает Jekyll-обработку на GitHub Pages. Все внутренние ссылки и assets должны оставаться относительными, чтобы одинаково работать в корне Cloudflare и в подпути `/lead-demo/` GitHub Pages.

Проверка путей не требует установки зависимостей:

```powershell
node .\scripts\validate-static-paths.mjs
```

## Добавление нового клиента

1. Создайте новую папку `demos/<slug>/`.
2. Добавьте в неё собственный `index.html`, стили и локальные assets.
3. Добавьте ссылку на демо в корневой `index.html`.
4. Проверьте страницу на мобильной и десктопной ширине.
5. Сделайте commit и push в `main` — Cloudflare Pages развернёт изменения автоматически.

URL формируется так:

```text
https://lead-demo.pages.dev/demos/<slug>/
https://artem112art.github.io/lead-demo/demos/<slug>/
```

Не копируйте папку другого клиента как обязательный шаблон. Новый demo можно и нужно создавать полностью с нуля, если бизнес-контекст требует другой структуры, композиции или визуального языка. Переиспользуйте только нейтральные технические практики: responsive, semantic HTML, accessibility, SEO/meta и безопасную работу со ссылками и локальными assets.

Перед началом заполните [`DEMO_BRIEF_TEMPLATE.md`](./DEMO_BRIEF_TEMPLATE.md).
