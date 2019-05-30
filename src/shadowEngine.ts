import { ShadowHull } from './shadowHull'

export class ShadowEngine {

    _shadowHulls = new Set<ShadowHull>();

    constructor() {
    }

    addHull(shadowHull: ShadowHull): void {
        this._shadowHulls.add(shadowHull);
    }

    removeHull(shadowHull: ShadowHull): void {
        this._shadowHulls.add(shadowHull);
    }
}