// https://vitest.dev/guide/mocking
// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { computed, nextTick, ref, onMounted, onUnmounted, watch } from 'vue'
import { mount, shallowMount } from '@vue/test-utils'

// Used to annotate `emit` in setup() functions, because plain object literals
// (no defineComponent) aren't contextually typed.
type Emit = (event: string, ...args: unknown[]) => void

/* ========================================================================

======================================================================== */

describe('Inline <input> Demos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    // Always put real timers back, otherwise a fake-timer test can leak into the next one
    vi.useRealTimers()
  })

  /* ======================
  Sanity check: the inline template approach
  ====================== */

  it('renders an <input> element from an inline template', () => {
    const wrapper = shallowMount({
      template: '<input />'
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element.tagName).toBe('INPUT')
    // <input> is a void element, so it never has text content
    expect(wrapper.text()).toBe('')
  })

  /* ======================
          Attributes
  ====================== */

  describe('attributes', () => {
    it('reads static attributes from an inline template', () => {
      const wrapper = shallowMount({
        template: '<input type="email" name="email" placeholder="you@example.com" />'
      })

      // attributes() with no argument returns an object of all attributes
      expect(wrapper.attributes()).toEqual({
        type: 'email',
        name: 'email',
        placeholder: 'you@example.com'
      })

      // attributes('name') returns a single value
      expect(wrapper.attributes('type')).toBe('email')
      expect(wrapper.attributes('placeholder')).toBe('you@example.com')
    })

    /* =================== */

    it('returns undefined for attributes that are not set', () => {
      const wrapper = shallowMount({
        template: '<input type="text" />'
      })

      expect(wrapper.attributes('placeholder')).toBeUndefined()
      expect(wrapper.attributes('maxlength')).toBeUndefined()
      // Another way: check the DOM API directly
      expect(wrapper.element.hasAttribute('placeholder')).toBe(false)
    })

    /* =================== */

    it('defaults to type="text" as a DOM property even with no attribute', () => {
      const wrapper = shallowMount({
        template: '<input />'
      })
      const input = wrapper.element as HTMLInputElement

      expect(wrapper.attributes('type')).toBeUndefined() // no attribute...
      expect(input.type).toBe('text') // ...but the property has a default
    })

    /* =================== */

    it('passes fallthrough attrs (id, data-*, aria-*) to the root <input>', () => {
      const wrapper = shallowMount(
        {
          template: '<input type="text" />'
        },
        {
          attrs: {
            id: 'first-name',
            'data-testid': 'first-name',
            'aria-label': 'First name'
          }
        }
      )

      expect(wrapper.attributes('id')).toBe('first-name')
      expect(wrapper.attributes('data-testid')).toBe('first-name')
      expect(wrapper.attributes('aria-label')).toBe('First name')
    })

    /* =================== */

    it('binds attributes dynamically from props', () => {
      const wrapper = shallowMount(
        {
          props: { kind: String, hint: String, limit: Number },
          template: '<input :type="kind" :placeholder="hint" :maxlength="limit" />'
        },
        { props: { kind: 'search', hint: 'Search…', limit: 20 } }
      )

      expect(wrapper.attributes('type')).toBe('search')
      expect(wrapper.attributes('placeholder')).toBe('Search…')
      expect(wrapper.attributes('maxlength')).toBe('20') // attributes are always strings
      expect((wrapper.element as HTMLInputElement).maxLength).toBe(20) // properties are typed
    })

    /* =================== */

    it('omits an attribute entirely when bound to undefined', () => {
      const wrapper = shallowMount({
        template: '<input type="text" :placeholder="undefined" />'
      })

      expect(wrapper.element.hasAttribute('placeholder')).toBe(false)
    })

    /* =================== */

    it('sets numeric constraints: min, max and step', () => {
      const wrapper = shallowMount({
        template: '<input type="number" min="1" max="10" step="0.5" />'
      })
      const input = wrapper.element as HTMLInputElement

      expect(input.min).toBe('1')
      expect(input.max).toBe('10')
      expect(input.step).toBe('0.5')
    })

    /* =================== */

    it('distinguishes the value attribute from the .value DOM property', async () => {
      const wrapper = shallowMount({
        template: '<input type="text" />'
      })
      const input = wrapper.find('input')

      // Typing (or setValue) changes the property, not the attribute
      await input.setValue('typed text')

      expect(input.element.value).toBe('typed text')
      expect(input.attributes('value')).toBeUndefined()
    })
  })

  /* ======================
  Input types (it.each)
  ====================== */

  // describe('input types', () => {
  //   it.each([
  //     'text',
  //     'email',
  //     'password',
  //     'search',
  //     'tel',
  //     'url',
  //     'number',
  //     'date',
  //     'range',
  //     'color',
  //     'checkbox',
  //     'radio',
  //     'file',
  //     'hidden'
  //   ])('supports type="%s"', (type) => {
  //     const wrapper = shallowMount(
  //       {
  //         props: { type: String },
  //         template: '<input :type="type" />'
  //       },
  //       { props: { type } }
  //     )

  //     expect((wrapper.element as HTMLInputElement).type).toBe(type)
  //   })

  //   /* =================== */

  //   // Array-of-objects form: use $propertyName in the title
  //   it.each([
  //     { type: 'email', value: 'ada@example.com' },
  //     { type: 'url', value: 'https://example.com' },
  //     { type: 'tel', value: '555-1234' },
  //     { type: 'search', value: 'vue test utils' },
  //     { type: 'password', value: 'hunter2' }
  //   ])('round-trips a value for type="$type"', async ({ type, value }) => {
  //     const wrapper = shallowMount(
  //       {
  //         props: { type: String },
  //         template: '<input :type="type" />'
  //       },
  //       { props: { type } }
  //     )

  //     await wrapper.setValue(value)

  //     expect((wrapper.element as HTMLInputElement).value).toBe(value)
  //   })
  // })

  /* ======================
    setValue & v-model
  ====================== */

  describe('v-model', () => {
    it('reflects the initial model value in the DOM', () => {
      const wrapper = shallowMount({
        data() {
          return { text: 'preset' }
        },
        template: '<input v-model="text" />'
      })

      expect((wrapper.element as HTMLInputElement).value).toBe('preset')
    })

    /* =================== */

    it('updates the model when setValue is called', async () => {
      const wrapper = shallowMount({
        data() {
          return { text: '' }
        },
        template: '<input v-model="text" />'
      })
      const input = wrapper.find('input')

      // DOMWrapper.setValue sets element.value AND triggers the `input` event
      await input.setValue('hello')

      expect(wrapper.vm.text).toBe('hello')
      expect(input.element.value).toBe('hello')
    })

    /* =================== */

    it('updates the DOM when the model changes (via setData)', async () => {
      const wrapper = shallowMount({
        data() {
          return { text: 'before' }
        },
        template: '<input v-model="text" />'
      })

      await wrapper.setData({ text: 'after' })

      expect((wrapper.element as HTMLInputElement).value).toBe('after')
    })

    /* =================== */

    it('renders the model somewhere else in the template', async () => {
      const wrapper = mount({
        data() {
          return { name: '' }
        },
        template: `
          <div>
            <input v-model="name" />
            <p class="greeting">Hello, {{ name || 'stranger' }}!</p>
          </div>
        `
      })

      expect(wrapper.find('.greeting').text()).toBe('Hello, stranger!')

      await wrapper.find('input').setValue('Ada')

      expect(wrapper.find('.greeting').text()).toBe('Hello, Ada!')
    })

    /* =================== */

    it('works with a setup() + ref model', async () => {
      const wrapper = shallowMount({
        setup() {
          const text = ref('')
          const length = computed(() => text.value.length)
          return { text, length }
        },
        template: '<div><input v-model="text" /><span class="len">{{ length }}</span></div>'
      })

      await wrapper.find('input').setValue('abcd')

      expect(wrapper.find('.len').text()).toBe('4')
    })

    /* =================== */

    it('v-model.trim strips surrounding whitespace', async () => {
      const wrapper = shallowMount({
        data() {
          return { text: '' }
        },
        template: '<input v-model.trim="text" />'
      })

      await wrapper.find('input').setValue('   padded   ')

      expect(wrapper.vm.text).toBe('padded')
    })

    /* =================== */

    it('v-model.number casts the value to a number', async () => {
      const wrapper = shallowMount({
        data() {
          return { age: 0 as number | string }
        },
        template: '<input v-model.number="age" />'
      })

      await wrapper.find('input').setValue('42')

      expect(wrapper.vm.age).toBe(42)
      expect(typeof wrapper.vm.age).toBe('number')
    })

    /* =================== */

    it('type="number" also casts to a number automatically', async () => {
      const wrapper = shallowMount({
        data() {
          return { qty: 0 as number | string }
        },
        template: '<input type="number" v-model="qty" />'
      })

      await wrapper.find('input').setValue('7')

      expect(wrapper.vm.qty).toBe(7)
    })

    /* =================== */

    it('v-model.lazy only syncs on `change`, not on `input`', async () => {
      const wrapper = shallowMount({
        data() {
          return { text: '' }
        },
        template: '<input v-model.lazy="text" />'
      })
      const input = wrapper.find('input')

      input.element.value = 'abc'
      await input.trigger('input')
      expect(wrapper.vm.text).toBe('') // lazy ignores `input`

      await input.trigger('change')
      expect(wrapper.vm.text).toBe('abc') // lazy reads element.value on `change`
    })
    /* =================== */

    it('ignores input events while an IME composition is in progress', async () => {
      const wrapper = shallowMount({
        data() {
          return { text: '' }
        },
        template: '<input v-model="text" />'
      })
      const input = wrapper.find('input')

      await input.trigger('compositionstart')
      input.element.value = 'に'
      await input.trigger('input') // `input` only, no `change`
      expect(wrapper.vm.text).toBe('') // Vue waits until composition ends

      await input.trigger('compositionend')
      expect(wrapper.vm.text).toBe('に')
    })

    /* =================== */

    it('works with a native dispatchEvent + nextTick instead of setValue', async () => {
      const wrapper = shallowMount({
        data() {
          return { text: '' }
        },
        template: '<input v-model="text" />'
      })
      const input = wrapper.element as HTMLInputElement

      input.value = 'native'
      input.dispatchEvent(new Event('input'))
      await nextTick()

      expect(wrapper.vm.text).toBe('native')
    })
  })

  /* ======================
  Custom v-model component (props + emits)
  ====================== */

  describe('custom v-model component', () => {
    it('emits `update:modelValue` when the user types', async () => {
      const wrapper = shallowMount(
        {
          props: { modelValue: String },
          emits: ['update:modelValue'],
          template: `
            <input
              :value="modelValue"
              @input="$emit('update:modelValue', $event.target.value)"
            />
          `
        },
        { props: { modelValue: '' } }
      )

      await wrapper.setValue('hello')

      expect(wrapper.emitted()).toHaveProperty('update:modelValue')
      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['hello'])
    })

    /* =================== */

    it('emits once per keystroke', async () => {
      const wrapper = shallowMount(
        {
          props: { modelValue: String },
          emits: ['update:modelValue'],
          template: `
            <input
              :value="modelValue"
              @input="$emit('update:modelValue', $event.target.value)"
            />
          `
        },
        { props: { modelValue: '' } }
      )

      await wrapper.setValue('a')
      await wrapper.setValue('ab')
      await wrapper.setValue('abc')

      const events = wrapper.emitted('update:modelValue')!
      expect(events).toHaveLength(3)
      expect(events.map((args) => args[0])).toEqual(['a', 'ab', 'abc'])
    })

    /* =================== */

    it('reflects the modelValue prop in the DOM and updates on setProps', async () => {
      const wrapper = shallowMount(
        {
          props: { modelValue: String },
          template: '<input :value="modelValue" />'
        },
        { props: { modelValue: 'first' } }
      )
      const input = wrapper.element as HTMLInputElement

      expect(input.value).toBe('first')
      expect(wrapper.props('modelValue')).toBe('first')

      // setProps returns a promise that resolves after the DOM updates
      await wrapper.setProps({ modelValue: 'second' })

      expect(input.value).toBe('second')
    })

    /* =================== */

    it('works with the `onUpdate:modelValue` pattern to simulate a parent', async () => {
      // Classic trick: wire props + handler together so the "parent" keeps state
      const wrapper = shallowMount(
        {
          props: { modelValue: String },
          emits: ['update:modelValue'],
          template: `
            <input
              :value="modelValue"
              @input="$emit('update:modelValue', $event.target.value)"
            />
          `
        },
        {
          props: {
            modelValue: '',
            'onUpdate:modelValue': (value: string) => wrapper.setProps({ modelValue: value })
          }
        }
      )

      await wrapper.setValue('synced')

      expect(wrapper.props('modelValue')).toBe('synced')
      expect((wrapper.element as HTMLInputElement).value).toBe('synced')
    })
  })

  /* ======================
          Events
  ====================== */

  // describe('events', () => {
  //   it('calls an input handler passed via attrs (onInput)', async () => {
  //     const onInput = vi.fn()
  //     const wrapper = shallowMount({ template: '<input />' }, { attrs: { onInput } })

  //     await wrapper.setValue('x')

  //     expect(onInput).toHaveBeenCalledTimes(1)
  //     expect(onInput).toHaveBeenCalledWith(expect.any(Event))
  //   })

  //   /* =================== */

  //   it('reads event.target.value inside a handler', async () => {
  //     const onInput = vi.fn()
  //     const wrapper = shallowMount(
  //       { template: '<input @input="$attrs.onSpy($event.target.value)" />' },
  //       { attrs: { onSpy: onInput } }
  //     )

  //     await wrapper.setValue('typed')

  //     expect(onInput).toHaveBeenCalledWith('typed')
  //   })

  //   /* =================== */

  //   it('fires `change` separately from `input`', async () => {
  //     const onInput = vi.fn()
  //     const onChange = vi.fn()
  //     const wrapper = shallowMount({ template: '<input />' }, { attrs: { onInput, onChange } })

  //     await wrapper.setValue('abc') // `input` only
  //     expect(onInput).toHaveBeenCalledTimes(1)
  //     expect(onChange).not.toHaveBeenCalled()

  //     await wrapper.trigger('change')
  //     expect(onChange).toHaveBeenCalledTimes(1)
  //   })

  //   /* =================== */

  //   it('emits `submit` when Enter is pressed', async () => {
  //     const wrapper = shallowMount({
  //       emits: ['submit'],
  //       template: `<input @keydown.enter="$emit('submit', $event.target.value)" />`
  //     })

  //     await wrapper.setValue('query')
  //     await wrapper.trigger('keydown', { key: 'Enter' })

  //     expect(wrapper.emitted('submit')).toHaveLength(1)
  //     expect(wrapper.emitted('submit')![0]).toEqual(['query'])
  //   })

  //   /* =================== */

  //   it('supports VTU key-modifier shorthand (keydown.enter)', async () => {
  //     const wrapper = shallowMount({
  //       emits: ['submit'],
  //       template: `<input @keydown.enter="$emit('submit')" />`
  //     })

  //     await wrapper.trigger('keydown.enter')

  //     expect(wrapper.emitted('submit')).toHaveLength(1)
  //   })

  //   /* =================== */

  //   it('clears the field on Escape', async () => {
  //     const wrapper = shallowMount({
  //       data() {
  //         return { text: '' }
  //       },
  //       template: `<input v-model="text" @keydown.esc="text = ''" />`
  //     })

  //     await wrapper.setValue('something')
  //     expect((wrapper.element as HTMLInputElement).value).toBe('something')

  //     await wrapper.trigger('keydown', { key: 'Escape' })

  //     expect(wrapper.vm.text).toBe('')
  //     expect((wrapper.element as HTMLInputElement).value).toBe('')
  //   })

  //   /* =================== */

  //   it('ignores unrelated keys', async () => {
  //     const wrapper = shallowMount({
  //       emits: ['submit'],
  //       template: `<input @keydown.enter="$emit('submit')" />`
  //     })

  //     await wrapper.trigger('keydown', { key: 'a' })
  //     await wrapper.trigger('keydown', { key: 'Tab' })

  //     expect(wrapper.emitted('submit')).toBeUndefined()
  //   })

  //   /* =================== */

  //   it('passes keyboard modifiers through (shiftKey)', async () => {
  //     const onKeydown = vi.fn()
  //     const wrapper = shallowMount({ template: '<input />' }, { attrs: { onKeydown } })

  //     await wrapper.trigger('keydown', { key: 'a', shiftKey: true })

  //     expect(onKeydown.mock.calls[0]![0].shiftKey).toBe(true)
  //     expect(onKeydown.mock.calls[0]![0].key).toBe('a')
  //   })

  //   /* =================== */

  //   it('@keydown.prevent really does prevent the default action', () => {
  //     const wrapper = shallowMount({
  //       template: '<input @keydown.prevent />'
  //     })

  //     // Dispatch a real event so we can inspect it afterwards
  //     const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true })
  //     wrapper.element.dispatchEvent(event)

  //     expect(event.defaultPrevented).toBe(true)
  //   })

  //   /* =================== */

  //   it('@keydown.stop stops the event from bubbling to a parent', async () => {
  //     const parentKeydown = vi.fn()
  //     const wrapper = mount(
  //       {
  //         emits: ['parent-keydown'],
  //         template: `
  //           <div @keydown="$emit('parent-keydown')">
  //             <input @keydown.stop />
  //           </div>
  //         `
  //       },
  //       { attrs: { onParentKeydown: parentKeydown } }
  //     )

  //     await wrapper.find('input').trigger('keydown', { key: 'a' })

  //     expect(parentKeydown).not.toHaveBeenCalled()
  //   })

  //   /* =================== */

  //   it('events DO bubble to a parent when not stopped', async () => {
  //     const parentKeydown = vi.fn()
  //     const wrapper = mount(
  //       {
  //         emits: ['parent-keydown'],
  //         template: `
  //           <div @keydown="$emit('parent-keydown')">
  //             <input />
  //           </div>
  //         `
  //       },
  //       { attrs: { onParentKeydown: parentKeydown } }
  //     )

  //     await wrapper.find('input').trigger('keydown', { key: 'a' })

  //     expect(parentKeydown).toHaveBeenCalledTimes(1)
  //   })
  // })

  /* ======================
    Focus (requires attachTo: document.body)
  ====================== */

  describe('focus', () => {
    it('can receive focus', () => {
      const wrapper = mount(
        { template: '<input type="text" />' },
        { attachTo: document.body } // focus only works on elements in the document
      )

      ;(wrapper.element as HTMLInputElement).focus()
      expect(document.activeElement).toBe(wrapper.element)

      wrapper.unmount() // clean up since we attached to the real DOM
    })

    /* =================== */

    it('loses focus on blur()', () => {
      const wrapper = mount({ template: '<input />' }, { attachTo: document.body })
      const input = wrapper.element as HTMLInputElement

      input.focus()
      expect(document.activeElement).toBe(input)

      input.blur()
      expect(document.activeElement).not.toBe(input)
      expect(document.activeElement).toBe(document.body)

      wrapper.unmount()
    })

    /* =================== */

    it('focuses itself on mount via a template ref', () => {
      const wrapper = mount(
        {
          setup() {
            const field = ref<HTMLInputElement | null>(null)
            onMounted(() => field.value?.focus())
            return { field } // the returned name must match ref="field"
          },
          template: '<input ref="field" />'
        },
        { attachTo: document.body }
      )

      expect(document.activeElement).toBe(wrapper.find('input').element)

      wrapper.unmount()
    })

    /* =================== */

    it('reacts to focus and blur events', async () => {
      const onFocus = vi.fn()
      const onBlur = vi.fn()
      const wrapper = mount({ template: '<input />' }, { attrs: { onFocus, onBlur } })

      await wrapper.find('input').trigger('focus')
      await wrapper.find('input').trigger('blur')

      expect(onFocus).toHaveBeenCalledTimes(1)
      expect(onBlur).toHaveBeenCalledTimes(1)
    })

    /* =================== */

    it('tracks a "focused" state for styling', async () => {
      const wrapper = mount({
        data() {
          return { focused: false }
        },
        template: `
          <input
            :class="{ 'is-focused': focused }"
            @focus="focused = true"
            @blur="focused = false"
          />
        `
      })

      expect(wrapper.classes()).not.toContain('is-focused')

      await wrapper.trigger('focus')
      expect(wrapper.classes()).toContain('is-focused')

      await wrapper.trigger('blur')
      expect(wrapper.classes()).not.toContain('is-focused')
    })

    /* =================== */

    it('is removed from the tab order with tabindex="-1"', () => {
      const wrapper = mount({ template: '<input tabindex="-1" />' }, { attachTo: document.body })

      expect((wrapper.element as HTMLInputElement).tabIndex).toBe(-1)

      wrapper.unmount()
    })
  })

  /* ======================
      Disabled & readonly
  ====================== */

  describe('disabled and readonly', () => {
    it('sets the disabled attribute and property', () => {
      const wrapper = shallowMount(
        {
          props: { disabled: Boolean },
          template: '<input :disabled="disabled" />'
        },
        { props: { disabled: true } }
      )

      expect(wrapper.attributes('disabled')).toBe('') // boolean attrs render as ''
      expect((wrapper.element as HTMLInputElement).disabled).toBe(true)
    })

    /* =================== */

    it('has no disabled attribute when false', () => {
      const wrapper = shallowMount(
        {
          props: { disabled: Boolean },
          template: '<input :disabled="disabled" />'
        },
        { props: { disabled: false } }
      )

      expect(wrapper.attributes('disabled')).toBeUndefined()
      expect((wrapper.element as HTMLInputElement).disabled).toBe(false)
    })

    /* =================== */

    it('toggles disabled when the prop flips', async () => {
      const wrapper = shallowMount(
        {
          props: { disabled: Boolean },
          template: '<input :disabled="disabled" />'
        },
        { props: { disabled: false } }
      )
      const input = wrapper.element as HTMLInputElement

      await wrapper.setProps({ disabled: true })
      expect(input.disabled).toBe(true)

      await wrapper.setProps({ disabled: false })
      expect(input.disabled).toBe(false)
    })

    /* =================== */

    it('VTU will not trigger events on a disabled element', async () => {
      const onInput = vi.fn()
      const wrapper = shallowMount({ template: '<input disabled />' }, { attrs: { onInput } })

      await wrapper.trigger('input')

      expect(onInput).not.toHaveBeenCalled()
    })

    /* =================== */

    it('setValue on a disabled input does not update the model', async () => {
      const wrapper = shallowMount({
        data() {
          return { text: '' }
        },
        template: '<input v-model="text" disabled />'
      })

      await wrapper.setValue('nope')

      // setValue assigns element.value, but the `input` event is never triggered
      expect(wrapper.vm.text).toBe('')
    })

    /* =================== */

    it('supports readonly', () => {
      const wrapper = shallowMount({
        template: '<input readonly value="fixed" />'
      })

      expect(wrapper.attributes('readonly')).toBe('')
      expect((wrapper.element as HTMLInputElement).readOnly).toBe(true)
    })
  })

  /* ======================
      Checkbox & radio
  ====================== */

  describe('checkbox', () => {
    it('reflects a boolean model as checked', () => {
      const wrapper = shallowMount({
        data() {
          return { agreed: true }
        },
        template: '<input type="checkbox" v-model="agreed" />'
      })

      expect((wrapper.element as HTMLInputElement).checked).toBe(true)
    })

    /* =================== */

    it('updates a boolean model with setValue(true / false)', async () => {
      const wrapper = shallowMount({
        data() {
          return { agreed: false }
        },
        template: '<input type="checkbox" v-model="agreed" />'
      })
      const input = wrapper.find('input')

      await input.setValue(true)
      expect(wrapper.vm.agreed).toBe(true)
      expect(input.element.checked).toBe(true)

      await input.setValue(false)
      expect(wrapper.vm.agreed).toBe(false)
    })

    /* =================== */

    it('toggles when clicked', async () => {
      const wrapper = mount(
        {
          data() {
            return { agreed: false }
          },
          template: '<input type="checkbox" v-model="agreed" />'
        },
        { attachTo: document.body } // click-driven input/change events need a connected element
      )

      await wrapper.trigger('click')
      expect(wrapper.vm.agreed).toBe(true)
      expect((wrapper.element as HTMLInputElement).checked).toBe(true)

      await wrapper.trigger('click')
      expect(wrapper.vm.agreed).toBe(false)

      wrapper.unmount() // clean up since we attached to the real DOM
    })
    /* =================== */

    it('supports custom true-value / false-value', async () => {
      const wrapper = shallowMount({
        data() {
          return { status: 'no' }
        },
        template: '<input type="checkbox" v-model="status" true-value="yes" false-value="no" />'
      })
      const input = wrapper.find('input')

      await input.setValue(true)
      expect(wrapper.vm.status).toBe('yes')

      await input.setValue(false)
      expect(wrapper.vm.status).toBe('no')
    })

    /* =================== */

    it('collects values into an array model', async () => {
      const wrapper = mount({
        data() {
          return { picked: [] as string[] }
        },
        template: `
          <div>
            <input type="checkbox" value="a" v-model="picked" />
            <input type="checkbox" value="b" v-model="picked" />
            <input type="checkbox" value="c" v-model="picked" />
          </div>
        `
      })
      const boxes = wrapper.findAll('input')

      await boxes[0]!.setValue(true)
      await boxes[2]!.setValue(true)
      expect(wrapper.vm.picked).toEqual(['a', 'c'])

      await boxes[0]!.setValue(false)
      expect(wrapper.vm.picked).toEqual(['c'])
    })

    /* =================== */

    it('can be indeterminate (DOM property only, no attribute)', () => {
      const wrapper = shallowMount({
        template: '<input type="checkbox" />'
      })
      const input = wrapper.element as HTMLInputElement

      input.indeterminate = true

      expect(input.indeterminate).toBe(true)
      expect(wrapper.attributes('indeterminate')).toBeUndefined()
    })
  })

  // /* =================== */

  describe('radio', () => {
    it('checks the radio whose value matches the model', () => {
      const wrapper = mount({
        data() {
          return { size: 'm' }
        },
        template: `
          <div>
            <input type="radio" name="size" value="s" v-model="size" />
            <input type="radio" name="size" value="m" v-model="size" />
            <input type="radio" name="size" value="l" v-model="size" />
          </div>
        `
      })
      const checked = wrapper.findAll('input').map((r) => r.element.checked)

      expect(checked).toEqual([false, true, false])
    })

    /* =================== */

    it('updates the model when a different radio is selected', async () => {
      const wrapper = mount({
        data() {
          return { size: 's' }
        },
        template: `
          <div>
            <input type="radio" name="size" value="s" v-model="size" />
            <input type="radio" name="size" value="m" v-model="size" />
            <input type="radio" name="size" value="l" v-model="size" />
          </div>
        `
      })
      const radios = wrapper.findAll('input')

      await radios[2]!.setValue(true)

      expect(wrapper.vm.size).toBe('l')
      expect(radios[2]!.element.checked).toBe(true)
    })
  })

  /* ======================
  Validation (constraint validation API)
  ====================== */

  describe('validation', () => {
    it('required + empty => valueMissing', () => {
      const wrapper = shallowMount({
        template: '<input required />'
      })
      const input = wrapper.element as HTMLInputElement

      expect(wrapper.attributes('required')).toBe('')
      expect(input.validity.valueMissing).toBe(true)
      expect(input.checkValidity()).toBe(false)
    })

    /* =================== */

    it('required + filled => valid', async () => {
      const wrapper = shallowMount({
        template: '<input required />'
      })
      const input = wrapper.find('input')

      await input.setValue('filled')

      expect(input.element.validity.valueMissing).toBe(false)
      expect(input.element.checkValidity()).toBe(true)
    })

    /* =================== */

    it('fires an `invalid` event from checkValidity()', () => {
      const wrapper = shallowMount({
        template: '<input required />'
      })
      const input = wrapper.element as HTMLInputElement
      const onInvalid = vi.fn()
      input.addEventListener('invalid', onInvalid)

      input.checkValidity()

      expect(onInvalid).toHaveBeenCalledTimes(1)
    })

    /* =================== */

    it('flags a pattern mismatch', async () => {
      const wrapper = shallowMount({
        template: '<input pattern="[A-Z]{3}" />'
      })
      const input = wrapper.find('input')

      await input.setValue('abc')
      expect(input.element.validity.patternMismatch).toBe(true)

      await input.setValue('ABC')
      expect(input.element.validity.patternMismatch).toBe(false)
      expect(input.element.validity.valid).toBe(true)
    })

    /* =================== */

    it('flags a number below min (rangeUnderflow) and above max (rangeOverflow)', async () => {
      const wrapper = shallowMount({
        template: '<input type="number" min="5" max="10" />'
      })
      const input = wrapper.find('input')

      await input.setValue('3')
      expect(input.element.validity.rangeUnderflow).toBe(true)

      await input.setValue('11')
      expect(input.element.validity.rangeOverflow).toBe(true)

      await input.setValue('7')
      expect(input.element.validity.valid).toBe(true)
    })

    /* =================== */

    it('supports custom validity messages', () => {
      const wrapper = shallowMount({
        template: '<input />'
      })
      const input = wrapper.element as HTMLInputElement

      input.setCustomValidity('That name is taken')

      expect(input.validity.customError).toBe(true)
      expect(input.validationMessage).toBe('That name is taken')
      expect(input.checkValidity()).toBe(false)

      input.setCustomValidity('') // empty string clears the error
      expect(input.checkValidity()).toBe(true)
    })

    /* =================== */

    // Tagged-template form of it.each: a readable table

    it.each`
      value                | valid
      ${'ada@example.com'} | ${true}
      ${'not-an-email'}    | ${false}
      ${'missing@tld'}     | ${true}
      ${''}                | ${true}
    `('type="email" with "$value" has validity.valid = $valid', async ({ value, valid }) => {
      const wrapper = shallowMount({
        template: '<input type="email" />'
      })
      const input = wrapper.find('input')

      await input.setValue(value)

      expect(input.element.validity.valid).toBe(valid)
    })

    /* =================== */

    it('shows a computed error message in the template', async () => {
      const wrapper = mount({
        setup() {
          const email = ref('')
          const error = computed(() => {
            if (!email.value) return 'Email is required'
            if (!email.value.includes('@')) return 'Email must contain @'
            return ''
          })
          return { email, error }
        },
        template: `
          <div>
            <input v-model="email" />
            <span v-if="error" class="error">{{ error }}</span>
          </div>
        `
      })

      expect(wrapper.find('.error').text()).toBe('Email is required')

      await wrapper.find('input').setValue('nope')
      expect(wrapper.find('.error').text()).toBe('Email must contain @')

      await wrapper.find('input').setValue('ada@example.com')
      expect(wrapper.find('.error').exists()).toBe(false)
    })
  })

  /* ======================
  Derived UI (counters, toggles, formatting)
  ====================== */

  describe('derived UI', () => {
    //! Needs Fixing
    // it('shows a remaining-characters counter', async () => {
    //   const wrapper = mount({
    //     data() {
    //       return { text: '' }
    //     },
    //     computed: {
    //       remaining(): number {
    //         return 10 - this.text.length
    //       }
    //     },
    //     template: `
    //       <div>
    //         <input v-model="text" maxlength="10" />
    //         <small class="counter">{{ remaining }} left</small>
    //       </div>
    //     `
    //   })

    //   expect(wrapper.find('.counter').text()).toBe('10 left')

    //   await wrapper.find('input').setValue('hello')

    //   expect(wrapper.find('.counter').text()).toBe('5 left')
    // })

    /* =================== */

    it('toggles password visibility by swapping the type', async () => {
      const wrapper = mount({
        data() {
          return { show: false, password: '' }
        },
        template: `
          <div>
            <input :type="show ? 'text' : 'password'" v-model="password" />
            <button type="button" @click="show = !show">Toggle</button>
          </div>
        `
      })
      const input = wrapper.find('input')

      expect(input.attributes('type')).toBe('password')

      await wrapper.find('button').trigger('click')
      expect(input.attributes('type')).toBe('text')

      await wrapper.find('button').trigger('click')
      expect(input.attributes('type')).toBe('password')
    })

    /* =================== */

    it('keeps the typed value when the type changes', async () => {
      const wrapper = mount({
        data() {
          return { show: false, password: '' }
        },
        template: `
          <div>
            <input :type="show ? 'text' : 'password'" v-model="password" />
            <button type="button" @click="show = !show">Toggle</button>
          </div>
        `
      })

      await wrapper.find('input').setValue('secret')
      await wrapper.find('button').trigger('click')

      expect(wrapper.find('input').element.value).toBe('secret')
    })

    /* =================== */

    it('formats input as the user types (uppercase transform)', async () => {
      const wrapper = shallowMount({
        data() {
          return { code: '' }
        },
        template: `<input :value="code" @input="code = $event.target.value.toUpperCase()" />`
      })
      const input = wrapper.find('input')

      await input.setValue('abc')

      expect(wrapper.vm.code).toBe('ABC')
      expect(input.element.value).toBe('ABC')
    })

    /* =================== */

    it('strips non-digits from a numeric-only text field', async () => {
      const wrapper = shallowMount({
        data() {
          return { digits: '' }
        },
        template: `<input :value="digits" @input="digits = $event.target.value.replace(/\\D/g, '')" />`
      })
      const input = wrapper.find('input')

      await input.setValue('a1b2c3')

      expect(wrapper.vm.digits).toBe('123')
      expect(input.element.value).toBe('123')
    })

    /* =================== */

    it('applies conditional classes', async () => {
      const wrapper = shallowMount({
        data() {
          return { text: '' }
        },
        template: `<input v-model="text" :class="{ 'is-empty': !text, 'has-value': text }" />`
      })

      expect(wrapper.classes()).toEqual(['is-empty'])

      await wrapper.find('input').setValue('x')

      expect(wrapper.classes()).toEqual(['has-value'])
    })

    /* =================== */

    it('applies inline styles', () => {
      const wrapper = shallowMount({
        template: '<input style="border-color: red; width: 120px" />'
      })
      const el = wrapper.element as HTMLElement

      expect(el.style.borderColor).toBe('red')
      expect(el.style.width).toBe('120px')
    })
  })

  /* ======================
  Other input types: number, range, date, file
  ====================== */

  describe('number, range, date and file', () => {
    it('type="range" with v-model.number', async () => {
      const wrapper = shallowMount({
        data() {
          return { volume: 50 }
        },
        template: '<input type="range" min="0" max="100" v-model.number="volume" />'
      })
      const input = wrapper.find('input')

      expect(input.element.value).toBe('50')

      await input.setValue('80')

      expect(wrapper.vm.volume).toBe(80)
    })
    /* =================== */

    it('type="date" keeps ISO strings and exposes valueAsDate', async () => {
      const wrapper = shallowMount({
        template: '<input type="date" />'
      })
      const input = wrapper.find('input')

      await input.setValue('2024-05-01')

      expect(input.element.value).toBe('2024-05-01')
      expect(input.element.valueAsDate!.getUTCFullYear()).toBe(2024)
      expect(input.element.valueAsDate!.getUTCMonth()).toBe(4) // months are zero-based
    })
    /* =================== */

    it('type="date" rejects malformed values (sanitization)', async () => {
      const wrapper = shallowMount({
        template: '<input type="date" />'
      })

      await wrapper.setValue('not a date')

      expect((wrapper.element as HTMLInputElement).value).toBe('')
    })

    /* =================== */

    it('type="file": fakes the files list, since setValue cannot', async () => {
      const wrapper = mount({
        setup() {
          const fileName = ref('')
          const onChange = (event: Event) => {
            const files = (event.target as HTMLInputElement).files
            fileName.value = files?.[0]?.name ?? ''
          }
          return { fileName, onChange }
        },
        template: `
          <div>
            <input type="file" @change="onChange" />
            <p class="name">{{ fileName }}</p>
          </div>
        `
      })
      const input = wrapper.find('input')
      const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })

      // jsdom won't let us assign `files` directly, so define it on the element
      Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
      await input.trigger('change')

      expect(wrapper.find('.name').text()).toBe('hello.txt')
    })
  })

  /* ======================
          Forms
  ====================== */

  describe('forms', () => {
    it('emits the model when the form is submitted', async () => {
      const wrapper = mount({
        emits: ['submit'],
        data() {
          return { name: '' }
        },
        // Note: jsdom does not do "press Enter to submit", so we trigger submit directly
        template: `
          <form @submit.prevent="$emit('submit', name)">
            <input name="name" v-model="name" />
            <button type="submit">Send</button>
          </form>
        `
      })

      await wrapper.find('input').setValue('Ada')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.emitted('submit')).toHaveLength(1)
      expect(wrapper.emitted('submit')![0]).toEqual(['Ada'])
    })

    /* =================== */

    it('reads values through the native FormData API', async () => {
      const wrapper = mount({
        template: `
          <form>
            <input name="first" />
            <input name="last" />
          </form>
        `
      })
      const [first, last] = wrapper.findAll('input')

      await first!.setValue('Ada')
      await last!.setValue('Lovelace')

      const data = new FormData(wrapper.find('form').element)
      expect(data.get('first')).toBe('Ada')
      expect(data.get('last')).toBe('Lovelace')
      expect(Object.fromEntries(data)).toEqual({ first: 'Ada', last: 'Lovelace' })
    })

    /* =================== */

    it('does not submit when validation fails (handler guards on the model)', async () => {
      const onSubmit = vi.fn()
      const wrapper = mount({
        setup() {
          const name = ref('')
          const submit = () => {
            if (!name.value.trim()) return
            onSubmit(name.value)
          }
          return { name, submit }
        },
        template: `
          <form @submit.prevent="submit">
            <input v-model="name" />
          </form>
        `
      })

      await wrapper.find('form').trigger('submit')
      expect(onSubmit).not.toHaveBeenCalled()

      await wrapper.find('input').setValue('Ada')
      await wrapper.find('form').trigger('submit')
      expect(onSubmit).toHaveBeenCalledExactlyOnceWith('Ada')
    })
  })

  /* ======================
    Watchers & spies
  ====================== */

  describe('watchers and spies', () => {
    it('calls a watcher with new and old values', async () => {
      const spy = vi.fn()
      const wrapper = shallowMount({
        setup() {
          const text = ref('')
          watch(text, spy)
          return { text }
        },
        template: '<input v-model="text" />'
      })
      const input = wrapper.find('input')

      await input.setValue('a')
      await input.setValue('ab')

      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenNthCalledWith(1, 'a', '', expect.any(Function))
      expect(spy).toHaveBeenNthCalledWith(2, 'ab', 'a', expect.any(Function))
    })
    /* =================== */

    it('spies on HTMLInputElement.prototype.select (select-on-focus)', async () => {
      const selectSpy = vi.spyOn(HTMLInputElement.prototype, 'select').mockImplementation(() => {})
      const wrapper = shallowMount({
        template: '<input value="select me" @focus="$event.target.select()" />'
      })
      await wrapper.trigger('focus')
      expect(selectSpy).toHaveBeenCalledTimes(1)
    })

    /* =================== */

    it('calls an injected tracking function with the right arguments', async () => {
      const track = vi.fn()
      const wrapper = shallowMount(
        {
          props: { track: Function },
          template: `<input @change="track('field_changed', { value: $event.target.value })" />`
        },
        { props: { track } }
      )

      await wrapper.find('input').setValue('new value') // fires input AND change

      expect(track).toHaveBeenCalledOnce()
      expect(track).toHaveBeenCalledWith('field_changed', { value: 'new value' })
    })

    /* =================== */

    it('debounces a search (fake timers)', async () => {
      vi.useFakeTimers()
      const wrapper = shallowMount({
        emits: ['search'],
        setup(_props: object, { emit }: { emit: Emit }) {
          let timer: ReturnType<typeof setTimeout> | undefined
          const onInput = (event: Event) => {
            clearTimeout(timer)
            const value = (event.target as HTMLInputElement).value
            timer = setTimeout(() => emit('search', value), 300)
          }
          return { onInput }
        },
        template: '<input type="search" @input="onInput" />'
      })
      const input = wrapper.find('input')

      await input.setValue('v')
      await input.setValue('vu')
      await input.setValue('vue')
      expect(wrapper.emitted('search')).toBeUndefined() // nothing yet

      vi.advanceTimersByTime(299)
      expect(wrapper.emitted('search')).toBeUndefined() // still waiting

      vi.advanceTimersByTime(1)
      expect(wrapper.emitted('search')).toHaveLength(1) // only ONE emit for 3 keystrokes
      expect(wrapper.emitted('search')![0]).toEqual(['vue'])
    })

    /* =================== */

    it('mocks a global fetch triggered on blur (username check)', async () => {
      const fetchMock = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify({ available: false })))
      const wrapper = mount({
        setup() {
          const username = ref('')
          const message = ref('')
          const check = async () => {
            const res = await fetch(`/api/users/${username.value}`)
            const data = await res.json()
            message.value = data.available ? 'Available' : 'Taken'
          }
          return { username, message, check }
        },
        template: `
          <div>
            <input v-model="username" @blur="check" />
            <p class="msg">{{ message }}</p>
          </div>
        `
      })
      await wrapper.find('input').setValue('ada')
      await wrapper.find('input').trigger('blur')
      await vi.waitFor(() => expect(wrapper.find('.msg').text()).toBe('Taken'))
      expect(fetchMock).toHaveBeenCalledWith('/api/users/ada')
    })

    /* =================== */

    it('handles a rejected fetch', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network down'))
      const wrapper = mount({
        setup() {
          const message = ref('')
          const check = async () => {
            try {
              await fetch('/api/users/ada')
            } catch {
              message.value = 'Could not check'
            }
          }
          return { message, check }
        },
        template: `
          <div>
            <input @blur="check" />
            <p class="msg">{{ message }}</p>
          </div>
        `
      })
      await wrapper.find('input').trigger('blur')
      await vi.waitFor(() => expect(wrapper.find('.msg').text()).toBe('Could not check'))
    })
  })

  /* ======================
  Global mounting options (mocks, provide, directives)
  ====================== */

  describe('global mounting options', () => {
    it('mocks $t for an i18n placeholder', () => {
      const $t = vi.fn((key: string) => `translated:${key}`)
      const wrapper = shallowMount(
        { template: `<input :placeholder="$t('email.placeholder')" />` },
        { global: { mocks: { $t } } }
      )

      expect(wrapper.attributes('placeholder')).toBe('translated:email.placeholder')
      expect($t).toHaveBeenCalledWith('email.placeholder')
    })

    /* =================== */

    it('provides a value that the component injects', () => {
      const wrapper = shallowMount(
        {
          inject: ['formId'],
          template: '<input :id="`${formId}-email`" />'
        },
        { global: { provide: { formId: 'signup' } } }
      )

      expect(wrapper.attributes('id')).toBe('signup-email')
    })

    /* =================== */

    it('registers a custom directive (v-focus) and spies on it', () => {
      const focusDirective = {
        mounted: vi.fn((el: HTMLElement) => el.focus())
      }
      const wrapper = mount(
        { template: '<input v-focus />' },
        {
          attachTo: document.body,
          global: { directives: { focus: focusDirective } }
        }
      )

      expect(focusDirective.mounted).toHaveBeenCalledTimes(1)
      expect(focusDirective.mounted.mock.calls[0]![0]).toBe(wrapper.element)
      expect(document.activeElement).toBe(wrapper.element)

      wrapper.unmount()
    })
  })

  /* ======================
      Finding & querying
  ====================== */

  describe('finding inputs in a larger template', () => {
    it('finds all inputs', () => {
      const wrapper = mount({
        template: `
          <form>
            <input type="text" name="first" />
            <input type="email" name="email" />
            <input type="password" name="password" />
          </form>
        `
      })

      expect(wrapper.findAll('input')).toHaveLength(3)
    })

    /* =================== */

    it('finds by attribute selector', () => {
      const wrapper = mount({
        template: `
          <form>
            <input type="text" name="first" />
            <input type="email" name="email" />
            <input type="password" name="password" />
          </form>
        `
      })

      expect(wrapper.find('input[name="email"]').attributes('type')).toBe('email')
      expect(wrapper.find('input[type="password"]').attributes('name')).toBe('password')
    })

    /* =================== */

    it('finds by a data-testid', () => {
      const wrapper = mount({
        template: `
          <form>
            <input data-testid="first" />
            <input data-testid="last" />
          </form>
        `
      })

      expect(wrapper.find('[data-testid="last"]').exists()).toBe(true)
    })

    /* =================== */

    it('get() throws for missing elements; find() does not', () => {
      const wrapper = mount({
        template: '<form><input /></form>'
      })

      expect(wrapper.find('textarea').exists()).toBe(false)
      expect(() => wrapper.get('textarea')).toThrow()
    })

    /* =================== */

    it('maps over inputs to assert on all names at once', () => {
      const wrapper = mount({
        template: `
          <form>
            <input name="first" />
            <input name="last" />
            <input name="email" />
          </form>
        `
      })

      const names = wrapper.findAll('input').map((i) => i.attributes('name'))
      expect(names).toEqual(['first', 'last', 'email'])
    })

    /* =================== */

    it('renders a list of inputs with v-for and edits one of them', async () => {
      const wrapper = mount({
        data() {
          return { tags: ['vue', 'vitest', 'jsdom'] }
        },
        template: `
          <ul>
            <li v-for="(tag, i) in tags" :key="i">
              <input v-model="tags[i]" />
            </li>
          </ul>
        `
      })
      const inputs = wrapper.findAll<HTMLInputElement>('li input')

      expect(inputs).toHaveLength(3)
      expect(inputs.map((i) => i.element.value)).toEqual(['vue', 'vitest', 'jsdom'])

      await inputs[1]!.setValue('vue-test-utils')

      expect(wrapper.vm.tags).toEqual(['vue', 'vue-test-utils', 'jsdom'])
    })

    /* =================== */

    it('adds and removes inputs dynamically', async () => {
      const wrapper = mount({
        data() {
          return { emails: [''] }
        },
        template: `
          <div>
            <input v-for="(email, i) in emails" :key="i" v-model="emails[i]" />
            <button class="add" type="button" @click="emails.push('')">Add</button>
            <button class="remove" type="button" @click="emails.pop()">Remove</button>
          </div>
        `
      })
      expect(wrapper.findAll('input')).toHaveLength(1)

      await wrapper.find('.add').trigger('click')
      await wrapper.find('.add').trigger('click')
      expect(wrapper.findAll('input')).toHaveLength(3)

      await wrapper.find('.remove').trigger('click')
      expect(wrapper.findAll('input')).toHaveLength(2)
    })
  })

  /* ======================
  Conditional rendering (v-if / v-show)
  ====================== */

  describe('conditional rendering', () => {
    it('shows an extra input only when a checkbox is ticked (v-if)', async () => {
      const wrapper = mount({
        data() {
          return { hasNickname: false }
        },
        template: `
          <div>
            <input type="checkbox" class="toggle" v-model="hasNickname" />
            <input v-if="hasNickname" class="nickname" />
          </div>
        `
      })

      expect(wrapper.find('.nickname').exists()).toBe(false)

      await wrapper.find('.toggle').setValue(true)
      expect(wrapper.find('.nickname').exists()).toBe(true)

      await wrapper.find('.toggle').setValue(false)
      expect(wrapper.find('.nickname').exists()).toBe(false)
    })

    /* =================== */

    it('hides an input with v-show (still in the DOM)', async () => {
      const wrapper = mount(
        {
          props: { visible: Boolean },
          template: '<div><input v-show="visible" /></div>'
        },
        {
          props: { visible: false },
          attachTo: document.body // isVisible() needs the element in the document
        }
      )

      expect(wrapper.find('input').exists()).toBe(true)
      expect(wrapper.find('input').isVisible()).toBe(false)

      await wrapper.setProps({ visible: true })
      expect(wrapper.find('input').isVisible()).toBe(true)

      wrapper.unmount()
    })

    /* =================== */

    it('v-if recreates the input, so typed text is lost', async () => {
      const wrapper = mount({
        data() {
          return { show: true }
        },
        template: `
          <div>
            <input v-if="show" />
            <button type="button" @click="show = !show">Toggle</button>
          </div>
        `
      })

      await wrapper.find('input').setValue('gone soon')
      await wrapper.find('button').trigger('click') // hide
      await wrapper.find('button').trigger('click') // show again

      expect(wrapper.find('input').element.value).toBe('')
    })
  })

  /* ======================
        Accessibility
  ====================== */

  describe('accessibility', () => {
    it('associates a <label> with an input via for / id', () => {
      const wrapper = mount({
        template: `
          <div>
            <label for="email">Email</label>
            <input id="email" type="email" />
          </div>
        `
      })

      expect(wrapper.find('label').attributes('for')).toBe(wrapper.find('input').attributes('id'))
      expect(wrapper.find('label').text()).toBe('Email')
    })

    /* =================== */

    it('supports an implicit label that wraps the input', () => {
      const wrapper = mount({
        template: '<label>Email <input type="email" /></label>'
      })

      expect(wrapper.find('label input').exists()).toBe(true)
      expect(wrapper.find('label').text()).toBe('Email')
    })

    /* =================== */

    it('has an accessible name (label text or aria-label)', () => {
      const wrapper = shallowMount({
        template: '<input type="search" aria-label="Search the docs" />'
      })

      expect(wrapper.attributes('aria-label')).toBeTruthy()
    })

    /* =================== */

    it('sets aria-invalid and aria-describedby when there is an error', async () => {
      const wrapper = mount(
        {
          props: { error: String },
          template: `
            <div>
              <input
                aria-describedby="email-error"
                :aria-invalid="error ? 'true' : undefined"
              />
              <span v-if="error" id="email-error" role="alert">{{ error }}</span>
            </div>
          `
        },
        { props: { error: '' } }
      )
      const input = wrapper.find('input')

      expect(input.attributes('aria-invalid')).toBeUndefined()
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)

      await wrapper.setProps({ error: 'Invalid email' })

      expect(input.attributes('aria-invalid')).toBe('true')
      expect(wrapper.find('[role="alert"]').text()).toBe('Invalid email')
      expect(wrapper.find('[role="alert"]').attributes('id')).toBe(
        input.attributes('aria-describedby')
      )
    })

    /* =================== */

    it('marks required fields with both required and aria-required', () => {
      const wrapper = shallowMount({
        template: '<input required aria-required="true" />'
      })

      expect(wrapper.attributes('required')).toBe('')
      expect(wrapper.attributes('aria-required')).toBe('true')
    })

    /* =================== */

    it('supports autocomplete hints', () => {
      const wrapper = shallowMount({
        template: '<input type="email" autocomplete="email" />'
      })

      expect(wrapper.attributes('autocomplete')).toBe('email')
    })
  })

  /* ======================
        Lifecycle
  ====================== */

  describe('lifecycle', () => {
    it('removes the element from the DOM on unmount', () => {
      const wrapper = mount({ template: '<input id="unmount-me" />' }, { attachTo: document.body })
      expect(document.querySelector('#unmount-me')).not.toBeNull()

      wrapper.unmount()

      expect(document.querySelector('#unmount-me')).toBeNull()
    })

    /* =================== */

    it('runs mounted / unmounted hooks', () => {
      const mounted = vi.fn()
      const unmounted = vi.fn()
      const wrapper = mount({
        mounted,
        unmounted,
        template: '<input />'
      })

      expect(mounted).toHaveBeenCalledTimes(1)
      expect(unmounted).not.toHaveBeenCalled()

      wrapper.unmount()
      expect(unmounted).toHaveBeenCalledTimes(1)
    })

    /* =================== */

    // import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

    it('cleans up a document-level listener on unmount', () => {
      const addSpy = vi.spyOn(document, 'addEventListener')
      const removeSpy = vi.spyOn(document, 'removeEventListener')
      const wrapper = mount({
        setup() {
          const onKey = () => {}
          onMounted(() => document.addEventListener('keydown', onKey))
          onUnmounted(() => document.removeEventListener('keydown', onKey))
          return { onKey }
        },
        template: '<input />'
      })

      expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function))

      wrapper.unmount()

      expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })
  })

  /* ======================
        Snapshots
  ====================== */

  describe('snapshots', () => {
    it('matches an inline snapshot', () => {
      const wrapper = shallowMount({
        template: '<input type="email" name="email" placeholder="you@example.com" required />'
      })

      expect(wrapper.html()).toMatchInlineSnapshot(
        `"<input type="email" name="email" placeholder="you@example.com" required="">"`
      )
    })
  })

  /* ======================
      Not written yet
  ====================== */

  // it.todo shows up in the test report as a reminder, without failing
  it.todo('supports the datalist / list attribute for suggestions')
  it.todo('supports the paste event')
})
