import { describe, it, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import Button from './index.vue'

/* ========================================================================

======================================================================== */

describe('WrappedSVG', () => {
  it('mount(): renders a <div> with an <svg> child', () => {
    const wrapper = mount(Button, {})

    expect(wrapper.html()).toContain('<svg')
    // console.log(wrapper.html())
    // <div class="mx-auto max-w-50">
    //   <svg class="w-full" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    //     <path d="M2 4L16 28L30 4H24.5L16 18.5L7.5 4H2Z" fill="#41B883"></path>
    //     <path d="M7.5 4L16 18.5L24.5 4H19.5L16.0653 10.0126L12.5 4H7.5Z" fill="#35495E"></path>
    //   </svg>
    // </div>
  })

  it('shallowMount():renders a <div> with an <svg> child', () => {
    const wrapper = shallowMount(Button, {})
    expect(wrapper.html()).not.toContain('<svg')
    // console.log(wrapper.html())
    // <div class="mx-auto max-w-50">
    //   <vue-s-v-g-stub></vue-s-v-g-stub>
    // </div>
  })
})
