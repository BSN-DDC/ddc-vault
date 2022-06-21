/*
 * @Author: W·S
 * @Date: 2022-03-02 15:23:16
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-16 16:55:57
 * @Description:
 */
import type { AccountInformation } from "./inter";
import { ExtensionPlatform } from "@/utils/platforms/extension";
import { setDDCInfo } from "./utils/platforms/cryptography";
const extension = new ExtensionPlatform();

export const XAPITOKEN = "7284e96ad0ba47d1bc97b0a384dc49ab";

/**
 * k1 算法
 * @type {string}
 */
export const SECPK1 = "secp256k1";

/**
 * 密码
 * @type {string}
 */
export const DDCPASSWORD = "DDCPASSWORD";

/**
 * 账户助记词
 * @type {string}
 */
export const MNEMONIC = "MNEMONIC";

/**
 * 链账户
 * @type {string}
 */
export const APPACCOUNTS = "APPACCOUNTS";

/**
 * 登录状态
 * @type {string}
 */
export const STATES = "STATES";

/**
 * 算法
 * @type {Array}
 */
export const UEALIST = [SECPK1];

/**
 * 武汉链
 * @type {string}
 */
export const CHAINSID_WH = "4";

/**
 * 泰安链
 * @type {string}
 */
export const CHAINSID_TA = "3";

/**
 * 文昌链
 * @type {string}
 */
export const CHAINSID_WC = "2";

/**
 * 算法下的框架
 * @type {Object}
 */
export const UEACHAIN = {
  [SECPK1]: [
    {
      name: "DDC_Box_4001",
      id: CHAINSID_WH,
    },
    {
      name: "DDC_Box_4002",
      id: CHAINSID_TA,
    },
    {
      name: "DDC_Box_4003",
      id: CHAINSID_WC,
    },
  ],
};

/**
 * 操作按钮
 * @type {Object}
 */
export const ACTIONSTYPE = {
  createAccount: "createAccount",
  importAccount: "importAccount",
  showMnemonic: "showMnemonic",
  // *********** //
  toSign: "toSign",
  showKey: "showKey",
  edit: "edit",
};

/**
 * 首页按钮列表
 * @type {Array}
 */
export const ACTIONS = [
  {
    name: "DDC_Box_2027",
    action: (_account: AccountInformation, callback: Function): void => {
      callback(ACTIONSTYPE.toSign, _account, "DDC_Box_2027");
    },
  },
  {
    name: "DDC_Box_2008",
    action: (_account: AccountInformation, callback: Function): void => {
      callback(ACTIONSTYPE.showKey, _account, "DDC_Box_2008");
    },
  },
  {
    name: "DDC_Box_2053",
    action: (_account: AccountInformation, callback: Function): void => {
      callback(ACTIONSTYPE.edit, _account, "DDC_Box_2053");
    },
  },
  {
    name: "DDC_Box_9001",
    action: (_account: AccountInformation): void => {
      setDDCInfo(_account);
      window.open(
        extension.platform.runtime.getURL("bsn-ddc.html#/bsn-ddc/ddc-home")
      );
    },
  },
];
