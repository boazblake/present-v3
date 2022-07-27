import m from 'mithril'
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import { Sortable, Plugins } from '@shopify/draggable';
import { loadSlidesByProjectId as reload } from '../model.js'
import { propEq, } from 'ramda'

const updateSlides = mdl => ({ oldIndex, newIndex }) => {
  const slide = mdl.slides.find(propEq('order', oldIndex))
  slide.order = newIndex

  const onSuccess = (_) => {
    reload(mdl, mdl.presentation.id)
  }

  mdl.http
    .putTask(mdl, `slides/${slide.id}`, slide)
    .fork(log("error"), onSuccess)
}

const deleteSlide = (mdl, slide) => {
  mdl.http.deleteTask(mdl, `slides/${slide.id}`).fork(log('error'), () => reload(mdl, mdl.presentation.id))
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
  onupdate: ({ dom, attrs: { state, slide } }) => (state.id != slide.id) && newViewer(state, dom, slide),
  view: () => m('.w3-container'),
}

const MiniSlide = ({ attrs: { key, state } }) => {
  return {
    view: ({ attrs: { slide, mdl } }) => m('.w3-bar-item.w3-border.pointer.w3-margin.dragMe.w3-display-container', {
      draggable: true,
      class: mdl.slide?.id == key && 'w3-border-orange',
      ondragover: false,
      key, id: key,
      onclick: () => { mdl.slide = slide; !mdl.state.editor && mdl.state.showMiniSlider(false) },
      style: { width: '150px', height: '150px', maxWidth: '150px', maxHeight: '150px', minWidth: '150px', minHeight: '150px', overflow: 'hidden' },
    },
      mdl.state.editor && mdl.slides.length > 1 && m('.w3-display-topright.w3-circle', m('button.w3-red.w3-border.w3-btn.w3-circle', { onclick: () => deleteSlide(mdl, slide) }, m.trust('&times;'))),
      m('header.w3-container.w3-bar',
        m('.w3-left', slide.title),
      ),
      m(Contents, { mdl, state, slide }),
      m('footer.w3-container')
    ),
  }
}

const MiniSlider = () => {
  return {
    view: ({ attrs: { mdl, state } }) =>
      m('section.w3-section', {
        onmouseenter: () => state.showSlidesBtn(true),
        onmouseleave: () => state.showSlidesBtn(false),
        style: { 'height': `${state.calcHeight(state)}px`, },
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
          mdl.slides.map(slide => m(MiniSlide, { key: slide.id, slide, mdl, state })),
        )
      )
  }
}

export default MiniSlider
