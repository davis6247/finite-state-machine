// const config = {
//     initial: 'normal',
//     states: {
//         normal: {
//             transitions: {
//                 study: 'busy',
//             }
//         },
//         busy: {
//             transitions: {
//                 get_tired: 'sleeping',
//                 get_hungry: 'hungry',
//             }
//         },
//         hungry: {
//             transitions: {
//                 eat: 'normal'
//             },
//         },
//         sleeping: {
//             transitions: {
//                 get_hungry: 'hungry',
//                 get_up: 'normal',
//             },
//         },
//     }
// };

class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(arguments.length == 0) throw new Error("Error");        
        this.config = config; 
        this.state = config.initial;   
        this._undo = [];     //stack for undoing states
        this._redo = [];     //stack for redoing states
        this.dissableUndo = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        for(var sta in this.config.states){
            if(sta == state){
                this._undo.push(this.state);
                this.state = state;
                this.dissableUndo = true;
                return this;
            }
        }
        throw new Error("Error");
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var check = this.config.states[this.state].transitions[event];
        if(check == undefined) throw new Error("Error");
        else {
            this._undo.push(this.state);
            this.state = check;
            this.dissableUndo = true;
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if(arguments.length == 0) return Object.keys(this.config.states);   //return all states for 0 arguemnts
        

        var check;                      //return empty array for not valid argument
        for(var sta in this.config.states){  
            check = this.config.states[sta].transitions[event];
            if(check != undefined) break;
        }
        if(check == undefined) return [];                             

        var states = [];                         //return correct state for event
        for(var sta in this.config.states){    
            if(this.config.states[sta].transitions[event]) states.push(sta);
        }
        return states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this._undo.length == 0) return false;
        this._redo.push(this.state);
        this.state = this._undo.pop();  
        this.dissableUndo = false;   
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this._redo.length == 0) return false;
        else if(this.dissableUndo) return false;
        this.state = this._redo[this._redo.length - 1];
        this._undo.push(this._redo.pop());
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._undo.length = 0;
        this._redo.length = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
