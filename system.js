var inquirer = require("inquirer");

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

exports.queueMessage = queueMessage
exports.queuePrompt = queuePrompt