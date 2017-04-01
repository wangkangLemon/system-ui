<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/topSearch";
</style>

<template>
    <section>
        <i>用户</i>
        <el-select clearable v-loading="loading"
                   @visible-change="handleClick"
                   @change="handleChange"
                   v-model="currVal"
                   placeholder="请选择">
            <el-input
                    class="keyword-container"
                    @change="fetchData"
                    icon="search"
                    v-model="keyword">
            </el-input>
            <el-option
                    v-for="item in data"
                    :label="item.name"
                    :value="item.id" :key="item.id">
            </el-option>
        </el-select>
    </section>
</template>

<script lang='babel'>
    import {userList} from '../../../services/userService'
    export default{
        props: ['value', 'change'],
        data () {
            return {
                loading: false,
                data: [],
                currVal: this.value,
                keyword: '',
                currentPage: 1,
                pageSize: 10
            }
        },
        watch: {
            'value'(val, oldValue) {
                this.setCurrentValue(val)
            }
        },
        methods: {
            handleClick () {
                if (this.data.length > 1)
                    return

                this.loading = true
                this.fetchData()
            },
            handleChange(val) {
                this.setCurrentValue(val)
                this.change && this.change()
            },
            setCurrentValue (val) {
                if (this.curVal == val) return
                this.currVal = val
                this.$emit('change', val)
            },
            fetchData () {
                userList(this.keyword, this.currentPage, this.pageSize).then(ret => {
                    this.data = []
                    this.data.push(...ret.data)
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            }
        }
    }
</script>
