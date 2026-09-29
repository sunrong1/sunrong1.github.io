---
title: DDD 进阶:从领域事件到四层架构的实战体系
icon: layers
date: 2026-09-27
update: 2026-09-27
categories:
  - DDD
  - 软件架构
tags:
  - DDD
  - 领域驱动设计
  - 领域事件
  - 四层架构
  - 事务边界
  - 仓储
  - 依赖倒置
  - 误区防范
author: Mr.Sun
star: true
---***
# DDD 进阶:从领域事件到四层架构的实战体系

> Day 3 进阶篇,2 波素材整合。
> 关键字:**领域事件 / 最终一致性 / 事务边界 / 四层架构 / 严格分层 / 聚合演进 / 职责分层 / 仓储分层 / 4 大误区**。
> DDD 基础篇(9-24)讲"业务怎么切 + 代码怎么写",本文讲"怎么用得起来,怎么不踩坑"。

***

## 📌 一句话核心

> **"DDD 进阶 = 领域事件解耦 + 四层架构落地 + 严格分层 + 4 大误区防范。"**
> **领域事件 = 已发生的业务事实,过去时命名,跨上下文用最终一致性;**
> **四层架构 = 用户接口 + 应用 + 领域 + 基础,严格分层,领域层零技术依赖;**
> **误区 = 不写三层架构的伪 DDD,不写应用层业务,不拆 1 聚合 = 1 微服务,不让领域服务啥都干。**

***

<!-- more -->

## 📌 为什么写这篇

DDD 基础篇(9-24)讲清楚了"业务怎么切 + 代码怎么写"——**子域、限界上下文、实体、值对象、聚合、聚合根**。

但实战时,大家最常踩的坑是:

- ❌ 微服务之间直接同步调用,性能差
- ❌ 一个事务改多个聚合,数据不一致
- ❌ 把 DDD 当成"新的三层架构"写
- ❌ 把所有业务逻辑都塞进应用层 Service

**本文把 Day 3 进阶篇的 2 波内容整合成实战体系**——从"领域事件"到"四层架构"到"误区防范"。

***

## 💎 第 1 部分:领域事件(解耦微服务的关键)

> **"领域事件 = 已经发生的业务事实,其他业务操作可以订阅它,并据此触发后续流程。"**

### 1.1 领域事件的 4 大特征

| 特征 | 含义 | 例子 |
| :--- | :--- | :--- |
| **已经发生** | **过去时**(不是"将要做") | `OrderCreated`(已创建) |
| **业务事实** | 业务语言,不是技术语言 | `OrderPaid` 而非 `OrderStatusUpdatedTo2` |
| **可订阅** | 其他服务订阅响应 | 库存服务订阅 → 扣减库存 |
| **不可变** | 一旦发生不可修改 | `OrderCreated` 不能"取消" |

### 1.2 命名规范(关键)

| 类型 | 时态 | 角色 | 例子 |
| :--- | :--- | :--- | :--- |
| **命令**(Command) | 将来时 | 让系统做事 | `CreateOrder`(要创建) |
| **领域事件** | **过去时** | **系统已做事** | **`OrderCreated`(已创建)** |
| **技术事件** | 过去时 | 系统底层事件 | `DBRecordInserted` |

**关键洞察**:**领域事件 = 业务语言 + 过去时**。

### 1.3 跨上下文的最终一致性

> **"跨限界上下文或跨微服务的领域事件,通常采用最终一致性。"**

| 一致性类型 | 含义 | 代价 |
| :--- | :--- | :--- |
| **强一致性** | 所有上下文同时一致 | 分布式事务(2PC/Saga),**性能差** |
| **最终一致性** | 短时间不一致 + 最终一致 | 消息中间件,异步,**简单** |

#### 最终一致性的 4 大保障

| 机制 | 作用 |
| :--- | :--- |
| **幂等消费** | 同一条事件消费多次,结果一致 |
| **失败重试** | 消费失败自动重试 |
| **死信队列** | 重试 N 次仍失败,进死信 |
| **对账机制** | 定期检查上下游数据 |

### 1.4 领域事件驱动设计的核心价值

> **"领域事件驱动设计可以把限界上下文之间、微服务之间的强依赖,转化为基于事件契约的弱依赖,降低耦合,但不会消除依赖。"**

#### 强依赖 vs 弱依赖

| 强依赖(同步调用) | 弱依赖(事件驱动) |
| :--- | :--- |
| ❌ 订单服务直接调库存服务 | ✅ 订单服务发事件,库存服务订阅 |
| ❌ 调用失败 → 业务失败 | ✅ 调用失败 → 重试 + 死信 |
| ❌ 上下游必须同时在线 | ✅ 上下游可短暂离线 |
| ❌ 上下游耦合严重 | ✅ 上下游独立演进 |

#### 依赖的 3 层减弱

```
[层 1] 同步调用(强依赖)
   服务 A → 服务 B(HTTP,失败立即报错)

[层 2] 事件驱动(弱依赖) ← DDD 大多数选择
   服务 A 发事件 → 消息中间件 → 服务 B 消费

[层 3] 纯事件溯源(完全解耦)
   服务 A 发事件 → 事件存储 → 服务 B 重放
```

### 1.5 消息中间件对比

| 中间件 | 类型 | 适用场景 | 特点 |
| :--- | :--- | :--- | :--- |
| **Kafka** | 日志型 | 高吞吐日志、流处理 | **DDD 事实标准**,持久化 |
| RabbitMQ | 队列型 | 复杂路由、低延迟 | 灵活路由 |
| RocketMQ | 队列型 | 事务消息、金融 | 事务消息强 |
| Pulsar | 新一代 | 多租户、Serverless | 存算分离 |

### 1.6 领域事件实战代码

```python
# 1. 领域事件定义(过去时命名,frozen=True)
@dataclass(frozen=True)
class OrderCreatedEvent:
    event_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    occurred_at: datetime = field(default_factory=datetime.now)
    aggregate_id: str = ""
    customer_id: str = ""
    total_amount: float = 0.0
    event_type: str = "OrderCreated"

# 2. 聚合根发布事件
class Order:
    def submit(self):
        if self.status != "Pending":
            raise InvalidStateError("只有 Pending 状态可提交")
        if not self.items:
            raise BusinessRuleError("订单必须有订单项")
        self.status = "Submitted"
        # ★ 发事件(过去时)
        self._domain_events.append(OrderCreatedEvent(
            aggregate_id=self.order_id,
            customer_id=self.customer_id,
            total_amount=self.total_amount().amount,
        ))

# 3. 应用层发布到 Kafka
@Service
class OrderApplicationService:
    @Transactional  # 事务边界在应用层
    def create_order(self, customer_id, items):
        order = Order.create(customer_id)
        for item in items:
            order.add_item(...)
        order.validate()
        self.order_repo.save(order)

        # 发事件到 Kafka
        for event in order.collect_events():
            self.event_publisher.publish(event)

# 4. 订阅方(库存服务)
class InventoryEventHandler:
    def handle_order_created(self, event):
        for item in event["payload"]["items"]:
            self._deduct_inventory(item["product_id"], item["quantity"])
```

### 1.7 4 大反模式

| 反模式 | 后果 |
| :--- | :--- |
| **事件命名用现在时** | 混淆命令和事件 |
| **事件里塞太多字段** | 耦合 + 泄露内部 |
| **同步等待事件消费** | 退化为同步调用 |
| **没有幂等消费** | 数据不一致 |

---

## 💎 第 2 部分:聚合的事务边界

> **"一个事务改多个聚合,违反聚合边界,应该拆成多个事务 + 事件。聚合内应该强一致,用本地事务。"**

### 2.1 反模式的 3 种表现

```
❌ 表现 1:1 个事务改 2 个聚合
   事务 = 修改订单聚合 + 修改库存聚合
❌ 表现 2:跨聚合的强一致性追求
   "订单 + 库存同时成功或同时失败"
❌ 表现 3:跨聚合的对象引用
   订单聚合根直接持有库存对象
```

### 2.2 正确做法:多事务 + 事件

```
[事务 1:本地]
   订单聚合.submit() → 状态修改 + 发 OrderCreated 事件

[消息中间件]
   → 事件传递

[事务 2:本地,异步]
   库存聚合收到 OrderCreated → 扣减库存 + 发 InventoryDeducted
```

### 2.3 事务边界的 3 个判断

| 场景 | 正确做法 |
| :--- | :--- |
| **1 个聚合内** | **本地事务**(ACID 强一致) |
| **跨聚合** | **多个本地事务 + 事件**(最终一致) |
| **跨微服务** | **消息中间件 + Saga**(最终一致) |

**关键洞察**:**每个聚合 = 1 个本地事务;聚合之间 = 事件传递**。

---

## 💎 第 3 部分:DDD 四层架构

> **"DDD 四层架构 = 用户接口层 + 应用层 + 领域层 + 基础层,严格分层,每层只对下层负责。"**

### 3.1 四层架构总览

```
[用户接口层] (User Interface)
   REST Controller / DTO / 定时任务
   ↓
[应用层] (Application)
   Application Service / 事务管理 / 事件发布
   ↓
[领域层] (Domain)
   聚合根 / 实体 / 值对象 / 领域事件 / 仓储接口
   ↓
[基础层] (Infrastructure)
   仓储实现 / 第三方工具 / Kafka / MySQL / Common/Utility/Config
```

### 3.2 用户接口层

> "负责向用户展示信息和解释用户指令,包含 REST API、DTO、定时任务等,是外部请求进入系统的入口。"

| 职责 | 例子 |
| :--- | :--- |
| **外部请求入口** | REST Controller / GraphQL Resolver |
| **展示信息** | DTO / VO |
| **解释用户指令** | 请求参数解析、验证 |
| **定时任务** | `@Scheduled` |

**不包含**:**业务规则**、数据库访问、事务管理。

### 3.3 应用层(只编排,不写业务)

> "应用层负责用例编排、事务边界声明、调用领域层、发布领域事件。"

#### 4 大职责

| 职责 | 含义 |
| :--- | :--- |
| **用例编排** | 一个用例 = 多个聚合 + 领域服务的组合 |
| **事务边界声明** | `@Transactional` 在应用层 |
| **调用领域层** | 调聚合根 / 领域服务 |
| **发布领域事件** | 调 `EventPublisher` |

#### 应用层实战

```python
@Service
class OrderApplicationService:
    def __init__(self, order_repo, event_publisher):
        self.order_repo = order_repo
        self.event_publisher = event_publisher

    @Transactional  # ① 事务边界
    def create_order(self, customer_id, items):
        # ② 编排:聚合 + 仓储 + 事件(没有 if/else 业务判断)
        order = Order.create(customer_id)
        for item in items:
            order.add_item(...)  # 业务逻辑在聚合根
        order.validate()         # 业务校验在聚合根

        self.order_repo.save(order)  # ③ 仓储
        for event in order.collect_events():
            self.event_publisher.publish(event)  # ④ 事件发布
        return order.order_id
```

**关键洞察**:**应用层只编排,不写业务规则**——这是 DDD 的灵魂。

### 3.4 领域层(零技术依赖)

> "领域层:实现核心的业务逻辑,包含聚合根、实体、值对象、领域事件、领域服务(实现复杂业务逻辑)、仓储接口、工厂、领域异常。"

| 元素 | 角色 |
| :--- | :--- |
| **聚合根** | 业务逻辑载体(充血模型) |
| **实体 / 值对象** | 领域对象 |
| **领域事件** | 业务事实 |
| **领域服务** | 跨聚合/跨实体逻辑 |
| **仓储接口** | 持久化抽象 |
| **工厂** | 创建复杂对象 |
| **领域异常** | 业务规则违反 |

#### 领域层的独立性

> **领域层 = 纯业务,不依赖任何技术框架**

```
[领域层] 不依赖 ↓
   ├─ Web 框架(Spring/Flask)
   ├─ 数据库(SQL/NoSQL)
   ├─ 消息中间件(Kafka)
   └─ 任何第三方 SDK
```

**关键洞察**:**领域层代码 = 纯 Python/Java**,没有 import 任何框架。

### 3.5 基础层(杂货铺)

> "基础层:贯穿所有层,为各层提供通用的技术和基础服务。**基础层不是被领域层直接依赖,而是实现领域层和应用层定义的接口,它采用依赖倒置设计,封装基础资源服务**。"

#### 关键设计:**依赖倒置**

```
[传统三层架构](自上而下依赖)
   表现层 → 业务层 → 数据访问层  ❌

[DDD 四层架构](依赖倒置)
   领域层 定义 仓储接口(抽象)
   基础层 实现 仓储接口  ✅
   业务层依赖接口,不依赖实现
```

#### 基础层包含

- 仓储实现(实现领域层定义的 `Repository`)
- 第三方工具 / 驱动 / 消息中间件
- 网关 / 缓存 / 数据库
- **Common / Utility / Config**(三层架构散落的,统一放基础层)

### 3.6 严格分层 vs 松散分层

> "**分层最重要的原则:每层只能与位于其下方的层发生耦合(严格分层架构),不推荐松散分层架构(与下方的任意层发生依赖)**。"

```
严格分层(✅ 推荐):
[用户接口层] → [应用层] → [领域层] → [基础层]

松散分层(❌ 反模式):
[用户接口层] → ↘ ↙
                [应用层] → ↘ ↙
                              [领域层]
```

#### 分层规则对照

| 层级 | 可以调用 | 不可以调用 |
| :--- | :--- | :--- |
| **用户接口层** | 应用层 | 领域层、基础层 |
| **应用层** | 领域层、基础层(接口) | 基础层(具体类) |
| **领域层** | 基础层(接口) | 用户接口层、应用层 |
| **基础层** | (无,最底层) | 所有上层 |

---

## 💎 第 4 部分:聚合的演进

> **"聚合可以作为一个整体,可以随限界上下文一起演进,在不同的领域模型之间重组或者拆分,如果两个聚合总是一起变化,可以合并,如果一个聚合太大,可以拆分。"**

### 4.1 聚合演进的 3 种操作

| 操作 | 触发条件 |
| :--- | :--- |
| **合并** | 两个聚合总是一起变化 |
| **拆分** | 一个聚合太大 / 太复杂 |
| **重组** | 业务边界变了 |

### 4.2 聚合合并(一起变化)

#### 合并的 4 个信号

| 信号 | 含义 |
| :--- | :--- |
| **一起创建** | 订单 + 订单项 = 一起创建 |
| **一起删除** | 订单取消 → 订单项一起删 |
| **强不变量** | 总金额 = 所有订单项之和 |
| **同一个事务** | 一起成功/失败 |

**例子**:**订单 + 订单项** → 合并为一个聚合。

### 4.3 聚合拆分(太大)

#### 拆分的 4 个信号

| 信号 | 含义 |
| :--- | :--- |
| **聚合内实体过多** | > 10 个实体 |
| **业务规则复杂** | 难以快速理解 |
| **事务过长** | 锁竞争严重 |
| **团队冲突** | 多人改同一聚合 |

#### 拆分示例

```
[原聚合:订单聚合]
   ├─ Order
   ├─ OrderItem
   ├─ ShippingInfo
   ├─ PaymentInfo
   └─ CustomerSnapshot

[拆分后]
   订单聚合: Order + OrderItem + ShippingInfo
   支付聚合: PaymentInfo
   客户聚合: CustomerSnapshot
```

---

## 💎 第 5 部分:职责分层(不是层层封装)

> **"聚合根承载聚合内业务逻辑;领域服务承载跨聚合、跨实体的领域逻辑;应用服务编排聚合、领域服务、仓储和事件。不是层层封装,而是职责分层。"**

### 5.1 错误的理解:层层封装

```
❌ 错误理解:

Controller(包装)
   → ApplicationService(包装)
       → DomainService(包装)
           → Aggregate(包装)

每一层只包装下一层 → 没有职责分工 = 层层封装
```

### 5.2 正确的理解:职责分层

```
✅ 正确理解:

Controller        → 入口 + DTO
ApplicationService → 用例编排(组合多个领域对象)
DomainService      → 跨聚合 / 跨实体逻辑
Aggregate          → 聚合内业务逻辑
Entity             → 单实体业务逻辑
ValueObject        → 描述性,无逻辑
```

### 5.3 三类服务对比

| 类型 | 职责 | 实战 |
| :--- | :--- | :--- |
| **聚合根** | **聚合内**业务逻辑 | `Order.add_item()` |
| **领域服务** | **跨聚合 / 跨实体**逻辑 | `PricingService.calculate_final_price(order, discount, coupon)` |
| **应用服务** | **编排**:聚合 + 领域服务 + 仓储 + 事件 | `create_order()` |

### 5.4 实战代码示例

```python
# 1. 聚合根(聚合内)
class Order:
    def add_item(self, product_id, quantity, price):
        if self.status != "Pending":
            raise InvalidStateError(...)
        self.items.append(OrderItem(product_id, quantity, price))

    def total_amount(self) -> Money:
        total = Money(0, "CNY")
        for item in self.items:
            total = total + item.subtotal()
        return total

# 2. 领域服务(跨聚合)
class PricingService:
    """跨聚合:订单 + 折扣 + 优惠券"""
    def calculate_final_price(self, order, discount, coupon) -> Money:
        original = order.total_amount()
        with_discount = original - discount.apply(original)
        return coupon.apply(with_discount)

# 3. 应用服务(编排)
@Service
class OrderApplicationService:
    @Transactional
    def create_order(self, customer_id, items, discount, coupon):
        order = Order.create(customer_id)
        for item in items:
            order.add_item(...)  # 调聚合根

        # 调领域服务(跨聚合)
        final_price = PricingService().calculate_final_price(order, discount, coupon)

        order.validate()           # 调聚合根
        self.order_repo.save(order)  # 调仓储
        self.event_publisher.publish(...)  # 发事件
        return order.order_id
```

---

## 💎 第 6 部分:仓储与依赖倒置

> **"仓储又分为两部分:仓储接口和仓储实现。仓储接口放在领域层中,仓储实现放在基础层。"**

### 6.1 仓储的两部分

| 部分 | 放在哪 | 作用 |
| :--- | :--- | :--- |
| **仓储接口** | 领域层 | 定义"保存/查找聚合根"的抽象 |
| **仓储实现** | 基础层 | 真正操作数据库 |

### 6.2 仓储接口(领域层,抽象)

```python
from abc import ABC, abstractmethod

class OrderRepository(ABC):
    """订单仓储接口(领域层定义)"""

    @abstractmethod
    def find(self, order_id: str) -> Order: ...

    @abstractmethod
    def save(self, order: Order) -> None: ...

    @abstractmethod
    def delete(self, order_id: str) -> None: ...
```

### 6.3 仓储实现(基础层,具体)

```python
from sqlalchemy.orm import Session

class MysqlOrderRepository(OrderRepository):
    """MySQL 订单仓储实现(基础层)"""

    def __init__(self, session: Session):
        self.session = session

    def find(self, order_id: str) -> Order:
        record = self.session.query(OrderRecord).filter_by(order_id=order_id).first()
        return self._to_entity(record) if record else None

    def save(self, order: Order) -> None:
        record = self._to_record(order)
        self.session.merge(record)
        self.session.commit()
```

### 6.4 依赖倒置的力量

| 传统分层 | DDD 依赖倒置 |
| :--- | :--- |
| 业务层 → 数据访问层(具体类) | 领域层定义接口 |
| ❌ 换数据库 = 改业务层 | ✅ **换数据库 = 只改基础层,不改业务** |

**关键洞察**:**依赖倒置 = 可替换 + 可测试 + 可演进**。

---

## 💎 第 7 部分:完整调用链(9 步)

> **"用户接口层 → 应用服务 → 聚合根 / 领域服务 → 实体 / 值对象;仓储接口在领域层,实现在基础设施层。"**

```
[用户接口层]
   Controller.create_order()  ─── ① 接收 HTTP 请求
↓
[应用层]
   ApplicationService.create_order()
       ├── @Transactional  ─── ② 事务边界
       └── 编排:聚合 + 领域服务 + 仓储 + 事件
↓
[领域层]
   Order.create()  ─── ③ 创建聚合根
   PricingService.calculate_final_price()  ─── ④ 跨聚合
   Order.add_item()  ─── ⑤ 调实体 + 值对象
↓
[领域层抽象]
   OrderRepository.save()  ─── ⑥ 抽象"保存"
↓
[基础层实现]
   MysqlOrderRepository.save()  ─── ⑦ 写 MySQL
↓
[基础层]
   KafkaPublisher.publish()  ─── ⑧ 发 Kafka
   ↓
   InventoryEventHandler.handle_order_created()  ─── ⑨ 库存扣减
```

### 关键规则

| 规则 | 含义 |
| :--- | :--- |
| **单向依赖** | 每层只能依赖下层 |
| **抽象优先** | 领域层只看到接口 |
| **具体实现下沉** | 数据库/Kafka 在基础层 |

---

## 💎 第 8 部分:DDD 误区防范(4 大误区)

> **"正确认识,防止进入误区"。**

### 8.1 4 大误区对照表

| # | 误区 | 错误理解 | 正确理解 |
| :--- | :--- | :--- | :--- |
| 1 | **DDD = 三层架构** | 业务层依赖数据层 | **依赖倒置**(领域定义接口,基础实现) |
| 2 | **应用层写业务** | 应用层有 if/else 校验 | **应用层只编排**(业务在领域层) |
| 3 | **1 聚合 = 1 微服务** | 每个聚合独立成微服务 | **不推荐**(1 微服务 = N 聚合) |
| 4 | **领域服务啥都干** | 所有跨调用都放领域服务 | **只承载跨聚合 / 跨实体逻辑** |

### 8.2 误区 1:DDD ≠ 三层架构

```
❌ 错误:DDD 是新的三层架构

✅ 正确:DDD = 依赖倒置架构
   ├─ 领域层定义接口(抽象)
   ├─ 基础层实现接口(具体)
   └─ 业务层依赖接口,不依赖具体类
```

### 8.3 误区 2:应用层不写业务

```python
# ❌ 错误:应用层写业务
class OrderApplicationService:
    @Transactional
    def create_order(self, customer_id, items):
        if customer_id is None:  # ❌ 业务校验在应用层
            raise ValueError("客户不能为空")
        if len(items) == 0:
            raise ValueError("订单不能为空")
        order = Order.create(customer_id)
        self.order_repo.save(order)

# ✅ 正确:业务在领域层
class Order:
    def __init__(self, customer_id):
        if customer_id is None:  # ✅ 业务校验在聚合根
            raise BusinessRuleError("客户不能为空")

    def validate(self):
        if not self.items:
            raise BusinessRuleError("订单不能为空")
```

### 8.4 误区 3:1 聚合 ≠ 1 微服务

> **"一个聚合拆一个微服务太细,不推荐。"**

#### 反模式的 3 个问题

| 问题 | 表现 |
| :--- | :--- |
| **运维复杂度爆炸** | 10 个聚合 = 10 个微服务 |
| **跨聚合调用复杂** | RPC/Event 满天飞 |
| **事务边界难控制** | 跨微服务强一致 = 性能差 |

#### 正确的微服务拆分原则

| 原则 | 含义 |
| :--- | :--- |
| **业务能力** | 1 个业务能力 = 1 个微服务 |
| **团队规模** | 1 个 2 人小队能维护 = 1 个微服务 |
| **演进频率** | 频率差异大 = 拆 |
| **性能要求** | 性能要求差异大 = 拆 |

**关键洞察**:**1 个微服务 = N 个聚合**(聚合粒度细,微服务粒度粗)。

### 8.5 误区 4:领域服务不是万能胶水

```python
# ❌ 错误:领域服务啥都干
class OrderDomainService:
    def create_order(self):  # ❌ 应用服务职责
        pass
    def save_order(self):  # ❌ 仓储职责
        pass
    def publish_event(self):  # ❌ 基础设施职责
        pass
    def add_item(self, order, item):  # ❌ 聚合根职责
        pass

# ✅ 正确:领域服务只承载跨聚合/跨实体逻辑
class PricingDomainService:
    """跨聚合:订单 + 折扣 + 优惠券"""
    def calculate_final_price(self, order, discount, coupon) -> Money:
        # ✅ 只做跨聚合逻辑
        return ...
```

**关键洞察**:**领域服务 = 跨聚合 / 跨实体逻辑,不是万能胶水**。

---

## 💬 总结 + 行动建议

### Day 3 进阶篇完整图谱

```
[领域事件] (解耦)
   ├─ 已发生的业务事实,过去时
   ├─ 最终一致性(跨上下文)
   └─ Kafka 是事实标准

[事务边界] (一致性的边界)
   ├─ 聚合内 = 本地事务(强一致)
   └─ 跨聚合 = 多事务 + 事件(最终一致)

[四层架构] (落地)
   ├─ 用户接口层(入口)
   ├─ 应用层(只编排)
   ├─ 领域层(零技术依赖)
   └─ 基础层(依赖倒置)

[职责分层] (协作)
   ├─ 聚合根 = 聚合内业务
   ├─ 领域服务 = 跨聚合逻辑
   └─ 应用服务 = 编排

[仓储] (依赖倒置)
   ├─ 接口在领域层
   └─ 实现在基础层

[误区防范] (避坑)
   ├─ DDD ≠ 三层架构
   ├─ 应用层不写业务
   ├─ 1 聚合 ≠ 1 微服务
   └─ 领域服务不是万能胶水
```

### 工程师的行动建议

| 时间 | 行动 |
| :--- | :--- |
| **本周** | 把现有项目画一张"四层架构图",看是否严格分层 |
| **本月** | 识别一个跨服务调用,改成"事件驱动"试试 |
| **本季度** | 把领域层的 if/else 业务校验全部下沉到聚合根 |
| **半年内** | 把应用层重构成"只编排"——零业务规则 |
| **持续** | 每次写新功能前问自己:这是哪个层?有没有跨层调用? |

### DDD 完整 3 天计划图

| Day | 主题 | 发布 | 视角 |
| :--- | :--- | :--- | :--- |
| **Day 1** | 战略设计 | 9-22 已发 | 业务怎么切 |
| **Day 2** | 战术设计 | 9-24 已发 | 代码怎么写 |
| **Day 3** | 进阶篇 | **9-27 本文** | 怎么用得起来,怎么不踩坑 |

### 关联之前项目

- **工单状态机 S0-S6** — 业务流 ≈ 限界上下文
- **AgentScope 8 周源码深读** — `agent/` ≈ Agent 上下文,`pipeline/` ≈ 业务流上下文

**关键洞察**:**之前项目不自觉地用到了 DDD**——只是没显式表达。

---

## 💬 最后一句话

> **"DDD 不是设计模式,不是架构,是一种服务业务的设计思想。"**
>
> **"领域事件 = 解耦 + 异步 + 最终一致 = 微服务的关键。"**
>
> **"四层架构 = 严格分层 + 依赖倒置 = 可替换 + 可测试。"**
>
> **"应用层只编排,业务规则必须在领域层。"**
>
> **"1 聚合 ≠ 1 微服务;1 微服务 = N 聚合。"**
>
> **"AI 让写代码变快,但没让'领域怎么切'变容易——DDD 是 AI 时代最稀缺的视角。"**

DDD 系列完整矩阵:

- 9-22 [DDD 战略设计](https://sunrong.site/posts/ai-practice/2026-09-22-ddd-strategic-design.html)— Day 1
- 9-24 [DDD 基础](https://sunrong.site/posts/ai-practice/2026-09-24-ddd-foundations.html)— Day 1+Day 2 整合
- **9-27 [DDD 进阶(本文)](https://sunrong.site/posts/ai-practice/2026-09-27-ddd-advanced.html)** — Day 3 实战

DDD 进阶篇(Day 3)整合的核心目标:从"领域事件"到"四层架构"到"误区防范",把 DDD 用得起来,不踩坑。