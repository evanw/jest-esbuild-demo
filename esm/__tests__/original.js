import * as sut from "../sut.js";
import { jest } from '@jest/globals';

test("spyOn", () => {
  expect(sut.foo()).toEqual("foo");
  jest.spyOn(sut, "foo").mockReturnValue("bar");
  expect(sut.foo()).toEqual("bar");
});
