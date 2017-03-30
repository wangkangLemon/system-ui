<!--封装 el-card 修改其中的样式 -->
<style lang='scss' rel='stylesheet/scss'>

</style>

<template>
    <el-card class="box-card" >
        <div slot="header" class="clearfix">
            <span>工业分析</span>
        </div>
        <div v-for="o in 4" class="text item">
            {{'列表内容 ' + o }}
        </div>
    </el-card>
</template>

<script lang='babel'>
    export default{}
</script>