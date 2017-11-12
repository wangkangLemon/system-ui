/**
 * 试题管理
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017-10-31
 * Time: ${TIME}
 */
import * as api from '../api'
import config from '../../utils/config'

const urlPre = config.apiHost

class TestQuestionService {
    search({subject_group_id, status, type, tags, time_start, time_end, page, page_size}) {
        let url = `${urlPre}/subject/search`
        if (subject_group_id === '' || subject_group_id === undefined) subject_group_id = -1
        if (status === '' || status === undefined) status = -1
        if (type === '' || type === undefined) type = -1

        return api.get(url, {subject_group_id, status, page, page_size, time_start, time_end, type, tags}).then((ret) => {
            return ret.data
        })
    }
    create({subject_group_id, type, description, explain, tags, correct, image, options}) {
        let url = `${urlPre}/subject`
        return api.post(url, JSON.stringify([{type, description, explain, tags, correct, image, options, subject_group_id}])).then((ret) => {
            return ret.data
        })
    }
    update(subject_id, {subject_group_id, type, description, explain, tags, correct, image, options}) {
        let url = `${urlPre}/subject/${subject_id}`
        return api.put(url, JSON.stringify({subject_group_id, type, description, explain, tags, correct, image, options})).then((ret) => {
            return ret.data
        })
    }
    delete(subject_id) {
        let url = `${urlPre}/subject/${subject_id}`
        return api.del(url, {}).then((ret) => {
            return ret.data
        })
    }
    batchDelete(data) {
        let url = `${urlPre}/subject/deletion`
        return api.put(url, JSON.stringify(data)).then((ret) => {
            return ret.data
        })
    }
    offline(subject_id) {
        let url = `${urlPre}/subject/${subject_id}/disable`
        return api.put(url, JSON.stringify({status: 1})).then((ret) => {
            return ret.data
        })
    }
    online(subject_id) {
        let url = `${urlPre}/subject/${subject_id}/disable`
        return api.put(url, JSON.stringify({status: 0})).then((ret) => {
            return ret.data
        })
    }
    view(subject_id) {
        let url = `${urlPre}/subject/${subject_id}`
        return api.get(url, {}).then((ret) => {
            return ret.data
        })
    }

    /**
     * 批量添加
     * @param group_id
     * @param list
     */
    batchCreate(list) {
        let url = `${urlPre}/subject`
        return api.post(url, JSON.stringify(list)).then((ret) => {
            return ret.data
        })
    }
}

export default new TestQuestionService()
