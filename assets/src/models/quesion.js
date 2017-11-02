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
        this.score = ''
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

            subject.option.forEach((val) => {
                let option = new Option()
                option.id = val.id
                option.description = val.description
                option.correct = val.correct
                option.sort = val.sort

                this.addOption(option)
            })
        })
    }

    save() {
        if (this.id) {
            return testQuestionService.update(this.group_id, this.id, {
                type: this.type,
                description: this.description,
                explain: this.explain,
                tags: this.tags.join('，'),
                correct: this.correct,
                image: this.image,
                option: this.options
            })
        } else {
            return testQuestionService.create(this.group_id, {
                type: this.type,
                description: this.description,
                explain: this.explain,
                tags: this.tags.join('，'),
                correct: this.correct,
                image: this.image,
                option: this.options
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
}

export default Question
