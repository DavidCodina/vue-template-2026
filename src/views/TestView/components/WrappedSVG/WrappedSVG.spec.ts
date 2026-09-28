import { describe, it, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import Button from './index.vue'
import VueSVG from './VueSVG.vue'

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

  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Note: shallowMount() can still find VueSVG. This is one of the more useful
  // design choices in Vue Test Utils. The key is understanding what "stubbed" actually means.
  //
  // When shallowMount() stubs a component, it doesn't remove it from the component tree.
  // It replaces the component's implementation (its template, script logic, children) with a
  // lightweight placeholder, but Vue still instantiates that placeholder as a real component
  // instance in the tree.
  //
  // So the tree still looks like this:
  //
  //   WrappedSVG (real)
  //   └── VueSVG (stub, but still a component vnode/instance)
  //
  // The stub renders as <vue-s-v-g-stub></vue-s-v-g-stub>, which is why wrapper.html()
  // doesn't contain <svg. But the component node itself is still there, just with an empty body.
  //
  /////////////////////////
  //
  // Why findComponent(VueSVG) still works:
  //
  // VTU keeps a link between the stub and the original component definition it replaced.
  // When you call findComponent(VueSVG), it walks the vnode tree and matches components
  // by definition, and it's aware of stubs. It recognizes that the stub was generated
  // for VueSVG, so it matches.
  //
  // This is deliberate. If stubs were invisible to findComponent, shallow rendering would be
  // much less useful, because you couldn't verify that a parent renders a given child.
  //
  // What This Enables:
  //
  // The whole point of shallow mounting is to test a component in isolation, and that involves
  // two separate concerns:
  //
  //   1. Is the child rendered at all? (Answerable with findComponent.)
  //   2. What does the child render internally? (Not the parent's concern, so it's stubbed away.)
  //
  // The three tests illustrate this nicely:
  //
  // Test                                              What It Verifies
  //
  //   mount + toContain('<svg')                       Integration: the full rendered output includes the SVG
  //   shallowMount + not.toContain('<svg')            The child's internals are not rendered (proves stubbing happened)
  //   shallowMount + findComponent(VueSVG).exists()   The parent does render the child, just not its guts
  //
  /////////////////////////
  //
  // Going Further With Stubs:
  //
  // Since the stub is a real component instance, you can also interact with it:
  //
  //   const wrapper = shallowMount(Button, {})
  //   const svg = wrapper.findComponent(VueSVG)
  //
  //   // Check props passed from parent to child
  //   expect(svg.props()).toEqual({ /* whatever Button passes */ })
  //
  //   // Trigger and assert on emitted events
  //   await svg.vm.$emit('some-event')
  //   expect(wrapper.emitted()).toHaveProperty('...')
  //
  // The stub preserves the original component's props declaration, so props() works and prop
  // and child (what props go in, what events come out) without running the child's real logic.
  // This is really the sweet spot for shallow mounting.
  //
  //  You can also render slot content in stubs if you need it:
  //
  //   shallowMount(Button, {
  //     global: { renderStubDefaultSlot: true }
  //   })
  //
  // By default, stubs don't render their slots, which can surprise people when content passed
  // into a stubbed child seems to vanish.
  //
  /////////////////////////
  //
  // Stub Naming:
  //
  // The odd <vue-s-v-g-stub> name is VTU hyphenating the component name (VueSVG becomes vue-s-v-g,
  // with each capital letter treated as a word boundary) and appending -stub. It's cosmetic, but
  // it can matter if you're writing snapshot tests, since renaming a component will change the snapshot.
  //
  // A Few Caveats:
  //
  //   - Matching by definition vs. by name: findComponent(VueSVG) (passing the imported component)
  //     is the most reliable approach. findComponent({ name: 'VueSVG' }) also works but depends
  //     on the component having a name set. With <script setup> SFCs, the name is inferred from
  //     the filename, which is usually fine but worth knowing.
  //
  //   - Custom stubs: If you provide your own stub via global.stubs, findComponent still generally
  //     works, but the stub needs to be associated with the original component (e.g. keyed by name
  //     or the component reference).
  //
  //   - Don't over-shallow: Because shallow rendering couples tests to the child's existence and props
  //     interface, some teams prefer mount for most tests and reserve shallowMount (or targeted stubs)
  //     for expensive or side-effect-heavy children. Both styles are valid; it's a tradeoff between isolation and realism.
  //
  /////////////////////////
  //
  // Summary:
  //
  // Stubbing swaps out what a component renders, not whether it's part of the tree. That's why shallowMount()
  // can hide the SVG markup while findComponent(VueSVG) still succeeds. The test you wrote is actually a nice
  // demonstration of it: the child exists structurally, but its implementation has been replaced.
  //
  ///////////////////////////////////////////////////////////////////////////

  it('shallowMount() can still find VueSVG', () => {
    const wrapper = shallowMount(Button, {})
    expect(wrapper.findComponent(VueSVG).exists()).toBe(true)
  })
})
