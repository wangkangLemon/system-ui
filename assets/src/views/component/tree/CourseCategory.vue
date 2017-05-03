<!--课程栏目-->

<template>
    <el-tree v-loading="loading" :data="data" :expand-on-click-node="false" @node-click="handleNodeClick"
             @node-expand="handleNodeExpand" :highlight-current="selectable"
             ref="container">
    </el-tree>
</template>

<script>
    import courseService from '../../../services/courseService'
    import treeUtils from '../../../utils/treeUtils'

    export default{
        props: {
            onNodeClick: Function,
            value: Array,
        },
        data () {
            return {
                data: this.value,
                loading: false,
                selectable: true
            }
        },
        watch: {
            'value' (val) {
                if (val.length != this.data.length) {
                    this.setCurrVal(val)
                }
            }
        },
        created () {
            if (!this.value || this.value.length < 1)
                this.initData()
        },
        deactivated () {
        },
        methods: {
            handleNodeExpand (data, node, nodeDom) {
                // 如果是有children 并且只有一个[加载中...]的一项 则去服务器加载数据
                if (data.children && data.children[0].value)
                    return

                courseService.getCategoryTree({id: data.value}).then(ret => {
                    ret.map((item) => {
                        item.label = item.name
                        item.value = item.id
                        item.item = item
                        item.children = item.has_children ? [{label: '加载中...'}] : null
                    })
                    data.children = ret
                })
            },
            handleNodeClick (data, node, store) {
                this.onNodeClick && this.onNodeClick(data, node, store)
                // 根节点无法被选中
                if (data.value == 0) return
                this.selectable = true
            },
            removeItem (item, parent) {
                // 父节点没有children 说明当前是根节点
                if (!parent.data.children) {
                    this.data = this.data.filter((curr) => {
                        return curr.value != item.value
                    })
                } else {
                    parent.data.children = parent.data.children.filter((curr) => {
                        return curr.value != item.value
                    })

                    if (parent.data.children.length < 1) parent.data.children = null
                }
                // 重新给父容器赋值  不然数据不同步
                this.$emit('input', this.data)
            },
            setCurrVal (val) {
                if (val === this.data) return
                this.data = val
                this.$emit('input', val)
            },
            initData () {
                this.loading = true
                return courseService.getCategoryTree({}).then(ret => {
                    this.setCurrVal(treeUtils.arr2Cascader(ret, 0, void 0, void 0, 'name', 'id'))
                    xmview.setContentLoading(false)
                }).then(() => {
                    this.loading = false
                    this.$forceUpdate()
                })
            },
            // 清空选中项
            clearSelected () {
                this.selectable = false
            }
        },
        components: {}
    }
</script>
