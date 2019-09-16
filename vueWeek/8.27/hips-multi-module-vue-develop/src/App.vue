<template>
  <div id="app">
    <transition :name="routerTransition">
      <keep-alive exclude="ComponentA">
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'

    import {setDocumentTitle } from '@/utils'

    import { noAuthHttp } from '@/request'

    export default {
        name: 'App',
        data() {
            return {
                routerTransition: 'router-slide-left',
            }
        },
        watch: {
            $route(to, from) {
                setDocumentTitle(to.meta.title)
                // let routerHistory = this.getRouterHistory()
                // let toIndex = routerHistory.indexOf(to.name)
                // if (toIndex > -1) {
                //     routerHistory.splice(toIndex + 1)
                //     this.routerTransition = ''
                // } else {
                //     if (to.name) {
                //         routerHistory.push(to.name)
                //         this.routerTransition = 'router-slide-left'
                //     } else {
                //         this.routerTransition = ''
                //     }
                // }
                // console.log(routerHistory)
                // this.setRouterHistory(routerHistory)

                this.routerTransition = from.meta.routerTransition
            },
        },
        mounted() {
            let route = this.$router
            let search = window.location.search
            if (search !== '') {
                let t = search.split('?')[1].split('&')
                let searchObj = {}
                t.map((item) => {
                    searchObj[item.split('=')[0]] = item.split('=')[1]
                })
                this.setLocationSearch(searchObj)
            }

            // 模拟调用mock
            noAuthHttp.post('/api/register', { data: 1 }).then((res) => {
                console.group('test mock')
                console.log(res)
                console.groupEnd()
            })

            noAuthHttp.post('/api/login', { data: 1 }).then((res) => {
                console.group('test mock')
                console.log(res)
                console.groupEnd()
            })

            this.$router.replacePage(route.options.routes[1].name)
        },
        methods: {
            ...mapGetters([ 'getRouterHistory' ]),
            ...mapMutations([ 'setRouterHistory', 'setLocationSearch' ]),
        },
    }
</script>

<style lang="stylus">
    @import "style/theme.styl"
</style>
