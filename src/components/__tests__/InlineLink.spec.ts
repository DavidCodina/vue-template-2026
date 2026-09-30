// https://vitest.dev/guide/mocking
// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { computed, ref } from 'vue'
import { mount, shallowMount, RouterLinkStub } from '@vue/test-utils'

/* ========================================================================

======================================================================== */

describe('Inline <a> Demos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  /* ======================
  Sanity check: the inline template approach
  ====================== */

  it('renders a <a> element from an inline template', () => {
    const wrapper = shallowMount({
      template: '<a>Go To Google</a>'
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.text()).toBe('Go To Google')
  })

  /* ======================
          Attributes
  ====================== */

  describe('attributes', () => {
    it('reads static attributes from an inline template', () => {
      const wrapper = shallowMount({
        template: '<a href="https://google.com" title="Search">Google</a>'
      })

      // attributes() with no argument returns an object of all attributes
      expect(wrapper.attributes()).toEqual({
        href: 'https://google.com',
        title: 'Search'
      })

      // attributes('name') returns a single value
      expect(wrapper.attributes('href')).toBe('https://google.com')
      expect(wrapper.attributes('title')).toBe('Search')
    })

    /* =================== */

    it('returns undefined for attributes that are not set', () => {
      const wrapper = shallowMount({
        template: '<a href="/about">About</a>'
      })

      expect(wrapper.attributes('target')).toBeUndefined()
      expect(wrapper.attributes('rel')).toBeUndefined()
      // Another way: check the DOM API directly
      expect(wrapper.element.hasAttribute('target')).toBe(false)
    })

    it('passes fallthrough attrs (id, data-*, aria-*) to the root <a>', () => {
      const wrapper = shallowMount(
        {
          template: '<a href="/about">About</a>'
        },
        {
          attrs: {
            id: 'about-link',
            'data-testid': 'about',
            'aria-label': 'About us'
          }
        }
      )

      expect(wrapper.attributes('id')).toBe('about-link')
      expect(wrapper.attributes('data-testid')).toBe('about')
      expect(wrapper.attributes('aria-label')).toBe('About us')
    })

    /* =================== */

    it('binds attributes dynamically from props', () => {
      const wrapper = shallowMount(
        {
          props: { url: String, tooltip: String },
          template: '<a :href="url" :title="tooltip">Link</a>'
        },
        { props: { url: '/pricing', tooltip: 'See our pricing' } }
      )

      expect(wrapper.attributes('href')).toBe('/pricing')
      expect(wrapper.attributes('title')).toBe('See our pricing')
    })

    /* =================== */

    it('omits an attribute entirely when bound to undefined', () => {
      const wrapper = shallowMount({
        template: '<a href="/about" :target="undefined">About</a>'
      })

      expect(wrapper.element.hasAttribute('target')).toBe(false)
    })

    /* =================== */

    it('distinguishes the href attribute from the .href DOM property', () => {
      const wrapper = shallowMount({
        template: '<a href="/about">About</a>'
      })
      const anchor = wrapper.element as HTMLAnchorElement

      // attribute = exactly what you wrote
      expect(wrapper.attributes('href')).toBe('/about')
      // property = resolved against the document's base URL
      expect(anchor.href).toMatch(/^http:\/\/localhost(:\d+)?\/about$/)
      expect(anchor.pathname).toBe('/about')
    })

    /* =================== */

    it('parses the pieces of a URL via DOM properties', () => {
      const wrapper = shallowMount({
        template: '<a href="https://example.com:8080/docs/intro?lang=en#setup">Docs</a>'
      })
      const anchor = wrapper.element as HTMLAnchorElement

      expect(anchor.protocol).toBe('https:')
      expect(anchor.hostname).toBe('example.com')
      expect(anchor.port).toBe('8080')
      expect(anchor.pathname).toBe('/docs/intro')
      expect(anchor.search).toBe('?lang=en')
      expect(anchor.hash).toBe('#setup')
    })
  })

  /* ======================
  Props -> attributes (external links)
  ====================== */

  describe('external links', () => {
    it('adds target="_blank" and a safe rel when external', () => {
      const wrapper = shallowMount(
        {
          props: { href: String, external: Boolean },
          template: `
            <a
              :href="href"
              :target="external ? '_blank' : undefined"
              :rel="external ? 'noopener noreferrer' : undefined"
            >Link</a>
          `
        },
        { props: { href: 'https://example.com', external: true } }
      )

      expect(wrapper.attributes('target')).toBe('_blank')
      expect(wrapper.attributes('rel')).toBe('noopener noreferrer')
    })

    /* =================== */

    it('has no target/rel when internal', () => {
      const wrapper = shallowMount(
        {
          props: { href: String, external: Boolean },
          template: `
            <a
              :href="href"
              :target="external ? '_blank' : undefined"
              :rel="external ? 'noopener noreferrer' : undefined"
            >Link</a>
          `
        },
        { props: { href: '/contact', external: false } }
      )

      expect(wrapper.attributes('target')).toBeUndefined()
      expect(wrapper.attributes('rel')).toBeUndefined()
    })

    /* =================== */

    it('tokenizes rel so order does not matter', () => {
      const wrapper = shallowMount({
        template: '<a href="https://example.com" target="_blank" rel="noreferrer noopener">Link</a>'
      })

      const rel = wrapper.attributes('rel')!.split(' ')
      expect(rel).toContain('noopener')
      expect(rel).toContain('noreferrer')
    })
  })

  /* ======================
    Reactivity: setProps
  ====================== */

  describe('reactivity', () => {
    it('updates the DOM when props change', async () => {
      const wrapper = shallowMount(
        {
          props: { href: String },
          template: '<a :href="href">Link</a>'
        },
        { props: { href: '/one' } }
      )
      expect(wrapper.attributes('href')).toBe('/one')

      // setProps returns a promise that resolves after the DOM updates
      await wrapper.setProps({ href: '/two' })
      expect(wrapper.attributes('href')).toBe('/two')
    })

    /* =================== */

    it('toggles target when a boolean prop flips', async () => {
      const wrapper = shallowMount(
        {
          props: { external: Boolean },
          template: `<a href="https://example.com" :target="external ? '_blank' : undefined">Link</a>`
        },
        { props: { external: false } }
      )
      expect(wrapper.attributes('target')).toBeUndefined()

      await wrapper.setProps({ external: true })
      expect(wrapper.attributes('target')).toBe('_blank')

      await wrapper.setProps({ external: false })
      expect(wrapper.attributes('target')).toBeUndefined()
    })

    /* =================== */

    it('updates text when reactive state changes (via setup + ref)', async () => {
      const wrapper = shallowMount({
        data() {
          return { label: 'Before' }
        },
        template: '<a href="/x">{{ label }}</a>'
      })
      expect(wrapper.text()).toBe('Before')

      await wrapper.setData({ label: 'After' })
      expect(wrapper.text()).toBe('After')
    })
  })

  /* ======================
  Text, slots & HTML
  ====================== */

  describe('content', () => {
    it('renders the default slot', () => {
      const wrapper = shallowMount(
        { template: '<a href="/about"><slot /></a>' },
        { slots: { default: 'About Us' } }
      )

      expect(wrapper.text()).toBe('About Us')
    })

    /* =================== */

    it('falls back to default slot content when none is provided', () => {
      const wrapper = shallowMount({
        template: '<a href="/about"><slot>Fallback text</slot></a>'
      })

      expect(wrapper.text()).toBe('Fallback text')
    })

    /* =================== */

    it('renders HTML inside the slot', () => {
      const wrapper = shallowMount(
        { template: '<a href="/about"><slot /></a>' },
        { slots: { default: '<strong>Bold</strong> link' } }
      )

      expect(wrapper.find('strong').exists()).toBe(true)
      expect(wrapper.find('strong').text()).toBe('Bold')
      expect(wrapper.text()).toBe('Bold link')
      expect(wrapper.html()).toContain('<strong>Bold</strong>')
    })

    /* =================== */

    it('supports named slots (icon + label)', () => {
      const wrapper = shallowMount(
        {
          template: `
            <a href="/home">
              <span class="icon"><slot name="icon" /></span>
              <span class="label"><slot /></span>
            </a>
          `
        },
        {
          slots: {
            icon: '<svg data-testid="home-icon" />',
            default: 'Home'
          }
        }
      )

      expect(wrapper.find('.icon svg').exists()).toBe(true)
      expect(wrapper.find('.label').text()).toBe('Home')
    })

    /* =================== */

    it('supports an icon + text composition without slots', () => {
      const wrapper = shallowMount({
        template: '<a href="/home"><svg class="icon" /><span>Home</span></a>'
      })

      expect(wrapper.find('svg.icon').exists()).toBe(true)
      expect(wrapper.find('span').text()).toBe('Home')
    })

    /* =================== */

    it('escapes HTML in interpolated text (no injection)', () => {
      const wrapper = shallowMount({
        data() {
          return { label: '<img src=x onerror=alert(1)>' }
        },
        template: '<a href="/x">{{ label }}</a>'
      })

      expect(wrapper.find('img').exists()).toBe(false)
      expect(wrapper.text()).toBe('<img src=x onerror=alert(1)>')
    })

    /* =================== */

    it('matches an inline snapshot', () => {
      const wrapper = shallowMount({
        template: `
          <a href="https://example.com" target="_blank" rel="noopener noreferrer" class="is-external">Example</a>
        `
      })

      expect(wrapper.html()).toMatchInlineSnapshot(
        `"<a href="https://example.com" target="_blank" rel="noopener noreferrer" class="is-external">Example</a>"`
      )
    })
  })

  /* ======================
          Classes
  ====================== */

  describe('classes', () => {
    it('applies conditional classes', () => {
      const wrapper = shallowMount(
        {
          props: { external: Boolean, disabled: Boolean },
          template: `
            <a href="/x" :class="{ 'is-external': external, 'is-disabled': disabled }">Link</a>
          `
        },
        { props: { external: true } }
      )

      expect(wrapper.classes()).toContain('is-external')
      expect(wrapper.classes()).not.toContain('is-disabled')
      expect(wrapper.classes('is-external')).toBe(true) // single-class shortcut
    })

    /* =================== */

    it('has no classes when none are applied', () => {
      const wrapper = shallowMount({
        template: '<a href="/x">Link</a>'
      })

      expect(wrapper.classes()).toEqual([])
    })

    /* =================== */

    it('merges parent-supplied classes with its own', () => {
      const wrapper = shallowMount(
        { template: '<a href="/x" class="link">Link</a>' },
        { attrs: { class: 'btn btn-primary' } }
      )

      expect(wrapper.classes()).toEqual(expect.arrayContaining(['link', 'btn', 'btn-primary']))
    })

    /* =================== */

    it('supports array + object class bindings together', () => {
      const wrapper = shallowMount({
        data() {
          return { active: true, size: 'lg' }
        },
        template: `<a href="/x" :class="['link', \`link-\${size}\`, { active }]">Link</a>`
      })

      expect(wrapper.classes()).toEqual(['link', 'link-lg', 'active'])
    })

    /* =================== */

    it('applies inline styles', () => {
      const wrapper = shallowMount({
        template: '<a href="/x" style="color: red; text-decoration: none">Link</a>'
      })

      const el = wrapper.element as HTMLElement
      expect(el.style.color).toBe('red')
      expect(el.style.textDecoration).toBe('none')
    })
  })

  /* ======================
        Click events
  ====================== */

  describe('click events', () => {
    it('emits `navigate` with the href when clicked', async () => {
      const wrapper = shallowMount(
        {
          props: { href: String },
          emits: ['navigate'],
          template: `<a :href="href" @click.prevent="$emit('navigate', href)">Go</a>`
        },
        { props: { href: '/about' } }
      )

      await wrapper.trigger('click')

      expect(wrapper.emitted()).toHaveProperty('navigate')
      expect(wrapper.emitted('navigate')).toHaveLength(1)
      expect(wrapper.emitted('navigate')![0]).toEqual(['/about'])
    })

    /* =================== */

    it('calls a click handler passed via attrs (onClick)', async () => {
      const onClick = vi.fn()
      const wrapper = shallowMount(
        { template: '<a href="/about" @click.prevent>About</a>' },
        { attrs: { onClick } }
      )

      await wrapper.trigger('click')

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(expect.any(MouseEvent))
    })

    /* =================== */

    it('calls a method defined on the component', async () => {
      const handleClick = vi.fn()
      const wrapper = shallowMount({
        methods: { handleClick },
        template: '<a href="/about" @click.prevent="handleClick">About</a>'
      })

      await wrapper.trigger('click')

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    /* =================== */

    it('counts multiple clicks', async () => {
      const wrapper = shallowMount({
        data() {
          return { count: 0 }
        },
        template: '<a href="/x" @click.prevent="count++">Clicked {{ count }} times</a>'
      })

      await wrapper.trigger('click')
      await wrapper.trigger('click')
      await wrapper.trigger('click')

      expect(wrapper.text()).toBe('Clicked 3 times')
    })

    /* =================== */

    it('can pass modifier keys with the click event', async () => {
      const onClick = vi.fn()
      const wrapper = shallowMount(
        { template: '<a href="/about" @click.prevent>About</a>' },
        { attrs: { onClick } }
      )

      await wrapper.trigger('click', { ctrlKey: true })

      expect(onClick.mock.calls[0]![0].ctrlKey).toBe(true)
    })

    /* =================== */

    it('reacts to modifier-specific handlers (@click.ctrl)', async () => {
      const onCtrlClick = vi.fn()
      const wrapper = shallowMount({
        methods: { onCtrlClick },
        template: '<a href="/x" @click.prevent.ctrl="onCtrlClick">Link</a>'
      })

      await wrapper.trigger('click') // plain click: ignored
      expect(onCtrlClick).not.toHaveBeenCalled()

      await wrapper.trigger('click', { ctrlKey: true })
      expect(onCtrlClick).toHaveBeenCalledTimes(1)
    })

    /* =================== */

    it('works with a native DOM listener too', async () => {
      const wrapper = shallowMount({
        template: '<a href="/x" @click.prevent>Link</a>'
      })
      const listener = vi.fn()
      wrapper.element.addEventListener('click', listener)

      await wrapper.trigger('click')

      expect(listener).toHaveBeenCalledOnce()
    })

    /* =================== */

    it('@click.prevent really does prevent the default action', () => {
      const wrapper = shallowMount({
        template: '<a href="/x" @click.prevent>Link</a>'
      })

      // Dispatch a real event so we can inspect it afterwards
      const event = new MouseEvent('click', { bubbles: true, cancelable: true })
      wrapper.element.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(true)
    })

    /* =================== */

    it('without .prevent, the default action is NOT prevented', () => {
      // Hash-only hrefs are the one kind of navigation jsdom supports,
      // so this won't log a "Not implemented" error.
      const wrapper = shallowMount({
        template: '<a href="#section">Link</a>'
      })

      const event = new MouseEvent('click', { bubbles: true, cancelable: true })
      wrapper.element.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(false)
    })

    /* =================== */

    it('@click.stop stops the event from bubbling to a parent', async () => {
      const parentClick = vi.fn()
      const wrapper = mount(
        {
          template: `
            <div @click="$emit('parent-click')">
              <a href="/x" @click.prevent.stop>Link</a>
            </div>
          `,
          emits: ['parent-click']
        },
        { attrs: { onParentClick: parentClick } }
      )

      await wrapper.find('a').trigger('click')

      expect(parentClick).not.toHaveBeenCalled()
    })
  })

  /* ======================
        Disabled links
  ====================== */

  describe('disabled links', () => {
    it('removes href and adds aria-disabled / tabindex / class', () => {
      const wrapper = shallowMount(
        {
          props: { href: String, disabled: Boolean },
          template: `
            <a
              :href="disabled ? undefined : href"
              :aria-disabled="disabled ? 'true' : undefined"
              :tabindex="disabled ? -1 : undefined"
              :class="{ 'is-disabled': disabled }"
            >Link</a>
          `
        },
        { props: { href: '/about', disabled: true } }
      )

      expect(wrapper.attributes('href')).toBeUndefined()
      expect(wrapper.attributes('aria-disabled')).toBe('true')
      expect(wrapper.attributes('tabindex')).toBe('-1')
      expect(wrapper.classes()).toContain('is-disabled')
    })

    /* =================== */

    it('does not emit `navigate` and prevents the default action', () => {
      const wrapper = shallowMount(
        {
          props: { href: String, disabled: Boolean },
          emits: ['navigate'],
          // Template expressions aren't type-checked, so no annotations needed
          template: `
            <a
              :href="href"
              @click="disabled ? $event.preventDefault() : $emit('navigate', href)"
            >Link</a>
          `
        },
        { props: { href: '/about', disabled: true } }
      )

      const event = new MouseEvent('click', { bubbles: true, cancelable: true })
      wrapper.element.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(true)
      expect(wrapper.emitted('navigate')).toBeUndefined()
    })

    /* =================== */

    it('re-enables when `disabled` flips to false', async () => {
      const wrapper = shallowMount(
        {
          props: { href: String, disabled: Boolean },
          template: `
            <a
              :href="disabled ? undefined : href"
              :aria-disabled="disabled ? 'true' : undefined"
            >Link</a>
          `
        },
        { props: { href: '/about', disabled: true } }
      )

      await wrapper.setProps({ disabled: false })

      expect(wrapper.attributes('href')).toBe('/about')
      expect(wrapper.attributes('aria-disabled')).toBeUndefined()
    })
  })

  /* ======================
  Keyboard (role="button" links)
  ====================== */

  describe('keyboard', () => {
    it('activates on click', async () => {
      const wrapper = shallowMount({
        emits: ['activate'],
        template: `
          <a
            href="#"
            role="button"
            @click.prevent="$emit('activate')"
            @keydown.space.prevent="$emit('activate')"
          >Do it</a>
        `
      })

      await wrapper.trigger('click')

      expect(wrapper.attributes('role')).toBe('button')
      expect(wrapper.emitted('activate')).toHaveLength(1)
    })

    /* =================== */

    it('activates on Space (native buttons do, links do not)', async () => {
      const wrapper = shallowMount({
        emits: ['activate'],
        template: `
          <a href="#" role="button" @keydown.space.prevent="$emit('activate')">Do it</a>
        `
      })

      // VTU supports key modifiers as dot-suffixes
      await wrapper.trigger('keydown.space')

      expect(wrapper.emitted('activate')).toHaveLength(1)
    })

    /* =================== */

    it('ignores unrelated keys', async () => {
      const wrapper = shallowMount({
        emits: ['activate'],
        template: `
          <a href="#" role="button" @keydown.space.prevent="$emit('activate')">Do it</a>
        `
      })

      await wrapper.trigger('keydown.a')
      await wrapper.trigger('keydown', { key: 'Tab' })

      expect(wrapper.emitted('activate')).toBeUndefined()
    })

    /* =================== */

    it('calls preventDefault on Space so the page does not scroll', () => {
      const wrapper = shallowMount({
        template: '<a href="#" role="button" @keydown.space.prevent>Do it</a>'
      })

      const event = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true
      })
      wrapper.element.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(true)
    })
  })

  /* ======================
  Focus (requires attachTo: document.body)
  ====================== */

  describe('focus', () => {
    it('can receive focus when it has an href', () => {
      const wrapper = mount(
        { template: '<a href="/about">About</a>' },
        { attachTo: document.body } // focus only works on elements in the document
      )

      ;(wrapper.element as HTMLElement).focus()
      expect(document.activeElement).toBe(wrapper.element)

      wrapper.unmount() // clean up since we attached to the real DOM
    })

    it('is removed from the tab order with tabindex="-1"', () => {
      const wrapper = mount(
        { template: '<a href="/about" tabindex="-1">About</a>' },
        { attachTo: document.body }
      )

      // tabindex="-1" = skipped by Tab, but still focusable via script/click.
      expect((wrapper.element as HTMLAnchorElement).tabIndex).toBe(-1)

      wrapper.unmount()
    })

    /* =================== */

    it('emits focus and blur events', async () => {
      const onFocus = vi.fn()
      const onBlur = vi.fn()
      const wrapper = mount(
        {
          template:
            '<a href="/about" @focus="$attrs.onFocusSpy()" @blur="$attrs.onBlurSpy()">About</a>'
        },
        {
          attachTo: document.body,
          attrs: { onFocusSpy: onFocus, onBlurSpy: onBlur }
        }
      )

      await wrapper.trigger('focus')
      await wrapper.trigger('blur')

      expect(onFocus).toHaveBeenCalledTimes(1)
      expect(onBlur).toHaveBeenCalledTimes(1)

      wrapper.unmount()
    })
  })

  /* ======================
  Parametrized tests (it.each)
  ====================== */

  describe('href variants', () => {
    it.each([
      ['absolute https', 'https://example.com/path?q=1#top'],
      ['relative', '/docs/getting-started'],
      ['hash', '#section-2'],
      ['mailto', 'mailto:hello@example.com'],
      ['tel', 'tel:+15555551234']
    ])('renders %s hrefs verbatim', (_label, href) => {
      const wrapper = shallowMount(
        {
          props: { href: String },
          template: '<a :href="href">Link</a>'
        },
        { props: { href } }
      )

      expect(wrapper.attributes('href')).toBe(href)
    })

    /* =================== */

    it.each([
      ['javascript:alert(1)'],
      ['JAVASCRIPT:alert(1)'],
      ['  javascript:alert(1)'],
      ['data:text/html,<script>alert(1)</script>'],
      ['vbscript:msgbox(1)']
    ])('neutralizes the dangerous href "%s"', (href) => {
      const wrapper = shallowMount(
        {
          props: { href: { type: String, required: true } },
          // Plain object literals aren't contextually typed, so annotate props
          setup(props: { href: string }) {
            const safeHref = computed(() =>
              /^(https?:|mailto:|tel:|\/|#)/i.test(props.href.trim()) ? props.href : '#'
            )
            return { safeHref }
          },
          template: '<a :href="safeHref">Link</a>'
        },
        { props: { href } }
      )

      expect(wrapper.attributes('href')).toBe('#')
    })
  })

  /* ======================
  Mocking: spies & analytics
  ====================== */

  describe('mocking', () => {
    it('calls an injected tracking function with the right arguments', async () => {
      const track = vi.fn()
      const wrapper = shallowMount(
        {
          props: { href: String, track: Function },
          template: `<a :href="href" @click.prevent="track('link_click', { href })">Pricing</a>`
        },
        { props: { href: '/pricing', track } }
      )

      await wrapper.trigger('click')

      expect(track).toHaveBeenCalledOnce()
      expect(track).toHaveBeenCalledWith('link_click', { href: '/pricing' })
    })

    /* =================== */

    it('opens a new window after a delay (fake timers + window.open spy)', async () => {
      vi.useFakeTimers()
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
      const wrapper = shallowMount({
        setup() {
          const go = () => {
            setTimeout(() => window.open('https://example.com', '_blank'), 1000)
          }
          return { go }
        },
        template: '<a href="#" @click.prevent="go">Open in 1s</a>'
      })

      await wrapper.trigger('click')
      expect(openSpy).not.toHaveBeenCalled() // timer hasn't fired yet

      vi.advanceTimersByTime(999)
      expect(openSpy).not.toHaveBeenCalled() // still not quite

      vi.advanceTimersByTime(1)
      expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank')
    })

    it('mocks a global fetch triggered by a link click', async () => {
      const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"ok":true}'))

      const wrapper = shallowMount({
        setup() {
          const status = ref('idle')
          const ping = async () => {
            await fetch('/api/ping')
            status.value = 'done'
          }
          return { status, ping }
        },
        template: '<a href="#" @click.prevent="ping">Ping: {{ status }}</a>'
      })

      await wrapper.trigger('click')
      await vi.waitFor(() => expect(wrapper.text()).toBe('Ping: done'))

      expect(fetchMock).toHaveBeenCalledWith('/api/ping')
    })
  })

  /* ======================
  Child components: shallowMount vs mount, and RouterLink stubs
  ====================== */

  describe('RouterLink', () => {
    it('shallowMount replaces child components with stubs', () => {
      const wrapper = shallowMount(
        {
          template: '<router-link to="/about">About</router-link>'
        },
        { global: { stubs: { RouterLink: RouterLinkStub } } }
      )

      const link = wrapper.findComponent(RouterLinkStub)
      expect(link.exists()).toBe(true)
    })

    /* =================== */

    it('passes `to` as a prop to RouterLink', () => {
      const wrapper = mount(
        {
          props: { to: String },
          template: '<router-link :to="to" class="nav-link"><slot /></router-link>'
        },
        {
          props: { to: '/about' },
          slots: { default: 'About' },
          global: { stubs: { RouterLink: RouterLinkStub } }
        }
      )

      const link = wrapper.findComponent(RouterLinkStub)
      expect(link.props('to')).toBe('/about')
      expect(link.classes()).toContain('nav-link')
    })

    /* =================== */

    it('RouterLinkStub renders a real <a> when mounted', () => {
      const wrapper = mount(
        { template: '<router-link to="/about">About</router-link>' },
        { global: { stubs: { RouterLink: RouterLinkStub } } }
      )

      expect(wrapper.find('a').exists()).toBe(true)
      expect(wrapper.text()).toBe('About')
    })

    /* =================== */

    it('supports object-style `to` props', () => {
      const wrapper = mount(
        {
          template: `<router-link :to="{ name: 'user', params: { id: 42 } }">Profile</router-link>`
        },
        { global: { stubs: { RouterLink: RouterLinkStub } } }
      )

      expect(wrapper.findComponent(RouterLinkStub).props('to')).toEqual({
        name: 'user',
        params: { id: 42 }
      })
    })
  })

  /* ======================
  Finding & querying
  ====================== */

  describe('finding links in a larger template', () => {
    it('finds all anchors', () => {
      const wrapper = mount({
        template: `
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="https://github.com" target="_blank">GitHub</a>
          </nav>
        `
      })

      expect(wrapper.findAll('a')).toHaveLength(3)
    })

    /* =================== */

    it('finds by CSS selector / attribute selector', () => {
      const wrapper = mount({
        template: `
          <nav>
            <a href="/" class="home">Home</a>
            <a href="/about">About</a>
            <a href="https://github.com" target="_blank">GitHub</a>
          </nav>
        `
      })

      expect(wrapper.find('a.home').text()).toBe('Home')
      expect(wrapper.find('a[href="/about"]').text()).toBe('About')
      expect(wrapper.findAll('a[target="_blank"]')).toHaveLength(1)
    })

    it('maps over links to assert on all hrefs at once', () => {
      const wrapper = mount({
        template: `
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="https://github.com">GitHub</a>
          </nav>
        `
      })

      const hrefs = wrapper.findAll('a').map((a) => a.attributes('href'))
      expect(hrefs).toEqual(['/', '/about', 'https://github.com'])
    })

    /* =================== */

    it('finds by text content', () => {
      const wrapper = mount({
        template: `
          <nav>
            <a href="/">Home</a>
            <a href="https://github.com" target="_blank">GitHub</a>
          </nav>
        `
      })

      const github = wrapper.findAll('a').find((a) => a.text() === 'GitHub')
      expect(github?.attributes('target')).toBe('_blank')
    })

    /* =================== */

    it('reports missing elements with exists()', () => {
      const wrapper = mount({
        template: '<nav><a href="/">Home</a></nav>'
      })

      expect(wrapper.find('a.does-not-exist').exists()).toBe(false)
    })

    /* =================== */

    it('renders a list of links with v-for', () => {
      const wrapper = mount({
        data() {
          return {
            links: [
              { label: 'Home', href: '/' },
              { label: 'Docs', href: '/docs' },
              { label: 'Blog', href: '/blog' }
            ]
          }
        },
        template: `
          <ul>
            <li v-for="link in links" :key="link.href">
              <a :href="link.href">{{ link.label }}</a>
            </li>
          </ul>
        `
      })

      const anchors = wrapper.findAll('li a')
      expect(anchors).toHaveLength(3)
      expect(anchors.map((a) => a.text())).toEqual(['Home', 'Docs', 'Blog'])
      expect(anchors.map((a) => a.attributes('href'))).toEqual(['/', '/docs', '/blog'])
    })
  })

  /* ======================
  Conditional rendering (v-if)
  ====================== */

  describe('conditional rendering', () => {
    it('shows "Log in" when logged out', () => {
      const wrapper = mount(
        {
          props: { loggedIn: Boolean },
          template: `
            <div>
              <a v-if="loggedIn" href="/logout">Log out</a>
              <a v-else href="/login">Log in</a>
            </div>
          `
        },
        { props: { loggedIn: false } }
      )

      expect(wrapper.find('a').text()).toBe('Log in')
      expect(wrapper.find('a').attributes('href')).toBe('/login')
    })

    /* =================== */

    it('swaps to "Log out" when logged in', async () => {
      const wrapper = mount(
        {
          props: { loggedIn: Boolean },
          template: `
            <div>
              <a v-if="loggedIn" href="/logout">Log out</a>
              <a v-else href="/login">Log in</a>
            </div>
          `
        },
        { props: { loggedIn: false } }
      )

      await wrapper.setProps({ loggedIn: true })

      expect(wrapper.find('a').text()).toBe('Log out')
      expect(wrapper.find('a').attributes('href')).toBe('/logout')
      expect(wrapper.findAll('a')).toHaveLength(1)
    })

    /* =================== */

    it('hides a link with v-show (still in the DOM)', async () => {
      const wrapper = mount(
        {
          props: { visible: Boolean },
          template: '<div><a v-show="visible" href="/x">Link</a></div>'
        },
        {
          props: { visible: false },
          attachTo: document.body // isVisible() needs the element in the document
        }
      )

      expect(wrapper.find('a').exists()).toBe(true)
      expect(wrapper.find('a').isVisible()).toBe(false)

      await wrapper.setProps({ visible: true })
      expect(wrapper.find('a').isVisible()).toBe(true)

      wrapper.unmount()
    })
  })

  /* ======================
        Accessibility
  ====================== */

  describe('accessibility', () => {
    it('supports aria-current="page" for the active link', () => {
      const wrapper = shallowMount({
        template: '<a href="/" aria-current="page">Home</a>'
      })

      expect(wrapper.attributes('aria-current')).toBe('page')
    })

    /* =================== */

    it('has discernible text (either text content or aria-label)', () => {
      const wrapper = shallowMount({
        template: '<a href="/search" aria-label="Search"><svg /></a>'
      })

      const accessibleName = wrapper.attributes('aria-label') || wrapper.text().trim()
      expect(accessibleName).not.toBe('')
    })

    /* =================== */

    it('external links that open new tabs warn screen-reader users', () => {
      const wrapper = shallowMount({
        template: `
          <a href="https://example.com" target="_blank" rel="noopener">
            Example <span class="sr-only">(opens in a new tab)</span>
          </a>
        `
      })

      expect(wrapper.find('.sr-only').text()).toMatch(/new tab/i)
    })

    /* =================== */

    it('hides decorative icons from assistive tech', () => {
      const wrapper = shallowMount({
        template: '<a href="/home"><svg aria-hidden="true" class="icon" />Home</a>'
      })

      expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
    })

    /* =================== */

    it('uses rel="nofollow" for user-generated content links', () => {
      const wrapper = shallowMount({
        template: '<a href="https://spam.example" rel="nofollow ugc">Comment link</a>'
      })

      expect(wrapper.attributes('rel')?.split(' ')).toEqual(
        expect.arrayContaining(['nofollow', 'ugc'])
      )
    })
  })

  /* ======================
  Download & special link types
  ====================== */

  describe('special link types', () => {
    it('supports the download attribute (with and without a filename)', () => {
      const plain = shallowMount({
        template: '<a href="/report.pdf" download>Download</a>'
      })
      const named = shallowMount({
        template: '<a href="/report.pdf" download="Q3-report.pdf">Download</a>'
      })

      expect(plain.element.hasAttribute('download')).toBe(true)
      expect(plain.attributes('download')).toBe('')
      expect(named.attributes('download')).toBe('Q3-report.pdf')
    })

    /* =================== */

    it('supports hreflang and type hints', () => {
      const wrapper = shallowMount({
        template: '<a href="/fr" hreflang="fr" type="text/html">Français</a>'
      })

      expect(wrapper.attributes('hreflang')).toBe('fr')
      expect(wrapper.attributes('type')).toBe('text/html')
    })

    /* =================== */

    it('builds a mailto: link with a subject and encoded body', () => {
      const wrapper = shallowMount({
        data() {
          return { subject: 'Hello there', body: 'Line 1 & Line 2' }
        },
        template: `
          <a :href="\`mailto:hi@example.com?subject=\${encodeURIComponent(subject)}&body=\${encodeURIComponent(body)}\`">Email us</a>
        `
      })

      expect(wrapper.attributes('href')).toBe(
        'mailto:hi@example.com?subject=Hello%20there&body=Line%201%20%26%20Line%202'
      )
    })
  })

  /* ======================
        Lifecycle
  ====================== */

  describe('lifecycle', () => {
    it('removes the element from the DOM on unmount', () => {
      const wrapper = mount(
        { template: '<a href="/about" id="unmount-me">About</a>' },
        { attachTo: document.body }
      )
      expect(document.querySelector('#unmount-me')).not.toBeNull()

      wrapper.unmount()

      expect(document.querySelector('#unmount-me')).toBeNull()
    })

    /* =================== */

    it('runs onMounted / onUnmounted hooks', () => {
      const mounted = vi.fn()
      const unmounted = vi.fn()
      const wrapper = mount({
        mounted,
        unmounted,
        template: '<a href="/x">Link</a>'
      })

      expect(mounted).toHaveBeenCalledTimes(1)
      expect(unmounted).not.toHaveBeenCalled()

      wrapper.unmount()
      expect(unmounted).toHaveBeenCalledTimes(1)
    })
  })
})
