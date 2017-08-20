<!--系统-工具-批量设置用户密码-->
<style lang='scss' rel="stylesheet/scss">
@import "../../../utils/mixins/common";
@import "../../../utils/mixins/showDetail";
#system-tools-batchsetpasswd-container {
    @extend %content-container;
    .header-button {
        @extend %right-top-btnContainer;
    }
    .block {
        text-align: right;
        margin-top: 10px;
    }
    .small-input {
        width: 193px;
    }
}
</style>
<template>
    <main id="system-tools-batchsetpasswd-container">
        <el-form :model="data" :rules="rules" ref="form">
            <el-form-item prop="company_id" label="连锁" :label-width="labelWidth">
                <section>
                    <IndustryCompanySelect :type="2" v-model="data.company_id" v-on:change="val=>data.company_id=val"></IndustryCompanySelect>
                </section>
            </el-form-item>
            <el-form-item prop="department_id" label="门店" :label-width="labelWidth">
                <section>
                    <CompanyDepartment :type="data.company_id" v-model="data.department_id" v-on:change="val=>data.department_id=val"></CompanyDepartment>
                </section>
            </el-form-item>
            <el-form-item prop="set_type" label="设置方式" :label-width="labelWidth">
                <el-select v-model="data.set_type" placeholder="请选择">
                    <el-option v-for="item in setType" :key="item.key" :label="item.label" :value="item.key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="passwd" label="新密码" :label-width="labelWidth">
                <el-input type="password" v-model="data.passwd" placeholder="新密码" class="small-input"></el-input>
            </el-form-item>

            <el-form-item label="" :label-width="labelWidth">
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </el-form-item>

        </el-form>
    </main>
</template>

<script>

import ToolsService from '../../../services/system/toolsService'
import IndustryCompanySelect from '../../component/select/IndustryCompany'
import CompanyDepartment from '../../component/select/CompanyDepartment'
export default {
    name: 'system-tools-batchsetpasswd',
    components: {
        IndustryCompanySelect,
        CompanyDepartment,
    },
    data() {
        return {
            data: {
                company_id: void 0,
                department_id: void 0,
                passwd: void '',
                set_type: void '',
            },
            setType: [
                {
                    key: 'nosetpassword',
                    label: '给没密码的设置密码',
                },
                {
                    key: 'resetpassword',
                    label: '重新设置所有人密码',
                },
            ],
            rules: {
                company_id: { type: 'number', required: true, message: '必须填写', trigger: 'change' },
                passwd: { required: true, min: 6, message: '密码不能小于6位', trigger: 'blur' },
                set_type: { required: true, message: '必须填写', trigger: 'blur' },
            },
            labelWidth: '100px',
        }
    },
    created() {
        xmview.setContentLoading(false)
    },
    methods: {
        submit(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    ToolsService.batSetPasswd(this.data).then((ret) => {
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
