<template>
    <el-form label-width="120px" ref="form" :rules="rules" :model="lesson">
        <el-form-item label="课时类型" prop="material_type">
            <el-select v-model.string="lesson.material_type" @change="typeChange" :clearable="false">
                <el-option
                        v-for="item in material_types"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="课件" prop="material_id">
            <!--上传文件-->
            <UploadFile :onSuccess="handleUploadDoc" :url="uploadDocUrl" :accept="accept" :disabled="lesson.material_type == null" v-show="lesson.material_type !== 'video'"></UploadFile>
            <!--点击上传视频-->
            <el-button v-show="lesson.material_type === 'video'" @click="isShowVideoDialog=true">
                <i v-if="lesson.material_name">{{ lesson.material_name }}</i>
                <i v-else>选择视频</i>
            </el-button>
        </el-form-item>
        <el-form-item label="课时名称" prop="name">
            <el-input v-model="lesson.name"></el-input>
        </el-form-item>
        <el-form-item label="免费试看">
            <el-checkbox v-model.number="lesson.try_enable" :trueLabel="1" :falseLabel="0">本课时免费试看</el-checkbox>
        </el-form-item>
        <slot></slot>
        <DialogVideo :onSelect="handleVideoSelected" v-model="isShowVideoDialog" :companyID="company_id"></DialogVideo>
    </el-form>
    <!--选择视频的弹窗-->
</template>
<script>
    import config from '../../utils/config'
    import DialogVideo from './component/DialogVideo.vue'
    import UploadFile from '../component/upload/UploadFiles.vue'

    export default {
        props: {
            lesson: {type: Object, required: true},
            company_id: Number,
            material_types: {
                type: Array,
                default: function () {
                    return [
                        {value: 'video', label: '视频'},
                        {value: 'doc', label: 'WORD'},
                        {value: 'ppt', label: 'PPT'},
                        {value: 'pdf', label: 'PDF'},
                    ]
                },
            },
        },
        components: {DialogVideo, UploadFile},
        data() {
            return {
                accept: '',
                isShowVideoDialog: false,
                uploadDocUrl: `${config.apiHost}/course/doc/upload`,
                rules: {
                    name: { required: true, message: '请输入课程名称', trigger: 'change' },
                    material_type: { required: true, message: '请选择课时类型', trigger: 'change' },
                    material_id: { required: true, type: 'number', message: '请上传课程文件', trigger: 'change' },
                }
            }
        },
        methods: {
            // 课程类型改变
            typeChange(val) {
                if (val === 'doc') {
                    this.accept = '.doc,.docx'
                } else if (val === 'ppt') {
                    this.accept = '.ppt,pptx'
                } else if (val === 'pdf') {
                    this.accept = '.pdf'
                }
            },
            handleUploadDoc(rep) { // 文档上传完毕
                this.lesson.material_id = rep.data.id
            },
            // 处理视频选取
            handleVideoSelected(row) {
                this.lesson.material_name = row.name
                this.lesson.material_id = row.id
            },
            resetFields() {
                return this.$refs['form'].resetFields()
            },
            validate(func) {
                return this.$refs['form'].validate(func)
            }
        }
    }
</script>
