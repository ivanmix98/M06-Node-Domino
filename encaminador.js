function encaminar(manegadorPeticion, pathname) {
    console.log('preparat per encaminar una petició a ...' + pathname);
    if (typeof manegadorPeticion[pathname] === 'function') {
      return manegadorPeticion[pathname]();
    } else {
      console.log("No s'ha trobat manegador per a " + pathname);
      return "404 Not found";
    }
  }
  
  exports.encaminar = encaminar;