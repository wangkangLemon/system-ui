<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/showDetail";
    .content-show-container {
        background: #fff;
        padding: 20px;
        .show-detail {
            h2 {
                text-align: center;
                margin-bottom: 10px;
            }
            .info {
                border: 1px solid #ededed;
                p {
                    line-height: 35px;
                }
            }
        }
    }
</style>
<template>
    <article class="content-show-container">
        <!--详情-->
        <section class="show-detail" v-if="currentItem">
            <h2>{{currentItem.data.title}}</h2>
            <div class="info" ref="info"></div>
        </section>
        <screenImg></screenImg>
    </article>
</template>
<script>
    import articleService from '../../../services/articleService'
    import screenImg from '../../component/dialog/FullScreenImg.vue'
    export default {
        components: {
            screenImg
        },
        data () {
            return {
                currentItem: null,
            }
        },
        computed: {
            contentID () {
                return this.$route.params.content_id
            }
        },
        activated () {
            articleService.getArticleDetail({article_id: this.contentID}).then((ret) => {
                this.currentItem = ret
                this.$nextTick(() => {
                    this.$refs.info.innerHTML = ret.data.content
                    let images = this.$refs.info.querySelectorAll('img')
                    if (images == null) return
                    Array.from(images).forEach((item) => {
                        item.addEventListener('click', function () {
                            screenImg.setShow(this.getAttribute('src'))
                        })
                    })
                })
            }).then(() => {
                xmview.setContentBack(true)
                xmview.setContentLoading(false)
            })
        }
    }
</script>
