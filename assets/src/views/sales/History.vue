<!--流水记录-->
<style lang='scss' scoped rel='stylesheet/scss'>
    @import "../../utils/mixins/topSearch";

    #sales-history-container {
        padding: 15px;
    }

    .search {
        @extend %top-search-container;
    }
</style>

<template>
    <article id="sales-history-container">
        <article class="search"></article>
    </article>
</template>

<script lang='babel'>
    export default{
        data () {
            return {}
        }
    }
</script>
