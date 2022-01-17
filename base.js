export class Machine {
    #listeners = []; 
    emit(e, ...args) { this.#listeners.forEach(l => l(e, ...args));}
    on(type, ...origargs){
        const filter = origargs.slice(0, -1);
        this.#listeners.push((t, ...args) => {
            if (t != type) return;
            for(let a in filter)  if (!(args[a] instanceof filter[a])) return;
            origargs[origargs.length-1](...args);
        });
    }
    do(action) {
      if (action instanceof Action)
          action.do(this);
    }
    help() {  return this.state.getActions(); }
}
// base class for dynamic filtering and dispatching
class StateElement {}

export class State extends StateElement {
    #dispatchers = {};
    register(dispatchers) {this.#dispatchers = Object.assign(this.#dispatchers, dispatchers)}
    dispatchAction(action, machine) { machine?.emit("state.leave", this); return this.#dispatchers[action.constructor.name]?.().do(machine);}
    getActions() { return Object.getOwnPropertyNames(this.#dispatchers);}
    toString() { return this.constructor.name }
}
export class Action extends StateElement  {
    do(machine) { machine?.emit("action", this, machine.state); return machine.state.dispatchAction(this, machine); }
}
export class Transition extends StateElement  {
    #toState
    constructor(state){
        super();
        this.#toState = state;
    }
    do(machine) {
        machine?.emit("transition", machine.state, this.#toState);
        machine.state = this.#toState;
        machine?.emit("state.enter", machine.state);
    }
}