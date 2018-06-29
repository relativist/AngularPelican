export class Category {
  constructor(
    public category_parent_id: number,
    public name: string,
    public simple: boolean,
    public score: number,
    public disposable: boolean,
    public disposable_capacity: number,
    public disposable_done: number,
    public deprecated: boolean,
    public userId: number,
    public id?: number,
  ) {

  }
}
