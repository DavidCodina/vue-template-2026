// import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Select from './index.vue'

/* ========================================================================

======================================================================== */

describe('Select', () => {
  /* ======================

  ====================== */

  it('renders an <select> element internally', () => {
    const wrapper = mount(Select)

    expect(wrapper.html()).toContain('<select')
  })
})
