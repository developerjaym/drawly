import Model from "./modules/Model/Model.js";
import Controller from "./modules/Controller/Controller.js";
import View from "./modules/View/View.js";
import LocalStorageService from "./modules/Service/Storage/LocalStorageService.js";
import ShortCutManager from "./modules/View/ShortCut/ShortCutManager.js"
import JsonServerStorageService from "./modules/Service/Storage/JsonServerStorageService.js";

(async () => {
  // const storageService = new LocalStorageService();
  const storageService = new JsonServerStorageService();
  const savedData = await storageService.load();
  const model = new Model(savedData);
  const controller = new Controller(model);
  const view = new View(controller);
  model.subscribe(view);
  model.subscribe(storageService);

  new ShortCutManager(controller)
})();
