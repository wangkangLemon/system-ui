<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    .left-menu-container {
        .menu-icon {
            width: 15px;
            height: 15px;
            position: relative;
            top: 2px;
            margin-right: 2px;
        }
    }
</style>

<template>
    <el-submenu :index="data.item.menu_url" v-if="data && data.children != null">
        <template slot="title">
            <img class="menu-icon" :src="icons[data.item.menu_icon]" v-if="data.item.parent_id == 0"/>
            <i class="el-icon-message" v-else></i>
            {{data.item.menu_name}}
        </template>

        <MenuTree v-for="item in hasChildCItems" :key="item.item.id" :data="item"></MenuTree>

        <el-menu-item :index="item.item.menu_url" v-for="item in leafChildren" :key="item.item.id">
            <i class="el-icon-menu"></i>
            {{item.item.menu_name}}
        </el-menu-item>
    </el-submenu>

    <el-menu-item :index="data.item.menu_url" v-else-if="data && data.children == null">
        <img class="menu-icon" :src="icons[data.item.menu_icon]"/>
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
