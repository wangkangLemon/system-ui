<!--企业列表-->
<style lang="scss" rel='stylesheet/scss'>
@import "../../../utils/mixins/common";
@import "../../../utils/mixins/topSearch";
@import "../../../utils/mixins/showDetail";

.company-index {
  @extend %content-container;
  .add {
    @extend %right-top-btnContainer;
  }
  .search {
    @extend %top-search-container;
  }
  .block {
    text-align: right;
    margin-top: 15px;
  }
  .addForm {
    .tip {
      text-align: center;
      border-top: 1px solid #ddd;
      color: #ff0000;
      line-height: 50px;
    }
  }
}
</style>
<template>
  <article class="company-index">
    <div class="add">
      <el-button type="primary" icon="plus" class="recharge" @click="add">企业白名单</el-button>
    </div>
    <section class="search">
      <section>
        <i>连锁名称：</i>
        <el-input @keyup.enter.native="getData" v-model="fetchParam.name" auto-complete="off"></el-input>
      </section>
      <!-- <section>
                <i>属性</i>
                <el-select @change="getData" clearable v-model="fetchParam.typeSelect" placeholder="未选择">
                    <el-option
                            v-for="item in types"
                            :label="item.name"
                            :value="item.id"
                            :key="item.id">
                    </el-option>
                </el-select>
            </section>
             <section>
                <i>状态</i>
                <el-select @change="getData" clearable v-model="fetchParam.taxTypeSelect" placeholder="未选择">
                    <el-option
                            v-for="item in taxType"
                            :label="item.name"
                            :value="item.id"
                            :key="item.id">
                    </el-option>
                </el-select>
      </section>-->
    </section>
    <el-table v-loading="loading" border :data="companyData" stripe style="width: 100%">
      <el-table-column prop="name" label="连锁名称" min-width="150"></el-table-column>
      <el-table-column label="属性" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.exemption==1">征收</span>
          <span v-else-if="scope.row.exemption==0">不征收</span>
        </template>
      </el-table-column>
      <el-table-column width="100" prop="user_cnt" label="员工数"></el-table-column>
      <el-table-column width="150" label="缴纳人数">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="pay(scope.$index, scope.row)"
          >{{scope.row.gold_cnt}}</el-button>
        </template>
      </el-table-column>
      <el-table-column width="180" label="未缴纳人数">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="noPay(scope.$index, scope.row)"
          >{{scope.row.user_cnt-scope.row.gold_cnt}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click="adminPage(scope.$index, scope.row)">
                        发送系统消息
          </el-button>-->
          <el-button
            type="text"
            size="small"
            @click="showFn(scope.$index, scope.row)"
            :disabled="scope.row.exemption==0?true:false"
          >发送后台通知</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[15, 30, 60, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </article>
</template>
<script>
import companyGold from "../../../services/companyGold";
function clearFn() {
  return {
    typeSelect: "",
    taxTypeSelect: "",
    provinceSelect: "",
    name: ""
  };
}
export default {
  data() {
    return {
      pay_user: "",
      noPay_user: "",
      types: [
        // 类型
        {
          name: "未征收",
          id: 0
        },
        {
          name: "征收",
          id: 1
        }
      ],
      taxType: [
        // 类型
        {
          name: "全部缴纳",
          id: 1
        },
        {
          name: "部分缴纳",
          id: 0
        }
      ],
      editloading: false,
      details: null,
      showDetail: false, // 显示详情弹窗
      loading: false,
      currentPage: 1,
      pageSize: 15,
      companyData: [],
      fetchParam: {
        createTime:
          this.$route.query.yesterday == undefined
            ? ""
            : this.$route.query.yesterday,
        endTime:
          this.$route.query.yesterday == undefined
            ? ""
            : this.$route.query.yesterday,
        typeSelect: "",
        provinceSelect: "",
        citySelect: "",
        areaSelect: "",
        name: ""
      },
      total: 0
    };
  },
  activated() {
    this.getData().then(() => {
      xmview.setContentLoading(false);
    });
  },
  methods: {
    initFetchParam() {
      this.currentPage = 1;
      this.fetchParam = clearFn();
    },
    // 显示详情
    showFn(index, row) {
      console.log(row);
      this.$confirm("此操作将给连锁后台发送通知，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          return companyGold
            .sendNotice({
              company_id: row.id,
              pay_cnt: row.gold_cnt,
              unpaid_cnt: row.user_cnt - row.gold_cnt
            })
            .then(ret => {
              if (ret.code == 0) {
                this.$message({
                  type: "success",
                  message: "发送成功!"
                });
              } else {
                this.$message({
                  type: "error",
                  message: "发送失败!"
                });
              }
            })
            .then(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发送"
          });
        });
    },
    pay(index, row) {
      console.log(row);
      this.$router.push({
        name: "company-learningGold-logDetails",
        query: { name: row.name, company_id: row.id, ispay: 1 }
      });
    },
    noPay(index, row) {
      this.$router.push({
        name: "company-learningGold-logDetails",
        query: { name: row.name, company_id: row.id, ispay: 2 }
      });
    },
    adminPage(index, item) {},
    // 企业白名单
    add() {
      this.$router.push({ name: "company-learningGold-companyRoster" });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    getData() {
      this.loading = true;
      return companyGold
        .getIndrustrySelectList({
          page_size: this.pageSize,
          page: this.currentPage,
          category: 2,
          keyword: this.fetchParam.name,
          province: this.fetchParam.provinceSelect
        })
        .then(ret => {
          this.companyData = ret.data;
          this.total = ret.total;
        })
        .then(() => {
          this.loading = false;
        });
    }
  }
};
</script>
