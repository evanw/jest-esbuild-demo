const sut = require("../sut.js");

test("spyOn", () => {
  expect(sut.foo()).toEqual("foo");
  jest.spyOn(sut, "foo").mockReturnValue("bar");
  expect(sut.foo()).toEqual("bar");
});
