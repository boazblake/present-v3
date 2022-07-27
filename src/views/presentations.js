import m from "mithril"
import { loadAllPresentationsTask } from "../model"


const deletePresentation = (mdl, id) => {
  mdl.http.deleteTask(mdl, `presentations/${id}`).fork(log('error'), () => loadAllPresentationsTask(mdl)
  )
  return false
}


const Presentation = () => {
  return {
    view: ({ attrs: { mdl, title, action, key } }) => m(
      "button.w3-border-0.w3-button.w3-card.w3-margin.w3-display-container",
      {
        style: {
          height: '200px',
          width: '200px',
        },
        onclick: action,
      },
      m('.w3-display-topright', m('button.w3-btn.w3-badge.w3-red', { onclick: () => deletePresentation(mdl, key) }, 'x')),
      m('.w3-container', title)
    )
  }
}

const toPresentation = (title, id) =>
  m.route.set(`/presentation/${title}`, { id })

export const Presentations = ({ attrs: { mdl } }) => {
  loadAllPresentationsTask(mdl)
  console.log(mdl)
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "section.w3-section.w3-padding-row",
        {
          style: { height: "90vh", overflow: "auto" },
        },
        m(
          "section.w3-section",

          mdl.presentations.map(({ title, id }) => m(Presentation, { key: id, mdl, title, action: () => toPresentation(title, id) }))
        ),
      ),
  }
}


