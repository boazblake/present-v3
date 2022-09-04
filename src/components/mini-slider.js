import m from 'mithril'
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import { Sortable, Plugins } from '@shopify/draggable';
import { loadSlidesByProjectId as reload } from '../model.js'
import { propEq, } from 'ramda'
import Task from 'data.task'

const updateSlides = mdl => ({ oldIndex, newIndex }) => {
  const slide = mdl.slides.find(propEq('order', oldIndex))
  if (oldIndex != newIndex) {
    slide.order = newIndex

    const onSuccess = (_) => reload(mdl, mdl.presentation.id)


    mdl.http
      .putTask(mdl, `update-slide-order/${slide.filename}`, slide)
      .fork(log("error"), onSuccess)
  }
}

const deleteSlide = (mdl, slide) => {
  slide.content = ''
  slide.contents = ''
  mdl.http.putTask(mdl, `update-slide-order/${slide.filename}`, slide).chain(() => {
    if (slide.filename == mdl.slide.filename) {
      if (mdl.slide.order == 0) {
        mdl.slide = mdl.slides.find(s => s.order == 1)
      } else {
        mdl.slide = mdl.slides.find(s => s.order == parseInt(mdl.slide.order) - 1)
      }
    }
    return Task.of()
  }).fork(log('error'), () => {

    reload(mdl, mdl.presentation.id)
  })
  return false
}

const newViewer = (state, dom, slide) => {
  state.viewer && state.viewer.destroy()
  state.viewer = new Viewer({
    el: dom,
    initialValue: slide.contents
  })
}

const Contents = {
  oncreate: ({ dom, attrs: { slide, state } }) => newViewer(state, dom, slide),
  onupdate: ({ dom, attrs: { state, slide } }) => (state.id != slide.filename) && newViewer(state, dom, slide),
  view: () => m('.w3-container'),
}

const MiniSlide = ({ attrs: { key, state } }) => {
  return {
    onupdate: ({ dom, attrs: { mdl } }) => { mdl.slide.filename == key && dom.scrollIntoView({ behavior: "smooth", block: "center", }) },
    view: ({ attrs: { slide, mdl } }) => m('.w3-bar-item.w3-border.pointer.w3-margin.dragMe.w3-display-container', {
      draggable: true,
      class: mdl.slide.filename == key && 'w3-border-orange',
      ondragover: false,
      key, id: key,
      onclick: () => { mdl.slide = slide; !mdl.state.editor && mdl.state.showMiniSlider(false) },
      style: { width: '150px', height: '150px', maxWidth: '150px', maxHeight: '150px', minWidth: '150px', minHeight: '150px', overflow: 'hidden', transition: 'border 0.15s ease-in-out 0.25s' },
    },
      mdl.state.editor && mdl.slides.length > 1 && m('.w3-display-topright', m('button.w3-btn.w3-round.w3-red', { onclick: () => deleteSlide(mdl, slide) }, m.trust('&times;'))),
      m('header.w3-container.w3-bar',
        m('.w3-left', slide.title),
      ),
      m(Contents, { mdl, state, slide }),
    ),
  }
}

const MiniSlider = () => {
  return {
    view: ({ attrs: { mdl, state } }) =>
      m('section.w3-section', {
        onmouseenter: () => state.showSlidesBtn(true),
        onmouseleave: () => state.showSlidesBtn(false),
        style: {
          'height': `${state.calcHeight(state)}px`,
          transition: 'height 500ms, transform 2s'
        },

      },
        mdl.state.showMiniSlider() && m(".w3-bar", {
          oncreate: ({ dom }) => {
            mdl.state.editor && new Sortable([dom], {
              draggable: '.dragMe',
              distance: 5,
              mirror: {
                constrainDimensions: true,
              },
              plugins: [Plugins.SortAnimation],
              swapAnimation: {
                duration: 200,
                easingFunction: 'ease-in-out',
              },
            }).on('click', log('wtf'))
              .on('sortable:stop', updateSlides(mdl))
          },
          style: { height: '200px', overflow: "auto" }
        },
          mdl.slides.map((slide) => m(MiniSlide, { key: slide.filename, slide, mdl, state })),
        )
      )
  }
}

export default MiniSlider
