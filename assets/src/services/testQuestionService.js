/**
 * 试题管理
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017-10-31
 * Time: ${TIME}
 */
import * as api from './api'
import config from '../utils/config'

const urlPre = config.apiHost

class TestQuestionService {
    search({keyword, group_id, type, tags, time_start, time_end, page, page_size}) {
        let url = `${urlPre}/testbank/group_id/0/subject/search`
        return api.get(url, {page, page_size, keyword, time_start, time_end, type, tags}).then((ret) => {
            return ret.data
        })
    }
    create(group_id, {type, description, explain, tags, correct, image, option}) {
        let url = `${urlPre}/testbank/group/${group_id}/subject`
        return api.post(url, JSON.stringify({type, description, explain, tags, correct, image, option})).then((ret) => {
            return ret.data
        })
    }
    update(group_id, subject_id, {name, description}) {
        let url = `${urlPre}/testbank/group/${group_id}/subject/${subject_id}`
        return api.put(url, JSON.stringify({name, description})).then((ret) => {
            return ret.data
        })
    }
    delete(group_id, subject_id) {
        let url = `${urlPre}/testbank/group/${group_id}/subject/${subject_id}`
        return api.del(url, {}).then((ret) => {
            return ret.data
        })
    }
    view(group_id, subject_id) {
        let url = `${urlPre}/testbank/group/${group_id}/subject/${subject_id}`
        return api.get(url, {}).then((ret) => {
            return ret.data
        })
    }
}

export default new TestQuestionService()
