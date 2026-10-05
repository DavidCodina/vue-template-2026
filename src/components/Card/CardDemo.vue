<script setup lang="ts">
/* ======================
        Imports
====================== */

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './'
import Button from '@/components/Button/index.vue'

/* ======================
      Variables
====================== */

const images = [
  'https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&w=300&h=179&dpr=2',
  'https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg?auto=compress&cs=tinysrgb&w=300&h=179&dpr=2',
  'https://images.pexels.com/photos/736530/pexels-photo-736530.jpeg?auto=compress&cs=tinysrgb&w=300&h=179&dpr=2',
  'https://images.pexels.com/photos/248350/pexels-photo-248350.jpeg?auto=compress&cs=tinysrgb&w=300&h=179&dpr=2',
  'https://images.pexels.com/photos/1120049/pexels-photo-1120049.jpeg?auto=compress&cs=tinysrgb&w=300&h=179&dpr=2',
  'https://images.pexels.com/photos/1444321/pexels-photo-1444321.jpeg?auto=compress&cs=tinysrgb&w=300&h=179&dpr=2',
  'https://images.pexels.com/photos/33537/cat-animal-cat-portrait-mackerel.jpg?auto=compress&cs=tinysrgb&w=300&h=179&dpr=2',
  'https://images.pexels.com/photos/384555/pexels-photo-384555.jpeg?auto=compress&cs=tinysrgb&w=300&h=179&dpr=2'
]
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section
    class="mx-auto grid grid-cols-[repeat(auto-fill,minmax(300px,400px))] justify-center gap-6"
  >
    <Card
      class="[--card-spacing:calc(var(--spacing)*6)]"
      v-for="(image, index) in images"
      :key="index"
    >
      <img class="block h-50 object-cover" :src="image" alt="" />
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description...</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore repudiandae fuga
          perferendis voluptatum commodi, qui sed molestiae iure ad fugiat nulla! Alias voluptates
          quia quod quisquam natus laboriosam expedita ducimus consequuntur. Aliquid, maiores
          mollitia exercitationem facere laborum iste corrupti quas sed eveniet deleniti suscipit,
          fugiat quod ut molestiae temporibus harum?
        </p>
      </CardContent>
      <CardFooter class="">
        <Button class="min-w-25 justify-center">Cancel</Button>
        <Button class="min-w-25 justify-center" color="secondary" type="button"> Confirm </Button>
      </CardFooter>
    </Card>
  </section>
</template>
