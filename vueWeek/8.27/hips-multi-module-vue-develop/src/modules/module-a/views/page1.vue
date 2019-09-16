<template>
  <hips-view>
    <hips-nav-bar
      slot="header"
      :back-button="{
        showLeftArrow:true,
        backText:'返回'
      }"
        @nav-bar-back-click="$router.backPage()"
      >
      <div slot="center" class="tabs">
      <hips-tabs v-model="tabsActive">
        <hips-tab  title="待办"/>
        <hips-tab  title="已办"/>
        <hips-tab  title="我的"/>
      </hips-tabs>  
      </div>  
      </hips-nav-bar>
      <!-- <div v-if="tabsActive === 0">

      </div>
      <div v-if="tabsActive === 1">
     
      </div> -->
      <!-- <div v-if="tabsActive === 2">  -->
        <ComponentWode :data="newList"></ComponentWode>
       <!-- </div> -->
    <!-- <router-view /> -->
  </hips-view>
</template>

<script>
    import { View, Button, NavBar, Tabs, Tab, Cell, Group, Icon, Collapse, CollapseItem } from 'hips';
    import ComponentWode from "../components/component-wode";
    //import list-content from '../components/component-a.vue'
import axios from "axios";
    export default {
        name: 'Page1',
        components: {
            HipsView: View,
            [Button.name]: Button,
            [NavBar.name]: NavBar,
            [Tabs.name]: Tabs,
            [Tab.name]: Tab, 
            [Cell.name]: Cell,
            [Group.name]: Group,
            [Icon.name]: Icon,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            ComponentWode
        },
        data() {
            return {
              list:[],
              tabsActive: 0,
              activeNames: ['1']
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
                console.log(`${this.$t('tab')}${index + 1}${this.$t('disabled')}`)
            },
        },
        activated(){
          axios.get("/api/shuju").then(res => {
            // console.log("res", res.data.data);
            this.list = res.data.data
            console.log("父list:",this.list)
          });
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
        computed:{
          newList(){
              let list = this.list;
              let tabsActive = this.tabsActive;
              // return list;
              return (tabsActive === 2 )? list : (tabsActive === 1) ? list.filter(item=>item.boolean === true) :list.filter(item=>item.boolean === false) 
          }
      }
}
</script>

<style scoped lang="stylus">
</style>
