<!-- https://vuejs.org/guide/built-ins/transition.html -->

<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref, watch } from 'vue'

/* ======================
        Refs
====================== */

const isOpen = ref<boolean>(false)

/* ======================
       Computed
====================== */

/* ======================
Event Handlers / Functions
====================== */

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

/* ======================
        Watchers
====================== */

watch(
  isOpen,
  (newValue, _prevValue) => {
    console.log('isOpen changed:', newValue)
  },
  {}
)
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div>
    <h2 class="text-primary mb-6 text-center text-3xl font-black">Transition Demo</h2>

    <button
      class="bg-secondary hover:bg-primary mx-auto mb-10 block rounded px-2 py-1 text-xs font-semibold text-white shadow"
      @click="openModal"
    >
      Open Modal
    </button>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/20"
          @click.self="closeModal"
        >
          <!-- Demure Box Shadow: https://ui.aceternity.com/tools/box-shadows -->
          <div
            class="modal-card bg-card border-primary relative max-w-180 cursor-default rounded-xl border-2 p-4 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
          >
            <h2 class="text-primary mb-2 text-2xl font-black">Amazing Modal!</h2>
            <p class="text-sm leading-loose">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente necessitatibus
              officia repellendus consectetur aut inventore veniam animi? Ea delectus soluta aliquam
              animi error culpa! Nostrum temporibus, possimus maiores commodi reiciendis ab
              doloribus ad quae nihil dignissimos fugiat earum et molestiae corporis vitae laborum
              tempore harum excepturi optio culpa. Blanditiis reprehenderit, saepe debitis quos iste
              corporis, soluta eos sequi at illum quae possimus eius ducimus, enim consectetur
              fugit? Accusantium eligendi voluptas quibusdam in alias quia, est laudantium nisi quam
              vero ex consectetur numquam natus eos facere ipsum, id libero dolorem maxime tempora.
              Magnam nemo animi vel ipsam, magni nobis nulla quidem!
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* What's actually happening in this demo? How is it actually working?
Notice that we named the Transition with name="modal". The pattern is as
follows: name="*" such that Vue's Transition automatically applies the
these classes as needed:

  *-enter-from           
  *-enter-active
  *-enter-to
  *=leave-from
  *-leave-active
  *-leave-to

  ┌────────────────────┬────────────────────────────────┬───────────────────────────────────────────────────────────┐
  │ Class              │ Applied                        │ Removed                                                   │
  ├────────────────────┼────────────────────────────────┼───────────────────────────────────────────────────────────┤
  │ modal-enter-from   │ Before the element is inserted │ One frame after insertion                                 │
  ├────────────────────┼────────────────────────────────┼───────────────────────────────────────────────────────────┤
  │ modal-enter-active │ Before insertion               │ When the transition finishes                              │
  ├────────────────────┼────────────────────────────────┼───────────────────────────────────────────────────────────┤
  │ modal-enter-to     │ One frame after insertion      │ When the transition finishes                              │
  ├────────────────────┼────────────────────────────────┼───────────────────────────────────────────────────────────┤
  │ modal-leave-from   │ When leaving starts            │ One frame later                                           │
  ├────────────────────┼────────────────────────────────┼───────────────────────────────────────────────────────────┤
  │ modal-leave-active │ When leaving starts            │ When the transition finishes, then the element is removed │
  ├────────────────────┼────────────────────────────────┼───────────────────────────────────────────────────────────┤
  │ modal-leave-to     │ One frame after leaving starts │ When the transition finishes                              │
  └────────────────────┴────────────────────────────────┴───────────────────────────────────────────────────────────┘
  Note: Without a name, the prefix defaults to v- (v-enter-from, etc.).


Vue adds and removes classes for you.


What happens when you open

  1. isOpen becomes true, and v-if is about to insert the overlay.
  2. Vue inserts it with modal-enter-from and modal-enter-active already on it. Now the overlay has opacity: 0, and the card inside it (matched by .modal-enter-from .modal-card) has transform: scale(0.5). Because of modal-enter-active, both also have their transition properties.
  3. On the next frame, Vue removes modal-enter-from and adds modal-enter-to.
  4. The overlay's opacity and the card's transform now differ from what they were a frame ago, and a transition is in effect, so the browser animates between them.
  5. Vue waits for the transition to end, then removes modal-enter-active and modal-enter-to.

What happens when you close

  1. isOpen becomes false, but Vue doesn't remove the element yet.
  2. It adds modal-leave-active and modal-leave-from, then on the next frame swaps modal-leave-from for modal-leave-to.
  3. Your CSS says .modal-leave-to means opacity: 0 and .modal-leave-to .modal-card means scale(0.5), so both animate toward those values.
  4. When the transition ends, Vue removes the element from the DOM.

Why your CSS is written the way it is

  The trick is that you never write "the normal state" for opacity or scale. The element's natural state 
  (opacity 1, no transform) is the destination on enter and the starting point on leave. You only define 
  the hidden state (-from on enter, -to on leave) and the how (-active).

    - active classes hold the transition property (duration, easing). 
      They're on the element for the whole animation.

    - enter-from / -leave-to hold the hidden state.

  The nested selectors work because those classes sit on the overlay, so .modal-enter-from 
  .modal-card is just a normal descendant selector matching the card inside it. That's how 
  one <Transition> on the overlay drives two animations.

Vue's part vs. CSS's part

  Vue doesn't animate anything. It only does two things: it toggles the classes at the right moments, 
  and it delays removing the element on leave until the CSS transition finishes (by listening for 
  transitionend). The browser's CSS engine does all the animating.

  That's also why the :class="{ 'scale-100': ... }" binding was unnecessary: <Transition> is already 
  managing the state changes through those classes.

=======================================================================

Alternative: <Transition> has a prop for each of the six classes, and each one overrides the class name 
that would otherwise be generated from name.

  Vue <Transition> class props (each overrides the class generated from `name`)
  ┌──────────────────────┬──────────────────────┐
  │ Prop                 │ Replaces             │
  ├──────────────────────┼──────────────────────┤
  │ enter-from-class     │ modal-enter-from     │
  ├──────────────────────┼──────────────────────┤
  │ enter-active-class   │ modal-enter-active   │
  ├──────────────────────┼──────────────────────┤
  │ enter-to-class       │ modal-enter-to       │
  ├──────────────────────┼──────────────────────┤
  │ leave-from-class     │ modal-leave-from     │
  ├──────────────────────┼──────────────────────┤
  │ leave-active-class   │ modal-leave-active   │
  ├──────────────────────┼──────────────────────┤
  │ leave-to-class       │ modal-leave-to       │
  └──────────────────────┴──────────────────────┘

There are also three related props for CSS animations and timing (not class overrides):

  - appear-from-class, appear-active-class, appear-to-class: the same idea, but for the initial render on page load, used with the appear prop.
  - type: "transition" or "animation", telling Vue which event to wait on if both are present.
  - duration: an explicit time in ms (or { enter, leave }) instead of relying on transitionend.

Why you'd use them

  The main use case is utility-first CSS, since you can put Tailwind classes directly in the template and skip 
  the <style> block entirely. They also let you plug in animation libraries like Animate.css.
*/

/* Overlay fade */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Card zoom (nested, driven by the overlay's transition classes) */
.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 0.25s ease;
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: scale(0.5);
}
</style>
