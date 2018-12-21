<style lang="scss" rel="stylesheet/scss">
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
        :clearable="true"
        :props="props"
        @change="setCurrVal"
        :placeholder="placeholder"
    ></el-cascader>
</template>

<script>
    import treeUtils from 'utils/treeUtils'
    import CompanyService from 'services/companyService'
    export default{
        props: {
            value: [String, Number],
            onchange: Function,
            placeholder: {
                type: String,
                default: '请选择'
            },
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
            CompanyService.getCategoryTree({}).then((ret) => {
                ret.map((item) => {
                    item.children = item.has_children ? [{label: '加载中...'}] : null
                })
                this.options = ret
            })
        },
        methods: {
            setCurrVal (val) {
                if (this.currVal == val || !val) return
                this.currVal = val
                this.$emit('input', val[val.length - 1])
                this.onchange && this.onchange(val)
            },
            handleItemChange (val) {
                if (val.length < 1) return
                // 递归找到该项
                let currItem = treeUtils.findItem(this.options, val, 'value')
                if (!currItem.children || (currItem.children.length > 0 && currItem.children[0].value)) return
                CompanyService.getCategoryTree({
                    id: val[val.length - 1]
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
