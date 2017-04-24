<!--地区下拉选择-->

<!--使用示范:-->
<!--<Region v-on:provinceChange="val => provinceSelect = val"
        v-on:cityChange="val => citySelect = val"
        v-on:areaChange="val => areaChange = val"
        :change="getData"></Region>-->

<style lang='scss' scoped rel='stylesheet/scss'></style>

<template>
    <section>
        <i>{{title}}</i>
        <el-select :disabled="disabled" :placeholder="placeholderVal.province" clearable @change="setCurrVal(0, provinceSelect)" v-model="provinceSelect">
            <el-option v-for="(item, index) in provinces"
                       :label="item.name"
                       :value="item.id"
                       :key="item.id">
            </el-option>
        </el-select>
        <el-select :disabled="disabled" :placeholder="placeholderVal.city" clearable @change="setCurrVal(1, citySelect)" v-model="citySelect">
            <el-option v-for="(item, index) in citys"
                       :label="item.name"
                       :value="item.id"
                       :key="item.id">
            </el-option>
        </el-select>
        <el-select :disabled="disabled" :placeholder="placeholderVal.area" clearable @change="setCurrVal(2, areaSelect)" v-model="areaSelect">
            <el-option v-for="(item, index) in areas"
                       :label="item.name"
                       :value="item.id"
                       :key="item.id">
            </el-option>
        </el-select>
    </section>
</template>

<script>
    import cityData from '../../../assets/city'
    import treeUtils from '../../../utils/treeUtils'
    export default{
        props: ['change', 'title', 'placeholder', 'disabled'],
        data () {
            return {
                provinces: [],
                citys: [],
                areas: [],
                provinceSelect: '',
                citySelect: '',
                areaSelect: '',
                curItem: [],
                placeholderVal: {
                    province: '全部',
                    city: '全部',
                    area: '全部'
                }
            }
        },
        watch: {
            placeholder (val) {
                if (val && val.length > 0) {
                    let provinceObj = treeUtils.findItem(cityData, [`${val[0]}`])
                    let cityObj = treeUtils.findItem(cityData, [`${val[0]}`, `${val[1]}`])
                    let areaObj = treeUtils.findItem(cityData, [`${val[0]}`, `${val[1]}`, `${val[2]}`])
                    if (provinceObj != undefined && cityObj != undefined && areaObj != undefined) {
                        this.placeholderVal.province = provinceObj.name
                        this.placeholderVal.city = cityObj.name
                        this.placeholderVal.area = areaObj.name
                    }
                }
            },
            disabled (val) {
                if (val) {
                    this.provinceSelect = ''
                }
            }
        },
        created () {
            // 获取数据
            cityData.forEach((item) => {
                this.provinces.push({
                    name: item.name,
                    id: item.id
                })
            })
        },
        methods: {
            setCurrVal (type, val) {
                let emitArr = ['provinceChange', 'cityChange', 'areaChange']
                this.$emit(emitArr[type], val)
                this.change && this.change()
                let levelPath = []
                let typeArr = ['provinceSelect', 'citySelect', 'areaSelect']
                if (!this[typeArr[type]]) return
                levelPath = [this[typeArr[type]]]
                if (type == 0) {
                    this.curItem = treeUtils.findItem(cityData, levelPath)
                    if (this.curItem.children && this.curItem.children.length > 0) {
                        this.citys = this.curItem.children
                        this.citySelect = ''
                        this.areaSelect = ''
                        this.placeholderVal = {
                            province: '全部',
                            city: '全部',
                            area: '全部'
                        }
                    }
                } else if (this.provinceSelect && type == 1) {
                    if (this.citys && this.citys.length > 0) {
                        this.areaSelect = ''
                        this.areas = treeUtils.findItem(this.citys, levelPath).children
                    }
                }
            }
        }
    }
</script>
