import nice_si from "./nice-si";

describe("nice_si w/{p=3, b=1}", () => {
    it("should produce 0", () => {
        expect(nice_si(0.000000000000000001 * 1e0)).toEqual("0");
        expect(nice_si(0.000000000001 * 1e0)).toEqual("0");
        expect(nice_si(0.000001 * 1e0)).toEqual("0");
    });
    it("should produce 0.001", () => {
        expect(nice_si(0.001 * 1e0)).toEqual("0.001");
    });
});
describe("nice_si w/{p=3, b=1e18}", () => {
    it("should produce 0", () => {
        expect(nice_si(0.000000000000000001 * 1e18 * 1e0, { base: 1e18 })).toEqual("0");
        expect(nice_si(-BigInt(0.000000000000000001 * 1e18 * 1e0), { base: 1e18 })).toEqual("-0");
        expect(nice_si(0.000000000001 * 1e18 * 1e0, { base: 1e18 })).toEqual("0");
        expect(nice_si(-BigInt(0.000000000001 * 1e18 * 1e0), { base: 1e18 })).toEqual("-0");
        expect(nice_si(0.000001 * 1e18 * 1e0, { base: 1e18 })).toEqual("0");
        expect(nice_si(-BigInt(0.000001 * 1e18 * 1e0), { base: 1e18 })).toEqual("-0");
    });
    it("should produce 0.001", () => {
        expect(nice_si(0.001 * 1e18 * 1e0, { base: 1e18 })).toEqual("0.001");
        expect(nice_si(-BigInt(0.001 * 1e18 * 1e0), { base: 1e18 })).toEqual("-0.001");
    });
});
describe("nice_si w/{p=3, b=1}", () => {
    it("should produce 3.142", () => {
        expect(nice_si(3.142 * 1e0)).toEqual("3.142");
    });
    it("should produce 3.142K", () => {
        expect(nice_si(3.142 * 1e3)).toEqual("3.142K");
        expect(nice_si(-BigInt(3.142 * 1e3))).toEqual("-3.142K");
    });
    it("should produce 3.142M", () => {
        expect(nice_si(3.142 * 1e6)).toEqual("3.142M");
        expect(nice_si(-BigInt(3.142 * 1e6))).toEqual("-3.142M");
    });
    it("should produce 3.142G", () => {
        expect(nice_si(3.142 * 1e9)).toEqual("3.142G");
        expect(nice_si(-BigInt(3.142 * 1e9))).toEqual("-3.142G");
    });
    it("should produce 3.142T", () => {
        expect(nice_si(3.142 * 1e12)).toEqual("3.142T");
        expect(nice_si(-BigInt(3.142 * 1e12))).toEqual("-3.142T");
    });
    it("should produce 3.142P", () => {
        expect(nice_si(3.142 * 1e15)).toEqual("3.142P");
        expect(nice_si(-BigInt(3.142 * 1e15))).toEqual("-3.142P");
    });
    it("should produce 3.142E", () => {
        expect(nice_si(3.142 * 1e18)).toEqual("3.142E");
        expect(nice_si(-BigInt(3.142 * 1e18))).toEqual("-3.142E");
    });
    it("should produce 3.142Z", () => {
        expect(nice_si(3.142 * 1e21)).toEqual("3.142Z");
        expect(nice_si(-BigInt(3.142 * 1e21))).toEqual("-3.142Z");
    });
    it("should produce 3.142Y", () => {
        expect(nice_si(3.142 * 1e24)).toEqual("3.142Y");
        expect(nice_si(-BigInt(3.142 * 1e24))).toEqual("-3.142Y");
    });
    it("should produce 3.142E27", () => {
        expect(nice_si(3.142 * 1e27)).toEqual("3.142E27");
        expect(nice_si(-BigInt(3.142 * 1e27))).toEqual("-3.142E27");
    });
});
describe("nice_si w/{p=3, b=1e18}", () => {
    it("should produce 3.142", () => {
        expect(nice_si(3.142 * 1e18 * 1e0, { base: 1e18 })).toEqual("3.142");
        expect(nice_si(-BigInt(3.142 * 1e18 * 1e0), { base: 1e18 })).toEqual("-3.142");
    });
    it("should produce 3.142K", () => {
        expect(nice_si(3.142 * 1e18 * 1e3, { base: 1e18 })).toEqual("3.142K");
        expect(nice_si(-BigInt(3.142 * 1e18 * 1e3), { base: 1e18 })).toEqual("-3.142K");
    });
    it("should produce 3.142M", () => {
        expect(nice_si(3.142 * 1e18 * 1e6, { base: 1e18 })).toEqual("3.142M");
        expect(nice_si(-BigInt(3.142 * 1e18 * 1e6), { base: 1e18 })).toEqual("-3.142M");
    });
    it("should produce 3.142G", () => {
        expect(nice_si(3.142 * 1e18 * 1e9, { base: 1e18 })).toEqual("3.142G");
        expect(nice_si(-BigInt(3.142 * 1e18 * 1e9), { base: 1e18 })).toEqual("-3.142G");
    });
    it("should produce 3.142T", () => {
        expect(nice_si(3.142 * 1e18 * 1e12, { base: 1e18 })).toEqual("3.142T");
        expect(nice_si(-BigInt(3.142 * 1e18 * 1e12), { base: 1e18 })).toEqual("-3.142T");
    });
    it("should produce 3.142P", () => {
        expect(nice_si(3.142 * 1e18 * 1e15, { base: 1e18 })).toEqual("3.142P");
        expect(nice_si(-BigInt(3.142 * 1e18 * 1e15), { base: 1e18 })).toEqual("-3.142P");
    });
    it("should produce 3.142E", () => {
        expect(nice_si(3.142 * 1e18 * 1e18, { base: 1e18 })).toEqual("3.142E");
        expect(nice_si(-BigInt(3.142 * 1e18 * 1e18), { base: 1e18 })).toEqual("-3.142E");
    });
    it("should produce 3.142Z", () => {
        expect(nice_si(3.142 * 1e18 * 1e21, { base: 1e18 })).toEqual("3.142Z");
        expect(nice_si(-BigInt(3.142 * 1e18 * 1e21), { base: 1e18 })).toEqual("-3.142Z");
    });
    it("should produce 3.142Y", () => {
        expect(nice_si(3.142 * 1e18 * 1e24, { base: 1e18 })).toEqual("3.142Y");
        expect(nice_si(-BigInt(3.142 * 1e18 * 1e24), { base: 1e18 })).toEqual("-3.142Y");
    });
    it("should produce 3.142E27", () => {
        expect(nice_si(3.142 * 1e18 * 1e27, { base: 1e18 })).toEqual("3.142E27");
        expect(nice_si(-BigInt(3.142 * 1e18 * 1e27), { base: 1e18 })).toEqual("-3.142E27");
    });
});
describe("nice_si w/{p=6..0, b=1e18}", () => {
    it("should produce 3.141593", () => {
        expect(nice_si(3.141592654 * 1e18 * 1e0, { maxPrecision: 6, minPrecision: 6, base: 1e18 })).toEqual("3.141593");
        expect(nice_si(-BigInt(3.141592654 * 1e18 * 1e0), { maxPrecision: 6, minPrecision: 6, base: 1e18 })).toEqual("-3.141593");
    });
    it("should produce 3.14159K", () => {
        expect(nice_si(3.141592654 * 1e18 * 1e3, { maxPrecision: 5, minPrecision: 5, base: 1e18 })).toEqual("3.14159K");
        expect(nice_si(-BigInt(3.141592654 * 1e18 * 1e3), { maxPrecision: 5, minPrecision: 5, base: 1e18 })).toEqual("-3.14159K");
    });
    it("should produce 3.1416M", () => {
        expect(nice_si(3.141592654 * 1e18 * 1e6, { maxPrecision: 4, minPrecision: 4, base: 1e18 })).toEqual("3.1416M");
        expect(nice_si(-BigInt(3.141592654 * 1e18 * 1e6), { maxPrecision: 4, minPrecision: 4, base: 1e18 })).toEqual("-3.1416M");
    });
    it("should produce 3.142G", () => {
        expect(nice_si(3.141592654 * 1e18 * 1e9, { maxPrecision: 3, minPrecision: 3, base: 1e18 })).toEqual("3.142G");
        expect(nice_si(-BigInt(3.141592654 * 1e18 * 1e9), { maxPrecision: 3, minPrecision: 3, base: 1e18 })).toEqual("-3.142G");
    });
    it("should produce 3.14T", () => {
        expect(nice_si(3.141592654 * 1e18 * 1e12, { maxPrecision: 2, minPrecision: 2, base: 1e18 })).toEqual("3.14T");
        expect(nice_si(-BigInt(3.141592654 * 1e18 * 1e12), { maxPrecision: 2, minPrecision: 2, base: 1e18 })).toEqual("-3.14T");
    });
    it("should produce 3.1P", () => {
        expect(nice_si(3.141592654 * 1e18 * 1e15, { maxPrecision: 1, minPrecision: 1, base: 1e18 })).toEqual("3.1P");
        expect(nice_si(-BigInt(3.141592654 * 1e18 * 1e15), { maxPrecision: 1, minPrecision: 1, base: 1e18 })).toEqual("-3.1P");
    });
    it("should produce 3E", () => {
        expect(nice_si(3.141592654 * 1e18 * 1e18, { maxPrecision: 0, minPrecision: 0, base: 1e18 })).toEqual("3E");
        expect(nice_si(-BigInt(3.141592654 * 1e18 * 1e18), { maxPrecision: 0, minPrecision: 0, base: 1e18 })).toEqual("-3E");
    });
    it("should produce 3.1Z", () => {
        expect(nice_si(3.141592654 * 1e18 * 1e18, { maxPrecision: 0, minPrecision: 0, base: 1e18 })).toEqual("3E");
        expect(nice_si(-BigInt(3.141592654 * 1e18 * 1e18), { maxPrecision: 0, minPrecision: 0, base: 1e18 })).toEqual("-3E");
    });
    it("should produce 3.14Y", () => {
        expect(nice_si(3.141592654 * 1e18 * 1e24, { maxPrecision: 2, minPrecision: 2, base: 1e18 })).toEqual("3.14Y");
        expect(nice_si(-BigInt(3.141592654 * 1e18 * 1e24), { maxPrecision: 2, minPrecision: 2, base: 1e18 })).toEqual("-3.14Y");
    });
    it("should produce 3.142E27", () => {
        expect(nice_si(3.141592654 * 1e18 * 1e27, { maxPrecision: 3, minPrecision: 3, base: 1e18 })).toEqual("3.142E27");
        expect(nice_si(-BigInt(3.141592654 * 1e18 * 1e27), { maxPrecision: 3, minPrecision: 3, base: 1e18 })).toEqual("-3.142E27");
    });
});
