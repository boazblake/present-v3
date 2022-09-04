import m from "mithril"
import Toolbar from "./components/toolbar"
import Modal from "./components/modal"
import { Toaster } from './components/toaster'

const Layout = {
  view: ({ children, attrs: { mdl } }) => {
    return m(
      "section.w3-theme",
      mdl.state.isLoading() && m('.w3-panel.w3-pale-blue', 'Loading'),
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

export default Layout

