import { CanvasKit } from 'canvaskit-wasm';
import { getCanvasKit } from './loader';

export abstract class Primitive {
  x: number = 0;
  y: number = 0;
  scale: number = 1;
  rotation: number = 0;
  color: string = '#000000';
  
  protected ck: CanvasKit;

  constructor() {
    this.ck = getCanvasKit();
  }

  abstract draw(canvas: any): void;

  protected parseColor(color: string) {
    return this.ck.parseColorString(color);
  }
}

export class Circle extends Primitive {
  radius: number = 50;

  constructor(x: number, y: number, radius: number, color: string) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw(canvas: any): void {
    const paint = new this.ck.Paint();
    paint.setColor(this.parseColor(this.color));
    paint.setAntiAlias(true);
    
    canvas.save();
    canvas.translate(this.x, this.y);
    canvas.rotate(this.rotation, 0, 0);
    canvas.scale(this.scale, this.scale);
    
    canvas.drawCircle(0, 0, this.radius, paint);
    
    canvas.restore();
    paint.delete();
  }
}

export class Rect extends Primitive {
  width: number = 100;
  height: number = 100;

  constructor(x: number, y: number, width: number, height: number, color: string) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw(canvas: any): void {
    const paint = new this.ck.Paint();
    paint.setColor(this.parseColor(this.color));
    paint.setAntiAlias(true);

    canvas.save();
    canvas.translate(this.x, this.y);
    canvas.rotate(this.rotation, 0, 0);
    canvas.scale(this.scale, this.scale);

    const rect = this.ck.LTRBRect(0, 0, this.width, this.height);
    canvas.drawRect(rect, paint);

    canvas.restore();
    paint.delete();
  }
}

export class Path extends Primitive {
  private svgPath: string = '';

  constructor(x: number, y: number, svgPath: string, color: string) {
    super();
    this.x = x;
    this.y = y;
    this.svgPath = svgPath;
    this.color = color;
  }

  draw(canvas: any): void {
    const paint = new this.ck.Paint();
    paint.setColor(this.parseColor(this.color));
    paint.setAntiAlias(true);

    const path = this.ck.Path.MakeFromSVGString(this.svgPath);
    if (path) {
      canvas.save();
      canvas.translate(this.x, this.y);
      canvas.rotate(this.rotation, 0, 0);
      canvas.scale(this.scale, this.scale);

      canvas.drawPath(path, paint);

      canvas.restore();
      path.delete();
    }
    paint.delete();
  }
}
