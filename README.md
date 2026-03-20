# 🏆 TrophyHunter

**Твій персональний AI помічник для Steam досягнень**

TrophyHunter - це сучасний веб-додаток, який допомагає гравцям отримувати детальні гайди та підказки щодо Steam досягнень. Завдяки інтеграції з Google Gemini AI та Google Search, ти отримуєш актуальні, перевірені рекомендації про те, як розблокувати будь-яке досягнення в будь-якій грі.

## ✨ Можливості

- 🎮 **Steam Інтеграція** - Авторизація через Steam та доступ до твоєї бібліотеки ігор
- 🔍 **Глобальний Пошук** - Пошук будь-якої гри зі Steam та перегляд глобальної бази досягнень
- 🤖 **AI Помічник** - Google Gemini з інтеграцією Google Search для актуальних гайдів
- 💬 **Chat UI** - Зручний інтерфейс для спілкування з AI помічником
- 📊 **Рідкість Досягнень** - Відсоток гравців з кожним досягненням
- 🎯 **Сортування** - Фільтр за рідкістю, статусом розблокування
- 🔒 **Секретні Досягнення** - Автоматичне приховування спойлерів
- 📱 **Мобільна Адаптація** - Повна підтримка мобільних пристроїв
- 🌙 **Dark Mode** - Темна тема за замовчуванням

## 🛠 Стек Технологій

**Frontend:**

- Next.js 16 (App Router)
- React 19.2
- TypeScript
- Tailwind CSS 4
- NextAuth.js v5 (Steam OAuth)

**Backend/API:**

- Next.js API Routes
- Steam Web API
- Google Generative AI SDK
- Google Search Grounding

**Infrastructure:**

- Vercel (Deployment)
- GitHub (Version Control)

## 🚀 Швидкий Старт

### Передумови

- Node.js 18+ і npm/yarn
- Steam API Key (отримай на https://steamcommunity.com/dev/apikey)
- Google Generative AI API Key (отримай на https://ai.google.dev)

### Встановлення

1. **Клонуй репозиторій:**

```bash
git clone https://github.com/yuriikulykki2022/TrophyHunter
cd TrophyHunter
```

2. **Встанови залежності:**

```bash
npm install
```

3. **Налаштуй Environment Variables:**
   Створи файл `.env.local`:

```env
STEAM_API_KEY=your_steam_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

Генерування NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

4. **Запусти development сервер:**

```bash
npm run dev
```

5. **Відкрий браузер:**

```
http://localhost:3000
```

## 📖 Використання

### 1. Авторизація

- Клікни "Увійти" на лендинг сторінці
- Авторизуйся через Steam
- Дозволь доступ до профілю

### 2. Перегляд Досягнень

**Особистий Прогрес:**

- Вибери гру зі своєї бібліотеки (ліве меню)
- Переглядай свої досягнення та прогрес

**Глобальна База:**

- Клікни "Мої" → перейди у режим пошуку
- Шукай будь-яку гру на Steam
- Переглядай досягнення з відсотками рідкості

### 3. Отримання Гайдів

- Натисни кнопку "Як?" на досягненні (доступна після розкриття спойлера)
- AI помічник згенерує детальний гайд з Google Search
- Чат зберігає історію розмови

### 4. Сортування

- **Найрідкісніші** - Досягнення, які мають найменше гравців
- **Найчастіші** - Досягнення, які мають більшість гравців
- **Спочатку закриті** (особистий) - Твої незроблені досягнення
- **Спочатку відкриті** (особистий) - Твої зроблені досягнення

## 🔌 API Endpoints

### Steam Endpoints

- `GET /api/steam` - Профіль гравця
- `GET /api/steam/games` - Список ігор гравця
- `GET /api/steam/achievements` - Досягнення гри (особистий)
- `GET /api/steam/achievements/global` - Досягнення гри (глобальні)
- `GET /api/steam/search` - Пошук ігор

### AI Endpoints

- `POST /api/ai/hint` - Генерування гайду AI з streaming відповіддю та Google Search

## 🏗 Структура Проєкту

```
app/
├── api/
│   ├── ai/hint/route.ts          # AI endpoint з Google Search
│   ├── auth/[...nextauth]/route.ts # NextAuth конфіг
│   └── steam/                     # Steam API endpoints
├── components/
│   ├── AchievementCard.tsx        # Карта досягнення
│   ├── AchievementGrid.tsx        # Сітка досягнень
│   ├── AIChatSidebar.tsx          # Chat з AI помічником
│   ├── GameSidebar.tsx            # Меню ігор (мобільне меню)
│   ├── SearchBar.tsx              # Пошук ігор
│   └── ...
├── hooks/
│   ├── useAchievements.ts         # Завантаження досягнень
│   ├── useSteamProfile.ts         # Профіль гравця
│   └── useGameSearch.ts           # Пошук ігор
├── lib/
│   └── auth.ts                    # NextAuth конфіг зі Steam
├── types/
│   └── steam.ts                   # TypeScript типи
├── config/
│   └── constants.ts               # Константи та конфіг
├── globals.css                    # Глобальні стилі та scrollbar
└── page.tsx                       # Головна сторінка
```

## ⚙️ Конфігурація

### Steam API

1. Перейди на https://steamcommunity.com/dev/apikey
2. Логінься через Steam
3. Прийми умови та отримай API ключ
4. Додай його в `.env.local` як `STEAM_API_KEY`

### Google Generative AI

1. Перейди на https://ai.google.dev
2. Клікни "Get API Key"
3. Виберіть або створи проєкт
4. Отримай API ключ
5. Додай його в `.env.local` як `GOOGLE_GENERATIVE_AI_API_KEY`

## 🌐 Розгортування на Vercel

### 1. Підготовка

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Vercel Setup

1. Перейди на https://vercel.com
2. Логінься через GitHub
3. Імпортуй репозиторій `trophy-ai`
4. Установи Framework: **Next.js**

### 3. Environment Variables

Добавь у Vercel Dashboard:

- `STEAM_API_KEY` - твій Steam API ключ
- `GOOGLE_GENERATIVE_AI_API_KEY` - твій Google Generative AI ключ
- `NEXTAUTH_SECRET` - генерується командою `openssl rand -base64 32`
- `NEXTAUTH_URL` - буде автоматично встановлено як `https://your-app.vercel.app`

### 4. Deploy

Vercel автоматично задеплойить при push в `main` гілку.

## 🔒 Безпека

- **API Keys** - Зберігаються у environment variables, НІКОЛИ не комітяться в код
- **NextAuth** - Безпечна Steam авторизація через OpenID Connect
- **HTTPS** - Обов'язково на продакшені
- **Rate Limiting** - Steam API має ліміт 5 запитів/хв на безкоштовному тарифі
- **Timeout** - 10 секунд на відповідь від AI з автоматичним обробленням помилок

## 📊 Ліміти та Обмеження

- **Steam API** - 5 запитів/хв на безкоштовному тарифі
- **Google Gemini Free** - Залежить від тарифу (free tier має добові ліміти)
- **AI Timeout** - 10 секунд на відповідь від AI
- **Кешування** - Результати не кешуються (можна оптимізувати в майбутньому)

## 🐛 Відомі Проблеми

- Деякі ігри можуть мати обмежені API методи Steam
- AI відповіді можуть бути неточними для дуже нових ігор
- На мобільних пристроях дуже мале viewport може виглядати некоректно

## 🚧 Плани Розвитку

- [ ] Кеширування результатів запитів для оптимізації
- [ ] Офлайн режим з localStorage
- [ ] Багатомовна підтримка (українська, англійська, російська)
- [ ] Browser Extension для Chrome/Firefox
- [ ] Експорт досягнень у PDF/CSV
- [ ] Соціальні функції (шеринг списків, рейтинги)
- [ ] Статистика та аналітика використання
- [ ] Локальні турніри досягнень між гравцями

## 📝 Ліцензія

MIT License - дивись [LICENSE](LICENSE) файл для деталей.

## 🤝 Внески

Приймаються pull requests! Для великих змін спочатку відкрий issue для обговорення.

1. Fork проєкту
2. Створи feature гілку (`git checkout -b feature/amazing-feature`)
3. Коміть змін (`git commit -m 'Add some amazing feature'`)
4. Push у гілку (`git push origin feature/amazing-feature`)
5. Відкрий Pull Request

## 💬 Контакти та Підтримка

- **Issues** - Повідомляй про баги через GitHub Issues
- **Discussions** - Обговорюй ідеї в GitHub Discussions

## 🙏 Подяки

- [Steam Web API](https://steamcommunity.com/dev/api) - За доступ до даних про ігри та досягнення
- [Google Generative AI](https://ai.google.dev) - За потужні AI можливості
- [Google Search API](https://developers.google.com/search) - За актуальну інформацію з мережі
- [Next.js](https://nextjs.org) - За чудовий фреймворк
- [Vercel](https://vercel.com) - За надійний хостинг
- [NextAuth.js](https://authjs.dev) - За безпечну авторизацію
- [Tailwind CSS](https://tailwindcss.com) - За красиві та швидкі стилі

---

**Зроблено з ❤️ для Steam гавців, які любять челленджі**

[⬆ Наверх](#-trophy-hunter)
