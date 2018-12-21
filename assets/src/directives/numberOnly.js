/**
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017/11/10
 * Time: 下午5:27
 */

export default {
    bind: function (el) {
        el.addEventListener('keyup', () => {
            let input = el.querySelector('.el-input__inner')
            input.value = input.value.replace(/\D+/, '')
        })
        el.addEventListener('click', () => {
            let input = el.querySelector('.el-input__inner')
            input.value = input.value.replace(/\D+/, '')
        })
    },
    unbind: function (el) {
        el.removeEventListener('keyup', () => {
            let input = el.querySelector('.el-input__inner')
            input.value = input.value.replace(/\D+/, '')
        })
        el.removeEventListener('click', () => {
            let input = el.querySelector('.el-input__inner')
            input.value = input.value.replace(/\D+/, '')
        })
    }
}
