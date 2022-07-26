import m from 'mithril'
import Layout from './layout.js'
import { Presentations, Slides } from './views/index.js'

const App = mdl => ({
  "/": { render: () => m(Layout, { mdl }, m(Presentations, { mdl })) },
  "/presentation/:title": { render: () => m(Layout, { mdl }, m(Slides, { mdl })) },
})


export default App
