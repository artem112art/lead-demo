# TOP-20 после independent-site recheck

Срез: 2026-09-29. Это исправляющий второй проход по прежнему TOP-20. `clients.site` больше не считается доказательством слабого основного сайта.

Для каждого кандидата применены минимум два независимых подхода:

1. точное название + город и/или адрес;
2. точный телефон и/или бренд, публичная соцсеть и ссылки из карточек.

Найденные самостоятельные домены открывались в live Chromium на `360 × 900` и `1440 × 900`; проверялись identity, загрузка, horizontal overflow, CTA, структура и актуальность. Детальный root cause и evidence ledger: [`independent_site_recheck.md`](./independent_site_recheck.md).

| Rank | ID | Company | Niche / city | Independent status | Primary website | Live audit / identity result | New score | Decision |
|---:|---|---|---|---|---|---|---:|---|
| 1 | L014 | Атмосфера | Стоматология / Красноярск | FOUND_BROKEN | [atmosfera-dental.ru](https://atmosfera-dental.ru/) | Exact phone/address; Chrome connection closed at both widths; TLS failure; indexed copy says site may be outdated/under development | 9.7 | KEEP |
| 2 | L061 | Сёма | Детский центр / Новороссийск | FOUND_BROKEN | [novoros.semaclub.ru](https://novoros.semaclub.ru/) | Exact branch/address; local domain redirects to semaclub.ru, currently an unrelated mortgage page | 9.6 | KEEP |
| 3 | L079 | Елховка SPA | Загородный отдых / Елховка | NOT_FOUND | [clients.site](https://elhovka-spa.clients.site/) | Name/location plus phone search found only listing, maps, aggregators and social/contact pages | 9.5 | KEEP |
| 4 | L051 | Mami Beauty Room | Косметология / Москва | NOT_FOUND | [clients.site](https://mami-beauty.clients.site/) | Name/address plus phone search found no owned domain | 9.4 | KEEP |
| 5 | L076 | BURO Бизнес Консалтинг | B2B-услуги / Смоленск | NOT_FOUND | [clients.site](https://juridicheskie-uslugi-biznes-konsalting.clients.site/) | Name/address and phone/messenger searches found no credible owned domain | 9.3 | KEEP |
| 6 | L049 | GreenDoor | Двери / Щёлково | FOUND_BROKEN | [greendoorrussia.ru](https://greendoorrussia.ru/) | Exact phone/address; HTTP/HTTPS and TLS live checks fail | 9.2 | KEEP |
| 7 | L083 | Villa Volga | Гостиница / Конаково | NOT_FOUND | [clients.site](https://villa-volga-pervomajskaja-ulitsa.clients.site/) | Name/address plus phone search found listings and travel aggregators only | 9.1 | KEEP |
| 8 | L084 | Усадьба Соловьи | Загородный отдых / Малое Козино | FOUND_BROKEN | [solovi-usadba.ru](https://solovi-usadba.ru/) | Exact phone/address; current site gives HTTP/2 protocol error, older official IDN times out | 9.0 | KEEP |
| 9 | L055 | OMA Clinic | Косметология / Химки | NOT_FOUND | [clients.site](https://omaclinic.clients.site/) | Name/location and phone search found listing/directories/socials only | 8.9 | KEEP |
| 10 | L091 | LeFitness | Фитнес / Казань | NOT_FOUND | [clients.site](https://lefitness.clients.site/) | Exact phone/address and social search found no owned independent domain | 8.8 | KEEP |
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

Прежний TOP-20 не был authoritative: **9 из 20** имели хорошие самостоятельные сайты и были исключены, ещё один кандидат остался `UNCERTAIN`. Расширение ниже прежнего TOP-20 не потребовалось: **4 `FOUND_BROKEN` + 6 `NOT_FOUND`** образуют ровно 10 кандидатов, прошедших quality gate.
