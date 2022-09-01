import m from 'mithril'
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
// import '../../node_modules/impress.js/src/impress.js'
const mdViewer = ({ attrs: { mdl, state } }) => {
  let viewer;
  if (!mdl.slide) {
    mdl.slide = mdl.slides[0]
  }
  state.slideId = mdl.slide.id
  state.dirty = false

  const newViewer = (dom, mdl) => {
    viewer && viewer.destroy()
    viewer = new Viewer({
      el: dom,
      initialValue: mdl.slide.contents
    })
  }

  const updateSlide = (mdl, dir) => {
    if (dir == 'e-resize' && mdl.slide.order < mdl.slides.length - 1)
      return mdl.slide = mdl.slides.find(s => s.order == mdl.slide.order + 1)


    if (dir == 'w-resize' && mdl.slide.order > 0)
      return mdl.slide = mdl.slides.find(s => s.order == mdl.slide.order - 1)

  }

  return {
    oncreate: ({ dom, attrs: { mdl } }) => newViewer(dom, mdl),
    view: ({ attrs: { mdl, state } }) => m('.w3-section#impress', {
      onmousemove: (e) => state.cursor(e.x > (window.innerWidth / 2) ? 'e-resize' : 'w-resize'),
      onclick: () => updateSlide(mdl, state.cursor()),
      style: {
        cursor: state.cursor(),
        height: `${window.innerHeight - state.sliderHeight() - 133}px`,
        overflow: 'scroll'
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

export default mdViewer
