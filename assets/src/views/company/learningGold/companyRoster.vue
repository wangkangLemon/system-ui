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
.left_block {
  width: 45%;
  float: left;
}
.table_title {
  padding: 10px;
  background-color: #ebeef5;
}
.right_block {
  width: 45%;
  float: right;
}
.icon_delete {
  color: red;
  float: right;
  line-height: 30px;
}
</style>
<template>
  <article class="company-index">
    <section class="search">
      <section>
        <i>连锁名称：</i>
        <el-input @keyup.enter.native="keyEnter" v-model="fetchParam.name" auto-complete="off"></el-input>
      </section>
    </section>
    <section class="left_block">
      <div class="table_title">全部</div>
      <el-table
        v-loading="loading"
        border
        ref="multipleTable"
        :height="600"
        :data="companyData"
        @select="handleSelectionChange"
        @select-all="toggleSelection"
        stripe
        :show-header="false"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </section>
    <section class="right_block">
      <div class="table_title">已选择（被选择企业的所属员工，将不被征收个人学习金）</div>
      <section>
        <el-table
          v-loading="loading"
          border
          :height="600"
          :data="datas"
          stripe
          :show-header="false"
          style="width: 100%"
        >
          <el-table-column>
            <template scope="scope">
              <el-tag>连锁</el-tag>
              <span style="margin-left:10px;">{{scope.row.name}}</span>
              <i class="el-icon-delete icon_delete" @click="Delete(scope.$index,scope.row)"></i>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" style="margin-top:10px;float:left;" @click="deleteTotal">全部删除</el-button>
        <el-button type="primary" style="margin-top:10px;float:right;" @click="insert">保存</el-button>
      </section>
    </section>
  </article>
</template>
<script>
import companyService from "../../../services/companyService";
import companyGold from "../../../services/companyGold";
export default {
  data() {
    return {
      editloading: false,
      details: null,
      showDetail: false, // 显示详情弹窗
      chainName: [], //连锁名字
      loading: false,
      page: 1,
      pageSize: 15,
      companyData: [],
      datas: [],
      fetchParam: {
        name: ""
      },
      total: 0
    };
  },
  activated() {
    var _this = this;
    _this.fetchParam.name = "";
    _this.getNoPay()
    _this.getData().then(() => {
      xmview.setContentLoading(false);
    });
  },
  methods: {
    //删除全部
    deleteTotal() {
      let arr = [];
      this.datas.forEach(item => {
        arr.push(item.id);
      });
      return companyGold
        .deleteCompanyRoster({
          comids: arr
        })
        .then(ret => {
          if (ret.code == 0) {
            xmview.showTip("success", "删除成功");
            this.datas = [];
            this.setSelected();
          }
        });
    },
    keyEnter() {
      //搜索
      var _this = this;
      this.getData();
    },
    handleSelectionChange(selection, row) {
      if (selection.indexOf(row) > -1) {
        this.datas.unshift(row);
        console.log(this.datas)
      } else {
        return companyGold
          .deleteCompanyRoster({
            comids: row.id
          })
          .then(ret => {
            if (ret.code == 0) {
              xmview.showTip("success", "删除成功");
              this.datas.splice(
                this.datas.findIndex(item => {
                  return item.id === row.id; // 优先匹配id删除
                }),1);
              // this.datas.splice(this.datas.findIndex(item=>{
              //     return item.id === row.id // 优先匹配id删除
              // }),1)
              this.setSelected();
            }
          });
      }
    },
    toggleSelection(selection) {},
    //删除
    Delete(index, row) {
      return companyGold
        .deleteCompanyRoster({
          comids: this.datas[index].id
        })
        .then(ret => {
          if (ret.code == 0) {
            xmview.showTip("success", "删除成功");
            this.datas.splice(index, 1);
            // this.datas.splice(this.datas.findIndex(item=>{
            //     return item.id === row.id // 优先匹配id删除
            // }),1)
            this.setSelected();
          }
        });
    },
    setSelected() {
      //设置选中
      console.log(this.companyData);
      this.$nextTick(() => {
        if (!this.$refs.multipleTable) return;
        this.$refs.multipleTable.clearSelection();
        this.datas.forEach(row => {
          // console.log('左边数据',this.data)//左边数据
          let currRow = this.companyData.find(item => {
            return item.id == row.id;
          });
          // console.log('左边选中数据',currRow)//左边选中数据
          console.log(currRow);
          this.$refs.multipleTable.toggleRowSelection(currRow, true);
        });
      });
    },
    handleCurrentChange(val) {
      var _this = this;
      this.page = val;
      this.getData();
    },
    //插入
    insert() {
      let arr = [];
      this.datas.forEach(item => {
        arr.push(item.id);
      });
      return companyGold
        .addCompanyRoster({
          comids: arr
        })
        .then(ret => {
          if (ret.code == 0) {
            xmview.showTip("success", "添加成功");
            this.$router.push({ name: "company-learningGold-log" });
          }
        });
    },
    getData() {
      this.loading = true;
      return companyService
        .getIndrustrySelectList({
          page_size: this.pageSize,
          page: this.page,
          category: 2,
          keyword: this.fetchParam.name

          // time_start: this.fetchParam.createTime,
          // time_end: this.fetchParam.endTime,
          // province: this.fetchParam.provinceSelect,
          // city: this.fetchParam.citySelect,
          // area: this.fetchParam.areaSelect
        })
        .then(ret => {
          this.total = ret.total;
          this.companyData = ret.data;
           this.setSelected();
        })
        .then(() => {
          this.loading = false;
        });
    },
    getNoPay(){
       return companyGold
        .getNoPayList({
          page_size: 9999999999,
        
        })
        .then(ret => {
          this.datas = ret.data;
        })
        .then(() => {
          this.loading = false;
        });
    }
  }
};
//去掉重复元素
function unique(arr) {
  console.log(arr);
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) == -1) {
      result.push(arr[i]);
    }
  }
  return result;
}
</script>
