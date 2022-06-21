/*
 * @Author: Feix
 * @Date: 2022-02-25 10:26:41
 * @LastEditors: Feix
 * @LastEditTime: 2022-04-15 16:45:00
 * @Description: 获取助记词/私钥/账户
 */

const bip39 = require("bip39");
const hdkey = require("ethereumjs-wallet/hdkey");
const util = require("ethereumjs-util");
const Web3 = require("web3");

export class MnemonicAll {
  /**
   * 获取助记词
   * @returns 助记词
   */
  getMnemonic = (): string => {
    const mnemonic = bip39.generateMnemonic();
    return mnemonic;
  };

  isValidateMnemonic = (mnemonic: string): string => {
    return bip39.validateMnemonic(mnemonic);
  };

  /**
   * 通过助记词获取私钥
   * @param {string} mnemonic 助记词
   * @param {number} num 例：获取助记词的第一对私钥，即"m/44'/60'/0'/0/0"
   * 在应用中需枚举路径"m/44'/60'/0'/0/0"的最后一位0，可继续取值为0,1,2,3,4…
   * @returns 私钥
   */
  getPrivatekeyWithMnemonic = (mnemonic: string, num: number): string => {
    // 将助记词转成seed
    const seed = bip39.mnemonicToSeed(mnemonic);
    // 通过hdkey将seed生成HDWallet
    const hdWallet = hdkey.fromMasterSeed(seed);
    // 生成钱包中在m/44'/60'/0'/0/n路径的帐户的keypair。
    const derivePath = "m/44'/60'/0'/0/" + num;
    const key = hdWallet.derivePath(derivePath);
    // 获取私钥
    return util.bufferToHex(key._hdkey._privateKey);
  };

  /**
   * 通过私钥获取账户信息
   * @param {string} privatekey 私钥
   * @returns 账户信息
   */
  getAccountWithPrivatekey = (privatekey: string): string => {
    const web3 = new Web3("http://localhost:8545");
    // 通过私钥解锁账户
    const account = web3.eth.accounts.privateKeyToAccount(privatekey);
    // 将账户信息返回
    return account.address;
  };
}
