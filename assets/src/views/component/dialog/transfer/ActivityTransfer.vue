<!-- 打包 -->
<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #yshi-activity-transfer-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
    }
</style>

<template>
    <main id="yshi-activity-transfer-container">
        <Transfer
            ref="transfer"
            placeholder="搜索"
            :loading="loading"
            :type="type"
            :current-page="fetchParam.page"
            :page-size="fetchParam.page_size"
            :total="total"
            :data="data"
            v-model="selected"
            :showSelectedData="false"
            @curRow="getCurRow"
            @select-all="getSelectAll"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
            @searchFn="handleTransferSearch">
        </Transfer>
    </main>
</template>

<script>
    import activityService from 'services/yshi/activityService'
    import Transfer from 'components/dialog/Transfer2.vue'

    export default {
        components: {
            Transfer
        },
        props: {
            taskType: Number,
            type: {
                type: [Number, String],
                required: false,
            },
            value: {
                type: Array,
                default: () => {
                    return []
                }
            },
            showSelectedData: {
                type: Boolean,
                default: false
            }
        },
        activated () {},
        created () {
            this.fetchParam = this.initFetchParam()
            this.fetchData()
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                loading: false,
                fetchParam: this.initFetchParam(),
                selected: this.value,
                data: [],
                total: 0,
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return activityService.searchActivity(this.fetchParam).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            },
            handlePageChange (val) {
                this.fetchParam.page = val
                this.fetchData()
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            handleTransferSearch (val) {
                this.fetchParam.page = 1
                this.data = []
                this.fetchParam.name = val
                this.fetchData()
            },
            getCurRow (row, all) {
                if (this.type) {
                    row.type = this.type
                    row.taskType = this.taskType
                    this.$emit('curRow', row, all)
                }
            },
            getSelectAll (selection) {
                selection.forEach(sel => {
                    this.getCurRow(sel, true)
                })
            },
            initFetchParam () {
                return {
                    name: '',
                    // status: 0,
                    page: 1,
                    page_size: 15
                }
            }
        },
        filters: {},
        directives: {},
    }
</script>
