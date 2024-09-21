import { Message } from "../messages/message";
import { IAsset } from "./IAsset";
import { IAssetLoader } from "./IAssetLoader";
import { ImageAssetLoader } from "./imageAssetLoader";

export const MESSAGE_ASSET_LOADER_ASSET_LOADED =
  "MESSAGE_ASSET_LOADER_ASSET_LOADED";

export class AssetManager {
  private static _loaders: IAssetLoader[] = [];
  private static _loadedAssets: { [name: string]: IAsset } = {};

  //This hides the constructor
  private constructor() {}

  public static initialize(): void {
    AssetManager._loaders.push(new ImageAssetLoader());
  }

  public static onAssetLoaded(asset: IAsset): void {
    AssetManager._loadedAssets[asset.name] = asset;

    Message.send(
      `${MESSAGE_ASSET_LOADER_ASSET_LOADED}::${asset.name}`,
      this,
      asset
    );
  }

  public static registerLoader(loader: IAssetLoader): void {
    AssetManager._loaders.push(loader);
  }

  public static loadAsset(assetName: string): void {
    let ext = assetName.split(".").pop().toLowerCase();
    for (let l of AssetManager._loaders) {
      if (l.supportedExtensions.indexOf(ext) !== -1) {
        l.loadAsset(assetName);
        return;
      }
    }

    console.warn(`Unable to load asset with extension .${ext} becasue there is no loader associated with it.`)
  }

  public static isAssetLoaded(name: string): boolean {
    return !!AssetManager._loadedAssets[name];
  }

  public static getAsset(name: string): IAsset {
    if (AssetManager.isAssetLoaded(name)) {
      return AssetManager._loadedAssets.name;
    } else {
      AssetManager.loadAsset(name);
    }

    return undefined;
  }
}
