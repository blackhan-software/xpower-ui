export type SVA = {
    stamp: Date;
    value: bigint;
    area: bigint;
};
export class SVAIntegrator {
    constructor(svas: SVA[]) {
        this._items = svas;
    }
    headOf(): SVA {
        return this._items.length === 0
            ? { stamp: new Date(0), value: 0n, area: 0n }
            : this._items[0];
    }
    lastOf(stamp: Date): SVA {
        return this._items.length === 0
            ? { stamp: new Date(0), value: 0n, area: 0n }
            : queryBy(this._items, stamp);
    }
    nextOf(stamp: Date, value: SVA['value']): SVA {
        if (this._items.length > 0) {
            const last = this.lastOf(stamp);
            const area = value * duration(stamp, last.stamp);
            return { stamp, value, area: last.area + area };
        }
        return { stamp, value, area: 0n };
    }
    meanOf(stamp: Date, value: SVA['value']): SVA['value'] {
        const head = this.headOf();
        if (duration(stamp, head.stamp) > 0) {
            const area = this.areaOf(stamp, value);
            return area / duration(stamp, head.stamp);
        }
        return head.value;
    }
    areaOf(stamp: Date, value: SVA['value']): SVA['area'] {
        return this.nextOf(stamp, value).area;
    }
    append(stamp: Date, value: SVA['value']): void {
        this._items.push(this.nextOf(stamp, value));
    }
    private _items: SVA[];
}
function duration(
    lhs: Date, rhs: Date
) {
    return BigInt(lhs.getTime() - rhs.getTime()) / 1000n;
}
function queryBy(
    svas: SVA[], stamp: SVA['stamp']
) {
    const sva = svas.filter((s) => s.stamp >= stamp)[0];
    console.assert(svas.length > 0, 'empty query-by');
    return sva ?? svas[svas.length - 1];
}
export default SVAIntegrator;
