# TOP-20 после final availability recheck текущей десятки

Срез: 2026-09-29. Для позиций прежнего TOP-10 выполнен отдельный final availability + commercial quality recheck. Позиции 11–20 ниже не проверялись повторно в этом проходе и сохранены как результат предыдущего independent-site recheck. `clients.site` не считается доказательством слабого основного сайта, а единичный failed request не считается доказательством поломки.

Для каждого кандидата применены минимум два независимых подхода:

1. точное название + город и/или адрес;
2. точный телефон и/или бренд, публичная соцсеть и ссылки из карточек.

Найденные самостоятельные домены открывались в live Chromium на `360 × 900` и `1440 × 900`; проверялись identity, загрузка, horizontal overflow, CTA, структура и актуальность. Итоговый ledger текущей десятки: [`final_top10_recheck.md`](./final_top10_recheck.md). Предыдущий второй проход: [`independent_site_recheck.md`](./independent_site_recheck.md).

| Rank | ID | Company | Niche / city | Final status / quality | Primary website | Live audit / identity result | New score | Decision |
|---:|---|---|---|---|---|---|---:|---|
| 1 | L061 | Сёма | Детский центр / Новороссийск | BROKEN_CONFIRMED / NONE | [novoros.semaclub.ru](https://novoros.semaclub.ru/) | Browser and HTTP client reproduce redirect to unrelated mortgage content; exact active branch confirmed | 9.8 | KEEP |
| 2 | L049 | GreenDoor | Двери / Щёлково | BROKEN_CONFIRMED / NONE | [greendoorrussia.ru](https://greendoorrussia.ru/) | Browser plus independent HTTP/HTTPS/TLS checks fail; exact current business card confirms domain and contacts | 9.6 | KEEP |
| 3 | L079 | Елховка SPA | Загородный отдых / Елховка | NO_INDEPENDENT_SITE / VERY_WEAK | [clients.site](https://elhovka-spa.clients.site/) | Listing is live, but lacks inventory, prices, dates and booking flow | 9.5 | KEEP |
| 4 | L083 | Villa Volga | Гостиница / Конаково | NO_INDEPENDENT_SITE / VERY_WEAK | [clients.site](https://villa-volga-pervomajskaja-ulitsa.clients.site/) | Listing is live, but lacks room types, availability and direct booking | 9.3 | KEEP |
| 5 | L076 | BURO Бизнес Консалтинг | B2B-услуги / Смоленск | NO_INDEPENDENT_SITE / WEAK | [clients.site](https://juridicheskie-uslugi-biznes-konsalting.clients.site/) | Active listing lacks team evidence, cases and segmented consultation path | 9.0 | KEEP |
| 6 | L084 | Усадьба Соловьи | Загородный отдых / Малое Козино | INTERMITTENT / WEAK | [solovi-usadba.ru](https://solovi-usadba.ru/) | Live checks fail, but current indexed 2026 content prevents BROKEN_CONFIRMED; weak pricing/booking path remains | 8.8 | KEEP |
| 7 | L051 | Mami Beauty Room | Косметология / Москва | NO_INDEPENDENT_SITE / WEAK | [clients.site](https://mami-beauty.clients.site/) | Prices and WhatsApp exist, but no specialist/safety trust architecture | 8.7 | KEEP |
| 8 | L014 | Атмосфера | Стоматология / Красноярск | INTERMITTENT / ADEQUATE | [atmosfera-dental.ru](https://atmosfera-dental.ru/) | Indexed current services, prices, reviews, documents, news and two locations contradict BROKEN; only targeted issues proven | 4.5 | DROP |
| 9 | L091 | LeFitness | Фитнес / Казань | NO_INDEPENDENT_SITE / ADEQUATE | [clients.site](https://lefitness.clients.site/) | Live responsive listing already supplies services, prices, reviews, contacts and online booking | 4.3 | DROP |
| 10 | L055 | OMA Clinic | Косметология / Химки | LIVE / ADEQUATE | [omaclinic.host-ai.site](https://omaclinic.host-ai.site/) | Independent site discovered by exact phone; responsive services, documents, contacts and YCLIENTS booking | 4.0 | DROP |
| 11 | L013 | Имплант Профи | Стоматология / Москва | UNCERTAIN | [clients.site](https://implant-profi.clients.site/) | implantprofi.ru is good, but phone/locations do not match this lead; identity unresolved | 4.0 | DROP |
| 12 | L094 | МЗ Синергия | Металлообработка / Санкт-Петербург | FOUND_GOOD | [mz-sinergia.ru](https://mz-sinergia.ru/) | Exact phone/company; clear B2B offer, services, ERP/ISO, products and quote flow; minor 392 px mobile scrollWidth | 2.8 | DROP |
| 13 | L022 | Becker | Мебель / Санкт-Петербург | FOUND_GOOD | [kuhni-becker-spb.ru](https://kuhni-becker-spb.ru/) | Brand/location match; responsive offer, calculator, forms and warranty | 2.6 | DROP |
| 14 | L064 | Центр имени Хелен Келлер | Речь и слух / Москва | FOUND_GOOD | [логопед-центр.рф](https://логопед-центр.рф/) | Exact phone/address; responsive directions, specialists, reviews, materials and consultation CTA | 2.5 | DROP |
| 15 | L012 | Реюньон | Стоматология / Москва | FOUND_GOOD | [reunion-clinic.ru](https://reunion-clinic.ru/) | Exact brand/address; current prices, doctors, services and appointment forms | 2.4 | DROP |
| 16 | L045 | Профи-Потолков | Натяжные потолки / Санкт-Петербург | FOUND_GOOD | [profi-potolkov.ru](https://profi-potolkov.ru/) | Exact identity; catalogue, gallery, calculator, measurement CTA and forms | 2.2 | DROP |
| 17 | L080 | NeBali Country Club | Загородный отдых / Московская область | FOUND_GOOD | [глав-курорт.рф](https://глав-курорт.рф/) | Exact phone/property; villas, dates/guests and online booking; no overflow | 1.9 | DROP |
| 18 | L001 | Good-Avto | Автосервис / Санкт-Петербург | FOUND_GOOD | [good-avto.com](https://good-avto.com/) | Exact phone/address; 10 centers, prices, guarantees and booking forms | 1.8 | DROP |
| 19 | L081 | Soloh SPA Village | Загородный отдых / Сочи | FOUND_GOOD | [soloh.ru](https://soloh.ru/) | Exact phone/address; current 2026 offers and direct booking | 1.7 | DROP |
| 20 | L067 | Разноцветные цыплята | Детский центр / Москва | FOUND_GOOD | [branch page](https://color-chicks.ru/msk/rechnoy-vokzal/) | Exact phone/address; programs, specialists, prices and conversion forms | 1.6 | DROP |

## Вывод

Final availability recheck исключил **3 из прежнего TOP-10**: Атмосфера, LeFitness и OMA Clinic. В qualified shortlist осталось **7** кандидатов. Поиск замен ниже текущей десятки намеренно не выполнялся. Позиции 11–20 остаются историческим результатом предыдущего прохода и не смешиваются с новой operational/commercial классификацией.
