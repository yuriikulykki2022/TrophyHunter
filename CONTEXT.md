# TrophyHunter - Project Context

## Project Overview

**TrophyHunter** — веб-застосунок на базі Next.js 15 (App Router) та Tailwind CSS для розширеної візуалізації Steam ігрових досягнень з AI-підказками.

### Core Features

- 🔍 **Глобальний пошук ігор** через Steam Store API
- 🎮 **Особистий профіль** з бібліотекою ігор (Steam OAuth)
- 🏆 **Досягнення** з глобальною статистикою рідкісності
- 🎨 **Steam-style UI** з анімаціями для рідкісних досягнень (<10%)
- 🔒 **Anti-spoiler система** для прихованих досягнень
- 🤖 **AI Hints** (готово до інтеграції Vercel AI SDK + Gemini)

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Auth**: NextAuth.js v5 (Steam OpenID)
- **API**: Next.js Route Handlers, Steam Web API
- **Deployment**: Vercel-ready

---

## Current State

### ✅ Completed Features

#### 1. **Full TypeScript Refactoring**

- Створено `app/types/steam.ts` з повними інтерфейсами
- Видалено всі `any` типи
- Типізовано всі API routes з валідацією

**Types:**

```typescript
(-SteamProfile - Game - Achievement - SearchResult - ScreenType,
    ModeType,
    SortType);
```

#### 2. **Modular Architecture**

Розбито монолітний `page.tsx` (399 рядків → 150 рядків)

**Custom Hooks** (`app/hooks/`):

- `useSteamProfile(steamId?)` - профіль та бібліотека ігор
- `useGameSearch()` - пошук з 500ms debounce
- `useAchievements(game, mode, steamId?)` - досягнення + спойлери

**Components** (`app/components/`):

- `SearchBar.tsx` - пошуковий інтерфейс
- `GameSidebar.tsx` - бічна панель (тільки для авторизованих)
- `AchievementCard.tsx` - картка досягнення
- `AchievementGrid.tsx` - сітка з сортуванням
- `ErrorMessage.tsx` - toast для помилок
- `AIHintButton.tsx` - плейсхолдер для AI

**Configuration** (`app/config/`):

- `constants.ts` - всі константи (URLs, timings, thresholds)

#### 3. **Steam OAuth Integration**

Повна інтеграція через NextAuth.js v5:

**Auth Flow:**

```
User clicks "Увійти"
→ signIn("steam")
→ Steam OpenID login
→ callback with Steam ID
→ JWT token with steamId
→ Session with user.steamId
```

**Files:**

- `app/lib/auth.ts` - Custom Steam Provider
- `app/api/auth/[...nextauth]/route.ts` - NextAuth handlers
- `app/types/next-auth.d.ts` - Session type extensions

**API Routes** (приймають `steamId` через query params):

- `GET /api/steam?steamId=...` - профіль користувача
- `GET /api/steam/games?steamId=...` - бібліотека ігор
- `GET /api/steam/achievements?appid=...&steamId=...` - особисті досягнення
- `GET /api/steam/achievements/global?appid=...` - глобальні досягнення
- `GET /api/steam/search?q=...` - пошук ігор (не потребує auth)

#### 4. **Dual Mode Support**

**🔒 З авторизацією** (є Steam ID):

- Бічна панель з бібліотекою ігор
- Профіль користувача внизу
- Особисті досягнення (виконані/не виконані)
- Глобальні досягнення

**🌐 Без авторизації** (немає Steam ID):

- Чистий layout без sidebar
- Верхня панель: "← Назад" | "TrophyHunter" | "Увійти"
- Тільки глобальний пошук
- Тільки глобальні досягнення

#### 5. **UI/UX Enhancements**

- Миттєве сортування: rare/common/locked/unlocked
- Backdrop-blur для секретних досягнень
- Точна копія Steam анімації для рідкісних ачівок:
    ```css
    repeating-conic-gradient + animate-spin + z-index layering
    ```
- Адаптивний дизайн (mobile/tablet/desktop)
- Grayscale + opacity для не виконаних досягнень
- Tooltip з відсотками

---

## Key Logic

### Authentication Flow

```typescript
// app/page.tsx
const { data: session, status } = useSession();
const isAuthenticated = status === "authenticated";
const steamId = session?.user?.steamId;

// API calls автоматично використовують steamId
useSteamProfile(steamId);
useAchievements(selectedGame, mode, steamId);
```

### Achievement Data Merging

Backend "зшиває" 3 API запити:

**Personal Mode:**

```
1. GetPlayerAchievements → особистий прогрес (achieved: true/false)
2. GetSchemaForGame → словник (назви, описи, іконки)
3. GetGlobalAchievementPercentages → рідкісність (percent)

→ Merged Achievement Object
```

**Global Mode:**

```
1. GetSchemaForGame → словник
2. GetGlobalAchievementPercentages → рідкісність

→ Merged Achievement Object (achieved: false)
```

### Sorting Logic

```typescript
// app/components/AchievementGrid.tsx
const sortedAchievements = [...achievements].sort((a, b) => {
    const percentA = Number.parseFloat(String(a.percent)) || 0;
    const percentB = Number.parseFloat(String(b.percent)) || 0;

    if (sortBy === "rare") return percentA - percentB;
    if (sortBy === "common") return percentB - percentA;

    // Тільки для personal mode:
    if (sortBy === "locked") {
        if (a.achieved === b.achieved) return percentA - percentB;
        return a.achieved ? 1 : -1;
    }
    if (sortBy === "unlocked") {
        if (a.achieved === b.achieved) return percentA - percentB;
        return a.achieved ? -1 : 1;
    }

    return 0;
});
```

### Anti-Spoiler System

```typescript
// Спойлери показуються тільки для:
const needsSpoiler =
    mode === "global" ? achievement.hidden : isLocked && achievement.hidden;

// Set для відстеження відкритих спойлерів
const [revealedSpoilers, setRevealedSpoilers] = useState<Set<string>>(
    new Set(),
);

// Toggle через клік
const toggleSpoiler = (id: string) => {
    setRevealedSpoilers((prev) => {
        const newSet = new Set(prev);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        return newSet;
    });
};
```

### Rare Achievement Animation

```typescript
// Тільки для досягнень < 10%
const isRare = percentValue > 0 && percentValue < RARE_ACHIEVEMENT_THRESHOLD;

// Світяться:
// - В global mode: всі рідкісні
// - В personal mode: тільки виконані рідкісні
const shouldGlow =
    (mode === "global" && isRare) ||
    (mode === "personal" && achievement.achieved && isRare);
```

---

## Next Steps

### 🔥 Priority 1: AI Integration (Killer Feature)

**Goal:** Streaming AI hints для секретних досягнень

**Tasks:**

1. [ ] Встановити Vercel AI SDK

    ```bash
    npm install ai @ai-sdk/google
    ```

2. [ ] Додати `GOOGLE_GENERATIVE_AI_API_KEY` до `.env.local`

3. [ ] Реалізувати streaming endpoint:

    ```typescript
    // app/api/ai/hint/route.ts
    import { google } from "@ai-sdk/google";
    import { streamText } from "ai";

    export async function POST(req: Request) {
        const { achievementName } = await req.json();

        const result = streamText({
            model: google("gemini-1.5-flash"),
            prompt: `Дай безспойлерну підказку для досягнення: ${achievementName}`,
        });

        return result.toDataStreamResponse();
    }
    ```

4. [ ] Інтегрувати `AIHintButton` в `AchievementCard`:

    ```typescript
    {needsSpoiler && !isRevealed && (
      <AIHintButton
        achievementName={achievement.name}
        achievementDescription={achievement.description}
      />
    )}
    ```

5. [ ] Використати `useCompletion()` hook з `ai/react`

**References:**

- Placeholder вже створений: `app/api/ai/hint/route.ts`
- Компонент готовий: `app/components/AIHintButton.tsx`

### ⚡ Priority 2: Performance Optimization

**Tasks:**

1. [ ] Додати React Query для кешування:

    ```bash
    npm install @tanstack/react-query
    ```

2. [ ] Обгорнути app у `QueryClientProvider`

3. [ ] Конвертувати hooks на `useQuery`:

    ```typescript
    // hooks/useAchievements.ts
    return useQuery({
      queryKey: ['achievements', selectedGame?.appid, mode, steamId],
      queryFn: () => fetchAchievements(...),
      staleTime: 5 * 60 * 1000
    });
    ```

4. [ ] Додати skeleton loaders замість спінерів

### 🎨 Priority 3: UX Improvements

**Tasks:**

1. [ ] Додати toasts (sonner) замість ErrorMessage
2. [ ] Infinite scroll для великих списків ігор
3. [ ] Адаптивний burger menu для мобільних
4. [ ] PWA support (next-pwa)
5. [ ] Кнопка "Вийти" в sidebar для авторизованих

### 🔒 Priority 4: Security & Validation

**Tasks:**

1. [ ] Rate limiting для API routes (@upstash/ratelimit)
2. [ ] Валідація з Zod для всіх API inputs
3. [ ] CSRF protection (вбудовано в NextAuth)

### 📊 Priority 5: Analytics

**Tasks:**

1. [ ] Vercel Analytics

    ```bash
    npm install @vercel/analytics
    ```

2. [ ] Track events:
    - Achievement viewed
    - Spoiler revealed
    - AI hint generated

---

## Environment Variables

### Required (Development)

```env
NEXTAUTH_SECRET=your_random_32+_char_string
NEXTAUTH_URL=http://localhost:3000
STEAM_API_KEY=your_steam_api_key
```

### Required (Production)

```env
NEXTAUTH_SECRET=production_secret
NEXTAUTH_URL=https://your-domain.vercel.app
STEAM_API_KEY=your_steam_api_key
```

### Future (AI Integration)

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
```

---

## File Structure

```
trophy-ai/
├── app/
│   ├── types/
│   │   ├── steam.ts              # TypeScript interfaces
│   │   └── next-auth.d.ts        # NextAuth type extensions
│   ├── hooks/
│   │   ├── useSteamProfile.ts    # Profile & games with steamId
│   │   ├── useGameSearch.ts      # Search with debounce
│   │   └── useAchievements.ts    # Achievements with steamId
│   ├── components/
│   │   ├── SearchBar.tsx         # Search input + dropdown
│   │   ├── GameSidebar.tsx       # Library sidebar (auth only)
│   │   ├── AchievementCard.tsx   # Single achievement card
│   │   ├── AchievementGrid.tsx   # Grid with sorting
│   │   ├── ErrorMessage.tsx      # Error toast
│   │   └── AIHintButton.tsx      # AI hint placeholder
│   ├── config/
│   │   └── constants.ts          # All constants
│   ├── lib/
│   │   └── auth.ts               # NextAuth config + Steam Provider
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts      # NextAuth handlers
│   │   ├── steam/
│   │   │   ├── route.ts          # GET profile by steamId
│   │   │   ├── games/route.ts    # GET games by steamId
│   │   │   ├── search/route.ts   # GET search (no auth)
│   │   │   └── achievements/
│   │   │       ├── route.ts      # GET personal (needs steamId)
│   │   │       └── global/route.ts # GET global (no auth)
│   │   └── ai/
│   │       └── hint/route.ts     # POST AI hint (placeholder)
│   ├── layout.tsx                # SessionProvider wrapper
│   ├── page.tsx                  # Main app (150 lines)
│   └── globals.css
├── .env.local                    # Environment variables
├── .env.example                  # Env template
├── REFACTORING.md               # Refactoring summary
├── AUTH_CHANGES.md              # Auth removal summary
├── STEAM_AUTH_SETUP.md          # OAuth setup guide
├── NEXT_STEPS.md                # Future recommendations
└── package.json
```

---

## Key Dependencies

```json
{
    "dependencies": {
        "next": "16.1.6",
        "react": "19.2.3",
        "react-dom": "19.2.3",
        "next-auth": "^5.0.0-beta"
    },
    "devDependencies": {
        "@tailwindcss/postcss": "^4",
        "typescript": "^5"
    }
}
```

---

## Steam API Endpoints Used

1. **GetPlayerSummaries** - профіль користувача
2. **GetOwnedGames** - бібліотека ігор
3. **GetSchemaForGame** - словник досягнень
4. **GetPlayerAchievements** - особистий прогрес
5. **GetGlobalAchievementPercentages** - глобальна статистика
6. **Store Search API** - пошук ігор (без ключа)

---

## Testing Checklist

### ✅ Manual Tests Passed

- [x] Landing page loads
- [x] Search works without auth
- [x] "Увійти" redirects to Steam OpenID
- [x] After login: sidebar appears
- [x] Profile shows in sidebar
- [x] Games library loads
- [x] Personal achievements load
- [x] Global achievements load
- [x] Sorting works (all 4 modes)
- [x] Spoiler toggle works
- [x] Rare achievement animation displays
- [x] Logout works

### 🔄 To Test (After AI Integration)

- [ ] AI hint generates without spoilers
- [ ] Streaming works in UI
- [ ] Error handling for failed AI requests

---

## Deployment Notes

### Vercel Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables:
    - `NEXTAUTH_SECRET`
    - `NEXTAUTH_URL`
    - `STEAM_API_KEY`
4. Deploy

### Post-Deploy Verification

- [ ] OAuth works on production URL
- [ ] Steam callbacks work
- [ ] Session persists
- [ ] API routes respond correctly

---

## Known Limitations

1. **Steam API Rate Limits**: 100,000 calls/day
2. **Private Profiles**: Деякі профілі Steam приховані
3. **Game Stats**: Не всі ігри мають achievements API
4. **OpenID Limitation**: Не отримуємо email/username, тільки Steam ID

---

## Documentation Files

- `README.md` - Project overview
- `REFACTORING.md` - Detailed refactoring changes
- `AUTH_CHANGES.md` - Auth system changes
- `STEAM_AUTH_SETUP.md` - OAuth setup instructions
- `NEXT_STEPS.md` - Future development roadmap

---

**Last Updated:** 2026-03-19  
**Status:** ✅ Ready for AI Integration  
**Next Milestone:** Vercel AI SDK + Gemini Integration
