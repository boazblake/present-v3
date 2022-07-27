import m from "mithril"
import { NewPresentationForm, NewSlideForm } from "./forms"
const homeRoute = () => m.route.get() == '/'

const addPresentation = (mdl, state) => {
  let presentation = PRESENTATION(state.title)

  const onError = log("error")
  const onSuccess = (data) => {
    console.log('data', data)
    state.title = ""
    mdl.state.showModal = false
    loadAllPresentationsTask(mdl)
  }

  let titles = pluck('title', mdl.presentations)
  if (titles.includes(presentation.title)) {
    return alert('Title is not uniqe')
  } else {
    mdl.http.postTask(mdl, "presentations", presentation).fork(onError, onSuccess)
  }
}

const addNew = (mdl) => {
  if (homeRoute()) {
    mdl.state.modalContent = m(NewPresentationForm, { mdl })
  } else {
    mdl.state.modalContent = m(NewSlideForm, { mdl })
  }
  mdl.state.showModal = true
}

const updateProject = (mdl) => {
  const onSuccess = (data) => {
    console.log("update project", data)
    // load(mdl)
  }
  mdl.http
    .putTask(mdl, `projects/${mdl.currentProject.id}`, mdl.currentProject)
    .fork(log("error"), onSuccess)
}

const Toolbar = () => {
  return {
    view: ({ attrs: { mdl, state } }) => {
      return m(

        "nav.w3-bar.w3-container.w3-padding.w3-fixed.w3-display-container",
        !homeRoute() && m('.w3-display-middle', mdl.presentation?.title),

        m('.w3-left', !homeRoute() && m(
          "button.w3-button.w3-border",
          { onclick: () => m.route.set('/') },
          "Back"
        ),

          m(
            "button.w3-button.w3-border",
            { onclick: () => addNew(mdl) },
            homeRoute() ? "Add Presentation" : "Add Slide"
          )),



        m('.w3-right',
          !homeRoute() && m('.w3-grouped', m(
            "button.w3-button.w3-border",
            {
              onclick: () => {
                mdl.state.showMiniSlider(false)
                mdl.toggleMode(mdl)
              }
            },
            mdl.state.editor ? 'PLAY' : 'EDIT'
          ),
            !mdl.state.editor && m(
              "button.w3-button.w3-border",
              {
                onclick: () => {
                  mdl.state.showMiniSlider(false)
                  console.log(mdl)
                  mdl.slide = mdl.slides[0]
                }
              },
              m('i', {
                style: {
                  fontSize: '15px'
                },
              }, m.trust('&#8634;'))
            ))),



        mdl.currentProject &&
        m(
          ".w3-row w3-section",
          m(
            ".m6 w3-left",
            m("input.w3-input w3-border-bottom w3-col", {
              oninput: (e) => (mdl.currentProject.title = e.target.value),
              placeholder: "project title",
              value: mdl.currentProject.title,
              onfocusout: () => updateProject(mdl),
            })
          ),
          m(
            ".m3 w3-right",
            m(
              "button. w3-button  w3-border w3-large w3-col",
              {
                onclick: () => addTicket(mdl, state),
              },
              "Add Ticket"
            )
          )
        )
      )
    },
  }
}

export default Toolbar

