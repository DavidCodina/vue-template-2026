import { globalIgnores } from 'eslint/config'

// https://github.com/vuejs/eslint-config-typescript
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
// https://eslint.vuejs.org/rules/
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

///////////////////////////////////////////////////////////////////////////
//
// Note:
//
// The use of eslint-plugin-prettier is intentionally omitted.
//
//   ❌ import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
//
// eslint-plugin-prettier exists and works, but it's the "old" pattern from before flat configs
// and separate Prettier extensions were the norm. Prettier's own docs steer people away from it now,
// for two concrete reasons:
//
//   1. Performance — every file save runs Prettier's formatting logic wrapped inside an ESLint rule,
//      which is slower than just running Prettier directly.
//      Running a full Prettier pass through ESLint's rule engine on every lint is much slower than just
//      running Prettier directly, and you end up with two tools doing the same job through different pipes.
//
//   2. Worse diffs and DX — formatting issues show up as generic ESLint errors ("Insert ⏎") instead
//   of Prettier just... fixing them. You lose the clean "format on save, never think about it again" experience.
//
///////////////////////////////////////////////////////////////////////////

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}']
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'], // i.e., vue/* rules.

  ///////////////////////////////////////////////////////////////////////////
  //
  // What exactly is vueTsConfigs.recommended AND Where does the 'no-var' rule come from?
  // First, 'no-var' actually comes from vueTsConfigs.recommended.
  // More specifially from the internal eslint-recommended.
  //
  // typescript-eslint's recommended config doesn't only add @typescript-eslint/* rules.
  // It also extends an internal config typescript-eslint ships called eslint-recommended.
  // This is typescript-eslint's own corrected version of ESLint's base eslint:recommended
  // — because some core ESLint rules (like no-undef, no-unused-vars) behave badly or are
  // redundant on TypeScript code, so typescript-eslint turns those off and explicitly
  // turns a few others on.
  //
  // https://typescript-eslint.io/users/configs/#eslint-recommended
  // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslint-recommended-raw.ts
  // See also node_modules/@typescript-eslint/elint-plugin/dist/configs/eslint-recommended-raw.js
  //
  // As for the other rules in vueTsConfigs.recommended, see here:
  // https://typescript-eslint.io/users/configs/#recommended
  // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslintrc/recommended.ts
  // See also: https://typescript-eslint.io/rules/?=recommended
  // First notice what it extends: ['./configs/eslintrc/base', './configs/eslintrc/eslint-recommended'],
  // Also notice that EVERYTHING is set to 'error'.
  // This is something you may want to change manually if you want a more forgiving developer experience.
  //
  ///////////////////////////////////////////////////////////////////////////
  vueTsConfigs.recommended,

  // Most Custom Rules Can Go Here! Why?
  // Because most rule overrides will be for pluginVue or vueTsConfigs.
  {
    rules: {
      // Again, these four rules come from eslint-recommended.
      // Here they've been changed from 'error' to 'warn'
      'no-var': 'warn', // ts transpiles let/const to var, so no need for vars any more
      'prefer-const': 'warn', // ts provides better types with const
      'prefer-rest-params': 'warn', // ts provides better types with rest args over arguments
      'prefer-spread': 'warn', // ts transpiles spread to apply, so no need for manual apply

      ///////////////////////////////////////////////////////////////////////////
      //
      // Note: Vue templates support two different parsing paths, and one of them isn't case-sensitive.
      // SFC <template> blocks go through Vue's compiler, which is case-sensitive and behaves like JSX.
      // But Vue also supports writing templates as literal strings (via a template: "..." option,
      // or in-DOM templates — e.g., server-rendered HTML that Vue mounts onto directly).
      // Because that path is parsed by the browser's native HTML parser before Vue ever sees it,
      // and HTML itself is case-insensitive, <Button> gets silently lowercased to <button>
      // by the browser before Vue's runtime can resolve it as a component at all. In that scenario,
      // the case distinction you're relying on completely disappears, and your component would just...
      // not render, replaced by a plain native button tag.
      //
      // Generally speaking Vue can disambiguate between <Button>< and <button>,
      // but in the case of writing templates as literal strings (via a template: "..." option,
      // <Button> would get silently lowercased to <button>, and that would be bad.
      //
      // With Vite + .vue SFC files, you basically never encounter this. More specifically,
      // inside a .vue file, Vite never sends that markup to the browser to parse as HTML at all.
      // Vite runs it through @vue/compiler-sfc at build time, which parses your <template> block
      // with Vue's own case-sensitive template compiler (not the browser's HTML parser).
      // The browser's case-insensitive HTML parser is never in the loop at any point.
      //
      // Here's where the string-template / in-DOM-template approach actually shows up,
      // so you can recognize it if you ever see it:
      //
      //   1. Vue loaded via <script> tag / CDN, no build step at all
      //   2. Explicitly using the template: "..." component option
      //
      // Conclusion: Since we're writing .vue files and using Vite (and would continue to, under Nuxt),
      // this whole category of risk doesn't apply to this project. You'd only run into it if you
      // (or a library you depend on) deliberately mounted a component using a raw HTML string or
      // the template: "..." option — which is uncommon in modern Vue codebases.
      //
      ///////////////////////////////////////////////////////////////////////////
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',

      // Allows @ts-ignore statement. When on, it actually just says to
      // use "@ts-expect-error" instead, which may be a newer syntax.
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_', // Ignore unused arguments that start with _
          varsIgnorePattern: '^_', // Ignore unused variables that start with _
          caughtErrorsIgnorePattern: '^_', // Ignore caught errors that start with _
          destructuredArrayIgnorePattern: '^_' // Ignore destructured array elements that start with _
        }
      ]
    }
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*']
  },

  // Note: oxlint won't show squigglies in Cursor unless you have its own editor extension installed.
  // The pluginOxlint.buildFromOxlintConfigFile line in your ESLint config only disables overlapping
  // ESLint rules — it doesn't route oxlint's findings through the ESLint extension.
  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting
)

///////////////////////////////////////////////////////////////////////////
//
// Sanity Check - Uncomment logic in HomeView.vue to manually verify rules are working.
//
//   ⚠️ 'unused' is assigned a value but never used. eslint(@typescript-eslint/no-unused-vars)
//   const unused = 'test'
//
//   ⚠️ Unexpected var, use let or const instead. eslint(no-var)
//   var badVar = 123
//   console.log(badVar)
//
///////////////////////////////////////////////////////////////////////////
