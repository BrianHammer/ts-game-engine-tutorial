import { AssetManager } from "./assetManager";
import { IAsset } from "./IAsset";
import { IAssetLoader } from "./IAssetLoader";

// Similar interface tot IAsset, but specifies the data type of an htmlelement instead of any
export class ImageAsset implements IAsset {
  public readonly name: string;
  public readonly data: HTMLImageElement;

  public constructor(name: string, data: HTMLImageElement) {
    this.name = name;
    this.data = data;
  }

  get width(): number {
    return this.data.width;
  }
  get height(): number {
    return this.data.height;
  }
}

export class ImageAssetLoader implements IAssetLoader {
  public get supportedExtensions(): string[] {
    return ["png", "gif", "jpg"];
  }

  public loadAsset(assetName: string): void {
    let image: HTMLImageElement = new Image();
    image.onload = this.onImageLoaded.bind(this, assetName, image);

    //This immediately creates the request to get the asset
    image.src = assetName;
  }

  private onImageLoaded(assetName: string, image: HTMLImageElement): void {
    console.log(`onImageLoaded name: ${assetName}, image: ${image}`);

    let asset = new ImageAsset(assetName, image);
    AssetManager.onAssetLoaded(asset);
  }
}
