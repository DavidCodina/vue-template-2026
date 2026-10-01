// https://storybook.js.org/docs/get-started/frameworks/vue3-vite
import type {
  Meta,
  // CSF3: Component Story Format 3
  // https://www.youtube.com/watch?v=P0WHt_L0-2g
  // https://www.youtube.com/watch?v=uH9_dfc-6Kc
  StoryObj
  // StoryFn
  // StoryContext
} from '@storybook/vue3-vite'

//  import { fn } from 'storybook/test'

import Button from './index.vue'

/* ========================================================================

======================================================================== */
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories

/* ======================
         meta
====================== */

const meta /*: Meta<typeof Button> */ = {
  title: 'Components/Button',
  component: Button

  // Default render for every story: passes args as props and puts text in the default slot
  // render: (args) => ({
  //   components: { Button },
  //   setup() {
  //     return { args }
  //   },
  //   template: '<Button v-bind="args">Click me</Button>'
  // })
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/* ======================
       Default
====================== */

export const Default: Story = {
  args: {
    class: 'rounded-full font-semibold bg-pink-500',
    default: 'Click Me!!!'
  }
}
