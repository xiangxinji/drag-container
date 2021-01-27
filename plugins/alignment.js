

export default class AlignmentDragPlugin {
  constructor(alignment = { alignDistance: 10,}) {
    this.alignDistance = alignment.alignDistance || 10
  }

  computedAlignment (container,instance ) {
    const { children,} = container
    const { x,y,w,h,} = instance
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      let changeCount = 0
      if (y >= child.y - this.alignDistance && y <= child.y + this.alignDistance) {
        instance.y = child.y
        changeCount ++
      }
      if ((y + h) >= (child.y + child.h - this.alignDistance) && (y + h) <= (child.y + child.h + this.alignDistance)) {
        instance.y = child.y + (child.h - h)
        changeCount ++
      }
      if (changeCount > 0) instance.moving()
    }
  }

  apply ( container ) {
    container.addHook('MouseUp',({ instance,}) => {
      if (instance.options.ignoreAlignment)return
      this.computedAlignment(container,instance)
    })
  }
}
