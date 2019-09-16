<template>
  <!-- <hips-view> -->
  <hips-group>
    <div class="ge"></div>
    <hips-cell>
      <div slot="title">
        <div class="head">
          <div>
            <img src="../assets/img-default-avator.png" />
          </div>
          <div>
            <span>网上报销</span>
            <br />
            <span>{{info.cname}}</span>
          </div>
        </div>
      </div>
      <div slot="value">
        <span>{{info.boolean?'结束':'待办'}}</span>
      </div>
    </hips-cell>
    <hips-cell value-align is-link > 
      <!-- <div > -->
        <div slot="title">
          <span>最后审批人</span>&nbsp;&nbsp;&nbsp;
          <span>{{info.cname}}</span>
          <br /> 
          <span>申请时间</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span
            class="hips-cell-text"
          >{{info.date}} {{info.time}}</span>
        </div>
      <!-- </div> -->
    </hips-cell>
  </hips-group>
  <!-- </hips-view> -->
</template>

<script>
import { View, Button, NavBar, Tabs, Tab, Cell, Group, Icon } from "hips";
import { log } from "util";
// import axios from "axios";
export default {
  name: "ComponentA",
  props: ["info", "test"],
  isstate: true,
  data() {
    return {
      tabsActive: 0,
      activeNames: ["1"],
      info1: []
      // rou: "{path:'/page2',params:{info:this.info}}",
    };
  },
  watch: {
    info: {
      handler: function(val, oldVal) {
        this.info1 = this.info;
        console.log(this.info1);
      },
      deep: true
    }
  },
  components: {
    [View.name]: View,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Cell.name]: Cell,
    [Group.name]: Group,
    [Icon.name]: Icon
  },
  methods: {
    pushPrams: function() {
      this.$router.push({ name: "page2", query: { id: this.info.id } });
      //  :to="{path:'/page2',params:{info:info.id}}"
    }
  },
  mounted() {
    console.log("子info:", this.info);
    console.log("test:", this.test);
  },
  activated() {
    console.log(1111);

    console.log(this.info);
  }
  // mounted(){
  //   console.log(2222);

  //     console.log(this.info);
  // }
};
</script>

<style scoped>
img {
  width: 50px;
  height: 50px;
}
.head {
  display: flex;
  justify-content: space-around;
}
.ge {
  width: 100%;
  height: 10px;
  background-color: rgb(246, 246, 255);
  /* rgb(246, 246, 255) */
}
</style>