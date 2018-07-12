<style lang="scss" rel="stylesheet/scss" scoped>
    .el-cascader-menu {
        height: auto !important;
    }
</style>
<!--课程任务模板分类-->
<template>
    <el-cascader
        :options='options' 
        :show-all-levels="false"
        @active-item-change="handleItemChange"
        :disabled="disabled"
        :props="props"
        :clearable="clearable"
        @change="setCurrVal"
        :placeholder="placeholder">
    </el-cascader>
</template>

<script>
    import treeUtils from 'utils/treeUtils'
    import goodsService from 'services/yshi/goodsService'
    export default{
        props: {
            value: [String, Number],
            onchange: Function,
            disabled: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: '请选择'
            },
            clearable: {
                type: Boolean,
                default: false
            },
            showIn: {
                type: String,
                default: '',
            },
        },
        watch: {
            showIn (val) {
                this.fetchData()
            }
        },
        data () {
            return {
                options: [],
                currVal: this.value,
                props: {
                    value: 'id',
                    children: 'children',
                    label: 'name'
                }
            }
        },
        created () {
            this.fetchData()
        },
        methods: {
            fetchData () {
                goodsService.getCategoryTree({show_in: this.showIn}).then((ret) => {
                    ret.map((item) => {
                        item.children = item.has_children ? [{label: '加载中...'}] : null
                    })
                    this.options = ret
                })
            },
            setCurrVal (val) {
                if (this.currVal == val || !val) return
                this.currVal = val
                this.$emit('input', val[val.length - 1])
                this.$emit('change', val)
                this.onchange && this.onchange(val)
            },
            handleItemChange (val) {
                if (val.length < 1) return
                // 递归找到该项
                let currItem = treeUtils.findItem(this.options, val, 'id')
                if (!currItem.children || (currItem.children.length > 0 && currItem.children[0].value)) return
                goodsService.getCategoryTree({
                    id: val[val.length - 1],
                    show_in: this.showIn,
                }).then((ret) => {
                    // 重新组合数据
                    ret.map((item) => {
                        item.children = item.has_children ? [{label: '加载中...'}] : null
                    })
                    currItem.children = ret
                })
            },
        }
    }
</script>
