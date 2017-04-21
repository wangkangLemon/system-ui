<!--首页导航-->
<style lang='scss' rel='stylesheet/scss'>
    .index-nav-container {
        background: #fff;
        border: 1px solid #ededed;

        .nav-list {
            padding: 20px 10px;
            border-bottom: 1px solid #ededed;
            letter-spacing: -3px;
            font-size: 0;
            > section {
                display: inline-block;
                vertical-align: top;
            }
            .nav-imgs {
                width: 86%;
                letter-spacing: -3px;
                font-size: 0;
                .nav-item {
                    width: 12.5%;
                    display: inline-block;
                    vertical-align: top;
                    text-align: center;
                    img {
                        width: 80px;
                        height: 80px;
                    }
                    p {
                        margin-top: 5px;
                        font-size: 14px;
                    }
                }
            }
            .nav-operate {
                width: 13%;
                text-align: center;
                margin-top: 20px;
            }
        }
    }
</style>
<template>
    <article class="index-nav-container">
        <article class="nav-list">
            <section class="nav-imgs">
                <div class="nav-item">
                    <img src="http://10.1.2.118/assets/app/images/menu/public.png" alt=""/>
                    <p>公开课</p>
                </div>
                <div class="nav-item">
                    <img src="http://10.1.2.118/assets/app/images/menu/public.png" alt=""/>
                    <p>公开课</p>
                </div>
                <div class="nav-item">
                    <img src="http://10.1.2.118/assets/app/images/menu/public.png" alt=""/>
                    <p>公开课</p>
                </div>
                <div class="nav-item">
                    <img src="http://10.1.2.118/assets/app/images/menu/public.png" alt=""/>
                    <p>公开课</p>
                </div>
                <div class="nav-item">
                    <img src="http://10.1.2.118/assets/app/images/menu/public.png" alt=""/>
                    <p>公开课</p>
                </div>
                <div class="nav-item">
                    <img src="http://10.1.2.118/assets/app/images/menu/public.png" alt=""/>
                    <p>公开课</p>
                </div>
                <div class="nav-item">
                    <img src="http://10.1.2.118/assets/app/images/menu/public.png" alt=""/>
                    <p>公开课</p>
                </div>
                <div class="nav-item">
                    <img src="http://10.1.2.118/assets/app/images/menu/public.png" alt=""/>
                    <p>公开课</p>
                </div>
            </section>
            <section class="nav-operate">
                <el-button type="text">启用</el-button>
                <el-button type="text">克隆</el-button>
                <el-button type="text">删除</el-button>
            </section>
        </article>
        <article class="nav-list">
            <section class="nav-imgs">
                <div class="nav-item">
                    <img src="http://10.1.2.118/assets/app/images/menu/public.png" alt=""/>
                    <p>公开课</p>
                </div>
                <div class="nav-item">
                    <img src="http://10.1.2.118/assets/app/images/menu/public.png" alt=""/>
                    <p>公开课</p>
                </div>
                <div class="nav-item">
                    <img src="http://10.1.2.118/assets/app/images/menu/public.png" alt=""/>
                    <p>公开课</p>
                </div>
                <div class="nav-item">
                    <img src="http://10.1.2.118/assets/app/images/menu/public.png" alt=""/>
                    <p>公开课</p>
                </div>
                <div class="nav-item">
                    <img src="http://10.1.2.118/assets/app/images/menu/public.png" alt=""/>
                    <p>公开课</p>
                </div>
                <div class="nav-item">
                    <img src="http://10.1.2.118/assets/app/images/menu/public.png" alt=""/>
                    <p>公开课</p>
                </div>
                <div class="nav-item">
                    <img src="http://10.1.2.118/assets/app/images/menu/public.png" alt=""/>
                    <p>公开课</p>
                </div>
                <div class="nav-item">
                    <img src="http://10.1.2.118/assets/app/images/menu/public.png" alt=""/>
                    <p>公开课</p>
                </div>
            </section>
            <section class="nav-operate">
                <el-button type="text">启用</el-button>
                <el-button type="text">克隆</el-button>
                <el-button type="text">删除</el-button>
            </section>
        </article>
        <!--<ImagEcropperInput v-show="0"></ImagEcropperInput>-->
    </article>
</template>
<script>
    import ImagEcropperInput from '../component/upload/ImagEcropperInput.vue'
    export default{
        created () {
            xmview.setContentLoading(false)
        },
        methods: {
            startCropper() {
                ImagEcropperInput.chooseImg()
            }
        },
        components: {ImagEcropperInput}
    }
</script>
