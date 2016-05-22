interface IQPromise<T> {
    then<U>(onFulfill?: (value: T) => U | IQPromise<U>, onReject?: (error: any) => U | IQPromise<U>): IQPromise<U>;
}

interface QPromise<T> {
    /**
     * Like a finally clause, allows you to observe either the fulfillment or rejection of a promise, but to do so without modifying the final value. This is useful for collecting resources regardless of whether a job succeeded, like closing a database connection, shutting a server down, or deleting an unneeded key from an object.

     * finally returns a promise, which will become resolved with the same fulfillment value or rejection reason as promise. However, if callback returns a promise, the resolution of the returned promise will be delayed until the promise returned from callback is finished.
     */
    fin(finallyCallback: () => any): QPromise<T>;
    /**
     * Like a finally clause, allows you to observe either the fulfillment or rejection of a promise, but to do so without modifying the final value. This is useful for collecting resources regardless of whether a job succeeded, like closing a database connection, shutting a server down, or deleting an unneeded key from an object.

     * finally returns a promise, which will become resolved with the same fulfillment value or rejection reason as promise. However, if callback returns a promise, the resolution of the returned promise will be delayed until the promise returned from callback is finished.
     */
    finally(finallyCallback: () => any): QPromise<T>;

    /**
     * The then method from the Promises/A+ specification, with an additional progress handler.
     */
    then<U>(onFulfill?: (value: T) => U | IQPromise<U>, onReject?: (error: any) => U | IQPromise<U>, onProgress?: Function): QPromise<U>;

    /**
     * Like then, but "spreads" the array into a variadic fulfillment handler. If any of the promises in the array are rejected, instead calls onRejected with the first rejected promise's rejection reason.
     *
     * This is especially useful in conjunction with all
     */
    spread<U>(onFulfill: (...args: any[]) => IQPromise<U> | U, onReject?: (reason: any) => IQPromise<U> | U): QPromise<U>;

    fail<U>(onRejected: (reason: any) => U | IQPromise<U>): QPromise<U>;

    /**
     * A sugar method, equivalent to promise.then(undefined, onRejected).
     */
    catch<U>(onRejected: (reason: any) => U | IQPromise<U>): QPromise<U>;

    /**
     * A sugar method, equivalent to promise.then(undefined, undefined, onProgress).
     */
    progress(onProgress: (progress: any) => any): QPromise<T>;

    /**
     * Much like then, but with different behavior around unhandled rejection. If there is an unhandled rejection, either because promise is rejected and no onRejected callback was provided, or because onFulfilled or onRejected threw an error or returned a rejected promise, the resulting rejection reason is thrown as an exception in a future turn of the event loop.
     *
     * This method should be used to terminate chains of promises that will not be passed elsewhere. Since exceptions thrown in then callbacks are consumed and transformed into rejections, exceptions at the end of the chain are easy to accidentally, silently ignore. By arranging for the exception to be thrown in a future turn of the event loop, so that it won't be caught, it causes an onerror event on the browser window, or an uncaughtException event on Node.js's process object.
     *
     * Exceptions thrown by done will have long stack traces, if Q.longStackSupport is set to true. If Q.onerror is set, exceptions will be delivered there instead of thrown in a future turn.
     *
     * The Golden Rule of done vs. then usage is: either return your promise to someone else, or if the chain ends with you, call done to terminate it.
     */
    done(onFulfilled?: (value: T) => any, onRejected?: (reason: any) => any, onProgress?: (progress: any) => any): void;

    /**
     * If callback is a function, assumes it's a Node.js-style callback, and calls it as either callback(rejectionReason) when/if promise becomes rejected, or as callback(null, fulfillmentValue) when/if promise becomes fulfilled. If callback is not a function, simply returns promise.
     */
    nodeify(callback: (reason: any, value: any) => void): QPromise<T>;

    /**
     * Returns a promise to get the named property of an object. Essentially equivalent to
     *
     * promise.then(function (o) {
     *     return o[propertyName];
     * });
     */
    get<U>(propertyName: String): QPromise<U>;
    set<U>(propertyName: String, value: any): QPromise<U>;
    delete<U>(propertyName: String): QPromise<U>;
    /**
     * Returns a promise for the result of calling the named method of an object with the given array of arguments. The object itself is this in the function, just like a synchronous method call. Essentially equivalent to
     *
     * promise.then(function (o) {
     *     return o[methodName].apply(o, args);
     * });
     */
    post<U>(methodName: String, args: any[]): QPromise<U>;
    /**
     * Returns a promise for the result of calling the named method of an object with the given variadic arguments. The object itself is this in the function, just like a synchronous method call.
     */
    invoke<U>(methodName: String, ...args: any[]): QPromise<U>;
    fapply<U>(args: any[]): QPromise<U>;
    fcall<U>(...args: any[]): QPromise<U>;

    /**
     * Returns a promise for an array of the property names of an object. Essentially equivalent to
     *
     * promise.then(function (o) {
     *     return Object.keys(o);
     * });
     */
    keys(): QPromise<string[]>;

    /**
     * A sugar method, equivalent to promise.then(function () { return value; }).
     */
    thenResolve<U>(value: U): QPromise<U>;
    /**
     * A sugar method, equivalent to promise.then(function () { throw reason; }).
     */
    thenReject(reason: any): QPromise<T>;

    /**
     * Attaches a handler that will observe the value of the promise when it becomes fulfilled, returning a promise for that same value, perhaps deferred but not replaced by the promise returned by the onFulfilled handler.
     */
    tap(onFulfilled: (value: T) => any): QPromise<T>;

    timeout(ms: number, message?: string): QPromise<T>;
    /**
     * Returns a promise that will have the same result as promise, but will only be fulfilled or rejected after at least ms milliseconds have passed.
     */
    delay(ms: number): QPromise<T>;

    /**
     * Returns whether a given promise is in the fulfilled state. When the static version is used on non-promises, the result is always true.
     */
    isFulfilled(): boolean;
    /**
     * Returns whether a given promise is in the rejected state. When the static version is used on non-promises, the result is always false.
     */
    isRejected(): boolean;
    /**
     * Returns whether a given promise is in the pending state. When the static version is used on non-promises, the result is always false.
     */
    isPending(): boolean;

    valueOf(): any;

    /**
     * Returns a "state snapshot" object, which will be in one of three forms:
     *
     * - { state: "pending" }
     * - { state: "fulfilled", value: <fulfllment value> }
     * - { state: "rejected", reason: <rejection reason> }
     */
    // inspect(): PromiseState<T>;
}
