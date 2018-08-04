import axios from 'axios'

export default function ({ url, method, headers, query, data }) {
  let _method = method || 'get'
  let _url = url
  let _headers = headers || {}
  let _query = query || {}
  let _data = data || {}

  return new Promise((resolve, reject) => {
    axios({
      method: _method,
      headers: _headers,
      url: _url,
      data: _data,
      params: _query
    }).then(res => {
      // statusCode: res.status
      resolve(res.data)
    }).catch(err => {
      // statusCode: err.response.status
      reject(err.response.data)
    })
  })
}
