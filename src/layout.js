import m from "mithril"
import Toolbar from "./components/toolbar"
import Modal from "./components/modal"
import { Toaster } from './components/toaster'

const Layout = () => {
  const state = {
    status: 'loading'
  }
  return {
    view: ({ children, attrs: { mdl } }) => {
      return m(
        "section.w3-theme",
        m(Modal, { mdl }),
        m(Toolbar, { mdl, }),
        m(Toaster, { mdl }),
        m(
          "section.w3-main#main",
          {
            style: { overflow: "hidden" },
          },
          children
        )
      )
    },
  }
}

export default Layout

