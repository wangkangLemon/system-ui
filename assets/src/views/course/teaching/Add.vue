<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #teaching-map-template-container {
        @extend %content-container;
        .task-item {
            width: 80%;
            margin: 10px 0;
            border: 1px dashed #dadada;
            padding: 0 10px;
            .delete {
                cursor: pointer;
                line-height: 40px;
                float: right;
                // margin-left: 100px;
            }
        }
        .custom-form {
            max-width: 60%
        }
        .custom-input {
            max-width: 400px;
        }
        .custom-img {
            width: 50%;
            margin-top: 10px;
        }
        .el-collapse {
            div.phaes-task.el-collapse-item {
                margin-bottom: 5px;
            }
            .el-collapse-item__header {
                padding-left: 10px;
                background: aliceblue;
            }
        }
        .phase-operation {
            cursor: pointer;
            position: fixed;
            top: 260px;
            right: 26%;
            i {
                color: orange;
                font-size: 70px;
            }
        }
    }
</style>

<template>
    <main id="teaching-map-template-container">
        <Pad 
            v-if="!view"
            @addPhase="addPhase"
            :total="ruleForm.phase_list && ruleForm.phase_list.length">
        </Pad>
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="140px" class="custom-form">
            <el-form-item label="模板名称" prop="title">
                <el-input
                    :disabled="view"
                    class="custom-input"
                    v-model="ruleForm.title">
                </el-input>
            </el-form-item>
            <el-form-item label="统计周期" prop="phase_type">
                <el-radio v-model="ruleForm.phase_type" :label="1" :disabled="view">天</el-radio>
                <el-radio v-model="ruleForm.phase_type" :label="2" :disabled="view">周</el-radio>
                <el-radio v-model="ruleForm.phase_type" :label="3" :disabled="view">月</el-radio>
            </el-form-item>
            <el-form-item label="封面" prop="image">
                <ImagEcropperInput :isRound="false" :confirmFn="cropperFn" v-if="!view"></ImagEcropperInput>
                <img class="custom-img" v-if="ruleForm.image" :src="ruleForm.image | fillImgPath"  alt="封面图">
            </el-form-item>
            <el-form-item label="阶段任务" prop="phase_list">
                <el-collapse v-model="activeNames" @change="collapseChange">
                    <el-collapse-item 
                        class="phase-task"
                        v-for="(phase, index) in ruleForm.phase_list"
                        :key="phase.phase_id"
                        :name="phase.phase">
                        <template slot="title">
                            <span class="phase-sort">第{{phase.phase}}{{ruleForm.phase_type | phaseType}}</span>
                            <el-button 
                                v-if="index!==0 && !view"
                                type='text' 
                                @click.stop="deletePhase(phase, index)">
                                删除阶段
                            </el-button>
                            <!-- <input type="hidden" :value="phase.data.id"> -->
                       </template>
                        <Phase
                            :disabled="!!view"
                            ref="phase"
                            :keys="['course', 'speaking', 'exam', 'medicine_task']"
                            :phase="phase">
                        </Phase>
                    </el-collapse-item>
                </el-collapse>
            </el-form-item>
            <el-form-item label="结业考试">
                <el-button 
                    type='primary' 
                    class="task-add-btn" 
                    @click="addExam" 
                    :disabled="view"
                    size="medium">
                    添加考试
                </el-button>
                <div class="task-item" v-if="ruleForm.finish_exam_name">
                    <span>{{ruleForm.finish_exam_name}}</span>
                    <i 
                        class="el-icon-delete delete" 
                        title="删除任务" 
                        v-if="!view"
                        @click="deleteFinishExam">
                    </i>
                </div>
            </el-form-item>
            <el-form-item label="课程是否收费" prop="is_free">
                <el-radio v-model="ruleForm.is_free" :label="0" :disabled="view">是</el-radio>
                <el-radio v-model="ruleForm.is_free" :label="1" :disabled="view">否</el-radio>
            </el-form-item>
            <el-form-item>
                <el-button 
                    v-if="!view"
                    type="primary" 
                    @click="submitForm('ruleForm')" 
                    v-loading="submitLoading">
                    {{ruleForm.data ? '更新' : '发布'}}
                </el-button>
                <el-button 
                    type='primary' 
                    @click="$router.replace({name: 'course-teaching'})">
                    关闭
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 添加考试 -->
        <Exam
            title="选取考试"
            :visible.sync="showExamDialog"
            @pick="getFinishedExamData">
        </Exam>
    </main>
</template>

<script>
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import Pad from '../component/Pad.vue'
    import Phase from '../component/Phase.vue'
    import Exam from '../component/Exam.vue'
    import mapService from 'services/course/mapService.js'
    import commonService from 'services/commonService'
    import Maps from 'models/learningMaps'

    export default {
        components: {
            ImagEcropperInput,
            Phase,
            Pad,
            Exam
        },
        name: 'learnmap-create',
        props: {},
        activated () {
        },
        created () {
            this.initMapsData(this.$route.query.id)
                .then(() => xmview.setContentLoading(false))
                .catch(err => console.log(err))
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                view: !!this.$route.query.view,
                activeNames: [1],
                submitLoading: false,
                ruleForm: {},
                showExamDialog: false,
                rules: {
                    title: {required: true, message: '请输入模版名称', trigger: 'blur'},
                    type: { required: true, message: '请选择发布对象' },
                }
            }
        },
        methods: {
            initMapsData (id) {
                if (id) {
                    return mapService.viewMap(id).then(ret => {
                        // 后端将发布对象列表没有和data一起返回
                        this.ruleForm = new Maps({
                            data: ret.data,
                            type: 'teaching'
                        })
                    })
                } else {
                    return Promise.resolve(this.ruleForm = new Maps({
                        type: 'teaching',
                        phase_type: 1,
                    }))
                }
            },
            cropperFn (data, ext) {
                commonService.uploadCover({
                    upload_type: 'image',
                    image: data,
                    alias: `${Date.now()}.${ext}`
                }).then((ret) => {
                    this.ruleForm.image = ret.url
                })
            },
            addPhase () {
                this.ruleForm.insert()
            },
            deletePhase (phase, index) {
                this.$confirm('确定要删除该阶段吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // if (phase.data) {
                    //     mapService.deletePhase({
                    //         learning_maps_id: this.$route.query.id,
                    //         phase_id: phase.id
                    //     })
                    // }
                    this.ruleForm.deletePhase(index)
                })
            },
            addExam (type) {
                this.showExamDialog = true
            },
            getFinishedExamData (data) {
                this.ruleForm.finish_exam_name = data.name
                this.ruleForm.finish_exam_id = data.id
            },
            deleteFinishExam () {
                this.ruleForm.finish_exam_name = ''
                this.ruleForm.finish_exam_id = ''
            },
            submitForm (formName) {
                if (this.validateAllForm(formName)) {
                    this.submitLoading = true
                    let service = this.ruleForm.data ? mapService.updateMap : mapService.createMap
                    service(this.ruleForm.save()).then(() => {
                        this.submitLoading = false
                        this.$router.replace({name: 'course-teaching'})
                    }).catch(() => {
                        this.submitLoading = false
                    })
                }
            },
            validateAllForm (formName) {
                return ![...this.$refs.phase.map(item => item), this]
                        .some((item, index) => !item.validate(formName, index + 1))
            },
            validate (formName) {
                let pass = true
                this.$refs[formName].validate(valid => {
                    if (!valid) pass = false
                })
                return pass
            },
            collapseChange (e) {
                if (e.length > 0) return
            }
        },
        filters: {
            phaseType (val) {
                let map = {
                    1: '天',
                    2: '周',
                    3: '月'
                }
                return map[val]
            }
        },
        directives: {},
    }
</script>
