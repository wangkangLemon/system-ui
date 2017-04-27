<template>
    <SelectScroll :changeCb="handleChange" :requestCb="fetchData" :list="list" v-model="currVal">
    </SelectScroll>
</template>

<script>
    import courseService from '../../../services/courseService'
    import SelectScroll from '../../component/form/SelectScroll.vue'
    export default{
        props: ['value', 'change', 'list'],
        components: {
            SelectScroll
        },
        data () {
            return {
                currVal: this.value,
                pageSize: 10
            }
        },
        watch: {
            'value'(val, oldValue) {
                if (this.curVal == val) return
                this.currVal = val
            },
        },
        methods: {
            handleChange(val) {
                this.currVal = val
                this.$emit('change', val)
                this.$emit('input', val)
                this.change && this.change()
            },
            fetchData (val, length) {
                let keyword = val
                let page = parseInt(length / this.pageSize) + 1
                return courseService.courseList(keyword, page, this.pageSize).then((ret) => {
                    this.$emit('changeList', ret.data)
                    return ret
                })
            }
        }
    }
</script>
