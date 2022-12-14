import Task from "data.task"
import m from "mithril"
import { serverURL } from './model'


const headers = {
  "Content-Type": "application/json",
}

const onProgress = (mdl) => (e) => {
  if (e.lengthComputable) {
    mdl.state.loadingProgress.max = e.total
    mdl.state.loadingProgress.value = e.loaded
    m.redraw()
  }
}

function onLoad() {
  return false
}

const onLoadStart = (mdl) => (e) => {
  mdl.state.isLoading(true)
  return false
}

const onLoadEnd = (mdl) => (e) => {
  mdl.state.isLoading(false)
  mdl.state.loadingProgress.max = 0
  mdl.state.loadingProgress.value = 0
  return false
}

const xhrProgress = (mdl) => ({
  config: (xhr) => {
    xhr.onprogress = onProgress(mdl)
    xhr.onload = onLoad
    xhr.onloadstart = onLoadStart(mdl)
    xhr.onloadend = onLoadEnd(mdl)
  },
})

export const parseHttpError = (mdl) => (rej) => (e) => {
  mdl.state.isLoading(false)

  return rej(JSON.parse(JSON.stringify(e)))
}

export const parseHttpSuccess = (mdl) => (res) => (data) => {
  mdl.state.isLoading(false)
  return res(data)
}

const HttpTask = (method) => (mdl) => (url) => (body) => {
  mdl.state.isLoading(true)
  return new Task((rej, res) =>
    m
      .request({
        method,
        url,
        headers,
        body,
        withCredentials: false,
        ...xhrProgress(mdl),
      })
      .then(parseHttpSuccess(mdl)(res), parseHttpError(mdl)(rej))
  )
}

const http = {
  getTask: (mdl, url) => HttpTask("GET")(mdl)(serverURL + url)(),
  postTask: (mdl, url, body) => HttpTask("POST")(mdl)(serverURL + url)(body),
  postOutTask: (mdl, url, body) => HttpTask("POST")(mdl)(url)(body),
  putTask: (mdl, url, body) => HttpTask("PUT")(mdl)(serverURL + url)(body),
  deleteTask: (mdl, url) => HttpTask("DELETE")(mdl)(serverURL + url)(),
}

export default http

