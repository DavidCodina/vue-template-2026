import type { InjectionKey, Ref } from 'vue'
///////////////////////////////////////////////////////////////////////////
//
// The injectionKey used by the provide() and inject() must be the exact same key
// — same variable, imported from one shared location. You cannot duplicate it,
// even if it looks identical.
//
// Literally naming this injectionKey with a Symbol of 'value', is probably not
// the best idea if you ever have to debug, but for the purposes of this demo
// it makes sense.
//
/////
//
// Note: In this Udemy/Academind, section 19.299, he simply used a string as
// the key. In other words, no shared injectionKey, no Symbol, just a string:
//
//   provide('userAge', uAge) --> inject('userAge')
//
// A plain string works fine at runtime — Vue's provide/inject really just do a
// Map.set(key, value) / walk-up Map.get(key) internally, and a string is a perfectly legal key.
//
// https://www.udemy.com/course/vuejs-2-the-complete-guide/learn/lecture/21880218#overview
//
//
// So why bother with the Symbol + InjectionKey<T> pattern? Two independent reasons,
// and they're both about tooling, not runtime behavior:
//
//   1. Collision safety. A Symbol is guaranteed unique. Two unrelated libraries
//      (or two files in a large app) can both pick the string 'value' or 'user'
//      as a key without realizing it, and the second provide() silently shadows
//      the first for that subtree — a bug that's miserable to track down because
//      nothing throws, something just quietly gets the wrong data. A Symbol()
//      can never collide with another Symbol(), even if they're created with the
//      not the identity.
//
//   2. Type inference. This is the bigger one in your case. InjectionKey<T> is Vue's
//      trick to get TypeScript to connect provide and inject calls even though they
//      happen in different files with no direct import relationship between the values.
//      When you write:
//
//        export const injectionKey = Symbol('value') as InjectionKey<Ref<string[]>>
//
//      then inject(injectionKey) in List.vue automatically comes back typed as Ref<string[]> | undefined
//      — no manual generic needed, no risk of typing it wrong. With a plain string key:
//
//        const value = inject<Ref<string[]>>('userAge')
//
//      you have to manually supply the generic at every single call site, and TypeScript can't check that
//      it matches what was actually provided — you could type it as Ref<number> by mistake and the compiler
//      would happily believe you. You lose the "single source of truth" for the type.
//
// Is the shared-key-in-its-own-file pattern the recommended best practice?
//
//   Yes — it's literally what the official Vue docs recommend for any nontrivial or TypeScript app: put Symbol()
//   injection keys in a separate file so they can be imported by both the providing and injecting components.
//   Plain string keys are presented as fine for quick demos or JS-only prototyping, not as the pattern you'd use
//   in real, larger codebases.
//
//   So your instinct is right on both counts: strings can work, and the shared-Symbol-key approach in keys.ts is
//   genuinely the better practice you already landed on, not something the earlier AI oversold.
//
///////////////////////////////////////////////////////////////////////////

export const injectionKey = Symbol('value') as InjectionKey<Ref<string[]>>
