<!--地区下拉选择-->

<!--使用示范:-->
<!--<Region v-on:provinceChange="val => provinceSelect = val"
        v-on:cityChange="val => citySelect = val"
        v-on:areaChange="val => areaChange = val"
        :change="getData"></Region>-->

<style lang='scss' rel='stylesheet/scss'>
    .region-container {
        .el-select {
            max-width: 130px !important;
        }
    }
</style>

<template>
    <section class="region-container">
        <i>{{title}}</i>
        <el-select :disabled="disabled" placeholder="全部" clearable @change="setCurrVal(0, provinceSelect)" v-model="provinceSelect">
            <el-option v-for="(item, index) in provinces"
                       :label="item.name"
                       :value="item.id"
                       :key="item.id">
            </el-option>
        </el-select>
        <el-select :disabled="disabled" placeholder="全部" clearable @change="setCurrVal(1, citySelect)" v-model="citySelect">
            <el-option v-for="(item, index) in citys"
                       :label="item.name"
                       :value="item.id"
                       :key="item.id">
            </el-option>
        </el-select>
        <el-select :disabled="disabled" placeholder="全部" clearable @change="setCurrVal(2, areaSelect)" v-model="areaSelect">
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
        props: ['change', 'title', 'province', 'city', 'area', 'disabled'],
        data () {
            return {
                provinces: [],
                citys: [],
                areas: [],
                provinceSelect: '',
                citySelect: '',
                areaSelect: '',
                curItem: []
            }
        },
        watch: {
            province (val) {
                if (val) {
                    this.provinceSelect = val
                    this.setCurrVal(0, val)
                } else {
                    this.provinceSelect = ''
                }
            },
            city (val) {
                if (this.province && val) {
                    this.citySelect = val
                    this.setCurrVal(1, val)
                } else {
                    this.citySelect = ''
                }
            },
            area (val) {
                if (this.province && this.citySelect && val) {
                    this.areaSelect = val
                } else {
                    this.areaSelect = ''
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
                    }
                } else if (this.provinceSelect && type == 1) {
                    if (this.citys && this.citys.length > 0) {
                        this.areas = treeUtils.findItem(this.citys, levelPath).children
                    }
                }
            }
        }
    }
</script>
