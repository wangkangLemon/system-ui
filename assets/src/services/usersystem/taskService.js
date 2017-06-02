/**
 * Created by huangrui on 2017/6/1.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/task'

class TaskService {
    // 列表
    search({page, page_size, category, title, status, user_action_name}) {
        let url = `${urlPre}/search`
        return api.get(url, {page, page_size, category, title, status, user_action_name}).then((ret) => {
            return ret.data
        })
    }
    // 获取用户行为类型
    userAction({category}) {
        let url = `${urlPre}/useraction`
        return api.get(url, {category}).then((ret) => {
            return ret.data
        })
    }
    // 添加任务
    add({title, category, user_action_name, user_action_object_id, count, reward}) {
        return api.post(urlPre, {title, category, user_action_name, user_action_object_id, count, reward})
    }
    // 修改任务
    update({id, title, user_action_name, user_action_object_id, count, reward}) {
        let url = `${urlPre}/${id}`
        return api.put(url, {title, user_action_name, user_action_object_id, count, reward})
    }
    // 删除任务
    del({task_id}) {
        let url = `${urlPre}/${task_id}`
        return api.del(url)
    }
}

export default new TaskService()
