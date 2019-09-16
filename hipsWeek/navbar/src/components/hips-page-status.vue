<template>
  <div class="page-status">
    <div
      v-if="contentInit"
      class="content-init"
    >
      <hips-spin
        size="30px"
        color="#1F8CEB"
      />
      <slot name="init" />
    </div>
    <div
      v-if="contentEmpty"
      class="content-empty"
    >
      <span v-if="!$slots.empty">
        — 没有相关数据 —
      </span>
      <slot name="empty" />
    </div>
  </div>
</template>

<script>
    import { Spin } from 'hips'

    /**
     * 显示当前页面状态
     * 1. 页面数据加载中
     * 2. 页面没有相关数据
     * */
    export default {
        name: 'HipsPageInit',
        components: {
            [Spin.name]: Spin,
        },
        props: {
            contentInit: {type: Boolean, default: false},   // 页面初始化，展示spin
            contentEmpty: {type: Boolean, default: false},   // 页面无数据，展示空态
        },
    }
</script>

<style scoped lang="stylus">
    @import "../style/var.styl"

    .page-status {
        width 100%
        display flex
        align-items center
        justify-content center

        .content-init, .content-empty {
            padding 10px 0
        }

        .content-empty {
            font-size $fontsize-medium
            color $font-color-label
        }
    }
</style>
