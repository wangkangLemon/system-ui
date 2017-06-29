<!--热词管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../utils/mixins/showDetail";
    @import "../../utils/mixins/common";
     .client-hotword-container {
        @extend %content-container;
        .add {
            @extend %right-top-btnContainer;
        }
        .block {
            margin-top: 10px;
            text-align: right;
        }
    }

</style>
<template>
    <article class="client-hotword-container">
        <!--添加Dialog-->
        <el-dialog title="添加" :visible.sync="dialogAdd">
            <el-form :model="hotword">
                <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input v-model="hotword.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input value='number' v-model="hotword.sort"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAdd = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改Dialog-->
        <el-dialog title="修改" :visible.sync="dialogChange">
            <el-form :model="hotword">
                <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input v-model="hotword.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input value='number' v-model="hotword.sort"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogChange = false">取 消</el-button>
                <el-button type="primary" @click="handleChange">确 定</el-button>
            </div>
        </el-dialog>
        <!--热词List-->
        <section>
            <el-button @click="showAddDialog" type="primary" icon="plus" class="add">添加</el-button>
        </section>
        <el-table v-loading="loading" border :data="data">
            <el-table-column prop="name" label="热词名称" width="300">
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="250">
            </el-table-column>
            <el-table-column prop="create_time_name" min-width='400'label="时间">
            </el-table-column>
            <el-table-column prop="cell" label="操作" width="250">
                <template scope="scope">
                    <el-button @click=" showChange(scope.row)" type="text" size="small">修改</el-button>
                    <el-button @click='handleDelete(scope.$index, scope.row)' type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--{{total}}-->
        <section class="block">
            <el-pagination @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page="fetchParam.page"
            :page-size="fetchParam.page_size"
            :page-sizes="[15, 30, 60, 100]" 
            layout="total, sizes, prev, pager, next, jumper" 
            :total="total">
            </el-pagination>
        </section>   
    </article>
</template>
<script>
import hotwordService from '../../services/hotwordService'

export default {
    data() {
        return {
            loading: true,
            dialogAdd: false, // 添加弹框
            dialogChange: false,  // 更改弹窗
            total: 0,
            data: [],
            formLabelWidth: '120px',
            hotword: {
                id: 0,
                name: '',
                sort: ''
            },
            fetchParam: {
                page: 1,
                page_size: 15
            },
        }
    },
    activated() {
        this.getdata()
    },
    methods: {
        initFetchParam() {
            this.fetchParam.page = 1
        },
        handleAdd() {  // 添 加
            hotwordService.addHotword(this.hotword).then(() => {
                xmview.showTip('success', '操作成功')
                this.clearDialog()
                this.getdata()
            })
            this.dialogAdd = false
        },
        showAddDialog() {
            this.dialogAdd = true
            this.clearDialog()
        },
        showChange(row) {  // 初始化 修改弹窗
            this.hotword.name = row.name
            this.hotword.sort = row.sort
            this.hotword.id = row.id
            this.dialogChange = true
        },
        handleChange() {
            hotwordService.changeHotword(this.hotword).then(() => {
                xmview.showTip('success', '操作成功')
                this.getdata()
                this.clearDialog()
            })
            this.dialogChange = false
        },
        handleDelete(index, row) {
            xmview.showDialog(`你将要删除 <span style="color:red">${row.name}</span> 该热词 确认吗?`, () => {
                hotwordService.delHotword(row.id).then(() => {
                    this.data.splice(index, 1)
                    xmview.showTip('success', '操作成功')
                })
            })
        },
        handleCurrentChange(val) {
            console.log(val)
            this.fetchParam.page = val
            this.getdata()
        },
        handleSizeChange(val) {
            this.fetchParam.page_size = val
            this.getdata()
        },
        clearDialog() { // 清除Dialog 数据
            this.hotword.name = ''
            this.hotword.sort = ''
            this.hotword.id = -1
        },
        getdata() {  // 获取数据
            hotwordService.getHotwordList(this.fetchParam).then((res) => {
                this.data = res.data.data
                this.total = res.data.total
                this.loading = false
                xmview.setContentLoading(false)
            })
        }
    }
}
</script>
