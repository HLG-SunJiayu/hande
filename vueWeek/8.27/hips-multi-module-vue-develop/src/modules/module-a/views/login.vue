<template>
  <div class="login">
    <hips-spin />
  </div>
</template>

<script>
  import { Spin } from 'hips'

  import { mapGetters } from 'vuex'

  export default {
    name: 'Login',
    beforeRouteEnter(to, form, next) {
      next((vm) => {
        let searchObj = vm.getLocationSearch() || {}
        console.log('searchObj = ', searchObj)
        // noAuthHttp.login(searchObj).then((res) => {
        //     vm.$router.replacePage('page1')
        // }).catch((err) => {
        //     console.log(err)
        //     toast.show('登录失败，请稍后再试！')
        // })

        vm.$router.replacePage('page1')
      })
    },
    components: {
      [Spin.name]: Spin,
    },
    methods: {
      ...mapGetters([ 'getLocationSearch' ]),
    },
  }
</script>

<style scoped lang="stylus">
  .login {
    display flex
    justify-content center
    padding-top 50px
  }
</style>
