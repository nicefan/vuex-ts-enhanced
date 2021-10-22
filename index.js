import { inject } from 'vue'

function SET_STATE(state, payload) {
  Object.keys(state).forEach((key) => {
    state[key] = payload[key]
  })
}

function register(config, rootKey) {
  const name = config.name
  const root = inject(rootKey || 'store')
  const namespace = (typeof name === 'string' ? name : name.join('/')) + '/'
  let map = root._modulesNamespaceMap
  if (!map[namespace]) {
    root.registerModule(name, config)
  }
  const context = map[namespace].context
  return Object.assign(context, {
    setState(payload) {
      context.commit('SET_STATE', payload)
    },
  })
}

export function defineModule(root, config) {
  config.namespaced = true
  config.mutations = Object.assign({ SET_STATE }, config.mutations)
  return config
  // return {
  //   option: config,
  //   registerModule(rootKey) {
  //     register(config.name, config, rootKey)
  //   },
  //   useModule(rootKey) {
  //     return useModule(config.name, rootKey)
  //   }
  // }
}

export function useModule(config, rootKey) {
  let context
  return function () {
    context = context || register(config, rootKey)
    return context
  }
}

export function defineStore(config) {
  return {
    option: config,
    addModules: function (modules) {
      config.modules = Object.assign({}, config.modules, modules)
      return config
    }    
  }
}



