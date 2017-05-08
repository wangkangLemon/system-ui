<!--课程专辑下拉框-->
<template>
    <SelectScroll :changeCb="handleChange" :requestCb="fetchData" :placeholder="placeholder" v-model="currVal" :disabled="disabled">
    </SelectScroll>
</template>

<script>
    import courseService from '../../../services/courseService'
    import SelectScroll from '../../component/form/SelectScroll.vue'
    export default{
        props: {
            value: [String, Number],
            change: Function,
            placeholder: String,
            list: Array,
            disabled: {
                type: Boolean,
                default: false
            },
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
                this.currVal !== val && (this.currVal = val)
            }
        },
        methods: {
            handleChange(val) {
                this.setCurrentValue(val)
                this.change && this.change()
            },
            setCurrentValue (val) {
                if (this.curVal == val) return
                this.currVal = val
                this.$emit('input', val)
            },
            fetchData (val, length) {
                let keyword = val
                let page = parseInt(length / this.pageSize) + 1
                return courseService.getAlbumList({keyword, page, page_size: this.pageSize})
            }
        }
    }
</script>
