<!--活动任务-->
<style lang="scss">
    @import "../../../utils/mixins/topSearch";
    @import "../../../utils/mixins/showDetail";
    @import "../../../utils/mixins/common";

    .task-daily-container {
        @extend %content-container;
        .add {
            @extend %right-top-btnContainer;
        }
        .search {
            @extend %top-search-container;
        }
        .block {
            margin-top: 10px;
            text-align: right;
        }
        .icon {
            width: 20px;
            height: 20px;
            vertical-align: middle;
        }
        .up-img {
            display: flex;
            align-items: center;
              .img-wrap {
                    width: 80px;
                    height: 80px;
                    margin-right: 30px;
                 img {
                        max-width: 100%;
                     }
                      }
                 }
    }
</style>
<template>
    <article class="task-daily-container">
        <section class="add">
            <el-button v-if="$route.name == 'play' || $route.name == 'growth'" icon="plus" type="primary" @click="addFn">添加</el-button>
        </section>
        <section class="search">
            <section>
                <i>任务标题</i>
                <el-input @keyup.enter.native="getData" v-model="search.title"></el-input>
            </section>
            <section v-if="$route.name != 'daily' && $route.name != 'newbie'">
                <i>任务类型</i>
                <el-select clearable @change="getData" v-model="search.user_action_name" > 
                    <el-option v-for="(item,index) in useraction" :label="item.alias" :value="item.name" :key="index"></el-option>
                </el-select>
            </section>
            <section>
                 <i>任务状态</i>
                <el-select :clearable="true" @change="getData" v-model="search.status" placeholder="全部">
                    <el-option  label="上线" value="0" ></el-option>
                    <el-option  label="下线" value="1" ></el-option>
                </el-select>
            </section>
        </section>
        <el-table border v-loading="loading" :data="dataList">
            <el-table-column
            label="任务图标"
            width='100'>
            <template scope="scope">
                <img v-if="scope.row.icon" class="icon" :src="scope.row.icon | fillImgPath" alt="">
                <img v-else class="icon" :src="scope.row.user_action_icon" alt="">
            </template>
            </el-table-column>
            <el-table-column
                    prop="title"
                    min-width="180"
                    label="任务标题">
            </el-table-column>
            <el-table-column
                    v-if="search.category == 'play'"
                    prop="description"
                    label="说明"
                    min-width="180">
            </el-table-column>
            <el-table-column
                    v-if="search.category == 'growth'"
                    prop="count"
                    label="累计次数"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="user_action_alias"
                    label="任务类型"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="reward"
                    label="奖励"
                    width="100">
            </el-table-column>
             <el-table-column
                    prop="completed_count"
                    label="完成人数"
                    min-width="100">
                    <template scope="scope">
                            <el-button type="text" @click="$router.push({name:'task-details', query:{id:scope.row.id} })">{{scope.row.completed_count}}</el-button>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="update_time_name"
                    label="上次设置时间"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="operate"
                    label="操作"
                    width="180">
                <template scope="scope">
                     <el-button type="text" size="small" @click="disable(scope.row)">
                            {{scope.row.status === 0 ? '下线' : '上线'}}
                    </el-button>
                    <el-button type="text" size="small" @click="editFn(scope.row)">修改</el-button>
                    <el-button v-if="$route.name != 'daily' && $route.name != 'newbie'" size="small" type="text" @click="delFn(scope.row)">删除</el-button>
                    <el-button size="small" v-if="scope.row.user_action_name == 'upload_image'" type="text" @click="$router.push({name: 'play-audit', query:{id:scope.row.id} })">审核</el-button> 
                </template>
            </el-table-column>
        </el-table>
        <section class="block">
            <el-pagination
                    @size-change="val=> {search.page_size=val; getData()}"
                    @current-change="val=> {search.page=val; getData()}"
                    :current-page="search.page"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </section>
        <el-dialog :visible.sync="addForm" size="tiny" :title="dialogTitle[search.category]">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item prop="user_action_name" label="任务类型">
                    <el-select @change="changeActionFn" v-model="form.user_action_name" :disabled="$route.name == 'daily' || $route.name == 'newbie'">
                        <el-option :key="index" v-for="(item,index) in useraction" :label="item.alias" :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务图标">
                    <div class="up-img">
                     <div class="img-wrap" v-if="form.icon" >
                    <img :src="form.icon | fillImgPath" alt=""></img>
                    </div>
                   <div>
                        <el-button class="up-btn" type="primary" @click="() => {$refs.imgcropper.chooseImg()}">更换</el-button>
                   </div>
                    </div>
                </el-form-item>
                <!-- 根据条件变换 -->
                    <el-form-item  label="选择平台" v-if="form.user_action_name==='app_update'">
                    <el-select v-model="form.platform">
                    <el-option label="ios" value="ios"></el-option>
                    <el-option label="android" value="android"></el-option>
                    </el-select>
                    </el-form-item>
                     <el-form-item label="选择版本" v-if="form.user_action_name==='app_update'">
                       <el-input v-model="form.app_version"></el-input>
                    </el-form-item>
                 <el-form-item label="样例图片" v-if="form.user_action_name=='upload_image'" >
                    <div class="up-img">
                     <div class="img-wrap" v-if="form.sample_image" >
                    <img :src="form.sample_image | fillImgPath" alt=""></img>
                    </div>
                   <div>
                        <el-button class="up-btn" type="primary" @click="() => {$refs.imgupload.chooseImg()}">上传</el-button>
                   </div>
                    </div>
                </el-form-item>


                <el-form-item prop="title" label="任务标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item prop="user_action_object_id" label="选择" v-if="search.category == 'play'&& !(form.user_action_name==='app_update' || form.user_action_name=='upload_image')">
                    <span class="choose-title" v-if="form.user_action_object_id">
                        {{form.user_action_object_title}}
                    </span>
                    <el-button type="primary" @click="chooseFn">选取</el-button>
                </el-form-item>
                <el-form-item prop="count" v-if="search.category == 'growth'" label="累计次数">
                    <el-input type="number" v-model.number="form.count">
                        <template slot="append">次</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="reward" label="任务奖励">
                    <el-input type="number" v-model.number="form.reward">
                        <template slot="append">积分</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="有效时间">
                        <el-date-picker
                        v-model="form.end_time"
                        type="datetime"
                        placeholder="请选择时间">
                        </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addForm = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">保 存</el-button>
            </span>
        </el-dialog>
        <ChooseContent :category="form.user_action_name" v-model="choose.isShow" v-on:result="chooseConfirm"></ChooseContent>
        <ImagEcropperInput :compress="1" :isShowBtn="false" ref="imgcropper" :confirmFn="cropperFn" :aspectRatio="1"
                           :isRound="true"></ImagEcropperInput>
        <ImagEcropperInput :compress="1" :isShowBtn="false" ref="imgupload" :confirmFn="imguploadFn" 
                           ></ImagEcropperInput>
    </article>
</template>
<script>
    import ImagEcropperInput from '../../component/upload/ImagEcropperInput.vue'
    import ChooseContent from '../component/ChooseContent.vue'
    import TaskService from '../../../services/usersystem/taskService'
    import clone from 'clone'
    import {time2String} from '../../../utils/timeUtils'
    export default {
        components: {
            ChooseContent,
            ImagEcropperInput
        },
        data () {
            return {
                dialogTitle: {'daily': '日常任务设置', 'play': '活动任务设置', 'newbie': '新手任务设置', 'growth': '成长任务设置'},
                choose: {
                    isShow: false,
                    currContent: null
                },
                loading: false,
                addForm: false,
                search: {
                    category: this.$route.name, // 任务类型
                    title: '',
                    status: void 0,
                    user_action_name: '',
                    user_action_icon: '',
                    page: 1,
                    page_size: 15
                },
                form: clearFn.call(this),
                dataList: [],
                useraction: [],
                total: 0,
                rules: {
                    user_action_name: {required: true, message: '必填', trigger: 'change'},
                    title: {required: true, message: '必填', trigger: 'blur'},
                    count: {type: 'number', required: true, message: '必填', trigger: 'blur'},
                    user_action_object_id: {type: 'number', required: true, message: '必填', trigger: 'blur'},
                    reward: {type: 'number', required: true, message: '必填', trigger: 'blur'}
                }
            }
        },
        watch: {
            'form.user_action_object_id'(val) {
                delete this.rules['user_action_object_id']
                if (!(this.form.user_action_name === 'app_update' || this.form.user_action_name === 'upload_image')) {
                    this.rules['user_action_object_id'] = {
                        type: 'number',
                        required: true,
                        message: '必填',
                        trigger: 'blur'
                    }
                }
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            initFetchParam() {
                this.search.page = 1
                this.search.title = ''
                this.search.user_action_name = ''
            },
            cropperFn (data, ext) {
                TaskService.upIcon({
                    image: data,
                    alias: Date.now() + ext
                }).then((ret) => { this.form.icon = ret.url })
            },
            imguploadFn (data, ext) {
                TaskService.upIcon({
                    image: data,
                    alias: Date.now() + ext
                }).then((ret) => {
                    console.log(ret)
                    this.form.sample_image = ret.url
                })
            },
            changeActionFn () {
                if (this.form.user_action_object_id) {
                    this.form.user_action_object_id = ''
                    this.form.user_action_object_title = ''
                }
            },
            delFn (row) {
                xmview.showDialog(`你将要删除任务 <span style="color:red">${row.title}</span> 操作不可恢复确认吗?`, () => {
                    TaskService.del({task_id: row.id}).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.getData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                })
            },
            addFn () {
                this.addForm = true
                this.$nextTick(() => {
                    this.form = clearFn.call(this)
                    this.$refs.form.resetFields()
                })
            },
            editFn (row) {
                this.form = clone(row)
                this.form = clearFn.call(this)
                this.search.category = row.category
                this.form.user_action_object_id = row.user_action_object_id
                this.form.user_action_object_title = row.user_action_object_title
                this.$nextTick(() => {
                    this.addForm = true
                })
            },
            chooseFn () {
                if (!this.form.user_action_name) {
                    xmview.showTip('error', '请选择任务类型')
                    return
                }
                this.choose.isShow = true
            },
            getData () {
                return Promise.all([TaskService.userAction({category: this.search.category}), TaskService.search(this.search)]).then((result) => {
                    this.useraction = result[0].data
                    this.dataList = result[1].data
                    console.log(result)
                    this.total = result[1].total
                })
            },
            disable(row) { //  上下线
                xmview.showDialog(`你是要${row.status === 1 ? '下线' : '上线'}【<i style="color: red">${row.title}</i>】确认吗？`, () => {
                    TaskService.disable({
                        id: row.id,
                        status: row.status === 1 ? 0 : 1
                    }).then(() => {
                        xmview.showTip('success', `操作成功 `)
                        this.getData()
                    })
                })
            },
            submit (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        let msg = '添加成功'
                        let reqFn = TaskService.add
                        if (this.form.id) {
                            msg = '修改成功'
                            reqFn = TaskService.update
                        }
                        if (this.form.end_time) {
                            this.form.end_time = time2String(new Date(this.form.end_time), false, false)
                        }
                        console.log(this.form.end_time)
                        reqFn(this.form).then(() => {
                            xmview.showTip('success', msg)
                            this.getData()
                            this.addForm = false
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    }
                })
            },
            // 选取课程
            chooseConfirm (choose) {
                this.choose.currContent = choose
                this.form.user_action_object_id = choose.id
                if (this.form.user_action_name == 'article' || this.form.user_action_name == 'share_article' || this.form.user_action_name == 'speaking_pass') this.form.user_action_object_title = choose.title
                else this.form.user_action_object_title = choose.name
                this.choose.isShow = false
            },
        }
    }
    function clearFn() {
        return {
            category: this.$route.name,
            user_action_name: '',
            title: '',
            reward: '',
            user_action_object_id: '',
            count: '', // 累计次数
            icon: '',
            end_time: '', // 有效时间
            app_version: '',  // 客户端版本号
            platform: '', // 发布平台
            sample_image: ''
        }
    }
</script>
