/**
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017/11/2
 * Time: 下午3:14
 */
import testLibraryService from '../services/testLibraryService'

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

    /**
     *
     * @param group_id
     */
    findById(group_id) {
        return testLibraryService.view(group_id).then((ret) => {
            this.id = ret.subject_group.id
            this.name = ret.subject_group.name
            this.description = ret.subject_group.description
            this.single_total = ret.subject_group.single_num
            this.multi_total = ret.subject_group.multi_num
            this.judge_total = ret.subject_group.judge_num
        })
    }
}

export default Library
