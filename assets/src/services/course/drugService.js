import * as api from 'services/api'
import config from 'utils/config'
const urlPre = config.apiHost + '/sys/drug'

class DrugService {
    searchDrug ({
        common_name,
        category_group_id,
        category_drug_id,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { common_name, category_group_id, category_drug_id, page, page_size }).then(ret => ret.data)
    }
    del (id) {
        let finalUrl = `${urlPre}/${id}`
        return api.del(finalUrl).then(ret => {
            xmview.showTip('success', ret.message || '删除成功')
        })
    }
    /**
     * type: system / group / drug (系统/柜组/药品)
     */
    getDrugCategory (type) {
        let finalUrl = `${urlPre}/category/${type}`
        return api.get(finalUrl).then(ret => ret.data)
    }
    getDrugDetail (id) {
        let finalUrl = `${urlPre}/${id}`
        return api.get(finalUrl).then(ret => ret.data)
    }
    add ({
        common_name,  // 通用名
        trade_name, // 商品名
        another_name, // 别名
        category_system_id, // 系统分类
        category_group_id, // 柜组分类
        category_drug_id, // 药品分类
        manufacturer, // 厂家
        category, // 品类
        treatment_course, // 疗程用药
        day_count, // 服药天数int
        instructions, // 关联说明书
        specification, // 规格
        treatment, // 功能主治
        disease, // 适应症
        drug_combination, // 联合用药
        selling_point // 卖点
    }) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, JSON.stringify({ common_name, trade_name, another_name, category_system_id, category_group_id, category_drug_id, manufacturer, category, treatment_course, day_count, instructions, specification, treatment, disease, drug_combination, selling_point })).then(ret => {
            xmview.showTip('success', ret.message || '添加成功')
        })
    }
    update ({
        id,
        common_name,
        trade_name,
        another_name,
        category_system_id,
        category_group_id,
        category_drug_id,
        manufacturer,
        category,
        treatment_course,
        day_count,
        instructions,
        specification,
        treatment,
        disease,
        drug_combination,
        selling_point
    }) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, JSON.stringify({ common_name, trade_name, another_name, category_system_id, category_group_id, category_drug_id, manufacturer, category, treatment_course, day_count, instructions, specification, treatment, disease, drug_combination, selling_point })).then(ret => {
            xmview.showTip('success', ret.message || '添加成功')
        })
    }
    fileImportUrl () {
        return `${urlPre}/excel`
    }
}

export default new DrugService()
