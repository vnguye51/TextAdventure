//Initialize items
var events = require('./events.js')
var inquirer = require("inquirer");

var player = {}





function start(){
    var start = [
        {
            type: "input",
            message: "What is your name?",
            name: "username"
        },
        {
            type: "checkbox",
            message: "Choose your boon",
            name: "weapon",
            choices: ['Sword','Gun','Bow']
        },
        {
            type: "list",
            message: "What is your dream?",
            choices: ["Money", "To defeat the demon king", "To become famous", "To become the strongest"],
            name: "dream"
        },
        {
            type: "input",
            message: "What is your secret ability?",
            name: 'secret'
        },
        {
          type: "confirm",
          message: "Are you sure:",
          name: "confirm",
          default: true
        },
    
      ]
    inquirer.prompt(start)
    .then(function(response) {
        if (response.confirm) {
            //initialize player values based on inputs
            player.secret = secret
            player.weapon = 'dagger'
            player.name = response.name
            player.dream = response.dream
            player.attack = 8
            player.hp = 36
            player.level = 1
            player.pos = 0
            console.log(`A warm light engulfs your body. \n 
                         When you come to you find yourself in a clearing of a forest. \n
                         `)
            move()
        }
        else {
            //start the prompt over
            inquirer.prompt(start)
        }
      });
}

function move(){
    var move = [{
        type: 'list',
        message: "Which way to go?",
        choices: ['Left','Right'],
        name: 'direction'
    }]

    inquirer.prompt(move)
        .then(function(response){
            if (response.name == 'Left'){
                moveNorth()
            }
            else if (response.name == 'Right'){
                moveSouth()
            }
            else if (response.name == 'West'){
                moveWest()
            }
            else if (response.name == 'East'){
                moveEast()
            }
        })
}

function battleTurn(){
    var battle = [{
        type: 'list',
        message: "Choose your action",
        choices: ['Attack','Defend','Run','Secret'],
        name: 'battleChoice'
    }]
    inquirer.prompt(battle)
        .then(function(inquirerResponse){
            if (inquirerResponse.battleChoice == 'Secret'){
                monsterHealth -= 40

            }
            else{
                monsterHealth -= 5
            }
            if (player.hp <= 0){
                return
            }
            if (monster.hp <= 0){
                return nextBattle()
            }
            else{
                playerHealth -= 5
                battleTurn()
            }
        })
}

function nextBattle(){
    console.log("You face off against your " + n + "st enemy")
      n += 1
      return battleTurn()
}





  