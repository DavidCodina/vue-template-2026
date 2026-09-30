// import { describe, it, expect, vi } from 'vitest'
import {
  // mount,  // No need for full mount here.

  shallowMount
} from '@vue/test-utils'
import Select from './index.vue'

const getSelect = (wrapper: ReturnType<typeof shallowMount>) =>
  wrapper.find('select').element as HTMLSelectElement

const optionsProp = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' }
]

/* ========================================================================

======================================================================== */

describe('Select', () => {
  it('renders a <select> element internally', () => {
    const wrapper = shallowMount(Select)
    expect(wrapper.html()).toContain('<select')
  })

  /* ======================
        Placeholder
  ====================== */

  it("does NOT have default placeholder text of 'Select an option'", () => {
    const wrapper = shallowMount(Select)
    expect(wrapper.text()).not.toBe('Select an option')
    expect(wrapper.text()).toBe('')
  })

  /* =================== */

  it('has placeholder option with correct text and attributes', () => {
    const placeholder = 'Select something...'
    const wrapper = shallowMount(Select, {
      props: {
        options: optionsProp,
        placeholder: placeholder
      }
    })

    const placeholderOption = wrapper.find('option[value=""]')
    expect(placeholderOption.exists()).toBe(true)
    expect(placeholderOption.text()).toBe(placeholder)
    expect(placeholderOption.attributes('disabled')).toBeDefined()
    expect(placeholderOption.attributes('hidden')).toBeDefined()
  })

  /* =================== */

  it('displays placholder text when no value is selected', () => {
    const placeholder = 'Select something...'
    const wrapper = shallowMount(Select, {
      props: {
        options: optionsProp,
        placeholder: placeholder
      }
    })

    ///////////////////////////////////////////////////////////////////////////
    //
    // If you do this:
    //
    //    // ❌ expect(wrapper.text()).toBe(placeholder)
    //
    // You'll get a failed test:
    //
    //   AssertionError: expected 'Select something...AppleBananaCherry' to be 'Select something...' // Object.is equality
    //   Expected: "Select something..."
    //   Received: "Select something...AppleBananaCherry"
    //
    // This happens because wrapper.text() returns the text content of the whole component, which
    // includes the placeholder <option> and all the real options. You need to target just the
    // placeholder option.
    //
    ///////////////////////////////////////////////////////////////////////////

    const select = wrapper.find('select').element as HTMLSelectElement

    // What the browser would show in the closed select
    expect(select.selectedOptions[0]?.text).toBe(placeholder)
    expect(select.selectedOptions[0]?.text).not.toBe('')

    // Supporting assertions
    expect(select.value).toBe('')
    expect(select.selectedIndex).toBe(0)
  })

  /* =================== */

  it('omits the placeholder option when placeholder is an empty string', () => {
    const wrapper = shallowMount(Select, { props: { options: optionsProp, placeholder: '' } })

    expect(wrapper.find('option[value=""]').exists()).toBe(false)
    expect(wrapper.findAll('option')).toHaveLength(optionsProp.length)
  })

  /* ======================
          Options
  ====================== */

  it('has the correct options', () => {
    const wrapper = shallowMount(Select, {
      props: {
        options: optionsProp
      }
    })

    // If we had a placeholder then do this:
    // const options = wrapper.findAll('option:not([value=""])')
    const options = wrapper.findAll('option')

    // Here is the manual approach:
    expect(options).toHaveLength(3)
    expect(options[0]?.text()).toBe('Apple')
    expect(options[0]?.element.value).toBe('apple')
    expect(options[1]?.text()).toBe('Banana')
    expect(options[1]?.element.value).toBe('banana')
    expect(options[2]?.text()).toBe('Cherry')
    expect(options[2]?.element.value).toBe('cherry')

    // Here is the iterative approach:
    expect(options).toHaveLength(optionsProp.length)
    optionsProp.forEach((expected, i) => {
      expect(options[i]?.text()).toBe(expected.label)
      expect(options[i]?.element.value).toBe(expected.value)
    })
  })

  /* =================== */

  it('renders a disabled option when option.disabled is true', () => {
    const wrapper = shallowMount(Select, {
      props: {
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true }
        ]
      }
    })

    expect(wrapper.find('option[value="a"]').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('option[value="b"]').attributes('disabled')).toBeDefined()
  })

  /* ======================
          v-model
  ====================== */

  it('selects the option matching modelValue', () => {
    const wrapper = shallowMount(Select, { props: { options: optionsProp, modelValue: 'banana' } })
    const select = getSelect(wrapper)

    expect(select.value).toBe('banana')
    expect(select.selectedOptions[0]?.text).toBe('Banana')
  })

  /* =================== */

  it('emits update:modelValue when the user picks an option', async () => {
    const wrapper = shallowMount(Select, { props: { options: optionsProp } })

    await wrapper.find('select').setValue('cherry')

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['cherry'])
  })

  /* =================== */

  it('falls back to selectProps.value when modelValue is not provided', () => {
    const wrapper = shallowMount(Select, {
      props: { options: optionsProp, selectProps: { value: 'apple' } }
    })

    expect(getSelect(wrapper).value).toBe('apple')
  })

  /* =================== */

  it('prefers modelValue over selectProps.value', () => {
    const wrapper = shallowMount(Select, {
      props: { options: optionsProp, modelValue: 'cherry', selectProps: { value: 'apple' } }
    })

    expect(getSelect(wrapper).value).toBe('cherry')
  })

  /* =================== */

  it('calls selectProps.onChange AND emits update:modelValue', async () => {
    const onChange = vi.fn()
    const wrapper = shallowMount(Select, {
      props: { options: optionsProp, selectProps: { onChange } }
    })

    await wrapper.find('select').setValue('banana')

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
  })

  /* ======================
        Validation state
  ====================== */

  it.each([
    { invalid: true, invalidAttr: true, validAttr: false },
    { invalid: false, invalidAttr: false, validAttr: true },
    { invalid: undefined, invalidAttr: false, validAttr: false }
  ])(
    'sets data attributes correctly when invalid is $invalid',
    ({ invalid, invalidAttr, validAttr }) => {
      const wrapper = shallowMount(Select, { props: { options: optionsProp, invalid } })
      const select = wrapper.find('select')

      expect(select.attributes('data-invalid') !== undefined).toBe(invalidAttr)
      expect(select.attributes('data-valid') !== undefined).toBe(validAttr)
    }
  )

  /* ======================
      Props bag / classes
  ====================== */

  it('forwards selectProps (e.g. disabled, name) to the <select>', () => {
    const wrapper = shallowMount(Select, {
      props: { options: optionsProp, selectProps: { disabled: true, name: 'fruit' } }
    })
    const select = getSelect(wrapper)

    expect(select.disabled).toBe(true)
    expect(select).toHaveProperty('disabled', true) // Aternative to above
    expect(select.name).toBe('fruit')
  })

  /* =================== */

  it('applies groupProps to the wrapper <div>, not the <select>', () => {
    const wrapper = shallowMount(Select, {
      props: { options: optionsProp, groupProps: { id: 'my-group', class: 'my-group-class' } }
    })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.attributes('id')).toBe('my-group')
    expect(wrapper.classes()).toContain('my-group-class')
    expect(wrapper.find('select').attributes('id')).toBeUndefined()
  })

  /* =================== */

  it('applies selectProps.class to the <select> exactly once', () => {
    const wrapper = shallowMount(Select, {
      props: { options: optionsProp, selectProps: { class: 'custom-select' } }
    })
    const classes = wrapper.find('select').classes()

    expect(classes.filter((c) => c === 'custom-select')).toHaveLength(1)
  })

  /* =================== */

  it('shows muted/italic styling only while no value is selected', () => {
    const empty = shallowMount(Select, { props: { options: optionsProp } })
    const filled = shallowMount(Select, { props: { options: optionsProp, modelValue: 'apple' } })

    expect(empty.find('select').classes()).toEqual(expect.arrayContaining(['text-muted', 'italic']))
    expect(filled.find('select').classes()).not.toContain('text-muted')
    expect(filled.find('select').classes()).not.toContain('italic')
  })

  /* ======================
    Attribute fallthrough
  ====================== */

  it('does not let fallthrough attributes land on the root <div>', () => {
    const wrapper = shallowMount(Select, {
      props: { options: optionsProp },
      attrs: { 'data-testid': 'should-not-fall-through' }
    })

    expect(wrapper.attributes('data-testid')).toBeUndefined()
    expect(wrapper.find('select').attributes('data-testid')).toBeUndefined()
  })

  /* ======================
          Expose
  ====================== */

  it('exposes the internal select element as selectRef', () => {
    const wrapper = shallowMount(Select, { props: { options: optionsProp } })

    expect(wrapper.vm.selectRef).toBeInstanceOf(HTMLSelectElement)
    expect(wrapper.vm.selectRef).toBe(wrapper.find('select').element)
  })
})
