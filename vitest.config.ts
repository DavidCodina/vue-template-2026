// ❌ import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
// ❌ import viteConfig from './vite.config'
import viteConfig from './vite.config.ts' // Must be .ts to appease
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

// ❌ const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          test: {
            // To ONLY run the unit tests in CLI do this:
            // npx vitest --project=unit
            name: 'unit',
            ///////////////////////////////////////////////////////////////////////////
            //
            // For globals:true to work, make sure you do this in tsconfig.vitest.json:
            //
            //   "include": ["src/**/__tests__/*", "src/**/*.spec.ts", "src/**/*.test.ts", "env.d.ts"],
            //   "compilerOptions": { "types": ["node", "jsdom", "vitest/globals"] }
            //
            // And this in tsconfig.app.json:
            //
            //  "exclude": ["src/**/__tests__/*", "src/**/*.spec.ts", "src/**/*.test.ts"],
            //
            ///////////////////////////////////////////////////////////////////////////
            globals: true,

            css: true,

            // https://vitest.dev/guide/in-source.html
            // If you're going to use in-source testing, you need to tell vitest
            // to also look inside of normal files (i.e., non .spec. .test. files).
            // includeSource: ['src/**/*.{js,jsx,ts,tsx}'],

            environment: 'jsdom',

            // In other projects I did this to exclude Playwright tests!
            // This assumes that you'll be putting your Playwright tests in an e2e folder.
            // exclude: [...configDefaults.exclude, 'tests/**'],
            exclude: [...configDefaults.exclude, 'e2e/**'],
            root: fileURLToPath(new URL('./', import.meta.url))

            // For now, it seems to work fine without setupFiles
            // setupFiles: './src/setupTests.ts'
          }
        },
        {
          extends: true,
          plugins: [
            // The plugin will run tests for the stories defined in your Storybook config
            // In other words, this transforms stories into tests.
            // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
            storybookTest({
              // ❌ configDir: path.join(dirname, '.storybook')
              configDir: `${import.meta.dirname}/.storybook`
            })
          ],
          test: {
            // To ONLY run the storybook tests in CLI do this:
            // npx vitest --project=storybook
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({}),
              instances: [
                {
                  browser: 'chromium'
                }
              ]
            }
          }
        }
      ]
    }
  })
)
