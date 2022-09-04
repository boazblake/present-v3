import m from 'mithril'
import http from "./http.js"
import Stream from 'mithril-stream'

const onError = ({ response: { error } }) => {
  console.error('ERROR', error)
  switch (error) {
    case 'relogin':
      m.route.set('/')
      break;
  }
}

export const loadAllPresentationsTask = (mdl) =>
  mdl.http
    .getTask(mdl, 'presentations')
    .fork(onError, presentations => mdl.presentations = presentations)

export const loadSlidesByProjectId = (mdl, presentationId) =>
  mdl.http
    .getTask(mdl, `presentation/${presentationId}`,)
    .fork(onError, ({ slides, title, id }) => {
      mdl.slides = slides
      mdl.presentation = { title, id }
      if (!mdl.slide) {
        mdl.slide = mdl.slides[0]
      }
    })



export const PRESENTATION = (title) => ({
  title,
})

export const SLIDE = (title, presentationId, order = 0) => ({
  title,
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
    showMiniSlider: Stream(false),
    isLoading: Stream(true),
    loadingProgress: { max: 0, value: 0 }
  },
  presentations: [],
  slides: [],
  slide: null,
  presentation: null,
  toggleMode: mdl => mdl.state.editor = !mdl.state.editor
}
export default model

