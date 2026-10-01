// https://vitest.dev/guide/mocking

// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './index.vue' // <-- adjust to wherever your Button lives
import { cn } from '@/utils/cn'

///////////////////////////////////////////////////////////////////////////
//
//  vi.mock: replacing a whole module
//
//
//  The `vi.mock(path, factory)` swaps a module for the object returned by `factory`
//  for EVERY file that imports it (including Button.vue).
//
//  ⚠️ IMPORTANT: vi.mock calls are HOISTED by Vitest to the very top of the file,
//  before any imports run. That's why the mock is already in place when
//  the `Button.vue` imports `@/utils/cn`. It also means you can't reference normal
//  variables declared in this file inside the factory (use `vi.hoisted` if you
//  need that).
//
//  Here we do a "partial / wrapped" mock: `importOriginal` gives us the real
//  module, and we wrap the real `cn` in `vi.fn(...)`. By default it behaves
//  exactly like the real thing, but now it is a spy-able mock function that we
//  can inspect (`toHaveBeenCalledWith`) or temporarily override
//  (`mockReturnValueOnce`).

// See here for more info:
// https://vitest.dev/guide/mocking/modules
//
///////////////////////////////////////////////////////////////////////////

vi.mock('@/utils/cn', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/cn')>()
  return {
    ...actual,
    cn: vi.fn(actual.cn)
  }
})

/* ========================================================================

======================================================================== */

describe('Button mocking demos', () => {
  beforeEach(() => {
    // Wipes `.mock.calls` / `.mock.results` on every mock, but KEEPS the
    // implementations. This matters because `cn` is a module-level mock that
    // is shared between tests: without this, call counts would leak from one
    // test to the next.
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Restores every `vi.spyOn` spy back to its original implementation.
    // (Note: in Vitest v3+, this does NOT touch plain `vi.fn()` mocks.)
    vi.restoreAllMocks()
  })

  /* ========================================================================
                      vi.fn  —  a standalone mock function
  ======================================================================== */
  // The `vi.fn()` creates a blank function that records how it was called.
  // It has no link to any existing code; you create it and hand it to
  // something else (a prop, a callback, an event listener, ...).

  describe('vi.fn', () => {
    it('records calls made to a handler passed as an attribute', async () => {
      const onClick = vi.fn()

      // Button doesn't declare an `onClick` prop, so Vue "falls through" the
      // attribute onto the root <button>, where it becomes a native listener.
      const wrapper = mount(Button, { attrs: { onClick } })

      expect(onClick).not.toHaveBeenCalled()

      await wrapper.trigger('click')
      await wrapper.trigger('click')

      expect(onClick).toHaveBeenCalledTimes(2)

      // The handler receives the native MouseEvent.
      expect(onClick.mock.calls[0]![0]).toBeInstanceOf(MouseEvent)
    })

    it('can have a fake implementation and return value', async () => {
      // You can give vi.fn an implementation up front...
      const handler = vi.fn((event: MouseEvent) => `clicked: ${event.type}`)

      const wrapper = mount(Button, { attrs: { onClick: handler } })
      await wrapper.trigger('click')

      // The `mock.results` stores what each call returned (or threw).
      expect(handler.mock.results[0]).toEqual({
        type: 'return',
        value: 'clicked: click'
      })

      // ...or change it later. `*Once` variants only affect the next call,
      // after which the function falls back to its default behaviour.
      handler.mockReturnValueOnce('first call only')
      expect(handler({} as MouseEvent)).toBe('first call only')
      expect(handler({ type: 'x' } as MouseEvent)).toBe('clicked: x')
    })
  })

  /* ========================================================================
      vi.spyOn  —  watching (and optionally replacing) an EXISTING method
  ======================================================================== */
  // The `vi.spyOn(object, 'methodName')` wraps a method that already exists on an
  // object. By default it CALLS THROUGH to the original implementation while
  // recording calls. You can also override it with `.mockImplementation` /
  // `.mockReturnValue`, and undo that with `.mockRestore()`
  // (or `vi.restoreAllMocks()`, as we do in afterEach).

  describe('vi.spyOn', () => {
    it('spies on a real DOM method and still calls the original', () => {
      const wrapper = mount(Button)

      // The `wrapper.element` is a real HTMLButtonElement, so we can spy on it.
      const clickSpy = vi.spyOn(wrapper.element as HTMLButtonElement, 'click')

      const listener = vi.fn()
      wrapper.element.addEventListener('click', listener)

      // Calling the real .click() dispatches a real click event. Because the
      // spy calls through, our listener still fires.
      ;(wrapper.element as HTMLButtonElement).click()

      expect(clickSpy).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('can replace a method so the original is NOT run', () => {
      const wrapper = mount(Button)
      const el = wrapper.element as HTMLButtonElement

      const listener = vi.fn()
      el.addEventListener('click', listener)

      // Overriding with an empty implementation turns .click() into a no-op.
      const clickSpy = vi.spyOn(el, 'click').mockImplementation(() => {})

      el.click()

      expect(clickSpy).toHaveBeenCalledTimes(1)
      expect(listener).not.toHaveBeenCalled() // original never ran

      // Put the original back; now .click() really dispatches the event.
      clickSpy.mockRestore()
      el.click()
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('can freeze global behaviour such as Date.now', async () => {
      // Classic use case: make something non-deterministic predictable.
      vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)

      let clickedAt = 0
      const wrapper = mount(Button, {
        attrs: {
          onClick: () => {
            clickedAt = Date.now()
          }
        }
      })

      await wrapper.trigger('click')

      expect(clickedAt).toBe(1_700_000_000_000)
    })
  })

  /* ========================================================================
    vi.mock (in use)  —  asserting on / overriding the mocked `cn` module
  ======================================================================== */
  // Because of the vi.mock at the top of the file, the `cn` imported here is
  // the SAME vi.fn that Button.vue uses internally. `vi.mocked(cn)` is just a
  // TypeScript helper that gives it proper mock typings.

  describe('vi.mock', () => {
    it('lets us verify how the component called the mocked module', () => {
      mount(Button, { props: { class: 'my-extra-class' } })

      expect(vi.mocked(cn)).toHaveBeenCalledTimes(1)

      // Button.vue calls cn(baseClasses, props.class)
      expect(vi.mocked(cn)).toHaveBeenCalledWith(
        expect.stringContaining('inline-flex'),
        'my-extra-class'
      )
    })

    it('still produces real output because we wrapped the original', () => {
      const wrapper = mount(Button, { props: { class: 'my-extra-class' } })

      // The wrapped real `cn` ran, so the class really is applied.
      expect(wrapper.classes()).toContain('my-extra-class')
      expect(wrapper.classes()).toContain('inline-flex')
    })

    it('can override the mocked module for a single call', () => {
      // `*Once` so the override doesn't leak into later tests.
      vi.mocked(cn).mockReturnValueOnce('totally-fake-class')

      const wrapper = mount(Button)

      // Button's real Tailwind classes are gone; only our fake remains.
      expect(wrapper.classes()).toEqual(['totally-fake-class'])
      expect(wrapper.classes()).not.toContain('inline-flex')
    })
  })
})
