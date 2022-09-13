import m from "mithril"

const getFrontEnd = (endpoint) => window.location.origin.includes('3000') ? 'http://localhost:3000/auth/' : `https://boazblake.github.io/present-v3/#!/${endpoint}/`

export const Auth = ({ attrs: { mdl } }) => {

  mdl.http.getTask(mdl, 'isAuth').fork(log('e'), ({ isAuth }) => {
    mdl.state.isAuth = isAuth
    if (isAuth) {
      // console.log('isauth', isAuth)
      return m.route.set('/presentations')
    } else {
      if (window.location.search == '') {
        const opts = { client_id: '53d799dd7a4fafdde029', redirect_uri: getFrontEnd('auth'), type: 'user_agent', scope: 'gist' }
        const param = new URLSearchParams(opts).toString()
        const uri = 'https://github.com/login/oauth/authorize/'
        const url = `${uri}?${param}`
        window.location = url
      } else if (!window.hasCode) {
        const code = window.location.search.split('?code=')[1]
        mdl.http.postTask(mdl, 'auth', { code }).fork((e) => { window.aaae = e }, s => {
          // console.log('token', JSON.stringify(s), window.location)
          window.hasCode = true
          mdl.state.isAuth = true
          window.location = getFrontEnd('presentations')
          m.route.set('/presentations')
        })
      } else if (window.hasCode) {
        m.route.set('/presentations')
      }
    }
  })

  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "section.w3-section.w3-padding-row",
      ),
  }
}


