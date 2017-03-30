<style lang='scss' scoped rel='stylesheet/scss'>
    .container {
        padding: 15px;
    }

    // 头部晒单和返现的container
    .shaidan-fanxian-container {
    }
</style>

<template>
    <article class="container">
        <el-row class="shaidan-fanxian-container" :gutter="20">
            <el-col :span="12">
                <AmountPanel title="今日晒单" content="0" footer="累计晒单 5" bgColor="#348fe2">
                </AmountPanel>
            </el-col>
            <el-col :span="12">
                <AmountPanel title="今日返现" content="0.00" footer="累计返现 133.58" bgColor="#00acac">
                </AmountPanel>
            </el-col>
        </el-row>
    </article>
</template>

<script lang='babel'>
    import AmountPanel from '../component/panel/AmountPanel.vue'
    export default{
        components: {AmountPanel}
    }
</script>
