<!--已发送列表-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../../utils/mixins/common";
    @import "../../../../utils/mixins/topSearch";

    #im-ystassis-comp-sendlist {
        @extend %content-container;

        .search {
            @extend %top-search-container;
        }
        .material-title {
            > * {
                display: inline-block;
                vertical-align: top;
                padding: 5px;
            }

            img {
                width: 50px;
                height: 50px;
            }

            .newsinfo {
                a {
                    color: #50bfff;
                }
                > div {
                    font-size: 13px;
                }
            }
        }
    }
</style>

<template>
    <article id="im-ystassis-comp-sendlist">
        <article class="search">
            <section><i>类型</i>
                <el-select v-model="fetchParam.type" @change="fetchData" :clearable="true">
                    <el-option value="" label="全部"></el-option>
                    <el-option value="text" label="文本"></el-option>
                    <el-option value="news" label="图文"></el-option>
                    <el-option value="image" label="图片"></el-option>
                </el-select>
            </section>
            <section><i>发送对象</i>
                <el-select v-model="fetchParam.receiver" @change="fetchData" :clearable="true">
                    <el-option value="" label="全部"></el-option>
                    <el-option value="manager" label="店长"></el-option>
                    <el-option value="employee" label="店员"></el-option>
                    <el-option value="custom" label="自定义"></el-option>
                </el-select>
            </section>

            <DateRange title="日期查找" :start="fetchParam.time_start" :end="fetchParam.time_end"
                       @changeStart="val=> fetchParam.time_start=val "
                       @changeEnd="val=> fetchParam.time_end=val" :change="fetchData">
            </DateRange>
        </article>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  border>
            <el-table-column
                    prop="name"
                    label="消息">
                <template slot-scope="scope">
                    <!--文字-->
                    <div v-if="scope.row.text">{{scope.row.text.content}}</div>
                    <!--图片-->
                    <article class="material-title" v-if="scope.row.image">
                        <img :src="scope.row.image.thumb_url | fillImgPath">
                        <section>
                            <div v-text="scope.row.image.name"></div>
                        </section>
                    </article>
                    <!--图文-->
                    <article class="material-title" v-if="scope.row.articles">
                        <img :src="scope.row.articles.length > 0 ? scope.row.articles[0].thumb: '' | fillImgPath">
                        <section>
                            <div v-for="item in scope.row.articles" class="newsinfo">
                                <a :href="item.source_url" v-text="item.title" target="_blank"></a>
                                <div>阅读: {{item.hits}}</div>
                            </div>
                        </section>
                    </article>
                </template>
            </el-table-column>
            <el-table-column
                    width="80"
                    label="对象">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.receiver == 'all'" type="success">全部</el-tag>
                    <el-tag v-else-if="scope.row.receiver == 'manager'" type="primary">店长</el-tag>
                    <el-tag v-else-if="scope.row.receiver == 'custom'" type="warning">自定义</el-tag>
                    <el-tag v-else>店员</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    width="80"
                    label="成功数">
                    <template slot-scope="scope">
                        <el-tooltip v-if="scope.row.receiver_mobile" class="item" 
                            effect="dark" :content="scope.row.receiver_mobile" 
                            placement="top-start">
                                <i>{{scope.row.success_count}}</i>
                        </el-tooltip>
                        <i v-else>{{scope.row.success_count}}</i>
                    </template>
            </el-table-column>
            <el-table-column
                    width="160"
                    prop="create_time"
                    label="时间">
            </el-table-column>
            <el-table-column
                    width="80"
                    label="操作"
                    fixed="right"
                    align="center">
                <template slot-scope="scope">
                    <el-button @click="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagin"
                       @size-change="val => fetchParam.page_size = val "
                       @current-change="val => fetchParam.page = val"
                       :current-page="fetchParam.page"
                       :page-size="fetchParam.page_size"
                       :page-sizes="[15, 30, 60, 100]"
                       layout="sizes,total, prev, pager, next"
                       :total="total">
        </el-pagination>
    </article>
</template>

<script>
    import imService from '../../../../services/imService'
    import DateRange from '../../../component/form/DateRangePicker.vue'

    export default{
        data () {
            return {
                data: [],
                total: 0,
                loadingData: false,
                fetchParam: {
                    page: 1,
                    page_size: 15,
                    type: void 0,
                    receiver: void 0,
                    time_start: void 0,
                    time_end: void 0
                }
            }
        },
        activated () {
        },
        watch: {
            'fetchParam.page_size'() {
                this.fetchData()
            },
            'fetchParam.page'() {
                this.fetchData()
            }
        },
        methods: {
            fetchData () {
                this.loadingData = true
                return imService.getMassSendedMList(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                })
            },
            del (index, row) {
                xmview.showDialog(`你要执行删除操作并且不可恢复确认吗?`, () => {
                    this.loadingData = true
                    imService.delMassSended(row.id).then(() => {
                        this.data.splice(index, 1)
                        xmview.showTip('success', '操作成功!')
                        this.loadingData = false
                    })
                })
            }
        },
        components: {DateRange}
    }
</script>
