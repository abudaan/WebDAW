"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayheadAnchorData = exports.getTicksAtBar = void 0;
var mapper3_1 = require("./mapper3");
exports.getTicksAtBar = function (parts) {
    parts.forEach(function (data) {
        var bar = 0;
        data.events.reduce(function (acc, val) {
            if (val.bar && val.bar !== bar) {
                bar = val.bar;
                // console.log(bar, val.ticks);
            }
            return bar;
        }, 0);
    });
};
exports.getPlayheadAnchorData = function (osmd, repeats, ppq) {
    if (ppq === void 0) { ppq = 960; }
    var measureStartTicks = osmd.Sheet.SourceMeasures.map(function (measure) {
        return ppq * measure.AbsoluteTimestamp.RealValue * 4;
    });
    var ticks = 0;
    var anchorData = osmd.GraphicSheet.VerticalGraphicalStaffEntryContainers.map(function (container) {
        var realValue = container.AbsoluteTimestamp.RealValue;
        var data = container.StaffEntries.map(function (entry) {
            var measureNumber = entry.parentMeasure.MeasureNumber;
            return { measureNumber: measureNumber, bbox: mapper3_1.getBoundingBoxData(entry.boundingBox) };
        });
        data.sort(function (a, b) {
            if (a.bbox.x < b.bbox.x) {
                return -1;
            }
            if (a.bbox.x > b.bbox.x) {
                return 1;
            }
            return 0;
        });
        // console.log(boxes);
        ticks = ppq * 4 * realValue;
        var bbox = data[0].bbox;
        var measureNumber = data[0].measureNumber;
        return { ticks: ticks, bbox: bbox, measureNumber: measureNumber };
    });
    var diffTicks = 0;
    var copies = [];
    for (var i = 0; i < repeats.length; i++) {
        var _a = __read(repeats[i], 2), min = _a[0], max = _a[1];
        var minTicks = measureStartTicks[min - 1];
        var maxTicks = measureStartTicks[max];
        // console.log(min, max, minTicks, maxTicks);
        diffTicks += maxTicks - minTicks;
        // console.log(min, max, minTicks, maxTicks, diffTicks);
        for (var j = 0; j < anchorData.length; j++) {
            var anchor = anchorData[j];
            if (anchor.measureNumber >= min && anchor.measureNumber <= max) {
                var clone = __assign({}, anchor);
                clone.ticks += diffTicks;
                clone.measureNumber += max - (min - 1);
                copies.push(clone);
            }
        }
    }
    var result = anchorData.map(function (d) {
        var measureNumber = d.measureNumber, ticks = d.ticks;
        var clone = __assign({}, d);
        for (var i = 0; i < repeats.length; i++) {
            var _a = __read(repeats[i], 2), min = _a[0], max = _a[1];
            var minTicks = measureStartTicks[min - 1];
            var maxTicks = measureStartTicks[max];
            var diffTicks_1 = maxTicks - minTicks;
            var diffBars = max - (min - 1);
            if (measureNumber > max) {
                clone.ticks = ticks + diffTicks_1;
                clone.measureNumber = measureNumber + diffBars;
            }
        }
        return clone;
    });
    // result.forEach(d => {
    //   console.log(d.measureNumber, d.ticks);
    // });
    // copies.forEach(d => {
    //   console.log(d.measureNumber, d.ticks);
    // });
    result.push.apply(result, __spread(copies));
    result.sort(function (a, b) {
        if (a.ticks < b.ticks) {
            return -1;
        }
        if (a.ticks > b.ticks) {
            return 1;
        }
        return 0;
    });
    // result.forEach(d => {
    //   console.log(d.measureNumber, d.ticks);
    // });
    var result1 = [];
    var currentMeasureNumber = 0;
    result.forEach(function (r) {
        var ticks = r.ticks, measureNumber = r.measureNumber;
        if (currentMeasureNumber !== measureNumber) {
            currentMeasureNumber = measureNumber;
            result1.push(ticks);
        }
    });
    // add ticks position of the end of the last bar
    var _b = osmd.Sheet.SourceMeasures[osmd.Sheet.SourceMeasures.length - 1].ActiveTimeSignature, Numerator = _b.Numerator, Denominator = _b.Denominator;
    var lastTicks = result1[result1.length - 1];
    result1.push(lastTicks + Numerator * (4 / Denominator) * 960);
    return { anchorData: result, measureStartTicks: result1 };
};
//# sourceMappingURL=getPlayheadAnchorData.js.map