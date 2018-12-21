<template>
    <el-tree :data="data" 
    node-key="id" 
    ref="tree"
    @node-click='handleNodeClick'
    highlight-current 
    :props="defaultProps">
    </el-tree>
</template>



<script>
export default {
    props: {
        value: Array
    },
    data() {
        return {
            data: this.value,
            defaultProps: {
                children: 'children',
                label: 'label'
            },
        }
    },
    methods: {
        handleNodeClick(data, node, self) {
            this.$emit('onNodeClick', data, node, self)
        },
              // 删除子节点
        removeItem(item) {
            this.$refs.tree.store.remove(item)
            this.$emit('input', this.data)
        },
        addItem({id, label, children}, parent) { // 没有parent 加到 根节点
            parent ? this.$refs.tree.store.append({id, label, children}, parent)
            : this.$refs.tree.store.append({id, label, children})
            this.$emit('input', this.data)
        },
        setCurrVal (val) {
            this.data = val
            this.$emit('input', val)
        },
    },
    watch: {
        'value' (val) {
            this.setCurrVal(val)
        }
    },

}
</script>
