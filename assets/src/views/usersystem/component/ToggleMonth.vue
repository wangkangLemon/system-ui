<style lang="scss" rel="stylesheet/scss">
    .toggleDate-container {
        background: #fff;
        display: block;
        width: auto;
        text-align: center;
        padding: 20px 0;
        time {
            color: #666;
            padding: 0 20px;
            display: inline-block;
            max-width: 7rem;
        }
        em {
            padding: 0 3px;
        }
        i:first-of-type {
            display: inline-block;
            width: 15px;
            height: 15px;
            border-bottom: 1px solid #52bff1;
            border-left: 1px solid #52bff1;
            transform: rotate(45deg);
            cursor: pointer;
        }
        i:last-of-type {
            display: inline-block;
            width: 15px;
            height: 15px;
            border-bottom: 1px solid #52bff1;
            border-right: 1px solid #52bff1;
            transform: rotate(-45deg);
            cursor: pointer;
        }

        i:before {
            position: absolute;
            top: -10px;
            left: -10px;
            content: ' ';
            width: 30px;
            height: 30px;
            z-index: 9;
            display: block;
        }
    }
</style>
<template>
    <article class="toggleDate-container">
        <time>
            <i :class="{'gray': this.curDate.getMonth() < new Date().getMonth()}" @click="setDate(-1)"></i>
            {{curDate.getFullYear()}}
            <em>/</em>
            {{curDate.getMonth() + 1 | fillZero}}
            <i @click="setDate(1)"></i>
        </time>
    </article>
</template>
<script>
    import {fillZero} from '../../../utils/filterUtils'
    export default {
        filters: {
            fillZero
        },
        data () {
            return {
                curDate: new Date()
            }
        },
        methods: {
            setDate (num) {
                this.curDate = new Date(this.curDate.setMonth(this.curDate.getMonth() + num))
                this.$emit('toggleMonth', this.curDate)
            }
        }
    }
</script>
