<!-- 大区，省，城市 -->
<!-- 
    <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="120px" :model="ruleForm">
        <el-form-item label="地域定向">
            <CitySelect v-model="city" v-if="city!=null" ></CitySelect>
        </el-form-item>
    </el-form> 
-->
<style lang="scss" rel='stylesheet/scss'>
    .area {
        border: 1px solid #bfcbd9;
        background-color: #fff;
        // padding: 10px 0;
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
        .m-city {
            position: relative;
            margin-right: 15px;
            // &:after {
            //     display: block;
            //     content: "clear";
            //     clear: both;
            //     height: 0;
            //     width: 100%;
            //     overflow: hidden;
            // }
        }
        .m-county {
            position: absolute;
            top: 30px;
            padding: 10px;
            border: 1px solid #ccc;
            min-width: 400%;
            z-index: 10;
            background: #ececec;
            .el-checkbox + .el-checkbox {
                margin-left: 0;
                margin-right: 15px;
            }
        }
    }
</style>

<template>

    <ul class="area">
        <li v-for="(region, index) in cityData" :key="region.id">
            <el-checkbox v-model="checkedRegion[index]" @change="handleCheckAllChange($event,index)">{{region.name}}</el-checkbox>
            <template v-for="(city, sort) in region.children">
                <div class="m-city" @mouseover="provinceOver(city.id)" 
                        @mouseout="currentHoverProvince = ''" :key="city.id" >
                    <el-checkbox 
                        :indeterminate="isIndeterminate[''+index+sort]"
                        v-model="checkedCities[''+index+sort]"
                        :key="city.id" 
                        @change="handleCheckedCitiesChange($event, ''+index+sort)">
                        {{city.name}}
                    </el-checkbox>
                    <div class="m-county" v-show="currentHoverProvince === city.id && city.children.length > 0">
                        <el-checkbox-group v-model="checkedCounties[''+index+sort]" @change="handleCheckedCountiesChange($event, ''+index+sort)">
                            <el-checkbox v-for="county in city.children" :label="county.id" :key="county.id">{{county.name}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </template>

        </li>
    </ul>
</template>

<script>
    import cityData from '@/assets/js/city.js'
    import * as utils from 'utils/common.js'
    export default {
        model: {
            prop: 'checked',
            event: 'change'
        },
        props: ['checked'],
        data () {
            return {
                currentHoverProvince: '',
                cityData: cityData,
                checkedRegion: {},
                checkedCities: {},
                checkedCounties: {},
                isIndeterminate: {},
                initSelectAreas: this.checked,
            }
        },
        created () {
            // 封装数据
            this.checkedRegion = this.initData().checkedRegion
            this.checkedCities = this.initData().checkedCities
            this.checkedCounties = this.initData().checkedCounties
            this.isIndeterminate = this.initData().isIndeterminate
        },
        methods: {
            initData () {
                let areasArr = this.initSelectAreas
                let checkedRegion = {}
                let checkedCities = {}
                let checkedCounties = {}
                let isIndeterminate = {}
                let i = 0
                // 大区
                cityData.forEach((region, index) => {
                    // 省份
                    region.children.forEach((city, sort) => {
                        i = 0
                        checkedCounties['' + index + sort] = []
                        city.children.forEach((county) => {
                            if (areasArr.includes(county.id)) {
                                checkedCounties['' + index + sort].push(county.id)
                            }
                        })
                        checkedCities['' + index + sort] = city.children.length ? city.children.length === checkedCounties['' + index + sort].length : false
                        isIndeterminate['' + index + sort] = !!checkedCounties['' + index + sort].length
                        if (checkedCities['' + index + sort]) {
                            i++
                        }
                    })
                    checkedRegion[index] = region.children.length === i
                })
                return { checkedRegion, checkedCities, checkedCounties, isIndeterminate }
            },
            handleCheckAllChange (e, index) {
                this.cityData[index].children.forEach((city, sort) => {
                    if (e.target.checked) {
                        this.checkedCities['' + index + sort] = true
                        this.checkedCounties['' + index + sort] = utils.getArrayId(city.children, 'id')
                    } else {
                        this.checkedCities['' + index + sort] = false
                        this.checkedCounties['' + index + sort] = []
                    }
                    this.isIndeterminate['' + index + sort] = false
                })
                this.$emit('change', this.checkedCounties)
            },
            handleCheckedCitiesChange (e, index) {
                let { m, n } = this.handlerNum(index)
                let i = 0
                this.checkedCounties[index] = e.target.checked ? utils.getArrayId(this.cityData[m].children[n].children, 'id') : []
                this.isIndeterminate[index] = false
                this.cityData[m].children.forEach((city, sort) => {
                    if (this.checkedCities['' + m + sort]) {
                        i++
                    }
                })
                this.checkedRegion[m] = i === this.cityData[m].children.length
                this.$emit('change', this.checkedCounties)
            },
            handleCheckedCountiesChange (value, index) {
                this.$emit('change', this.checkedCounties)
                let { m, n } = this.handlerNum(index)
                let i = 0
                this.checkedCities[index] = value.length === this.cityData[m].children[n].children.length
                this.isIndeterminate[index] = value.length > 0 && value.length < this.cityData[m].children[n].children.length
                this.cityData[m].children.forEach((city, sort) => {
                    if (this.checkedCities['' + m + sort]) {
                        i++
                    }
                })
                this.checkedRegion[m] = i === this.cityData[m].children.length
            },
            handlerNum (i) {
                let m, n, q
                q = +Array.of(i).join('')
                if (q === 0) {
                    m = n = 0
                } else {
                    m = Math.floor(q / 10)
                    n = q % 10
                }
                return { m, n }
            },
            provinceOver (id) {
                this.currentHoverProvince = id
            },
        }
    }
</script>
