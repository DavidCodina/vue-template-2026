<!-- https://vuejs.org/api/composition-api-lifecycle.html#onbeforeupdate -->

<script setup lang="ts">
///////////////////////////////////////////////////////////////////////////
//
// onBeforeUpdate runs at the mirror-opposite point from onUpdated — it fires after
// Vue detects a reactive change and decides to re-render, but before the DOM has
// actually been patched. So you're standing right at the boundary: your reactive
// state already reflects the new values, but the DOM on screen still shows the old values.
//
// The core use case this enables: capturing "before" information about the DOM that would
// otherwise be lost the instant the patch happens. Once onUpdated fires, the old DOM is gone
// — you can only see the new one. If you need to compare before vs. after (not just react to "after"),
// onBeforeUpdate is your only window to grab the "before."
//
// Common real-world uses:
//
//   - Preserving scroll position in a list where new items get prepended
//     (e.g., "load older messages" at the top of a chat) — you need the
//     old scroll height before the patch, so after the patch you can adjust
//     scrollTop by the difference and avoid the visual jump.
//
//   - Conditionally deciding whether to auto-scroll — this is actually a
//     great fit for your existing demo, and more realistic than "always scroll
//     to bottom": check whether the user was already scrolled to the bottom
//     before the new message renders. If they'd scrolled up to read old messages,
//     you shouldn't yank them back down every time someone else sends something.
//
//   - Measuring an element's old size/position before an update, to animate a
//     transition from old-to-new (a common technique behind FLIP-style animations).
//
//   - Logging/debugging — capturing a snapshot of state right before a re-render,
//     useful when diagnosing why something is re-rendering.
//
// Let's build the "was I already scrolled to the bottom?" version — it's the most genuinely
// useful upgrade to what you already have, and it demonstrates exactly why onBeforeUpdate
// needs to exist as a separate hook (rather than just checking things at the start of
// onUpdated, where the old DOM state is already gone):
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Imports
====================== */

import { onBeforeUpdate, onUpdated, ref } from 'vue'
import { CirclePlus } from '@lucide/vue'
// import { cn } from '@/utils/cn'
// import Button from '@/components/Button.vue'

/* ======================
    Refs (i.e., State)
====================== */

const messages = ref<string[]>(['Welcome to the chat! (Message #1)'])

/* ======================
     Template Refs
====================== */

// Bound to the scrollable message container below (ref="containerRef" in
// the template). We need a real DOM handle here, since both hooks below
// need to read/set .scrollTop directly.
const containerRef = ref<HTMLDivElement | null>(null)

/* ======================
      Variables
====================== */

// Captured in onBeforeUpdate, read in onUpdated. Not reactive — it's a
// plain snapshot flag, not something the template renders.
let wasScrolledToBottom = true

/* ======================
Event Handlers / Functions
====================== */

const addMessage = () => {
  messages.value.push(`Message #${messages.value.length + 1}:
  \nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  `)
}

/* ======================
    Lifecycle Hooks
====================== */
///////////////////////////////////////////////////////////////////////////
//
// onBeforeUpdate runs after Vue detects a reactive change and decides to
// re-render, but BEFORE the DOM has actually been patched. Reactive state
// (messages.value) already reflects the NEW data at this point — but the
// DOM on screen still shows the OLD render. This is the one moment where
// you can compare "about to change" against "what's still on screen."
//
// Why this matters here: once onUpdated fires, the old DOM is already
// gone — patched over with the new message. If we want to know whether the
// user WAS scrolled to the bottom before the new message arrived, this is
// the only hook where that "before" information still exists to check.
//
// Caution: same rule as onUpdated — avoid mutating reactive state in here,
// or you risk triggering another update cycle before this one even patches.
// Plain reads and non-reactive variable assignments (like below) are safe.
//
/////////////////////////
//
// "Why not just check scroll position at the top of onUpdated?"
// — by the time onUpdated runs, the new <p> has already been appended and
// the DOM has already been patched, so scrollHeight/scrollTop would reflect
// the post-update state, not what the user was looking at right before the change.
// onBeforeUpdate is the only place that "before" snapshot is still honest.
//
///////////////////////////////////////////////////////////////////////////

onBeforeUpdate(() => {
  if (containerRef.value) {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.value
    // A small buffer (a few px) accounts for sub-pixel rounding, so "close
    // enough to the bottom" still counts as "was at the bottom."
    wasScrolledToBottom = scrollHeight - scrollTop - clientHeight < 10
  }
  console.log('onBeforeUpdate() fired! wasScrolledToBottom:', wasScrolledToBottom)
})

///////////////////////////////////////////////////////////////////////////
//
// onUpdated runs after the DOM has been patched. Now we act on what we
// captured a moment ago in onBeforeUpdate:
//
//   Only auto-scroll to the bottom if the user was ALREADY at the bottom.
//
// If they'd scrolled up to read
// older messages, we leave their scroll position alone — a real chat app
// wouldn't want to yank them back down every time a new message arrives.
//
///////////////////////////////////////////////////////////////////////////

onUpdated(() => {
  console.log('onUpdated() fired!')

  if (!containerRef.value) {
    return
  }
  ///////////////////////////////////////////////////////////////////////////
  //
  // Only auto-scroll to the bottom if the user was ALREADY at the bottom.
  //
  //   - If you're already at the bottom (actively watching the conversation, not scrolled up),
  //     a new message arrives → the view auto-scrolls to keep the newest message visible.
  //     This is what you want — you're "following" the conversation live.
  //
  //   - If you've scrolled up to read something from earlier, and a new message arrives elsewhere
  //     in the chat → auto-scrolling you back down to the bottom would be actively disruptive.
  //     You'd lose your place mid-read, every single time someone sent a new message. This is
  //     the exact anti-pattern that annoys people in real chat apps.
  //
  ///////////////////////////////////////////////////////////////////////////

  if (wasScrolledToBottom) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight
  }

  containerRef.value.style.outline = '2px dashed #42B883'
  setTimeout(() => {
    if (containerRef.value) {
      containerRef.value.style.outline = ''
    }
  }, 500)
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="mx-auto max-w-150 space-y-3">
    <div
      ref="containerRef"
      class="h-80 space-y-4 overflow-y-auto rounded-lg border border-stone-300 bg-white p-2 shadow"
    >
      <p v-for="(msg, i) in messages" :key="i" class="text-sm">
        {{ msg }}
      </p>
    </div>

    <button
      @click="addMessage"
      class="ml-auto flex cursor-pointer items-center gap-1 rounded-lg bg-[#42B883] px-2 py-1 text-sm font-semibold text-white shadow"
      title="Add Message"
    >
      <CirclePlus class="size-[1.25em]" /> Message
    </button>
  </div>
</template>
