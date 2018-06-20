export class Category {
  constructor(
    public category_parent_id: string,
    public name: string,
    public daily: boolean,
    public score: number,
    public disposable: boolean,
    public disposable_capacity: number,
    public disposable_done: number,
    public id?: number,
  ) {

  }
}
