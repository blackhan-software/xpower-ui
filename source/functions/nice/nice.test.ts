import nice from "./nice";

describe("nice w/{p=3, b=1, s=''}", () => {
    it("should produce 3", () => {
        expect(nice(3)).toEqual("3");
        expect(nice(-3n)).toEqual("-3");
    });
    it("should produce 31", () => {
        expect(nice(31)).toEqual("31");
        expect(nice(-31n)).toEqual("-31");
    });
    it("should produce 314", () => {
        expect(nice(314)).toEqual("314");
        expect(nice(-314n)).toEqual("-314");
    });
    it("should produce 3'141", () => {
        expect(nice(3_141)).toEqual("3'141");
        expect(nice(-3_141n)).toEqual("-3'141");
    });
    it("should produce 31'415", () => {
        expect(nice(31_415)).toEqual("31'415");
        expect(nice(-31_415n)).toEqual("-31'415");
    });
    it("should produce 314'159", () => {
        expect(nice(314_159)).toEqual("314'159");
        expect(nice(-314_159n)).toEqual("-314'159");
    });
    it("should produce 3'141'592", () => {
        expect(nice(3_141_592)).toEqual("3'141'592");
        expect(nice(-3_141_592n)).toEqual("-3'141'592");
    });
});
describe("nice w/{p=3, b=1, s='π'}", () => {
    it("should produce 3.142π", () => {
        expect(nice(3.141592654, { suffix: 'π' })).toEqual("3.142π");
    });
    it("should produce 31.416π", () => {
        expect(nice(31.41592654, { suffix: 'π' })).toEqual("31.416π");
    });
    it("should produce 314.159π", () => {
        expect(nice(314.1592654, { suffix: 'π' })).toEqual("314.159π");
    });
    it("should produce 3'141.593π", () => {
        expect(nice(3_141.592654, { suffix: 'π' })).toEqual("3'141.593π");
    });
    it("should produce 31'415.927π", () => {
        expect(nice(31_415.92654, { suffix: 'π' })).toEqual("31'415.927π");
    });
    it("should produce 314'159.265π", () => {
        expect(nice(314_159.2654, { suffix: 'π' })).toEqual("314'159.265π");
    });
    it("should produce 3'141'592.654π", () => {
        expect(nice(3_141_592.654, { suffix: 'π' })).toEqual("3'141'592.654π");
    });
});
describe("nice w/{p=3, b=1e18, s=''}", () => {
    it("should produce 3", () => {
        expect(nice(1e18 * 3, { base: 1e18 })).toEqual("3");
        expect(nice(-BigInt(1e18 * 3), { base: 1e18 })).toEqual("-3");
    });
    it("should produce 31", () => {
        expect(nice(1e18 * 31, { base: 1e18 })).toEqual("31");
        expect(nice(-BigInt(1e18 * 31), { base: 1e18 })).toEqual("-31");
    });
    it("should produce 314", () => {
        expect(nice(1e18 * 314, { base: 1e18 })).toEqual("314");
        expect(nice(-BigInt(1e18 * 314), { base: 1e18 })).toEqual("-314");
    });
    it("should produce 3'141", () => {
        expect(nice(1e18 * 3_141, { base: 1e18 })).toEqual("3'141");
        expect(nice(-BigInt(1e18 * 3_141), { base: 1e18 })).toEqual("-3'141");
    });
    it("should produce 31'415", () => {
        expect(nice(1e18 * 31_415, { base: 1e18 })).toEqual("31'415");
        expect(nice(-BigInt(1e18 * 31_415), { base: 1e18 })).toEqual("-31'415");
    });
    it("should produce 314'159", () => {
        expect(nice(1e18 * 314_159, { base: 1e18 })).toEqual("314'159");
        expect(nice(-BigInt(1e18 * 314_159), { base: 1e18 })).toEqual("-314'159");
    });
    it("should produce 3'141'592", () => {
        expect(nice(1e18 * 3_141_592, { base: 1e18 })).toEqual("3'141'592");
        expect(nice(-BigInt(1e18 * 3_141_592), { base: 1e18 })).toEqual("-3'141'592");
    });
});
describe("nice w/{p=6..0, b=1e18, s='π'}", () => {
    it("should produce 3.141593π", () => {
        expect(nice(1e18 * 3.141592654, { maxPrecision: 6, minPrecision: 6, base: 1e18, suffix: 'π' })).toEqual("3.141593π");
        expect(nice(-BigInt(1e18 * 3.141592654), { maxPrecision: 6, minPrecision: 6, base: 1e18, suffix: 'π' })).toEqual("-3.141593π");
    });
    it("should produce 31.41593π", () => {
        expect(nice(1e18 * 31.41592654, { maxPrecision: 5, minPrecision: 5, base: 1e18, suffix: 'π' })).toEqual("31.41593π");
        expect(nice(-BigInt(1e18 * 31.41592654), { maxPrecision: 5, minPrecision: 5, base: 1e18, suffix: 'π' })).toEqual("-31.41593π");
    });
    it("should produce 314.1593π", () => {
        expect(nice(1e18 * 314.1592654, { maxPrecision: 4, minPrecision: 4, base: 1e18, suffix: 'π' })).toEqual("314.1593π");
        expect(nice(-BigInt(1e18 * 314.1592654), { maxPrecision: 4, minPrecision: 4, base: 1e18, suffix: 'π' })).toEqual("-314.1593π");
    });
    it("should produce 3'141.593π", () => {
        expect(nice(1e18 * 3_141.592654, { maxPrecision: 3, minPrecision: 3, base: 1e18, suffix: 'π' })).toEqual("3'141.593π");
        expect(nice(-BigInt(1e18 * 3_141.592654), { maxPrecision: 3, minPrecision: 3, base: 1e18, suffix: 'π' })).toEqual("-3'141.593π");
    });
    it("should produce 31'415.93π", () => {
        expect(nice(1e18 * 31_415.92654, { maxPrecision: 2, minPrecision: 2, base: 1e18, suffix: 'π' })).toEqual("31'415.93π");
        expect(nice(-BigInt(1e18 * 31_415.92654), { maxPrecision: 2, minPrecision: 2, base: 1e18, suffix: 'π' })).toEqual("-31'415.93π");
    });
    it("should produce 314'159.3π", () => {
        expect(nice(1e18 * 314_159.2654, { maxPrecision: 1, minPrecision: 1, base: 1e18, suffix: 'π' })).toEqual("314'159.3π");
        expect(nice(-BigInt(1e18 * 314_159.2654), { maxPrecision: 1, minPrecision: 1, base: 1e18, suffix: 'π' })).toEqual("-314'159.3π");
    });
    it("should produce 3'141'593π", () => {
        expect(nice(1e18 * 3_141_592.654, { maxPrecision: 0, minPrecision: 0, base: 1e18, suffix: 'π' })).toEqual("3'141'593π");
        expect(nice(-BigInt(1e18 * 3_141_592.654), { maxPrecision: 0, minPrecision: 0, base: 1e18, suffix: 'π' })).toEqual("-3'141'593π");
    });
});
