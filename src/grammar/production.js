/** * The MIT License (MIT)
 * Copyright (c) 2015-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

import GrammarSymbol from './grammar-symbol';
import {EPSILON} from '../special-symbols';

/**
 * A produciton in BNF grammar.
 */
export default class Production {
  /**
   * Receives a raw production in a view of:
   *
   * LHS -> RHS or a short alternative
   *      | RHS if the LHS is the same.
   */
  constructor({LHS, RHS, handler, number, isShort, grammar}) {
    this._rawLHS = LHS;
    this._rawRHS = RHS;
    this._number = number;
    this._handler = handler;
    this._grammar = grammar;
    this._isAugmented = number === 0;
    this._isShort = isShort;
    this._normalize();
  }

  /**
   * Returns number of the production
   * in the grammar.
   */
  getNumber() {
    return this._number;
  }

  /**
   * Whether this production is augmented.
   */
  isAugmented() {
    return this._isAugmented;
  }

  getLHS() {
    return this._LHS;
  }

  getRHS() {
    return this._RHS;
  }

  toString() {
    let LHS = this._LHS.getSymbol();

    let RHS = this._RHS
      .map(symbol => symbol.getSymbol())
      .join(' ');

    let pad = Array(LHS.length + '->'.length).join(' ');

    return this._isShort
      ? `${pad} | ${RHS}`
      : `${LHS} -> ${RHS}`
  }

  _normalize() {
    let LHS = new GrammarSymbol(this._rawLHS);
    let RHS = [];

    // If no RHS provided, assume it's ε. We support
    // both formats, explicit: F -> ε, and implicit: F ->

    if (!this._rawRHS) {
      RHS.push(new GrammarSymbol(EPSILON));
    } else {
      let rhsProd = this._rawRHS.split(/\s+/);
      for (let i = 0; i < rhsProd.length; i++) {
        if (rhsProd[i] === '"' && rhsProd[i + 1] === '"') {
          RHS.push(new GrammarSymbol('" "'));
          i++;
        } else {
          RHS.push(new GrammarSymbol(rhsProd[i]));
        }
      }
    }

    this._LHS = LHS;
    this._RHS = RHS;
  }
};
