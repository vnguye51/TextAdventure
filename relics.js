function Relic(cost){
    this.cost = cost
}
var bloodRuby = new Relic(150)
    bloodRuby.preMessage = 'Blood Ruby empowers you. +5ATT'
    bloodRuby.preEffect = function(player){
        player.tempAtt += 5
    }

var crimsonGarnet = new Relic(150)
    crimsonGarnet.preMessage = 'Crimson Garnet empowers you. +4ATT'
    crimsonGarnet.preEffect = function(player){
        player.tempAtt += 5
    }

var cobaltSapphire = new Relic(150)
    cobaltSapphire.preMessage = 'Cobalt Sapphire steels your skin. +5DEF'
    cobaltSapphire.preEffect = function(player){
    player.defense += 5
    }

var lapis = new Relic(150)
    lapis.preMessage = 'The Lapis Lazuli steels your skin. +4DEF'
    lapis.preEffect = function(player){
    player.defense += 4
    }

var aquamarine = new Relic(150)
    aquamarine.preMessage = 'The Lapis Lazuli steels your skin. +6DEF'
    aquamarine.preEffect = function(player){
    player.defense += 6
    }

//Every enemy killed gives +1 ATT
var blueLantern = new Relic(150)   

    blueLantern.storedDef = 0
    blueLantern.preMessage = 'There are no souls in your Blue Lantern.'
    blueLantern.preEffect = function(player){
        player.defense += blueLantern.storedDef
    }
    blueLantern.postMessage = 'The monster\'s soul is sucked into your Blue Lantern'
    blueLantern.postEffect = function(player){
        blueLantern.storedDef += 1
        blueLantern.preMessage = 'There are ' + blueLantern.storedDef + ' souls in your Blue Lantern.' 
    }

var redLantern = new Relic(150)   
    redLantern.storedAtt = 0
    redLantern.preMessage = 'There are no souls in your Red Lantern.'
    redLantern.preEffect = function(player){
        player.tempAtt += redLantern.storedAtt
    }
    redLantern.postMessage = 'The monster\'s soul is sucked into your Red Lantern'
    redLantern.postEffect = function(){
        redLantern.storedAtt += 1
        redLantern.preMessage = 'There are ' + redLantern.storedAtt + ' souls in your Red Lantern.' 
    }

    

var scroll = new Relic(150) //Enemies drop 50% more gold

    scroll.postEffect = function(player,monster){
        player.gold += Math.floor(monster.gold*0.5)
        scroll.postMessage = 'Alchemical Scroll duplicates the gold dropped from the enemy +' + Math.floor(monster.gold*0.5) +'g'
    }

var turnwheel = new Relic(150)
    turnwheel.countdown = 6
    turnwheel.conEffect = function(player){
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
    theCoin.countdown = 3
    theCoin.conEffect = function(player){
        theCoin.countdown -= 1
        if(theCoin.countdown == 2){
            theCoin.conMessage = 'The Coin flips. (+5 ATT)'
            player.tempAtt += 5
        }
        else if(theCoin.countdown == 1){
            theCoin.conMessage = 'The Coin flips. (+5 DEF,-5ATT)'
            player.defense += 5
            player.tempAtt -= 5
        }
        else{
            theCoin.countdown = 2
            theCoin.conMessage = 'The Coin flips. (+5 ATT, -5 DEF)'
            player.tempAtt += 5
            player.defense -= 5
        }
    }

var effigy = new Relic(150)
    effigy.damageEffect = function(player){
        if (player.hp <= 0){
            effigy.hurtMessage = 'The Human Effigy enters Death\'s Door in your stead.'
            player.hp = 1
            player.relics.splice(player.relics.indexOf('Effigy'),1)
            ///Delete the relic keys on the next step
            }
        }

var luckyDice = new Relic(150)
    luckyDice.conEffect = function(player){
        var roll = Math.floor(Math.random()*6)
        if(roll == 0){
            luckyDice.conMessage = 'Unlucky. You roll a 0. You deal 0 damage this turn'
            player.multAtt = 0
        }
        else{
            luckyDice.conMessage = 'You roll a '+ roll + '.' + 'Your attacks deal ' + (roll+1)*0.5 + 'x damage this turn.'
            player.multAtt *= (roll+1)*0.5
        }
    }

var midasHeart = new Relic(150)
    midasHeart.preEffect = function(player){
        var bonusDef = Math.floor(player.gold/50)
        midasHeart.preMessage = 'Midas\'s heart covers you in gold. (+' + bonusDef + ' DEF)'
        player.tempDef += bonusDef
    }
//For every 50 gold you have in your inventory gain +1 def

var whetStone = new Relic(150)
//Double the effectiveness of sharpening at campfires
//Logic is in the campfire

var spikyShield = new Relic(150)
spikyShield.hurtEffect = function(player,monster){
    var reflectedDamage = Math.floor(monster.attack/2)
    spikyShield.hurtMessage = 'Your spiky shield reflects half the damage. (' + reflectedDamage + ')'
}

var steelHeart = new Relic(150)
    steelHeart.bonusDef = 0
    steelHeart.conEffect = function(player){
        steelHeart.bonusDef += 2
        player.bonusDef += 2
        conMessage = 'As the fight continues you steel your resolve. (+' + steelHeart.bonusDef + ')'
    }
//Every turn gain +2 Def

var doubleEdgedSword = new Relic(150)
    doubleEdgedSword.preEffect = function(player,monster){
        monster.attack += 10
        player.multAtt *= 2
        preMessage = 'You equip your Double Edged Sword. (Enemy: +10 ATT, Self:x2 Damage)'
    }
//You deal double damage but your opponent gains +10 ATT

var kale = new Relic(150)
    kale.obtainEffect = function(player){
        player.maxHp += 30
        player.hp += 30
    }
    kale.obtainMessage = 'You eat the Kale (+30 Max HP)' 
//Gain +30 HP

var broccoli = new Relic(150)
broccoli.obtainEffect = function(player){
    player.maxHp += 25
    player.hp += 25
}
broccoli.obtainMessage = 'You eat the Broccoli (+25 Max HP)' 
//Gain +25 HP

var brusselSprouts = new Relic(150)
brusselSprouts.obtainEffect = function(player){
    player.maxHp += 20
    player.hp += 20
}
brusselSprouts.obtainMessage = 'You eat the Brussel Sprouts (+20 Max HP)' 
//Gain +20 HP

var spinach = new Relic(150)
spinach.obtainEffect = function(player){
    player.maxHp += 15
    player.hp += 15
}
spinach.obtainMessage = 'You eat the Spinach (+15 Max HP)' 

var microGarden = new Relic(150)
microGarden.moveEffect = function(player){
    player.maxHp += 2
    player.hp += 2
}
microGarden.moveMessage = 'Your microgreens are ready. You eat some sprouts (+2 MaxHP)'


var cookingPan = new Relic(150)
cookingPan.postEffect = function(player){
    player.hp = Math.max(player.maxHp,player.hp+8)
    cookingPan.postMessage = 'Ssssssssssss..... You grilled some fresh meat on your Cooking Pan. (+8 HP, HP: ' +player.hp + '/' + player.maxHp + ')'
}
//Restore +8 HP after every fight
//Starting relic

var ritualDagger = new Relic(150)
    ritualDagger.preEffect = function(player){
        ritualDagger.preMessage = 'You slice the palm of your hand. Eldritch magic powers you (+5ATT, -2HP)'
        player.tempAtt += 5
        player.hp -= 2
    }

var piggyBank = new Relic(150)
    piggyBank.moveEffect = function(player){
        var bonusGold = Math.floor(player.gold*0.05)
        player.gold += bonusGold
        piggyBank.moveMessage = 'The Piggy Bank compounds your interest. (+' + bonusGold + 'g)'
    }


var relicList ={
    'Blood Ruby' : bloodRuby,
    'Cobalt Sapphire' : cobaltSapphire,
    'Red Lantern' : redLantern,
    'Blue Lantern' : blueLantern,
    'Alchemical Scroll' : scroll,
    'Turnwheel' : turnwheel,
    'The Coin' : theCoin,
    'Human Effigy' : effigy,
    'Lucky Dice' : luckyDice,
    'Midas\'s Heart' : midasHeart,
    'Steel Heart' : steelHeart,
    'Double Edged Sword' : doubleEdgedSword,
    'Kale' : kale,
    'Broccoli' : broccoli,
    'Brussel Sprouts': brusselSprouts,
    'Cooking Pan': cookingPan,
    'Ritual Dagger': ritualDagger,
    'Spinach' : spinach,
    'Micro Garden' : microGarden,
    'Whetstone' : whetStone,
    'Spiky Shield' : spikyShield,
    'Piggy Bank' : piggyBank,
    'Crimson Garnet': crimsonGarnet,
    'Lapis Lazuli': lapis,
    'Aquamarine' : aquamarine,
}

var relicPool={
    'Blood Ruby' : bloodRuby,
    'Cobalt Sapphire' : cobaltSapphire,
    'Red Lantern' : redLantern,
    'Blue Lantern' : blueLantern,
    'Alchemical Scroll' : scroll,
    'Turnwheel' : turnwheel,
    'The Coin' : theCoin,
    'Human Effigy' : effigy,
    'Lucky Dice' : luckyDice,
    'Midas\'s Heart' : midasHeart,
    'Steel Heart' : steelHeart,
    'Double Edged Sword' : doubleEdgedSword,
    'Kale' : kale,
    'Broccoli' : broccoli,
    'Brussel Sprouts': brusselSprouts,
    'Cooking Pan': cookingPan,
    'Ritual Dagger': ritualDagger,
    'Spinach' : spinach,
    'Micro Garden' : microGarden,
    'Piggy Bank' : piggyBank,
    'Crimson Garnet': crimsonGarnet,
    'Lapis Lazuli': lapis,
    'Aquamarine' : aquamarine,
}

exports.relicList = relicList
exports.relicPool = relicPool