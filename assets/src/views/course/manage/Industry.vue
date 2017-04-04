<!--工业课-->
<!--公开课管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #course-manage-industry-container {
        @extend %content-container;

        .manage-container {
            position: absolute;
            right: 0;
            top: -50px;
            > * {
                color: #fff;
                border-radius: 5px;
            }

            // 添加课程
            .add {
                background: rgb(0, 204, 255);
            }

            // 管理栏目
            .catmange {
                background: rgb(153, 102, 204);
            }
        }

        .search {
            @extend %top-search-container;
        }

        // 底部的管理按钮
        .bottom-manage {
            margin-top: 15px;
        }
    }
</style>

<template>
    <article id="course-manage-industry-container">
    </article>
</template>

<script>
    export default{
        data () {
            return {}
        },
        created () {
        },
        methods: {},
        components: {}
    }
</script>
