<template>
  <hips-view>
    <ul>
      <li v-for="item in data" :key="item.id">
        <!-- <ComponentA :info="item" :test="1"></ComponentA> -->
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
                    <span>{{item.cname}}</span>
                  </div>
                </div>
              </div>
              <div slot="value">
                <span>{{item.boolean?'结束':'待办'}}</span>
              </div>
            </hips-cell>
            <hips-cell value-align is-link @click="pushPrams(item.id)"> 
              <!-- <div > -->
                <div slot="title">
                  <span>最后审批人</span>&nbsp;&nbsp;&nbsp;
                  <span>{{item.cname}}</span>
                  <br /> 
                  <span>申请时间</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span
                    class="hips-cell-text"
                  >{{item.date}} {{item.time}}</span>
                </div>
              <!-- </div> -->
            </hips-cell>
          </hips-group>
      </li>
    </ul>
  </hips-view>
</template>

<script>
import { View, Button, NavBar, Tabs, Tab, Cell, Group, Icon } from "hips";
import axios from "axios";
import ComponentA from "../components/component-a";
export default {
  name: "ComponentWode",
  isstate: true,
  props:['data'],
  data() {
    return {
      activeNames: ["1"],
      list: []
    };
  },
  components: {
    HipsView: View,
    // ComponentA
    [View.name]: View,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Cell.name]: Cell,
    [Group.name]: Group,
    [Icon.name]: Icon
  },
  methods:{
    pushPrams: function(id) {
      this.$router.push({ name: "page2", query: { id:id } });
      //  :to="{path:'/page2',params:{info:info.id}}"
    }
  },
  beforeMount() {
    console.log(this.data);
    // axios.get("/api/shuju").then(res => {
    //   // console.log("res", res.data.data);
    //   this.list = res.data.data
    //   console.log("父list:",this.list)
    //   // console.log("list:" + this.list);
    // });
  }
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