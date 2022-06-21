/*
 * @Author: Feix
 * @Date: 2022-03-17 16:21:45
 * @LastEditors: Feix
 * @LastEditTime: 2022-03-18 13:53:10
 * @Description:
 */
import { MnemonicAll } from "../../src/utils/algorithm/mnemonicAll";
const iMnemonicAll = new MnemonicAll();

test("getMnemonic", () => {
  expect(iMnemonicAll.getMnemonic()).toBeDefined();
});

// wear sad various swear only innocent rack garden spice dismiss float still wish plunge parent
// Path:m/44'/60'/0'/0/0
// Address:0x3AD700749D8c1779e54f2063685113326579D0B0
// Public Key:0x0253af9dbec9808b0d1887b77a61e29fa12db339ed4b99f8d176d9239f2fbfe2f3
// Private Key:0x01f00583e581918f1dbd2b7d45eafe8ef7f1925d7a58166c7db098887aa7975c

test("getAccountWithPrivatekey", () => {
  expect(
    iMnemonicAll.getAccountWithPrivatekey(
      "0x01f00583e581918f1dbd2b7d45eafe8ef7f1925d7a58166c7db098887aa7975c"
    )
  ).toBeDefined();
});
