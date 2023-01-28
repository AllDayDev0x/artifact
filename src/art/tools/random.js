exports.Random = class {
    constructor(hash) {
        this.useA = false;
        let sfc32 = function (uint128Hex) {
            let a = parseInt(uint128Hex.substring(0, 8), 16);
            let b = parseInt(uint128Hex.substring(8, 8), 16);
            let c = parseInt(uint128Hex.substring(16, 8), 16);
            let d = parseInt(uint128Hex.substring(24, 8), 16);
            return function () {
                a |= 0;
                b |= 0;
                c |= 0;
                d |= 0;
                let t = (((a + b) | 0) + d) | 0;
                d = (d + 1) | 0;
                a = b ^ (b >>> 9);
                b = (c + (c << 3)) | 0;
                c = (c << 21) | (c >>> 11);
                c = (c + t) | 0;
                return (t >>> 0) / 4294967296;
            };
        };
        this.prngA = new sfc32(hash.substring(2, 32));
        this.prngB = new sfc32(hash.substring(34, 32));
        for (let i = 0; i < 1e6; i += 2) {
            this.prngA();
            this.prngB();
        }
    }

    r_dec() {
        this.useA = !this.useA;
        return this.useA ? this.prngA() : this.prngB();
    }

    r_num(a, b) {
        return a + (b - a) * this.r_dec();
    }

    r_int(a, b) {
        return Math.floor(this.r_num(a, b + 1));
    }

    r_bool() {
        return this.r_int(0, 1) === 1;
    }

    r_ar(ar) {
        return ar[this.r_int(0, ar.length - 1)];
    }

    wtRandom(itms, wts) {
        let s = 0;
        let cWts = [];
        let ind = 0;
        for (let i = 0; i < wts.length; i++) {
            s += wts[i];
            cWts.push(s);
        }
        const r = this.r_int(0, cWts[cWts.length - 1]);
        for (let i = 0; i < cWts.length; i++) {
            if (cWts[i] >= r) {
                ind = i;
                break;
            }
        }
        return [itms[ind], ind];
    }
}
