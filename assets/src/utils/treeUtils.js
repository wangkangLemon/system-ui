/**
 * Created by huanghuixin on 2017/3/29.
 */
// 操作tree的帮助方法

class TreeUtils {
    /**
     * 将arr变为tree的结构
     * @param arr 原始数组
     * @param pidKey 父id的key
     * @param idKey id的key
     *
     * return 结果  [{ item, children:[ {item,children}, {}] }] 没有children 说明是叶子节点
     */
    arr2Tree (arr, pid = 0, pidKey = 'parent_id', idKey = 'id') {
        let ret = []
        arr.forEach((item) => {
            if (item[pidKey] !== pid)
                return

            let currItem = {item}
            let children = this.arr2Tree(arr, item[idKey], pidKey, idKey)
            currItem.children = children.length > 0 ? children : null
            ret.push(currItem)
        })

        return ret
    }
}

export default new TreeUtils()
