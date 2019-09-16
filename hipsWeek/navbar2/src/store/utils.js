const createGetter = (state) => {
    let getters = {}
    for (let key in state) {
        let getter = `get${key.replace(key.charAt(0), key.charAt(0).toUpperCase())}`
        getters[getter] = (state) => {
            return state[key]
        }
    }
    return getters
};

const createMutations = (state) => {
    let mutations = {}
    for (let key in state) {
        let mutation = `set${key.replace(key.charAt(0), key.charAt(0).toUpperCase())}`
        mutations[mutation] = (state, value) => {
            state[key] = value
        }
    }
    return mutations
};

export {
    createGetter,
    createMutations,
}
