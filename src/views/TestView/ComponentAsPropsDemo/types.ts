import type { Component } from 'vue'

export type NavItem = {
  id: string
  label: string
  // A component, not an instance and not markup.
  // NavMenu decides where and how to render it.
  icon: Component
}
