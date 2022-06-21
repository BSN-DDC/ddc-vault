/*
 * @Author: W·S
 * @Date: 2022-04-06 18:47:02
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-18 17:12:15
 * @Description:
 */
const keccak = require("keccak");
const secp256k1 = require("secp256k1");
const ethjsUtil = require("ethereumjs-util");
const Web3 = require("web3");
// @ts-ignore
import { v4 } from "uuid";
export class Transaction {
  raw: any;
  constructor(data: any) {
    data = data || {};
    const fields = [
      {
        name: "randomid",
        length: 32,
        allowLess: true,
        default: Buffer.from([]),
      },
      {
        name: "gasPrice",
        length: 32,
        allowLess: true,
        default: Buffer.from([]),
      },
      {
        name: "gasLimit",
        alias: "gas",
        length: 32,
        allowLess: true,
        default: Buffer.from([]),
      },
      {
        name: "blockLimit",
        length: 32,
        allowLess: true,
        default: Buffer.from([]),
      },
      {
        name: "to",
        allowZero: true,
        length: 20,
        default: Buffer.from([]),
      },
      {
        name: "value",
        length: 32,
        allowLess: true,
        default: Buffer.from([]),
      },
      {
        name: "data",
        alias: "input",
        allowZero: true,
        default: Buffer.from([]),
      },
      {
        name: "chainId",
        length: 32,
        allowLess: true,
        default: Buffer.from([]),
      },
      {
        name: "groupId",
        length: 32,
        allowLess: true,
        default: Buffer.from([]),
      },
      {
        name: "extraData",
        allowZero: true,
        default: Buffer.from([]),
      },
      {
        name: "v",
        length: 1,
        default: Buffer.from([0x1c]),
      },
      {
        name: "r",
        length: 32,
        allowLess: true,
        default: Buffer.from([]),
      },
      {
        name: "s",
        length: 32,
        allowLess: true,
        default: Buffer.from([]),
      },
    ];
    data.randomid = this.genRandomID();
    ethjsUtil.defineProperties(this, fields, data);
  }

  hash(): string {
    // backup original signature
    const rawCopy = this.raw.slice(0);
    // generate rlp params for hash
    const txRawForHash = this.raw.slice(0, this.raw.length - 3);
    // restore original signature
    this.raw = rawCopy.slice();
    // create hash
    return this.sha3(ethjsUtil.rlp.encode(txRawForHash), 256);
  }

  sha3(data: any, bits: any): string {
    data = this.toBuffer(data);
    const digestData = keccak("keccak" + bits)
      .update(data)
      .digest();
    return digestData;
  }

  toBuffer(data: any): any {
    if (!Buffer.isBuffer(data)) {
      if (Array.isArray(data)) {
        data = Buffer.from(data);
      } else if (typeof data === "string") {
        if (ethjsUtil.isHexPrefixed(data)) {
          data = Buffer.from(
            ethjsUtil.padToEven(ethjsUtil.stripHexPrefix(data)),
            "hex"
          );
        } else {
          data = Buffer.from(data, "hex");
        }
      } else if (Number.isInteger(data)) {
        data = ethjsUtil.intToBuffer(data);
      } else if (data === null || data === undefined) {
        data = Buffer.allocUnsafe(0);
      } else if (data.toArray) {
        data = Buffer.from(data.toArray());
      } else {
        data = Buffer.from(data);
        // throw new Error("invalid type");
      }
    }
    return data;
  }

  sign(privateKey: string): void {
    const privat = Buffer.from(Web3.utils.stripHexPrefix(privateKey), "hex");
    const msgHash = this.hash();
    const sig = this.ecsign(msgHash, privat);
    Object.assign(this, sig);
  }

  /**
   * Create sign data
   * @param {String} msgHash message hash
   * @param {String} privateKey private key
   * @return {Object} returns (v, r, s) for secp256k1
   */
  ecsign(msgHash: string, privateKey: Buffer): any {
    const ret: any = {};
    const sig = secp256k1.sign(msgHash, privateKey);
    ret.r = sig.signature.slice(0, 32);
    ret.s = sig.signature.slice(32, 64);
    ret.v = sig.recovery + 27;
    return ret;
  }

  genRandomID(): string {
    let uuid = v4();
    uuid = uuid.replace(/-/g, "");
    if (!uuid.startsWith("0x")) {
      uuid = "0x" + uuid;
    }
    return uuid;
  }
}
