//Initialize items
var inquirer = require("inquirer");

var player = {}



// start()


function start(){
    var start = [
        {
            type: "input",
            message: "What is your name?",
            name: "username"
        },
        {
            type: "list",
            message: "Choose your boon",
            name: "boon",
            choices: ['A stronger weapon', 'A pendant', 'Money']
        },
        {
            type: "list",
            message: "What is your dream?",
            choices: ["Money", "To defeat the demon king", "To become famous", "To become the strongest"],
            name: "dream"
        },
        {
          type: "list",
          message: "Are you sure:",
          choices: ['Yes', 'No'],
          name: "confirm",
        },
    
      ]
    inquirer.prompt(start)
    .then(function(response) {
        if (response.confirm == 'Yes') {
            //initialize player values based on inputs
            player.weapon = 'dagger'
            player.boon = response.boon
            player.name = response.name
            player.dream = response.dream
            player.attack = 8
            player.hp = 36
            player.level = 1
            player.pos = 0
            if (player.boon=='A stronger weapon'){
                player.weapon = 'sword'
            }
            console.log(`A warm light engulfs your body.
            When you come to, you find yourself in a clearing of a forest.`)
            exports.player = player
            move()
        }
        else {
            //start the prompt over
            inquirer.prompt(start)
        }
      });
}






//////////////EVENTS///////////////


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
        battleTurn(this)
    }
}

var shop = {
    premessage: "You come across a traveling merchant"
}

var beggar = {
    message: "You meet a beggar"
}

var shrine = {
    premessage: "You see an altar in the distance",
    prompt:  [{
        type: 'list',
        message: 'You come across a shrine of the Goddess. \nA fountain is filled with clear spring water. \nIn the fountain you see some coins left as an offering.',
        choices: ['Pray', 'Steal', 'Desecrate'],
        name: 'choice'
    }],
    event: function(){
        inquirer.prompt(this.prompt)
            .then(function(response){
                if (response.choice == 'Pray'){
                    console.log("You send a prayer up to the goddess and take a drink from the shrine. \nYou feel rejuvenated and are filled with determination")
                }
                else if (response.choice == 'Steal'){
                    console.log('filler')
                }
                else if (response.choice == 'Desecrate'){
                    console.log('filler')
                }
                return move()

            })
    }
}

var events = [monster,shrine]

//ACTIONS/////////

var move =function(){
    player.pos += 1
    if (player.pos == 10){
        console.log("You made it!")
        return
    }
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
            monster.hp -= 20
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
                console.log('Player HP: ' + player.hp )
                console.log('Enemy HP: ' + monster.hp)
                battleTurn(monster)
            }
        })
}

function queueMessage(messages){
    if(messages.length > 0){
        setTimeout(function(){
            var action = messages[0]
            action()
            messages.shift()
            queueMessage(messages)
        },500)
    }
}

