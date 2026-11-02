// frontend/src/components/i18n.ts
// Complete internationalization dictionary (Uzbek, English, Russian)

export type Language = 'uz' | 'en' | 'ru';

export interface Translations {
  // Brand & Header
  brandTitle: string;
  brandSubtitle: string;
  telemetryOnline: string;
  guideBtn: string;
  themesBtn: string;
  sandboxBtn: string;
  exportBtn: string;
  muteFx: string;
  unmuteFx: string;

  // Stats Cards
  statsTotalScans: string;
  statsTotalBugs: string;
  statsAiHealed: string;
  statsSuccessRate: string;
  statsLiveActive: string;
  statsAllHealed: string;

  // Scanner Form
  scanTargetLabel: string;
  scanTargetPlaceholder: string;
  scanRepoLabel: string;
  scanRepoPlaceholder: string;
  scanModeLabel: string;
  scanModeChaos: string;
  scanModeLight: string;
  scanModeDeep: string;
  scanBtnStart: string;
  scanBtnScanning: string;
  scanBtnResetSandbox: string;
  scanBtnQuickSandbox: string;

  // Terminal Logs
  terminalTitle: string;
  terminalLiveFeed: string;
  terminalClear: string;
  terminalFilterAll: string;
  terminalFilterErrors: string;
  terminalFilterHeals: string;
  terminalWaiting: string;

  // Incidents Section
  incidentsTitle: string;
  incidentsSubtitle: string;
  incidentsCount: string;
  filterAll: string;
  filterCritical: string;
  filterHigh: string;
  filterMedium: string;
  filterLow: string;
  searchPlaceholder: string;
  noIncidentsFound: string;

  // Incident Card
  severityCritical: string;
  severityHigh: string;
  severityMedium: string;
  severityLow: string;
  statusDiscovered: string;
  statusHealing: string;
  statusPatched: string;
  statusPrCreated: string;
  rootCauseTitle: string;
  targetFileTitle: string;
  viewDiffBtn: string;
  hideDiffBtn: string;
  viewScreenshotBtn: string;
  applyPatchBtn: string;
  applyingPatch: string;
  patchedSuccess: string;
  createPrBtn: string;
  creatingPr: string;
  prCreatedSuccess: string;
  stackTraceTitle: string;

  // Onboarding Modal
  guideModalTitle: string;
  guideModalSubtitle: string;
  guideStep1Title: string;
  guideStep1Desc: string;
  guideStep2Title: string;
  guideStep2Desc: string;
  guideStep3Title: string;
  guideStep3Desc: string;
  guideStep4Title: string;
  guideStep4Desc: string;
  guideStep5Title: string;
  guideStep5Desc: string;
  guideStep6Title: string;
  guideStep6Desc: string;
  guideNextBtn: string;
  guidePrevBtn: string;
  guideFinishBtn: string;
  guideTryDemoBtn: string;

  // Theme Customizer
  themeModalTitle: string;
  themeModalSubtitle: string;
  themesSectionTitle: string;
  bgEffectsSectionTitle: string;
  themeCyberpunk: string;
  themeMatrix: string;
  themeSynthwave: string;
  themeMidnight: string;
  themeBloodMoon: string;
  themeNordic: string;
  themeSolar: string;
  bgEffectMatrixRain: string;
  bgEffectCyberGrid: string;
  bgEffectParticles: string;
  bgEffectScanline: string;
  bgEffectMinimal: string;
  closeBtn: string;
}

export const translations: Record<Language, Translations> = {
  uz: {
    // Brand & Header
    brandTitle: "GHOST QA SENTINEL",
    brandSubtitle: "AVTONOM CHAOS CRAWLER VA AI O'ZINI-O'ZI TUZATUVCHI",
    telemetryOnline: "TIZIM FAOL",
    guideBtn: "Qo'llanma",
    themesBtn: "Dizayn & Fon",
    sandboxBtn: "Sandbox Testbench",
    exportBtn: "Hisobotni Yuklash",
    muteFx: "Tovushni o'chirish",
    unmuteFx: "Tovushni yoqish",

    // Stats Cards
    statsTotalScans: "Jami Chaos Skanlar",
    statsTotalBugs: "Aniqlangan Defektlar",
    statsAiHealed: "AI Tuzatgan Xatolar",
    statsSuccessRate: "O'zini-O'zi Tuzatish",
    statsLiveActive: "Real vaqtda faol",
    statsAllHealed: "100% avtomatik tuzatildi",

    // Scanner Form
    scanTargetLabel: "Nishon Veb-sayt URL",
    scanTargetPlaceholder: "http://localhost:8000/sandbox yoki https://example.com",
    scanRepoLabel: "GitHub Repozitoriyasi",
    scanRepoPlaceholder: "username/repository",
    scanModeLabel: "Skanerlash Rejimi",
    scanModeChaos: "Chaos Monkey (Chuqur bosish & hodisalar)",
    scanModeLight: "Tezkor audit (Console & Network)",
    scanModeDeep: "To'liq AI stress-test",
    scanBtnStart: "Chaos Skanni Boshlash",
    scanBtnScanning: "Agent Tekshirmoqda...",
    scanBtnResetSandbox: "Sandboxni Tiklash",
    scanBtnQuickSandbox: "CyberMart Demo",

    // Terminal Logs
    terminalTitle: "Avtonom Agent Telemetriyasi",
    terminalLiveFeed: "Jonli Konsol Oqimi",
    terminalClear: "Tozalash",
    terminalFilterAll: "Barchasi",
    terminalFilterErrors: "Xatolar",
    terminalFilterHeals: "AI Tuzatishlar",
    terminalWaiting: "Avtonom agent buyruq kutmoqda. Skan boshlanganda jonli telemetriya bu yerda aks etadi...",

    // Incidents Section
    incidentsTitle: "Aniqlangan Defektlar va AI Patchlar",
    incidentsSubtitle: "Playwright tomonidan ushlab olingan va Google Gemini tomonidan tuzatilgan barcha xatoliklar",
    incidentsCount: "ta hodisa",
    filterAll: "Barchasi",
    filterCritical: "Kritik",
    filterHigh: "Yuqori",
    filterMedium: "O'rta",
    filterLow: "Past",
    searchPlaceholder: "Xato, selektor yoki fayl bo'yicha qidirish...",
    noIncidentsFound: "Hech qanday xatolik topilmadi. Tizim mukammal holatda!",

    // Incident Card
    severityCritical: "KRITIK",
    severityHigh: "YUQORI",
    severityMedium: "O'RTA",
    severityLow: "PAST",
    statusDiscovered: "ANIQLANDI",
    statusHealing: "AI TUZATMOQDA",
    statusPatched: "LOKAL TUZATILDI",
    statusPrCreated: "PR YARATILDI",
    rootCauseTitle: "Ildiz Sababi Tahlili (AI Diagnostics)",
    targetFileTitle: "Nishon Fayl",
    viewDiffBtn: "Kodni Ko'rish (Diff)",
    hideDiffBtn: "Diffni Yashirish",
    viewScreenshotBtn: "Skrinshotni Ko'rish",
    applyPatchBtn: "Lokal Kodga Qo'llash",
    applyingPatch: "Qo'llanmoqda...",
    patchedSuccess: "Muvaffaqiyatli Tuzatildi!",
    createPrBtn: "GitHub PR Ochish",
    creatingPr: "PR Yaratilmoqda...",
    prCreatedSuccess: "PR Ochildi!",
    stackTraceTitle: "Konsol Xatosi va Stack Trace",

    // Onboarding Modal
    guideModalTitle: "Ghost-QA Sentinel Qanday Ishlaydi?",
    guideModalSubtitle: "Avtonom sifat nazorati va sun'iy intellekt orqali o'zini-o'zi tuzatuvchi tizim bilan tanishing",
    guideStep1Title: "1. Muammo va Ghost-QA nima?",
    guideStep1Desc: "Veb-saytlar va murakkab ilovalarda ko'pincha yashirin JavaScript xatolari (TypeError), 500 tarmoq uzilishlari yoki ko'rinmas CSS z-index to'siqlari tufayli foydalanuvchilar xarid qila olmaydi. Ghost-QA Sentinel — bu inson aralashuvisiz saytingizni mustaqil tekshirib, xatolarni o'zi topuvchi va tuzatuvchi robot!",
    guideStep2Title: "2. Chaos Monkey Crawler",
    guideStep2Desc: "Tizim headless Chromium brauzerida saytingizga kiradi. Haqiqiy foydalanuvchi kabi barcha tugmalarni bosadi, vaucherlarni tekshiradi va tarmoq so'rovlarini tahlil qiladi. Xatolik yuz berishi bilanoq, uning skrinshotini va DOM kontekstini oladi.",
    guideStep3Title: "3. Google Gemini AI Diagnostics",
    guideStep3Desc: "Topilgan xatolik zudlik bilan Google Gemini 3.8 Flash modeliga uzatiladi. AI xatolikning ildiz sababini tahlil qiladi va xatolikni bartaraf etuvchi toza, xavfsiz kod patchini (Unified Diff) yaratadi.",
    guideStep4Title: "4. Bir Bosishda Kodni Tuzatish",
    guideStep4Desc: "Har bir xatolik kartasida 'Lokal Kodga Qo'llash' tugmasi bor. Uni bossangiz, fayldagi xato darhol tuzatiladi. Shuningdek, 'GitHub PR Ochish' tugmasi orqali jamoangiz uchun to'liq GitHub Pull Request yaratib beradi!",
    guideStep5Title: "5. Telegram Bot Integratsiyasi",
    guideStep5Desc: "@ghost_qa_sentinel_bot Telegram boti orqali muhandislarga har bir kritik xatolik, skrinshot va AI diff xabari real vaqtda yetkaziladi. Bot orqali to'g'ridan-to'g'ri skan boshlash va sandboxni qayta yuklash mumkin.",
    guideStep6Title: "6. Hoziroq Sinab Ko'ring!",
    guideStep6Desc: "Tizim ichida maxsus CyberMart nomli sun'iy 4 ta defektga ega sandbox tayyorlangan. 'CyberMart Demo' tugmasini bosing yoki o'z saytingiz manzilini kiriting va AI Sentinel ning qudratini his qiling!",
    guideNextBtn: "Keyingisi",
    guidePrevBtn: "Oldingisi",
    guideFinishBtn: "Tushundim, Boshlash!",
    guideTryDemoBtn: "Demo Sandboxni Skan Qilish",

    // Theme Customizer
    themeModalTitle: "Dizayn va Fon Sozlamalari",
    themeModalSubtitle: "O'zingizga yoqqan cyberpunk uslubi va orqa fon animatsiyasini tanlang",
    themesSectionTitle: "Rang Mavzulari",
    bgEffectsSectionTitle: "Orqa Fon Animatsiyalari",
    themeCyberpunk: "Cyberpunk Obsidian",
    themeMatrix: "Matrix Hacker Green",
    themeSynthwave: "Synthwave 80s Sunset",
    themeMidnight: "Midnight Deep Ocean",
    themeBloodMoon: "Blood Moon Security",
    themeNordic: "Stealth Nordic Slate",
    themeSolar: "Solar Flare Gold",
    bgEffectMatrixRain: "Matrix Yashil Kod Yomg'iri",
    bgEffectCyberGrid: "Harakatlanuvchi 3D Cyber To'r",
    bgEffectParticles: "Suzuvchi Neon Nurlar",
    bgEffectScanline: "CRT Retro Monitor Scanlines",
    bgEffectMinimal: "Toza Minimalist Fon",
    closeBtn: "Yopish"
  },

  en: {
    // Brand & Header
    brandTitle: "GHOST QA SENTINEL",
    brandSubtitle: "AUTONOMOUS CHAOS CRAWLER & AI SELF-HEALER",
    telemetryOnline: "SYSTEM ONLINE",
    guideBtn: "How It Works",
    themesBtn: "Themes & FX",
    sandboxBtn: "Sandbox Testbench",
    exportBtn: "Export Report",
    muteFx: "Mute Audio FX",
    unmuteFx: "Unmute Audio FX",

    // Stats Cards
    statsTotalScans: "Total Chaos Scans",
    statsTotalBugs: "Defects Discovered",
    statsAiHealed: "AI Self-Healed",
    statsSuccessRate: "Self-Healing Rate",
    statsLiveActive: "Real-time active",
    statsAllHealed: "100% autonomous patches",

    // Scanner Form
    scanTargetLabel: "Target Application URL",
    scanTargetPlaceholder: "http://localhost:8000/sandbox or https://example.com",
    scanRepoLabel: "GitHub Repository",
    scanRepoPlaceholder: "username/repository",
    scanModeLabel: "Scan Mode",
    scanModeChaos: "Chaos Monkey (Click chaos & pointer events)",
    scanModeLight: "Quick Audit (Console & Network check)",
    scanModeDeep: "Full AI Stress & Form Fuzzing",
    scanBtnStart: "Launch Chaos Scan",
    scanBtnScanning: "Agent Scanning...",
    scanBtnResetSandbox: "Reset Sandbox",
    scanBtnQuickSandbox: "CyberMart Demo",

    // Terminal Logs
    terminalTitle: "Autonomous Agent Telemetry",
    terminalLiveFeed: "Live Console Stream",
    terminalClear: "Clear",
    terminalFilterAll: "All Logs",
    terminalFilterErrors: "Errors Only",
    terminalFilterHeals: "AI Heals",
    terminalWaiting: "Sentinel agent waiting for target. Live telemetry will stream here upon launch...",

    // Incidents Section
    incidentsTitle: "Discovered Defects & AI Patches",
    incidentsSubtitle: "Runtime errors captured via Playwright and auto-repaired with Google Gemini",
    incidentsCount: "incidents",
    filterAll: "All",
    filterCritical: "Critical",
    filterHigh: "High",
    filterMedium: "Medium",
    filterLow: "Low",
    searchPlaceholder: "Filter by error, selector or target file...",
    noIncidentsFound: "No defects found. Application is in pristine condition!",

    // Incident Card
    severityCritical: "CRITICAL",
    severityHigh: "HIGH",
    severityMedium: "MEDIUM",
    severityLow: "LOW",
    statusDiscovered: "DISCOVERED",
    statusHealing: "AI HEALING",
    statusPatched: "PATCHED LOCALLY",
    statusPrCreated: "PR CREATED",
    rootCauseTitle: "Root Cause Diagnostics (Google Gemini AI)",
    targetFileTitle: "Target File",
    viewDiffBtn: "Inspect Unified Diff",
    hideDiffBtn: "Hide Code Diff",
    viewScreenshotBtn: "View Captured Evidence",
    applyPatchBtn: "Apply Local Patch",
    applyingPatch: "Patching...",
    patchedSuccess: "Successfully Patched!",
    createPrBtn: "Create GitHub PR",
    creatingPr: "Opening PR...",
    prCreatedSuccess: "PR Created!",
    stackTraceTitle: "Console Exception & Stack Trace",

    // Onboarding Modal
    guideModalTitle: "How Ghost-QA Sentinel Works",
    guideModalSubtitle: "Autonomous quality engineering and self-healing resilience pipeline overview",
    guideStep1Title: "1. The Problem & Ghost-QA Solution",
    guideStep1Desc: "Modern web applications suffer from silent JavaScript runtime errors, 500 backend timeouts, and invisible CSS obstructions that prevent users from checking out. Ghost-QA Sentinel is an autonomous QA engineer robot that proactively explores, detects, and fixes bugs without human supervision.",
    guideStep2Title: "2. Chaos Monkey Crawler",
    guideStep2Desc: "Our Playwright Headless Chromium engine navigates your web application, rigorously clicking interaction targets, validating checkout paths, and tracking hidden overlay obstacles. High-resolution screenshots and DOM state are snapshotted instantly.",
    guideStep3Title: "3. Google Gemini AI Diagnostics",
    guideStep3Desc: "Every captured stack trace and DOM element is routed to Google Gemini 3.8 Flash. The neural model deduces the root cause and synthesizes clean, resilient production code changes in unified diff format.",
    guideStep4Title: "4. 1-Click Patch & GitHub PR",
    guideStep4Desc: "Click 'Apply Local Patch' to immediately hot-fix the source code in your local repository. Or click 'Create GitHub PR' to spin up a Git branch and open an automated Pull Request for your engineering team.",
    guideStep5Title: "5. Telegram Bot Alerts",
    guideStep5Desc: "@ghost_qa_sentinel_bot sends instant alerts with error diagnostics, screenshots, and AI patch summaries to your mobile device, allowing on-the-go monitoring and remote sandbox triggers.",
    guideStep6Title: "6. Test the Interactive Sandbox",
    guideStep6Desc: "A built-in CyberMart store with 4 simulated real-world bugs is pre-mounted at /sandbox. Click 'CyberMart Demo' or launch a scan to see the self-healing workflow in action!",
    guideNextBtn: "Next Step",
    guidePrevBtn: "Previous",
    guideFinishBtn: "Got It, Let's Start!",
    guideTryDemoBtn: "Scan Demo Sandbox Now",

    // Theme Customizer
    themeModalTitle: "Theme & Visual Customizer",
    themeModalSubtitle: "Personalize your cyberpunk command center styling and live background fx",
    themesSectionTitle: "Color Palettes",
    bgEffectsSectionTitle: "Live Background Animations",
    themeCyberpunk: "Cyberpunk Obsidian",
    themeMatrix: "Matrix Hacker Green",
    themeSynthwave: "Synthwave 80s Sunset",
    themeMidnight: "Midnight Deep Ocean",
    themeBloodMoon: "Blood Moon Security",
    themeNordic: "Stealth Nordic Slate",
    themeSolar: "Solar Flare Gold",
    bgEffectMatrixRain: "Matrix Digital Rain",
    bgEffectCyberGrid: "Animated 3D Cyber Grid",
    bgEffectParticles: "Floating Ambient Particles",
    bgEffectScanline: "CRT Retro Terminal Scanlines",
    bgEffectMinimal: "Clean Minimalist Dark",
    closeBtn: "Close"
  },

  ru: {
    // Brand & Header
    brandTitle: "GHOST QA SENTINEL",
    brandSubtitle: "АВТОНОМНЫЙ ХАОС-КРАУЛЕР И AI САМОИСЦЕЛЕНИЕ КОДА",
    telemetryOnline: "СИСТЕМА АКТИВНА",
    guideBtn: "Инструкция",
    themesBtn: "Темы и Фон",
    sandboxBtn: "Тестовая Песочница",
    exportBtn: "Скачать Отчёт",
    muteFx: "Выключить звук",
    unmuteFx: "Включить звук",

    // Stats Cards
    statsTotalScans: "Всего Хаос-Сканов",
    statsTotalBugs: "Найдено Дефектов",
    statsAiHealed: "Исправлено ИИ",
    statsSuccessRate: "Эффективность ИИ",
    statsLiveActive: "Активно в реальном времени",
    statsAllHealed: "100% авто-исправлений",

    // Scanner Form
    scanTargetLabel: "URL Целевого Приложения",
    scanTargetPlaceholder: "http://localhost:8000/sandbox или https://example.com",
    scanRepoLabel: "GitHub Репозиторий",
    scanRepoPlaceholder: "username/repository",
    scanModeLabel: "Режим Сканирования",
    scanModeChaos: "Chaos Monkey (Имитация кликов и событий)",
    scanModeLight: "Быстрый аудит (Console & Network)",
    scanModeDeep: "Глубокий стресс-тест с ИИ",
    scanBtnStart: "Запустить Хаос-Скан",
    scanBtnScanning: "Агент сканирует...",
    scanBtnResetSandbox: "Сбросить Песочницу",
    scanBtnQuickSandbox: "Демо CyberMart",

    // Terminal Logs
    terminalTitle: "Телеметрия Автономного Агента",
    terminalLiveFeed: "Живой Поток Консоли",
    terminalClear: "Очистить",
    terminalFilterAll: "Все логи",
    terminalFilterErrors: "Только ошибки",
    terminalFilterHeals: "Патчи ИИ",
    terminalWaiting: "Агент ожидает команды. Телеметрия в реальном времени появится здесь после запуска...",

    // Incidents Section
    incidentsTitle: "Обнаруженные Дефекты и Патчи ИИ",
    incidentsSubtitle: "Ошибки выполнения, пойманные Playwright и исправленные через Google Gemini",
    incidentsCount: "инцидентов",
    filterAll: "Все",
    filterCritical: "Критические",
    filterHigh: "Высокие",
    filterMedium: "Средние",
    filterLow: "Низкие",
    searchPlaceholder: "Поиск по ошибке, селектору или файлу...",
    noIncidentsFound: "Дефектов не обнаружено. Система работает безупречно!",

    // Incident Card
    severityCritical: "КРИТИЧЕСКИЙ",
    severityHigh: "ВЫСОКИЙ",
    severityMedium: "СРЕДНИЙ",
    severityLow: "НИЗКИЙ",
    statusDiscovered: "ОБНАРУЖЕНО",
    statusHealing: "ИИ ИСПРАВЛЯЕТ",
    statusPatched: "ИСПРАВЛЕНО ЛОКАЛЬНО",
    statusPrCreated: "PR СОЗДАН",
    rootCauseTitle: "Анализ Первопричины (Google Gemini AI)",
    targetFileTitle: "Целевой Файл",
    viewDiffBtn: "Посмотреть Diff Кода",
    hideDiffBtn: "Скрыть Diff",
    viewScreenshotBtn: "Смотреть Скриншот",
    applyPatchBtn: "Применить Патч Локально",
    applyingPatch: "Применение...",
    patchedSuccess: "Успешно Исправлено!",
    createPrBtn: "Создать GitHub PR",
    creatingPr: "Создание PR...",
    prCreatedSuccess: "PR Создан!",
    stackTraceTitle: "Ошибка Консоли и Стек Вызовов",

    // Onboarding Modal
    guideModalTitle: "Как работает Ghost-QA Sentinel?",
    guideModalSubtitle: "Автономное обеспечение качества и самовосстанавливающийся конвейер кода",
    guideStep1Title: "1. Проблема и решение Ghost-QA",
    guideStep1Desc: "Веб-приложения часто содержат скрытые ошибки JavaScript, 500 сбои бэкенда или невидимые z-index блоки, из-за которых пользователи не могут оформить заказ. Ghost-QA Sentinel — автономный робот-тестировщик, который самостоятельно исследует сайт, находит дефекты и исправляет их без участия человека.",
    guideStep2Title: "2. Хаос-Краулер (Playwright Chromium)",
    guideStep2Desc: "Наш движок на базе headless Chromium эмулирует действия реального пользователя: нажимает кнопки, оформляет заказ, тестирует ваучеры и перехватывает сбои. При возникновении ошибки мгновенно фиксируются скриншот и состояние DOM.",
    guideStep3Title: "3. Диагностика Google Gemini 3.8 Flash",
    guideStep3Desc: "Каждая пойманная ошибка передаётся в нейросеть Google Gemini. ИИ анализирует причину сбоя и синтезирует чистый, надёжный патч (Unified Diff) для исправления ошибки в коде.",
    guideStep4Title: "4. Исправление в один клик и GitHub PR",
    guideStep4Desc: "Нажмите 'Применить Патч Локально' для мгновенной правки файла на вашем компьютере, или 'Создать GitHub PR' для автоматического создания ветки и Pull Request в репозиторий вашей команды.",
    guideStep5Title: "5. Оповещения в Telegram Боте",
    guideStep5Desc: "Бот @ghost_qa_sentinel_bot в реальном времени присылает уведомления о найденных критических багах со скриншотами и диффами кода прямо на ваш смартфон.",
    guideStep6Title: "6. Попробуйте Песочницу прямо сейчас!",
    guideStep6Desc: "В систему уже встроена тестовая витрина CyberMart с 4 реальными багами. Нажмите 'Демо CyberMart' или введите адрес своего сайта, чтобы увидеть автоисправление в действии!",
    guideNextBtn: "Далее",
    guidePrevBtn: "Назад",
    guideFinishBtn: "Понятно, Начать!",
    guideTryDemoBtn: "Сканировать Песочницу",

    // Theme Customizer
    themeModalTitle: "Настройки Дизайна и Фона",
    themeModalSubtitle: "Выберите подходящую цветовую палитру и динамическую анимацию фона",
    themesSectionTitle: "Цветовые Стили",
    bgEffectsSectionTitle: "Анимации Фона",
    themeCyberpunk: "Cyberpunk Obsidian",
    themeMatrix: "Matrix Hacker Green",
    themeSynthwave: "Synthwave 80s Sunset",
    themeMidnight: "Midnight Deep Ocean",
    themeBloodMoon: "Blood Moon Security",
    themeNordic: "Stealth Nordic Slate",
    themeSolar: "Solar Flare Gold",
    bgEffectMatrixRain: "Зелёный Дождь Кода Матрицы",
    bgEffectCyberGrid: "Движущаяся 3D Кибер-Сетка",
    bgEffectParticles: "Парящие Неоновые Частицы",
    bgEffectScanline: "Эффект ЭЛТ-Монитора (Scanlines)",
    bgEffectMinimal: "Чистый Минималистичный Фон",
    closeBtn: "Закрыть"
  }
};
