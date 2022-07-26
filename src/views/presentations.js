import m from "mithril"
import { isEmpty } from 'ramda'
import { loadAllPresentationsTask } from "../model"

const Presentation = () => {
  return {
    view: ({ attrs: { mdl, title, action } }) => m(
      "button.w3-border-0.w3-button.w3-card.w3-margin",
      {
        style: {
          height: '200px',
          width: '200px',
        },
        onclick: action,
      },
      m('.w3-container', title)
    )
  }
}

const toPresentation = (mdl, title, id) => {
  mdl.currentPresentation = id
  m.route.set(`/presentation/${title}`, { id })

}

export const Presentations = ({ attrs: { mdl } }) => {
  loadAllPresentationsTask(mdl)

  return {
    view: ({ attrs: { mdl, state } }) =>
      m(
        "section.w3-section.w3-padding-row",
        {
          style: { height: "90vh", overflow: "auto" },
        },
        m(
          "section.w3-section",

          mdl.presentations.map(({ title, id }) => m(Presentation, { key: id, mdl, title, action: () => toPresentation(mdl, title, id) }))
        ),
      ),
  }
}


