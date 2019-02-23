<style lang="scss">
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
#course-learnmap-container {
  @extend %content-container;
  .search {
    @extend %top-search-container;
  }
  .top-btn {
    @extend %right-top-btnContainer;
  }
}
</style>

<template>
  <main id="course-learnmap-container">
    <section class="search">
      <!-- 搜索条件 -->
      <section>
        <i>分类名称</i>
        <el-input v-model="fetchParam.title" @keyup.enter.native="fetchData"></el-input>
      </section>
      <!-- <section>
        <DateRange
          title="创建时间"
          :start="fetchParam.create_start_time"
          :end="fetchParam.create_end_time"
          v-on:changeStart="val=>{fetchParam.create_start_time=val}"
          v-on:changeEnd="val=>{fetchParam.create_end_time=val}"
          :change="fetchData"
        ></DateRange>
      </section>-->
      <el-button class="top-btn" icon="el-icon-plus" type="primary" @click="sumbit">添加分类名称</el-button>
    </section>
    <section>
      <!-- 内容主体 -->
      <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
      <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
      <!-- 固定列通过配置fixed="right || left"-->
      <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
         <el-table-column label="ID" prop="id" width='150'></el-table-column>
        <el-table-column label="分类名称" prop="name"></el-table-column>

        <!-- <el-table-column label="创建时间" prop="create_time_name"></el-table-column> -->
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="block"
        @size-change="val=> {fetchParam.page_size=val; fetchData()}"
        @current-change="val=> {fetchParam.page=val; fetchData()}"
        :current-page="fetchParam.page"
        :page-size="fetchParam.page_size"
        :page-sizes="[15, 30, 60, 100]"
        layout="sizes, total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </section>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="fetchParam" :rules="rules" ref="ruleForm">
        <el-form-item
          label="分类名称"
          :label-width="formLabelWidth"
          style="margin-left:-50px;"
          prop="name"
        >
          <el-input v-model.trim="fetchParam.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addName('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </main>
</template>

<script>
import DateRange from "components/form/DateRangePicker.vue";
import mapService from "services/course/mapTypeService.js";

export default {
  components: {
    DateRange
  },
  props: {},
  activated() {
    this.fetchData().then(() => {
      xmview.setContentLoading(false);
    });
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  data() {
    return {
      editData: "",
      title: "",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      loading: false,
      data: [],
      total: 0,
      fetchParam: {
        create_start_time: "",
        create_end_time: "",
        name: "",
        keyword:'',
        page: 1,
        page_size: 15,
        title:''
      },
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }]
      }
    };
  },

  methods: {
    fetchData() {
      this.loading = true;
      this.fetchParam.type = "learning_map";
      this.fetchParam.name=this.fetchParam.title
      this.fetchParam.keyword=this.fetchParam.name
      return mapService.getMapTypeList(this.fetchParam).then(ret => {
        this.data = ret.data;
        this.total = ret.total;
        this.loading = false;
      });
    },
    addName(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.title == "添加分类名称") {
            return mapService.creatMapType(this.fetchParam).then(ret => {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.dialogFormVisible = false;
              this.fetchData();
            });
          } else if (this.title == "更新分类名称") {
            console.log(this.editData);
            return mapService
              .editMapType(this.editData.id, this.fetchParam.name)
              .then(ret => {
                this.$message({
                  message: "更新成功",
                  type: "success"
                });
                this.dialogFormVisible = false;
                this.fetchData();
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    del(row) {
      this.$confirm(`是否删除【${row.name}】`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        mapService.delMapType(row.id).then(() => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.fetchData();
        });
      });
    },
    sumbit() {
      this.dialogFormVisible = true;
      this.fetchParam.name = "";
      this.title = "添加分类名称";
    },
    edit(row) {
      this.dialogFormVisible = true;
      this.fetchParam.name = row.name;
      this.title = "更新分类名称";
      this.editData = row;
    }
  },
  filters: {},
  directives: {}
};
</script>
