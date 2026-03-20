# 🎯 Рекомендації для подальшого розвитку TrophyHunter

## 🔥 Пріоритет 1: AI Integration (Killer Feature)

### Встановлення залежностей

```bash
npm install ai @ai-sdk/google
```

### Налаштування `.env.local`

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
STEAM_API_KEY=your_steam_key
STEAM_USER_ID=your_steam_id
```

### Приклад streaming AI route (`app/api/ai/hint/route.ts`)

```typescript
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
    const { achievementName } = await req.json();

    const result = streamText({
        model: google("gemini-1.5-flash"),
        prompt: `Дай безспойлерну підказку для досягнення: ${achievementName}. 
    Підказка має бути загадковою, без прямих спойлерів, але корисною.`,
    });

    return result.toDataStreamResponse();
}
```

### Використання в компоненті

```typescript
import { useCompletion } from "ai/react";

const { complete, completion, isLoading } = useCompletion({
    api: "/api/ai/hint",
});
```

## ⚡ Пріоритет 2: Перформанс

### 1. Додати React Query для кешування

```bash
npm install @tanstack/react-query
```

### 2. Обгорнути app у QueryClientProvider

```typescript
// app/layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### 3. Використати в hooks

```typescript
// hooks/useAchievements.ts
import { useQuery } from "@tanstack/react-query";

export function useAchievements(selectedGame: Game | null, mode: ModeType) {
    return useQuery({
        queryKey: ["achievements", selectedGame?.appid, mode],
        queryFn: () => fetchAchievements(selectedGame!.appid, mode),
        enabled: !!selectedGame,
        staleTime: 5 * 60 * 1000, // 5 хвилин кеш
    });
}
```

## 🎨 Пріоритет 3: UX покращення

### 1. Skeleton loaders замість спінерів

```typescript
// components/AchievementSkeleton.tsx
export default function AchievementSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-16 w-16 bg-slate-700 rounded"></div>
      <div className="h-4 bg-slate-700 rounded w-3/4 mt-2"></div>
    </div>
  );
}
```

### 2. Toasts замість статичних ErrorMessage

```bash
npm install sonner
```

```typescript
import { Toaster, toast } from 'sonner';

// В layout.tsx
<Toaster position="top-right" />

// У hooks
toast.error('Не вдалося завантажити дані');
toast.success('Досягнення завантажено!');
```

### 3. Infinite scroll для великих списків ігор

```typescript
// hooks/useInfiniteGames.ts
import { useInfiniteQuery } from "@tanstack/react-query";
```

## 🔒 Пріоритет 4: Безпека

### 1. Rate limiting для API

```bash
npm install @upstash/ratelimit @upstash/redis
```

### 2. Валідація з Zod

```bash
npm install zod
```

```typescript
import { z } from "zod";

const searchSchema = z.object({
    q: z.string().min(2).max(100),
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const validation = searchSchema.safeParse({
        q: searchParams.get("q"),
    });

    if (!validation.success) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
    }
}
```

## 📱 Пріоритет 5: Mobile optimization

### 1. Адаптивний sidebar

```typescript
// Додати burger menu для мобільних
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
```

### 2. PWA support

```bash
npm install next-pwa
```

## 🧪 Пріоритет 6: Testing

### 1. Встановити Vitest

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 2. Приклад тесту

```typescript
// __tests__/AchievementCard.test.tsx
import { render, screen } from '@testing-library/react';
import AchievementCard from '@/components/AchievementCard';

describe('AchievementCard', () => {
  it('shows spoiler overlay for hidden achievements', () => {
    render(<AchievementCard achievement={...} isRevealed={false} />);
    expect(screen.getByText(/відкрити секрет/i)).toBeInTheDocument();
  });
});
```

## 📊 Пріоритет 7: Analytics

### Додати Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
```

## 🎬 Bonus features

1. **Порівняння з друзями** - Steam friends achievements comparison
2. **Статистика** - графіки прогресу за період
3. **Нотифікації** - сповіщення про нові досягнення
4. **Теми** - dark/light mode
5. **Експорт** - зберігання прогресу у PDF/PNG

---

**Готово до production!** 🚀
