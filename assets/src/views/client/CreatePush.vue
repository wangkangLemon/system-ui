<!--新建消息推送-->
<style lang="scss">
    @import "../../utils/mixins/mixins";
    .client-createpush-container{
        background: #fff;
        padding: 20px 200px;
        .tip {
            color: #ff5b57;
        }
        .el-form {
            .chooseCourse {
                > div {
                    display: inline-block;
                    width: 60%;
                    margin-left: 10px;
                    .el-button {
                        float: right;
                    }
                }
            }
            .modelid {
                margin-bottom: 10px;
            }
            .title {
                .tip {
                    position: absolute;
                    right: -100px;
                    bottom: 0;
                }
            }
            .title, .content {
                position: relative;
                .count {
                    position: absolute;
                    right: 10px;
                    bottom: 0;
                    > i {
                        color: green;
                    }
                }
            }
        }
        .part2 {
            border-top: 1px solid #ddd;
            padding: 20px;
            .tip {
                text-align: center;
            }
        }
        .footer {
            margin-left: 100px;
        }
        .showDetail {
            .info {
                display: inline-block;
                vertical-align: top;
                p {
                    line-height: 30px;
                    span {
                        display: inline-block;
                        width: px2rem(100);
                        text-align: right;
                        padding-right: px2rem(10);
                    }
                }
            }
        }
    }
</style>
<template>
    <article class="client-createpush-container">
        <el-form label-width="100px" :model="form" ref="form" :rules="rules">
            <el-form-item class="title" prop="title" label="标题">
                <el-input @change="titleLen = form.title.length" :maxlength="titleMax" v-model="form.title"></el-input>
                <span class="count"><i>{{titleLen}}</i> / {{titleMax}}</span>
                <em class="tip">*仅对安卓有效</em>
            </el-form-item>
            <el-form-item class="content" prop="content" label="内容">
                <el-input @change="contentLen = form.content.length" :maxlength="contentMax" type="textarea" :rows="3" v-model="form.content" placeholder="推送内容"></el-input>
                <span class="count"><i>{{contentLen}}</i> / {{contentMax}}</span>
            </el-form-item>
            <el-form-item prop="modelid" label="类型">
                <el-select @change="form.model_value = ''" class="modelid" clearable v-model="form.model_id">
                    <el-option v-for="item in modelid" :label="item.name" :value="item.value" :key="item.id"></el-option>
                </el-select>
                <el-input v-if="form.model_id == 20" v-model="form.model_value" placeholder="请以http://或https://开头"></el-input>
                <div class="chooseCourse" v-if="form.model_id == 5">
                    <el-button type="primary" @click="course.isShow = true">选取课程</el-button>
                    <div v-if="course.currCourse != null"><span>已关联课程：{{course.currCourse.name}}</span><el-button @click="course.currCourse = null">清除</el-button></div>
                </div>
            </el-form-item>
            <div class="part2">
                <p class="tip">*如果需要指定用户推送，请按以下维度进行条件筛选</p>
            </div>
            <el-form-item label="平台">
                <el-select clearable v-model="form.platform">
                    <el-option v-for="item in platform" :label="item.name" :value="item.value" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="App版本">
                <el-select clearable v-model="form.app_version">
                    <el-option v-for="item in appVersion" :label="item.name" :value="item.value" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发送对象">
                <el-select clearable v-model="form.role">
                    <el-option v-for="item in role" :label="item.name" :value="item.value" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="性别">
                <el-select clearable v-model="form.sex">
                    <el-option v-for="item in sex" :label="item.name" :value="item.value" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="区域">
                <el-select clearable v-model="form.region">
                    <el-option v-for="item in region" :label="item.name" :value="item.value" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地区">
                <Region :disabled="form.region ? true : false" v-on:provinceChange="val => form.province = val"
                        v-on:cityChange="val => form.city = val"
                        v-on:areaChange="val => form.area = val"></Region>
            </el-form-item>
        </el-form>
        <div slot="footer" class="footer">
            <el-button type="primary" @click="confirmFn('form')">发 送</el-button>
        </div>
        <el-dialog class="showDetail" title="发送确认" v-model="confirmDialog">
            <div class="info">
                <p><span>推荐标题 </span>{{form.title}}</p>
                <p><span>推荐内容 </span>{{form.content}}</p>
                <div v-if="tags != null">
                    <p v-for="item in newTags"><span>{{item.name}} </span>{{item.value}}</p>
                </div>
            </div>
            <div slot="footer" class="footer">
                <el-button @click="confirmDialog = false">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </div>
        </el-dialog>
        <ChooseCourse v-model="course.isShow" v-on:result="courseConfirm"></ChooseCourse>
    </article>
</template>
<script>
    import treeUtils from '../../utils/treeUtils'
    import Region from '../component/select/Region.vue'
    import ChooseCourse from './component/ChooseCourse.vue'
    import cityData from '../../assets/city'
    import pushService from '../../services/pushService'
    export default {
        components: {
            Region,
            ChooseCourse
        },
        data () {
            return {
                course: {
                    isShow: false,
                    currCourse: null
                },
                newTags: [],
                confirmDialog: false,
                modelid: [
                    {
                        id: 1,
                        name: '文本',
                        value: 0
                    },
                    {
                        id: 2,
                        name: '课程',
                        value: 5
                    },
                    {
                        id: 3,
                        name: '链接',
                        value: 20
                    }
                ],
                platform: [ // 平台
                    {
                        id: 1,
                        name: '全部',
                        value: 0
                    },
                    {
                        id: 2,
                        name: 'Android',
                        value: 1
                    },
                    {
                        id: 3,
                        name: 'iOS',
                        value: 2
                    },
                ],
                appVersion: [ // App版本
                    {
                        id: 1,
                        name: '2.1.0',
                        value: '2.1.0'
                    },
                    {
                        id: 2,
                        name: '2.2.0',
                        value: '2.2.0'
                    },
                    {
                        id: 3,
                        name: '最新3.0',
                        value: '最新3.0'
                    }
                ],
                role: [ // 发送对象
                    {
                        id: 1,
                        name: '店长',
                        value: 'manager'
                    },
                    {
                        id: 2,
                        name: '店员',
                        value: 'employee'
                    },
                    {
                        id: 3,
                        name: '无归属',
                        value: 'user'
                    }
                ],
                sex: [ // 性别
                    {
                        id: 1,
                        name: '女',
                        value: 0
                    },
                    {
                        id: 2,
                        name: '男',
                        value: 1
                    }
                ],
                region: [ // 区域
                    {
                        id: 1,
                        name: '华北',
                        value: 1
                    },
                    {
                        id: 2,
                        name: '东北',
                        value: 2
                    },
                    {
                        id: 3,
                        name: '华东',
                        value: 3
                    },
                    {
                        id: 4,
                        name: '华中',
                        value: 4
                    },
                    {
                        id: 5,
                        name: '华南',
                        value: 5
                    },
                    {
                        id: 6,
                        name: '西南',
                        value: 6
                    },
                    {
                        id: 7,
                        name: '西北',
                        value: 7
                    }
                ],
                tags: [
                    {
                        name: '类型',
                        field: 'model_id',
                        arrName: 'modelid'
                    },
                    {
                        name: '平台',
                        field: 'platform',
                        arrName: 'platform'
                    },
                    {
                        name: 'App版本',
                        field: 'app_version',
                        arrName: 'appVersion'
                    },
                    {
                        name: '发送对象',
                        field: 'role',
                        arrName: 'role'
                    },
                    {
                        name: '性别',
                        field: 'sex',
                        arrName: 'sex'
                    },
                    {
                        name: '区域',
                        field: 'region',
                        arrName: 'region'
                    }
                ],
                titleMax: 15,
                titleLen: 3,
                contentLen: 0,
                contentMax: 50,
                form: {
                    title: '药视通',
                    content: '',
                    model_id: 0,
                    model_value: '',
                    platform: '',
                    app_version: '',
                    role: '',
                    sex: '',
                    region: '',
                    province: '',
                    city: '',
                    area: ''
                },
                rules: {
                    title: {required: true, message: '必须填', trigger: 'blur'},
                    content: {required: true, message: '必须填', trigger: 'blur'}
                }
            }
        },
        created () {
            xmview.setContentLoading(false)
        },
        methods: {
            // 选取课程
            courseConfirm (course) {
                this.course.currCourse = course
                this.course.isShow = false
                this.form.model_value = course.id
            },
            filterID (arr, id) {
                let name = ''
                arr.forEach((item) => {
                    if (item.value === id) {
                        name = item.name
                    }
                })
                return name
            },
            confirmFn (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.newTags = this.tags.map((item) => {
                            item.value = this.filterID(this[item.arrName], this.form[item.field])
                            return item
                        })
                        this.newTags = this.newTags.filter((item) => {
                            return item.value != ''
                        })
                        let area = ''
                        if (this.form.province) {
                            let provinceName = treeUtils.findItem(cityData, [`${this.form.province}`]).name
                            area += `${provinceName} `
                        }
                        if (this.form.province && this.form.city) {
                            let cityName = treeUtils.findItem(cityData, [`${this.form.province}`, `${this.form.city}`]).name
                            area += `${cityName} `
                        }
                        if (this.form.province && this.form.city && this.form.area) {
                            let areaName = treeUtils.findItem(cityData, [`${this.form.province}`, `${this.form.city}`, `${this.form.area}`]).name
                            area += `${areaName} `
                        }
                        if (area != '') {
                            this.newTags.push({
                                name: '地区',
                                value: area
                            })
                        }
                        this.confirmDialog = true
                    } else {
                        return false
                    }
                })
            },
            submit () {
                pushService.createPush(this.form).then(() => {
                    xmview.showTip('success', '发送成功')
                    this.$router.push({name: 'client-push'})
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            }
        }
    }
</script>
