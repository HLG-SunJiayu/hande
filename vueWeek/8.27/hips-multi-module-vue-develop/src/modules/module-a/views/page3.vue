<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
      title="这是第 3 个页面"
      @nav-bar-back-click="$router.backPage()"
    />
  </hips-view>
</template>

<script>
    import { View, NavBar } from 'hips'

    export default {
        name: 'Page3',
        components: {
            [View.name]: View,
            [NavBar.name]: NavBar,
        },
    }
</script>

<style scoped lang="stylus">
</style>
