<template>
<div class="hips-nav-bar" 
    :class="[`hips-nav-bar-theme-${theme}`,{'hips-thinline--top-bottom':haveBorder},{'hips-thinline':fixed-top}]"
>
        <div class="hips-nav-bar__buttons hips-nav-bar__buttons--left" v-if='backButton.showLeftArrow === true'>
            <div class="hips-nav-bar__button hips-nav-bar__button--have-icon">
                <i class="hips-icon hips-icon-arrow-left"></i>
            </div>
            <div class="hips-nav-bar__button hips-nav-bar__button--have-icon" :key="i" v-for='(item,i) in leftButtons'>
                <i class="hips-icon hips-icon-close"></i>
                <span>{{item.buttonLabel}}</span>
            </div>
        </div>
    <div class="hips-ellipsis hips-nav-bar__title" style="width: calc(100% - 78px); margin: 0px 39px;">
    <span>{{title}}</span>
    </div>
        <div class="hips-nav-bar__buttons hips-nav-bar__buttons--right" v-if='backButton.showLeftArrow === true'>
            <!-- <div class="hips-nav-bar__button hips-nav-bar__button--have-icon">
                <i class="hips-icon hips-icon-arrow-right"></i>
            </div> -->
            <div class="hips-nav-bar__button hips-nav-bar__button--have-icon" :key="i" v-for='(item,i) in rightButtons'>
                <!-- <i class="hips-icon hips-icon-close"></i> -->
                <span>{{item.buttonLabel}}</span>
            </div>
        </div>
</div>
</template>

<script>
    
    export default {
        name: 'HipsNavBar',
        components: {
        },
        props:{
           backButton:{
              type:Object,
              default:()=>{showLeftArrow:true;backText:'返回'},
           },
           leftButtons:{
             type:Array,
             default:()=>[]
           },
           rightButtons:{
             type:Array,
             default:()=>[]
           },
           title:{
             type:String
           },
           fixedtop:{
             type:Boolean,
             default:false
           },
           theme:{
             type:String,
             default:'default'
           },
           haveBorder:{
             type:Boolean,
             default:true
           },
        //    showLeftArrow:{
        //      type:Boolean
        //    },
        //    backText:{
        //      type:String
        //    },
        //    buttonIcon:{
        //      type:Boolean
        //    },
        //    buttonLabel:{
        //      type:String
        //    }
        }
    }
</script>

<style scoped lang="stylus">
.hips-nav-bar{
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    font-size: 16px;
    position: relative;
    white-space: nowrap;
    width: 100%;
    background-color: #fff;
    color: #1f8ceb;
}
.hips-nav-bar-theme-default{
    background white;
    color #fff
}
.hips-nav-bar-theme-primary{
    background rgb(80, 112, 255);
    color #fff
}
.hips-nav-bar-theme-dark-primary{
    background blue;
    color #fff
}
.hips-nav-bar-theme-approved{
    background green;
    color #fff
}
.hips-nav-bar-theme-wait{
    background yellow;
    color #fff
}
.hips-nav-bar-theme-reject{
    background #f00;
    color #fff
}
.hips-nav-bar-theme-tips{
    background gray;
    color #fff
}
.hips-thinline--top-bottom{
    border-width: 1px 0;
}
.hips-thinline{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    transform: scale(0.5);
    transform-origin: 0 0;
    pointer-events: none;
    box-sizing: border-box;
    border: 0 solid #eee;
}
</style>
