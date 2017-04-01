<!--滚动刷新的select-->
<style lang='scss' rel='stylesheet/scss'>
    .component-form-selectscroll-more {
        color: #50bfff;
        cursor: pointer;
    }
</style>

<template>
    <el-select v-model="selectVal" :placeholder="placeholder" ref="container" @visible-change="initGetMore" filterable
               :filter-method="filter" @change="handleChange" :clearable="true" no-data-text="暂无数据"
               no-match-text="没有数据">
        <el-option v-loading="loading"
                   v-for="item in data"
                   :label="item.name"
                   :key="item.id"
                   :value="item.id">
        </el-option>

        <el-option value="xmyst2" :disabled="true" v-show="!this.data || this.data.length < 1">
            <span>暂无数据</span>
        </el-option>
        <el-option value="xmyst1" :disabled="true" v-show="this.data && this.data.length > 0">
            <span ref="domLoading" class="component-form-selectscroll-more">点击加载更多</span>
        </el-option>
    </el-select>
</template>

<script lang='babel'>
    export default{
        props: {
            requestCb: Function, // 请求数据的回调  参数:(val, length)  val-筛选关键词   length 当前的数据长度  注:只会出现其中一个
            changeCb: Function, // 选项改变
            value: [String, Number]
        },
        data () {
            return {
                selectVal: this.value,
                data: void 0,
                loading: false,
                placeholder: '请选择',
                input: null,
                isSearching: false
            }
        },
        watch: {
            'data'() {
                this.initGetMore()
                this.loading = false
            }
        },
        mounted () {
            this.input = this.$refs.container.$el.querySelector('input')
        },
        methods: {
            // 筛选数据
            filter (val) {
                this.requestCb && this.requestCb(val)
            },
            initGetMore (state) {
                if (state == false) {
                    this.placeholder = '请选择'
                    return
                }
                this.placeholder = '输入内容进行搜索'

                let _this = this
                this.$nextTick(() => {
                    let option = this.$refs.domLoading.parentNode
                    if (option.loaded) return
                    option.loaded = true
                    option.addEventListener('click', function (e) {
                        _this.input.focus()
                        _this.loading = true
                        e = e || window.event
                        e.preventDefault()
                        e.stopPropagation()
                        setTimeout(() => {
                            _this.data.push(this.requestCb && this.requestCb(null, _this.data.length))
                            option.loaded = false
                        }, 1000)
                    }, true)
                })
            },
            handleChange (val) {
                this.$emit('changeVal', val)
                this.changeCb && this.changeCb(val)
            }
        }
    }
</script>
