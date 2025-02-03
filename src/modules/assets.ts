export async function loadJSON(path: string): Promise<any> {
    const response = await fetch(path)
    return await response.json()
}

export async function loadImage(path: string): Promise<HTMLImageElement> {
    const image = new Image()
    image.src = path
    await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () => reject(new Error('Image failed to load'))
    })
    return image
}
