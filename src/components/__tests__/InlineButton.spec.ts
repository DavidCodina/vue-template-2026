// https://vitest.dev/guide/mocking
// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  // mount,
  shallowMount
} from '@vue/test-utils'
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
//
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

describe('Inline HTML Demos', () => {
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

  /* ======================
  Sanity check: the inline template approach
  ====================== */

  it('renders a <button> element from an inline template', () => {
    const wrapper = shallowMount({
      template: '<button>Click Me</button>'
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.text()).toBe('Click Me')
  })

  /* ========================================================================
                      vi.fn  —  a standalone mock function
  ======================================================================== */
  // The `vi.fn()` creates a blank function that records how it was called.
  // It has no link to any existing code; you create it and hand it to
  // something else (a prop, a callback, an event listener, ...).

  describe('vi.fn', () => {
    it('records calls made to a handler bound in the template', async () => {
      const onClick = vi.fn()

      const wrapper = shallowMount({
        template: '<button @click="onClick">Click Me</button>',
        // Expose our mock to the template.
        setup: () => ({ onClick })
      })

      expect(onClick).not.toHaveBeenCalled()

      await wrapper.trigger('click')
      await wrapper.trigger('click')

      expect(onClick).toHaveBeenCalledTimes(2)

      // The handler receives the native MouseEvent.
      expect(onClick.mock.calls[0]![0]).toBeInstanceOf(MouseEvent)
    })

    /* =================== */

    it('can have a fake implementation and return value', async () => {
      // You can give vi.fn an implementation up front...
      const handler = vi.fn((event: MouseEvent) => `clicked: ${event.type}`)

      const wrapper = shallowMount({
        template: '<button @click="handler">Click Me</button>',
        setup: () => ({ handler })
      })
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
      const wrapper = shallowMount({ template: '<button>Click Me</button>' })
      const el = wrapper.element as HTMLButtonElement

      const clickSpy = vi.spyOn(el, 'click')

      const listener = vi.fn()
      el.addEventListener('click', listener)

      // The real .click() dispatches a real click event. Because the spy
      // calls through, our listener still fires.
      el.click()

      expect(clickSpy).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledTimes(1)
    })

    /* =================== */

    it('can replace a method so the original is NOT run', () => {
      const wrapper = shallowMount({ template: '<button>Click Me</button>' })
      const el = wrapper.element as HTMLButtonElement

      const listener = vi.fn()
      el.addEventListener('click', listener)

      // An empty implementation turns .click() into a no-op.
      const clickSpy = vi.spyOn(el, 'click').mockImplementation(() => {})

      el.click()

      expect(clickSpy).toHaveBeenCalledTimes(1)
      expect(listener).not.toHaveBeenCalled() // original never ran

      // Put the original back; now .click() really dispatches the event.
      clickSpy.mockRestore()
      el.click()
      expect(listener).toHaveBeenCalledTimes(1)
    })

    /* =================== */

    it('can freeze global behaviour such as Date.now', async () => {
      // Classic use case: make something non-deterministic predictable.
      vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)

      let clickedAt = 0

      const wrapper = shallowMount({
        template: '<button @click="onClick">Click Me</button>',
        setup: () => ({
          onClick: () => {
            clickedAt = Date.now()
          }
        })
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
    // A tiny inline stand-in that uses `cn` the same way Button.vue does.
    const makeButton = (extraClass?: string) =>
      shallowMount({
        template: `<button :class="cn('inline-flex px-2', extraClass)">Click Me</button>`,
        setup: () => ({ cn, extraClass })
      })

    /* =================== */

    it('lets us verify how the mocked module was called', () => {
      makeButton('my-extra-class')

      expect(vi.mocked(cn)).toHaveBeenCalledTimes(1)
      expect(vi.mocked(cn)).toHaveBeenCalledWith('inline-flex px-2', 'my-extra-class')
    })

    /* =================== */

    it('still produces real output because we wrapped the original', () => {
      const wrapper = makeButton('my-extra-class')

      expect(wrapper.classes()).toContain('inline-flex')
      expect(wrapper.classes()).toContain('my-extra-class')
    })

    /* =================== */

    it('can override the mocked module for a single call', () => {
      // `*Once` so the override doesn't leak into later tests.
      vi.mocked(cn).mockReturnValueOnce('totally-fake-class')

      const wrapper = makeButton()

      expect(wrapper.classes()).toEqual(['totally-fake-class'])
      expect(wrapper.classes()).not.toContain('inline-flex')
    })
  })
})
