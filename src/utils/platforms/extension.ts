/*
 * @Author: W·S
 * @Date: 2022-02-22 10:40:35
 * @LastEditors: W·S
 * @LastEditTime: 2022-04-18 16:37:35
 * @Description:
 */

// @ts-ignore
import { ElMessage } from "@/plugins/element-ui";
export class ExtensionPlatform {
  platform = chrome;
  message(msg: string): void {
    ElMessage({
      message: msg,
      type: "success",
    });
  }
  i18n(el: string): string {
    if (el) {
      return this.platform.i18n.getMessage(el);
    }
    return "--";
  }
  async openWindow(_data: string): Promise<any> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const NOTIFICATION_WIDTH = 360;
      const NOTIFICATION_HEIGHT = 620;
      const _window: any = await this.getLastFocused({ populate: true });
      let tabs: any = {};
      _window.tabs.forEach((element: any) => {
        if (element.active) return (tabs = element);
      });
      this.setLocal("ddc_unSignData", {
        tabId: tabs.id,
        ddc_unSignData: _data,
      }).then(() => {
        this.platform.windows.create(
          {
            url: "popup.html",
            type: "popup",
            width: NOTIFICATION_WIDTH,
            height: NOTIFICATION_HEIGHT,
            left: _window.left + (_window.width - NOTIFICATION_WIDTH),
            top: _window.top,
          },
          (newWindow: any) => {
            const error = this.checkForError();
            if (error) {
              return reject(error);
            }
            return resolve(newWindow);
          }
        );
      });
    });
  }

  async setLocal(key: string, val: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.platform.storage.local.set({ [key]: val }, () => {
        const error = this.checkForError();
        if (error) {
          return reject(error);
        }
        return resolve("");
      });
    });
  }
  async getLocal(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.platform.storage.local.get([key], (result: any) => {
        const error = this.checkForError();
        if (error) {
          return reject(error);
        }
        return resolve(result[key]);
      });
    });
  }
  async removeLocal(key: string, callback?: Function): Promise<any> {
    return new Promise((resolve, reject) => {
      this.platform.storage.local.remove(key, () => {
        const error = this.checkForError();
        if (error) {
          return reject(error);
        }
        callback && callback();
        return resolve("");
      });
    });
  }
  async clearLocal(callback?: Function): Promise<any> {
    return new Promise((resolve, reject) => {
      this.platform.storage.local.clear(() => {
        const error = this.checkForError();
        if (error) {
          return reject(error);
        }
        callback && callback();
        return resolve("");
      });
    });
  }
  async getBackgroundPage(callback?: Function): Promise<any> {
    return new Promise((resolve, reject) => {
      this.platform.runtime.getBackgroundPage((backgroundPage: any) => {
        const error = this.checkForError();
        if (error) {
          return reject(error);
        }
        callback && callback(backgroundPage);
        return resolve(backgroundPage);
      });
    });
  }
  checkForError() {
    const { lastError } = this.platform.runtime;
    if (!lastError) {
      return undefined;
    }
    // if it quacks like an Error, its an Error
    if (lastError.stack && lastError.message) {
      return lastError;
    }
    // repair incomplete error object (eg chromium v77)
    return new Error(lastError.message);
  }
  async getLastFocused(queryOptions: any, callback?: Function): Promise<any> {
    return new Promise((resolve, reject) => {
      this.platform.windows.getLastFocused(queryOptions, (_window: any) => {
        const error = this.checkForError();
        if (error) {
          return reject(error);
        }
        return resolve(_window);
      });
    });
  }
}
