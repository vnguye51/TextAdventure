var pos = [0,0]
var 
function(moveUp)

var n = 1
var monsterHealth = 20
var playerHealth = 50
var secretTechnique
var start = [
    {
        type: "input",
        message: "What is your name?",
        name: "username"
    },
    {
        type: "checkbox",
        message: "Choose your weapon",
        name: "confirm",
        choices: ['Sword','Gun','Bow','Magic']
    },
    {
        type: "list",
        message: "What is your dream?",
        choices: ["Money.", "To defeat the demon king", "To become famous", "To become the strongest"],
        name: "dream"
    },
    {
        type: "password",
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
var battle = [{
    type: 'list',
    message: "Choose your action",
    choices: ['Attack','Defend','Run','Secret'],
    name: 'battleChoice'
}]

function battleTurn(){
    inquirer.prompt(battle)
        .then(function(inquirerResponse){
            if (inquirerResponse.battleChoice == 'Secret'){
                console.log(secretTechnique+'!!!')
                monsterHealth -= 40
                console.log("You deal 40 damage")

            }
            else{
                monsterHealth -= 5
                console.log('You deal 5 damage')
            }
            if (playerHealth <= 0){
                console.log('You lose!')
                return
            }
            if (monsterHealth <= 0){
                console.log('You Win!')
                console.log('You gain 20 exp')
                monsterHealth = 40
                return nextBattle()
            }
            else{
                playerHealth -= 5
                console.log("You take 5 damage back")
                console.log("Player HP: " + playerHealth)
                console.log("Monster HP: " + monsterHealth)
                battleTurn()
            }
        })
}

function nextBattle(){
    console.log("You face off against your " + n + "st enemy")
      n += 1
      return battleTurn()
}

var inquirer = require("inquirer");

inquirer.prompt(start)
    .then(function(inquirerResponse) {
    if (inquirerResponse.confirm) {
        secretTechnique = inquirerResponse.secret
        nextBattle()
    }
    else {
      console.log("\nThat's okay " + inquirerResponse.username + ", come again when you are more sure.\n");
    }
  });


  