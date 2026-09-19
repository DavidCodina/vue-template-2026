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
///////////////////////////////////////////////////////////////////////////

export const injectionKey = Symbol('value') as InjectionKey<Ref<string[]>>
