/*
 * @Author: Feix
 * @Date: 2022-03-17 16:21:45
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-18 16:37:59
 * @Description:
 */
import { i18n, unique, isEmpty, uuId } from "../../src/utils/tools";

beforeAll(() => {
  console.log("before:tools");
});

test("i18n", () => {
  expect(i18n("")).toEqual("--");
});

test("unique", () => {
  const arr = ["A", "A", "B", "B", "C"];
  const arr2 = ["A", "B", "C"];
  expect(unique(arr)).toEqual(arr2);
});

describe("isEmpty", () => {
  test("is true", () => {
    expect(isEmpty("")).toBeTruthy();
  });
  test("is false", () => {
    expect(isEmpty("1")).toBeFalsy();
  });
});

test("uuId", () => {
  expect(uuId()).toBeDefined();
});

afterAll(() => {
  console.log("after:tools");
});
