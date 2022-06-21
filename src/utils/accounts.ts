/*
 * @Author: Feix
 * @Date: 2022-03-16 10:44:30
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-21 15:37:13
 * @Description: 账户信息
 */
import { i18n } from "@/utils/tools";
import { SECPK1, UEALIST } from "@/config";
import { MnemonicAll } from "@/utils/algorithm/mnemonicAll";
import { enCrypt } from "@/utils/platforms/crypto";
import { DDCSDB } from "@/utils/platforms/cryptography";
import { AccountInformation } from "@/inter";

const mnemonicAll = new MnemonicAll();
const ddcsdb = new DDCSDB();

/**
 * 生成账户信息
 * @param el { privatekey:私钥, hash:哈希, index:账户序号, uea:算法, type:创建方式}
 * @returns
 */
const getAccountData = (el: {
  accountName: string;
  privatekey: string;
  hash: string;
  uea: string;
  type: string;
}): AccountInformation => {
  let iAccount = "";
  // k1 :通过私钥获取账户信息
  if (el.uea == SECPK1) {
    iAccount = mnemonicAll.getAccountWithPrivatekey(el.privatekey);
  }
  const param: AccountInformation = {
    account: iAccount.toLowerCase(),
    privatekey: enCrypt(el.privatekey, el.hash),
    name: el.accountName,
    type: el.type,
    uea: el.uea,
  };
  return param;
};

/**
 * 通过私钥导入账户信息
 * @param el { accountName:账户名称,privatekey:私钥, hash:哈希, uea:算法}
 * @returns
 */
export const importAccounts = (el: {
  accountName: string;
  privatekey: string;
  hash: string;
  uea: string;
}): AccountInformation => {
  return getAccountData({
    accountName: el.accountName,
    privatekey: el.privatekey,
    hash: el.hash,
    uea: el.uea,
    type: "import",
  });
};

/**
 * 创建账户信息
 * @param el { accountName:账户名称,mnemonic:助记词, hash:哈希, index:账户序号, uea:算法}
 * @returns
 */
export const createAccounts = (el: {
  accountName: string;
  mnemonic: string;
  hash: string;
  index: number;
  uea: string;
}): AccountInformation => {
  let privatekey = "";
  // k1 :通过助记词获取私钥
  if (el.uea == SECPK1) {
    privatekey = mnemonicAll.getPrivatekeyWithMnemonic(el.mnemonic, el.index);
  }
  return getAccountData({
    accountName: el.accountName,
    privatekey,
    hash: el.hash,
    uea: el.uea,
    type: "create",
  });
};

/**
 * 账户初始化
 * @param mnemonic 助记词
 * @param hash 哈希
 * @returns
 */
export const initAccounts = async (
  mnemonic: string,
  hash: string
): Promise<any> => {
  // 存储助记词
  await ddcsdb.setDdcMne(mnemonic, hash);

  let accList: Array<AccountInformation> = [];
  await ddcsdb.remDdcAcc();
  const iaccList: Array<AccountInformation> = await ddcsdb.getDdcAcc();

  if (iaccList) {
    accList = iaccList;
  }
  // 获取算法列表
  for (let index = 0; index < UEALIST.length; index++) {
    const uea = UEALIST[index];
    // 创建账户信息
    const param: AccountInformation = createAccounts({
      accountName: i18n("DDC_Box_1038") + 0,
      mnemonic: mnemonic,
      hash: hash,
      index: 0,
      uea: uea,
    });
    accList.push(param);
  }
  // 按算法存储账户信息 每个算法默认生成一条记录
  await ddcsdb.setDdcAcc(accList);
};
