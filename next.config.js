/** @type {import('next').NextConfig} */
const nextConfig = {
  // Статический экспорт для обычного хостинга
  output: 'export',
  trailingSlash: true,
  poweredByHeader: false,
  compress: true,
  // Отключаем изображения для статического экспорта
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
