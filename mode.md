###### MemberOrderBean 订单Model
 |属性|名称|类型|备注|
 |:----:|:----:|:----:|:----:|
 |artifactId|项目编号|STRING||
 |versionId|产品当前的版本号|STRING||
 |bcbh|本厂编号|STRING||
 |productType|产品类型|STRING||
 |hdiLevel|HDI阶数|INT||
 |miId|MI编号|STRING||
 |username|客户编号|STRING||
 |projectName|原稿资料文件名|STRING||
 |pcsX|pcs尺寸x|FLOAT||
 |pcsY|pcs尺寸y|FLOAT||
 |setPs|拼版款数|INT||
 |cs|层数|STRING||
 |gkcl|过孔处理|STRING||
 |projectStatus|状态|INT|0:已作废 1:初始化 2:已经核准有效的 |
 |creator|创建人|STRING||
 |zfPerson|作废人|STRING||
 |gmtZf|作废时间|DATETIME||
 |isoperate|文件的评审状态|BOOLEAN|false:否 true:是|
 |minld|最小线距|FLOAT||
 |minlw|最小线宽|FLOAT||
 |minhole|最小孔径|FLOAT||
 |minPad|过孔PAD|FLOAT||
 |holeCount|孔数|INT||
 |holeDensity|孔密度数据|FLOAT||
 |bga|是否有bga|FLOAT||
 |halfhole|是否有半孔|BOOLEAN|false:否 true:是|
 |blindhole|是否有盲孔|INT||
 |impedance|是否有阻抗|BOOLEAN|false:否 true:是|
 |note|备注|STRING||
 |gmtCreate|创建时间|DATETIME||
 |gmtUpdate|修改时间|DATETIME||
 |fileId|原稿资料|STRING||
 |camFileId|已处理后的文件|STRING||
 |type|文件的类型|STRING||
 |orderBatch|订单批号|INT||
 |testPoint|测试点数|INT||
 |traceLayerName|线路层名|STRING||
 |traceImages|线路层图像数据|STRING||
 |numPerPb|单拼版SET数量|INT||
 |status|状态|INT|0:作废 1:未审核 2:审核通过 3:审核失败 4:投入生产 5:已发货 6:交易成功 |
 |quoteId|报价单编号|STRING||
 |unitPrice|单价|FLOAT||
 |chargeType|单价类型|INT||
 |jhfs|交货方式|STRING||
 |projectMakeUp|是否工程处理拼版|BOOLEAN|false:否 true:是|
 |singleArea|单个面积|FLOAT||
 |orderWeight|订单重量|FLOAT||
 |setX|set尺寸x|FLOAT||
 |setY|set尺寸y|FLOAT||
 |setStyle|拼版样式|STRING||
 |khxh|客户型号|STRING||
 |coNo|客户单号|STRING||
 |bcbhType|订单类型|STRING||
 |preferential|优惠金额|FLOAT||
 |totalprice|总金额|FLOAT||
 |num|需求数量|INT||
 |pcsNum|pcs数量|INT||
 |isfd|是否返单|INT|0:新单 1:返单无改 2:返单有改 |
 |bccl|板材材料|STRING||
 |bh|板厚|STRING||
 |cxfs|成型方式|STRING||
 |csfs|测试方式|STRING||
 |gy|表面处理|STRING||
 |fontColor|文字颜色|STRING||
 |zhColor|阻焊颜色|STRING||
 |fontCss|文字样式|STRING||
 |ddxq|订单需求|STRING||
 |jjType|交货时间|STRING||
 |bcgys|板材品牌|STRING||
 |wcth|外层铜厚|STRING||
 |ncth|内层铜厚|STRING||
 |zhCss|阻焊样式|STRING||
 |drxs|导热系数|FLOAT||
 |boardParameter|板材参数|STRING||
 |auditContent|审核内容|STRING||
 |gmtAudit|审核时间|DATETIME||
 |auditPerson|审核人id|STRING||
 |invoiceType|开票类型|STRING||
 |taxFee|税费|FLOAT||
 |processEdges|工艺边|STRING||
 |processEdgesWidth|工艺边宽度|INT||
 |bhTolerance|板厚公差|STRING||
 |vcut|v割|STRING||
 |imGoldThinckness|沉金厚度|STRING||
 |addressId|地址|INT||
 |goldfinger|是否有金手指|BOOLEAN|false:否 true:是|
 |lazyParseAndQuote|是否进行文件解析|BOOLEAN|false:否 true:是|
 |deliveryType|发货类型|STRING||
 |province|所在省份|STRING||
 |shipping|运费|FLOAT||
 |orderAgent|所属客服编号|STRING||
 |processNote|业务员备注|STRING||
 |payMethod|收款方式|STRING||
 |gmtQuoteExpire|报价有效期|DATETIME||
 |proid|周期|STRING||
 |hasUL|是否有UL|BOOLEAN|false:否 true:是|
 |impedancePair|阻抗组数|INT||
 |urgent|是否加急|BOOLEAN|false:否 true:是|
 |acceptX|接受打X|BOOLEAN|false:否 true:是|
 |deliveryPay|货款代收|BOOLEAN|false:否 true:是|
 |toPay|快递到付|BOOLEAN|false:否 true:是|
 |ciCode|客户物品编码|STRING||
 |packaging|包装要求|STRING||
 |country|国家|STRING||
 |billId|所属账单Id|STRING||
 |orderId|订单号|STRING||
 |inTrash|是否在回收站|BOOLEAN|false:否 true:是|
 |contractId|合同id|STRING||
 |gmtJh|交货日期|DATETIME||
 |send|已发数量PCS|INT||
 |feed|是否是补料|BOOLEAN|false:否 true:是|
 |setCount|SET数|INT||
 |city|城市|STRING||
 |receiveAddress|收货地址|STRING||
 |receiveName|收货人姓名|STRING||
 |receivePhone|收货电话|STRING||
 |receiveMobile|收货手机|STRING||
 |receiveZipcode|收货邮编|STRING||
 |gmtStart|投产时间/下单时间|DATETIME||
 |gmtSent|发货时间|DATETIME||
 |gmtCompleted|完成时间|DATETIME||
 |confirmor|确认完成员工ID|STRING||
 |companyName|客户公司名称|STRING||
 |flowSwitch|流程开关|INT|0: 1:全部暂停 2:发货暂停 |
 |pbMark|拼板标记信息|INT||
 |stock|库存数量|INT||
 |gmtPay|收款日期|DATETIME||
 |gmtPieceProcess|转入单款时间|DATETIME||
 |paid|已付款金额|FLOAT||
 |ot|订单是否外发|BOOLEAN|false:否 true:是|
 |gmtCl|CAM处理时间|DATETIME||
 |clUser|CAM处理人|STRING||
 |pbId|拼版编号|STRING||
 |tlNum|累计投料数|INT||
 |scrapNum|累计报废数|INT||
 |source|下单渠道|STRING||
 |groupId|订单包编号|STRING||
 |level|难度系数|INT||
 |eqStatus|问客状态|STRING||
 |camStatus|CAM状态|STRING||
 |systemPrice|系统价格|FLOAT||
 |goodsPrice|已发货金额|FLOAT||
 |invoicedAmount|开票金额|FLOAT||
 |refundAmount|退款金额|FLOAT||
 |reOrderId|原始订单ID|STRING||


######MemberBean 会员Model
|属性|名称|类型|备注|
|:----:|:----:|:----:|:----:|
|gmtCreate|创建时间|DATETIME||
|gmtUpdate|修改时间|DATETIME||
|clUser|所属工程师|STRING||
|email|邮箱地址|STRING||
|emailChecked|邮箱是否验证过|BOOLEAN|false:否 true:是|
|mobile|移动电话|STRING||
|mobileChecked|手机号码是否验证过|BOOLEAN||
|contactname|联系人姓名|STRING||
|faxnum|传真号码|STRING||
|phonenum|座机号码|STRING||
|companyname|公司名称|STRING||
|country|所在国家|STRING||
|province|所在省份|STRING||
|city|所在城市|STRING||
|address|地址|STRING||
|qq|QQ|STRING||
|tradeCompany|所属交易公司|STRING||
|avatar|头像|STRING||
|currency|币种|STRING||
|alipay|支付宝账号|STRING||
|tenpay|财付通|STRING||
|chinabank|网银在线账户|STRING||
|paypal|paypal在线账户|STRING||
|accountbank|账户银行|STRING||
|accountno|账户号码|STRING||
|accountdetail|账户详细信息|STRING||
|memberType|用户类型|INT|0: 1:公司客户 2:贸易商 3:个人 4:其他 |
|taxname|税名|STRING||
|taxno|税号|STRING||
|taxbankno|税务银行|STRING||
|taxaddress|税务地址|STRING||
|invoiceType|发票类型|STRING||
|checked|业务员是否被核查|BOOLEAN|false:否 true:是|
|acceptX|客户是否接受|BOOLEAN|false:否 true:是|
|notice|是否接受通知消息|BOOLEAN|false:否 true:是|
|status|账户是否有效|INT|0:否 1:是 |
|agent|客服人员|STRING||
|promoter|推广人|STRING||
|agentName|客服姓名|STRING||
|promoterName|推广人姓名|STRING||
|promoterType|推广人类型|INT|0: 1:会员推广 2:业务员推广 3:广告推广 4:搜索引擎 5:朋友介绍 |
|gmtLogin|上次登录时间|DATETIME||
|loginCount|累积登录次数|INT||
|loginIp|登录ip|STRING||
|qqOpenId|qqOpenID|STRING||
|sinaUid|新浪UID|STRING||
|wechat|微信|STRING||
|note|客户信息备注|STRING||
|gmtRecord|最后记录时间|DATETIME||
|gmtTrade|最后交易时间|DATETIME||
|deliveryPay|是否快递代付|BOOLEAN|false:否 true:是|
|toPay|是否付款|BOOLEAN|false:否 true:是|
|deliveryType|发货方式|STRING||
|hidePrice|是否隐藏金额|BOOLEAN|false:否 true:是|
|profileFileName|附件名称|STRING||
|profileFileId|附件编号|STRING||
|bcbhSeq|型号|INT||
|overSendType|超发类型|INT|0:超发不收费 1:超发收费 2:按客户订单数发货 |
|website|网站|STRING||
|incomplete|参数是否完整|BOOLEAN|false:否 true:是|


######PayLogBean
|属性|名称|类型|备注|
|:----:|:----:|:----:|:----:|
|contentType|付款类型|STRING||
|aiId|收支账户|INT||
|outTradeNo|交易单号|STRING||
|status|状态|INT|0:无效的 1:初始化 2:有效的 3:正在更新 |
|netpay|是否在线支付|BOOLEAN|false:否 true:是|
|gmtCreate|创建时间|DATETIME||
|username|客户姓名|STRING||
|amount|总付款金额|FLOAT||
|balanceUse|账户使用余额|FLOAT||
|paid|实际付款金额|FLOAT||
|fee|收费金额|FLOAT||
|gmtConfirm|确认付款时间|DATETIME||
|confirmor|确认人|STRING||
|account|到款的账户信息|STRING||
|payMethod|在线支付方式|STRING||
|payType|在线支付名称|STRING||
|payTradeno|交易号|STRING||
|payOrderno|商品编号|STRING||
|contentBody|商品描述|STRING||
|fileId|文件编号|STRING||
|cod|是否是cod方式付款|BOOLEAN|false:否 true:是|
|gmtPay|打款时间|DATETIME||
|agent|客服编号|STRING||
|contactname|客户联系人姓名|STRING||
|companyname|公司名称|STRING||
|balance|账户余额|FLOAT||
|currency|付款币种|STRING||
|exchangeRate|当前汇率|FLOAT||
|billId|账单编号|STRING||
|usedAmount|已经使用金额|FLOAT||

