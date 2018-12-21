import authUtils from './authUtils'

class MixinUtils {
    isPermission (val) {
        return authUtils.isPermission(val)
    }

    // 输入框中的字符统一处理
    encodeParam (val) {
        return window.encodeURIComponent(val)
    }

    // AutoComplete输入框后端回传数据适配器
    autoCompleteAdpter (result, name) {
        return result.map((item) => {
            return { value: item[name] }
        })
    }
}

export default new MixinUtils()
