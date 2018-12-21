<!--课程栏目-->

<template>
    <OperatableTree 
        v-model="data" 
        ref="tree" 
        @onNodeClick="handleNodeClick" 
        :getData="getData">
    </OperatableTree>
</template>

<script>
    import articleService from 'services/articleService'
    import goodsService from 'services/yshi/goodsService'
    import OperatableTree from './OperatableTree.vue'

    export default{
        props: {
            onNodeClick: Function,
            value: Array,
            type: String,  // goods | article
        },
        data () {
            return {
                data: this.value,
            }
        },
        watch: {
            'value' (val) {
                if (val.length != this.data.length) {
                    this.setCurrVal(val)
                }
            },
            'data' (val) {
                this.$emit('input', val)
            }
        },
        methods: {
            handleNodeClick ({data, node, store}) {
                this.onNodeClick && this.onNodeClick(data, node, store)
            },
            removeItem (item, parent) {
                this.$refs.tree.removeItem(item, parent)
            },
            setCurrVal (val) {
                if (val === this.data) return
                this.data = val
                this.$emit('input', val)
            },
            // 给子元素获取数据的方法
            getData (params) {
                let service
                switch (this.type) {
                    case 'article':
                        service = articleService
                        break
                    case 'goods':
                        service = goodsService
                        break
                }
                return service.getCategoryTree(params)
            },
            // 初始化数据, 可以将数据重置
            initData () {
                this.$refs.tree.initData()
            },
            // 清空选中项
            clearSelected () {
                this.$refs.tree.clearSelected()
            }
        },
        components: {OperatableTree}
    }
</script>
