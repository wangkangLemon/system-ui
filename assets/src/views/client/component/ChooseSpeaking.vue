<style lang="scss">
    @import "../../../utils/mixins/topSearch";
    .search {
        @extend %top-search-container;
    }
    .choose-speaking {
        .block {
            text-align: center !important;
            width: 50%;
            margin: 0 auto;
            margin-top: 10px;
        }
    }
</style>
<template>
    <article>
        <el-dialog class="choose-speaking main-container" title="选取药我说" :visible.sync="curValue">
            <section class="search">
                <section>
                    <i>标题</i>
                    <el-input @change="getSpeaking" v-model="search.keyword"></el-input>
                </section>
            </section>
            <el-table v-loading="loading" border :data="data" :highlight-current-row="true">
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
                <el-table-column prop="operate" label="类型" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="speakingConfirm(scope.row)">选取</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                        @size-change="val => {page_size = val; getSpeaking()}"
                        @current-change="val => {page = val; getSpeaking()}"
                        :total="total"
                        :current-page="page"
                        :page-size="page_size"
                        :page-sizes="[15, 30, 60, 100]"
                        layout="total, sizes, prev, pager, next">
                </el-pagination>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    import speakingService from '../../../services/speaking/contentService'
    export default {
        props: ['value'],
        data () {
            return {
                curValue: this.value,
                loading: false,
                search: {
                    keyword: ''
                },
                data: [],
                page: 1,
                page_size: 10,
                total: 0
            }
        },
        watch: {
            value (val) {
                this.curValue = val
            },
            curValue (val) {
                this.curValue = val
                this.$emit('input', val)
            }
        },
        created () {
            this.getSpeaking()
        },
        methods: {
            speakingConfirm (item) {
                this.$emit('speakingResult', item)
            },
            getSpeaking () {
                this.loading = true
                // 获取课程数据
                return speakingService.search({
                    keyword: this.search.keyword,
                    sender_type: 'system',
                    status: 0,
                    page: this.page,
                    page_size: this.page_size
                }).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
        }
    }
</script>
