var mapArray = 
[['t','l3','','','l4','l5'],
['l3','','l2,t','','$','l4'],
['','','','','',''],
['l1','$','','l2,t','','$','l3'],
['!','l1','','','l3','t']]

var myMap = {}

for(var j = 0; j < mapArray[0].length; j++){
    for(var i = 0; i < mapArray.length; i++){
        console.log(i,j)
        myMap[[i,j]] = mapArray[i][j]
    }
}

exports.xbounds = [0,mapArray.length] 
exports.ybounds = [0,mapArray[0].length]
exports.map = myMap
