export class Category {
  constructor(
    public categoryParentId: number,
    public name: string,
    public simple: boolean,
    public score: number,
    public disposable: boolean,
    public disposableCapacity: number,
    public disposableDone: number,
    public deprecated: boolean,
    public userId: number,
    public id?: number,
  ) {

  }
}
