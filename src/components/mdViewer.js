import m from 'mithril'
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import { pluck, propEq } from 'ramda';
const mdViewer = ({ attrs: { mdl, state } }) => {
  let viewer;
  if (!mdl.slide) {
    mdl.slide = mdl.slides[0]
  }
  state.slideId = mdl.slide.filename
  state.dirty = false
  state.animate = 'right'

  const newViewer = (dom, mdl) => {
    mdl.dom = dom
    viewer && viewer.destroy()
    viewer = new Viewer({
      el: mdl.dom,
      initialValue: mdl.slide.contents,
    })
  }

  const updateSlide = (mdl, dir) => {
    let nextSlideIdx;
    mdl.dom.classList.remove('w3-animate-right', 'w3-animate-left')
    if (dir == 'e-resize' && mdl.slide.order < mdl.slides.length - 1) {
      setTimeout(() => mdl.dom.classList.add('w3-animate-right'))
      state.animate = 'right'
      nextSlideIdx = parseInt(mdl.slide.order) + 1
      mdl.slide = mdl.slides.find(propEq('order', nextSlideIdx))
    }


    if (dir == 'w-resize' && parseInt(mdl.slide.order) > 0) {
      setTimeout(() => mdl.dom.classList.add('w3-animate-left'))
      state.animate = 'left'
      nextSlideIdx = parseInt(mdl.slide.order) - 1
      mdl.slide = mdl.slides.find(propEq('order', nextSlideIdx))
    }


  }

  return {
    oncreate: ({ dom, attrs: { mdl } }) => newViewer(dom, mdl),
    view: ({ attrs: { mdl, state } }) => m(`#mdviewer.w3-section w3-animate-opacity w3-animate-${state.animate}`, {
      onmousemove: (e) => state.cursor(e.x > (window.innerWidth / 2) ? 'e-resize' : 'w-resize'),
      onclick: () => updateSlide(mdl, state.cursor()),
      style: {
        cursor: state.cursor(),
        height: `${window.innerHeight - state.sliderHeight() - 133}px`,
        overflow: 'scroll'
      }
    }),
    onupdate: ({ dom, attrs: { mdl, state } }) => {
      if (mdl.slide.filename !== state.slideId) {
        state.slideId = mdl.slide.filename
        newViewer(dom, mdl)
      }
    },
  }
}

export default mdViewer
