<!--栏目管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";

    #course-manage-coursecategory {
        @extend %content-container;

        > section {
            display: inline-block;
        }
        .left-container {
            width: 300px;
            border-right: 1px solid #ededed;
        }
    }
</style>

<template>
    <article id="course-manage-coursecategory" ref="container">
        <section class="left-container">
            <el-tree :data="data" @node-click="handleNodeClick"  :render-content="renderContent"></el-tree>
        </section>

        <section class="right-container"></section>
    </article>
</template>

<script>
    import courseService from '../../../services/courseService'
    import treeUtils from '../../../utils/treeUtils'

    export default{
        data () {
            return {
                data: []
            }
        },
        activated () {
            courseService.getCategoryTree({}).then(ret => {
                this.data = treeUtils.arr2Cascader(ret, 0, void 0, void 0, 'name', 'id')
                xmview.setContentLoading(false)
            })
        },
        methods: {
            handleNodeClick (data, node, nodeDom) {
                // 如果是有children 并且只有一个[加载中...]的一项 则去服务器加载数据
                if (data.children && !data.children[0].value) {
                    courseService.getCategoryTree({id: data.value}).then(ret => {
                        ret.map((item) => {
                            item.label = item.name
                            item.value = item.id
                            item.children = item.has_children ? [{label: '加载中...'}] : null
                        })
                        data.children = ret
                    })
                } else if (!data.children) { // 否则就是选中了叶子节点
                    [...this.$refs.container.querySelectorAll('.el-tree-node__expand-icon.is-leaf')].map((item) => {
                        item.parentNode.parentNode.style.background = '#ffffff'
                    })
                    nodeDom.$el.style.background = 'rgb(228, 233, 241)'
                }
            },
            renderContent(h, { node, data, store }) {
            }
        },
        components: {}
    }
</script>
