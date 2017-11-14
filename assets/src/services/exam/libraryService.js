/**
 * 试卷管理
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017-10-31
 * Time: ${TIME}
 */
import * as api from '../api'
import config from '../../utils/config'

const urlPre = config.apiHost

class TestLibraryService {
    search({keyword, time_start, time_end, page, page_size}) {
        let url = `${urlPre}/subject/group/search`
        return api.get(url, {page, page_size, keyword, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }
    create({name, description}) {
        let url = `${urlPre}/subject/group`
        return api.post(url, JSON.stringify({name, description})).then((ret) => {
            return ret.data
        })
    }
    update(id, {name, description}) {
        let url = `${urlPre}/subject/group/${id}`
        return api.put(url, JSON.stringify({name, description})).then((ret) => {
            return ret.data
        })
    }
    delete(id) {
        let url = `${urlPre}/subject/group/${id}`
        return api.del(url, {}).then((ret) => {
            return ret.data
        })
    }
    batchDelete(data) {
        let url = `${urlPre}/subject/group/deletion`
        return api.put(url, JSON.stringify(data)).then((ret) => {
            return ret.data
        })
    }
    /**
     *
     * @param group_id
     */
    view(group_id) {
        let url = `${urlPre}/subject/group/${group_id}`
        return api.get(url, {}).then((ret) => {
            return ret.data
        })
    }
}

export default new TestLibraryService()
