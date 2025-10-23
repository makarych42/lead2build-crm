# Генерация иконок для PWA

## Быстрый способ (онлайн)

### Вариант 1: PWA Asset Generator
1. Перейдите на https://www.pwabuilder.com/imageGenerator
2. Загрузите изображение 512x512 (или создайте в Figma/Canva)
3. Скачайте все сгенерированные размеры
4. Поместите в папку `public/icons/`

### Вариант 2: Favicon Generator
1. Перейдите на https://realfavicongenerator.net/
2. Загрузите изображение
3. Выберите Android Chrome
4. Скачайте все иконки
5. Поместите в `public/icons/`

### Вариант 3: App Icon Generator
https://app-icon.com/
- Загрузите 1024x1024 изображение
- Выберите Android
- Скачайте все размеры

## Требуемые размеры

Для Android PWA нужны следующие размеры:
- ✅ 72x72
- ✅ 96x96
- ✅ 128x128
- ✅ 144x144
- ✅ 152x152
- ✅ 192x192
- ✅ 384x384
- ✅ 512x512

## Временное решение (для тестирования)

Пока нет финальных иконок, можно использовать простую заглушку:

1. Создайте в Figma/Canva квадрат 512x512
2. Добавьте текст "L2B" или логотип
3. Цвет фона: #3b82f6 (синий)
4. Экспортируйте PNG
5. Используйте онлайн генератор для создания всех размеров

## Локальная генерация (Node.js)

Установите sharp:
\`\`\`bash
npm install --save-dev sharp
\`\`\`

Создайте скрипт `scripts/generate-icons.js`:
\`\`\`javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = 'source-icon.png'; // Ваше исходное изображение 512x512

sizes.forEach(size => {
  sharp(inputFile)
    .resize(size, size)
    .toFile(`public/icons/icon-${size}x${size}.png`)
    .then(() => console.log(`✅ Generated ${size}x${size}`))
    .catch(err => console.error(`❌ Error ${size}x${size}:`, err));
});
\`\`\`

Запустите:
\`\`\`bash
node scripts/generate-icons.js
\`\`\`

## Рекомендации по дизайну

- **Простота**: Иконка должна быть узнаваемой даже в малых размерах
- **Контраст**: Хороший контраст между фоном и элементами
- **Безопасная зона**: Оставьте 10% отступ от краев
- **Формат**: PNG с прозрачностью или solid цветом фона
- **Стиль**: Соответствовать Material Design для Android

## Проверка

После генерации проверьте:
1. Все файлы существуют в `public/icons/`
2. Размеры корректные
3. manifest.json ссылается на правильные пути
4. Lighthouse PWA audit показывает зеленый статус

## Текущий статус

❗ **Требуется**: Сгенерировать все иконки перед билдом APK

