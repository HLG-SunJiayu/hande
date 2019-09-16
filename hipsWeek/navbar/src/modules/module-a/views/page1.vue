<template>
  <hips-view>
    <hips-nav-bar
      :back-button='backButton'
      :left-buttons="leftButtons"
      :right-buttons="rightButtons"
      theme="reject"
      :have-border='false'
      title="标题"
    >
    </hips-nav-bar>
     
  </hips-view>
</template>

<script>
    import { View,} from 'hips';
    //import list-content from '../components/component-a.vue'
  import HipsNavBar from './nav-bar'
    export default {
        name: 'Page1',
        components: {
            [View.name]: View,
            HipsNavBar
        },
        data() {
            return {
              tabsActive: 0,
              activeNames: ['1'],
               backButton:{
                showLeftArrow: true,
                backText: '返回',
              },
              leftButtons: [
                {
                  buttonIcon: '',
                  buttonLabel: '关闭'
                }
              ],
              rightButtons: [
                {
                  buttonIcon: '',
                  buttonLabel: '分享'
                },
                {
                  buttonIcon: '',
                  buttonLabel: '我的'
                }
              ]
            }
            // curId:1,
        },
        methods: {
            // toPage2() {
            //     this.$router.pushPage({path: '/page1/page2'})
            // },
            // gai(type) {
                   
            //         this.curId = type;
            //         console.log(this.curId);
            //     },
            onClickDisabled (index, el) {
                this.$hips.toast(`${this.$t('tab')}${index + 1}${this.$t('disabled')}`)
            },
        },
        // watch:{
        //   tabsActive:function(val, oldVal){
        //     switch(val){
        //       case 0 : this.$router.pushPage({path:"/page1/component-daiban"});break;
              
        //       case 1: this.$router.pushPage({path:"/page1/component-yiban"});break;
              
        //       case 2: this.$router.pushPage({path:'/page1/component-wode'});return;
              
        //     }

        //   }
        // }
        // computed:{
        //         newList(){
        //            let list = this.list;
        //            let curId = this.curId;
        //            return (curId === 1 )? list : (curId === 2) ? list.filter(item=>item.ToggleOn === true) :list.filter(item=>item.ToggleOn === false) 
        //         }
        //     }
    }
</script>

<style scoped lang="stylus">
</style>
