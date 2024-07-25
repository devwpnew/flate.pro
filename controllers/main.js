import imageController from "./images";
import productController from "./product";
import propertiesController from "./properties";
import rcController from "./rc";
import selectionsController from "./selections";
import selectionProductController from "./selection_product";
import usersController from "./users";
import agenciesController from "./agencies";
import citiesController from "./cities";
import areasController from "./areas";

const controllers = {
    product: productController,
    properties: propertiesController,
    rc: rcController,
    selections: selectionsController,
    selection_product: selectionProductController,
    image: imageController,
    users: usersController,
    agencies: agenciesController
    cities: citiesController,
    areas: areasController
}

export default controllers;