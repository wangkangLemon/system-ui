//全局的配置和属性信息


// 直播状态
export const liveStatus =  {
    unlive: 1, // 未直播
    living: 2, // 直播中
    lived: 3, // 已直播
    taped: 4, // 已录播
}
// 视频状态
export const videoStatus =  {
    turnok: 0, // 转码成功
    turning: 1, // 转码中
    turnerr: 2, // 转码失败
}