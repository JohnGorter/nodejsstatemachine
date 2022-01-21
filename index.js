import { write } from 'fs';
import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output, stdout } from 'process';
import { Actions, States, Machines } from './dmr.js'
// import { Actions, States, Machines } from './pin.js'

const machine = new Machines.DMR();
const rl = new readline.Interface({input, output});

// your code here


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
