

var move =function(){
    var left = events[Math.floor(Math.random()*events.length)]
    var right = events[Math.floor(Math.random()*events.length)]
    
    console.log('You look to the right. \n' + left.premessage)
    console.log('And on the right. \n' + right.premessage)

    var move = [{
        type: 'list',
        message: "Which way to go?",
        choices: ['Left','Right'],
        name: 'direction'
    }]

    inquirer.prompt(move)
        .then(function(response){
            if (response.direction == 'Left'){
                left.event()
            }
            else if (response.direction == 'Right'){
                right.event()
            }
        })
}

var battleTurn = function(monster){
    var battle = [{
        type: 'list',
        message: "Choose your action",
        choices: ['Attack','Defend','Run','Secret'],
        name: 'battleChoice'
    }]
    inquirer.prompt(battle)
        .then(function(inquirerResponse){
            monster.hp -= 5
            if (monster.hp <= 0){
                console.log("You deal a lethal blow!")
                return move()
            }
            if (player.hp <= 0){
                console.log("You Died.")
                return
            }

            else{
                console.log('The monster strikes you')
                player.hp -= 5
                battleTurn()
            }
        })
}

exports.move = move
exports.battleTurn = battleTurn