<style lang='scss' scoped rel='stylesheet/scss'></style>

<template>
    <el-submenu :index="data.item.menu_url" v-if="data">
        <template slot="title"><i class="el-icon-message"></i>{{data.item.menu_name}}</template>

        <MenuTree v-for="item in hasChildCItems" :key="item.item.id" :data="item"></MenuTree>

        <el-menu-item :index="item.item.menu_url" v-for="item in leafChildren" :key="item.item.id">
            <i class="el-icon-menu"></i>
            {{item.item.menu_name}}
        </el-menu-item>
    </el-submenu>
</template>

<script lang='babel'>
    import MenuTree from './MenuTree.vue'
    export default{
        name: 'MenuTree',
        data () {
            return {
                leafChildren: [], // 叶子节点
                hasChildCItems: [], // 有子节点的item
            }
        },
        props: ['data'],
        created () {
            console.info(this.data)
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
