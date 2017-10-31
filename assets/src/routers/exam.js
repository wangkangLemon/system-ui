/**
 * Created by Pavle Lee on 2017/10/31.
 */
import Test from './exam/test'

const pathPre = '/exam'
// 考试管理
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../views/exam/Main.vue'))
        })
    },
    children: [
        Test
    ]
}
