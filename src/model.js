import http from "./http.js"
import { log, uuid } from "./helpers.ts"
import Stream from 'mithril-stream'

export const loadAllPresentationsTask = (mdl) =>
  mdl.http
    .getTask(mdl, 'presentations')
    .fork(log("error"), presentations => mdl.presentations = presentations)

export const loadSlidesByProjectId = (mdl, presentationId) =>
  mdl.http
    .getTask(mdl, `presentation/${presentationId}`,)
    .fork(_ => { mdl.error = 'No Presentation with that Id' }, ({ slides, title, id }) => {
      mdl.slides = (slides)
      mdl.presentation = { title, id }
      if (!mdl.slide) {
        mdl.slide = mdl.slides[0]
      }
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
  content: `${order}_sort_`,
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

