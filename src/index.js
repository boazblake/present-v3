import m from "mithril"
import "./styles/app.css"
// import "./styles/app.scss"
import "./styles/w3-styles.css"
import '@toast-ui/editor/dist/toastui-editor.css'; // Editor's Style

import App from "./app.js"
import model from "./model.js"

const root = document.body
let winW = window.innerWidth

// if (process.env.NODE_ENV !== "production") {
//   console.log("Looks like we are in development mode!")
// } else {
//   if ("serviceWorker" in navigator) {
//     window.addEventListener("load", () => {
//       navigator.serviceWorker
//         .register("./service-worker.js")
//         .then((registration) => {
//           console.log("⚙️ SW registered: ", registration)
//         })
//         .catch((registrationError) => {
//           console.log("🧟 SW registration failed: ", registrationError)
//         })
//     })
//   }
// }

// set display profiles
const getProfile = (w) => {
  if (w <= 411) return "phone"
  if (w <= 990) return "tablet"
  return "desktop"
}

const checkWidth = (winW) => {
  const w = window.innerWidth
  if (winW !== w) {
    winW = w
    var lastProfile = model.settings.profile
    model.settings.profile = getProfile(w)
    if (lastProfile != model.settings.profile) m.redraw()
  }
  return requestAnimationFrame(checkWidth)
}

model.settings.profile = getProfile(winW)

checkWidth(winW)
m.route(root, '/auth', App(model))

