// 容器元素
export default class DragChild {
  constructor(el,x = 0,y = 0,options = {} ) {
    this.el = el
    this.x = x
    this.y = y
    this.w = 0
    this.h = 0
    this.options = {...options,}
    this.container = null
    this.id = null
    this.initState();
  }

  initState() {
    const el = this.el
    const style = window.getComputedStyle(el)
    this.w = parseInt(style.width.split('px')[0])
    this.h = parseInt(style.height.split('px')[0])
  }

  addDrag() {
    let x = 0
    let y = 0
    let l = 0
    let t = 0
    let isDown = false
    const mouseupHandler = () => {
      isDown = false
      window.removeEventListener('mouseup',mouseupHandler)
      this.container.callHook('MouseUp',{ target: this.el,instance: this,isDown,})
    }
    this.el.addEventListener('mousedown',(e) => {
      e.preventDefault()
      const event = e
      x = event.clientX
      y = event.clientY
      l = this.el.offsetLeft
      t = this.el.offsetTop
      isDown = true
      window.addEventListener('mouseup',mouseupHandler)
    })
    window.addEventListener('mousemove',(e) => {
      if (!isDown)return
      const event = e
      const nx = event.clientX
      const ny = event.clientY
      this.x = nx - (x - l)
      this.y = ny - (y - t)
      this.moving()
    })

  }

  resize() {
    this.initState()
  }

  moving() {
    this.container.callHook('Moving',{instance: this,target: this.el,})
  }

  setContainer(container) {
    if (container) {
      this.container = container
      this.container.callHook('ConnectContainer',{ instance: this,})
    }
  }
}
