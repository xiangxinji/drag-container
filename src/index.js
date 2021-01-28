export { default as DragContainer }from './dragContainer';
export { default as DragChild }from './dragChild';
export { default as EdgeDragPlugin }from "../plugins/edge";
export { default as AdsorbDragPlugin }from "../plugins/adsorb";
export { default as AlignmentDragPlugin }from "../plugins/alignment";
export { default as Hooks }from '../src/hooks'

import DragChild from "./dragChild";
import DragContainer from "./dragContainer";

export const start = (els = [],childOps = {},options = {}) => {
  const elements = Array.prototype.slice.call(typeof els === 'string' && document.querySelectorAll(els) || els)
  const children = elements.map(item => {
    return new DragChild(item,0,0,childOps)
  })
  return new DragContainer(children,options)
}

export const addChild = (container,el,options = {} ) => {
  if (!(container && el))return
  if (!(container instanceof DragContainer))return
  if (typeof el !== 'string' && !(el instanceof HTMLElement))return false
  el = typeof el === 'string' ? document.querySelector(el) : el
  const child = new DragChild(el,options )
  container.addChild(child)
}










