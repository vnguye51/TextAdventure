var seed = require('seed-random')
seed('foo', {global: true});//over-ride global Math.random
var numA = Math.random();
seed('foo', {global: true});
var numB = Math.random();
console.log(numA == numB);//always true

console.log(Math.random())
console.log(Math.random())
console.log(Math.random())