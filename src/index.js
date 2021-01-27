import DragContainer from './dragContainer'
import DragChild from './dragChild'
import EdgeDragPlugin from "../plugins/edge";
import AdsorbDragPlugin from "../plugins/adsorb";
import AlignmentDragPlugin from "../plugins/alignment";
import Hooks from '../src/hooks'


const start = (els = [],childOps = {},options = {}) => {
  const elements = Array.prototype.slice.call(typeof els === 'string' && document.querySelectorAll(els) || els)
  const children = elements.map(item => {
    return new DragChild(item,0,0,childOps)
  })
  return new DragContainer(children,options)
}

const addChild = (container,el,options = {} ) => {
  if (!(container && el))return
  if (!(container instanceof DragContainer))return
  if (typeof el !== 'string' && !(el instanceof HTMLElement))return false
  el = typeof el === 'string' ? document.querySelector(el) : el
  const child = new DragChild(el,options )
  container.addChild(child)
}


export default {
  start,
  addChild,
  DragContainer,
  DragChild,
  EdgeDragPlugin,
  AdsorbDragPlugin,
  AlignmentDragPlugin,
  Hooks,
}









