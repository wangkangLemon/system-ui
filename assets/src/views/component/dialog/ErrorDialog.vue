<!--
    <ErrorDialog :error="error"></ErrorDialog>
    error: {
        showDialog: false,
        message: '',
        data: []
    }
-->
<style lang="scss">
    .errorList {
        margin-top: 10px;
        li {
            margin-bottom: 7px;
            list-style: none;
        }
    }
</style>

<template>
    <el-dialog 
        title="操作提示" 
        :visible.sync="error.showDialog">
        <p>{{error.message}}</p>
        <ul class="errorList">
            <li v-for="item in error.data" :key="item.id">
                <el-tag :type="item.type | type('tag')">{{item.type | type('name')}}</el-tag>
                <span>{{item.name}}</span>
            </li>
        </ul>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            error: Object
        },
        activated () {},
        created () {},
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {

            }
        },
        methods: {},
        filters: {
            type (val, opt) {
                let map = {
                    'activity': {
                        'tag': 'success',
                        'name': '打包售卖'
                    },
                    'goods_group': {
                        'tag': 'warning',
                        'name': '组合售卖'
                    },
                    'toast': {
                        'tag': 'warning',
                        'name': '弹框'
                    },
                    'practice': {
                        'tag': 'success',
                        'name': '练习'
                    },
                    'exam': {
                        'tag': 'warning',
                        'name': '考试'
                    },
                    'course': {
                        'tag': 'primary',
                        'name': '课程'
                    },
                    'course_task': {
                        'tag': 'primary',
                        'name': '课程任务'
                    },
                    'learning_maps': {
                        'tag': 'warning',
                        'name': '学习地图'
                    }
                }
                return map[val][opt]
            }
        },
        directives: {},
    }
</script>
