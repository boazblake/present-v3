import m from "mithril"
import { pluck } from 'ramda'
import { SLIDE, PRESENTATION, loadAllPresentationsTask, loadSlidesByProjectId } from "../model"
import { currentPresentationId } from '../helpers'

const addPresentation = (mdl, state) => {
  const presentation = PRESENTATION(state.title)

  const onError = log("error")
  const onSuccess = () => {
    state.title = ""
    mdl.state.showModal = false
    loadAllPresentationsTask(mdl)
  }

  const titles = pluck('title', mdl.presentations)
  if (titles.includes(presentation.title)) {
    return alert('Title is not uniqe')
  } else {
    mdl.http.postTask(mdl, "presentations", presentation).fork(onError, onSuccess)
  }
}

const addSlide = (mdl, state) => {
  const slide = SLIDE(state.title, currentPresentationId())

  const onError = log("error")
  const onSuccess = () => {
    state.title = ""
    mdl.state.showModal = false
    loadSlidesByProjectId(mdl, currentPresentationId())
  }

  mdl.http.postTask(mdl, "slides", slide).fork(onError, onSuccess)
}

const NewPresentationForm = () => {
  const state = {
    title: "",
  }

  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "form.w3-container.w3-card.w3-white",
        { onsubmit: (e) => e.preventDefault() },
        m(
          "div.w3-section",
          m("label", m("b", "Presentation Title")),
          m("input.w3-input.w3-border-bottom", {
            type: "text",
            value: state.title,
            oncreate: ({ dom }) => dom.focus(),
            oninput: (e) => (state.title = e.target.value),
          })
        ),
        m(
          "button.w3-button.w3-block.w3-orange.w3-section.w3-padding",
          { onclick: () => addPresentation(mdl, state) },
          "add"
        )
      ),
  }
}

const NewSlideForm = () => {
  const state = {
    title: "",
  }

  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "form.w3-container.w3-card.w3-white",
        { onsubmit: (e) => e.preventDefault() },
        m(
          "div.w3-section",
          m("label", m("b", "Slide Title")),
          m("input.w3-input.w3-border-bottom", {
            type: "text",
            value: state.title,
            oncreate: ({ dom }) => dom.focus(),
            oninput: (e) => (state.title = e.target.value),
          })
        ),
        m(
          "button.w3-button.w3-block.w3-orange.w3-section.w3-padding",
          { onclick: () => addSlide(mdl, state) },
          "add"
        )
      ),
  }
}

export { NewPresentationForm, NewSlideForm }

