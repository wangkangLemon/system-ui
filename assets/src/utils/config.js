/**
 * Created by huanghuixin on 2017/3/20.
 */

let debug = process.env.NODE_ENV == 'development'
const config = {
    isMobile () {
        return window.innerWidth < 767
    },
    apiHost: debug ? 'http://10.1.2.10:8003' : 'http://52hhx.com',
    debug
}

export default config
