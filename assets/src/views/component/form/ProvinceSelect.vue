<!-- 大区，省 -->
<!-- 
    <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="120px" :model="ruleForm">
        <el-form-item label="省区选择">
            <ProvinceSelect v-model="province" v-if="province!=null" ></ProvinceSelect>
        </el-form-item>
    </el-form> 
-->
<style lang="scss" rel='stylesheet/scss'>
    .area {
        border: 1px solid #bfcbd9;
        background-color: #fff;
        margin-top: 10px;
        li {
            list-style: none;
            padding: 13px 10px 7px 10px;
            &:nth-child(2n+1) {
                background-color: #f2f2f2;
            }
            &>label {
                float: left;
                margin-right: 40px;
            }
            &>div {
                position: relative;
                display: inline-block;
            }
            &:nth-child(3) {
                &>div:nth-last-child(2) {
                    margin-left: 91px;
                }
            }
            &:nth-child(5) {
                &>div:last-child {
                    margin-left: 91px;
                }
            }
        }
        .m-province {
            position: relative;
            margin-right: 15px;
        }
    }
</style>

<template>
    <ul class="area">
        <li v-for="(region, index) in regionData" :key="region.id">
            <el-checkbox v-model="checkedRegions[index]" @change="handleCheckAllChange(index)">{{region.name}}</el-checkbox>
            <template v-for="province in region.children">
                <div class="m-province" :key="province.id">
                    <el-checkbox 
                        v-model="checkedProvinces[province.id]"
                        @change="handleCheckedProvincesChange(index)">
                        {{province.name}}
                    </el-checkbox>
                </div>
            </template>
        </li>
    </ul>
</template>

<script>
    import regionData from '@/assets/js/region.js'
    import * as utils from 'utils/common.js'
    export default {
        model: {
            prop: 'checked',
            event: 'change'
        },
        props: ['checked'],
        data () {
            return {
                regionData: regionData,
                checkedRegions: {},
                checkedProvinces: {},
                initSelectAreas: this.checked,
            }
        },
        created () {
            // 封装数据
            this.checkedRegions = this.initData().checkedRegions
            this.checkedProvinces = this.initData().checkedProvinces
        },
        methods: {
            initData () {
                let areasArr = this.initSelectAreas
                let checkedRegions = {}
                let checkedProvinces = {}
                let i = 0
                // 大区
                regionData.forEach((region, index) => {
                    // 省份
                    i = 0
                    region.children.forEach((province, sort) => {
                        if (areasArr.indexOf(province.id) >= 0) {
                            checkedProvinces[province.id] = true
                            i++
                        }
                    })
                    checkedRegions[index] = region.children.length === i
                })
                return { checkedRegions, checkedProvinces }
            },
            handleCheckAllChange (index) {
                this.regionData[index].children.forEach((province, sort) => {
                    if (this.checkedRegions[index]) {
                        this.checkedProvinces[province.id] = true
                    } else {
                        this.checkedProvinces[province.id] = false
                    }
                })
                this.$emit('change', this.getProvinces())
            },
            handleCheckedProvincesChange (index) {
                let i = 0
                this.regionData[index].children.forEach((province, sort) => {
                    if (this.checkedProvinces[province.id]) {
                        i++
                    }
                })
                this.checkedRegions[index] = i === this.regionData[index].children.length
                this.$emit('change', this.getProvinces())
            },
            getProvinces() {
                let provinces = []
                for (let index in this.checkedProvinces) {
                    if (this.checkedProvinces[index]) {
                        provinces.push(index)
                    }
                }
                console.log(provinces)
                return provinces
            }
        }
    }
</script>
