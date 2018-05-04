<style lang="scss">
    #learning-maps-task-container {
        .el-dialog--small{
            width: 80%;
        }
        .el-tabs__content {
            position: relative;
            .dialog-select-item {
                h5 {
                    line-height: 40px;
                    font-size: 14px;
                    padding-left: 20px;
                    background: #fbfdff;
                    border: 1px solid #d1dbe5;
                    border-bottom: none;
                }
                position: absolute;
                top: 31px;
                right: 55px;
                height: 500px;
                width: 42%;
                display: inline-block;
                vertical-align: top;
            }
        }
        .row-class {
            border: 1px solid #d1dbe5;
        }
    }
</style>

<template>
    <main id="learning-maps-task-container">
        <el-dialog 
            :title="title" 
            :visible.sync="showDialog">
            <el-tabs type="border-card" @tab-click="handleTabClick" v-model="tabs">
                <el-tab-pane 
                    v-for="tab in initTabs"
                    :key="tab.value"
                    :label="tab.label"
                    :name="tab.type">
                    <component
                        ref="transfers"
                        :is="tab.component"
                        :type="tab.type"
                        :taskType="taskType"
                        :childType="tab.childType"
                        v-model="tab.selected"
                        @curRow="getCurRow">
                    </component>
                </el-tab-pane>
                <div class="dialog-select-item">
                    <h5>已选择</h5>
                    <el-table class="row-class" :show-header="false" :data="selected" :height="440" :row-key="selected.object_id" v-if="showDialog">
                        <el-table-column
                            prop="name" 
                            label="课程名">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.type | taskType('tag')">
                                    {{scope.row.type | taskType('label')}}
                                </el-tag>
                                <span>{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            width="50"
                            label="">
                            <template slot-scope="scope">
                                <el-button 
                                    type="text" 
                                    @click="deleteRow(scope.$index, scope.row)" 
                                    icon="delete"
                                    size="small">
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="footer"><el-button type="text" @click="deleteAll">全部删除</el-button></div>
                </div>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit">插入</el-button>
            </span>
        </el-dialog>    
    </main>
</template>

<script>
    import Transfer from 'components/dialog/Transfer2.vue'
    import GoodsTransfer from 'components/dialog/transfer/GoodsTransfer.vue'
    import GroupTransfer from 'components/dialog/transfer/GroupTransfer.vue'
    import ActivityTransfer from 'components/dialog/transfer/ActivityTransfer.vue'
    import TaskModel from './model'

    export default {
        components: {
            Transfer,
            GoodsTransfer,
            GroupTransfer,
            ActivityTransfer
        },
        props: {
            initTabs: {
                type: Array,
                default: () => new TaskModel().initTabs()
            },
            selected: Array,
            visible: Boolean,
            title: {
                type: String,
                default: '选取商品'
            },
            taskType: Number,
            keys: {
                type: Array,
                required: false
            },
            defaultTabs: {
                type: String,
                default: 'goods'
            }
        },
        activated () {},
        created () {
        },
        mounted () {},
        computed: {},
        watch: {
            visible (val) {
                this.showDialog = val
            },
            showDialog (val) {
                this.$emit('update:visible', val)
            },
        },
        data () {
            return {
                showDialog: this.visible,
                tabList: new TaskModel().initTabs(this.keys, this.initTabs),
                // tabList: this.initTabs,
                tabKeys: this.keys || TaskModel.keys,
                tabs: this.defaultTabs,
            }
        },
        methods: {
            deleteRow (index, row) {
                let ref = this.getRefsByType(this.$refs.transfers, row)
                ref.$refs.transfer.toggleRowSelectionById(row)
                ref.$refs.transfer.selectData.forEach((item, index, array) => {
                    (row.id + row.type) === (item.id + item.type) && array.splice(index, 1)
                })
                this.selected.splice(index, 1)
            },
            deleteAll () {
                for (let ref of Object.values(this.$refs.transfers)) {
                    let transfer = ref.$refs.transfer
                    transfer.toggleRowSelection()
                    transfer.selectData = []
                }
                while (this.selected.length > 0) {
                    this.selected.splice(0, 1)
                }
            },
            getCurRow (row, all) {
                // this.formatRow(row)
                if (all) {
                    if (!this.selected.some(item => item.id + item.type === row.id + row.type)) {
                        this.selected.push(row)
                    }
                } else {
                    if (this.selected.some(item => item.id + item.type === row.id + row.type)) {
                        for (let i = 0; i < this.selected.length; i++) {
                            if (this.selected[i].id + this.selected[i].type === row.id + row.type) {
                                this.selected.splice(i, 1)
                                return
                            }
                        }
                    } else {
                        this.selected.push(row)
                    }
                }
            },
            formatRow (row) {
                if (row.type === 'speaking') row.name = row.title
            },
            submit () {
                this.$emit('submit', this.selected)
                this.showDialog = false
            },
            handleTabClick () {},
            getRefsByType (refs, row) {
                return refs.filter(ref => {
                    return (ref.childType && ref.childType.includes(row.type)) || row.type === ref.type
                })[0]
            }
        },
        filters: {},
        directives: {},
    }
</script>
