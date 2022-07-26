import m from "mithril"
const Modal = ({ attrs: { mdl } }) => {
  return {
    view: () =>
      m(
        "dialog.w3-modal#modal",
        {
          open: mdl.state.showModal,
          onclick: (e) => {
            if (e.target.id == "modal") {
              mdl.state.showModal = false
              mdl.state.modalContent = null
            }
          },
          style: { display: mdl.state.showModal ? "block" : "none" },
        },
        mdl.state.showModal && m(
          ".content w3-card", m(".w3-container", mdl.state.modalContent)
        )
      ),
  }
}

export default Modal

