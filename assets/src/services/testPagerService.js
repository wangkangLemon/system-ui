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
        let url = `${urlPre}/testbank/group/search`
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

    batchCreateQuestion(examId, questions) {
        let url = `${urlPre}/exam/${examId}/subject`
        return api.post(url, JSON.stringify(questions)).then((ret) => {
            return ret.data
        })
    }
}

export default new TestPagerService()
