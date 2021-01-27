import HOOKS from './hooks'
import { createDefaultOptions }from './helpers'

export default class DragContainer {
  // 将依赖添加进Drag
  constructor(children = [],options = {}) {
    const defaultOptions = createDefaultOptions(options)
    if (defaultOptions.beforeCreate && typeof defaultOptions.beforeCreate === 'function') defaultOptions.beforeCreate()
    const { width,height,} = defaultOptions
    this.children = children;
    this.width = width ;
    this.height = height
    this.childStartId = 0
    this.options = defaultOptions
    this.middlewares = []
    this.plugins = {}
    // 确保在 container 生产出之后 (可以被添加插件), Hook才被调用
    setTimeout(() => {
      this.callHook(HOOKS.CreateContainer,{ instance: this,options: defaultOptions,})
      this.callHook(HOOKS.InitChildrenBefore)
      this.initChild()
      this.callHook(HOOKS.InitChildrenAfter,{ instance: this,children: this.children,})
    })
  }

  nextChildId() {
    return this.childStartId++
  }

  initChild(child) {
    if (!child) {
      return this.children.forEach(item => {
        item.addDrag()
        item.setContainer(this)
        item.id = this.nextChildId()
      })
    }
    child.addDrag()
    child.id = this.nextChildId()
    child.setContainer(this)
  }

  setContainerSize(width,height) {
    if (!width)return
    if (height === undefined || height === null) {
      height = width
    }
    this.containerSize = {
      height,
      width,
    }
    this.callHook(HOOKS.ChangeContainerSize,{ width,height,})
  }

  addChild(child) {
    if (this.children.includes(child)) {
      console.error('该child已经存在')
    }
    this.initChild(child)
    this.children.push(child)
  }

  removeChild(id) {
    let l = this.children.length
    for (let i = 0; i < l; i++) {
      if (this.children[i].id === id) {
        const temp = this.children[i]
        this.children.splice(i,1)
        return temp
      }
    }
  }

  getChildById(id) {
    const result = null
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].id === id) {
        return this.children[i]
      }
    }
    return result
  }

  addHook(hookName,handler) {
    let success = true
    if (!DragContainer.HOOKS[hookName]) {
      console.error('未包含这个hook')
      success = false
    }else {
      const handlers = DragContainer.HOOKS[hookName]
      if (Array.isArray(handlers)) {
        DragContainer.HOOKS[hookName].push(handler)
      }else if (typeof handlers === 'function') {
        DragContainer.HOOKS[hookName] = [
          handlers,
          handler,
        ]
      }
    }
    this.callHook('ChangeContainerChildren',{
      hookName,
      handler,
      opt: 'add',
      success,
    })

  }

  removeHook(hookName,handler) {
    let success = true
    if (!DragContainer.HOOKS[hookName]) {
      console.error('未包含这个hook')
      success = false
    }else {
      const handlers = DragContainer.HOOKS[hookName]
      if (!Array.isArray(handlers)) {
        console.error('不可删除 base 的 hook ')
        success = false
      }else {
        let i = handlers.indexOf(handler)
        if (i > 0) {
          handlers.splice(i,1)
        }
      }
    }

    this.callHook('ChangeContainerChildren',{
      hookName,
      handler,
      opt: 'remove',
      success,
    })

  }

  callHook(hookName,data) {
    if (typeof hookName === 'function') {
      hookName = hookName.name
    }
    if (!DragContainer.HOOKS[hookName]) {
      console.error('未包含这个hook')
      return
    }
    const handlers = DragContainer.HOOKS[hookName]
    if (Array.isArray(handlers)) {
      handlers.forEach(handler => {
        handler.call(this,data)
      })
    }else if (typeof handlers === 'function') {
      handlers.call(this,data)
    }
  }

  /**
     * 添加 容器范围的 callback
     * @param callback
     * 1. 可以接受有 .filter 方法的对象
     * 2. 可以接受一个 function
     */
  use(middleware) {
    if (typeof middleware === 'function') {
      middleware = {filter: middleware,}
    }
    this.middlewares.push(middleware)
    return this
  }

  callMiddleware() {
    const params = {name: 'string',age: 'number',}
    this._callMiddlewareItem(0,params)
  }

  _callMiddlewareItem(i = 0,params) {
    const callback = this.middlewares[i]
    if (!callback)return
    if (typeof callback.filter !== 'function')return
    const next = (p) => {
      i++
      return this._callMiddlewareItem(i,Object.assign(params,p))
    }
    return callback.filter.apply(callback,[params,next,])
  }

  /**
     * 编写plugin 需要遵守两个规则,
     * 第一个需要有 name 属性, 方便管理
     * 第二个 需要有 apply 方法方便调用
     * @param pluginRunner
     */
  plugin(pluginRunner,pluginOps) {
    if (typeof pluginRunner === 'function' && pluginRunner.name && pluginRunner.apply && typeof pluginRunner.apply === 'function') {
      this.plugins[pluginRunner.name] = pluginRunner
      const itc = new pluginRunner(pluginOps)
      itc.apply(this)
      return
    }
    console.error('请遵守插件编写规范')
  }
}


DragContainer.HOOKS = HOOKS
DragContainer.HOOK_SET = Object.keys(DragContainer.HOOKS).reduce((result,item) => {
  result[item] = item
  return result
},{})

