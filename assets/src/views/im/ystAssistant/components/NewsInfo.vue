<style lang='scss' rel='stylesheet/scss'>
    @import "../../../../utils/mixins/common";
    @import "../../../../utils/mixins/mixins";

    #img-ystassistant-components-newsinfo {
        width: 210px;

        %items {
            height: 142px;
            padding: 5px;
            border: 1px solid #ededed;
            cursor: pointer;
            position: relative;
            > div {
                position: relative;
                height: 100%;
            }

            > aside {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 40px;
                line-height: 42px;
                color: #fff;
                font-size: 18px;
                z-index: 11;
                background: rgba(0, 0, 0, 0.3);
                padding: 0 15px;

                .el-icon-delete {
                    float: right;
                    margin-top: 8px;
                }
            }
        }

        div.top {
            @extend %items;
            > div {
                // 默认图片
                .el-icon-picture {
                    font-size: 50px;
                    position: absolute;
                    height: 100%;
                    width: 100%;
                    background: #eeeeee;
                    top: 0;
                    left: 0;
                    color: #666;
                    padding-top: 26px;
                    z-index: 0;
                    text-align: center;
                }

                // 下方标题
                > h5 {
                    color: #fff;
                    background: rgba(0, 0, 0, 0.4);
                    height: 30px;
                    line-height: 30px;
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    text-align: left;
                    font-size: 14px;
                    padding: 0 5px;
                    z-index: 3;
                }

                // 图片显示
                > img {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 2;
                }
            }
        }

        > section {
            @extend %items;
            height: 92px;
            > div {
                vertical-align: top;
                border-top: 1px solid transparent;
                padding-top: 4px;
                h5 {
                    font-size: 14px;
                    width: 100px;
                    height: 48px;
                    word-break: break-all;
                    overflow: hidden;
                    color: #666;
                    line-height: 1.6em;
                    margin-top: 16px;
                }

                .el-icon-picture, img {
                    width: 78px;
                    height: 78px;
                    position: absolute;
                    right: 0;
                    top: 0;
                }
                .el-icon-picture {
                    vertical-align: middle;
                    text-align: center;
                    font-size: 50px;
                    background: #eee;
                    padding-top: 13px;
                    color: #666;
                }
            }
        }

        > section, div.top {
            &.selected {
                border: 2px solid #43b548;
            }
        }

        // 添加按钮
        > aside {
            @extend %items;
            height: 92px;
            border: 2px dashed #ededed;
            border-top: none;

            &:hover {
                border-color: #ddd;
                div {
                    color: #333;
                }
            }

            div {
                text-align: center;
                font-size: 50px;
                color: #666;
            }
        }
    }
</style>

<template>
    <article id="img-ystassistant-components-newsinfo">
        <div class="top" :class="{'selected' : listData[0].selected}" v-if="listData.length > 0"
             @mouseenter="listData[0].showManage = true"
             @mouseleave="listData[0].showManage = false"
             @click="handleItemClick(0,listData[0])">
            <div>
                <img :src="listData[0].thumb" v-if="listData[0] && listData[0].thumb">
                <i class="el-icon-picture" v-else></i>
                <h5>{{listData[0].title}}</h5>
            </div>

            <aside v-show="listData[0].showManage" v-if="type === 0">
                <i class="el-icon-caret-bottom" @click="move(1,0)" v-show="listData.length > 1"></i>
                <i class="el-icon-delete" @click="deleteItem(0)"></i>
            </aside>
        </div>

        <section v-for="(item, index) in listData.slice(1,listData.length)" :key="index"
                 :class='{"selected":item.selected}'
                 @mouseenter="item.showManage = true"
                 @mouseleave="item.showManage = false"
                 @click="handleItemClick(index+1,item)">
            <div>
                <h5>{{item.title}}</h5>
                <img :src="item.thumb" v-if="item && item.thumb">
                <i class="el-icon-picture" v-else></i>
            </div>

            <aside v-show="item.showManage" v-if="type === 0">
                <i class="el-icon-caret-top" @click="move(0,index+1)"></i>
                <i class="el-icon-caret-bottom" @click="move(1, index+1)" v-show="!(index+2 >= listData.length)"></i>
                <i class="el-icon-delete" @click="deleteItem(index+1)"></i>
            </aside>
        </section>

        <!--添加按钮-->
        <aside v-if="type === 0">
            <div @click="add">+</div>
        </aside>
    </article>
</template>

<script>
    function getModel () {
        return {
            'title': '标题',
            'cover': void 0,
            'thumb': void 0,
            'content': void 0,
            selected: false,
            showManage: false,
        }
    }
    // 添加需要响应的属性
    function processList (list) {
        let ret = []
        list.map((item) => {
            ret.push(Object.assign({}, item, {
                selected: false,
                showManage: false
            }))
        })
        return ret
    }

    export default{
        props: {
            value: {
                type: Array
            },
            type: { // 类别 0-增加修改 1-查看
                type: Number,
                default: 0
            },
            nodeClick: { // 每一项被点击的回调
                type: Function
            }
        },
        data () {
            return {
                listData: [getModel()]
            }
        },
        watch: {
            'value' (val) {
                this.setCurrList(val)
            }
        },
        created () {
            this.setCurrList(this.value)
        },
        activated () {
            this.setCurrList(this.value)
        },
        methods: {
            add () {
                this.listData.push(getModel())
                this.$emit('input', this.listData)
            },
            handleItemClick (index, item) {
                if (this.type === 0) {
                    this.listData.map((data) => {
                        data.selected = false
                    })
                    item.selected = true
                }

                this.nodeClick && this.nodeClick(index, item)
            },
            move (type, index) { // type- 0往上 1-往下
                if (type == 0)
                    [this.listData[index], this.listData[index - 1]] = [this.listData[index - 1], this.listData[index]]
                else
                    [this.listData[index], this.listData[index + 1]] = [this.listData[index + 1], this.listData[index]]
                this.$emit('input', this.listData)
            },
            // 删除
            deleteItem (index) {
                xmview.showDialog('是否确认删除?', () => {
                    this.listData.splice(index, 1)
                })
            },
            setCurrList (val) {
                if (!val || val.length < 1) {
                    this.listData = [getModel()]
                    return
                }
                if (this.type === 0)
                    this.listData = processList(val)
                else
                    this.listData = val
            }
        },
        components: {}
    }
</script>
