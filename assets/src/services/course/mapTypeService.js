import * as api from 'services/api'
import config from 'utils/config'
const urlPre = config.apiHost + '/sys/map/category'

class mapTypeService{
    getMapTypeList({//查询带教分类
        page,
        page_size,
        keyword,
        category_id
    }){
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { keyword, page, page_size,category_id }).then(ret => ret.data)
    }
    creatMapType({//创建带教分类
        name
    }){
        let finalUrl = `${urlPre}/create`
        return api.post(finalUrl, {name}).then(ret => ret.data)
    }
    delMapType(//删除带教分类
        id
    ){
        let finalUrl = `${urlPre}/delete/${id}`
        return api.post(finalUrl).then(ret => ret.data)
    }
    editMapType(//创建带教分类
        id,
        name
    ){
        let finalUrl = `${urlPre}/update/${id}`
        return api.post(finalUrl,{name}).then(ret => ret.data)
    }
}
export default new mapTypeService()