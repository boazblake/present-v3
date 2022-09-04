import m from 'mithril'

const Loader = () => {
  return {
    view: ({
      attrs: {
        mdl: {
          state: {
            isLoading,
            loadingProgress: { value, max },
          },
        },
      },
    }) => {
      // console.log('loading', value, max, isLoading())
      return m('.progressBar', m('progress.progress', { max, value }))
    },
  }
}

export default Loader
