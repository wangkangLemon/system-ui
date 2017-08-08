  <!-- 审核详情 -->
  <style lang="scss">
   @import "../../../utils/mixins/common";
   #task-audit-details-container {
       @extend %content-container;
        .form {
           max-width:700px;
        }
        .bottom-btn {
            float: right;
            margin-bottom: 20px;
         }
         .image{
             max-width: 80%;
             max-height: 80%;
         }
   }
   
  </style>
<template>
    <article id="task-audit-details-container">
    <el-form  label-width="100px":model="fetchParam" class="form" ref="form">
    <el-form-item label="姓名:">
    <span>{{fetchParam.user_name}}</span>
    </el-form-item>
    <el-form-item label="连锁:">
    <span>{{fetchParam.company_name}}</span>
     </el-form-item>
     <el-form-item label="门店:">
     <span>{{fetchParam.department_name}}</span>
  </el-form-item>
    <el-form-item label="照片:">
    <img class="image" :src="fetchParam.image | fillImgPath" alt="img">
  </el-form-item>
  <el-form-item label="状态:" prop='flag' >
    <el-select v-model="fetchParam.status" :disabled="disabled">
      <el-option label="已通过" value="1"></el-option>
      <el-option label="已拒绝" value="2"></el-option>
      <el-option label="未审核" value="0"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label='备注:' prop="node">
    <el-input  :disabled="disabled"
            type="textarea"
            v-model="fetchParam.note"
            :autosize="{ minRows: 4, maxRows: 6}"
            placeholder="请输入内容">
    </el-input>
  </el-form-item>
    <el-button v-if="!disabled" type='primary' class="bottom-btn" @click="submit">保存</el-button>
    </el-form>
    </article>
</template>
<script>
import auditService from '../../../services/usersystem/auditService'
export default {
    activated() {
        this.getData()
    },
    data () {
        return {
            fetchParam: this.$route.query,
            disabled: false
        }
    },
    methods: {
        getData() {
            this.fetchParam = this.$route.query
            this.disabled = this.$route.query.status != 0
            console.log(this.disabled)
            if (this.fetchParam.status === 0) {
                this.fetchParam.status = '未审核'
            } else if (this.fetchParam.status === 1) {
                this.fetchParam.status = '已通过'
            } else {
                this.fetchParam.status = '已拒绝'
            }
            xmview.setContentLoading(false)
        },
        submit() {
            if (this.fetchParam.status === '未审核') {
                this.fetchParam.status = 0
            } else if (this.fetchParam.status === '已通过') {
                this.fetchParam.status = 1
            } else if (this.fetchParam.status === '已拒绝') {
                this.fetchParam.status = 2
            }
            auditService.update(this.fetchParam).then(() => {
                xmview.showTip('success', '保存成功')
                this.$router.go(-1)
            })
        },
    }
}
</script>
