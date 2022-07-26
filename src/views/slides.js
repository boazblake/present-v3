import m from "mithril"
import { loadSlidesByProjectId } from "../model.js"
import { currentPresentationId, } from '../helpers.ts'
import MiniSlider from '../components/mini-slider.js'
import mdEditor from '../components/mdEditor.js'
import { isEmpty } from 'ramda'
import Stream from "mithril-stream";
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'

const mdViewer = () => {
  let viewer;

  const newViewer = (dom, mdl) => {
    viewer && viewer.destroy()
    viewer = new Viewer({
      el: dom,
      initialValue: mdl.slide.contents || ' '
    })
  }

  const updateSlide = (mdl, state) => {
    console.log(mdl.slide)
    if (mdl.slide.order > 0 && mdl.slide.order < mdl.slides.length) {
      return mdl.slide = state.cursor() == 'e-resize'
        ? mdl.slides.find(s => s.order == mdl.slide.order + 1)
        : mdl.slides.find(s => s.order == mdl.slide.order - 1)
    }
  }

  return {
    oncreate: ({ dom, attrs: { mdl } }) => newViewer(dom, mdl),
    view: ({ attrs: { mdl, state } }) => m('.w3-section#viewer', {
      onmousemove: (e) => state.cursor(e.x > (window.innerWidth / 2) ? 'e-resize' : 'w-resize'),
      onclick: () => updateSlide(mdl, state),
      style: {
        cursor: state.cursor(),
        height: `${window.innerHeight - state.calcHeight(state) - 105}px`
      }
    }),
    onupdate: ({ dom, attrs: { mdl, state } }) => {
      if (mdl.slide.id !== state.slideId) {
        state.slideId = mdl.slide.id
        newViewer(dom, mdl)
      }
    },
  }
}

export const Slides = ({ attrs: { mdl } }) => {
  const state = {
    cursor: Stream('pointer'),
    slideId: mdl.slide?.id,
    sliderHeight: Stream(225),
    showSlidesBtn: false,
    calcHeight: state =>
      mdl.state.showMiniSlider() ? state.sliderHeight(228) : state.sliderHeight(28)

  }
  loadSlidesByProjectId(mdl, currentPresentationId())
  return {
    onremove: ({ attrs: { mdl } }) => { mdl.editor = null; mdl.slide = null; mdl.slides = [] },
    view: ({ attrs: { mdl } }) => {
      return !isEmpty(mdl.slides) ? m("section.w3-theme.w3-container",
        m(MiniSlider, { mdl, state }),
        mdl.state.editor ? m(mdEditor, { mdl, state }) : m(mdViewer, { mdl, state })
      ) : m('.w3-panel.w3-pale-blue', 'Loading')
    },
  }
}


