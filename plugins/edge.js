export default class EdgeDragPlugin {
  constructor(options = {}) {
    this.options = options
  }

  apply(container) {
    container.addHook('MOVING',({instance,}) => {
      let {w,h,x,y,} = instance
      if (x < 0) x = 0
      if (y < 0) y = 0
      if (w + x > instance.container.width) x = instance.container.width - w
      if (h + y > instance.container.height) y = instance.container.height - h
      instance.x = x
      instance.y = y
    })
  }
}
