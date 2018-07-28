<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #medicinetaken-container {
        padding: 15px;
        height: 600px;
        border: 1px solid #ededed;
        border-radius: 5px;
        background: #fff;
        .medicine {
            margin-top: 57px;
            width: 53%;
        }
        .el-tag + .el-tag {
            margin-left: 10px;
            margin-bottom: 10px;
        }
        .button-new-tag {
            margin-left: 10px;
            height: 32px;
            line-height: 30px;
            padding-top: 0;
            padding-bottom: 0;
        }
        .input-new-tag {
            width: 90px;
            margin-left: 10px;
        }
    }
</style>

<template>
    <main id="medicinetaken-container">
<!--         <el-form ref="ruleForm" label-width="120px">
            <el-form-item label="拿药练习名称" prop="keyword">
                <el-input
                    v-model.lazy="keyword"
                    type="textarea"
                    :rows="20"
                    placeholder="请输入拿药练习名称，多个逗号分隔">
                </el-input>
            </el-form-item>
        </el-form> -->
        <div class="medicine">
            <el-tag
                :key="tag + index"
                v-for="(tag, index) in dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
            </el-tag>
            <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="mini"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm">
            </el-input>
            <el-button
                v-else 
                class="button-new-tag" 
                size="small" 
                @click="showInput">
                +实操课
            </el-button>
        </div>
    </main>
</template>

<script>
    export default {
        components: {},
        props: {
            value: {
                type: Array,
                default: () => {
                    return []
                }
            },
            taskType: Number,
            type: {
                type: [Number, String],
                required: false,
            },
        },
        activated () {},
        created () {
        },
        mounted () {},
        computed: {},
        watch: {
            keyword (val) {
                this.$emit('input', val)
                this.$emit('medicineTaken', { 
                    taskType: this.taskType,
                    type: this.type,
                    name: val
                })
            }
        },
        data () {
            return {
                dynamicTags: this.value,
                inputVisible: false,
                inputValue: ''
            }
        },
        methods: {
            handleClose(tag, noemit) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
                if (!noemit) {
                    this.$emit('medicineTaken', {
                        taskType: this.taskType,
                        type: this.type,
                        name: tag
                    }, false)
                }
            },
            showInput() {
                this.inputVisible = true
                this.$nextTick(_ => {
                  this.$refs.saveTagInput.$refs.input.focus()
                })
            },
            handleInputConfirm() {
                let inputValue = this.inputValue
                if (inputValue) {
                    this.dynamicTags.push(inputValue)
                    this.$emit('medicineTaken', { 
                        taskType: this.taskType,
                        type: this.type,
                        name: inputValue
                    }, true)
                }
                this.inputVisible = false
                this.inputValue = ''
            },
            deleteAll () {
                while (this.dynamicTags.length > 0) {
                    this.dynamicTags.splice(0, 1)
                }
            }
        },
        filters: {},
        directives: {},
    }
</script>
