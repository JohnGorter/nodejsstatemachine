import { write } from 'fs';
import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output, stdout } from 'process';
import { Actions, States, Machines } from './dmr.js'
// import { Actions, States, Machines } from './pin.js'

const machine = new Machines.DMR();
const rl = new readline.Interface({input, output});

machine.on("transition", States.IdleState, States.Preheating, () => writeLog("preheating"));
machine.on("action", Actions.WarmUpAction, () => writeLog("starting to warm the shit up"));
machine.on("state.enter", States.Preheating, () => { 
    machine.timer = new Timer().start("HEATING UP: ", 100); 
    setTimeout(() => { machine.timer.stop(); machine.do(new Actions.PreheatReadyAction())}, 5000)
});
machine.on("state.enter", States.CoolingDown, () => { 
    machine.timer = new Timer().start("COOLING DOWN: ", 100); 
    setTimeout(() => {  machine.timer.stop(); machine.do(new Actions.CooledDownAction())}, 5000)
});
machine.on("state.enter", States.PreheatReady, () => writeLog("preheating is done!"));
machine.on("state.enter", States.Roasting, () => machine.timer = new Timer().start("ROASTING: ", 100));
machine.on("state.leave", States.Roasting, () => machine.timer.stop());
machine.on("state.leave", States.CoolingDown, () => writeLog("Cooled down"));

// machine.on("state.enter", (s) => writeLog("state enter " + s));
// const machine = new Machines.Pin();
// console.log("1");
// machine.on("state.enter", (s) => writeLog("state enter!!" + s));
// console.log("2");


startCommands();
showProgress();



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function startCommands() {
    let action = "q"
    do {
        action =  await rl.question('\x1B[6;1H\x1B[KCOMMAND:> ') 
        if (action != "q")  machine.do(action)
    } while (action != "q");
}
async function showProgress(){
    setInterval(() => {
        stdout.write('\x1B[s');
        stdout.write('\x1B[1;1H');
        stdout.write('\x1B[K');
        stdout.write('\x1B[3;1H');
        stdout.write('\x1B[K');
        stdout.write('\x1B[2;1H');
        stdout.write('\x1B[K');
        stdout.write("\x1B[41;1mMACHINE: STATUS --> " + machine.state.toString().toUpperCase() + "\r\n\x1B[0;33mAvailable commands: " + machine.help());
        stdout.write('\x1B[u');
    }, 100); 
}
async function writeLog(line){
    stdout.write('\x1B[s');
    stdout.write('\x1B[5;1H');
    stdout.write('\x1B[K');
    stdout.write(line + "\r\n");
    stdout.write('\x1B[u');
}
class Timer {
    #counter=0
    #interval
    start(line, interval){
        this.#interval = setInterval(()=>{
            writeLog(line + ["|", "/", "-", "\\"][this.#counter++ % 4])
        }, interval); 
        return this;
    }
    stop(){
        this.#counter = 0;
        clearInterval(this.#interval);
    }
}