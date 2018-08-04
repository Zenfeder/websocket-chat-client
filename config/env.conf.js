const ENV_BUILD_TYPE = process.env.ENV_BUILD_TYPE || 'test'

const PROD_ASSETS_PATH_MAP = {
  test: 'http://adam-chen.oss-cn-hangzhou.aliyuncs.com/webrtc/',
  master:'http://adam-chen.oss-cn-hangzhou.aliyuncs.com/webrtc/'
}

const PROD_API_PATH_MAP = {
  test: "http://149.28.40.37:8081",
  master: "http://149.28.40.37:8081"
}

module.exports = {
  PROD_ASSETS_PATH: PROD_ASSETS_PATH_MAP[ENV_BUILD_TYPE],
  PROD_API_PATH: PROD_API_PATH_MAP[ENV_BUILD_TYPE]
}