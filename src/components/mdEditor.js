import m from 'mithril'
import { threeSeconds, fiveSeconds } from '../helpers.ts'
import { addErrorToast, addSuccessToast, } from '../components/toaster.js'
import { equals, isEmpty } from 'ramda'
import { loadSlidesByProjectId as reload } from '../model.js'
import Editor from '@toast-ui/editor'

let timer = 0

const updateSlideTask = (mdl, slide) => mdl.http.putTask(mdl, `update-slide-details/${mdl.presentation.id}`, slide)

const updateSlide = (mdl, slide, state) => {
  timer = setTimeout(() => { console.log('able to save now'); updateContents(mdl, slide, state); clearTimeout(timer); timer = null }, fiveSeconds)

  const onError = (e) => {
    log('error')(e);
    addErrorToast('Error saving')
  }

  const onSuccess = () => {
    addSuccessToast('Slide Saved.')
    reload(mdl, mdl.presentation.id)
    state.dirty = false
  }
  console.log('saving...', slide)
  updateSlideTask(mdl, slide).fork(onError, onSuccess)
}

const updateContents = (mdl, slide, state) => {
  slide.contents = mdl.editor.getMarkdown()
  timer ? console.log('waiting...') : updateSlide(mdl, slide, state)
}

const watcher = (mdl, state) =>
  state.watcher = setInterval(() => state.dirty && updateContents(mdl, mdl.slide, state), fiveSeconds)

const getBase64 = file => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => res(reader.result))
    reader.readAsDataURL(file)
  })
}


const resizeBase64Img = (base64, newWidth, newHeight) => {
  return new Promise((res, rej) => {
    const canvas = document.createElement("canvas");
    // canvas.style.width = newWidth.toString() + "%";
    // canvas.style.height = newHeight.toString() + "%";
    const context = canvas.getContext("2d");
    const img = document.createElement("img");
    img.src = base64;
    img.onload = function () {
      canvas.width = img.width / 3;
      canvas.height = img.height / 3;
      // context.drawImage(img, 0, 0);
      // canvas.toBlob(
      //   (blob) => {
      //     if (blob === null) {
      //       return rej(blob);
      //     } else {
      //       res(canvas.toDataUrl(blob));
      //     }
      //   },
      //   "image/jpeg",
      //   1 / 2
      // );
      context.scale(.3, .3)
      // context.scale(newWidth / img.width, newHeight / img.height);
      context.drawImage(img, 0, 0);
      console.log(canvas.style)
      return res(canvas.toDataURL());
    }

  })
}


const newEditor = (mdl, state, dom) => {
  mdl.editor = new Editor({
    autofocus: true,
    viewer: true,
    height: `${window.innerHeight - state.sliderHeight() - 122}px`,
    el: dom,
    initialValue: mdl.slide.contents,
    initialHTML: mdl.slide.contents,
    placeholder: 'Add some text',
    hooks: {
      addImageBlobHook:
        (x, cb) => {
          console.log('x', cb);
          getBase64(x).then(b64 => resizeBase64Img(b64, 50, 50)).then(cb)
        }
    },
    events: {
      change: () => equals(mdl.slide.contents.length, mdl.editor.getMarkdown().length)
        ? state.dirty = false
        : state.dirty = true

    }
  })
}

const mdEditor = ({ attrs: { mdl, state } }) => {
  watcher(mdl, state)
  // console.log(mdl, state)
  return {
    // onremove: () => { },
    oncreate: ({ dom, attrs: { mdl, state } }) => newEditor(mdl, state, dom),
    onupdate: ({ dom, attrs: { mdl, state } }) => {
      if (mdl.slide.filename !== state.slideId) {
        state.slideId = mdl.slide.filename
        mdl.editor.destroy()
        newEditor(mdl, state, dom)
      }
    },
    view: () =>
      m('.w3-section#editor', { style: { height: `${window.innerHeight - state.sliderHeight() - 130}px` } })
  }
}

export default mdEditor
