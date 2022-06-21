/*
 * @Author: W·S
 * @Date: 2022-03-23 11:25:53
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-26 19:50:00
 * @Description:
 */
/**
 * 助记词
 */
export interface MnemonicWords {
  type: string;
}
/**
 * 链账户信息
 * @export
 * @interface AccountInformation
 */
export interface AccountInformation {
  /**
   * 链账户地址
   * @type {string}
   * @memberof AccountInformation
   */
  account: string;
  /**
   * 私钥
   * @type {string}
   * @memberof AccountInformation
   */
  privatekey: string;
  /**
   * 链账户名称
   * @type {string}
   * @memberof AccountInformation
   */
  name: string;
  /**
   * 创建方式 import: 导入 , create: 创建
   * @type {string}
   * @memberof AccountInformation
   */
  type: string;
  /**
   * 算法
   * @type {string}
   * @memberof AccountInformation
   */
  uea: string;
  /**
   * 备注
   * @type {string}
   * @memberof AccountInformation
   */
  remark?: string;
  /**
   * 操作
   * @type {string}
   * @memberof AccountInformation
   */
  actions?: Array<string>;
}
/**
 * 用户信息
 * @export
 * @interface IFUserInfo
 */
export interface IFUserInfo {
  /**
   * 链框架
   * @type {string}
   * @memberof IFUserInfo
   */
  chain: string;
  /**
   * 链账户地址
   * @type {string}
   * @memberof IFUserInfo
   */
  chainKey: string;
  /**
   * 链账户名
   * @type {string}
   * @memberof IFUserInfo
   */
  chainName: string;
}
/**
 * 链账户信息
 */
export interface ChainInformation {
  type: string;
}
/**
 * 签名信息
 * @export
 * @interface SignInformation
 */
export interface SignInformation {
  tabId: string;
  data: {
    /**
     * 网站名
     * @type {string}
     * @memberof SignInformation
     */
    websiteName: string;
    /**
     * 链框架
     * @type {string}
     * @memberof SignInformation
     */
    chainFrame: string;
    /**
     * 链账户地址
     * @type {string}
     * @memberof SignInformation
     */
    chainAccount: string;
    /**
     * 待签名数据
     * @type {string}
     * @memberof SignInformation
     */
    signData: string;
  };
}

/**
 * 创建链账户信息
 * @export
 * @interface AdAccountInformation
 */
export interface AdAccountInformation {
  tabId: string;
  data: {
    /**
     * 网站名
     * @type {string}
     * @memberof AdAccountInformation
     */
    websiteName: string;
    /**
     * 链框架
     * @type {string}
     * @memberof AdAccountInformation
     */
    chainFrame: string;
    /**
     * 已选择的链账户地址
     * @type {string}
     * @memberof SignInformation
     */
    chainAccount: string;
  };
}
export interface ActionsFace {
  name: string;
  action: Function;
}
