import imageController from "./images";
import productController from "./product";
import propertiesController from "./properties";
import rcController from "./rc";
import selectionsController from "./selections";
import selectionProductController from "./selection_product";
import usersController from "./users";

const controllers = {
    product: productController,
    properties: propertiesController,
    rc: rcController,
    selections: selectionsController,
    selection_product: selectionProductController,
    image: imageController,
    users: usersController
}

export default controllers;