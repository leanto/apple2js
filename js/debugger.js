import { debug, toHex } from './util';

import SYMBOLS from './symbols';

export default function Debugger(cpu) {
    var TRACE = false;
    var MAX_TRACE = 256;
    var trace = [];
    var breakpoints = {};

    return {
        stepCycles: function(step) {
            cpu.stepCyclesDebug(TRACE ? 1 : step, function() {
                var info = cpu.getDebugInfo();
                if (info[0] in breakpoints && breakpoints[info[0](info)]) {
                    debug(cpu.printDebugInfo(info, SYMBOLS));
                    stop();
                }
                if (TRACE) {
                    debug(cpu.printDebugInfo(info, SYMBOLS));
                } else {
                    trace.push(info);
                    if (trace.length > MAX_TRACE) {
                        trace.shift();
                    }
                }
            });
        },

        getTrace: function () {
            return trace.map((info) => cpu.printDebugInfo(info, SYMBOLS)).join('\n');
        },


        printTrace: function () {
            debug(this.getTrace());
        },

        setBreakpoint: function(addr, exp) {
            breakpoints[addr] = exp || function() { return true; };
        },

        clearBreakpoint: function(addr) {
            delete breakpoints[addr];
        },

        listBreakpoints: function() {
            Object.keys(breakpoints).forEach(function(addr) {
                debug(toHex(addr, 4), breakpoints[addr].toString());
            });
        }
    };
}
