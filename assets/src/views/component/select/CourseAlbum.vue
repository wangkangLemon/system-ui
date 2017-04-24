<!--课程专辑下拉框-->
<template>
    <SelectScroll :changeCb="handleChange" :requestCb="fetchData" :placeholder="placeholder">
    </SelectScroll>
</template>

<script>
    import courseService from '../../../services/courseService'
    import SelectScroll from '../../component/form/SelectScroll.vue'
    export default{
        props: ['value', 'change', 'placeholder'],
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
