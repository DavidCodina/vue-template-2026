<script lang="ts">
///////////////////////////////////////////////////////////////////////////
//
// Monster Slayer: A very simple Vue 3 game written with the Options API.
// Originally from Udemy/Academind tutorial, section 4:
//
//   https://www.udemy.com/course/vuejs-2-the-complete-guide/learn/lecture/21463308#overview
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Imports
====================== */

import { defineComponent } from 'vue'

/* ======================
        Types
====================== */

type LogMessage = {
  id: number
  actionBy: 'player' | 'monster'
  actionType: 'attack' | 'heal'
  actionValue: number
}

type WinnerState = 'player' | 'monster' | 'draw' | null

// 2. Helper function with explicit parameter and return types
function getRandomValue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min
}

/* ======================
      defineComponent
====================== */

export default defineComponent({
  name: 'MonsterSlayer',
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null as WinnerState,
      logMessages: [] as LogMessage[],
      isWaiting: false // 1. Track turn delay state
    }
  },

  /* ======================
          computed
  ====================== */

  computed: {
    monsterBarStyles(): { width: string } {
      if (this.monsterHealth < 0) {
        return { width: '0%' }
      }
      return { width: `${this.monsterHealth}%` }
    },

    playerBarStyles(): { width: string } {
      if (this.playerHealth < 0) {
        return { width: '0%' }
      }
      return { width: `${this.playerHealth}%` }
    },

    mayUseSpecialAttack(): boolean {
      return this.currentRound % 3 !== 0
    }
  },

  /* ======================
          watch
  ====================== */
  // Watchers to set winner depending on player/monster health.

  watch: {
    playerHealth(value: number): void {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = 'draw'
      } else if (value <= 0) {
        this.winner = 'monster'
      }
    },
    monsterHealth(value: number): void {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = 'draw'
      } else if (value <= 0) {
        this.winner = 'player'
      }
    }
  },

  /* ======================
          methods
  ====================== */

  methods: {
    // Monster Slayer Methods
    startGame(): void {
      this.playerHealth = 100
      this.monsterHealth = 100
      this.winner = null
      this.currentRound = 0
      this.logMessages = []
    },

    attackMonster(): void {
      if (this.isWaiting) {
        return // Prevent spam
      }
      this.currentRound++
      const attackValue = getRandomValue(5, 12)
      this.monsterHealth -= attackValue
      this.addLogMessage('player', 'attack', attackValue)

      this.isWaiting = true
      setTimeout(() => {
        this.attackPlayer()
        this.isWaiting = false
      }, 1000)
    },

    attackPlayer(): void {
      // Don't counter-attack if the monster is already dead.
      // ⚠️ Note: the game originally didn't have this. Initially, it was
      // designed such that the monster always attacks back, thereby potentially
      // leading to a draw. Now a draw is no longer possible.
      if (this.monsterHealth <= 0) {
        return
      }

      const attackValue = getRandomValue(8, 15)
      this.playerHealth -= attackValue
      this.addLogMessage('monster', 'attack', attackValue)
    },

    // Is there anything special about this special attack?
    // You can actually use it multiple times throughout the fight, but only once every 3 turns.
    specialAttackMonster(): void {
      if (this.isWaiting) {
        return // Prevent spam
      }
      this.currentRound++
      const attackValue = getRandomValue(10, 25)
      this.monsterHealth -= attackValue
      this.addLogMessage('player', 'attack', attackValue)

      this.isWaiting = true
      setTimeout(() => {
        this.attackPlayer()
        this.isWaiting = false
      }, 1000)
    },

    healPlayer(): void {
      if (this.isWaiting) {
        return // Prevent spam
      }
      this.currentRound++
      const healValue = getRandomValue(10, 30)
      this.playerHealth = Math.min(this.playerHealth + healValue, 100)
      this.addLogMessage('player', 'heal', healValue)

      this.isWaiting = true
      setTimeout(() => {
        // ⚠️ This seems redundant, since there's already a guard in attackPlayer().
        if (this.monsterHealth > 0) {
          this.attackPlayer()
        }
        this.isWaiting = false
      }, 1000)
    },

    surrender(): void {
      this.winner = 'monster'
    },

    addLogMessage(who: 'player' | 'monster', what: 'attack' | 'heal', value: number): void {
      // unshift adds the new message to index 0 (top of the array)
      this.logMessages.unshift({
        id: Date.now() + Math.random(), // Unique key for Vue's virtual DOM
        actionBy: who,
        actionType: what,
        actionValue: value
      })
    }
  },

  /* ======================
      Lifecycle Hooks
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Gotcha: We can actually spell a lifecycle hook wrong and TS won't catch it:
  //
  //    munted() {}
  //
  // This is a known limitation of the Options API typings, not something wrong with this setup.
  //
  // Why This Happens?
  //
  //   Vue's ComponentOptionsBase type includes an index signature that allows arbitrary custom options
  //   (roughly [key: string]: any). That exists so plugins and libraries can add their own options
  //   (validations, beforeRouteEnter, and so on), so munted is just treated as a valid custom option.
  //   Excess property checking never triggers, and TypeScript can't tell that it was meant to be a lifecycle hook.
  //
  // In contrast hooks in the Composition API are imported functions, so a typo is a compile error.
  //
  ///////////////////////////////////////////////////////////////////////////

  // https://vuejs.org/api/options-lifecycle.html
  mounted() {
    console.log('MonsterSlayer mounted')
  },

  unmounted() {
    console.log('MonsterSlayer unmounted')
  }
})
</script>

<!-- ======================================================================

    ======================================================================= -->

<template>
  <div class="bg-card mx-auto max-w-100 space-y-4 rounded-xl border p-4 shadow">
    <h1 class="text-primary mb-8 text-center text-4xl font-black">Monster Slayer</h1>

    <div class="text-center text-8xl" v-if="winner === null">😈</div>
    <div class="text-center text-8xl" v-else-if="winner === 'monster'">☹️</div>
    <div class="text-center text-8xl" v-else-if="winner === 'player'">😀</div>
    <div class="text-center text-8xl" v-else>😐</div>

    <!-- ====================
          Monster Health
    ===================== -->

    <section class="">
      <h2 class="text-secondary text-xl font-bold">Monster Health</h2>
      <div class="border-secondary h-7 w-full overflow-hidden rounded-lg border bg-rose-500 shadow">
        <div
          class="bg-primary h-full w-full transition-[width] duration-500"
          :style="monsterBarStyles"
        ></div>
      </div>
    </section>

    <!-- ====================
          Your Health
    ===================== -->

    <section class="">
      <h2 class="text-secondary text-xl font-bold">Your Health</h2>
      <div class="border-secondary h-7 w-full overflow-hidden rounded-lg border bg-rose-500 shadow">
        <div
          class="bg-primary h-full w-full transition-[width] duration-500"
          :style="playerBarStyles"
        ></div>
      </div>
    </section>

    <!-- ====================
          Game Over UI
    ===================== -->

    <section class="mb-20" v-if="winner">
      <h2 class="text-primary text-center text-4xl font-black">Game Over!</h2>
      <h3
        class="mb-6 text-center text-lg font-bold text-rose-500 italic"
        v-if="winner === 'monster'"
      >
        You Lost!
      </h3>
      <h3
        class="text-primary mb-6 text-center text-lg font-bold italic"
        v-else-if="winner === 'player'"
      >
        You Won!
      </h3>
      <h3 class="text-secondary mb-6 text-center text-lg italic" v-else>It's A Draw!</h3>
      <button
        class="bg-secondary hover:bg-primary w-full rounded-lg px-2 py-1 text-sm font-semibold text-white shadow"
        @click="startGame"
      >
        Start New Game
      </button>
    </section>

    <!-- ====================
            Controls
    ===================== -->

    <section class="" v-else>
      <h2 class="text-secondary text-xl font-bold">Controls</h2>

      <div class="grid grid-cols-2 gap-2">
        <button
          :disabled="isWaiting"
          class="bg-secondary not-disabled:hover:bg-primary rounded-lg px-2 py-1 text-sm font-semibold text-white shadow disabled:opacity-50"
          @click="attackMonster"
        >
          ATTACK
        </button>
        <button
          :disabled="isWaiting || mayUseSpecialAttack"
          class="bg-secondary not-disabled:hover:bg-primary rounded-lg px-2 py-1 text-sm font-semibold text-white shadow disabled:opacity-50"
          @click="specialAttackMonster"
        >
          SPECIAL ATTACK
        </button>
        <button
          :disabled="isWaiting"
          class="bg-secondary not-disabled:hover:bg-primary rounded-lg px-2 py-1 text-sm font-semibold text-white shadow disabled:opacity-50"
          @click="healPlayer"
        >
          HEAL
        </button>
        <button
          :disabled="isWaiting"
          class="bg-secondary not-disabled:hover:bg-primary rounded-lg px-2 py-1 text-sm font-semibold text-white shadow disabled:opacity-50"
          @click="surrender"
        >
          SURRENDER
        </button>
      </div>
    </section>

    <!-- ====================
          Battle Log
    ===================== -->

    <section class="">
      <h2 class="text-secondary text-xl font-bold">Battle Log</h2>
      <ul v-if="logMessages.length">
        <li class="" v-for="logMessage in logMessages" :key="logMessage.id">
          <span
            :class="{
              'text-primary font-bold': logMessage.actionBy === 'player',
              'text-secondary font-bold': logMessage.actionBy === 'monster'
            }"
            >{{ logMessage.actionBy === 'player' ? 'Player' : 'Monster' }}</span
          >
          <span v-if="logMessage.actionType === 'heal'">
            heals himself for
            <span class="font-bold text-green-500">{{ logMessage.actionValue }}</span></span
          >
          <span v-else>
            attacks and deals
            <span class="font-bold text-rose-500">{{ logMessage.actionValue }}</span>
          </span>
        </li>
      </ul>

      <p v-else>...</p>
    </section>
  </div>
</template>
