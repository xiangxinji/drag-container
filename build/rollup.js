
const { rollup,} = require( "rollup")
const { terser,} = require('rollup-plugin-terser');
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')

const banner = `
/*
 *****************************************************************
 *                                                               *
 *      author:xiangxinji                                        *
 *      github : https://github.com/xiangxinji/drag-container    *
 *                                                               *       
 *****************************************************************
 */
`
 function build (inputOptions,outputOptions) {
  rollup(inputOptions).then(( bundle ) => {
    bundle.generate(outputOptions).then(async ({ code,map,}) => {
      await bundle.write(outputOptions);
    });
  });
}

const inputOptions = {
  input : './src/index.js',
}
const commonOutputOptions = {
  name : 'DragContainer' ,
  sourcemap: true ,
  format : 'umd',
  banner
}


build({
    ...inputOptions ,
    plugins : [
        resolve(),
        babel()
    ],
} , {
  ...commonOutputOptions,
  file : './dist/drag-container.js'
})

build({
  ...inputOptions ,
  plugins : [
      resolve(),
      terser(),
      babel()
  ]
} , {
  ...commonOutputOptions ,
  file : './dist/drag-container.min.js',
  sourcemap : false
})


