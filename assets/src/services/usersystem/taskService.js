/**
 * Created by huangrui on 2017/6/1.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys/task'

class TaskService {
    // 列表
    search({page, page_size, category, title, icon, status = -1, user_action_name}) {
        let url = `${urlPre}/search`
        return api.get(url, {page, page_size, category, title, icon, status, user_action_name}).then((ret) => {
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
    add({title, category, icon, user_action_name, user_action_object_id, count, reward, app_version, platform, sample_image}) {
        return api.post(urlPre, {title, category, icon, user_action_name, user_action_object_id, count, reward, app_version, platform, sample_image})
    }
    // 修改任务
    update({id, title, user_action_name, icon, user_action_object_id, count, reward, app_version, platform, sample_image}) {
        let url = `${urlPre}/${id}`
        return api.put(url, {title, user_action_name, icon, user_action_object_id, count, reward, app_version, platform, sample_image})
    }
    disable({id, status}) { // 上下线
        let url = `${urlPre}/${id}/disable`
        return api.put(url, {id, status})
    }
    // 删除任务
    del({task_id}) {
        let url = `${urlPre}/${task_id}`
        return api.del(url)
    }
    // 上传图片
    upIcon({image, alias}) {
        let url = `${urlPre}/image`
        return api.post(url, {image, alias}).then((ret) => ret.data)
    }
}

export default new TaskService()
