import m from "mithril"
const Modal = ({ attrs: { mdl } }) => {
  return {
    view: () =>
      m(
        ".w3-modal#modal",
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
          ".w3-modal-content.w3-animate-top", mdl.state.modalContent)

      ),
  }
}

export default Modal

