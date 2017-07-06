<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    .left-menu-container {
        .fa {
            margin-right: 5px;
        }
    }
</style>

<template>
    <el-submenu :index="data.item.menu_url" v-if="data && data.children != null">
        <template slot="title">
            <i class="fa" :class="icons[data.item.menu_icon]" v-if="data.item.parent_id == 0"></i>
            <i class="fa fa-th-large" v-else></i>
            {{data.item.menu_name}}
        </template>

        <MenuTree v-for="item in hasChildCItems" :key="item.item.id" :data="item"></MenuTree>

        <el-menu-item :index="item.item.menu_url" v-for="item in leafChildren" :key="item.item.id">
            <i class="fa fa-circle-o"></i>
            {{item.item.menu_name}}
        </el-menu-item>
    </el-submenu>

    <el-menu-item :index="data.item.menu_url" v-else-if="data && data.children == null">
        <i class="fa" :class="icons[data.item.menu_icon]"></i>
        {{data.item.menu_name}}
    </el-menu-item>
</template>

<script>
    import MenuTree from './MenuTree.vue'
    export default{
        name: 'MenuTree',
        data () {
            return {
                leafChildren: [], // 叶子节点
                hasChildCItems: [], // 有子节点的item
            }
        },
        props: ['data', 'icons'],
        created () {
            let hasChildCItems = []
            let leafChildren = []
            if (this.data.children) {
                this.data.children.forEach((item) => {
                    if (item.children != null)
                        hasChildCItems.push(item)
                    else
                        leafChildren.push(item)
                })
            }

            this.hasChildCItems = hasChildCItems
            this.leafChildren = leafChildren
        },
        components: {MenuTree}
    }
</script>
