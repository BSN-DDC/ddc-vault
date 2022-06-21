/*
 * @Author: W·S
 * @Date: 2022-04-07 10:16:21
 * @LastEditors: W·S
 * @LastEditTime: 2022-06-07 13:26:16
 * @Description:
 */

const Web3 = require("web3");
import { Transaction } from "./Transaction";
const EthereumTx = require("ethereumjs-tx").Transaction;
import Common from "ethereumjs-common";
import { deCrypt, _sha256 } from "../platforms/crypto";

export class K1 {
  privateKey;
  txData: any;
  constructor(txData: any, privateKey: string) {
    this.txData = txData;
    this.privateKey = privateKey;
  }
  signWH(data: string): { code: number; data: string } {
    try {
      const customCommon = Common.forCustomChain(
        "mainnet",
        {
          name: "my-network",
          networkId: 5555,
          chainId: 5555,
        },
        "petersburg"
      );
      const pr = deCrypt(this.privateKey, _sha256(data));
      const privateKey = Web3.utils.hexToBytes(
        Web3.utils.isHexStrict(pr + "") ? pr : "0x" + pr
      );
      const rawTx = this.txData;
      for (const key in rawTx) {
        if (!Web3.utils.isHexStrict(rawTx[key] + "")) {
          if (!Web3.utils.isHex(rawTx[key] + ""))
            rawTx[key] = Web3.utils.toHex(rawTx[key] + "");
          else rawTx[key] = "0x" + rawTx[key];
        } else if (
          rawTx[key].indexOf("0x") !== 0 &&
          rawTx[key].indexOf("0X") !== 0
        ) {
          rawTx[key] = "0x" + rawTx[key];
        }
      }
      const tx = new EthereumTx(rawTx, { common: customCommon });
      tx.sign(privateKey);
      const serializedTx = tx.serialize();
      return {
        code: 0,
        data: "0x" + serializedTx.toString("hex"),
      };
    } catch (error: any) {
      console.error(error);
      return {
        code: 1,
        data: error.message,
      };
    }
  }
  signWC(data: string): { code: number; data: string } {
    try {
      const customCommon = Common.forCustomChain(
        "mainnet",
        {
          name: "my-network",
          networkId: 1223,
          chainId: 1223,
        },
        "petersburg"
      );
      const pr = deCrypt(this.privateKey, _sha256(data));
      const privateKey = Web3.utils.hexToBytes(
        Web3.utils.isHexStrict(pr + "") ? pr : "0x" + pr
      );
      const rawTx = this.txData;
      for (const key in rawTx) {
        if (!Web3.utils.isHexStrict(rawTx[key] + "")) {
          if (!Web3.utils.isHex(rawTx[key] + ""))
            rawTx[key] = Web3.utils.toHex(rawTx[key] + "");
          else rawTx[key] = "0x" + rawTx[key];
        } else if (
          rawTx[key].indexOf("0x") !== 0 &&
          rawTx[key].indexOf("0X") !== 0
        ) {
          rawTx[key] = "0x" + rawTx[key];
        }
      }
      const tx = new EthereumTx(rawTx, { common: customCommon });
      tx.sign(privateKey);
      const serializedTx = tx.serialize();
      return {
        code: 0,
        data: "0x" + serializedTx.toString("hex"),
      };
    } catch (error: any) {
      console.error(error);
      return {
        code: 1,
        data: error.message,
      };
    }
  }
  signTA(data: string): { code: number; data: string } {
    try {
      const keys = ["data", "extraData", "to"];
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        if (!Web3.utils.isHexStrict(this.txData[key] + "")) {
          if (!Web3.utils.isHex(this.txData[key] + ""))
            this.txData[key] = Web3.utils.toHex(this.txData[key] + "");
          else this.txData[key] = "0x" + this.txData[key];
        } else if (
          this.txData[key].indexOf("0x") !== 0 &&
          this.txData[key].indexOf("0X") !== 0
        ) {
          this.txData[key] = "0x" + this.txData[key];
        }
      }
      const transaction = new Transaction(this.txData);
      const privateKey = deCrypt(this.privateKey, _sha256(data));
      transaction.sign(privateKey);
      const serializedTx =
        "0x" + (transaction as any).serialize().toString("hex");
      return {
        code: 0,
        data: serializedTx,
      };
    } catch (error: any) {
      console.error(error);
      return {
        code: 1,
        data: error.message,
      };
    }
  }
  async sign(data: string) {
    try {
      console.log(Web3.eth);
      const pr = deCrypt(this.privateKey, _sha256(data));
      const web3 = new Web3("http://localhost:8545");
      return web3.eth.accounts.sign(this.txData, pr).signature;
    } catch (error: any) {
      return error.message;
    }
  }
}
