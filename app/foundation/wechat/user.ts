/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| 微信模板消息
|
*/

import BaseFoundation from '../base_foundation';

export default class User extends BaseFoundation {
  /**
   * 获取指定用户的详情
   *
   * @param {string} openId 普通用户的标识，对当前公众号唯一
   * @param {string} langType  返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语
   */
  public async get (openId: string, langType: string = 'zh_CN') {
    const params = {
      openid: openId,
      lang: langType,
    };

    const result = await this.ctx.foundation.wechat.request.get('user/info', { data: params });

    // 在底层将查询返回的 openid、groupid 转换一下
    result.open_id = result.openid;
    result.group_id = result.groupid;
    result.avatar = result.headimgurl;

    // 清除无用数据
    delete result.openid;
    delete result.groupid;
    delete result.headimgurl;

    return result;
  }

  /**
   * 获取多个用户的详情 [ 最多 100 ]
   *
   * @param {string[]} openIds 普通用户的标识，对当前公众号唯一
   * @param {string} lang  返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语
   */
  public async select (openIds: string[], langType: string = 'zh_CN') {
    return this.ctx.foundation.wechat.request.post('user/info/batchget', {
      data: {
        // 拼装微信需要的数据 docs: https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140839
        user_list: openIds.map((value) => {
          return { openid: value, lang: langType };
        }),
      },
    });
  }
}
