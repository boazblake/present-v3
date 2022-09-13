import m from "mithril"
import { loadAllPresentationsTask } from "../model"
import { NewPresentationForm } from "../components/forms"


const deletePresentation = (mdl, id) => {
  mdl.http.deleteTask(mdl, `presentation/${id}`).fork(log('error'), () => loadAllPresentationsTask(mdl)
  )
  return false
}

const editPresentation = (mdl, key, title) => {
  mdl.state.modalContent = m(NewPresentationForm, { mdl, key, title })
  mdl.state.showModal = true
  return false
}

const Presentation = () => {
  return {
    view: ({ attrs: { mdl, title, action, key } }) => m(
      "button.w3-border-0.w3-button.w3-card.w3-display-container.w3-col.s12.m5.l3 ",
      {
        style: {
          height: '200px',
          margin: '3px',
        },
        onclick: action,
      },
      m('.w3-display-topright', m('button.w3-btn.w3-round.w3-blue', { onclick: () => editPresentation(mdl, key, title) }, '\u270F'), m('button.w3-btn.w3-round.w3-red', { onclick: () => deletePresentation(mdl, key) }, '\u00D7')),
      m('.w3-container', title)
    )
  }
}

const toPresentation = (title, id) =>
  m.route.set(`/presentation/${(title.replaceAll(' ', ''))}`, { id })

export const Presentations = ({ attrs: { mdl } }) => {
  loadAllPresentationsTask(mdl)
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "section.w3-container",
        m(
          "section.w3-row",
          mdl.presentations.map(({ id, title }) => m(Presentation, { key: id, mdl, title, action: () => toPresentation(title, id) }))
        ),
      ),
  }
}


