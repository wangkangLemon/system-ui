/**
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017/11/2
 * Time: 下午3:14
 */

class Library {
    constructor() {
        this.id = 0
        this.name = ''
        this.description = ''
        this.single_total = 0
        this.multi_total = 0
        this.judge_total = 0
    }

    /**
     * 填充一个模型
     * @param id
     * @param name
     * @param description
     */
    setModel({id, name, description}) {
        this.id = id
        this.name = name
        this.description = description
    }
}

export default Library
