<template>
  <hips-view>
    <hips-nav-bar
      theme="primary"
      slot="header"
      :back-button="{
    showLeftArrow:true,
    backText:'返回'
  }"
      title="详情"
      @nav-bar-back-click="$router.backPage()"
    />

    <hips-cell style="background-color:rgb(80, 112, 255)">
      <template slot="title">
        <hips-icon name="mine-o" />&nbsp;&nbsp;
        <span>审批历史</span>
        <br />
        <hips-icon name="checked" color="green" />&nbsp;&nbsp;
        <span>项目经理</span>&nbsp;
        <span>{{data.cname}}审批 审批通过</span>&nbsp;&nbsp;&nbsp;
        <span>{{data.date}} {{data.time}}</span>
      </template>
    </hips-cell>

    <hips-collapse v-model="activeNames">
      <hips-collapse-item title="明细信息" name="1" icon="records" value="内容">
        <hips-cell title="报销申请单编号" :value="data.id" />
        <hips-cell title="姓名" :value="data.cname" />
        <hips-cell title="部门编号" value="技术发展中心.移动技术中心.研发中心" />
        <hips-cell title="项目编号" value="100OSP0520190049-ZOB" />
        <hips-cell title="项目经理" :value="data.cname" />
        <hips-cell title="报销申请日期" :value="data.date" />
        <hips-cell title="币别" value="CNY" />
        <hips-cell title="实际付款金额" :value="data.integer" />
        <hips-cell title="事由说明" value="2019-06-新华三技术有限公司-2019人天项目-移动端|项目津贴" />
      </hips-collapse-item>
    </hips-collapse>

    <hips-collapse v-model="activeNames">
      <hips-collapse-item title="报销费用明细" name="2" icon="records" value="内容">
        <hips-cell title="报销类型" value="项目实施" />
        <hips-cell title="费用名称" value />
        <hips-cell title="单价" :value="data.integer" />
        <hips-cell title="数量" value="1" />
        <hips-cell title="金额" :value="data.integer" />
        <hips-cell title="起始日期" :value="data.date" />
        <hips-cell title="终止日期" :value="data.date" />
        <hips-cell title="地点" :value="data.province" />
        <hips-cell title="摘要说明" value />
      </hips-collapse-item>
    </hips-collapse>
  </hips-view>
</template>

<script>
import {
  View,
  Button,
  NavBar,
  Tabs,
  Tab,
  Cell,
  Group,
  Icon,
  Collapse,
  CollapseItem
} from "hips";
//import list-content from '../components/component-a.vue'
import axios from "axios";
export default {
  name: "Page1",
  components: {
    [View.name]: View,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Cell.name]: Cell,
    [Group.name]: Group,
    [Icon.name]: Icon,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem
  },
  data() {
    return {
      tabsActive: 0,
      activeNames: ["1"],
      data: {},
      item: []
    };
  },
  methods: {
    onClickDisabled(index, el) {
      this.$hips.toast(`${this.$t("tab")}${index + 1}${this.$t("disabled")}`);
    },
    getParmas: function() {
      if (this.$route.query.id !== undefined) {
        axios.get("/api/shuju").then(res => {
      // console.log("res", res.data.data);
          this.data = res.data.data.filter(item=>item.id===this.$route.query.id)[0];
          console.log( this.data);
        })
      }
    }
  },
  // mounted() {
     
  //   this.getParmas();
  // },
  activated() {
    console.log(this.$route.query.item);
    console.log("123");
    this.getParmas();  
  }
 
}
</script>

<style scoped lang="stylus">
span {
  color: white;
}
</style>
