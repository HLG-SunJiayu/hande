export default {
    beforeRouteEnter(from, to, next) {
        next(() => {
            if (to.meta.pageInit) {
                to.meta.pageInit = false
            }
        })
    },
}
