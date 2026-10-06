import { describe, it, expect, vi } from 'vitest'
import {
  mount
  // shallowMount
} from '@vue/test-utils'
import Button from './index.vue'

//# What is vm?
//# https://www.youtube.com/watch?v=koBMDWbL_Gw&list=PLXDouhCU5r6oai6AB-WpDNPxEAqhvDfFt&index=7
//# i.e., expect(wrapper.findComponent(BaseButton).vm.type).toBe( ... )
/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// A quick primer on @vue/test-utils (VTU):
//
//   mount(Component, options)  Renders the component (and its children) into a
//                              jsdom document and returns a "wrapper".
//
//   options.props              Declared props (here, only `class`).
//   options.attrs              Non-prop attributes. These "fall through" to the
//                              root element (this is how `type`, `disabled`,
//                              `onClick`, etc. reach the <button>).
//   options.slots              Slot content, e.g. { default: 'Click me' }.
//
//   wrapper.text()             Text content of the root element.
//   wrapper.html()             Rendered HTML string (great for debugging).
//   wrapper.classes()          Array of the root element's classes.
//   wrapper.attributes('x')    Value of attribute x (undefined if absent).
//   wrapper.trigger('click')   Dispatches a DOM event. Returns a promise that
//                              resolves after Vue re-renders, so always await it.
//   wrapper.find(selector)     Finds a descendant element.
//
// Tip: when you're not sure what rendered, add `console.log(wrapper.html())`.
//
///////////////////////////////////////////////////////////////////////////

describe('Button', () => {
  /* ======================
        Rendering
  ====================== */

  describe('Rendering', () => {
    // Obviously, this is overkill. It's just for practice.

    it('renders a <button> element', () => {
      const wrapper = mount(Button, {
        // attachTo: ...
        // attrs: ...
        // data: ...
        // global: ...
        // props: ...
        // shallow: ...
        // slots:{
        //   default: 'Click Me'
        // }
      })

      // 'HTMLDivElement'
      console.log({ 'wrapper.element.constructor.name': wrapper.element.constructor.name })

      // false
      console.log({
        'wrapper.element instanceof HTMLButtonElement': wrapper.element instanceof HTMLButtonElement
      })

      // true
      console.log(
        wrapper.element.ownerDocument.defaultView?.HTMLButtonElement === HTMLButtonElement
      )

      // 1. Does the wrapper have a rendered element? (VTU's own API)
      expect(wrapper.exists()).toBe(true)

      // 2. Query for it by selector. find() also matches the root element.
      expect(wrapper.find('button').exists()).toBe(true)

      // 3. get() is like find() but throws if nothing matches,
      // so the test fails on its own if the element is missing.
      wrapper.get('button')

      ///////////////////////////////////////////////////////////////////////////
      //
      // ⚠️ Gotcha: If your compoonent has multiple root nodes, wrapper.element
      // actually falls back to the parent element, (i.e., the wrapper <div itself).
      // That results in the following tests failing:
      //
      //   ❌ expect(wrapper.element).toBeInstanceOf(HTMLButtonElement)
      //   ❌ expect(wrapper.element.tagName).toBe('BUTTON')
      //   ❌ expect(wrapper.element.matches('button')).toBe(true)
      //   ❌ expect(wrapper.html()).toMatch(/^<button/)
      //
      // What makes mount() particularly quirky is that even a sibling comment is
      // enough to cause wrapper.element to fallback to the parent element.
      //
      //   <template>
      //     <!--Even a comment will screw things up.  -->
      //     <button>Click Me</button>
      //   </template>
      //
      // The solution for many tests is to use wrapper.element.firstElementChild,
      // or .get('button')
      //
      // Note: A sibling comment like this will not actually cause attribute
      // fallthrough to break in the application.
      //
      ///////////////////////////////////////////////////////////////////////////

      // 4. Check the element itself.
      expect(wrapper.element.firstElementChild).toBeInstanceOf(HTMLButtonElement)
      expect(wrapper.element.firstElementChild.tagName).toBe('BUTTON')
      expect(wrapper.element.firstElementChild.matches('button')).toBe(true) // CSS selector match

      // 5. Check the HTML string.
      expect(wrapper.html()).toContain('<button')

      expect(wrapper.element.firstElementChild?.outerHTML).toMatch(/^<button/)

      // 7. Check that the component itself mounted.
      expect(wrapper.findComponent(Button).exists()).toBe(true)

      // 8. Snapshot the whole output.
      // expect(wrapper.html()).toMatchInlineSnapshot(`
      //   "<button type="button" class="inline-flex cursor-pointer justify-center rounded bg-neutral-500 px-2 py-1 text-sm text-white">
      //     <!-- <slot> is Vue's direct equivalent of React's children prop.
      //       You can do it with or without a fallback:  <slot>Click Me!</slot> -->
      //   </button>"
      // `)

      // console.log(wrapper.html())
    })

    it.todo('Some other test...')

    it('renders and is visible', () => {
      const wrapper = mount(Button, { attachTo: document.body })
      expect(wrapper.isVisible()).toBe(true)
      wrapper.unmount() // clean up when using attachTo
    })

    it('renders default slot content', () => {
      const wrapper = mount(Button, {
        slots: { default: 'Click Me' }
      })
      expect(wrapper.text()).toBe('Click Me')
    })

    it('renders HTML/elements passed through the slot', () => {
      const wrapper = mount(Button, {
        slots: { default: '<span data-testid="icon">★</span> Save' }
      })
      expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Save')
    })

    it('renders empty when no slot content is provided', () => {
      const wrapper = mount(Button)
      expect(wrapper.text()).toBe('')
    })
  })

  /* ======================
        Type Attribute
  ====================== */

  describe('Type Attribute', () => {
    it('defaults to type="button" (so it will not submit forms by accident)', () => {
      const wrapper = mount(Button)
      // Here again, we have the quirky behavior of wrapper.element falling back to the parent element.
      // ❌  expect(wrapper.attributes('type')).toBe('button')
      expect(wrapper.get('button').attributes('type')).toBe('button')
    })

    it('can be overridden via fallthrough attrs', () => {
      const wrapper = mount(Button, {
        attrs: { type: 'submit' }
      })
      // ❌  expect(wrapper.attributes('type')).toBe('submit')
      expect(wrapper.get('button').attributes('type')).toBe('submit')
    })
  })

  /* ======================
          Classes
  ====================== */

  describe('classes', () => {
    // ⚠️ This is a horrible test!. It's very brittle. Not something you're likely going to do in practice.
    it('applies the base classes', () => {
      const wrapper = mount(Button)
      expect(wrapper.get('button').classes()).toEqual(
        expect.arrayContaining([
          'rounded-md',
          'font-semibold',
          'inline-flex',
          'items-center',
          'disabled:cursor-not-allowed',
          'disabled:opacity-75',
          'aria-disabled:cursor-not-allowed',
          'aria-disabled:opacity-75',
          'transition-colors',
          'select-none',
          'text-sm',
          'gap-1.5',
          'text-white',
          'bg-primary',
          'outline',
          '-outline-offset-1',
          'outline-[oklch(from_var(--ui-primary)_calc(l_-_0.1)_c_h)]',
          'dark:outline-[oklch(from_var(--ui-primary)_calc(l_+_0.1)_c_h)]',
          'hover:bg-primary/85',
          'focus-visible:ring-[3px]',
          'focus-visible:ring-primary/50',
          'active:bg-primary/85',
          'disabled:bg-primary',
          'aria-disabled:bg-primary',
          'p-1.5'
        ])
      )
    })

    it('appends a string class prop', () => {
      const wrapper = mount(Button, {
        props: { class: 'my-custom-class' }
      })
      expect(wrapper.get('button').classes()).toContain('my-custom-class')
      // Base classes should still be there.
      expect(wrapper.get('button').classes()).toContain('inline-flex')
    })

    it('supports object syntax for the class prop', () => {
      const wrapper = mount(Button, {
        props: { class: { active: true, inactive: false } }
      })
      expect(wrapper.get('button').classes()).toContain('active')
      expect(wrapper.get('button').classes()).not.toContain('inactive')
    })

    it('supports array syntax for the class prop', () => {
      const wrapper = mount(Button, {
        props: { class: ['one', 'two'] }
      })
      expect(wrapper.get('button').classes()).toEqual(expect.arrayContaining(['one', 'two']))
    })

    it('lets consumer classes override conflicting base classes (tailwind-merge)', () => {
      const wrapper = mount(Button, {
        props: { class: 'bg-red-500 px-4' }
      })
      // The consumer's classes win...
      expect(wrapper.get('button').classes()).toContain('bg-red-500')
      expect(wrapper.get('button').classes()).toContain('px-4')
      // ...and the conflicting defaults are removed by twMerge.
      expect(wrapper.get('button').classes()).not.toContain('bg-neutral-500')
      expect(wrapper.get('button').classes()).not.toContain('px-2')
    })
  })

  /* ======================
    Attribute Fallthrough
  ====================== */

  describe('Attribute Fallthrough', () => {
    it('passes arbitrary attributes to the <button>', () => {
      const wrapper = mount(Button, {
        attrs: { 'aria-label': 'Close', id: 'close-btn', 'data-testid': 'btn' }
      })
      expect(wrapper.get('button').attributes('aria-label')).toBe('Close')
      expect(wrapper.get('button').attributes('id')).toBe('close-btn')
      expect(wrapper.get('button').attributes('data-testid')).toBe('btn')
    })

    it('passes the disabled attribute through', () => {
      const wrapper = mount(Button, {
        attrs: { disabled: true }
      })
      expect(wrapper.get('button').attributes('disabled')).toBeDefined()
    })
  })

  /* ======================
          Events
  ====================== */

  describe('events', () => {
    it('calls an onClick handler when clicked', async () => {
      // vi.fn() creates a "spy" that records how it was called.
      const onClick = vi.fn()
      const wrapper = mount(Button, {
        // The onClick attr must be explicitly specified.
        attrs: { onClick }
      })

      await wrapper.get('button').trigger('click')

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('passes the native MouseEvent to the handler', async () => {
      const onClick = vi.fn()
      const wrapper = mount(Button, { attrs: { onClick } })

      await wrapper.get('button').trigger('click')

      expect(onClick.mock.calls[0]![0]).toBeInstanceOf(MouseEvent)
    })

    it('does not call onClick when disabled', async () => {
      const onClick = vi.fn()
      const wrapper = mount(Button, {
        attrs: { onClick, disabled: true }
      })

      // VTU intentionally ignores trigger() on disabled elements.
      await wrapper.get('button').trigger('click')

      expect(onClick).not.toHaveBeenCalled()
    })
  })

  /* ======================
      Miscellaneous
  ====================== */

  describe('Miscellaneous', () => {
    it('has a title of "Delete Database!"', async () => {
      const wrapper = mount(Button, {
        attrs: { title: 'Delete Database!' }
      })

      expect(wrapper.get('button').attributes('title')).toBe('Delete Database!')
    })
  })
})

///////////////////////////////////////////////////////////////////////////
//
// For an example of mount vs shallowMount, see:
// src/views/TestView/components/WrappedSVG/WrappedSVG.spec.ts
// The basic idea is that it stubs out child components.
//
//   it('shallowMount():renders a <div> with an <svg> child', () => {
//     const wrapper = shallowMount(Button, {})
//     expect(wrapper.html()).not.toContain('<svg')
//     console.log(wrapper.html())
//     // <div class="mx-auto max-w-50">
//     //   <vue-s-v-g-stub></vue-s-v-g-stub>
//     // </div>
//   })
//
// This can be useful for removing extra noise.
//
///////////////////////////////////////////////////////////////////////////
