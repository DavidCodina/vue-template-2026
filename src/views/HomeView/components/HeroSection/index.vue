<script setup lang="ts">
/* ======================
        Imports
====================== */

import { RouterLink } from 'vue-router'

/* ======================
      Variables
====================== */

const DAVE = `
██████╗  █████  ██╗   ██╗██████╗
██╔══██╗██╔══██╗██║   ██║██╔═══╝
██║  ██║███████║██║   ██║██████╗
██║  ██║██╔══██║ ██  ██╔╝██╔═══╝
██████╔╝██║  ██║ ╚████╔╝ ██████╗
╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═════╝
`

const CODE = `
 █████╗  █████╗  ██████╗ ██████╗
██╔═══╝ ██╔═══██╗██╔══██╗██╔═══╝
██║     ██║   ██║██║  ██║█████╗  
██║     ██║   ██║██║  ██║██╔══╝  
╚██████╗╚██████╔╝██████╔╝██████╗
 ╚═════╝ ╚═════╝ ╚═════╝ ╚═════╝
`

const _DAVEMAN = `
 ██████╗  █████  ██╗   ██╗██████╗ ███╗   ███╗ █████╗ ███╗   ██╗
 ██╔══██╗██╔══██╗██║   ██║██╔═══╝ ████╗ ████║██╔══██╗████╗  ██║
 ██║  ██║███████║██║   ██║██████╗ ██╔████╔██║███████║██╔██╗ ██║
 ██║  ██║██╔══██║ ██  ██╔╝██╔═══╝ ██║╚██╔╝██║██╔══██║██║ ██ ██║
 ██████╔╝██║  ██║ ╚████╔╝ ██████╗ ██║ ╚═╝ ██║██║  ██║██║  ████║
 ╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
`
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section class="mx-auto grid max-w-300 items-center gap-12 lg:grid-cols-2" :style="{}">
    <div>
      <p class="text-secondary font-mono">
        Hello. I'm David<span class="text-primary-500">_</span>
      </p>
      <h1 class="mt-3 text-4xl leading-[1.1] font-semibold tracking-tight md:text-5xl">
        I build interfaces in Vue that feel simple, even when the data underneath isn't.
      </h1>
      <p class="text-muted mt-5 max-w-md leading-relaxed">
        Fullstack engineer focused on Vue 3, component architecture, and the unglamorous work of
        making things fast and accessible by default — currently at ACME inc., previously team lead
        at DaveTek Industries.
      </p>
      <div class="mt-8 flex flex-wrap items-center gap-4">
        <RouterLink
          :to="{ path: '/', hash: '#work' }"
          class="bg-secondary-500 hover:bg-primary rounded px-2 py-1 text-sm font-medium text-white transition-colors"
        >
          See the work
        </RouterLink>

        <!-- Add some kind of fancy hover animation here.-->
        <RouterLink
          :to="{ path: '/', hash: '#contact' }"
          class="text-secondary hover:text-primary-500 border-secondary hover:border-primary-500 border-b pb-0.5 text-sm font-medium transition-colors"
          >Get in touch
        </RouterLink>
      </div>
    </div>

    <!-- code panel -->
    <div
      class="rounded-xl border border-[#D97757]/75 bg-slate-800 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] dark:bg-slate-800/60"
    >
      <div class="flex items-center gap-1.5 border-b border-[#D97757]/50 px-4 py-2.5">
        <span class="size-3 rounded-full" style="background: #e5645a"></span>
        <span class="size-3 rounded-full" style="background: #e5b85a"></span>
        <span class="size-3 rounded-full" style="background: #5ab878"></span>
        <span class="ml-2 font-mono text-xs text-[rgb(240,240,240)]">profile.ts</span>
      </div>

      <div class="mt-2 ml-6 font-mono text-[7px] leading-[1.2] text-[#D97757]">
        <pre class="">
          {{ DAVE }}
        </pre>
        <pre class="-mt-4 -mb-6">
          {{ CODE }}
        </pre>
      </div>

      <pre
        class="overflow-x-auto p-5 font-mono text-sm leading-relaxed"
      ><code><span class="text-violet-400">export</span> <span class="text-rose-400">default</span> <span class="text-blue-400">defineComponent</span><span class="text-yellow-300">(</span><span class="text-violet-400">{</span>
  <span class="text-rose-400">name</span><span class="text-sky-300">:</span> <span class="text-lime-500">'David Codina'</span>,
  <span class="text-rose-400">role</span><span class="text-sky-300">:</span> <span class="text-lime-500">'Fullstack Engineer'</span>,
  <span class="text-rose-400">focus</span><span class="text-sky-300">:</span> <span class="text-blue-400">[</span><span class="text-lime-500">'Vue'</span>, <span class="text-lime-500">'React'</span>, <span class="text-lime-500">'TypeScript'</span>, <span class="text-lime-500">'Python'</span><span class="text-blue-400">]</span>,
  <span class="text-rose-400">location</span><span class="text-sky-300">:</span> <span class="text-lime-500">'Remote · US Mountain'</span>,
  <span class="text-rose-400">available</span><span class="text-sky-300">:</span> <span class="text-[#D97757]">true</span>
<span class="text-violet-400">}</span><span class="text-yellow-300">)</span></code></pre>
    </div>
  </section>
</template>
