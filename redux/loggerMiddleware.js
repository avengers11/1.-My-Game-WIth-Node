const loggerMiddleware = (store) => (next) => (action) => {
    console.log('Dispatching:', action);
    return next(action); // Continue the dispatching chain
  };
  
  module.exports = loggerMiddleware;
  