# Jest + esbuild demo

_This repo was created as an example for a discussion in this thread: https://github.com/evanw/esbuild/issues/412._

This repo demonstrates that running Jest on the original source code is equivalent to running Jest on the source code bundled with esbuild. Since Jest's `spyOn` function works with CommonJS but doesn't work with ESM, running Jest on the code after bundling it with esbuild also works with CommonJS but doesn't work with ESM. This is because esbuild intentionally matches node's behavior.

## CommonJS

Jest's `spyOn` function works with node's CommonJS support, so it also works with esbuild's CommonJS support:

```sh
$ npm ci
$ npm run test:cjs

> test:cjs
> npm run build:cjs; cd ./cjs; node ../node_modules/.bin/jest


> build:cjs
> ./node_modules/.bin/esbuild --bundle ./cjs/__tests__/original.js --format=cjs --outfile=./cjs/__tests__/compiled.js

 PASS  __tests__/original.js
 PASS  __tests__/compiled.js

Test Suites: 2 passed, 2 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.828 s, estimated 1 s
Ran all test suites.
```

## ESM

Jest's `spyOn` function doesn't work with node's ESM support, so it also doesn't work with esbuild's ESM support:

```sh
$ npm ci
$ npm run test:esm

> test:esm
> npm run build:esm; cd ./esm; node --experimental-vm-modules ../node_modules/.bin/jest


> build:esm
> ./node_modules/.bin/esbuild --bundle ./esm/__tests__/original.js --format=esm --outfile=./esm/__tests__/compiled.js --external:@jest/globals

(node:35164) ExperimentalWarning: VM Modules is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
 FAIL  __tests__/original.js
  ● spyOn

    TypeError: object.hasOwnProperty is not a function

      4 | test("spyOn", () => {
      5 |   expect(sut.foo()).toEqual("foo");
    > 6 |   jest.spyOn(sut, "foo").mockReturnValue("bar");
        |        ^
      7 |   expect(sut.foo()).toEqual("bar");
      8 | });
      9 |

      at ModuleMockerClass.spyOn (../node_modules/jest-mock/build/index.js:801:36)
      at Object.<anonymous> (__tests__/original.js:6:8)

 FAIL  __tests__/compiled.js
  ● spyOn

    TypeError: Cannot redefine property: foo
        at Function.defineProperty (<anonymous>)

      18 | test("spyOn", () => {
      19 |   expect(foo()).toEqual("foo");
    > 20 |   jest.spyOn(sut_exports, "foo").mockReturnValue("bar");
         |        ^
      21 |   expect(foo()).toEqual("bar");
      22 | });
      23 |

      at ModuleMockerClass.spyOn (../node_modules/jest-mock/build/index.js:826:16)
      at Object.<anonymous> (__tests__/compiled.js:20:8)

Test Suites: 2 failed, 2 total
Tests:       2 failed, 2 total
Snapshots:   0 total
Time:        0.848 s, estimated 1 s
Ran all test suites.
```
