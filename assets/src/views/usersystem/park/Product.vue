<!--出售中-->
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
            <el-button type="success" icon="plus" @click="$router.push({name:'usersys-park-publishprod'})">发布商品</el-button>
        </article>

        <article class="search">
            <section>
                <i>商品编号</i>
                <el-input v-model="fetchParam.prodno" @keyup.enter.native="fetchData"></el-input>
            </section>

            <section>
                <i>商品名称</i>
                <el-input v-model="fetchParam.prodno" @keyup.enter.native="fetchData"></el-input>
            </section>

            <section>
                <i>商品类型筛选</i>
                <el-select v-model="fetchParam.prodno" placeholder="全部" :clearable="true">
                    <el-option label="积分乐园兑换" :value="1"></el-option>
                    <el-option label="月末签到奖励" :value="1"></el-option>
                    <el-option label="连续7天签到" :value="1"></el-option>
                    <el-option label="转盘抽奖" :value="1"></el-option>
                </el-select>
            </section>

            <section>
                <i>商品状态</i>
                <el-select v-model="fetchParam.prodno" placeholder="全部" :clearable="true">
                    <el-option label="上架" :value="1"></el-option>
                    <el-option label="下架" :value="0"></el-option>
                </el-select>
            </section>
        </article>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  border>
            <el-table-column
                    min-width="300"
                    prop="name"
                    label="商品">
            </el-table-column>
            <el-table-column
                    width="200"
                    prop="cat_name"
                    label="所需积分">
            </el-table-column>

            <el-table-column
                    width="80"
                    prop="score"
                    label="销量">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="limit_time_string"
                    label="库存剩余">
            </el-table-column>
            <!--<el-table-column-->
            <!--width="100"-->
            <!--label="状态">-->
            <!--<template scope="scope">-->
            <!--<el-tag v-if="scope.row.status == 0" type="success">正常</el-tag>-->
            <!--<el-tag v-else-if="scope.row.status == 2" type="primary">转码中</el-tag>-->
            <!--<el-tag v-else>已下线</el-tag>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column
                    width="100"
                    prop="create_time_name"
                    label="排序">
            </el-table-column>
            <el-table-column
                    width="120"
                    prop="create_time_name1"
                    label="商品有效期">
            </el-table-column>
            <el-table-column
                    width="207"
                    label="操作">
                <template scope="scope">
                    <div class="tab-oepratebtns">
                        <el-button type="text" size="small"  @click="()=>$router.push({name:'usersys-park-stock'})">库存</el-button>
                        <el-button type="text" size="small"
                                   @click="()=>$router.push({name:'usersys-park-sellingcount'})">销量
                        </el-button>
                        <el-button type="text" size="small">编辑</el-button>
                        <el-button type="text" size="small">下架</el-button>
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
    export default{
        data () {
            return {
                loadingData: false,
                data: [{}], // 表格数据
                total: 0,
                fetchParam: {
                    prodno: void 0, // 商品编号
                    page: 1,
                    page_size: 15,
                },
                selectedIds: []
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
            xmview.setContentLoading(false)
        },
        methods: {
            fetchData() {
            },
        }
    }
</script>
