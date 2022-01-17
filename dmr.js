import { Machine, State, Transition, Action } from './base.js'

class WarmUpAction extends Action {}
class PreheatReadyAction extends Action {}
class StartRoastAction extends Action {}
class StopRoastAction extends Action {}
class CooledDownAction extends Action {}
class CancelRoastAction extends Action {}

class IdleState extends State {
    constructor(){
        super(); 
        this.register({[WarmUpAction.name]: () => new Transition(new Preheating())});
    }
}
class Preheating extends State {
    constructor(){
        super(); 
        this.register({[PreheatReadyAction.name] : () => new Transition(new PreheatReady())});
    }
}
class PreheatReady extends State {
    constructor(){
        super(); 
        this.register({
            [StartRoastAction.name]: () => new Transition(new Roasting()),
            [StopRoastAction.name]: () => new Transition(new CoolingDown()),
        });
    }
}
class Roasting extends State {
    constructor(){
        super(); 
        this.register({
            [StopRoastAction.name]: () => new Transition(new CoolingDown()),
            [CancelRoastAction.name]: () => new Transition(new CoolingDown()),
        });
    }
}
class CoolingDown extends State {
    constructor(){
        super(); 
        this.register({[CooledDownAction.name]: () => new Transition(new RoastingDone())});
    }
}
class RoastingDone extends State {
    constructor(){
        super(); 
        this.register({[WarmUpAction.name]: () => new Transition(new Preheating())});
    }
}

class DMR extends Machine {
    state;
    constructor() {
        super();
        this.state = new IdleState();
    }
    do(action){
        try {
            if (typeof action == "string"){ 
                switch (action) {
                    case "help": console.log("supported commands: ", ["help", "quit", ...this.help()].join(", ")); break;
                    case "quit": process.exit(0); break;
                    default: {
                        action = eval(`new ${action}()`);
                        super.do(action);
                        break;
                    }
                }
            } else {
                super.do(action)
            }
        } catch (e) {
            console.log("Unknown command:", action) 
        }
    }
}

export let Actions = { WarmUpAction, PreheatReadyAction, StartRoastAction, StopRoastAction, CooledDownAction, CancelRoastAction }
export let States = { IdleState, Preheating, PreheatReady, Roasting, CoolingDown, RoastingDone}
export let Machines = { DMR }


