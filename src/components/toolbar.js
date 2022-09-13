import m from "mithril"
import { NewPresentationForm, NewSlideForm } from "./forms"
const homeRoute = () => m.route.get() == '/presentations'
const slideRoute = () => m.route.get().split('/')[1] == 'presentation'
const authRoute = () => m.route.get() == '/auth'

const addNew = (mdl) => {
  if (homeRoute()) {
    mdl.state.modalContent = m(NewPresentationForm, { mdl })
  } else {
    mdl.state.modalContent = m(NewSlideForm, { mdl })
  }
  mdl.state.showModal = true
}


const Toolbar = () => {
  const state = {
    showToolbar: true
  }

  const actionSettings = () => ({
    onmouseenter: () => state.showToolbar = true,
    onmouseleave: () => state.showToolbar = false,
  })



  return {
    view: ({ attrs: { mdl } }) => {
      return m(
        "nav.w3-bar.w3-container.w3-padding.w3-fixed.w3-display-container",
        slideRoute() && !mdl.state.editor && actionSettings(),
        slideRoute() && m('.w3-display-middle', mdl.presentation?.title),

        state.showToolbar && m('', m('.w3-left',

          slideRoute() && m(
            "button.w3-button.w3-border",
            { onclick: () => m.route.set('/') },
            "Back"
          ),


          mdl.state.isAuth && mdl.state.editor && m(
            "button.w3-button.w3-border",
            { onclick: () => addNew(mdl) },
            homeRoute() ? "Add Presentation" : "Add Slide"
          )),

          m('.w3-right',
            slideRoute() && m('.w3-bar', m(
              "button.w3-button.w3-border",
              {
                onclick: () => {
                  mdl.state.showMiniSlider(false)
                  mdl.toggleMode(mdl)
                }
              },
              mdl.state.editor ? 'PLAY' : 'EDIT'
            ),
              !mdl.state.editor && m(
                "button.w3-button.w3-border",
                {
                  onclick: () => {
                    mdl.state.showMiniSlider(false)
                    mdl.slide = mdl.slides[0]
                  }
                },
                m('i', {
                  style: {
                    fontSize: '15px'
                  },
                }, m.trust('&#8634;'))
              ))))
      )
    },
  }
}

export default Toolbar

