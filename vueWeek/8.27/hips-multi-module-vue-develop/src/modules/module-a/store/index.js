import { createGetter, createMutations } from '@/store/utils'

let state = {}

export default {
    namespaced: true,
    state,
    getters: createGetter(state),
    mutations: createMutations(state),
}
