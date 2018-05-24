<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #medicinetaken-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }
    }

    .u-loadmore {
        color: #63bdea;
        margin-left: 10px;
        padding-top: 4px;
        display: block;
        cursor: pointer;
    }
</style>

<template>
    <main id="medicinetaken-container">
        <el-form ref="ruleForm" label-width="120px">
            <el-form-item label="拿药练习名称" prop="keyword">
                <el-input
                    v-model="keyword"
                    type="textarea"
                    :rows="20"
                    placeholder="请输入拿药练习名称，多个逗号分隔">
                </el-input>
            </el-form-item>
        </el-form>
    </main>
</template>

<script>
    export default {
        components: {},
        props: {
            value: {
                type: String,
            }
        },
        activated () {},
        created () {
        },
        mounted () {},
        computed: {},
        watch: {
            keyword (val) {
                this.$emit('input', val)
            }
        },
        data () {
            return {
                keyword: this.value
            }
        },
        methods: {
        },
        filters: {},
        directives: {},
    }
</script>
