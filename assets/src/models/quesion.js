/**
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017/11/2
 * Time: 上午11:25
 */

import testQuestionService from '../services/testQuestionService'
import Option from './option'

class Question {
    constructor() {
        this.id = 0
        this.type = 0
        this.group_id = ''
        this.group_name = ''
        this.description = ''
        this.score = 0
        this.image = ''
        this.explain = ''
        this.correct = 0
        this.editable = true
        this.tags = []
        this.options = []
    }

    /**
     * 添加题目的选项
     * @param option
     */
    addOption(option) {
        this.options.push(option)
    }

    /**
     * 替换某一个选项
     * @param index
     * @param option
     */
    replaceOption(index, option) {
        this.options.splice(index, 1, option)
    }

    /**
     * 通过ID查找一个题目，并且填充模型
     * @param group_id
     * @param id
     */
    findById(group_id, id) {
        return testQuestionService.view(group_id, id).then((ret) => {
            let subject = ret.subject

            this.id = subject.id
            this.type = subject.type
            this.description = subject.description
            this.score = 0
            this.image = subject.image
            this.explain = subject.explain
            this.correct = subject.correct
            this.tags = subject.tags == '' ? [] : subject.tags.split('，')
            this.group_id = subject.subject_group_id
            this.group_name = subject.subject_group_name

            subject.option.forEach((val, index) => {
                let option = new Option()
                option.id = val.id
                option.description = val.description
                option.correct = val.correct
                option.sort = val.sort

                // 为了兼容后端的数据格式
                if (this.type == 1 && option.correct == 1) {
                    this.correct = index
                    option.correct = 0
                }

                this.addOption(option)
            })
        })
    }

    save() {
        let question = this.format

        if (question.id) {
            return testQuestionService.update(question.group_id, question.id, {
                type: question.type,
                description: question.description,
                explain: question.explain,
                tags: question.tags,
                correct: question.correct,
                image: question.image,
                option: question.options
            })
        } else {
            return testQuestionService.create(question.group_id, {
                type: question.type,
                description: question.description,
                explain: question.explain,
                tags: question.tags,
                correct: question.correct,
                image: question.image,
                option: question.options
            })
        }
    }
    get typeName() {
        switch (this.type) {
        case 0:
            return '判断题'
        case 1:
            return '单选题'
        case 2:
            return '多选题'
        default:
            return '未定义'
        }
    }

    get tagString() {
        return this.tags.join('，')
    }

    /**
     * 获取请求数据
     * @returns {Question}
     */
    get format() {
        let question = Object.assign({}, this)
        if (question.type == 1) {
            question.options.forEach((option, index) => {
                if (index == question.correct) {
                    question.correct = 1
                } else {
                    question.correct = 0
                }
            })
            question.correct = 0
        }
        question.tags = this.tags.join('，')
        return question
    }
}

export default Question
