<!--店员-店员详情-->
<style lang="scss" rel='stylesheet/scss'>
@import "../../../utils/mixins/showDetail";
</style>

<template>
    <el-dialog class="show-detail" title="查看店员" :visible.sync="isShow">
        <div class="avatar" v-if="detail != null">
            <img :src="{url: detail.avatar, sex: detail.sex} | defaultAvatar"/>
        </div>
        <div class="info" v-if="detail != null">
            <h2>{{detail.name}}({{detail.company}})</h2>
            <p><i class="title">所属门店：</i><span class="value">{{detail.dep_name || '无'}}</span></p>
            <p><i class="title">Mobile：</i><span class="value">{{detail.mobile || '无'}}</span></p>
            <p><i class="title">Email：</i><span class="value">{{detail.email || '无'}}</span></p>
            <p><i class="title">状态：</i><span class="value"><el-tag
                    type="success">{{detail.disabled ? '异常' : '正常'}}</el-tag></span></p>
            <p><i class="title">性别：</i> <span class="value">{{detail.sex ? '男' : '女'}}</span></p>
            <p><i class="title">生日：</i><span class="value">{{detail.birthday || '无'}}</span></p>
            <p><i class="title">地址：</i> <span class="value">{{detail.address || '无'}}</span></p>
            <p><i class="title">注册时间：</i><span class="value">{{detail.create_time_name || '无'}}</span></p>
        </div>
    </el-dialog> 
</template>

<script>
import CompanyUserService from '../../../services/companyUserService'
import {defaultAvatar} from '../../../utils/filterUtils'
export default {
    filters: {
        defaultAvatar
    },
    props: ['value', 'id'],
    data () {
        return {
            isShow: this.value || false,
            userID: void 0,
            detail: null,
        }
    },
    watch: {
        value(val) {
            this.isShow = val
        },
        isShow(val) {
            this.$emit('input', val)
        },
        id(val) {
            this.userID = val
        },
        userID(val) {
            if (val) {
                CompanyUserService.userDetail(this.userID).then(ret => {
                    this.detail = ret.data
                })
            }
        }
    }
}
</script>
