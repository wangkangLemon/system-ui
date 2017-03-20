/**
 * Created by huanghuixin on 2017/3/20.
 */

let debug = process.env.NODE_ENV == 'development'
const config = {
    apiHost: debug ? 'http://10.1.3.228:8002' : 'http://52hhx.com',
    debug
}

export default config
