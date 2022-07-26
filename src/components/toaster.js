import m from "mithril"
import { uuid, threeSeconds } from "../helpers"

// const toastTypes = ["info", "warning", "success", "error"]
// Toasts.js
const state = {
  list: [],
  destroy: (id) => {
    const index = state.list.findIndex((x) => x.id === id)
    state.list.splice(index, 1)
  },
}

const makeToast = ({ id, classList, type, text, timeout }) =>
  state.list.push({ id: uuid(), classList, type, text, timeout })

const addSuccessToast = (text, timeout = threeSeconds) =>
  makeToast({ type: "success", classList: 'w3-border-green w3-text-green', text, timeout })

const addInfoToast = (text, timeout = threeSeconds) =>
  makeToast({ type: "info", classList: 'w3-border-blue w3-text-blue', text, timeout })

const addWarningToast = (text, timeout = threeSeconds) =>
  makeToast({ type: "warning", classList: 'w3-border-orange w3-text-orange', text, timeout })

const addErrorToast = (text, timeout = threeSeconds) =>
  makeToast({ type: "error", classList: 'w3-border-red w3-text-red', text, timeout })

const destroyToast = ({ dom, attrs: { id } }) => {
  dom.classList.add("destroy")
  setTimeout(() => {
    state.destroy(id)
    m.redraw()
  }, 300)
}

const Toast = (vnode) => {
  setTimeout(() => {
    destroyToast(vnode)
  }, vnode.attrs.timeout)

  return {
    view: ({ attrs: { classList, text } }) => {
      return m(
        ".w3-display-right.w3-btn w3-white w3-border w3-round-xlarge",
        {
          class: classList,
          onclick: () => destroyToast(vnode),
        },
        text
      )
    },
  }
}

const Toaster = {
  view: () =>
    state.list.length > 0 &&
    m('.w3-float', { style: { position: 'absolute', top: '50px', right: 0, zIndex: 1000 } }, state.list.map((msg) => m(".w3-display-container.w3-panel", { key: msg.id }, m(".w3-panel", m(Toast, msg)))),)
}

export {
  Toaster,
  addSuccessToast,
  addInfoToast,
  addWarningToast,
  addErrorToast
}
