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
            <h2>{{this.currentItem.title}}</h2>
            <div class="info" ref="info">{{this.currentItem.content}}</div>
        </section>
        <screenImg></screenImg>
    </article>
</template>
<script>
    import companyService from '../../../services/companyService'
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
            announceID () {
                return this.$route.params.announce_id
            }
        },
        activated () {
            companyService.getAnnounceView({announce_id: this.announceID}).then((ret) => {
                this.currentItem = ret.data
            }).then(() => {
                xmview.setContentBack(true)
                xmview.setContentLoading(false)
            })
        }
    }
</script>
