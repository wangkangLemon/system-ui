<!--课程栏目-->
<template>
    <el-cascader ref="container" v-loading="loading"
                 :options='options' :show-all-levels="false"
                 :placeholder="placeholder"
                 @active-item-change="handleItemChange"
                 :clearable="true"
                 @change="setCurrVal"
    ></el-cascader>
</template>

<script>
    import treeUtils from '../../../utils/treeUtils'
    import courseService from '../../../services/courseService'
    export default{
        props: {
            value: [String, Number, Array],
            autoClear: {
                type: Boolean,
                default: false
            },
            onchange: Function,
            placeholder: {
                type: String,
                default: '请选择'
            },
        },
        data () {
            return {
                loading: false,
                options: [],
                currVal: this.value,
                companyid: void 0, // 企业id
                lastData: void 0,
            }
        },
        watch: {
            'value' (val) {
                this.setCurrVal(val)
            },
            'currVal' (val, old) {
                this.$emit('input', val.length > 0 ? parseInt(val[val.length - 1]) : val)
                this.onchange && this.onchange(val)
            }
        },
        mounted () {
            this.$refs.container.$el.addEventListener('click', () => {
                if (this.loading || this.options.length > 0) return
                if (this.lastData) {
                    this.options = this.lastData
                } else {
                    this.loading = true
                    courseService.getCategoryTree({companyid: this.companyid})
                        .then(ret => {
                            this.options = treeUtils.arr2Cascader(ret, 0, void 0, void 0, 'name', 'id')
                            this.loading = false
                        })
                }
            })
        },
        deactivated () {
            if (this.autoClear && this.options.length > 0) {
                this.lastData = this.options
                this.options = []
            }
        },
        activated () {
        },
        methods: {
            setCurrVal (val) {
                if (this.currVal == val || !val) return
                this.currVal = val
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
            clearData () {
                this.lastData = this.options
                this.options = []
            }
        },
        components: {}
    }
</script>
