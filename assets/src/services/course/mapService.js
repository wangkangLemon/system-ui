import * as api from 'services/api'
// import authUtils from '../utils/authUtils'
import config from 'utils/config'
const urlPre = config.apiHost + '/sys/map/template'

class TeachingService {
    searchMap ({
       title,
       status,
       create_start_time,
       create_end_time,
       type,  // learn_map/teaching
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { title, status, create_start_time, create_end_time, type }).then(ret => ret.data)
    }
    createMap ({
        type,
        title,
        image,
        phase_type,
        phase_list,
        finish_exam_id,
        is_free
    }) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, JSON.stringify({ type, title, image, phase_type, phase_list, finish_exam_id, is_free })).then(ret => {
            xmview.showTip('success', ret.message || '创建成功')
        })
    }
    updateMap ({
        id,
        type,
        title,
        image,
        phase_type,
        phase_list,
        finish_exam_id,
        is_free
    }) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, JSON.stringify({ id, type, title, image, phase_type, phase_list, finish_exam_id, is_free })).then(ret => {
            xmview.showTip('success', ret.message || '更新成功')
        })
    }
    viewMap (id) {
        let finalUrl = `${urlPre}/${id}`
        return api.get(finalUrl).then(ret => ret.data)
    }
    deleteMap (id) {
        let finalUrl = `${urlPre}/${id}`
        return api.del(finalUrl).then(ret => {
            xmview.showTip('success', ret.message || '删除成功')
        })
    }
    disableMap ({
        id,
        disabled  // 0 上线；1 下线
    }) {
        let finalUrl = `${urlPre}/${id}/disable`
        return api.put(finalUrl, JSON.stringify({ disabled })).then(ret => {
            xmview.showTip('success', ret.message || disabled === 0 ? '上线' : '下线' + '成功')
        })
    }
}
export default new TeachingService()
