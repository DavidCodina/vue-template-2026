import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding'
  ],
  framework: '@storybook/vue3-vite',
  //^ This was added to silence the following warning:
  //^ Remove this after upgrading to Storybook 11 in the future.
  // ▲  vue-docgen-api is deprecated and will be removed in the next major
  // │  release of Storybook. It is still the default docgen engine, so this
  // │  also applies when you have not set the docgen framework option. Enable
  // │  server-side docgen with features: { experimentalDocgenServer: true }
  // │  in your .storybook/main.ts, which becomes the default in Storybook 11,
  // │  or set framework: { name: '@storybook/vue3-vite', options: { docgen:
  // │  'vue-component-meta' } } to keep docgen in the builder.
  //
  features: {
    experimentalDocgenServer: true
  }
}
export default config
