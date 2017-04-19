/**
 * Created by huanghuixin on 2017/3/20.
 */

let debug = process.env.NODE_ENV == 'development'
const config = {
    isMobile () {
        return window.innerWidth < 767
    },
    // apiHost: debug ? 'http://10.1.2.3' : 'http://10.1.2.140',
    // apiHost: debug ? 'http://10.1.2.140' : 'http://10.1.2.140',
    // apiHost: debug ? 'http://10.1.2.13:8002' : 'http://10.1.2.140',
    apiHost: debug ? 'http://10.1.2.10:60001' : 'http://10.1.2.140',
    debug
}

export default config
