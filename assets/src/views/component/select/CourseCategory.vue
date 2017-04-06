<!--课程栏目-->
<template>
    <el-cascader
            :options='options' :show-all-levels="false"
            @active-item-change="handleItemChange"
            :clearable="true"
            @change="setCurrVal"
    ></el-cascader>
</template>

<script>
    import treeUtils from '../../../utils/treeUtils'
    import authUtils from '../../../utils/authUtils'
    import courseService from '../../../services/courseService'
    export default{
        props: {
            value: [String, Number],
            onchange: Function,
        },
        data () {
            return {
                options: [],
                currVal: this.value,
                companyid: void 0, // 企业id
            }
        },
        created () {
            this.companyid = authUtils.getUserInfo().company_id
            courseService.getCategoryTree({companyid: this.companyid})
                .then(ret => {
                    this.options = treeUtils.arr2Cascader(ret, 0, void 0, void 0, 'name', 'id')
                })
        },
        activated () {
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
                courseService.getCategoryTree({companyid: this.companyid, id: val[val.length - 1]})
                    .then(ret => {
                        // 重新组合数据
                        ret.map((item) => {
                            item.label = item.name
                            item.value = item.id
                            item.children = item.has_children ? [{label: '加载中...'}] : null
                        })
                        currItem.children = ret
                    })
            },
        },
        components: {}
    }
</script>
