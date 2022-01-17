import { Actions, States, Machines } from '../dmr.js'

describe("State machines", function() {
    let dmr;
    beforeEach(()=>{
        dmr = new Machines.DMR();
    });
    it("should start with an Idle state", function() {
      expect(dmr.state).toBeInstanceOf(States.IdleState); 
    });
    it("should transition to PreHeat", function() {
        dmr.do(new Actions.WarmUpAction())
        expect(dmr.state).toBeInstanceOf(States.Preheating); 
      });
    it("should give correct actions to do", function() {
    const dmr = new Machines.DMR();
    let actions = dmr.help();
    expect(actions).toEqual(['WarmUpAction']); 
    });
    
    it("should do nothing because of unsupported action", function() {
        const dmr = new Machines.DMR();
        dmr.do(new Actions.CooledDownAction())
        expect(dmr.state).toBeInstanceOf(States.IdleState); 
    });
    it("should trigger events", function() {
        const logger = { log: (from, to) => {console.log("transition", from, to)} };
        const loggerspy = spyOn(logger, 'log');
        dmr.on('transition', loggerspy);
        dmr.do(new Actions.WarmUpAction())
        expect(loggerspy).toHaveBeenCalledWith(new States.IdleState(), new States.Preheating());
    });
  });