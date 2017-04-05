<!--地区下拉选择-->

<!--使用示范:-->
<!--<Region v-on:provinceChange="val => provinceSelect = val"
        v-on:cityChange="val => citySelect = val"
        v-on:areaChange="val => areaChange = val"
        :change="getData"></Region>-->

<style lang='scss' scoped rel='stylesheet/scss'></style>

<template>
    <section>
        <i>地区</i>
        <el-select clearable placeholder="全部" @change="setCurrVal(0, provinceSelect)" v-model="provinceSelect">
            <el-option v-for="(item, index) in provinces"
                       :label="item.name"
                       :value="item.id"
                       :key="item.id">
            </el-option>
        </el-select>
        <el-select clearable placeholder="全部" @change="setCurrVal(1, citySelect)" v-model="citySelect">
            <el-option v-for="(item, index) in citys"
                       :label="item.name"
                       :value="item.id"
                       :key="item.id">
            </el-option>
        </el-select>
        <el-select clearable placeholder="全部" @change="setCurrVal(2, areaSelect)" v-model="areaSelect">
            <el-option v-for="(item, index) in areas"
                       :label="item.name"
                       :value="item.id"
                       :key="item.id">
            </el-option>
        </el-select>
    </section>
</template>

<script>
    export default{
        props: ['change'],
        data () {
            return {
                provinces: [],
                citys: [],
                areas: [],
                provinceSelect: '',
                citySelect: '',
                areaSelect: ''
            }
        },
        created () {
            // 获取数据
            this.fetchData()
        },
        methods: {
            setCurrVal (type, val) {
                let emitArr = ['provinceChange', 'cityChange', 'areaChange']
                this.$emit(emitArr[type], val)
                this.change && this.change()
            },
            fetchData () {
//                获取数据
            }
        }
    }
</script>
