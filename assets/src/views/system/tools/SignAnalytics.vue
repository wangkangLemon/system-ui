<!--系统-工具-签约信息统计 For 邮件日报-->
<style lang='scss' rel="stylesheet/scss">
@import "../../../utils/mixins/common";
@import "../../../utils/mixins/showDetail";
#system-tools-sign-analytics-container {
    @extend %content-container;
    .header-button {
        @extend %right-top-btnContainer;
    }
    .block {
        text-align: right;
        margin-top: 10px;
    }
}
</style>
<template>
    <main id="system-tools-sign-analytics-container">
        <div>签约信息</div>
        <el-form :inline="true" :model="data" class="demo-form-inline">
            <el-form-item label="门店总数">
                <el-input v-model="data.department_total" placeholder="门店总数"></el-input>
            </el-form-item>
            <el-form-item label="今日新增">
                <el-input v-model="data.department_today" placeholder="今日新增"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </main>
</template>

<script>
import ToolsService from '../../../services/system/toolsService'
export default {
    name: 'system-tools-signanalytics',
    components: {},
    data() {
        return {
            data: {
                department_total: 0,
                department_today: 0,
                department_yesterday: 0,
                user_today: 0,
                user_total: 0,
                user_yesterday: 0,
            }
        }
    },
    created() {
        this.getData().then(() => {
            xmview.setContentLoading(false)
        })
    },
    activated() {
        this.getData().then(() => {
            xmview.setContentLoading(false)
        })
    },
    methods: {
        getData() {
            return ToolsService.getSignAnalytics().then((ret) => {
                this.data.department_total = ret.data.department_total
            })
        },
        onSubmit() {

        }
    }

}
</script>
