<!--课程栏目-->
<template>
    <el-cascader
            :options='options'
            v-model="selectedOptions" :show-all-levels="false"
            @active-item-change="handleItemChange"
            @change="handleChange"
    ></el-cascader>
</template>

<script>
    import treeUtils from '../../../utils/treeUtils'
    import authUtils from '../../../utils/authUtils'
    import courseService from '../../../services/courseService'
    export default{
        props: {
            value: [String, Number],
            onchange: Function
        },
        data () {
            return {
                options: [],
                currVal: this.value,
                selectedOptions: [],
                companyid: void 0, // 企业id
            }
        },
        watch: {
            'value'(val) {
                val !== this.currVal && this.setCurrVal(val)
            },
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
                this.currVal = val
                this.$emit('input', val)
            },
            handleItemChange (val) {
                if (val.length < 1) return
                // 递归找到该项
                let currItem = treeUtils.findItem(this.options, val, 'value')

                if (!currItem.children || currItem.children.length > 0) return
                courseService.getCategoryTree({companyid: this.companyid, id: val[val.length - 1]})
                    .then(ret => {
                        // 重新组合数据
                        ret.map((item) => {
                            item.label = item.name
                            item.value = item.id
                            item.children = item.has_children ? [] : null
                        })
                        currItem.children.push(...ret)
                    })
            },
            handleChange (val) {
                this.onchange && this.onchange(val)
            }
        },
        components: {}
    }
</script>
