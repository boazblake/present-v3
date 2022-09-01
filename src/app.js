import m from 'mithril'
import Layout from './layout.js'
import { Presentations, Slides, Auth } from './views/index.js'

const App = mdl => ({
  "/login": { render: () => m(Layout, { mdl }, m(Auth, { mdl })) },
  "/presentations": { render: () => m(Layout, { mdl }, m(Presentations, { mdl })) },
  "/presentation/:title": { render: () => m(Layout, { mdl }, m(Slides, { mdl })) },
})


export default App
