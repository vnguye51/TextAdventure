var player = require('./start.js').player
var inquirer = require("inquirer");



var clearing = {
    premessage: 'You look around. Nothing seems out of the ordinary.',
}

var unique = {
    premessage: 'Thick trees obscure your view on this path',
    uniquePool: [beggar,shrine]
}

var monster = {
    premessage: 'You see a monster in the distance',
    hp: 70,
    attack: 5,
    level: 1,

    event: function(){
        console.log('You charge the monster')
        actions.battleTurn(this)
    }
}

var shop = {
    premessage: "You come across a traveling merchant"
}

var beggar = {
    message: "You meet a beggar"
}

var shrine = {
    prompt:  [{
        type: 'list',
        message: `You come across a shrine of the Goddess. \n
                 A fountain is filled with clear spring water. \n
                 In the fountain you see some coins left as an offering. \n
                 `,
        choices: ['Pray', 'Steal', 'Desecrate'],
        name: 'choice'
    }],
    event: function(){
        inquirer.prompt(this.prompt)
            .then(function(){
                if (choice == 'Pray'){
                    console.log("You send a prayer up to the goddess and take a drink from the shrine \n You feel rejuvenated and are filled with determination")
                }
                else if (choice == 'Steal'){
                    console.log('filler')
                }
                else if (choice == 'Desecrate'){
                    console.log('filler')
                }
            })
            actions.move()
    }
}

var events = [monster]



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
        choices: ['Attack','Defend', 'Item'],
        name: 'battleChoice'
    }]
    inquirer.prompt(battle)
        .then(function(response){
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

