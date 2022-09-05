import m from "mithril"
import { serverURL } from '../model'

export const Auth = ({ attrs: { mdl } }) => {

  mdl.http.getTask(mdl, 'isAuth').fork(log('e'), ({ isAuth }) => {
    if (isAuth) { return m.route.set('/presentations') } else {
      if (window.location.search == '') {
        const opts = { client_id: '53d799dd7a4fafdde029', redirect_uri: serverURL, type: 'user_agent', scope: 'gist' }
        const param = new URLSearchParams(opts).toString()
        const uri = 'https://github.com/login/oauth/authorize'
        const url = `${uri}?${param}`
        window.location = url
      } else if (!window.hasCode) {
        const code = window.location.search.split('?code=')[1]
        window.aaaacode = code
        mdl.http.postTask(mdl, 'auth', { code }).fork((e) => { window.aaae = e }, s => {
          console.log('token', s)
          window.hasCode = true
          window.location = window.location.origin + 'present-v3/#!/presentations'
          m.route.set('/presentations')
        })
      } else if (window.hasCode) {
        m.route.set('/presentations')
      }
    }
  })




  return {
    // oncreate:() => {},
    view: ({ attrs: { mdl } }) =>
      m(
        "section.w3-section.w3-padding-row",
      ),
  }
}


