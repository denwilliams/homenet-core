interface WhenPromise<T> {
    catch<U>(onRejected?: (reason: any) => U | WhenPromise<U>): WhenPromise<U>;

    catch<U>(filter: (reason: any) => boolean, onRejected?: (reason: any) => U | WhenPromise<U>): WhenPromise<U>;

    // Make sure you test any usage of these overloads, exceptionType must
    // be a constructor with prototype set to an instance of Error.
    catch<U>(exceptionType: any, onRejected?: (reason: any) => U | WhenPromise<U>): WhenPromise<U>;

    finally(onFulfilledOrRejected: Function): WhenPromise<T>;

    ensure(onFulfilledOrRejected: Function): WhenPromise<T>;

    // inspect(): Snapshot<T>;

    yield<U>(value: U | WhenPromise<U>): WhenPromise<U>;

    else(value: T): WhenPromise<T>;
    orElse(value: T): WhenPromise<T>;

    tap(onFulfilledSideEffect: (value: T) => void): WhenPromise<T>;

    delay(milliseconds: number): WhenPromise<T>;

    timeout(milliseconds: number, reason?: any): WhenPromise<T>;

    with(thisArg: any): WhenPromise<T>;
    withThis(thisArg: any): WhenPromise<T>;

    otherwise<U>(onRejected?: (reason: any) => U | WhenPromise<U>): WhenPromise<U>;

    otherwise<U>(predicate: (reason: any) => boolean, onRejected?: (reason: any) => U | WhenPromise<U>): WhenPromise<U>;

    // Make sure you test any usage of these overloads, exceptionType must
    // be a constructor with prototype set to an instance of Error.
    otherwise<U>(exceptionType: any, onRejected?: (reason: any) => U | WhenPromise<U>): WhenPromise<U>;

    then<U>(onFulfilled: (value: T) => U | WhenPromise<U>, onRejected?: (reason: any) => U | WhenPromise<U>, onProgress?: (update: any) => void): WhenPromise<U>;

    // spread<T>(onFulfilled: _.Fn0<WhenPromise<T> | T>): WhenPromise<T>;
    // spread<A1, T>(onFulfilled: _.Fn1<A1, WhenPromise<T> | T>): WhenPromise<T>;
    // spread<A1, A2, T>(onFulfilled: _.Fn2<A1, A2, WhenPromise<T> | T>): WhenPromise<T>;
    // spread<A1, A2, A3, T>(onFulfilled: _.Fn3<A1, A2, A3, WhenPromise<T> | T>): WhenPromise<T>;
    // spread<A1, A2, A3, A4, T>(onFulfilled: _.Fn4<A1, A2, A3, A4, WhenPromise<T> | T>): WhenPromise<T>;
    // spread<A1, A2, A3, A4, A5, T>(onFulfilled: _.Fn5<A1, A2, A3, A4, A5, WhenPromise<T> | T>): WhenPromise<T>;

    done<U>(onFulfilled: (value: T) => void, onRejected?: (reason: any) => void): void;

    fold<U, V>(combine: (value1: T, value2: V) => U | WhenPromise<U>, value2: V | WhenPromise<V>): WhenPromise<U>;
}
