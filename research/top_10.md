# Очищенный TOP-10 потенциальных клиентов

Срез: 2026-09-29. В рейтинг входят только кандидаты со статусом `FOUND_BROKEN` или `NOT_FOUND`. `FOUND_GOOD` исключены, `UNCERTAIN` не прошёл quality gate. Никакие сообщения, формы, заявки или звонки не отправлялись.

| Rank | Company | City | Niche | New score | Primary website | Independent status | Best public contact |
|---:|---|---|---|---:|---|---|---|
| 1 | Атмосфера | Красноярск | Стоматология | 9.7 | [atmosfera-dental.ru](https://atmosfera-dental.ru/) | FOUND_BROKEN | [Telegram](https://telegram.me/atmosfera_smile_krsk) |
| 2 | Сёма | Новороссийск | Детский центр | 9.6 | [novoros.semaclub.ru](https://novoros.semaclub.ru/) | FOUND_BROKEN | [Telegram](https://telegram.me/sema0390303) |
| 3 | Елховка SPA | Елховка | Загородный отдых | 9.5 | [clients.site](https://elhovka-spa.clients.site/) | NOT_FOUND | [Telegram](https://telegram.me/elhovkaspa) |
| 4 | Mami Beauty Room | Москва | Косметология | 9.4 | [clients.site](https://mami-beauty.clients.site/) | NOT_FOUND | [WhatsApp](https://wa.me/79255631916) |
| 5 | BURO Бизнес Консалтинг | Смоленск | Юридические и бухгалтерские услуги | 9.3 | [clients.site](https://juridicheskie-uslugi-biznes-konsalting.clients.site/) | NOT_FOUND | [Telegram](https://telegram.me/+79203155765) |
| 6 | GreenDoor | Щёлково | Двери | 9.2 | [greendoorrussia.ru](https://greendoorrussia.ru/) | FOUND_BROKEN | [Telegram](https://telegram.me/+79036151529) |
| 7 | Villa Volga | Конаково | Гостиница | 9.1 | [clients.site](https://villa-volga-pervomajskaja-ulitsa.clients.site/) | NOT_FOUND | +7 985 997-87-02 |
| 8 | Усадьба Соловьи | Малое Козино | Загородный отдых | 9.0 | [solovi-usadba.ru](https://solovi-usadba.ru/) | FOUND_BROKEN | +7 986 756-30-00 |
| 9 | OMA Clinic | Химки | Косметология | 8.9 | [clients.site](https://omaclinic.clients.site/) | NOT_FOUND | [Telegram](https://telegram.me/OMACLINIC) |
| 10 | LeFitness | Казань | Фитнес-студия | 8.8 | [clients.site](https://lefitness.clients.site/) | NOT_FOUND | [Telegram](https://telegram.me/le_fitness_studio) |

## Mini-audit и основание score

### 1. Атмосфера — 9.7 — FOUND_BROKEN

- Identity: точный телефон `+7 995 440-03-30`, название и два адреса совпадают на домене и публичных карточках.
- Live problem: Chromium на 360/1440 получает `ERR_CONNECTION_CLOSED`; curl фиксирует неуспешный TLS handshake.
- Indexed content: сайт сам предупреждает, что информация может быть устаревшей и находится в разработке; при этом клиника активна и открыла второй филиал.
- Коммерческий потенциал: высокий медицинский чек, две локации, активные каналы и объективно демонстрируемая проблема.

### 2. Сёма — 9.6 — FOUND_BROKEN

- Identity: `novoros.semaclub.ru` подтверждён названием, Новороссийском и адресом проспект Дзержинского, 226.
- Live problem: локальный домен редиректит на `semaclub.ru`; конечная страница имеет нерелевантный ипотечный title и не представляет детский центр.
- Бизнес активен через clients.site и публичный Telegram; абонементная модель даёт повторную выручку.

### 3. Елховка SPA — 9.5 — NOT_FOUND

- Exact-name/location и exact-phone searches не нашли owned domain; surfaced только clients.site, карты, travel-агрегаторы и соцсети.
- 576 отзывов и визуальная услуга подтверждают спрос, но listing не даёт полноценного выбора домика, дат и сценария отдыха.

### 4. Mami Beauty Room — 9.4 — NOT_FOUND

- По названию/адресу и телефону отдельный домен не найден; существуют listing, каталоги и соцсети.
- Высокий чек и повторные процедуры сочетаются с generic-представлением без самостоятельной premium-айдентики и экспертной архитектуры.

### 5. BURO Бизнес Консалтинг — 9.3 — NOT_FOUND

- По точному названию/адресу и телефону/messenger credible owned domain не найден.
- Долгосрочный B2B LTV высок, а listing не показывает отраслевые решения, кейсы, команду и понятный вход в консультацию.

### 6. GreenDoor — 9.2 — FOUND_BROKEN

- Identity: `greendoorrussia.ru` совпадает по бренду, адресу и телефону `+7 903 615-15-29`.
- Live problem: HTTP/HTTPS проверки завершаются response/connection failure; TLS-проверка также неуспешна.
- Производитель с визуальным продуктом и 77 отзывами остаётся доступен через listing и Telegram.

### 7. Villa Volga — 9.1 — NOT_FOUND

- По названию/адресу и точному телефону найдены listing и travel-агрегаторы, но не самостоятельный домен.
- 173 отзыва подтверждают объект; отсутствует собственный путь выбора номера, дат и пакетного предложения.

### 8. Усадьба Соловьи — 9.0 — FOUND_BROKEN

- Identity: `solovi-usadba.ru` совпадает по телефону `+7 986 756-30-00` и адресу Малое Козино, Энгельса, 2А.
- Live problem: Chrome получает `ERR_HTTP2_PROTOCOL_ERROR`; старый домен, указанный Yandex, также не загрузился.
- Indexed content датирован 2026 годом, поэтому это не просто историческая запись, а сломанный текущий канал.

### 9. OMA Clinic — 8.9 — NOT_FOUND

- Exact-name/location и exact-phone searches не выявили owned domain; найдены listing, карты, каталоги и соцсети.
- Активная клиника с высоким чеком зависит от каталога listing и не имеет самостоятельной медицинской trust-архитектуры.

### 10. LeFitness — 8.8 — NOT_FOUND

- Exact-name/address и phone/social searches не нашли отдельный домен; карты подтверждают активную студию и 53 отзыва.
- Повторные абонементы дают понятную экономику, а primary listing не собирает направления, тренеров и пробное занятие в собственную воронку.

## Лучший кандидат для первого персонального demo

**Атмосфера**. У неё наиболее чистая доказательная цепочка: домен действительно принадлежит клинике, совпадают телефон и адреса, бизнес активен и имеет две локации, а самостоятельный сайт воспроизводимо не открывается и в indexed copy сам признаёт устаревание/разработку. Это позволяет показать проблему объективно, не опираясь на слабость `clients.site` и не споря с владельцем о наличии сайта.

Demo не создавался и не должен создаваться без отдельного разрешения.
