import http from "./http.js"
import { log, uuid } from "./helpers.ts"
import Stream from 'mithril-stream'

export const loadAllPresentationsTask = (mdl) =>
  mdl.http
    .getTask(mdl, "presentations")
    .fork(log("error"), presentations => mdl.presentations = presentations)

export const loadSlidesByProjectId = (mdl, presentationId) =>
  mdl.http
    .getTask(mdl, `presentation/${presentationId}`,)
    .fork(_ => { mdl.error = 'No Presentation with that Id' }, data => {
      mdl.slides = data.slides
      mdl.presentation = data.presentation
    })



export const PRESENTATION = (title, order = 0) => ({
  title,
  id: uuid(),
  order,
})

export const SLIDE = (title, presentationId, order = 0) => ({
  title,
  id: uuid(),
  contents: '',
  order,
  presentationId
})

const model = {
  http,
  settings: {},
  state: {
    editor: true,
    dragging: {
      slideId: "",
    },
    showModal: false,
    modalContent: null,
    showMiniSlider: Stream(false)
  },
  presentations: [],
  slides: [],
  slide: null,
  presentation: null,
  toggleMode: mdl => mdl.state.editor = !mdl.state.editor
}
export default model

