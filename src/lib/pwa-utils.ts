/**
 * Утилиты для работы с PWA
 */

/**
 * Проверяет, является ли устройство мобильным
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  
  // Проверка на мобильные устройства
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent.toLowerCase()
  )
}

/**
 * Проверяет, установлено ли приложение как PWA
 */
export function isInstalledPWA(): boolean {
  if (typeof window === 'undefined') return false
  
  // Проверка на standalone mode
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  )
}

/**
 * Показывает ли браузер возможность установки PWA
 */
export function canInstallPWA(): boolean {
  if (typeof window === 'undefined') return false
  
  // Проверка на поддержку beforeinstallprompt
  return 'BeforeInstallPromptEvent' in window
}

/**
 * Запрашивает установку PWA
 */
export async function promptPWAInstall(
  deferredPrompt: any
): Promise<boolean> {
  if (!deferredPrompt) return false
  
  // Показываем промпт
  deferredPrompt.prompt()
  
  // Ждем ответа пользователя
  const { outcome } = await deferredPrompt.userChoice
  
  return outcome === 'accepted'
}

/**
 * Получает информацию об устройстве
 */
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      os: 'unknown',
      browser: 'unknown',
    }
  }
  
  const userAgent = navigator.userAgent.toLowerCase()
  
  return {
    isMobile: /android|webos|iphone|ipod|blackberry|iemobile/i.test(userAgent),
    isTablet: /ipad|android(?!.*mobile)/i.test(userAgent),
    isDesktop: !/android|webos|iphone|ipad|ipod|blackberry|iemobile/i.test(userAgent),
    os: getOS(userAgent),
    browser: getBrowser(userAgent),
  }
}

function getOS(userAgent: string): string {
  if (/android/i.test(userAgent)) return 'Android'
  if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS'
  if (/windows phone/i.test(userAgent)) return 'Windows Phone'
  if (/windows/i.test(userAgent)) return 'Windows'
  if (/macintosh|mac os x/i.test(userAgent)) return 'macOS'
  if (/linux/i.test(userAgent)) return 'Linux'
  return 'Unknown'
}

function getBrowser(userAgent: string): string {
  if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) return 'Chrome'
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari'
  if (/firefox/i.test(userAgent)) return 'Firefox'
  if (/edge/i.test(userAgent)) return 'Edge'
  if (/opera|opr/i.test(userAgent)) return 'Opera'
  return 'Unknown'
}

/**
 * Проверяет поддержку Service Worker
 */
export function supportsServiceWorker(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator
}

/**
 * Проверяет online/offline статус
 */
export function isOnline(): boolean {
  return typeof window !== 'undefined' ? navigator.onLine : true
}

/**
 * Подписка на изменение online/offline статуса
 */
export function subscribeToOnlineStatus(
  callback: (isOnline: boolean) => void
): () => void {
  if (typeof window === 'undefined') return () => {}
  
  const handleOnline = () => callback(true)
  const handleOffline = () => callback(false)
  
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // Возвращаем функцию отписки
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}

