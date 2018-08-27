//Initialize items
var inquirer = require("inquirer");
var seed = require('seed-random')


//Initialize player stats
var player = {
    weapon : 1,
    attack : 8,
    defend : false,
    hp : 36,
    pos : 0,
    gold : 100,
    items: ['Health Potion'],
    relics: [],

}


var pausedPrompt
var pausedCallback

function queuePrompt(prompt,callbackFunction){
    setTimeout(function(){
        inquirer.prompt(prompt)
            .then(function(response){
                callbackFunction(response)
            })
    },500)
}

function queueMessage(messages){
    if(messages.length > 0){
        if(typeof messages[0] == 'function'){
            setTimeout(function(){
                messages[0]()
                messages.shift()
            },500)
            return
        }
        setTimeout(function(){
            console.log(messages[0])
            messages.shift()
            queueMessage(messages)
        },500)
    }
}


function start(){
    var name = [
        {
            type: "input",
            message: "What is your name?",
            name: "username"
        }]
    var boon = [
        {
            type: "list",
            message: "Choose your boon",
            name: "boon",
            choices: ['A stronger weapon', 'A pendant', 'Money']
        }]
    var dream = [
        {
            type: "list",
            message: "What is your dream?",
            choices: ["Money", "To defeat the demon king", "To become famous", "To become the strongest"],
            name: "dream"
        }]
    var confirm = [
        {
          type: "list",
          message: "Are you sure:",
          choices: ['Yes', 'No'],
          name: "confirm",
        }]
    
    queuePrompt(name,function(response){
        player.name = response.username
        queuePrompt(boon,function(response){
            player.boon = response.boon
            queuePrompt(dream,function(response){
                player.dream = response.dream
                queuePrompt(confirm,function(response){
                    if(response.confirm == 'Yes'){
                        return queueMessage(["A warm light engulfs your body.", "You find yourself in a clearing, surrounded on all sides by forest. + \n",move])
                    }
                    start()
                })
            })
        })
    })
}


// start()



//ACTIONS/////////

function move(){
    player.pos += 1
    var messages = [player.pos + ' miles traveled.']
    if(player.pos == 5){
        messages.push('A quarter of the way there')
    }
    if(player.pos == 10){
        messages.push('Halfway there.')
    }
    if(player.pos == 15){
        messages.push('Not much further.')
    }
    if(player.pos == 19){
        messages.push('A great fortress looms before you.')
    }
    if (player.pos == 24){
        messages.push("This is it.")
    }
    if (player.pos == 25){
        queueMessage('You win!')
        return
    }

    var move1 = [{
        type: 'list',
        message: 'Are you ready?',
        choices: ['Yes'],
        name: 'direction'
    }]
    var move2 = [{
        type: 'list',
        message: "Which way to go?",
        choices: ['Left','Right'],
        name: 'direction'
    }]

    var move3 = [{
        type: 'list',
        message: 'Which way to go?',
        choices: ['Left', 'Straight', 'Right'],
        name: 'direction'
    }]

    var numberOfPaths = Math.floor(Math.random()*3)+1

    if(numberOfPaths == 1){
        var path = events[Math.floor(Math.random()*events.length)]
        messages.push('There is only one path.',
            path.premessage + '\n',
            function(){queuePrompt(move1,function(response){
                path.event()
            })}
        )
    }

    else if (numberOfPaths == 2){
        var left = events[Math.floor(Math.random()*events.length)]
        var right = events[Math.floor(Math.random()*events.length)]
    
        messages.push('You look to the left.',
            left.premessage + '\n',
            'And on the right.',
            right.premessage + '\n',
            function(){queuePrompt(move2,function(response){
                if(response.direction == 'Left'){
                    return left.event()
                }
                right.event()
            })}
        )
        
    }

    else if (numberOfPaths == 3){
        var left = events[Math.floor(Math.random()*events.length)]
        var right = events[Math.floor(Math.random()*events.length)]
        var center = events[Math.floor(Math.random()*events.length)]

        messages.push('You look to the left.', left.premessage + '\n',
            'You look to the right.',
            right.premessage + '\n',
            'You look down the path ahead of you.',
            center.premessage + '\n',
            function(){queuePrompt(move3,function(response){
                if(response.direction == 'Left'){
                    return left.event()
                }
                else if (response.direcion == 'Right'){
                    return right.event()
                }
                return center.event()

            })}
        )
    }
    queueMessage(messages)
}

var battleTurn = function(monster){
    var prompt = [{
        type: 'list',
        message: "Choose your action",
        choices: ['Attack','Defend', 'Item'],
        name: 'choice'
    }]
    function callback(response){
        var messages = []
        if (player.hp <= 0){
            messages = messages.concat(["You Died."])
        }
        else if (response.choice == 'Item'){
            messages = messages.concat([inventory])
        }
        else if (monster.hp <= 0 && response.choice == 'Attack'){
            monster.hp -= player.attack
            messages = messages.concat(["You deal a lethal blow!",move])
        }
        else{
            monster.hp -= player.attack
            if (monster.hp <= 0 && response.choice == 'Attack'){
                monster.hp -= player.attack
                messages = messages.concat(["You deal a lethal blow!",move])
            }
            messages = messages.concat(['You slash the monster for ' + player.attack + ' damage.',function(){monster.ai()}])
            
        }
        queueMessage(messages)
    }
    pausedPrompt = prompt
    pausedCallback = callback
    queueMessage(['Player HP: ' + player.hp, monster.name + ': ' + monster.hp, monster.warning, function(){queuePrompt(prompt,callback)}])
}

function inventory(){
    var prompt = [{
        type: 'list',
        message: 'You look through your rucksack \n' + player.gold + ' gold \n',
        choices: player.items.concat('Cancel'),
        name: 'itemChoice'
    }]

    queuePrompt(prompt,function(response){
        if(response.itemChoice == 'Cancel'){
            return queuePrompt(pausedPrompt,pausedCallback)
        }
        delete player.items[response.itemChoice]
        console.log(player.items)
        console.log(response.itemChoice)
        return queueMessage([potionList[response.itemChoice].effect])
    })
}

/////////ITEMS///////////

function Potion(cost,effect){
    this.cost = cost
    this.effect = effect
}

var hpPot = new Potion(50,function(){
    var prompt = [{
        type: 'list',
        message: 'Heals for 20 hp',
        choices: ['Use','Cancel'],
        name:'use'
    }]

    var callback = function(){
        queueMessage([inventory])
    }

    queuePrompt(prompt,callback)
})

var defPot = new Potion(50,function(){
    var prompt = [{
        type: 'list',
        message: 'Heals for 20 hp',
        choices: ['Use','Cancel'],
        name:'use'
    }]
})

var strPot = new Potion(50,function(){
    var prompt = [{
        type: 'list',
        message: 'Heals for 20 hp',
        choices: ['Use','Cancel'],
        name:'use'
    }]
})

var firePot = new Potion(50,function(){
    var prompt = [{
        type: 'list',
        message: 'Heals for 20 hp',
        choices: ['Use','Cancel'],
        name:'use'
    }]
})



potionList = {
    'Health Potion' : hpPot,
    'Strength Potion' : strPot,
    'Defense Potion' : defPot,
    'Flame Potion' : firePot,
}


////Relic List/////////
function Relic(cost,effects){
    this.effects = effects
    this.cost = cost
}
var relic0 = new Relic(150,function(){
})
var relic1 = new Relic(150,function(){

})
var relic2 = new Relic(150,function(){
    
})
var relic3 = new Relic(150,function(){
    
})
var relic4 = new Relic(150,function(){
    
})

var relicList ={
    'Relic0' : relic0,
    'Relic1' : relic1,
    'Relic2' : relic2,
    'Relic3' : relic3,
    'Relic4' : relic4,
}

var relicPool={
    'Relic0' : relic0,
    'Relic1' : relic1,
    'Relic2' : relic2,
    'Relic3' : relic3,
    'Relic4' : relic4,
}
////////////Enemy List////////////////
tier1Enemies = {
    goblin: function(){
        this.hp = 30
        this.name = 'goblin'
        this.attack= 5,
        this.warning = this.name + ' is about to attack for 5 damage.'
        this.attack1= function(){
            _this = this
            player.hp -= this.attack
            queueMessage(['Goblin attacks for 5 damage',function(){battleTurn(_this)}])
            
        }
        this.ai = function(){
            this.attack1()
        }
    }
}

// boss1 = {
//     hp: 100,
//     attack: 10,
//     pattern = [attack1,attack2,attack3],
//     attack1 = function(){
//         player.hp -= attack
//     },
//     attack
// }


//////////////EVENTS///////////////


var campfire = {
    premessage: 'There is a clearing up ahead. You will be able to safely rest there.',
    event: function(){
        var prompt = [{
            type: 'list',
            message: 'You enter the clearing .You set up a campfire.',
            choices: [{name: 'Rest (+20hp)',value: 'Rest'}, {name: 'Forge (+2ATT)', value: 'Forge'}],
            name: 'choice'
        }]
        function callback(response){
            if(response.choice == "Rest"){
                player.hp += 20
                queueMessage(['You sleep soundly and wake feeling rejuvenated', 'HP: ' + player.hp + '\n', move])
                return
            }
            if(response.choice == 'Forge'){
                player.attack += 3
                queueMessage(['You spend the entire night sharpening your blade','Attack: ' + player.att + '\n', move])
                return
            }
        }
        queuePrompt(prompt,callback)
    }
}



var monster = {
    premessage: 'You see a monster in the distance',


    event: function(){
        monster = new tier1Enemies.goblin()
        queueMessage(['You charge the monster \n',function(){battleTurn(monster)}])
    }
}

var shop = {
    premessage: "You see a merchant in the distance",
    event: function(){
        
        var shopArray = []
        for(var i = 0; i < 3; i++){
            var item = Object.keys(relicPool)[Math.floor(Math.random()*Object.keys(relicPool).length)]
            shopArray.push({name: item + ' ' + relicPool[item].cost+'g', value: item})
        }

        var potionArray = []
        for(key in potionList){
            potionArray.push({name: key + ' ' + potionList[key].cost+'g',value: key})
        }


        var prompt = [{
            type: 'list',
            message: "Come in and take a look at my wares!" + player.gold + ' gold',
            choices: shopArray.concat(potionArray,'Leave'),
            name: 'choice'
        }]

        function callback(response){
            if(response.choice == 'Leave'){
                queueMessage(['Come again anytime! \n', move])
                return
            }
            if(relicPool[response.choice]){
                if (player.gold >= relicPool[response.choice].cost){
                    player.relics.push(response.choice)
                    delete relicPool[response.choice]
                }
                else{
                    var prompt = [{
                        type: 'list',
                        message: "Please choose something else!",
                        choices: shopArray.concat(potionArray,'Leave'),
                        name: 'choice'
                    }]
                    queueMessage(['You don\'t have enough money!', function(){queuePrompt(prompt,callback)}])
                    return
                }
            }
            else{
                if(player.gold >= potionList[response.choice].cost){
                    player.items.push(response.choice)
                }
            }

            shopArray.splice(shopArray.indexOf(response.choice),1)
            var prompt = [{
                type: 'list',
                message: "Come in and take a look at my wares!",
                choices: shopArray.concat(potionArray,'Leave'),
                name: 'choice'
            }]

            queueMessage(['Good choice!', function(){queuePrompt(prompt,callback)}])
        }

        queuePrompt(prompt,callback)
    }
}

var beggar = {
    message: "You meet a beggar",
    event: function(){
        var prompt = [{
            type: 'list',
            message: '"Alms for the poor?"\n'+player.gold+' gold \n',
            choices: [{name: 'Give gold (-50 gold, 50% chance for relic)', value: 'Give'}, {name: 'Leave', value: 'Leave'}],
            name: 'choice'
        }]

        var callback = function(response){
            if (response.choice == 'Give'){
                if(player.gold < 50){
                    queueMessage(['...You can keep what little you have', move])
                    return
                }
                if (Math.floor(Math.random()*2) == 0){
                    player.gold -= 50
                    var randomRelic = Object.keys(relicPool)[Math.floor(Math.random()*Object.keys(relicPool).length)] //Grab a random key from the pool
                    player.relics.push(randomRelic)
                    delete relicPool[randomRelic]
                
                queueMessage(['"Thanks so much! Here is a trinket I found.', 'May it help you on your journey', 'Gained: ' + randomRelic, player.gold+' gold \n', move])
                return
                }
                queueMessage(['"May the goddess bless you, kind sir..."', move])
            }
            if (response.choice == 'Leave'){
                queueMessage(['"..."',player.gold+' gold \n', move])
            }
        }
        queuePrompt(prompt,callback)
    }
}

var shrine = {
    prompt:  [{
        type: 'list',
        message: 'You come across a shrine of the Goddess. \nA fountain is filled with clear spring water. \nIn the fountain you see some coins left as an offering.',
        choices: ['Pray', 'Steal', 'Desecrate'],
        name: 'choice'
    }],
    event: function(){
        queuePrompt(this.prompt,function(response){
            if (response.choice == 'Pray'){
                queueMessage(["You send a prayer up to the goddess and take a drink from the shrine.","You feel rejuvenated and are filled with determination\n",move])
            }
            else if (response.choice == 'Steal'){
                queueMessage(['filler',move])
            }
            else if (response.choice == 'Desecrate'){
                queueMessage(['filler',move])
            }
            
        })
    }
}

var unique = {
    premessage: 'Thick trees obscure your view on this path',
    uniquePool: [beggar,shrine,campfire,monster],
    event: function(){
        var randomEvent = this.uniquePool[Math.floor(Math.random()*this.uniquePool.length)]
        var messages = []
        messages.push('You enter the thicket\n')
        if (randomEvent.premessage){
            messages.push(randomEvent.premessage)
        }
        messages.push( function(){randomEvent.event()})
        queueMessage(messages)
    }
}

var events = [monster,unique]
inventory()