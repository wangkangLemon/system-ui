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
    .form-footer {
        text-align: center;
    }
}
</style>
<template>
    <main id="system-tools-sign-analytics-container">
        <el-form :model="data" :rules="rules" ref="form">
            <el-row>
                <el-col :span="2">
                    <el-form-item prop="" label="门店统计">
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item prop="department_total" label="门店总数" :label-width="labelWidth">
                        <el-input v-model="data.department_total" placeholder="门店总数"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item prop="department_today" label="今日新增" :label-width="labelWidth">
                        <el-input v-model="data.department_today" placeholder="今日新增"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item prop="department_yesterday" label="昨日新增" :label-width="labelWidth">
                        <el-input v-model="data.department_yesterday" placeholder="昨日新增"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="1"></el-col>
            </el-row>

            <el-row>
                <el-col :span="2">
                    <el-form-item prop="" label="店员统计">
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item prop="user_total" label="店员总数" :label-width="labelWidth">
                        <el-input v-model="data.user_total" placeholder="店员总数"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item prop="user_today" label="今日新增" :label-width="labelWidth">
                        <el-input v-model="data.user_today" placeholder="今日新增"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item prop="user_yesterday" label="昨日新增" :label-width="labelWidth">
                        <el-input v-model="data.user_yesterday" placeholder="昨日新增"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="1"></el-col>
            </el-row>

            <div class="form-footer">
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>

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
                user_total: 0,
                user_today: 0,
                user_yesterday: 0,
            },
            rules: {
                department_total: [
                    { required: true, message: '必须填写', trigger: 'blur' }
                ],
                user_total: [
                    { required: true, message: '必须填写', trigger: 'blur' }
                ],
            },
            labelWidth: '100px',
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
                this.data = ret.data
            })
        },
        submit(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    ToolsService.setSignAnalytics(this.data).then((ret) => {
                        xmview.showTip('success', '操作成功')
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                } else {
                    return false
                }
            })
        }
    }
}

</script>
