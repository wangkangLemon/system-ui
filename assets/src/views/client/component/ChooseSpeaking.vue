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
        <el-dialog :show-close="false" class="choose-speaking main-container" title="选取药我说" v-model="value">
            <section class="search">
                <section>
                    <i>标题</i>
                    <el-input @change="getSpeaking" v-model="search.keyword"></el-input>
                </section>
            </section>
            <el-table v-loading="loading" @row-click="selectCurrentSpeaking" border :data="data" :highlight-current-row="true">
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
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
            <span slot="footer" class="dialog-footer">
                <el-button @click="setValue">取 消</el-button>
                <el-button type="primary" @click="speakingConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </article>
</template>
<script>
    import speakingService from '../../../services/speaking/contentService'
    export default {
        props: ['value'],
        data () {
            return {
                currentData: null,
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
        created () {
            this.getSpeaking()
        },
        methods: {
            setValue () {
                this.$emit('input', false)
            },
            selectCurrentSpeaking (item) { // 选取课程 点击搜索之后的某一行存储当前选择的id 确定的时候调用
                this.currentData = item
            },
            speakingConfirm () {
                this.$emit('speakingResult', this.currentData)
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
