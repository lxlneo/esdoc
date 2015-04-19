import AbstractDoc from './AbstractDoc.js';

export default class MethodDoc extends AbstractDoc {
  _apply() {
    super._apply();

    delete this._value.export;
    delete this._value.importPath;
    delete this._value.importStyle;
  }

  ['@kind']() {
    AbstractDoc.prototype['@kind'].call(this);
    if (this._value.kind) return;
    this._value.kind = this._node.kind;
  }

  ['@name']() {
    AbstractDoc.prototype['@name'].call(this);
    if (this._value.name) return;

    // normally `key.name`, but computed value(aka ['foo']) refers `key.value`.
    this._value.name = this._node.key.name || this._node.key.value;
  }

  ['@memberof']() {
    AbstractDoc.prototype['@memberof'].call(this);
    if (this._value.memberof) return;

    let memberof;
    let parent = this._node.parent;
    while (parent) {
      if (parent.type === 'ClassDeclaration' || parent.type === 'ClassExpression') {
        memberof = `${this._pathResolver.filePath}~${parent.id.name}`;
        this._value.memberof = memberof;
        return;
      }
      parent = parent.parent;
    }
  }

  ['@generator']() {
    super['@generator']();
    if ('generator' in this._value) return;

    this._value.generator = this._node.value.generator;
  }
}
