<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #learning-map-template-container {
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
    <main id="learning-map-template-container">
        <Pad 
            @addPhase="addPhase"
            :total="ruleForm.phase_list && ruleForm.phase_list.length">
        </Pad>
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="140px" class="custom-form">
            <el-form-item label="模板名称" prop="title">
                <el-input
                    class="custom-input"
                    v-model="ruleForm.title">
                </el-input>
            </el-form-item>
            <el-form-item label="封面" prop="image">
                <ImagEcropperInput :isRound="false" :confirmFn="cropperFn"></ImagEcropperInput>
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
                            <span class="phase-sort">第{{phase.phase}}阶段</span>
                            <el-button 
                                v-if="index!==0"
                                type='text' 
                                @click.stop="deletePhase(phase, index)">
                                删除阶段
                            </el-button>
                            <!-- <input type="hidden" :value="phase.data.id"> -->
                       </template>
                        <Phase
                            :keys="['course', 'speaking', 'exam']"
                            ref="phase"
                            :phase="phase">
                        </Phase>
                    </el-collapse-item>
                </el-collapse>
            </el-form-item>
            <el-form-item label="结业考试">
                <el-button type='primary' class="task-add-btn" @click="addExam" size="medium">添加考试</el-button>
                <div class="task-item" v-if="ruleForm.finish_exam_name">
                    <span>{{ruleForm.finish_exam_name}}</span>
                    <i class="el-icon-delete delete" title="删除任务" @click="deleteFinishExam"></i>
                </div>
            </el-form-item>
            <el-form-item label="课程是否收费" prop="is_buy">
                <el-radio v-model="ruleForm.is_buy" :label="1">是</el-radio>
                <el-radio v-model="ruleForm.is_buy" :label="0">否</el-radio>
            </el-form-item>
            <el-form-item>
                <el-button 
                    type="primary" 
                    @click="submitForm('ruleForm')" 
                    v-loading="submitLoading">
                    {{ruleForm.data ? '更新' : '发布'}}
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
                    // xmview.setContentTitle('编辑模版')
                    return mapService.viewMap(id).then(ret => {
                        // 后端将发布对象列表没有和data一起返回
                        this.ruleForm = new Maps({
                            data: ret.data
                        })
                        this.ruleForm.learning_maps_id = this.$route.query.id
                    })
                } else {
                    return Promise.resolve(this.ruleForm = new Maps({
                        type: 'learning_map'
                    }))
                }
            },
            cropperFn (data, ext) {
                mapService.uploadCover({
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
                    service(this.ruleForm.save('id')).then(() => {
                        this.submitLoading = false
                        this.$router.replace({name: 'course-learnmap'})
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
        filters: {},
        directives: {},
    }
</script>
