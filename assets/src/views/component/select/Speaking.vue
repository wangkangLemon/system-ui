<template>
    <SelectScroll :changeCb="handleChange" :requestCb="fetchData">
    </SelectScroll>
</template>

<script>
    import speakingService from '../../../services/speaking/contentService'
    import SelectScroll from '../../component/form/TitleSelectScroll.vue'
    export default{
        props: {
            value: [String, Number],
            change: Function
        },
        components: {
            SelectScroll
        },
        data () {
            return {
                currVal: this.value,
                pageSize: 20
            }
        },
        watch: {
            'value'(val, oldValue) {
                this.setCurrentValue(val)
            },
        },
        methods: {
            handleChange(val) {
                this.setCurrentValue(val)
                this.change && this.change()
            },
            fetchData (val, length) {
                let keyword = val
                let page = parseInt(length / this.pageSize) + 1
                return speakingService.search({keyword, page, page_size: this.pageSize})
            },
            setCurrentValue (val) {
                if (this.curVal == val) return
                this.currVal = val
                this.$emit('input', val)
                this.$emit('change', val)
            }
        }
    }
</script>
