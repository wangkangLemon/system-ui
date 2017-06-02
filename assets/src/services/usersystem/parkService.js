/**
 * Created by huanghuixin on 2017/6/1.
 */
import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/sys'

class ParkService {
    // ============================商品部分============================
    // 搜索商品
    prodSearch ({name, status = -1, category, page, page_size}) {
        let url = `${urlPre}/product/search`
        return api.get(url, {name, status, category, page, page_size}).then((ret) => {
            return ret.data
        })
    }

    // 获取详情
    prodDetail ({id}) {
        let url = `${urlPre}/product/${id}`
        return api.get(url, {}).then((ret) => {
            return ret.data.data
        })
    }

    // 商品类型
    prodCategory () {
        let url = `${urlPre}/product/category`
        return api.get(url, {}).then((ret) => {
            return ret.data
        })
    }

    // 上传封面图
    prodUploadImg ({alias = `${Date.now()}.jpg`, image}) {
        let url = `${urlPre}/product/image`
        return api.post(url, {alias, image}).then((ret) => {
            return ret.data.url
        })
    }

    /**
     发布商品

     quota,day字段说明：
     红包加成卡(price_plus_card)、成长值充值卡(growth_charge_card)类型商品需要分别填写 倍数与面值，对应字段 quota
     成长值加倍卡(growth_plus_card)类型需要填写倍数和天数，对应字段 quota和day
     其它类型没有这两个字段的表单
     */
    prodPublish ({name, category, description, image, price, expire, sort, status, quota, day}) {
        let url = `${urlPre}/product`
        return api.post(url, {
            name,
            category,
            description,
            image,
            price,
            expire,
            sort,
            status,
            quota,
            day
        }).then((ret) => {
            return ret.data
        })
    }

    /**
     *  编辑商品
     *  注意：不允许修改商品类型
     */
    prodUpdate ({id, name, description, image, price, expire, sort, status, quota, day}) {
        let url = `${urlPre}/product/${id}`
        return api.put(url, {name, description, image, price, expire, sort, status, quota, day}).then((ret) => {
            return ret.data
        })
    }

    // 商品上架下架 status-0 上架， 1 下架
    prodDisable ({id, status}) {
        let url = `${urlPre}/product/${id}/disable`
        return api.post(url, {status}).then((ret) => {
            return ret.data
        })
    }

    // ============================库存部分============================
    // 添加库存
    stockAdd ({prodId, count}) {
        let url = `${urlPre}/product/${prodId}/stock`
        return api.post(url, {count}).then((ret) => {
            return ret
        })
    }

    // 删除库存
    stockDel ({prodId, id}) {
        let url = `${urlPre}/product/${prodId}/stock/${id}`
        return api.del(url, {}).then((ret) => {
            return ret
        })
    }

    // 删除库存
    stockDelBatch ({prodId, ids}) {
        let url = `${urlPre}/product/${prodId}/stock/batchdel`
        return api.post(url, {id: ids.join(',')}).then((ret) => {
            return ret
        })
    }

    // 库存搜索
    stockSearch ({prodId, number, page, page_size}) {
        let url = `${urlPre}/product/${prodId}/stock/search`
        return api.get(url, {number, page, page_size}).then((ret) => {
            return ret.data
        })
    }

    // 导入url
    stockImportUrl ({prodId}) {
        return `${urlPre}/product/${prodId}/stock/import`
    }
}

export default new ParkService()
