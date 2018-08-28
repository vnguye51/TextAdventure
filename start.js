//Initialize items
var inquirer = require("inquirer");
var seed = require('seed-random')


//Initialize player stats
var player = {
    weapon : 1,
    attack : 8,
    tempAtt: 0,
    totalAtt: 0,
    multAtt: 1,
    defense: 0,
    tempDef: 0,
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

//Battle: preBattle -> TurnChecks ->  

function preBattle(monster){
    ///CHECK FOR RELICS///
    var messages = []
    for(var i = 0; i < player.relics.length; i++){
        if(relicList[player.relics[i]].preEffect){
            relicList[player.relics[i]].preEffect(monster)
            messages.push(relicList[player.relics[i]].preMessage)
            messages.push('')
        }
    }
    messages.push(function(){preTurn(monster)})
    queueMessage(messages)
}

function preTurn(monster){
    var messages = []
    for(var i = 0; i < player.relics.length; i++){
        if(relicList[player.relics[i]].conEffect){
            relicList[player.relics[i]].conEffect(monster)
            messages.push(relicList[player.relics[i]].conMessage)
            messages.push('')
        }
    }
    player.totalAtt = (player.attack + player.tempAtt) * player.multAtt
    messages.push('Your attack will deal ' + player.totalAtt + ' damage.')
    messages.push(monster.warning)
    messages.push('You have ' + player.defense + ' DEF')
    messages.push('Player HP: ' + player.hp)
    messages.push(monster.name + ': ' + monster.hp)
    messages.push(function(){battleTurn(monster)})
    queueMessage(messages)
}

function battleTurn(monster){
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
        else{
            monster.hp -= player.totalAtt
            if (monster.hp <= 0 && response.choice == 'Attack'){
                monster.hp -= player.totalAtt
                messages = messages.concat(["You deal a lethal blow!",function(){postBattle(monster)}])
            }
            messages = messages.concat(['You slash the monster for ' + player.totalAtt + ' damage.',function(){monster.ai()}])
            
        }
        queueMessage(messages)
    }
    pausedPrompt = prompt
    pausedCallback = callback
    queueMessage([function(){queuePrompt(prompt,callback)}])
}

function postBattle(monster){
    player.tempAtt = 0
    player.tempDef = 0
    var messages = []
    for(var i = 0; i < player.relics.length; i++){
        if(relicList[player.relics[i]].postEffect){
            relicList[player.relics[i]].postEffect(monster)
            messages.push(relicList[player.relics[i]].postMessage)
            messages.push('')
        }
    }
    messages.push(monster.death)
    messages.push('You loot ' + monster.gold + 'g')
    messages.push(move)
    queueMessage(messages)
}

function inventory(){
    var itemArray = []
    for(var i = 0;i < player.items.length; i++){
        itemArray.push({name:player.items[i],value:i})
    }
    var prompt = [{
        type: 'list',
        message: 'You look through your rucksack \n' + player.gold + ' gold \n',
        choices: itemArray.concat('Cancel'),
        name: 'choice'
    }]

    queuePrompt(prompt,function(response){
        if(response.choice == 'Cancel'){
            return queuePrompt(pausedPrompt,pausedCallback)
        }
        queueMessage([potionList[player.items[response.choice]].effect])
        player.items.splice(response.choice,1)
        return
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
        player.hp += 20
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
///Relic logic is separated into three parts they can be called either in the pre,continiuing, or post battle phases.
// During each phase the player's relics are looped through and checked if they have any pre,continuing, or post effects.
function Relic(cost){
    this.cost = cost
}
var relic0 = new Relic(150)
    relic0.preMessage = 'relic0 empowers you. +5ATT'
    relic0.preEffect = function(){
        player.tempAtt += 5
    }
var relic1 = new Relic(150)
    relic1.preMessage = 'relic1 steels your skin. +5DEF'
    relic1.preEffect = function(){
    player.tempDef += 5
    }

//Every enemy killed gives +1 ATT
var blueLantern = new Relic(150)   

    blueLantern.storedDef = 0
    blueLantern.preMessage = 'There are no souls in your Blue Lantern.'
    blueLantern.preEffect = function(){
        player.tempDef += blueLantern.storedDef
    }
    blueLantern.postMessage = 'The monster\'s soul is sucked into your Blue Lantern'
    blueLantern.postEffect = function(){
        blueLantern.storedDef += 1
        blueLantern.preMessage = 'There are ' + blueLantern.storedDef + ' souls in your Blue Lantern.' 
    }

var redLantern = new Relic(150)   

    redLantern.storedAtt = 0
    redLantern.preMessage = 'There are no souls in your Red Lantern.'
    redLantern.preEffect = function(){
        player.tempAtt += redLantern.storedAtt
    }
    redLantern.postMessage = 'The monster\'s soul is sucked into your Red Lantern'
    redLantern.postEffect = function(){
        redLantern.storedAtt += 1
        redLantern.preMessage = 'There are ' + redLantern.storedAtt + ' souls in your Red Lantern.' 
    }

    

var relic3 = new Relic(150) //Enemies drop 50% more gold

    relic3.postEffect = function(monster){
        player.gold += Math.floor(monster.gold*0.5)
        relic3.postMessage = 'Alchemical Scroll duplicates the gold dropped from the enemy ' + Math.floor(monster.gold*0.5) +'g'
    }

var turnwheel = new Relic(150)
    turnwheel.countdown = 6
    turnwheel.conEffect = function(){
        turnwheel.countdown -= 1
        if(turnwheel.countdown == 0){
            turnwheel.countdown = 6
            turnwheel.conMessage = 'The Turnwheel completes a cycle. Your blade blazes. Your attacks deal 5x damage this turn.'
            player.multAtt *= 5//Total Att is recalculated every turn so no need to clean up
        }
        else{
            turnwheel.conMessage = 'The Turnwheel rotates. '+ turnwheel.countdown + ' turns left.'
        }
    }

var theCoin = new Relic(150)
    theCoin.countdown = 1
    theCoin.conEffect = function(){
        theCoin.countdown -= 1
        if(theCoin.countdown == 0){
            theCoin.countdown = 2
            theCoin.conMessage = 'The Coin flips. +5 ATT'
            player.tempAtt += 5
        }
        else{
            theCoin.conMessage = 'The Coin flips. +5 DEF'
            player.tempDef += 5
        }
    }

var effigy = new Relic(150)
    //Need to add a check during the opponents damagestep
    effigy.damageEffect = function(){
        if (player.hp <= 0){
            effigy.damageMessage = 'The effigy enters Death\'s Door in your stead.'
            player.hp = 1
            player.relics.splice(player.relics.indexOf('Effigy'),1)
            ///Delete the relic keys on the next step
            }
        }

var luckyDice = new Relic(150)
    luckyDice.conEffect = function(){
        var roll = Math.floor(Math.random()*6)
        if(roll == 0){
            luckyDice.conMessage = 'Unlucky. You roll a 0. You deal 0 damage this turn'
            player.multAtt = 0
        }
        else{
            luckyDice.conMessage = 'You roll a '+ roll + '.' + 'Your attacks deal ' + (roll+1) + 'x damage this turn.'
            player.multAtt *= (roll+1)
        }
    }

var midasHeart = new Relic(150)
//For every 50 gold you have in your inventory gain +1 def

var topsyTurvy = new Relic(150)
//Swap your base attack with your base defense

var whetStone = new Relic(150)
//Double the effectiveness of sharpening at campfires

var steelCross = new Relic(150)
//Reflect half the damage blocked back to your opponent

var steelHeart = new Relic(150)
//Every turn gain +2 Def

var doubleEdgedSword = new Relic(150)
//You deal double damage but your opponent gains +10 ATT

var kale = new Relic(150)
//Gain +25 HP

var broccoli = new Relic(150)
//Gain +20 HP

var bruseelSprouts = new Relic(150)
//Gain +20 HP

var cookingPan = new Relic(150)
//Restore +8 HP after every fight

var ritualDagger = new Relic(150)
//Lose 3HP every attack but gain +10ATT  

var relicList ={
    'Relic0' : relic0,
    'Relic1' : relic1,
    'Red Lantern' : redLantern,
    'Blue Lantern' : blueLantern,
    'Relic3' : relic3,
    'Turnwheel' : turnwheel,
    'The Coin' : theCoin,
}

var relicPool={
    'Relic0' : relic0,
    'Relic1' : relic1,
    'Red Lantern' : redLantern,
    'Blue Lantern' : blueLantern,
    'Relic3' : relic3,
    'Turnwheel' : turnwheel,
    'The Coin' : theCoin,
}
////////////Enemy List////////////////
tier1Enemies = {
    goblin: function(){
        this.hp = 30
        this.name = 'goblin'
        this.attack= 5
        this.warning = this.name + ' is about to attack for 5 damage.'
        this.death = this.name + ' let\'s out a pained howl before falling silent.'
        this.gold = 50
        this.attack1= function(){
            _this = this
            var damage = this.attack - player.defense
            player.hp -= damage
            queueMessage(['Goblin attacks for ' + damage + ' damage',function(){preTurn(_this)}])
            
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
                queueMessage(['You spend the entire night sharpening your blade','Attack: ' + player.attack + '\n', move])
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
        queueMessage(['You charge the monster \n',function(){preBattle(monster)}])
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
monster.event()