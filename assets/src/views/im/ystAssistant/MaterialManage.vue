<!--素材管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";

    #im-ystassistant-materiamanage {
        @extend %content-container;
        padding: 0;
    }
</style>

<template>
    <article id="im-ystassistant-materiamanage">
        <el-tabs type="border-card" @tab-click="tabClick" value="first">
            <el-tab-pane label="图文" name="first">
                <el-button @click="$router.push({name:'im-ystAssistant-material'})" type="primary"
                           style="margin-bottom: 10px">
                    <i>新建</i>
                </el-button>
                <MaterialList ref="materiallist"></MaterialList>
            </el-tab-pane>
            <!--==========================华丽的分割线====================-->
            <el-tab-pane label="图片" name="second">
                <ImgList ref="imgList"></ImgList>
            </el-tab-pane>
        </el-tabs>
    </article>
</template>

<script>
    import MaterialList from './components/MaterialList.vue'
    import ImgList from './components/ImgList.vue'
    export default{
        data () {
            return {}
        },
        activated () {
            this.$refs.materiallist.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            tabClick (tab) {
                if (tab.name === 'first') this.$refs.materiallist.fetchData()
                else this.$refs.imgList.fetchData()
            }
        },
        components: {MaterialList, ImgList}
    }
</script>
