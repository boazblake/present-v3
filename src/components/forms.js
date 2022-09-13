import m from "mithril"
import { pluck } from 'ramda'
import { SLIDE, PRESENTATION, loadAllPresentationsTask, loadSlidesByProjectId } from "../model"
import { currentPresentationId } from '../helpers'
import Task from "data.task/lib/task"

const validateStateTask = (mdl, state) => {
  const titles = pluck('title', mdl.presentations)
  if (state.title) {
    if (titles.includes(state.title)) {
      return Task.rejected(('Title is not uniqe'))
    }
  } else {
    return Task.reject(('Title is required'))
  }
  return Task.of(state)
}

const addPresentationTask = ({ mdl, state }) => {
  const presentation = PRESENTATION(state.title)
  return mdl.http.postTask(mdl, "presentations", presentation)
}

const editPresentationTask = ({ mdl, state: { title }, key }) =>
  mdl.http.putTask(mdl, `presentation/${key}`, { title })


const save = ({ mdl, state, key }) => {
  const onError = error => {
    state.error = error;
    alert(state.error)
  }

  const onSuccess = () => {
    state.title = ""
    mdl.state.showModal = false
    loadAllPresentationsTask(mdl)
  }

  validateStateTask(mdl, state).chain(state =>
    state.add ? addPresentationTask({ mdl, state }) : editPresentationTask({ mdl, state, key })
  ).fork(onError, onSuccess)
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

const NewPresentationForm = ({ attrs: { title } }) => {
  const state = {
    title: "",
    add: true
  }

  if (title) {
    state.title = title
    state.add = false
  }

  return {
    view: ({ attrs: { mdl, key } }) =>
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
          { onclick: () => save({ mdl, state, key }) },
          state.add ? "add" : "edit"
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

