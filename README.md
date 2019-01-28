# osprey

香侬PDF检索服务，基于Elasticsearch搭建，用于检索PDF中的文本信息

## 环境配置

首先需要安装go和设置GOPATH

其次，需要安装下列依赖：

go get github.com/astaxie/beego
go get github.com/olivere/elastic
go get github.com/bitly/go-simplejson
go get github.com/parnurzeal/gorequest
go get github.com/aliyun/aliyun-oss-go-sdk/oss
go get golang.org/x/net


## 使用方法

### PDF检索

#### 接口地址

`http://dev.shannonai.com:9236/api/search`

#### 访问方式

`POST`

#### 传入参数

| 参数名 | 类型 | 描述 |
| ---         | ---    | ---                      |
| question    | string | 查询的问题                 |
| page-size   | int    | 每次查询返回结果的数量       |
| page-num    | int    | 当前是第几页，注意页码从1开始 |
| mode        | string| 如果是"dev"，则返回更多细节|

#### 返回结果参数

| 参数名 | 类型 | 描述 |
| ---         | ---    | ---                         |
| total-count | int    | 共检索到多少条结果             |             
| highlight   | list   | 高亮词汇                     |          
| question    | string | 原始查询问题                  |
| page-items  | list   | 结果列表，每个元素为一条结果     | 
| title       | string | 所在文件的中文文件名            |
| body        | string | 匹配到的字符串，目前为图表的标题  |
| link        | string | 文件链接                      |
| page        | int    | 当前结果所在的页码              |
| figure-url  | string | 图片链接                      |
| date       | string  | 文档发布日期            |




### 公众号全文检索

#### 接口地址

`http://dev.shannonai.com:9236/api/search/wechat`

#### 访问方式

`POST`

#### 传入参数 (和之前PDF搜索相同)

| 参数名 | 类型 | 描述 |
| ---         | ---    | ---                      |
| question    | string | 查询的问题                 |
| page-size   | int    | 每次查询返回结果的数量       |
| page-num    | int    | 当前是第几页，注意页码从1开始 |
| mode        | string| 如果是"dev"，则返回更多细节|

#### 返回结果参数

| 参数名 | 类型 | 描述 |
| ---         | ---    | ---                         |
| total-count | int    | 共检索到多少条结果             |             
| highlight   | list   | 高亮词汇                     |          
| question    | string | 原始查询问题                  |
| page-items  | list   | 结果列表，每个元素为一条结果     | 
| title       | string | 所在文件的中文文件名            |
| body        | string | 匹配到的字符串，目前为文章中最具代表性的某一段  |
| link        | string | 文章链接                      |
| date       | string  | 文档发布日期            |


