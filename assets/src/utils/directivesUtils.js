import Vue from 'vue'
export const numberOnly = Vue.directive('numberOnly', {
    bind: function (el) {
        el.addEventListener('keyup', () => {
            let input = el.querySelector('.el-input__inner')
            let value = input.value
            // debugger
            const newVal = value === '' ? undefined : Number(value)
            if (isNaN(newVal)) {
                value.replace(/([^.\d+])|(\d*\.?\d*)/, (match, p1, p2, p3) => {
                    if (p2 != undefined) {
                        input.value = p2
                    } else {
                        input.value = ''
                    }
                })
            }
            // input.value = newVal.replace(/[^.\d+]|(\d+\.)\.?$/, '$1')
        })
    },
    unbind: function (el) {
        el.removeEventListener('keyup', () => {
            let input = el.querySelector('.el-input__inner')
            let value = input.value
            // debugger
            const newVal = value === '' ? undefined : Number(value)
            if (isNaN(newVal)) {
                value.replace(/([^.\d+])|(\d*\.?\d*)/, (match, p1, p2, p3) => {
                    if (p2 != undefined) {
                        input.value = p2
                    } else {
                        input.value = ''
                    }
                })
            }
        })
    }
})

export const pnumberOnly = Vue.directive('pnumberOnly', {
    bind: function (el) {
        el.addEventListener('keyup', () => {
            let input = el.querySelector('.el-input__inner')
            let value = input.value
            // debugger
            input.value = isNaN(parseInt(value)) ? '' : parseInt(value)
            // input.value = newVal.replace(/[^.\d+]|(\d+\.)\.?$/, '$1')
        })
    },
    unbind: function (el) {
        el.removeEventListener('keyup', () => {
            let input = el.querySelector('.el-input__inner')
            let value = input.value
            input.value = isNaN(parseInt(value)) ? '' : parseInt(value)
        })
    }
})
