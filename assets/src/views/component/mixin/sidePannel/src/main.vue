<style lang="scss">
    #side-pannel-container {
        position: absolute;
        overflow-y: scroll;
        overflow-x: hidden;
        top: 56px;
        bottom: 0;
        right: -630px;
        border-left: 1px solid #97a8be;
        width: 630px;
        max-width: 630px;
        transition: all 250ms ease-in-out;
        background: #eef1f6;
        z-index: 1000;
        .close-btn {
            position: absolute;
            left: 0;
            font-size: 20px;
            margin-bottom: 20px;
        }
    }
    #side-pannel-container.active {
        transform: translate3d(-630px,0,0);
    }
    @media only screen and (max-width: 680px) {
        #side-pannel-container {
            width: 90%;
            width: calc(100% - 50px);
        }
    }
    @media only screen and (max-width: 480px) {
        #container-main {
            width: 100%;
        }
    }
</style>

<template>
    <aside id="side-pannel-container" :class="[{ active: isActive }, customClass]" :style="customStyle" @click="stop">
        <!-- <i class="el-icon-close close-btn" @click="close()"></i> -->
        <slot>hello world</slot>
    </aside>
</template>

<script>
    export default {
        data () {
            return {
                isActive: false,
                customStyle: {},
                customClass: ''
            }
        },
        watch: {

        },
        created () {
            document.body.addEventListener('click', this.close, false)
        },
        methods: {
            close () {
                this.isActive = false
                if (typeof this.onClose === 'function') {
                    this.onClose(this)
                }
            },
            destoryElement () {
                this.$destroy(true)
            },
            stop (e) {
                e.stopPropagation()
            }
        },
    }
</script>
