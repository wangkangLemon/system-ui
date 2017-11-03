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
    search({group_id, status, type, tags, time_start, time_end, page, page_size}) {
        let url = `${urlPre}/testbank/group/subject/search`
        if (!group_id) group_id = -1
        if (!status) status = -1
        if (!type) type = -1

        return api.get(url, {group_id, status, page, page_size, time_start, time_end, type, tags}).then((ret) => {
            return ret.data
        })
    }
    create(group_id, {type, description, explain, tags, correct, image, option}) {
        let url = `${urlPre}/testbank/group/${group_id}/subject`
        return api.post(url, JSON.stringify([{type, description, explain, tags, correct, image, option}])).then((ret) => {
            return ret.data
        })
    }
    update(group_id, subject_id, {type, description, explain, tags, correct, image, option}) {
        let url = `${urlPre}/testbank/group/${group_id}/subject/${subject_id}`
        return api.put(url, JSON.stringify({type, description, explain, tags, correct, image, option})).then((ret) => {
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

    /**
     * 批量添加
     * @param group_id
     * @param list
     */
    batchCreate(group_id, list) {
        let url = `${urlPre}/testbank/group/${group_id}/subject`
        return api.post(url, JSON.stringify(list)).then((ret) => {
            return ret.data
        })
    }
}

export default new TestQuestionService()
