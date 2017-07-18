<!--财务管理详情-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";
    #financeManage-money-details {
        @extend %content-container;
        .form {
            max-width: 700px;
        }
        .bottom-btn{
            float: right;
        }
        .image {
          border: 1 solid #ccc;
          width: 240px;
          height:151px;
        }
    }
</style>
<template>
  <article id="financeManage-money-details">
    <el-form label-width="100px" :rules="rules" :model="submitParam" class="form"  ref="form">
    <el-form-item label="编号:">
    <span>{{fetchParam.draw_no}}</span>
  </el-form-item>
  <el-form-item label="姓名:">
    <span>{{fetchParam.user_name}}</span>
  </el-form-item>
  <el-form-item label="手机:">
    <span>{{fetchParam.mobile}}</span>
  </el-form-item>
  <el-form-item label="连锁:">
    <span>{{fetchParam.company_name}}</span>
  </el-form-item>
   <el-form-item label="门店:">
    <span>{{fetchParam.department_name}}</span>
  </el-form-item>
  <el-form-item label="提现金额:">
    <span>{{fetchParam.actual_money_name}}</span>
  </el-form-item>
  <el-form-item label="扣税后应付:">
    <span>{{fetchParam.actual_money}}</span>
  </el-form-item>
  <el-form-item label="银行:">
    <span>{{fetchParam.bank_name}}</span>
  </el-form-item>
  <el-form-item label="卡号:">
    <span>{{fetchParam.card}}</span>
  </el-form-item>
  <el-form-item label="身份证号:">
    <span>{{fetchParam.identity_no}}</span>
  </el-form-item>
  <el-form-item label="身份证正面:">
    <img class="image" :src="fetchParam.image_front | fillImgPath" alt="img">
  </el-form-item>
  <el-form-item label="身份证背面:">
     <img class="image" :src="fetchParam.image_back | fillImgPath" alt="img">
  </el-form-item>
  <el-form-item label="状态:" prop='flag' >
    <el-select v-model="fetchParam.status" placeholder="请选择" :disabled="!submitParam.flag">
      <el-option label="已打款" value="complete"></el-option>
      <el-option label="身份不符" value="close"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label='备注:' prop="receipts">
    <el-input 
            type="textarea"
            v-model="submitParam.receipts"
            :autosize="{ minRows: 4, maxRows: 6}"
            auto-complete="off"
            :disabled="!submitParam.flag"
            placeholder="请输入内容">
    </el-input>
  </el-form-item>
  <div class="bottom-btn">
    <el-button  v-if="submitParam.flag" type='primary' @click='submit()'>提交</el-button>
    </div>
    </el-form>
  </article>
</template>

<script>
import {confirmDraw, cancleDraw} from '../../../services/fianace/money'
export default {
    data () {
        return {
            fetchParam: {},
            submitParam: {
                id: 0,
                receipts: '',
                flag: ''
            },
            flag: '', // 保存 原有的status 防止控件消失
            rules: {
                receipts: [
                    {
                        required: true,
                        message: '必填项',
                        trigger: 'blur'
                    }
                ]
            },
        }
    },
    activated() {
        xmview.setContentLoading(false)
        this.fetchParam = this.$route.query
        this.submitParam.flag = this.$route.query.status === '未打款'
        console.log(this.submitParam.flag)
        this.submitParam.id = this.fetchParam.id
        this.submitParam.receipts = this.fetchParam.receipts
    },
    methods: {
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let p
                    if (this.fetchParam.status == 'complete') {
                        p = confirmDraw(this.submitParam)
                    } else {
                        p = cancleDraw(this.submitParam)
                    }
                    p.then(() => {
                        xmview.showTip('success', '保存成功')
                        this.$router.go(-1)
                    })
                }
            })
        }
    }
}
</script>
