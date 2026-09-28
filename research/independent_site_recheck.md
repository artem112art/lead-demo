# Independent website recheck — TOP-20

Дата проверки: 2026-09-29.

## ROOT CAUSE

`*.clients.site` был ошибочно принят за `primary_website`, потому что первичный pipeline начинался с поиска `site:clients.site` и использовал страницу Yandex Business одновременно как доказательство существования бизнеса и как его официальный сайт. Отдельный обязательный identity-check по названию, городу/адресу, телефону, бренду и публичным соцсетям перед выставлением score отсутствовал. В результате качество шаблонной secondary listing оценивалось как качество всей веб-инфраструктуры бизнеса.

Профилактика: `clients.site` всегда считать только discovery/secondary listing, пока отдельный домен не исключён двумя адресными поисковыми подходами. Перед score нужно (1) искать название + город/адрес, (2) искать телефон и/или бренд/соцсеть, (3) открыть найденный домен, (4) сверить идентичность, (5) проверить mobile/CTA/структуру/актуальность. `UNCERTAIN` запрещён в TOP-10.

## Итог

- Самостоятельный домен найден или вероятно найден у **14 из 20**.
- `FOUND_GOOD`: **9** — исключены.
- `FOUND_WEAK`: **0**.
- `FOUND_BROKEN`: **4** — оставлены.
- `NOT_FOUND`: **6** — оставлены.
- `UNCERTAIN`: **1** — исключён quality gate.

| company | city | old_website | independent_site_status | primary_website_url | what_was_wrong_before | new_score | keep_or_drop | reason |
|---|---|---|---|---|---|---:|---|---|
| Becker | Санкт-Петербург | https://becker.clients.site/ | FOUND_GOOD | https://kuhni-becker-spb.ru/ | Оценивалась listing вместо самостоятельного сайта | 2.6 | DROP | Responsive-сайт с сильным оффером, квизом расчёта, формами и гарантией |
| Good-Avto | Санкт-Петербург | https://good-avto.clients.site/ | FOUND_GOOD | https://good-avto.com/ | Не был найден домен, совпадающий по телефону и адресу | 1.8 | DROP | 10 сервисов, цены, акции, гарантии, отзывы и запись уже собраны в рабочую воронку |
| Елховка SPA | Елховка | https://elhovka-spa.clients.site/ | NOT_FOUND | https://elhovka-spa.clients.site/ | Отсутствие отдельного домена ранее не было проверено | 9.5 | KEEP | Два адресных поиска нашли только listing, карты, агрегаторы и соцсети |
| Реюньон | Москва | https://rejunon.clients.site/ | FOUND_GOOD | https://reunion-clinic.ru/ | Сильный клинический сайт был пропущен | 2.4 | DROP | Актуальные услуги, цены, врачи, доверие и формы записи; 360/1440 без overflow |
| Mami Beauty Room | Москва | https://mami-beauty.clients.site/ | NOT_FOUND | https://mami-beauty.clients.site/ | Отсутствие отдельного домена ранее не было проверено | 9.4 | KEEP | По названию/адресу и телефону найдены только listing, каталоги и соцсети |
| Профи-Потолков | Санкт-Петербург | https://profi-potolkov.clients.site/filter-category/natyazhnye-potolki-zamer-izgotovlenie-montazh | FOUND_GOOD | https://profi-potolkov.ru/ | Калькулятор, портфолио и основной домен были пропущены | 2.2 | DROP | Каталог, цены, галерея, калькулятор, замер и формы уже есть |
| BURO Бизнес Консалтинг | Смоленск | https://juridicheskie-uslugi-biznes-konsalting.clients.site/ | NOT_FOUND | https://juridicheskie-uslugi-biznes-konsalting.clients.site/ | Отсутствие отдельного домена ранее не было проверено | 9.3 | KEEP | Ни exact-name/address, ни phone/messenger search не дали credible owned domain |
| Сёма | Новороссийск | https://sema-prospekt-dzerzhinskogo.clients.site/ | FOUND_BROKEN | https://novoros.semaclub.ru/ | Локальный официальный subdomain не был открыт | 9.6 | KEEP | Домен подтверждён адресом, но редиректит на semaclub.ru с нерелевантной ипотечной страницей |
| МЗ Синергия | Санкт-Петербург | https://mz-sinergija.clients.site/ | FOUND_GOOD | https://mz-sinergia.ru/ | Производственный сайт был пропущен | 2.8 | DROP | Полный цикл, оборудование/услуги, ERP/ISO, продукция и запрос сметы; minor mobile overflow не делает сайт слабым |
| Villa Volga | Конаково | https://villa-volga-pervomajskaja-ulitsa.clients.site/ | NOT_FOUND | https://villa-volga-pervomajskaja-ulitsa.clients.site/ | Отсутствие отдельного домена ранее не было проверено | 9.1 | KEEP | Два поиска дали listing и travel-агрегаторы, но не owned domain |
| Имплант Профи | Москва | https://implant-profi.clients.site/ | UNCERTAIN | https://implant-profi.clients.site/ | Сайт одноимённой сети нельзя автоматически приписать карточке | 4.0 | DROP | implantprofi.ru хорош, но его текущие адреса и телефон не совпадают с этим лидом; identity не доказана |
| Атмосфера | Красноярск | https://atmosfera-dental.clients.site/ | FOUND_BROKEN | https://atmosfera-dental.ru/ | Отдельный домен не был найден и открыт | 9.7 | KEEP | Телефон/адрес совпадают; live Chrome и TLS-проверка не загружают сайт, indexed copy предупреждает об устаревших данных и разработке |
| OMA Clinic | Химки | https://omaclinic.clients.site/ | NOT_FOUND | https://omaclinic.clients.site/ | Отсутствие отдельного домена ранее не было проверено | 8.9 | KEEP | Exact-name/location и phone search дали listing, каталоги и соцсети, но не owned domain |
| GreenDoor | Щёлково | https://fabrika-dverej-grendoor.clients.site/ | FOUND_BROKEN | https://greendoorrussia.ru/ | Подтверждённый домен не был открыт | 9.2 | KEEP | Телефон/адрес совпадают; HTTP/HTTPS live-проверки и TLS не дают рабочую страницу |
| NeBali Country Club | Солнечногорский округ | https://nebali.clients.site/ | FOUND_GOOD | https://глав-курорт.рф/ | Полноценный booking-site был пропущен | 1.9 | DROP | Виллы, даты/гости, online booking, ресторан и контакты; 360/1440 без overflow |
| Soloh SPA Village | Солохаул | https://soloh-spa-village.clients.site/ | FOUND_GOOD | https://soloh.ru/ | Современный официальный сайт был пропущен | 1.7 | DROP | Актуальные предложения 2026, размещение, SPA, ресторан и бронирование |
| Усадьба Соловьи | Малое Козино | https://usadba-solovi.clients.site/ | FOUND_BROKEN | https://solovi-usadba.ru/ | Два самостоятельных домена не были проверены live | 9.0 | KEEP | Current domain совпадает по телефону/адресу, но Chrome получает HTTP/2 protocol error; старый IDN-домен также не загрузился |
| Центр имени Хелен Келлер | Москва | https://helenkellercentr.clients.site/ | FOUND_GOOD | https://логопед-центр.рф/ | Самостоятельный сайт был пропущен | 2.5 | DROP | Направления, специалисты, отзывы, материалы и консультации; exact phone/address, responsive |
| LeFitness | Казань | https://lefitness.clients.site/ | NOT_FOUND | https://lefitness.clients.site/ | Отсутствие отдельного домена ранее не было проверено | 8.8 | KEEP | Название/адрес и телефон/social search не нашли credible owned domain |
| Разноцветные цыплята | Москва | https://raznotsvetnye-tsypljata-1684174999.clients.site/ | FOUND_GOOD | https://color-chicks.ru/msk/rechnoy-vokzal/ | Dedicated branch page федеральной сети был пропущен | 1.6 | DROP | Exact phone/address, возрастные программы, специалисты, цены, доказательства и diagnostic CTA |

## Quality gate

Каждый `KEEP` отвечает на вопрос «если владелец скажет, что сайт уже есть, можем ли мы показать, что нашли его и объективно увидели проблему?»:

- `FOUND_BROKEN`: найден конкретный принадлежащий бизнесу домен и зафиксирована воспроизводимая live-ошибка.
- `NOT_FOUND`: документированы два независимых адресных подхода, а отсутствие отдельного домена сформулировано как результат разумной проверки, не как абсолютный факт.
- `FOUND_GOOD` и `UNCERTAIN` в новый TOP-10 не включены.
