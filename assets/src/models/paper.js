/**
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017/11/4
 * Time: 上午10:27
 */

import testPaperService from '../services/testPagerService'
import Question from './quesion'

class Paper {
    constructor() {
        this.id = 0
        this.name = ''
        this.image = ''
        this.single_score = void 0
        this.multi_score = void 0
        this.judge_score = void 0
        this.score_pass = void 0
        this.limit_time = void 0
        this.limit_repeat = void 0
        this.answer_show_type = 'now'
        this.answer_show_time = ''
        this.type = ''
        this.questions = []
        this.old_questions = []
        this.company_id = void 0
    }

    /**
     *
     * @param examId
     */
    findById(examId) {
        return testPaperService.view(examId).then((ret) => {
            this.id = ret.exam.id
            this.name = ret.exam.name
            this.image = ret.exam.image
            this.single_score = ret.exam.single_score
            this.multi_score = ret.exam.multi_score
            this.judge_score = ret.exam.judge_score
            this.score_pass = ret.exam.score_pass
            this.limit_time = ret.exam.limit_time
            this.limit_repeat = ret.exam.limit_repeat
            this.answer_show_type = ret.exam.answer_show_type
            this.answer_show_time = new Date(ret.exam.answer_show_time)
            this.type = ret.exam.type
            this.company_id = ret.exam.company_id

            return testPaperService.searchQuestion(this.id, {type: -1, page_size: 100}).then((ret) => {
                ret.list.forEach((val) => {
                    let question = new Question()
                    question.setModel(val)
                    question.editable = false

                    this.questions.push(question)
                    this.old_questions.push(question)
                })
            })
        })
    }

    save() {
        let request = this.format()
        if (this.id) {
            let {add, del} = this.compareQuestionsDiffSave()
            return testPaperService.update(this.id, request).then(() => {
                let data = []
                if (del.length > 0) {
                    del.forEach((question) => {
                        let item = question.format
                        item.operation = 'delete'
                        data.push(item)
                    })
                }

                if (add.length > 0) {
                    add.forEach((question) => {
                        let item = question.format
                        item.operation = 'create'
                        data.push(item)
                    })
                }
                return testPaperService.batchCreateQuestion(this.id, data).then(() => {
                    this.refresh()
                })
            })
        } else {
            let add = this.questions
            return testPaperService.create(request).then((ret) => {
                this.id = ret.id
                if (add.length > 0) {
                    let data = []
                    add.forEach((question) => {
                        let item = question.format
                        item.operation = 'create'
                        data.push(item)
                    })
                    return testPaperService.batchCreateQuestion(this.id, data).then(() => {
                        this.refresh()
                    })
                }
            })
        }
    }

    /**
     * 对比原来的问题和新的问题差集
     * @returns {{add, del}}
     */
    compareQuestionsDiffSave() {
        let oldRes = this.arrayToMap(this.old_questions, 'id')
        let nowRes = this.arrayToMap(this.questions, 'id')

        let delKeys = oldRes.keys.filter(v => !nowRes.keys.includes(v))

        let del = []
        delKeys.forEach((key) => {
            del.push(oldRes.map[key])
        })

        let add = []
        this.questions.forEach((question) => {
            if (question.id == 0) {
                add.push(question)
            }
        })

        return {add, del}
    }

    /**
     * @param array
     * @param key
     * @returns {{map: {}, keys: Array}}
     */
    arrayToMap(array, key) {
        let map = {}
        let keys = []
        array.forEach((item) => {
            map[item[key]] = item
            keys.push(item[key])
        })
        return {map, keys}
    }

    formatDate (date, fmt) {
        var o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            'S': date.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (var k in o)
            if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        return fmt
    }

    /**
     * 处理成接口请求参数
     * @returns {*}
     */
    format() {
        let data = Object.assign({}, this)
        if (data.answer_show_time instanceof Date) {
            data.answer_show_time = this.formatDate(data.answer_show_time, 'yyyy-MM-dd hh:mm:ss')
        }

        if (data.limit_repeat === '' || data.limit_repeat === undefined) {
            data.limit_repeat = 0
        }

        return data
    }

    refresh () {
        this.old_questions = this.questions
    }
}

export default Paper
