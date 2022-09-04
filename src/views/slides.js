import m from "mithril"
import { loadSlidesByProjectId } from "../model.js"
import { currentPresentationId, } from '../helpers.ts'
import MiniSlider from '../components/mini-slider.js'
import mdEditor from '../components/mdEditor.js'
import mdViewer from '../components/mdViewer.js'
import { isEmpty } from 'ramda'
import Stream from "mithril-stream";

const SlideToolBar = {
  view: ({ attrs: { mdl, state } }) =>
    m('.w3-display-container', {
      style: { height: '30px' },
      onmouseenter: () => state.showSlidesBtn(true),
      onmouseleave: () => state.showSlidesBtn(false),
    },
      mdl.state.editor && m('',
        { style: { width: '350px' }, },
        m('input.w3-input.w3-animate-input', {
          value: mdl.slide.title,
          style: { width: '350px' },
          oninput: ({ target: { value } }) => { mdl.slide.title = value; state.dirty = true }
        })),
      state.showSlidesBtn() &&
      m('button.w3-button.w3-display-topmiddle.w3-white w3-border w3-round-xlarge', { onclick: () => mdl.state.showMiniSlider(!mdl.state.showMiniSlider()) }, mdl.state.showMiniSlider() ? 'HIDE SLIDES' : 'SHOW SLIDES')
    )
}

export const Slides = ({ attrs: { mdl } }) => {
  const state = {
    watcher: null,
    dirt: false,
    cursor: Stream('pointer'),
    slideId: mdl.slide?.id,
    sliderHeight: Stream(160),
    showSlidesBtn: Stream(false),
    calcHeight: state =>
      mdl.state.showMiniSlider() ? state.sliderHeight(160) : state.sliderHeight(0)

  }
  loadSlidesByProjectId(mdl, currentPresentationId())
  return {
    onremove: ({ attrs: { mdl } }) => {
      mdl.state.editor = true
      mdl.editor = null
      mdl.slide = null
      mdl.slides = []
      clearInterval(state.watcher)
      state.watcher = null
    },
    view: ({ attrs: { mdl } }) => {
      return !isEmpty(mdl.slides) && m("section.w3-theme.w3-container",
        m(SlideToolBar, { mdl, state }),
        m(MiniSlider, { mdl, state }),
        mdl.state.editor ? m(mdEditor, { mdl, state }) : m(mdViewer, { mdl, state })
      )
    },
  }
}


