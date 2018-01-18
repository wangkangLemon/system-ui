<!--图文素材列表-->
<style lang='scss' rel='stylesheet/scss'>
    #im-yst-assistant-components-materiallist {
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
        }

        .imgSearch {
            display: flex;
            margin-bottom: 10px;
            > * {
                flex: 1;
            }

            .searchImg {
                text-align: right;
                width: 300px;
            }
        }
        .pagin {
            float: right;
            margin: 15px 0;
        }
    }
</style>

<template>
    <article id="im-yst-assistant-components-materiallist">
        <el-table v-loading="loadingData"
                  :data="material"
                  :fit="true"
                  border>
            <el-table-column
                    label="标题">
                <template slot-scope="scope">
                    <article class="material-title">
                        <img :src="scope.row.articles.length > 0 ? scope.row.articles[0].thumb: '' | fillImgPath">
                        <section>
                            <div v-for="item in scope.row.articles" v-text="item.title">
                            </div>
                        </section>
                    </article>
                </template>
            </el-table-column>
            <el-table-column
                    width="170"
                    label="创建时间">
                <template slot-scope="scope">
                    <i>{{scope.row.update_time | tamp2Str}}</i>
                </template>
            </el-table-column>
            <el-table-column
                    width="100"
                    label="操作"
                    fixed="right"
                    align="center">
                <template slot-scope="scope">
                    <el-button v-if="type == 0"
                               @click="$router.push({name:'im-ystAssistant-material', query:{id:scope.row.id}, params:{ articles:scope.row.articles }})"
                               type="text" size="small">
                        <i>编辑</i>
                    </el-button>
                    <el-button v-if="type == 0" @click="delMaterial(scope.$index, scope.row)" type="text" size="small">
                        <i>删除</i>
                    </el-button>

                    <el-button v-if="type == 1" @click="onSelected(scope.row)" type="text" size="small">
                        <i>选取</i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="pagin"
                       @size-change="val => {paramMaterial.page_size = val; fetchData()}"
                       @current-change="val => {paramMaterial.page = val; fetchData()}"
                       :current-page="paramMaterial.page"
                       :page-size="paramMaterial.page_size"
                       :page-sizes="[15, 30, 60, 100]"
                       layout="sizes,total, prev, pager, next"
                       :total="paramMaterial.total">
        </el-pagination>
    </article>
</template>

<script>
    import imService from '../../../../services/imService'
    export default{
        props: {
            type: {
                type: Number, // 0- 查看列表  1-选取数据
                default: 0
            },
            autoFetch: {
                type: Boolean,
                default: false
            },
            onSelected: Function
        },
        data () {
            return {
                paramMaterial: { // 图文列表的请求参数
                    page_size: 15,
                    page: 1,
                    total: 0,
                },
                material: [],
                loadingData: false,
            }
        },
        created () {
        },
        activated () {
        },
        watch: {
            'paramMaterial.page_size'() {
                this.fetchData()
            },
            'paramMaterial.page'() {
                this.fetchData()
            },
        },
        methods: {
            fetchData () {
                this.loadingData = true
                return imService.getMaterialList(this.paramMaterial).then((ret) => {
                    ret.data.map((item) => {
                        item.articles = JSON.parse(item.articles)
                    })
                    this.material = ret.data
                    this.paramMaterial.total = ret.total
                    this.loadingData = false
                })
            },
            // 删除图文素材
            delMaterial (index, row) {
                let title = row.articles.length > 0 ? row.articles[0].title : ''
                xmview.showDialog(`是否确认图文 <i style="color:red">${title}</i> 操作不可恢复确认吗?`, () => {
                    this.loadingData = true
                    imService.deleteMaterial({id: row.id}).then(() => {
                        this.material.splice(index, 1)
                        xmview.showTip('success', '操作成功!')
                        this.loadingData = false
                    })
                })
            },
        },
        components: {}
    }
</script>
