import type { InjectionKey } from 'vue'
import type { AppState } from '@/types'

export const appStateKey: InjectionKey<AppState> = Symbol('appState')
