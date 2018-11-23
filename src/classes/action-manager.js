import key from 'keymaster';


export default class ActionManager {
    constructor() {
        this.isKeyPressedTriggers = {};
        this.actions = {};
    }
    addAction(actionName, actionCallback) {
        this.actions[actionName] = actionCallback;
    }
    addIsKeyPressedTrigger(keyName, action) {
        if (!this.isKeyPressedTriggers[keyName]) {
            this.isKeyPressedTriggers[keyName] = [];
        }
        this.isKeyPressedTriggers[keyName].push(action);
    }
    update() {
        for(var keyName in this.isKeyPressedTriggers) {
            if (key.isPressed(keyName)) {
                for(var actionName of this.isKeyPressedTriggers[keyName]) {
                    this.actions[actionName]();
                }
            }
        }
    }
}
