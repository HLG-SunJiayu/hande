Vue.component('list-content', {
  data: function () {
    return {
      state:true
    }
  },
  template: '  <hips-group> 
         <hips-cell title="网上报销"  description="江铭铭" icon="photo">
            <template slot="value">
               <span :class="{state:true}">结束</span>
            </template>
         </hips-cell>
         
            <hips-cell value-align is-link url="">
               <template slot="title">
                 
               
               </template>
     
            </hips-cell>
         </hips-group>'
})
