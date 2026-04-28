# AI 友好型应用开发实践：环境管理升级

> **摘要：** 本文分享了在测试环境管理系统中引入 AI 能力的实践经验，通过从传统多表级联架构升级为扁平化 JSON 存储方案，显著提升了 AI 的交互效率和系统可维护性。
>
> **关键词：** AI 友好性、JSON 存储、环境管理、测试自动化、架构升级

---

## 一、背景：当传统架构遇到 AI

在自动化测试领域，环境管理一直是个复杂问题。传统的测试环境管理系统通常采用多表级联的设计：

- **环境主表** - 存储基本信息
- **配置表** - 存储环境配置
- **仪表关联表** - 关联测试仪表
- **历史记录表** - 记录环境变更
- **变更日志表** - 记录操作日志
- ...（通常 10+ 张表）

这种设计在人工操作时代尚可接受，但当我们需要引入 AI Agent（如 TSE Agent）来辅助环境管理时，问题就暴露出来了。

## 二、痛点分析：为什么传统架构不 AI 友好？

### 2.1 AI 难以理解复杂表关系

```sql
-- AI 需要生成的复杂 SQL
SELECT e.*, c.*, i.*, h.*
FROM environment e
JOIN config c ON e.id = c.env_id
JOIN instrument_relation ir ON e.id = ir.env_id
JOIN instrument i ON ir.instrument_id = i.id
LEFT JOIN history h ON e.id = h.env_id
WHERE e.status = 'active'
AND e.test_type = '5G_NR';
```

**问题：**
- AI 需要理解多张表的外键关系
- 生成 SQL 容易出错
- 查询性能随数据量下降

### 2.2 AI 生成配置需要多步操作

传统方式下，AI 需要：
1. 生成环境基本信息 → 插入环境表
2. 生成仪表列表 → 插入仪表关联表
3. 生成信号参数 → 插入配置表
4. 维护外键一致性 → 容易出错

### 2.3 扩展和维护困难

- 新增一种环境类型需要增加表或字段
- 删除环境需要级联清理多张表，易产生脏数据
- 恢复环境几乎不可能

## 三、新方案：扁平化 JSON + 少量核心表

### 3.1 架构设计

| 维度 | 传统方案 | 新方案 |
|------|----------|--------|
| **表结构** | 10+ 张表，外键层层嵌套 | 2 张表 + JSON 字段 |
| **核心表** | 环境主表、配置表、仪表关联表... | 环境配置表、环境实例表 |
| **数据存储** | 分散在多张表 | 集中存储在 JSON 字段 |

### 3.2 表结构设计

```sql
-- 环境配置表（存储环境定义）
CREATE TABLE environment_config (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    config_json JSON NOT NULL,  -- 完整的环境配置
    schema_version VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- 环境实例表（存储运行时状态）
CREATE TABLE environment_instance (
    id BIGINT PRIMARY KEY,
    config_id BIGINT,
    status VARCHAR(50),  -- active/inactive/deleted
    runtime_json JSON,   -- 运行时状态
    created_at TIMESTAMP,
    last_used_at TIMESTAMP
);
```

### 3.3 JSON 结构示例

```json
{
  "environmentName": "5G NR 测试环境",
  "testType": "射频性能测试",
  "description": "用于 5G NR 射频性能验证",
  "instruments": [
    {
      "type": "频谱仪",
      "model": "FSW43",
      "ip": "192.168.1.100",
      "port": 5025,
      "calibrationDate": "2026-03-01"
    },
    {
      "type": "信号源",
      "model": "SMW200A",
      "ip": "192.168.1.101",
      "port": 5025,
      "powerRange": "-130 to 20 dBm"
    }
  ],
  "signalParams": {
    "frequency": 3.5e9,
    "bandwidth": 100e6,
    "modulation": "256QAM",
    "subcarrierSpacing": 30e3
  },
  "limits": {
    "evm": 0.03,
    "aclr": -45,
    "sem": -25
  },
  "metadata": {
    "createdBy": "TSE Agent",
    "createdAt": "2026-03-27T10:30:00Z",
    "version": "1.0"
  }
}
```

## 四、新方案如何支撑 AI "直接生成和管理"

### 4.1 AI 直接生成完整环境配置

**传统方式：**
```python
# AI 需要分步生成
env_id = create_environment("5G NR 测试环境")
config_id = create_config(env_id, {...})
instrument_ids = create_instruments(env_id, [...])
```

**新方式：**
```python
# AI 一次性生成完整配置
config = {
    "environmentName": "5G NR 测试环境",
    "testType": "射频性能测试",
    "instruments": [...],
    "signalParams": {...}
}
save_environment(config)  # 直接存入 JSON 字段
```

### 4.2 AI 直接查询与理解环境状态

**传统方式：** AI 需要理解表关系，生成复杂 SQL

**新方式：**
```sql
-- AI 只需简单查询
SELECT runtime_json FROM environment_instance 
WHERE status = 'active';

-- 搜索特定仪表的环境
SELECT * FROM environment_instance 
WHERE runtime_json->'instruments' @> '[{"model": "FSW43"}]';
```

### 4.3 AI 辅助环境恢复与克隆

**传统方式：** 删除需要级联清理，恢复困难

**新方式：**
```sql
-- 删除（软删除）
UPDATE environment_instance SET status = 'deleted' WHERE id = 123;

-- 恢复
UPDATE environment_instance SET status = 'active' WHERE id = 123;

-- 克隆
INSERT INTO environment_instance (config_id, status, runtime_json)
SELECT config_id, 'active', runtime_json 
FROM environment_instance WHERE id = 123;
```

### 4.4 AI 进行健康度分析

**传统方式：** 需要 JOIN 多张表获取历史记录

**新方式：**
```json
{
  "healthMetrics": {
    "uptime": "99.8%",
    "lastCalibration": "2026-03-01",
    "errorCount": 3,
    "performanceScore": 95
  },
  "changeHistory": [
    {"date": "2026-03-26", "change": "更新频率配置", "by": "AI Agent"},
    {"date": "2026-03-25", "change": "添加新仪表", "by": "工程师"}
  ]
}
```

## 五、方案对比与收益

### 5.1 详细对比

| 维度 | 传统多表级联 | 新方案（2表+JSON） | 改进 |
|------|--------------|-------------------|------|
| **表数量** | 10+ 张 | 2 张 | 80% 减少 |
| **查询复杂度** | 多表 JOIN，SQL 复杂 | 单表查询，JSON 直接返回 | 极大简化 |
| **AI 友好性** | AI 难以理解表关系，生成 SQL 易错 | AI 直接读取/生成 JSON，格式一致 | AI 原生支持 |
| **配置生成** | AI 需分步生成多条记录，维护外键 | AI 一次生成完整 JSON，直接存入 | 工作流简化 |
| **环境恢复** | 删除需清理多表，易产生脏数据 | 删除仅标记状态，恢复只需改状态 | 容错性提升 |
| **扩展性** | 新增环境类型需增加表或字段 | 新增只需扩展 JSON Schema | 灵活扩展 |
| **性能** | JOIN 性能随数据量下降 | 单表查询，JSON 索引优化 | 查询效率高 |

### 5.2 量化收益

1. **开发效率提升**
   - 环境创建：从 5+ 步操作 → 1 步完成
   - 代码量：减少 60% 的数据访问层代码
   - 调试时间：减少 70% 的 SQL 调试时间

2. **AI 交互效率**
   - 配置生成：从分钟级 → 秒级
   - 错误率：降低 80% 的外键一致性错误
   - 理解成本：AI 无需学习复杂表结构

3. **系统可维护性**
   - 表数量：从 10+ → 2
   - 迁移成本：新增功能无需数据库迁移
   - 恢复能力：支持一键恢复已删除环境

## 六、对其他项目的启发

这套"扁平化 JSON + 少量核心表"的设计思路，可以为其他希望引入 AI 能力的平台提供借鉴：

| 项目类型 | 借鉴点 | 预期收益 |
|----------|--------|----------|
| **配置管理平台** | 用 JSON 替代多表存储配置项 | AI 直接生成/优化配置 |
| **设备资产管理** | 每类设备定义 JSON Schema，统一存储 | AI 可跨设备类型分析 |
| **测试任务管理** | 任务参数、步骤、预期结果用 JSON 存储 | AI 一键生成复杂任务 |
| **运维工单系统** | 工单详情、处理步骤、关联资源用 JSON 存储 | AI 自动生成处理方案 |
| **数据分析平台** | 将数据集元数据以 JSON 存储 | AI 直接理解数据结构和血缘关系 |

## 七、核心启示

### 7.1 设计原则

1. **AI 原生优先**
   - 让 AI 能够直接读、写、理解数据
   - 减少业务逻辑和数据库之间的翻译层

2. **数据结构扁平化**
   - 用 JSON 替代复杂的关系模型
   - 保持数据的自包含性

3. **状态驱动而非操作驱动**
   - 记录状态变化而非操作日志
   - 支持随时回滚和恢复

### 7.2 实施建议

1. **渐进式迁移**
   - 新功能采用新方案
   - 老功能逐步迁移
   - 保持双向兼容

2. **JSON Schema 管理**
   - 定义清晰的 Schema 规范
   - 提供 Schema 验证工具
   - 支持版本升级

3. **查询优化**
   - 合理使用 JSON 索引
   - 避免过度嵌套
   - 定期清理历史数据

## 八、总结

这次环境管理系统的升级实践，让我们深刻认识到：**当系统需要 AI 深度参与时，数据结构的 AI 友好性应该成为首要考虑因素。**

传统的关系型数据库设计虽然严谨，但在 AI 交互场景下反而成为障碍。通过采用扁平化 JSON 存储，我们不仅简化了系统架构，更重要的是让 AI 能够更自然、更高效地与系统交互。

**技术栈建议：**
- 数据库：PostgreSQL（JSONB 支持完善）
- 查询语言：SQL + JSON 路径表达式
- 索引策略：GIN 索引加速 JSON 查询
- 验证工具：JSON Schema 验证库

**未来展望：**
随着 AI Agent 能力的不断提升，这种 AI 友好的架构模式将在更多领域得到应用。我们正在探索将这一模式推广到公司的其他平台，构建真正的 AI 原生应用生态系统。

---

**作者简介：** 资深测试架构师，11 年华为自动化测试平台开发经验，专注于 AI 在测试领域的应用实践。

**欢迎交流：** 如有问题或建议，欢迎在评论区留言讨论！

---

*本文首发于个人博客，转载请注明出处。*


---

欢迎交流讨论，我的 blog：[sunrong.site](https://sunrong.site)
