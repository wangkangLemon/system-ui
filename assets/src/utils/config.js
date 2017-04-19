/**
 * Created by huanghuixin on 2017/3/20.
 */

let debug = process.env.NODE_ENV == 'development'

const config = {
    isMobile () {
        return window.innerWidth < 767
    },
    apiHost: debug ? 'http://10.1.2.13:8002' : process.apiHost,
    debug
}

export default config
