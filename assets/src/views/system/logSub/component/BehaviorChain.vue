<style>
    .behavior-diff {
        overflow: hidden;
    }
</style>

<template>
    <el-dialog title="查看操作行为" v-model="isShow">
        <el-card class="box-card">
            <el-table
                    v-loading="loading"
                    border
                    :data="data"
                    @expand="expandRow">
                <el-table-column type="expand">
                    <template scope="props">
                        <el-row>
                            <el-col :span="12"><pre class="grid-content bg-purple behavior-diff" v-html="before"></pre></el-col>
                            <el-col :span="12"><pre class="grid-content bg-purple-light behavior-diff" v-html="after"></pre></el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="action"
                        width="100"
                        label="动作类型">
                </el-table-column>
                <el-table-column
                        prop="from"
                        label="动作名称">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="触发时间">
                </el-table-column>
            </el-table>
        </el-card>
    </el-dialog>
</template>

<script>
    import logService from '../../../../services/logService'

    export default {
        data () {
            return {
                loading: true,
                data: [],
                isShow: false,
                record_id: 0,
                before: '',
                after: '',
            }
        },
        created () {
            this.getData()
        },
        methods: {
            setRecord (id) {
                this.record_id = id
            },
            getData () {
                if (!this.record_id) {
                    return
                }
                this.isShow = true
                this.loading = true
                return logService.getBehaviorInfo({record_id: this.record_id}).then((ret) => {
                    this.data = ret.data.steps
                }).then(() => {
                    this.loading = false
                })
            },
            expandRow (row, expanded) {
                if (!row.before && !row.after) {
                    return
                }
                this.before = JSON.stringify(JSON.parse(row.before), null, 4)
                this.after = JSON.stringify(JSON.parse(row.after), null, 4)
            }
        }
    }
</script>
