<script setup lang="ts">
/* ======================
        Imports
====================== */

import { useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { ArrowLeft, Users, UserPen } from '@lucide/vue'

import Page from '@/components/Page.vue'
import PageContainer from '@/components/PageContainer.vue'
import UpdateUserFrom from './components/UpdateUserForm/index.vue'

/* ======================
      Composables
====================== */

const router = useRouter()
const _title = useTitle('Update User')

/* ======================
      Props / Emits
====================== */

const props = defineProps<{
  id: string
}>()
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <Page>
    <PageContainer>
      <h1
        class="text-secondary-500 dark:text-primary-500 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase"
      >
        _Update User {{ props.id }} <UserPen class="size-[1em]" stroke-width="1" />
      </h1>

      <button
        class="text-primary hover:border-primary mx-auto mb-6 flex w-fit cursor-pointer items-center border-b border-transparent px-1 text-sm font-medium"
        @click="router.push(`/users/${props.id}`)"
      >
        <ArrowLeft :stroke-width="2.5" class="inline-block size-[1em]" />
        <Users :stroke-width="2.5" class="inline-block size-[1em]" />&nbsp;
        <span>Back to User Details</span>
      </button>

      <UpdateUserFrom :id="props.id" />
    </PageContainer>
  </Page>
</template>
