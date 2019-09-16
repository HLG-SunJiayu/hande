<template>
  <hips-popup
    v-model="showPopup"
    position="bottom"
  >
    <hips-datetime-picker
      :format="format"
      title="选择时间"
      @confirm="handleConfirm"
      @cancel="hidePop"
    />
  </hips-popup>
</template>

<script>
    import { Popup, DatetimePicker } from 'hips'

    export default {
        name: 'DatetimePicker',
        components: {
            [Popup.name]: Popup,
            [DatetimePicker.name]: DatetimePicker,
        },
        props: {
            format: {
                type: String,
                required: true,
            },
        },
        data() {
            return {
                showPopup: false,
            }
        },
        methods: {
            /**
             * 显示picker弹窗
             * @author mingming.jiang - hand
             * */
            showDatetimePicker() {
                this.showPopup = true
            },

            /**
             * 处理确认选择时间
             * @author mingming.jiang - hand
             * @param value 格式化后的时间
             * */
            handleConfirm(value) {
                this.$emit('select-confirm', value)
                this.hidePop()
            },

            /**
             * 关闭弹窗
             * @author mingming.jiang - hand
             * */
            hidePop() {
                this.showPopup = false
            },
        },
    }
</script>

<style scoped>

</style>
