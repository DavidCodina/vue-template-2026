<script setup lang="ts">
/* ======================
        Imports
====================== */

import { reactive, ref } from 'vue'
import { CircleCheckBig } from '@lucide/vue'

/* ======================
        Imports
====================== */

const form = reactive({ name: '', email: '', message: '' })
const sent = ref(false)

/* ======================
    Methods / Functions
====================== */

function sendMessage() {
  sent.value = true
}

/* ======================
      Variables
====================== */
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section id="contact" class="mx-auto max-w-300">
    <div class="mx-auto grid gap-12 md:grid-cols-2">
      <div>
        <p class="text-muted mb-1 font-mono">~/contact</p>
        <h2 class="text-3xl font-semibold uppercase md:text-4xl">Need A Vue Expert?</h2>
        <p class="text-muted mt-4 max-w-sm leading-relaxed">
          I'm open to frontend/fullstack roles and select freelance work. The fastest way to reach
          me is email (see below).
        </p>
        <ul class="text-muted mt-8 space-y-2 font-mono text-sm">
          <li class="text-primary-500">codinadavid970@gmai.com</li>
          <li>github — @DavidCodina</li>
          <li>linkedin — /in/david-codina-b7b015230/</li>
        </ul>
      </div>

      <form v-if="!sent" @submit.prevent="sendMessage" class="space-y-4" novalidate>
        <div>
          <label class="text-muted mb-1.5 block font-mono text-sm">name</label>
          <input
            class="focus:border-primary-500 w-full rounded border bg-transparent px-2 py-1 text-sm placeholder:italic focus:outline-none"
            type="text"
            required
            v-model="form.name"
            placeholder="⚠️  Not a real form! No functionality here!"
          />
        </div>
        <div>
          <label class="text-muted mb-1.5 block font-mono text-sm">email</label>
          <input
            class="focus:border-primary-500 w-full rounded border bg-transparent px-2 py-1 text-sm placeholder:italic focus:outline-none"
            type="email"
            required
            placeholder="⚠️ Not a real form! No functionality here!"
            v-model="form.email"
          />
        </div>
        <div>
          <label class="text-muted mb-1.5 block font-mono text-sm">message</label>
          <textarea
            class="focus:border-primary-500 w-full rounded border bg-transparent px-2 py-1 text-sm placeholder:italic focus:outline-none"
            required
            rows="4"
            placeholder="⚠️  Not a real form! No functionality here!"
            v-model="form.message"
          ></textarea>
        </div>
        <button
          type="submit"
          class="bg-secondary-500 hover:bg-primary-500 rounded px-2 py-1 text-sm font-medium text-white transition-colors"
        >
          Send message
        </button>
      </form>

      <div v-else class="border-primary-500 self-start rounded border p-6">
        <p class="font-mono text-sm">
          Message sent
          <CircleCheckBig
            class="text-primary-500 -mt-1 -ml-1 inline-block size-[1.5em] align-middle"
          />
        </p>

        <p class="text-secondary mt-2 text-sm">Thanks you...</p>
      </div>
    </div>
  </section>
</template>
