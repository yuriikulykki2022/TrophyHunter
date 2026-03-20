# 🎮 Steam OAuth - Інструкція з налаштування

## ✅ Що вже зроблено

1. ✅ Встановлено `next-auth@beta`
2. ✅ Створено Steam Provider для NextAuth
3. ✅ Налаштовано API routes `/api/auth/[...nextauth]/`
4. ✅ Додано SessionProvider до layout
5. ✅ Оновлено hooks для роботи з steamId
6. ✅ Інтегровано `signIn()` та `signOut()`

## 🔧 Що потрібно налаштувати

### 1. Environment Variables

Відкрий файл `.env.local` та додай:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# Steam API Key (має бути вже)
STEAM_API_KEY=your_steam_api_key

# STEAM_USER_ID більше не потрібен - можна видалити
```

### 2. Згенеруй NEXTAUTH_SECRET

**Windows (PowerShell):**

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Або використай будь-який рандомний рядок (мінімум 32 символи)**

## 🧪 Як протестувати

### Тест 1: Запуск dev server

```bash
npm run dev
```

Перевір консоль - не має бути помилок про NextAuth.

### Тест 2: Кнопка "Увійти"

1. Відкрий `http://localhost:3000`
2. Натисни "Увійти" (зверху справа)
3. Має відкритись сторінка Steam OpenID
4. Після авторизації - повернення на головну

### Тест 3: Перевірка сесії

Після авторизації:

- ✅ Має з'явитись бічна панель з бібліотекою ігор
- ✅ Знизу має показатись твій Steam профіль
- ✅ Можна вибирати ігри та дивитись особисті досягнення

## 🐛 Можливі проблеми

### Помилка: "Cannot find module 'next-auth/react'"

Переконайся що встановлено `next-auth@beta`:

```bash
npm list next-auth
```

Має бути версія 5.x.x

### Помилка: "NEXTAUTH_SECRET is not set"

Додай `NEXTAUTH_SECRET` до `.env.local`

### Помилка після Steam redirect

Перевір що `NEXTAUTH_URL=http://localhost:3000` (без слешу в кінці)

### Steam не авторизує

Steam OpenID працює тільки з:

- `http://localhost:3000`
- `https://your-domain.com`

НЕ працює з `127.0.0.1` або IP адресами.

## 🚀 Production Deploy

Для Vercel:

1. Додай environment variables:

    ```
    NEXTAUTH_SECRET=...
    NEXTAUTH_URL=https://your-domain.vercel.app
    STEAM_API_KEY=...
    ```

2. Deploy:

    ```bash
    vercel --prod
    ```

3. Steam автоматично працюватиме з HTTPS domains

## 📝 Примітка

Steam OpenID не вимагає реєстрації додатку або callback URL в Steam.
Просто працює "out of the box" з будь-яким доменом.

---

**Готово до тестування!** 🎉

Якщо все працює - побачиш свій Steam профіль після авторизації.
