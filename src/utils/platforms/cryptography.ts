/*
 * @Author: W·S
 * @Date: 2022-03-07 19:46:34
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-16 23:13:00
 * @Description:
 */
import type {
  AccountInformation,
  AdAccountInformation,
  SignInformation,
} from "@/inter";
import { DDCPASSWORD, MNEMONIC, APPACCOUNTS, STATES } from "@/config";
import { ExtensionPlatform } from "./extension";
import { _md5, _sha256, enCrypt } from "./crypto";
const extension = new ExtensionPlatform();

export class DDCSDB {
  /* 密码 */
  async setPassW(val: string): Promise<any> {
    extension.setLocal(DDCPASSWORD, _md5(val));
    return _sha256(val);
  }
  async getPassW(): Promise<any> {
    return await extension.getLocal(DDCPASSWORD);
  }
  async remPassW(): Promise<any> {
    return await extension.removeLocal(DDCPASSWORD);
  }
  async checkPassW(val: string): Promise<boolean> {
    const paw = await this.getPassW();
    return paw === _md5(val);
  }

  /* 链账户 */
  async setDdcAcc(val: any): Promise<any> {
    return await extension.setLocal(APPACCOUNTS, val);
  }
  async getDdcAcc(): Promise<any> {
    return await extension.getLocal(APPACCOUNTS);
  }
  async remDdcAcc(): Promise<any> {
    return await extension.removeLocal(APPACCOUNTS);
  }
  storageChanged(callBack: Function) {
    extension.platform.storage.onChanged.addListener(function (
      changes: any,
      namespace: any
    ) {
      console.log(changes);
      callBack(changes, namespace);
    });
  }

  /* 助记词 */
  async setDdcMne(val: string, _val: string): Promise<any> {
    return await extension.setLocal(MNEMONIC, enCrypt(val, _val));
  }
  async getDdcMne(): Promise<any> {
    return await extension.getLocal(MNEMONIC);
  }
  async remDdcMne(): Promise<any> {
    return await extension.removeLocal(MNEMONIC);
  }
  /* 状态 */
  async setDdcSta(val: string): Promise<any> {
    return await extension.setLocal(STATES, val);
  }
  async getDdcSta(): Promise<any> {
    return await extension.getLocal(STATES);
  }
}
export function setDDCInfo(_val: AccountInformation): void {
  localStorage.setItem("ddc-info", JSON.stringify(_val));
}
export function getDDCInfo(): AccountInformation {
  const val: any = localStorage.getItem("ddc-info");
  return JSON.parse(val);
}
export function setDDCSign(_val: SignInformation): void {
  localStorage.setItem("ddc-sign", JSON.stringify(_val));
}
export function getDDCSign(): SignInformation {
  const val: any = localStorage.getItem("ddc-sign");
  return JSON.parse(val);
}
export function removeDDCSign(): void {
  localStorage.removeItem("ddc-sign");
}
export function setDDCAddAccount(_val: AdAccountInformation): void {
  localStorage.setItem("ddc-addAccount", JSON.stringify(_val));
}
export function getDDCAddAccount(): AdAccountInformation {
  const val: any = localStorage.getItem("ddc-addAccount");
  return JSON.parse(val);
}
export function removeDDCAddAccount(): void {
  localStorage.removeItem("ddc-addAccount");
}
