var mapArray = 
[['t','l3','','','l4','l5'],
['l3','','l2,t','','$','l4'],
['','','','','',''],
['l1','$','','l2,t','','$','l3'],
['!','l1','','','l3','t']]

var map = {}

for(var i = 0;mapArray[0].length; i++){
    for(var j = 0; mapArray.length; j++){
        map[i,j] = mapArray[i][j]
    }
}

console.log(map)