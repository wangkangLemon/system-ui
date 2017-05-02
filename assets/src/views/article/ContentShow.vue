<style lang="scss" rel="stylesheet/scss">
    @import "../../utils/mixins/showDetail";
    .content-show-container {
        background: #fff;
        padding: 20px;
        .show-detail {
            h2 {
                text-align: center;
            }
            .info {
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
    </article>
</template>
<script>
    import articleService from '../../services/articleService'
    export default {
        data () {
            return {
                currentItem: null
            }
        },
        computed: {
            contentID () {
                return this.$route.params.id
            }
        },
        created () {
            articleService.getArticleDetail({article_id: this.contentID}).then((ret) => {
                this.currentItem = ret
                this.$nextTick(() => {
                    this.$refs.info.innerHTML = ret.data.content
                })
                xmview.setContentTile(`${ret.category.name}`)
            }).then(() => {
                xmview.setContentLoading(false)
            })
        }
    }
</script>
