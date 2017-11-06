/**
 * 试卷管理
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017-10-31
 * Time: ${TIME}
 */
import * as api from './api'
import config from '../utils/config'

const urlPre = config.apiHost

class TestPagerService {
    search({keyword, status, time_start, time_end, page, page_size}) {
        let url = `${urlPre}/exam/search`
        return api.get(url, {keyword, status, time_start, time_end, page, page_size}).then((ret) => {
            return ret.data
        })
    }

    create({name, description, image, single_score, multi_score, judge_score, score_pass, limit_repeat, limit_time, answer_show_type, answer_show_time, type}) {
        let url = `${urlPre}/exam`
        return api.post(url, JSON.stringify({name, description, image, single_score, multi_score, judge_score, score_pass, limit_repeat, limit_time, answer_show_type, answer_show_time, type})).then((ret) => {
            return ret.data
        })
    }

    update(examId, {name, description, image, single_score, multi_score, judge_score, score_pass, limit_repeat, limit_time, answer_show_type, answer_show_time, type}) {
        let url = `${urlPre}/exam/${examId}`
        return api.put(url, JSON.stringify({name, description, image, single_score, multi_score, judge_score, score_pass, limit_repeat, limit_time, answer_show_type, answer_show_time, type})).then((ret) => {
            return ret.data
        })
    }

    batchCreateQuestion(examId, questions) {
        let url = `${urlPre}/exam/${examId}/subject`
        return api.post(url, JSON.stringify(questions)).then((ret) => {
            return ret.data
        })
    }

    batchDeleteQuestion(examId, questions) {
        questions.forEach((question) => {
            let url = `${urlPre}/exam/${examId}/subject/${question.id}`
            api.del(url, JSON.stringify(questions))
        })
    }

    delete(examId) {
        let url = `${urlPre}/exam/${examId}`
        return api.del(url).then((ret) => {
            return ret.data
        })
    }

    view(examId) {
        let url = `${urlPre}/exam/${examId}`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }

    searchQuestion(examId, {type, tags, page, page_size}) {
        let url = `${urlPre}/exam/${examId}/subject/search`
        return api.get(url, {type, tags, page, page_size}).then((ret) => {
            return ret.data
        })
    }

    online (examId) {
        let url = `${urlPre}/exam/${examId}/disable`
        return api.put(url, JSON.stringify({status: 0})).then((ret) => {
            return ret.data
        })
    }

    offline (examId) {
        let url = `${urlPre}/exam/${examId}/disable`
        return api.put(url, JSON.stringify({status: 1})).then((ret) => {
            return ret.data
        })
    }
    // 获取添加编辑课程上传图片的url
    getUploadUrl({image, alias}) {
        let url = `${urlPre}/exam/image`
        return api.post(url, {image, alias}).then((ret) => {
            return ret.data
        })
    }
}

export default new TestPagerService()
