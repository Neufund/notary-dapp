const failableCallback = (resolve, reject) => (error, data) => {
  if (error) {
    reject(error);
  } else {
    resolve(data);
  }
};

const noErrorCallback = resolve => () => {
  resolve();
};

const toPromiseFactory = cb => (f, args, postCbArgs = []) => new Promise((resolve, reject) => {
  const cb = failableCallback(resolve, reject);
  if (Array.isArray(args)) {
    f(...args, cb, ...postCbArgs);
  } else if (args === undefined) {
    f(cb, ...postCbArgs);
  } else {
    f(args, cb, ...postCbArgs);
  }
});

const toPromise = toPromiseFactory(failableCallback);
const toPromiseNoError = toPromiseFactory(noErrorCallback);

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(val =>
            hasCanceled_ ? reject({ isCanceled: true }) : resolve(val),
        );
    promise.catch(error =>
            hasCanceled_ ? reject({ isCanceled: true }) : reject(error),
        );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

export {
    wait,
    toPromise,
    toPromiseNoError,
    makeCancelable,
};
