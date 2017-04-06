<!--课程栏目-->

<template>
    <el-tree :data="data" :expand-on-click-node="false" @node-click="handleNodeClick" @node-expand="handleNodeExpand"
             ref="container"></el-tree>
</template>

<script>
    import courseService from '../../../services/courseService'
    import treeUtils from '../../../utils/treeUtils'

    export default{
        props: {
            onNodeClick: Function
        },
        data () {
            return {
                data: [],
                allNodes: [],
            }
        },
        activated () {
            courseService.getCategoryTree({}).then(ret => {
                this.data = treeUtils.arr2Cascader(ret, 0, void 0, void 0, 'name', 'id')
                xmview.setContentLoading(false)
            }).then(() => {
                return this.setAllNodes()
            })
        },
        deactivated () {
            this.allNodes = null
        },
        methods: {
            // 设置所有的tree节点
            setAllNodes () {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.allNodes = [...this.$refs.container.$el.querySelectorAll('.el-tree-node__content')]
                    }, 0)
                })
            },
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
                }).then(() => {
                    this.setAllNodes()
                })
            },
            handleNodeClick (data, node, store) {
                this.onNodeClick && this.onNodeClick(data)
                // 根节点无法被选中
                if (data.value == 0) return
                this.allNodes.map((item) => {
                    item.style.background = '#ffffff'
                })
                store.$el.querySelector('.el-tree-node__content').style.background = 'rgb(228, 233, 241)'
            },
            init () {

            }
        },
        components: {}
    }
</script>
