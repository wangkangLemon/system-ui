<!--数据总览的面板-->
<style lang='scss' scoped rel='stylesheet/scss'>
    .grid-content {
        width: 100%;
        height: 125px;
        border-radius: 5px;
        padding: 15px;
        position: relative;
        color: rgba(255, 255, 255, .6);

        > * {
            display: block;
        }

        h5 {
            font-size: 12px;
        }

        em {
            font-size: 24px;
            font-weight: 300;
            color: #fff;
            margin: 8px 0;
        }

        hr {
            border-color: rgba(0, 0, 0, 0.2);
            width: 100%;
            position: absolute;
            left: 0;
        }
        i {
            margin-top: 22px;
        }
    }
</style>

<template>
    <div class="grid-content" :style="{ 'background-color': bgColor }">
        <h5>{{title}}</h5>
        <em>{{content}}</em>
        <hr>
        <i>{{footer}}</i>
    </div>
</template>

<script lang='babel'>
    export default{
        props: ['title', 'content', 'footer', 'bgColor']
    }
</script>
