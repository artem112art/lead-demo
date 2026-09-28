# Search receipt

Дата первоначального исследования и исправляющего recheck: 2026-09-29.

## Correction notice

Первичный TOP-100/TOP-20 ошибочно использовал `*.clients.site` как `primary_website` без обязательного поиска самостоятельного домена. Поэтому прежний TOP-20 и TOP-10 были не authoritative. Исправляющий проход был намеренно ограничен прежним TOP-20; новый широкий поиск не выполнялся.

Новое правило: `clients.site` — discovery/secondary listing. Score разрешено выставлять только после поиска домена по двум независимым подходам и, если домен найден, live-аудита именно этого домена.

## Счётчики second-pass

- Обязательно перепроверено: **20 из 20** прежнего TOP-20.
- Минимум два независимых поисковых подхода: **20 из 20**.
- Самостоятельный домен найден или вероятно найден: **14**.
- `FOUND_GOOD`: **9**.
- `FOUND_WEAK`: **0**.
- `FOUND_BROKEN`: **4**.
- `NOT_FOUND`: **6**.
- `UNCERTAIN`: **1**.
- В новый TOP-10 включено: **10** (`4 FOUND_BROKEN + 6 NOT_FOUND`).
- Расширение на кандидатов ниже TOP-20: **не потребовалось**.
- Отправленных сообщений, форм, заявок или звонков: **0**.
- Созданных demo: **0**.
- Изменений Cloudflare: **0**.

## Два подхода по каждому кандидату

`A` — точное название + город/адрес. `B` — точный телефон и/или бренд/публичная соцсеть. Формулировки ниже отражают адресный recheck, а не новый широкий search.

| Company | Approach A | Approach B | Result |
|---|---|---|---|
| Becker | `"Becker" мебель Санкт-Петербург Смоляная 9 официальный сайт` | `"info_becker_bot" Becker сайт` | `kuhni-becker-spb.ru` |
| Good-Avto | `"Good-Avto" Санкт-Петербург Выборгское шоссе 2 официальный сайт` | `"+7 812 565-97-15" сайт` | `good-avto.com` |
| Елховка SPA | `"Елховка SPA" официальный сайт Нижегородская область` | `"+7 910 103-33-03" сайт` | NOT_FOUND |
| Реюньон | `"Реюньон" стоматология Москва Кантемировская официальный сайт` | `"+7 495 157-31-23" стоматология сайт` | `reunion-clinic.ru` |
| Mami Beauty Room | `"Mami Beauty Room" Москва официальный сайт Каховка 19` | `"+7 925 563-19-16" сайт` | NOT_FOUND |
| Профи-Потолков | `"Профи-Потолков" Санкт-Петербург официальный сайт Новоколомяжский 4` | `"+7 921 906-84-83" сайт` | `profi-potolkov.ru` |
| BURO Бизнес Консалтинг | `"BURO Бизнес Консалтинг" Смоленск официальный сайт Чуриловский 19` | `"+7 920 315-57-65" сайт` | NOT_FOUND |
| Сёма | `"Сёма" Новороссийск Дзержинского 226 официальный сайт` | `"+7 918 039-03-03" сайт` | `novoros.semaclub.ru` → broken redirect |
| МЗ Синергия | `"МЗ Синергия" Санкт-Петербург официальный сайт Индустриальный 44А` | `"+7 812 333-17-77" сайт` | `mz-sinergia.ru` |
| Villa Volga | `"Villa Volga" Конаково Первомайская 4А официальный сайт` | `"+7 985 997-87-02" сайт` | NOT_FOUND |
| Имплант Профи | `"Имплант Профи" Москва официальный сайт +7 926 282-48-00` | `"+7 926 282-48-00" стоматология` | same-name domain found, exact identity UNCERTAIN |
| Атмосфера | `"Атмосфера" стоматология Красноярск официальный сайт +7 995 440-03-30` | `"atmosfera_smile_krsk" сайт` | `atmosfera-dental.ru` |
| OMA Clinic | `"OMA Clinic" Химки официальный сайт +7 995 615-29-58` | `"+7 995 615-29-58" сайт` | NOT_FOUND |
| GreenDoor | `"GreenDoor" фабрика дверей Щёлково официальный сайт +7 903 615-15-29` | `"+7 903 615-15-29" двери сайт` | `greendoorrussia.ru` |
| NeBali Country Club | `"NeBali Country Club" Истра официальный сайт` | `"+7 968 322-73-14" сайт` | `глав-курорт.рф` |
| Soloh SPA Village | `"Soloh SPA Village" официальный сайт` | `"+7 928 454-70-07" сайт` | `soloh.ru` |
| Усадьба Соловьи | `"Усадьба Соловьи" Малое Козино официальный сайт` | `"+7 986 756-30-00" сайт` | `solovi-usadba.ru` and older IDN domain |
| Центр имени Хелен Келлер | `"Центр имени Хелен Келлер" официальный сайт` | `"+7 985 928-95-94" сайт` | `логопед-центр.рф` |
| LeFitness | `"LeFitness" Казань "+7 927 471-22-75"` | `"le_fitness_studio" Казань сайт` | NOT_FOUND |
| Разноцветные цыплята | `"Разноцветные цыплята" "Речной вокзал" Москва официальный сайт` | `"colorchicks_rv_y" сайт` and exact phone | dedicated `color-chicks.ru` branch page |

## Official-site identity evidence

Принадлежность домена не выводилась только из совпадения названия. Использовалось совпадение одного или нескольких устойчивых identifiers: точный телефон, адрес, локальный subdomain/branch page, карточка maps, публичная соцсеть или отраслевой каталог. Особые случаи:

- **Good-Avto:** `good-avto.com` содержит точный телефон исследованной точки и адрес Выборгское шоссе, 2.
- **Профи-Потолков:** домен и публичные карточки связывают бренд и адрес; сайт содержит собственный коммерческий контур.
- **МЗ Синергия:** точный телефон `+7 812 333-17-77`, бренд и производственный профиль совпадают.
- **Сёма:** partner directory связывает `novoros.semaclub.ru` с адресом Дзержинского, 226; текущий redirect ведёт на нерелевантный контент.
- **Атмосфера:** точный телефон и оба адреса совпадают в домене, Yandex Maps и dental directories.
- **Имплант Профи:** name match без phone/address match признан недостаточным; статус `UNCERTAIN`.

## Bounded browser audit independent domains

Использован live Chromium через Playwright CLI. Проверены `360 × 900` и `1440 × 900`, HTTP result, title/H1/H2, CTA, forms, horizontal overflow, phone links и видимый текст.

### FOUND_GOOD

- Becker: HTTP 200; overflow нет; calculator, forms, warranty and direct CTAs.
- Good-Avto: HTTP 200; overflow нет; 10 locations, services, prices, guarantees and booking.
- Реюньон: HTTP 200; overflow нет; doctors/services/prices and appointment forms.
- Профи-Потолков: HTTP 200; overflow нет; catalogue, gallery, calculator and measurement CTA.
- МЗ Синергия: HTTP 200; desktop clean; `scrollWidth=392` at 360, but commercial structure is complete (services, ERP/ISO, products, quote form).
- NeBali: HTTP 200; overflow нет; date/guest selection and online booking.
- Soloh: HTTP 200; overflow нет; current 2026 offers, accommodation and booking.
- Центр имени Хелен Келлер: HTTP 200; overflow нет; directions, specialists, reviews, articles and consultation.
- Разноцветные цыплята: HTTP 200; overflow нет; exact branch, age programs, specialists, prices and five forms.

### FOUND_BROKEN

- Атмосфера: Chromium `ERR_CONNECTION_CLOSED` on HTTP/HTTPS; curl TLS handshake failed.
- GreenDoor: Chromium HTTP response/connection failures; curl TLS handshake failed.
- Усадьба Соловьи: current domain `ERR_HTTP2_PROTOCOL_ERROR`; older Yandex-listed independent domain timed out.
- Сёма: local domain redirects to `semaclub.ru`; destination currently shows unrelated mortgage content and does not complete a normal DOM load.

## Scoring correction

Прежний score не переносился автоматически. Новый score учитывает:

- доказанную принадлежность и состояние фактического primary site;
- активность бизнеса и экономику лида;
- воспроизводимость конкретной проблемы;
- возможность честно ответить владельцу, что его сайт действительно найден и проверен.

`FOUND_GOOD` получил низкий lead-priority независимо от недостатков `clients.site`. `FOUND_BROKEN` получил высокий приоритет только при подтверждённой identity. `NOT_FOUND` остаётся потенциальным лидом, но формулируется как результат разумной проверки. `UNCERTAIN` исключён.

## Ограничения

1. `NOT_FOUND` не доказывает абсолютное отсутствие домена; это результат двух разумных адресных подходов на дату среза.
2. Live-ошибки доменов могут быть временными, поэтому перед будущим разрешённым outreach их нужно повторно проверить.
3. Для 80 кандидатов вне прежнего TOP-20 independent-domain recheck не выполнялся; их старые scores остаются предварительными.
4. Исследование не подтверждает бюджет или готовность купить.
5. Использованы только публичные бизнес-данные; сообщения не отправлялись.

## Файлы результата

- [`leads_100.csv`](./leads_100.csv) — канонический набор с полями independent-site recheck.
- [`leads_100.md`](./leads_100.md) — читаемый индекс; строки вне TOP-20 отмечены `NOT_RECHECKED`.
- [`top_20.md`](./top_20.md) — пересчитанный TOP-20.
- [`top_10.md`](./top_10.md) — очищенный TOP-10.
- [`independent_site_recheck.md`](./independent_site_recheck.md) — root cause и полный decision ledger.
