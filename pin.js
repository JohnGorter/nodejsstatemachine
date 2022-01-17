import { Machine, State, Transition, Action } from './base.js'


class AskAction extends Action {}
class WithdrawAction extends Action {}
class DepositAction extends Action {}
class AccountReceivedAction extends Action {}
class AmmountReceivedAction extends Action {}
class TransactionConfirmedAction extends Action {}
class TransactionCancelledAction extends Action {}
class RestartAction extends Action {}

export let Actions = { AskAction, WithdrawAction, DepositAction, AccountReceivedAction, AmmountReceivedAction, TransactionCancelledAction, TransactionConfirmedAction, RestartAction }

class IdleState extends State {
    constructor(){
        super(); 
        this.register({
            [AskAction.name]:() => new Transition(new ChooseActionState()),
            [TransactionCancelledAction.name]:() => new Transition(new IdleState())
        })
    }
}
class ChooseActionState extends State {
    constructor(){
        super(); 
        this.register({
            [WithdrawAction.name]:() => new Transition(new WithdrawState()),
            [DepositAction.name]:() => new Transition(new DepositState()),
            [TransactionCancelledAction.name]:() => new Transition(new IdleState())
        })
    }
}
class WithdrawState extends State {
    constructor(){
        super(); 
        this.register({
            [AmmountReceivedAction.name]:() => new Transition(new GetAccountState()),
            [TransactionCancelledAction.name]:() => new Transition(new IdleState())
        })
    }
}
class DepositState extends State {
    constructor(){
        super(); 
        this.register({
            [AmmountReceivedAction.name]:() => new Transition(new GetAccountState()),
            [TransactionCancelledAction.name]:() => new Transition(new IdleState())
        })
    }
}
class GetAccountState extends State {
    constructor(){
        super(); 
        this.register({
            [AccountReceivedAction.name]:() => new Transition(new ComfirmState()),
            [TransactionCancelledAction.name]:() => new Transition(new IdleState())
        })
    }
}
class ComfirmState extends State {
    constructor(){
        super(); 
        this.register({
            [TransactionConfirmedAction.name]:() => new Transition(new CompleteState()),
            [TransactionCancelledAction.name]:() => new Transition(new IdleState())
        })
    }
}
class CompleteState extends State {
    constructor(){
        super(); 
        this.register({
            [RestartAction.name]:() => new Transition(new IdleState())
        })
    }
}

export let States = { IdleState, ChooseActionState, WithdrawState, DepositState, GetAccountState, ComfirmState, CompleteState } 

class Pin extends Machine {
    constructor(){
        super(); 
        this.state = new IdleState();
    }
    do(action){
        if (typeof action == "string") action = eval(`new ${action}()`);
        super.do(action);
    }
}
export let Machines = { Pin }