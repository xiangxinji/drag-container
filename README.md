# drag-container
拖拽容器

说明 : 该库负责绑定一个容器, 该容器下的所有元素或者是可选的元素,将会被允许自由拖拽

用户可以通过 import 或者 &lt;script&gt; 或者是 commonjs 的方式进行引用 , 如果生产环境需要压缩版本 , 请使用 min.js 


## 使用  
安装
```bash
npm i drag-container-helper
# or 
yarn add drag-container-helper
```

在安装之后需要自己处理要是, 这个库只负责将容器内的 element元素绑定拖拽事件, 不参与样式 所以需要自己编写样式

如下 
```html
<!doctype html>
<html lang="en">
<head>
    <title>Document</title>
    <style>
        /* 让容器元素相对,并且设置宽高 , 并且设置子元素的绝对定位,并设置宽高 */
        #container{width : 375px ; height:600px; position :relative;}
        #container .inner-box-item{position :absolute; width:90px; height:90px ;}
    </style>
</head>
<body>
    <div id="container">
        <!--   可拖拽的元素      -->
        <div class="inner-box-item"></div>
        <div class="inner-box-item"></div>
        <div class="inner-box-item"></div>
    </div>
</body>
</html>
```

injs 
```javascript
const container = DragContainer.start(document.getElementsByClassName('block-test'),{} , {
    width :375 ,
    height:600
}) 
// container.plugin(DragContainer.EdgeDragPlugin)
// container.plugin(DragContainer.AdsorbDragPlugin)
container.addHook('Moving' , ({ target , instance }) => {
    const { x , y } = instance
    target.style.left = x + 'px'
    target.style.top = y + 'px'
})
```


以上被注释的两行是属于自带的plugin
1. Edge 不允许拖拽的元素超过 container 大小
2. Adsorb 拖拽的元素会被吸附到其他元素上面去 
3. Alignment 进行自动上下对齐, 可以在 DragChild 的options 中 ignoreAlignment = true , 则表示这个元素不需要对齐

## api
DragContainer.start 一个快速开始的方法 
参数列表如下 

参数1 : 需要进行拖拽的 element 元素集合 , 可以是数组,也可以使类数组, 会进行转换 

参数2 : 批量处理的 DragChild 的 options

参数2 : 传递给 container 的 options , 可以在其中配置 container 的 width , height 

DragContainer.DragContainer  一个代表容器的类 , 负责处理容器部分 
代表方法有 
1. addChild 手动添加一个 DragChild 实例 
2. getChildById 根据 id 获取这一个 DragChild 
3. removeChild 根据 id  从 container 容器中进行删除 
4. setContainerSize 重新设置容器大小 , 如果你的容器在调整大小, 请调用这个方法 
5. callHook 手动触发 Hook 钩子函数 
6. use 添加中间件 
7. plugin  手动添加一个插件

DragChild 一个代表被拖拽元素的类 
代表方法有 
1. moving 在移动中会进行触发这个方法
2. resize 当元素的大小被改变, 请手动调用这个方法进行校正
3. setContainer 如果当前的这个child实例并没有绑定 container , 请进行手动绑定 (如果是在container 中 addChild 了, 那么这个关系是自动绑定上去了)

## 关于插件 
本库中自带两个插件 , 一个的 Edge 边缘 , 一个是自动吸附 

如果编写一个自定义插件, 请遵循以下规则 
1. 他只能跟容器绑定关系 
2. 他是一个类, 并且需要拥有 name 属性和 apply 方法  
3. 他需要手动被 container.plugin 进行注册 , 注册之后会自动调用 apply , 你可以在那里面进行 addHook 订阅不同的钩子函数

apply 方法的 api  

首先 你可以在该插件中调用this, 这个并没有改变这个apply方法的执行上下文 ,并且会在第一个参数中传递给你 container 

在构造方法中会传递给你用户传递的options , 你可以自由的进行配置 并且对于apply 参数你可以直接获取到 container  
```javascript
class CustomerDragPlugin {
    constructor (options) {
        this.options = options 
    }
    apply( container ) {
        // .... 
    }
}
container.plugin(CustomerDragPlugin , {
    // 这个options  会传递给 CustomerDragPlugin 的构造方法中 
})
```

## Hooks 
钩子函数

在这个库中你可以使用 DragContainer.HOOKS 去获取所有的Hook , 如果你只想要所有的Hook 的名称的话, 可以使用 DragContainer.HOOK_SET 
获取所有的Hook 

如何添加一个钩子函数 , 以 Moving 为例 

在这个 Hook 回调中 , Container 会传递给当前正在移动的 DragChild 实例 , 以及 target 和 x , y 
你可以自由的获取到这些数据,并且同步到 dom 上面   , 如下 

```javascript
const container = new DragContainer() //. .
container.addHook('Moving' , ({ instance, target , x , y }) => {
    target.style.left = x + 'px'
    target.style.top = y + 'px'
})
```


## 实例
[具体实例](./examples/index.html)













