<!--分类管理-->
<style lang='scss' scoped rel="stylesheet/scss">
    @import "../../utils/mixins/mixins";
    @import "../../utils/mixins/table";

    .classify-container {
        margin-top: 20px;
        @extend %justify;
        .left-content {
            display: inline-block;
            vertical-align: top;
            width: 35%;

            .el-icon-plus {
                margin-right: 10px;
            }
            .el-tree {
                width: auto;
                margin-top: 10px;
            }
        }

        .right-content {
            width: 62%;
            display: inline-block;
            vertical-align: top;
            padding-bottom: 20px;

        }
    }

</style>
<template>
    <article class="classify-container">
        <section class="left-content">
            <el-button type="primary"><i class="el-icon-plus"></i>添加分类</el-button>

            <el-tree class="leftSubTree" :highlight-current="true" :data="leftSubTreeData"
                     :props="defaultProps" @node-click="leftClassifyClick"></el-tree>
        </section>
        <section class="right-content">
            <el-tabs type="border-card">
                <el-tab-pane label="修改分类">用户管理</el-tab-pane>
                <el-tab-pane label="添加子分类">配置管理</el-tab-pane>
                <el-tab-pane label="移动分类">角色管理</el-tab-pane>
                <el-tab-pane label="移动内容">定时任务补偿</el-tab-pane>
            </el-tabs>
        </section>
    </article>
</template>
<script lang="babel">
    export default {
        data () {
            return {
                leftSubTreeData: [
                    {
                        id: 1,
                        label: '一级 1',
                        children: [
                            {
                                id: 2,
                                label: '二级 1-1',
                                children: [
                                    {
                                        id: 3,
                                        label: '三级 1-1-1'
                                    }
                                ]
                            }
                        ]
                    },
                    { // 左侧分类数据
                        label: '一级 2'
                    }
                ],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
            }
        },
        methods: {
            leftClassifyClick (item) { // 左侧列表按照分类搜索
                console.log('调用接口数据 并赋值给blockData')
                this.currentClass = item.label
            },
        }
    }
</script>
