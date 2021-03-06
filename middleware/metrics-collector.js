const calculator = require('./calculator')

class Collector {
  constructor(){
    this.storage = {};

  }

  isRouteDefined(route, method, status){
    if(!this.storage[route]) return false;
    if(!this.storage[route][method]) return false;
    if(!this.storage[route][method][status]) return false;
    return true;
  }

  getRouteData(route, method, status) {
    if(this.isRouteDefined(route,method,status)){
        return this.storage[route][method][status];
    }
    return this.createRouteData(route, method, status);
  }

  isError(code){
    if(!code){
      status = 404;
    }
    if(code >= 400){
      return true;
    }
    return false;
  }

  createRouteData(route, method, status) {
    if(!this.storage[route]){
      this.storage[route] = {};
    }
    if(!this.storage[route][method]){
        this.storage[route][method] = {};
    }
    this.storage[route][method][status] = {};
    return this.storage[route][method][status];
  }

  getStatus(code){
    if(this.isError(code)){
      return 'error';
    }
    return 'success';
  }

  updateRouteData(routeData,route,method,status){
    this.storage[route][method][status] = routeData;
  }

  collect(route, method, code, responseTime) {
    let status = this.getStatus(code);
    let routeData = this.getRouteData(route,method, status);
    if(!routeData){
      return;
    }
    calculator.calc(routeData, responseTime);
    this.updateRouteData(routeData, route, method, status);
  }

  summary(){
    return this.storage;
  }
}


module.exports = Collector;
