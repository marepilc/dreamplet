import CanvasKitInit, { type CanvasKit } from 'canvaskit-wasm/full';

let ck: CanvasKit | null = null;

export async function loadCanvasKit(): Promise<CanvasKit> {
  if (ck) return ck;
  
  // @ts-ignore
  const init = typeof CanvasKitInit === 'function' ? CanvasKitInit : CanvasKitInit.default;

  ck = await init({
    locateFile: (file: string) => `https://unpkg.com/canvaskit-wasm@0.40.0/bin/full/${file}`
  });
  
  return ck!;
}

export function getCanvasKit(): CanvasKit {
  if (!ck) {
    throw new Error('CanvasKit not loaded. Call loadCanvasKit() first.');
  }
  return ck;
}
