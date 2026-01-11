export interface Disposable {
  dispose(): void;
}

export class Registry implements Disposable {
  private objects: Set<any> = new Set();

  track<T extends { delete(): void }>(obj: T): T {
    this.objects.add(obj);
    return obj;
  }

  untrack<T extends { delete(): void }>(obj: T): void {
    this.objects.delete(obj);
  }

  dispose(): void {
    for (const obj of this.objects) {
      if (typeof obj.delete === 'function') {
        obj.delete();
      }
    }
    this.objects.clear();
  }
}
