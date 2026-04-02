import { registerSW } from 'virtual:pwa-register'

export function registerPWA() {
  registerSW({
    immediate: true,
    onOfflineReady() {
      console.info('FPlanner is ready to work offline.')
    },
  })
}
