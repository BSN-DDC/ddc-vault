/*
 * @Author: Yu Mengxin
 * @Date: 2022-03-23 15:34:36
 * @LastEditors: W·S
 * @LastEditTime: 2022-05-19 14:35:36
 * @FilePath: /ddcvault/src/api/DDCQuery.ts
 * @Description:
 *
 */
import type {
  InDdcSearchControllerDetail,
  InDdcSearchControllerSearchTransferBlock,
  RequestPageInfoInDdcSearchControllerDetail,
  RequestPageInfoInDdcSearchControllerSearchesDdc,
  RequestPageInfoInDdcSearchControllerSearchesTransfer,
  ResultInfoOutDdcSearchControllerDdcDetail,
  ResultInfoOutDdcSearchControllerSearchTransferBlock,
  ResultInfoPageListOutDdcSearchControllerDdcOwnerDetail,
  ResultInfoPageListOutDdcSearchControllerSearchesDdc,
  ResultInfoPageListOutDdcSearchControllerSearchesTransfer,
} from "./api_inter";
import Service from "@/plugins/axios";
import { XAPITOKEN } from "@/config";

/**
 * 查询DDC列表
 */
export async function getDDCList(
  params: RequestPageInfoInDdcSearchControllerSearchesDdc
): Promise<ResultInfoPageListOutDdcSearchControllerSearchesDdc> {
  const url = "/ddcportal/anon/v1/ddcsearch/ddc/searches";
  const res: ResultInfoPageListOutDdcSearchControllerSearchesDdc =
    await Service.post(url, params, { headers: { xapitoken: XAPITOKEN } });
  return res;
}
/**
 * 查询DDC详情
 */
export async function getDDCDetail(
  params: InDdcSearchControllerDetail
): Promise<ResultInfoOutDdcSearchControllerDdcDetail> {
  const url = "/ddcportal/anon/v1/ddcdetail/ddc/detail";
  const res: ResultInfoOutDdcSearchControllerDdcDetail = await Service.post(
    url,
    params,
    { headers: { xapitoken: XAPITOKEN } }
  );
  return res;
}

/**
 * 查询链账户地址
 */
export async function getDDCAccountAddress(
  params: RequestPageInfoInDdcSearchControllerDetail
): Promise<ResultInfoPageListOutDdcSearchControllerDdcOwnerDetail> {
  const url = "/ddcportal/anon/v1/ddcdetail/ddc/ownerdetail";
  const res: ResultInfoPageListOutDdcSearchControllerDdcOwnerDetail =
    await Service.post(url, params, { headers: { xapitoken: XAPITOKEN } });
  return res;
}

/**
 * 查询DDC流转记录
 */
export async function getTransferList(
  params: RequestPageInfoInDdcSearchControllerSearchesTransfer
): Promise<ResultInfoPageListOutDdcSearchControllerSearchesTransfer> {
  const url = "/ddcportal/anon/v1/ddcdetail/transfer/searches";
  const res: ResultInfoPageListOutDdcSearchControllerSearchesTransfer =
    await Service.post(url, params, { headers: { xapitoken: XAPITOKEN } });
  return res;
}

/**
 * 查询DDC流转区块交易信息
 */
export async function getTransferBlockInfo(
  params: InDdcSearchControllerSearchTransferBlock
): Promise<ResultInfoOutDdcSearchControllerSearchTransferBlock> {
  const url = "/ddcportal/anon/v1/ddcdetail/transfer/block/search";
  const res: ResultInfoOutDdcSearchControllerSearchTransferBlock =
    await Service.post(url, params, { headers: { xapitoken: XAPITOKEN } });
  return res;
}
