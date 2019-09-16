<template>
  <div>
    <hips-row>
      <hips-col
        v-for="(item,index) in modules"
        :key="index"
        class="module"
        span="8"
        @click.native="$router.pushPage(`${item.route}`)"
      >
        {{ item.name }}
      </hips-col>
    </hips-row>
  </div>
</template>

<script>
    import { Col, Row } from 'hips'

    export default {
        name: 'Applications',
        components: {
            [Col.name]: Col,
            [Row.name]: Row,
        },
        data() {
            return {
                modules: [
                    {
                        name: '审批中心',
                        route: 'page1',
                    },
                ],
            }
        },
        methods: {},
    }
</script>

<style scoped lang="stylus">
    @import "style/var.styl"

    .module {
        height 120px
        display flex
        justify-content center
        align-items center
        border 1px solid $border-color-light
    }
</style>
