# 📱 Мобильная PWA версия - Руководство

## ✅ Что реализовано

### PWA Основа
- ✅ `public/manifest.json` - манифест приложения
- ✅ `public/sw.js` - Service Worker для оффлайн режима
- ✅ PWA мета-теги в layout
- ✅ Автоматическая регистрация Service Worker

### Мобильный UI
- ✅ `/mobile` - мобильный dashboard
- ✅ `/mobile/leads` - просмотр лидов
- ✅ `/mobile/tasks` - мои задачи
- ✅ `/mobile/voting` - голосования
- ✅ Bottom Navigation - удобная навигация
- ✅ Touch-friendly карточки
- ✅ Адаптивный дизайн

### Функции
- ✅ Просмотр лидов с фильтрами
- ✅ Просмотр задач с приоритетами
- ✅ Просмотр голосований с прогрессом
- ✅ Автоматический редирект с desktop на mobile
- ✅ Оффлайн режим (кеширование)
- ✅ Pull-to-refresh (через браузер)

---

## 🚀 Шаги для тестирования

### 1. Запустите dev сервер

```bash
npm run dev
```

### 2. Откройте на мобильном устройстве

Используйте ngrok для доступа из интернета:

```bash
# Установите ngrok
npm install -g ngrok

# Запустите туннель
ngrok http 3000
```

Откройте сгенерированный HTTPS URL на телефоне.

### 3. Проверьте PWA

В Chrome DevTools → Application:
- ✅ Manifest должен загружаться
- ✅ Service Worker должен быть зарегистрирован
- ✅ Lighthouse PWA score должен быть > 80

### 4. Установите PWA

На Android:
1. Откройте сайт в Chrome
2. Нажмите меню (3 точки)
3. Выберите "Установить приложение" или "Добавить на главный экран"
4. Приложение появится как нативное

---

## 📦 Генерация APK файла

### Вариант 1: PWABuilder (рекомендуется)

**Самый простой способ!**

1. **Deploy PWA на Vercel/Railway**
   ```bash
   # Vercel
   npm install -g vercel
   vercel --prod
   
   # Railway
   railway up
   ```

2. **Перейдите на PWABuilder**
   - https://www.pwabuilder.com/

3. **Введите URL вашего PWA**
   - Например: `https://your-app.vercel.app`

4. **Проверьте PWA score**
   - Должно быть > 80 баллов
   - Исправьте ошибки если есть

5. **Выберите платформу**
   - Нажмите "Next" → "Android"
   - Выберите "Trusted Web Activity"

6. **Настройте параметры**
   - App Name: Lead2Build CRM
   - Package ID: com.lead2build.crm
   - Theme Color: #3b82f6
   - Background Color: #ffffff

7. **Сгенерируйте APK**
   - Нажмите "Build My PWA"
   - Скачайте `.aab` или `.apk` файл

8. **Тестируйте APK**
   ```bash
   # Установите на Android устройство
   adb install app-release.apk
   ```

---

### Вариант 2: Bubblewrap (командная строка)

**Для продвинутых пользователей**

1. **Установите Bubblewrap**
   ```bash
   npm install -g @bubblewrap/cli
   ```

2. **Инициализируйте проект**
   ```bash
   bubblewrap init --manifest https://your-app.vercel.app/manifest.json
   ```

3. **Ответьте на вопросы**
   - Package Name: com.lead2build.crm
   - App Name: Lead2Build CRM
   - Display Mode: standalone
   - Orientation: portrait

4. **Соберите APK**
   ```bash
   bubblewrap build
   ```

5. **APK будет в папке**
   ```
   ./app-release-signed.apk
   ```

---

### Вариант 3: Android Studio + TWA

**Если нужен полный контроль**

1. **Установите Android Studio**

2. **Создайте новый проект**
   - New Project → Empty Activity
   - Package: com.lead2build.crm

3. **Добавьте зависимости**
   ```gradle
   dependencies {
       implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
   }
   ```

4. **Создайте TWA Activity**

5. **Укажите URL вашего PWA**
   ```xml
   <meta-data
       android:name="asset_statements"
       android:value="https://your-app.vercel.app/.well-known/assetlinks.json" />
   ```

6. **Соберите APK**
   ```bash
   ./gradlew assembleRelease
   ```

---

## ⚠️ Важно перед сборкой APK

### 1. Сгенерируйте иконки

```bash
# Следуйте инструкции в public/icons/ICONS_GUIDE.md
```

Нужны все размеры: 72, 96, 128, 144, 152, 192, 384, 512

### 2. Проверьте manifest.json

```json
{
  "name": "Lead2Build CRM",
  "short_name": "Lead2Build",
  "start_url": "/mobile",
  "display": "standalone",
  "theme_color": "#3b82f6"
}
```

### 3. Deploy на HTTPS

PWA **требует HTTPS**! Используйте:
- Vercel (бесплатно, автоматический HTTPS)
- Railway (бесплатно, автоматический HTTPS)
- Netlify
- Firebase Hosting

### 4. Проверьте Service Worker

Откройте DevTools → Application → Service Workers
- Должен быть активен
- Должен кешировать ресурсы

### 5. Lighthouse проверка

```bash
# В Chrome DevTools
# Lighthouse → Progressive Web App
# Score должен быть > 80
```

---

## 📋 Требования для PWA/TWA

✅ **ОБЯЗАТЕЛЬНО:**
- HTTPS (да, обязательно!)
- manifest.json с корректными иконками
- Service Worker зарегистрирован
- Иконки всех размеров (72-512px)
- start_url работает
- display: standalone

✅ **Рекомендуется:**
- Lighthouse score > 80
- Offline страница
- Быстрая загрузка (< 3 сек)
- Адаптивный дизайн

---

## 🧪 Тестирование APK

### На эмуляторе (Android Studio)

```bash
# Запустите эмулятор
emulator -avd Pixel_5_API_30

# Установите APK
adb install app-release.apk
```

### На реальном устройстве

```bash
# Включите USB debugging на телефоне
# Подключите к компьютеру

# Установите
adb install app-release.apk
```

### Проверьте:
- ✅ Приложение открывается
- ✅ Навигация работает
- ✅ Данные загружаются
- ✅ Оффлайн режим работает
- ✅ Нет ошибок в логах

---

## 📤 Распространение APK

### Вариант 1: Прямая установка (Recommended)

1. Загрузите APK на сервер / Google Drive
2. Отправьте ссылку пользователям
3. Пользователи скачивают и устанавливают
4. **Не требует Google Play!**

### Вариант 2: Google Play Store

1. Создайте Google Play Developer аккаунт ($25)
2. Загрузите `.aab` файл
3. Заполните описание приложения
4. Пройдите проверку (2-7 дней)
5. Опубликуйте

---

## 🔧 Troubleshooting

### "manifest.json не найден"
- Проверьте путь в layout.tsx
- Убедитесь что файл в `public/manifest.json`

### "Service Worker не регистрируется"
- Проверьте HTTPS (обязательно!)
- Откройте DevTools → Console
- Проверьте путь к sw.js

### "PWA не устанавливается"
- Проверьте Lighthouse score
- Добавьте все иконки
- Убедитесь что start_url работает

### "APK не работает"
- Проверьте что PWA развернут на HTTPS
- Проверьте assetlinks.json
- Проверьте логи: `adb logcat`

---

## 🎯 Следующие шаги

1. ✅ Сгенерируйте иконки (см. public/icons/ICONS_GUIDE.md)
2. ✅ Deploy PWA на Vercel
3. ✅ Проверьте Lighthouse score
4. ✅ Сгенерируйте APK через PWABuilder
5. ✅ Протестируйте на Android устройстве
6. ✅ Распространяйте APK!

---

## 📚 Полезные ссылки

- [PWABuilder](https://www.pwabuilder.com/)
- [Bubblewrap Documentation](https://github.com/GoogleChromeLabs/bubblewrap)
- [TWA Guide](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)

---

## ✨ Готово!

Мобильная PWA версия готова к использованию и сборке в APK! 🚀

