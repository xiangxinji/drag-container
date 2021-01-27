const createDefaultOptions = (options) => ({
  adsDistance: 20,
  ...options,
})
export default class AdsorbDragPlugin {
  constructor( options ) {
    this.options = createDefaultOptions(options)
  }
  // left , top
  calculatedAdsorptionLT ( children,data ) {
    for (let i = 0; i < children.length ; i ++) {
      const child = children[i]
      if (child.y + child.h > data.ny && child.y + child.h < data.y) {
        data.current.y = child.y + child.h
      }
      if (child.x + child.w > data.nx && child.x + child.w < data.x) {
        data.current.x = child.x + child.w
      }
    }
  }
  // right , bottom
  calculatedAdsorptionRB (children,data ){
    for (let i = 0; i < children.length ; i ++) {
      const child = children[i]
      if (child.y < data.ny && child.y > data.ny - data.adsDistance) {
        data.current.y = child.y - data.h
      }
      if (child.x < data.nx && child.x > data.nx - data.adsDistance) {
        data.current.x = child.x - data.w
      }
    }
  }

  apply ( container ) {
    // 在连接容器时 , 往实例中添加 adsDistance 属性
    container.addHook('ConnectContainer',({ instance,}) => {
      instance.adsDistance = this.options.adsDistance
    })
    container.addHook('MouseUp',({ instance,target,}) => {
      const { children,} = container
      const { x,y,adsDistance,w,h,} = instance
      let t = { ny: y - adsDistance,y,current: instance,x,nx: x - adsDistance,}
      this.calculatedAdsorptionLT(children,t)
      t = { ny: y + h + adsDistance,y,current: instance,x,nx: x + adsDistance + w,w,adsDistance,h: h,}
      this.calculatedAdsorptionRB(children,t)
      instance.moving()
    })
  }
}
