//Initialize items
// var inquirer = require("inquirer");
var seed = require('seed-random')
var relicList = require('./relics.js').relicList
var relicPool = require('./relics.js').relicPool
var queueMessage = require('./system.js').queueMessage
var queuePrompt = require('./system.js').queuePrompt


//Initialize player stats
var player = {
    weapon : 1,
    attack : 8,
    tempAtt: 0,
    totalAtt: 0,
    multAtt: 1,
    defense: 0,
    tempDef: 0,
    maxHp : 36,
    hp : 36,
    pos : 0,
    tier : 'tier1',
    gold : 10000,
    items: ['Health Potion'],
    relics: [],

}


var pausedPrompt
var pausedCallback


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
    if(player.pos == 10){
        player.tier = 'tier2'
    }
    else if(player.pos == 0){
        player.tier = 'tier3'
    }
    var messages = []
    for(var i = 0; i < player.relics.length; i++){
        if(relicList[player.relics[i]].moveEffect){
            relicList[player.relics[i]].moveEffect(player)
            messages.push(relicList[player.relics[i]].moveMessage)
            messages.push('')
        }
    }

    messages.push(player.pos + ' miles traveled.')
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
    if (player.pos == 29){
        messages.push("This is it.")
    }
    if (player.pos == 30){
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
        choices: ['Left', 'Right', 'Straight'],
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
                if (response.direction == 'Right'){
                    return right.event()
                }
                return center.event()

            })}
        )
    }
    queueMessage(messages)
}


function preBattle(monster){
    ///CHECK FOR RELICS///
    var messages = []
    for(var i = 0; i < player.relics.length; i++){
        if(relicList[player.relics[i]].preEffect){
            relicList[player.relics[i]].preEffect(player,monster)
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
            relicList[player.relics[i]].conEffect(player,monster)
            messages.push(relicList[player.relics[i]].conMessage)
            messages.push('')
        }
    }
    player.totalAtt = (player.attack + player.tempAtt) * player.multAtt
    messages.push('Your attack will deal ' + player.totalAtt + ' damage.')
    messages.push(monster.warning)
    messages.push('Player ATT: ' + player.attack + ' ATT')
    messages.push('Player DEF: ' + player.defense + ' DEF')
    messages.push('Player HP: ' + player.hp)
    messages.push(monster.name + 'HP: ' + monster.hp)
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
            messages = messages.concat(['You slash the monster for ' + player.totalAtt + ' damage.',function(){monster.ai(player)}])
            
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
    if(monster.relic){  
        messages.push(function(){chooseRelic(1)})
    }
    else{
        messages.push(move)
    }
    queueMessage(messages)
}

function chooseRelic(n){
    var relicArray = []
    for(var i = 0; i < n; i++){
        var item = Object.keys(relicPool)[Math.floor(Math.random()*Object.keys(relicPool).length)]
        relicArray.push({name: item, value: item})
    }  
    var prompt = [{
        type: 'list',
        message: "Choose a relic.",
        choices: relicArray,
        name: 'choice'
    }]

    function callback(response){
        var messages = []
        messages.push('You chose ' + response.choice)
        if(relicPool[response.choice]){
            player.relics.push(response.choice)
            delete relicPool[response.choice]
            }
        var newRelic = relicList[response.choice]
        if(newRelic.obtainEffect){
            newRelic.obtainEffect()
            messages.push(newRelic.obtainMessage)
        }
        messages.push(move)
        queueMessage(messages)
        }
    

    queuePrompt(prompt,callback)
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



var potionList = {
    'Health Potion' : hpPot,
    'Strength Potion' : strPot,
    'Defense Potion' : defPot,
    'Flame Potion' : firePot,
}


////ENEMIES////
var tier1Enemies = {
    common : {
        Goblin: function(){
            this.hp = 30
            this.name = 'Goblin'
            this.attack = 5
            this.damage = 5
            this.warning = this.name + ' is about to attack for 5 damage.'
            this.death = this.name + ' let\'s out a pained howl before falling silent.'
            this.gold = 50,
            this.relic = false
            this.attack1= function(player){
                _this = this
                var damage = this.attack - player.defense
                player.hp -= damage
                queueMessage(['Goblin attacks for ' + damage + ' damage',function(){preTurn(_this)}])
                
            }
            this.ai = function(player){
                this.attack1(player)
            }
        },
    
        Orc: function(){
            this.hp = 30
            this.name = 'Orc'
            this.attack = 8
            this.damage = 8
            this.warning = this.name + ' is about to attack for 5 damage.'
            this.death = this.name + ' let\'s out a pained howl before falling silent.'
            this.gold = 50,
            this.relic = false
            this.attack1= function(player){
                _this = this
                var damage = this.attack - player.defense
                player.hp -= damage
                queueMessage(['Orc attacks for ' + damage + ' damage',function(){preTurn(_this)}])
                
            }
            this.ai = function(player){
                this.attack1(player)
            }
        },
    
        Wizard: function(){
            this.hp = 30
            this.name = 'Wizard'
            this.attack = 5
            this.damage = 5
            this.warning = this.name + ' is about to attack for 5 damage.'
            this.death = '"You barbarian..."'
            this.gold = 50,
            this.relic = false
            this.attack1 = function(player){
                _this = this 
                var calcDamage = this.damage - player.defense
                player.hp -= calcDamage
                this.warning = 'Wizard is chanting...'
                queueMessage(['Wizard attacks for ' + calcDamage + ' damage',function(){preTurn(_this)}])
            }
            this.attack2 = function(player){
                _this = this
                queueMessage(['The Wizard is starting to glow',function(){preTurn(_this)} ])            
            }
            this.attack3 = function(player){
                _this = this
                queueMessage(['The Wizard is blazing!', function(){preTurn(_this)}])
                this.warning = 'The Wizard is about to attack for 30 damage'
                this.damage = 30
            }
            this.attack4 = function(player){
                _this = this
                var calcDamage = this.damage - player.defense
                player.hp -= calcDamage
                this.warning = this.name + ' is about to attack for 5 damage.'
                this.damage = 5
                queueMessage(['"Flames! I beseech thee!"','"Return us to cinders!"', function(player){preTurn(_this)}])
            }
            this.pattern = [1,2,3,4]
            this.ai = function(player){
                this['attack'+this.pattern[0]](player)
                this.pattern.push(this.pattern.shift())
            }
        },
    },
    
    elite : {
        Treant: function(){
            this.hp = 30
            this.name = 'Treant'
            this.attack = 5
            this.damage = 5
            this.warning = this.name + ' is about to attack for 5 damage.'
            this.death = this.name + ' let\'s out a pained howl before falling silent.'
            this.gold = 50,
            this.relic = true
            this.attack1= function(player){
                _this = this
                var damage = this.attack - player.defense
                player.hp -= damage
                queueMessage(['Treant attacks for ' + damage + ' damage',function(){preTurn(_this)}])
                
            }
            this.ai = function(player){
                this.attack1(player)
            }
        },
    }
}//Forest theme

var tier2Enemies = {
    //Tribal theme
    direWolf: function(){
        this.hp = 30
        this.name = 'Dire Wolf'
        this.attack = 5
        this.damage = 5
        this.warning = this.name + ' is about to attack for 5 damage.'
        this.death = this.name + ' let\'s out a pained howl before falling silent.'
        this.gold = 50,
        this.relic = false
        this.attack1= function(player){
            _this = this
            var damage = this.attack - player.defense
            player.hp -= damage
            queueMessage(['Dire Wolf attacks for ' + damage + ' damage',function(){preTurn(_this)}])
            
        }
        this.ai = function(player){
            this.attack1(player)
        }
    },

    shaman: function(){
        this.hp = 30
        this.name = 'Shaman'
        this.attack = 5
        this.damage = 5
        this.warning = this.name + ' is about to attack for 5 damage.'
        this.death = this.name + ' let\'s out a pained howl before falling silent.'
        this.gold = 50,
        this.relic = false
        this.attack1= function(player){
            _this = this
            var damage = this.attack - player.defense
            player.hp -= damage
            queueMessage(['Shaman attacks for ' + damage + ' damage',function(){preTurn(_this)}])
            
        }
        this.ai = function(player){
            this.attack1(player)
        }
    },

    mandragora: function(){
        this.hp = 30
        this.name = 'Mandragora'
        this.attack = 5
        this.damage = 5
        this.warning = this.name + ' is about to attack for 5 damage.'
        this.death = this.name + ' let\'s out a pained howl before falling silent.'
        this.gold = 50,
        this.relic = false
        this.attack1= function(player){
            _this = this
            var damage = this.attack - player.defense
            player.hp -= damage
            queueMessage(['Mandragora attacks for ' + damage + ' damage',function(){preTurn(_this)}])
            
        }
        this.ai = function(player){
            this.attack1(player)
        }
    },

    shamanKing: function(){
        this.hp = 30
        this.name = 'Shaman King'
        this.attack = 5
        this.damage = 5
        this.warning = this.name + ' is about to attack for 5 damage.'
        this.death = this.name + ' let\'s out a pained howl before falling silent.'
        this.gold = 50,
        this.relic = true
        this.attack1= function(player){
            _this = this
            var damage = this.attack - player.defense
            player.hp -= damage
            queueMessage(['Shaman King attacks for ' + damage + ' damage',function(){preTurn(_this)}])
            
        }
        this.ai = function(player){
            this.attack1(player)
        }
    },

    
}

var tier3Enemies = {
    //Castle theme
    royalGuard: function(){
        this.hp = 30
        this.name = 'Royal Guard'
        this.attack = 5
        this.damage = 5
        this.warning = this.name + ' is about to attack for 5 damage.'
        this.death = this.name + ' let\'s out a pained howl before falling silent.'
        this.gold = 50,
        this.relic = false
        this.attack1= function(player){
            _this = this
            var damage = this.attack - player.defense
            player.hp -= damage
            queueMessage(['Royal Guard attacks for ' + damage + ' damage',function(){preTurn(_this)}])
            
        }
        this.ai = function(player){
            this.attack1(player)
        }
    },

    archWizard: function(){
        this.hp = 30
        this.name = 'Arch Wizard'
        this.attack = 5
        this.damage = 5
        this.warning = this.name + ' is about to attack for 5 damage.'
        this.death = this.name + ' let\'s out a pained howl before falling silent.'
        this.gold = 50,
        this.relic = false
        this.attack1= function(player){
            _this = this
            var damage = this.attack - player.defense
            player.hp -= damage
            queueMessage(['Arch Wizard attacks for ' + this.damage + ' damage',function(){preTurn(_this)}])
            
        }
        this.ai = function(player){
            this.attack1(player)
        }
    },

    abyss: function(){
        this.hp = 30
        this.name = 'Goblin'
        this.attack = 5
        this.damage = 5
        this.warning = this.name + ' is about to attack for 5 damage.'
        this.death = this.name + ' let\'s out a pained howl before falling silent.'
        this.gold = 50,
        this.relic = true
        this.attack1= function(player){
            _this = this
            var damage = this.attack - player.defense
            player.hp -= damage
            queueMessage(['Goblin attacks for ' + damage + ' damage',function(){preTurn(_this)}])
            
        }
        this.ai = function(player){
            this.attack1(player)
        }
    },


}

var uniqueEnemies = {
    Mimic: function(){
        this.hp = 30
        this.name = 'Mimic'
        this.attack = 5
        this.damage = 5
        this.warning = this.name + ' is about to attack for 5 damage.'
        this.death = this.name + ' let\'s out a pained howl before falling silent.'
        this.gold = 50,
        this.relic = true
        this.attack1= function(player){
            _this = this
            var damage = this.attack - player.defense
            player.hp -= damage
            queueMessage(['Mimic attacks for ' + damage + ' damage',function(){preTurn(_this)}])
            
        }
        this.ai = function(player){
            this.attack1(player)
        }
    },
}

var bosses = {
    blackkKnight: function(){
        this.hp = 100
        this.name = 'The Dark Knight'
        this.attack = 20
        this.damage = 20
        this.warning = this.name + ' is about to attack for ' + this.damage + ' damage.'
        this.death = this.name + ' "This isn\'t over..." \n The Black Knight escapes into the mists...' 
        this.gold = 100
        this.turn = 0
        this.relic = true
        this.attack1 = function(player){
            _this = this 
            var calcDamage = this.damage - player.defense
            player.hp -= this.damage 
            this.warning = this.name + 'is gathering strength.'
            queueMessage(['The Dark Knight swings his sword.', calcDamage +' damage!', function(){preTurn(_this)}])
        }
        this.attack2 = function(player){
            _this = this
            this.attack += 10
            this.damage = this.attack
            this.warning = this.name + ' is about to attack for ' + this.damage + ' damage.'
            queueMessage(['WRAH!', 'Now face me!', 'The Dark Knight gains +10ATT', function(){preTurn(_this)}])
        }
        this.pattern = [attack1,attack2]
        this.ai = function(player){
            this.pattern[0](player)
            this.pattern.push(this.pattern.shift)
        }
    },

    hydra: function(){
        this.hp = 30
        this.name = 'Hydra'
        this.attack = 5
        this.damage = 5
        this.warning = this.name + ' is about to attack for 5 damage.'
        this.death = this.name + ' let\'s out a pained howl before falling silent.'
        this.gold = 50,
        this.relic = true,
        this.attack1= function(player){
            _this = this
            var damage = this.attack - player.defense
            player.hp -= damage
            queueMessage(['Royal Guard attacks for ' + damage + ' damage',function(){preTurn(_this)}])
            
        }
        this.ai = function(player){
            this.attack1(player)
        }
    },

    magicConstruct: function(){
        this.hp = 30
        this.name = 'Royal Guard'
        this.attack = 5
        this.damage = 5
        this.warning = this.name + ' is about to attack for 5 damage.'
        this.death = this.name + ' let\'s out a pained howl before falling silent.'
        this.gold = 50
        this.relic = true
        this.attack1= function(player){
            _this = this
            var damage = this.attack - player.defense
            player.hp -= damage
            queueMessage(['Royal Guard attacks for ' + damage + ' damage',function(){preTurn(_this)}])
            
        }
        this.ai = function(player){
            this.attack1(player)
        }
    },

    ruler: function(){
        this.hp = 400
        this.name = 'The Ruler'
        this.attack = 50
        this.damage = 50
    },

    goddess: function(){
        this.hp = 400
        this.name = 'The Goddess'
        this.attack = 50
        this.damage = 50
    },

    lord: function(){
        //The TurnWheel and The Diary are required to fight this boss
        this.hp = 600
        this.name = 'The Lord of All'
        this.attack = 50
        this.damage = 50

        //attack1 resets buffs
        //attack2 charge attack
        //attack3 when below half health; switches between attacking and being invulnerable
        //During invulnerable turns gains att
    }
}

var enemies = {
    tier1: tier1Enemies,
    tier2: tier2Enemies,
    tier3: tier3Enemies,
    uniqueEnemies: uniqueEnemies,
    bosses: bosses,
}

//////////////EVENTS///////////////


var campfire = {
    premessage: 'There is a clearing up ahead. You will be able to safely rest there.',
    event: function(){
        var prompt = [{
            type: 'list',
            message: 'You enter the clearing .You set up a campfire.',
            choices: [{name: 'Rest (+20hp)',value: 'Rest'}, {name: 'Forge (+3ATT)', value: 'Forge'}],
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

var mimic = {
    event: function(){
        var messages = []
        messages.push('You come across a chest...','Odd that there are no guards and no locks on the chest.')
        var prompt = [{
            type: 'list',
            message: 'Do you open the chest?',
            choices: ['Open', 'Leave'],
            name: 'choice'
        }]
        var callback = function(response){
            var messages = []
            if(response.choice == 'Open'){
                messages.push('You open the chest...')
                if(Math.floor(Math.random()*2)){
                    messages.push('A mimic appears!', function(){preBattle(new enemies.uniqueEnemies.Mimic())})
                    queueMessage(messages)
                    return
                }
                messages.push('You obtain a relic!',function(){chooseRelic(1)})
                queueMessage(messages)
                return
            }
            messages.push('Greed has killed many men. You leave the chest alone.',move)
            queueMessage(messages)
        }
        messages.push(function(){queuePrompt(prompt,callback)})
        queueMessage(messages)
    }
}

var monster = {
    premessage: 'You see a monster in the distance',


    event: function(){
        var keys = Object.keys(enemies[player.tier].common)
        randomKey = keys[Math.floor(Math.random()*keys.length)]
        monster = new enemies[player.tier].common[randomKey]()
        queueMessage(['You charge the monster \n',function(){preBattle(monster)}])
    }
}

var elite = {
    premessage: 'A daunting foe guards this path.',


    event: function(){
        var keys = Object.keys(tier1Enemies.elite)
        randomKey = keys[Math.floor(Math.random()*keys.length)]
        elite = new enemies[player.tier].elite[randomKey]()
        queueMessage(['You challenge the foe. \n',function(){preBattle(elite)}])
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





var unique = {
    premessage: 'Thick trees obscure your view on this path',
    uniquePool: [beggar,mimic,campfire,monster,shop],
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

//Tier 1 Events
var fruit = {
   
    event: function(){
        var messages = []
        var choiceArray = [{name:'Eat the red fruit (+3 ATT)',value:{id:'red'}},{name: 'Eat the blue fruit (+3 DEF)',value:{id:'blue'}},{name: 'Eat the yellow fruit (+6 HP)',value:{id:'yellow'}}]
        for(var i = 0; i < choiceArray.length; i++){
            choiceArray[i].value.index = i
        }
        messages.push('You come across an orchard', 'A sign says...', '"Feel free to take one."')
        choosePrompt =  [{
            type: 'list',
            message: 'Choose a fruit!',
            choices: choiceArray,
            name: 'choice'
        }]
        
        function chooseCallback(response){
            var messages = []
            choiceArray.splice(response.choice.index,1)
            if(response.choice.id == 'red'){
                player.attack += 3
                messages.push('Sweet and delicious... (+3 ATT)')
            }
            else if(response.choice.id == 'yellow'){
                player.defense += 3
                messages.push('Tart. (+3 DEF)')
            }
            else{
                player.maxHp += 6
                messages.push('Ugh. Smelly. (+6 max HP)')
            }
            for(var i = 0; i < choiceArray.length; i++){
                choiceArray[i].value.index = i
            }
            var continuePrompt =  [{
                type: 'list',
                message: 'Take another?',
                choices: ['Yes','Leave'],
                name: 'choice'
            }]

            continueCallback = function(response){
                var messages = []
                if(response.choice == 'Yes'){
                    messages.push(function(){queuePrompt(choosePrompt,chooseCallback)})
                }
                else{
                    messages.push(move)
                }
                queueMessage(messages)
            }
            if(choiceArray.length > 0){
                messages.push(function(){queuePrompt(continuePrompt,continueCallback)})
            }
            else{
                var monster = new enemies.tier1.elite.Treant()
                monster.gold = 0
                monster.relic = false
                messages.push('The tree turns to life and attacks!')
                messages.push(function(){preBattle(monster)})
            }
            queueMessage(messages)
        }
        messages.push(function(){queuePrompt(choosePrompt,chooseCallback)})
        queueMessage(messages)
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

            else if (response.choice == 'Desecrate'){
                queueMessage(['filler',move])
            }
            
        })
    }
}


var events = [monster,monster,unique,unique,elite,campfire]
fruit.event()