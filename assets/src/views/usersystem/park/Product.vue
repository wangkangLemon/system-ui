<!--商品管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #usersys-integral-product {
        @extend %content-container;

        .manage-container {
            @extend %right-top-btnContainer;
        }

        .search {
            @extend %top-search-container;
        }

        .data-table {
            .el-button {
                margin-left: 2px;
            }
        }
    }
</style>

<template>
    <main id="usersys-integral-product">
        <article class="manage-container">
            <el-button type="success" icon="plus" @click="$router.push({name:'usersys-park-publishprod'})">
                发布商品  <!--a-->
            </el-button>
        </article>

        <article class="search">
            <section>
                <i>商品名称</i>
                <el-input v-model="fetchParam.name" @keyup.enter.native="fetchData"></el-input>
            </section>

            <section>
                <i>商品类型筛选</i>
                <ProdCategorySelect v-model="fetchParam.category" placeholder="全部"
                                    @change="fetchData"></ProdCategorySelect>
            </section>

            <section>
                <i>商品状态</i>
                <el-select v-model="fetchParam.status" placeholder="全部" @change="fetchData" :clearable="true">
                    <el-option label="上架" :value="0"></el-option>
                    <el-option label="下架" :value="1"></el-option>
                </el-select>
            </section>
        </article>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  border>
            <el-table-column
                    min-width="300"
                    label="商品">
                <template scope="scope">
                    <img :src="scope.row.image | fillImgPath" height="30" style="vertical-align: middle">
                    <i>{{scope.row.name}}</i>
                </template>
            </el-table-column>
            <el-table-column
                    width="200"
                    prop="price"
                    label="所需积分">
            </el-table-column>

            <el-table-column
                    width="80"
                    prop="order_count"
                    label="销量">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="stock_count"
                    label="库存剩余">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="sort"
                    label="排序">
            </el-table-column>
            <el-table-column
                    width="120"
                    prop="expire"
                    label="商品有效期">
                <template scope="scope">
                    {{scope.row.expire}}天 <!--a-->
                </template>
            </el-table-column>
            <el-table-column
                    width="100"
                    label="商品状态">
                <template scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="success">上架</el-tag>
                    <el-tag v-else>下架</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    width="180"
                    label="操作">
                <template scope="scope">
                    <div class="tab-oepratebtns">
                        <el-button type="text" size="small"
                                   @click="()=>$router.push({name:'usersys-park-stock', query: {prodId: scope.row.id},params: {prod: scope.row}})">库存
                            <!--a-->
                        </el-button>
                        <el-button type="text" size="small"
                                   @click="()=>$router.push({name:'usersys-park-sellingcount'})">销量 <!--a-->
                        </el-button>
                        <el-button type="text" size="small"
                                   @click="$router.push({name:'usersys-park-publishprod', query: {id: scope.row.id},params: {prod: scope.row}})">
                            编辑 <!--a-->
                        </el-button>
                        <el-button type="text" size="small" @click="disableProd(scope.row)">
                            {{scope.row.status === 0 ? '下架' : '上架'}}
                            <!--a-->
                        </el-button>
                    </div>
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
    </main>
</template>

<script>
    import parkService from '../../../services/usersystem/parkService'
    import ProdCategorySelect from '../../component/select/ProdCategory.vue'
    export default{
        data () {
            return {
                loadingData: false,
                data: [], // 表格数据
                total: 0,
                fetchParam: {
                    name: void 0,
                    status: void 0,
                    category: void 0,
                    page: 1,
                    page_size: 15
                },
            }
        },
        watch: {
            'fetchParam.page_size'() {
                this.fetchData()
            },
            'fetchParam.page'() {
                this.fetchData()
            },
        },
        activated () {
            this.fetchData()
        },
        methods: {
            fetchData() {
                this.loadingData = true
                parkService.prodSearch(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                }, () => {
                }).then(() => {
                    xmview.setContentLoading(false)
                    this.loadingData = false
                })
            },
            // 商品上下架
            disableProd (item) {
                this.loadingData = true
                let status = item.status === 0 ? 1 : 0
                parkService.prodDisable({id: item.id, status}).then(() => {
                    item.status = status
                }, () => {
                }).then(() => {
                    this.loadingData = false
                })
            }
        },
        components: {ProdCategorySelect}
    }
</script>
