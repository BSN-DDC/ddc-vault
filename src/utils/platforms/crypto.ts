/*
 * @Author: W·S
 * @Date: 2022-03-15 17:15:02
 * @LastEditors: W·S
 * @LastEditTime: 2022-03-23 14:15:22
 * @Description:
 */
import sha256 from "crypto-js/sha256";
import { stringify } from "crypto-js/enc-hex";
import Utf8 from "crypto-js/enc-utf8";
import { encrypt, decrypt } from "crypto-js/aes";
import MD5 from "crypto-js/md5";

export function _md5(_val: string): string {
  return stringify(MD5(_val + _val));
}

export function _sha256(_val: string): string {
  return stringify(sha256(_val));
}

export function enCrypt(msg: string, msg1: string): string {
  return encrypt(msg, _sha256(msg1)).toString();
}

export function deCrypt(msg: string, msg1: string): string {
  return decrypt(msg, _sha256(msg1)).toString(Utf8);
}
