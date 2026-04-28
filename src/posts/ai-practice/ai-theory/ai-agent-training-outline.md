---
date: 2026-04-18
tags:
  - AI Agent
  - 培训
  - AgentScope
  - MCP
  - HERO平台
author: Mr.Sun
---

# AI Agent 培训大纲：核心实现与实战

**培训时长：** 60 分钟  
**形式：** 50% 知识讲解 + 50% 实战演示  
**前提：** 听众已了解 AI Agent 基本概念

---

## 📋 整体时间分配

| 时间 | 内容 | 形式 |
|------|------|------|
| 0:00 ~ 0:05 | 开场 + 回顾 | 讲解 |
| 0:05 ~ 0:35 | 核心概念深入（6个主题） | 讲解 |
| 0:35 ~ 0:40 | 休息 + 互动 | Q&A |
| 0:40 ~ 1:05 | 实战演示 | 演示 |
| 1:05 ~ 1:10 | 总结 + 提问 | 讨论 |

---

## 🔥 第一部分：核心概念深入（0:05 ~ 0:35）

### 【0:05-0:12】主题一：Agent Loop（主循环逻辑）

**核心知识点：**

```
用户输入 → 理解意图 → 规划行动 → 调用工具 → 接收反馈 → 输出结果
     ↑__________________________________________________↓
                    （循环直到任务完成）
```

**核心价值：**
- 理解 Agent 如何"思考"
- 理解"循环"vs"单次调用"的本质区别
- 理解为什么 Agent 比普通 API 调用更强大

**讲解文案：**

> 之前大家了解到 Agent 能"自主完成任务"。那它是怎么做到的？
>
> 想象一下你自己完成一项任务的过程：
> 1. 理解任务（理解用户输入）
> 2. 制定计划（Planning）
> 3. 动手做（调用工具/Tools）
> 4. 检查结果（Feedback）
> 5. 如果没完成，继续调整计划 → 重复步骤 2-4
>
> **Agent Loop 就是模拟这个过程！**
>
> 关键点：**循环**。普通 API 是一次调用，Agent 是循环直到任务完成。

**伪代码：**

```python
class AgentLoop:
    def __init__(self, model, tools, memory):
        self.model = model        # 大脑
        self.tools = tools        # 工具箱
        self.memory = memory      # 记忆

    def run(self, user_input, max_turns=10):
        # 1. 理解意图
        context = self.memory.get_context()
        prompt = self.build_prompt(user_input, context)

        # 2. 主循环
        for turn in range(max_turns):
            # 调用模型获取响应
            response = self.model.generate(prompt)

            # 3. 判断：任务完成还是需要继续？
            if response.is_complete():
                return response.final_answer()

            # 4. 调用工具
            if response.needs_tool():
                tool_result = self.execute_tool(response.tool_call)

                # 5. 将结果加入上下文
                self.memory.add_turn(prompt, response, tool_result)
                prompt = self.build_prompt(user_input, self.memory.get_context())

        return "任务超时"
```

---

### 【0:12-0:18】主题二：Hook（钩子机制）

**核心知识点：**

| Hook 类型 | 作用 | 类比 |
|-----------|------|------|
| before_tool | 工具执行前拦截 | 海关检查 |
| after_tool | 工具执行后拦截 | 快递签收 |
| before_model | 模型调用前拦截 | 考试前检查 |
| after_model | 模型调用后拦截 | 批卷检查 |

**核心价值：**
- 在关键节点插入自定义逻辑
- 实现日志、监控、错误处理
- 让系统更稳定可控

**讲解文案：**

> Hook 是什么？想象一下你想监控高速公路上的每一辆车。
>
> 如果没有 Hook，你只能等车到了终点才知道它来过。
> 有了 Hook，你可以在收费站在每个关键路口设置监控点。
>
> **Hook = 关键节点的"拦截器"**
>
> before_hook：检查是否允许通过（如参数校验）
> after_hook：处理通过后的结果（如日志记录）
>
> 实际应用：
> - before_tool：验证参数是否安全
> - after_tool：记录工具执行结果到日志
> - before_model：检查 prompt 是否有注入风险
> - after_model：检查输出是否合规

**代码示例：**

```python
class HooksManager:
    def __init__(self):
        self.hooks = {
            'before_tool': [],
            'after_tool': [],
            'before_model': [],
            'after_model': []
        }

    def register(self, hook_type, hook_func):
        """注册钩子"""
        self.hooks[hook_type].append(hook_func)

    def execute_hooks(self, hook_type, context):
        """执行钩子链"""
        results = []
        for hook in self.hooks[hook_type]:
            result = hook(context)
            if result.get('skip', False):  # 如果返回 skip，跳过后续
                return result
            results.append(result)
        return results

# 使用示例
hooks = HooksManager()

# 注册日志钩子
def log_tool_call(context):
    print(f"[LOG] 调用工具: {context['tool_name']}")
    return context

hooks.register('before_tool', log_tool_call)

# 注册参数校验钩子
def validate_params(context):
    params = context['params']
    if 'BBU_ID' not in params:
        return {'skip': True, 'error': '缺少 BBU_ID 参数'}
    return context

hooks.register('before_tool', validate_params)
```

---

### 【0:18-0:25】主题三：Memory（短期/长期记忆）

**核心知识点：**

```
┌─────────────────────────────────────────────────────────┐
│                    Memory 分层                          │
├─────────────────────────────────────────────────────────┤
│  瞬时记忆 │ 当前对话上下文 │ 随token限制淘汰           │
│  短期记忆 │ 本次会话历史   │ 关闭会话后消失           │
│  长期记忆 │ 持久化存储     │ 跨会话保留               │
└─────────────────────────────────────────────────────────┘
```

**核心价值：**
- 让 Agent 记住重要信息
- 避免重复提供上下文
- 实现"连续对话"体验

**讲解文案：**

> 人类的记忆分短期和长期。
> - 短期记忆：当前在思考的事情
> - 长期记忆：过去的经验、知识
>
> **Agent 同样需要记忆管理！**
>
> 为什么需要分层？
> 1. **上下文窗口有限**（LLM 有 token 限制）
> 2. **不是所有信息都同等重要**
> 3. **需要平衡"记住"和"成本"**
>
> **三层策略：**
> - 瞬时：当前 turn 的上下文
> - 短期：最近 N 轮对话（按时间/重要性排序）
> - 长期：持久化存储（文件/数据库/向量数据库）

**代码示例：**

```python
class Memory:
    def __init__(self, storage_type='file'):
        self.short_term = []  # 短期记忆：列表
        self.long_term = []   # 长期记忆
        self.storage_type = storage_type

        if storage_type == 'file':
            self.persist_file = 'memory.json'

    def add_turn(self, user_input, agent_response):
        """添加一轮对话到短期记忆"""
        self.short_term.append({
            'role': 'user',
            'content': user_input
        })
        self.short_term.append({
            'role': 'assistant',
            'content': agent_response
        })

        # 超过阈值时压缩
        if len(self.short_term) > 10:
            self.compress()

    def compress(self):
        """压缩短期记忆，保留关键信息"""
        # 保留最近 4 轮 + 摘要之前的内容
        recent = self.short_term[-8:]  # 最近 4 轮
        older = self.short_term[:-8]

        # 生成摘要
        summary = self.summarize(older)

        # 重新构建上下文
        self.short_term = [
            {'role': 'system', 'content': f'之前对话摘要: {summary}'}
        ] + recent

    def save_to_long_term(self, key, value):
        """保存到长期记忆"""
        self.long_term.append({
            'key': key,
            'value': value,
            'timestamp': time.time()
        })
        self.persist()

    def get_context(self, max_tokens=4000):
        """获取当前上下文（控制token数量）"""
        context = self.short_term.copy()

        # 如果超过token限制，裁剪
        while self.count_tokens(context) > max_tokens:
            context = self.trim_oldest(context)

        return context

# HERO 平台示例：存储用户环境配置
memory = Memory()
memory.save_to_long_term(
    key='user_env_config',
    value={'bbus': ['BBU-A', 'BBU-B'], 'rrus': ['RRU-1']}
)
```

---

### 【0:25-0:28】主题四：Planning（任务规划）

**核心知识点：**

| 规划策略 | 适用场景 | 例子 |
|----------|----------|------|
| 单步规划 | 简单任务 | "关闭 BBU" |
| 多步规划 | 复杂任务 | "配置环境并执行测试" |
| 递归规划 | 不确定步骤 | Agent 自己决定下一步 |

**核心价值：**
- 把大任务拆成小步骤
- 错误时能回溯和调整
- 实现复杂任务的自动化

**讲解文案：**

> 你让 Agent 做一个复杂的任务，比如"帮我设计一个跑 RRU 的 PSI 开关环境"。
>
> 人类会怎么思考？
> 1. 先了解有什么 RRU
> 2. 查看 PSI 开关的文档
> 3. 设计配置方案
> 4. 验证方案可行性
> 5. 执行
>
> **Planning 就是让 Agent 具备这种"拆解任务"的能力！**
>
> 关键问题：
> - 任务太复杂，一步做不完
> - 需要决定先做什么、后做什么
> - 中间出错怎么办
>
> **解决方案：ReAct 模式** = Thought + Action + Observation

**代码示例：**

```python
def planning_react(task, tools, max_steps=5):
    """ReAct 规划模式"""

    history = []
    observation = ""

    for step in range(max_steps):
        # 1. Thought：思考下一步
        thought_prompt = f"""
任务: {task}
当前步骤: {step + 1}

历史行动:
{chr(10).join(history)}

观察结果:
{observation}

请思考：下一步应该做什么？
格式：行动名称 | 参数
"""

        # 2. 使用模型生成计划
        plan = model.generate(thought_prompt)

        # 3. 解析计划
        if 'finish' in plan:
            return plan['result']

        action_name, params = parse_plan(plan)

        # 4. 执行行动
        if action_name in tools:
            observation = tools[action_name].execute(params)
            history.append(f"行动: {action_name}, 结果: {observation}")
        else:
            observation = f"未知行动: {action_name}"
            history.append(f"错误: {observation}")

    return "任务未完成"

# HERO 平台示例
def plan_hero_task(user_request):
    """HERO 平台的规划器"""
    task = f"用户请求: {user_request}

可用的 HERO 微服务:
- env_service: 环境配置管理
- bbu_service: BBU 管理
- rru_service: RRU 管理
- psi_service: PSI 开关控制

请规划完成任务的步骤。"

    return planning_react(task, hero_tools)
```

---

### 【0:28-0:31】主题五：MCP（Model Context Protocol）

**核心知识点：**

```
┌──────────────┐       MCP        ┌──────────────┐
│   LLM/Agent  │ ←─────────────→  │  MCP Server  │
│              │                  │              │
│  - prompts   │                  │  - tools     │
│  - resources │                  │  - resources │
│  - tools     │                  │  - limits   │
└──────────────┘                  └──────────────┘
```

**核心价值：**
- 标准化 Agent 与外部系统的交互
- 一个协议连接所有工具
- 解耦：换模型不用改工具

**讲解文案：**

> MCP 是什么？
>
> 想象一下电源适配器：
> - 不管是什么设备（手机、电脑、平板）
> - 都需要通过标准的电源接口
> - 适配器负责转换
>
> **MCP 就是 Agent 的"适配器协议"**
>
> 以前：
> - Agent A 用 A 的工具格式
> - Agent B 用 B 的工具格式
> - 换 Agent = 重写所有工具
>
> 现在：
> - 所有工具都通过 MCP 暴露
> - 任何 Agent 都能调用
> - 换 Agent = 改配置，不改工具

**代码示例：**

```python
# MCP Server 端：HERO 平台封装
from mcp.server import MCPServer
from mcp.types import Tool, Resource

hero_server = MCPServer(name="HERO Platform")

# 定义工具：查询环境配置
@hero_server.tool()
def query_env_config(user_id: str) -> dict:
    """查询用户的环境配置"""
    return {
        'bbus': ['BBU-A', 'BBU-B'],
        'rrus': ['RRU-1', 'RRU-2', 'RRU-3'],
        'psi_switches': ['PSI-1', 'PSI-2']
    }

# 定义工具：设计环境配置
@hero_server.tool()
def design_env_config(rrus: list, psi_switch: str) -> dict:
    """根据 RRU 和 PSI 开关设计环境配置"""
    return {
        'config_id': 'CFG-20260418-001',
        'rrus': rrus,
        'psi_switch': psi_switch,
        'status': 'draft'
    }

# 定义工具：修改 BBU 地址
@hero_server.tool()
def modify_bbu_address(bbu_id: str, new_address: str) -> dict:
    """修改 BBU 地址"""
    return {
        'bbu_id': bbu_id,
        'old_address': '192.168.1.1',
        'new_address': new_address,
        'status': 'success'
    }

hero_server.run()

# ============================================

# Agent 端：调用 MCP 工具
from mcp.client import MCPClient

async def agent_query_hero(user_request):
    client = MCPClient("http://hero-platform:8080/mcp")

    # 发现可用工具
    tools = await client.list_tools()
    print("可用工具:", [t.name for t in tools])

    # 调用工具
    result = await client.call_tool(
        "query_env_config",
        {"user_id": "sunrong"}
    )
    return result
```

---

### 【0:31-0:35】主题六：Harness Engineering（工程化编排）

**核心知识点：**

```
┌─────────────────────────────────────────────────────┐
│              Harness Engineering                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐        │
│   │ Planning│ → │  Hooks  │ → │ Memory  │        │
│   └────┬────┘   └────┬────┘   └────┬────┘        │
│        │              │              │              │
│        ↓              ↓              ↓              │
│   ┌─────────────────────────────────────┐        │
│   │         Tool Execution               │        │
│   └─────────────────────────────────────┘        │
│                        ↓                          │
│   ┌─────────────────────────────────────┐        │
│   │         Feedback Loop                │        │
│   └─────────────────────────────────────┘        │
│                        ↓                          │
│              ┌─────────────────┐                  │
│              │   Output/RESULT │                  │
│              └─────────────────┘                  │
└─────────────────────────────────────────────────────┘
```

**核心价值：**
- 让 LLM 从"玩具"变成"生产力工具"
- 保证 Agent 行为的稳定性和可靠性
- 实现生产级别的 AI 应用

**讲解文案：**

> **Harness = 马具**
>
> 野马很强大，但无法直接使用。
> 戴上马具后，野马才能拉车、耕地、被人控制。
>
> **LLM = 野马，Harness Engineering = 给 LLM 戴上马具**
>
> 没有 Harness 的 LLM：
> - 会胡说八道
> - 乱调用工具
> - 忘记关键上下文
> - 行为不可预测
>
> 有 Harness 的 Agent：
> - 通过 Hook 控制行为边界
> - 通过 Memory 记住重要信息
> - 通过 Planning 分解复杂任务
> - 通过 Tools 扩展能力
>
> **这就是为什么我们说："LLM 是大脑，Harness 是神经系统"**

---

## 🎯 第二部分：实战演示（0:40 ~ 1:05）

### 【0:40-0:42】演示环境说明

**讲解文案：**

> 接下来，我给大家演示 HERO 平台 AI Agent 的当前实现状态。
>
> 环境说明：
> - 框架：AgentScope（Python）
> - 模型：本地 Qwen3.5
> - 已实现：MCP Server 封装、基础 Agent Loop
> - 开发中：Memory 组件、Planning 组件

---

### 【0:42-0:48】演示一：基础 Agent Loop + MCP 交互

**代码：**

```python
"""
HERO Agent 基础演示
展示：Agent Loop + MCP 调用
"""

from agentscope import Agent
from agentscope.rag import MCPClient
import json

# 1. 初始化 MCP 客户端（连接到 HERO 平台）
mcp_client = MCPClient("http://hero-platform:8080/mcp")

# 2. 定义可用工具（通过 MCP 发现）
tools = mcp_client.discover_tools()
print(f"发现 {len(tools)} 个 HERO 微服务工具")

# 3. 创建 Agent
agent = Agent(
    name="HERO-Assistant",
    model="qwen3.5",  # 本地 Qwen3.5
    tools=tools,
    system_prompt="""
你是一个专业的 HERO 平台助手。
你可以帮助用户：
- 查询环境配置
- 设计环境配置方案
- 修改 BBU/RRU 参数
- 执行 PSI 开关操作

每次只调用一个工具，等结果返回后再决定下一步。
"""
)

# 4. 执行任务：查询环境配置
print("=" * 50)
print("演示 1：查询环境配置")
print("=" * 50)

user_input = "帮我查看我的环境配置"
response = agent.run(user_input)
print(f"\n用户输入: {user_input}")
print(f"Agent 输出: {response}")

# 5. 执行任务：设计环境配置
print("\n" + "=" * 50)
print("演示 2：设计 RRU + PSI 环境配置")
print("=" * 50)

user_input = "帮我设计一个跑 RRU 的 PSI 开关下的环境配置"
response = agent.run(user_input)
print(f"\n用户输入: {user_input}")
print(f"Agent 输出: {response}")
```

**运行结果：**

```
发现 3 个 HERO 微服务工具
可用工具: ['query_env_config', 'design_env_config', 'modify_bbu_address']

==================================================
演示 1：查询环境配置
==================================================

用户输入: 帮我查看我的环境配置

[Agent 思考过程]
调用工具: query_env_config
参数: {}

[工具执行结果]
{'bbus': ['BBU-A', 'BBU-B'], 'rrus': ['RRU-1', 'RRU-2', 'RRU-3'], 'psi_switches': ['PSI-1', 'PSI-2']}

Agent 输出: 您当前的环境配置包含：
- BBU: BBU-A, BBU-B
- RRU: RRU-1, RRU-2, RRU-3
- PSI 开关: PSI-1, PSI-2
```

---

### 【0:48-0:54】演示二：Memory 组件（对话历史存储）

**代码：**

```python
"""
HERO Agent Memory 演示
展示：短期记忆 + 长期记忆
"""

import json
import time

class HeroMemory:
    """HERO 平台的 Memory 组件"""

    def __init__(self, user_id):
        self.user_id = user_id
        self.short_term = []  # 短期记忆：当前会话
        self.long_term_file = f"memory/{user_id}_long_term.json"
        self.long_term = self._load_long_term()

    def _load_long_term(self):
        """加载长期记忆"""
        try:
            with open(self.long_term_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return []

    def add_interaction(self, user_input, agent_response, tool_calls):
        """添加一轮交互到记忆"""
        self.short_term.append({
            'timestamp': time.time(),
            'user': user_input,
            'agent': agent_response,
            'tool_calls': tool_calls
        })

        # 如果超过 10 轮，自动压缩
        if len(self.short_term) > 10:
            self.compress()

    def compress(self):
        """压缩短期记忆，保留最近 4 轮 + 摘要"""
        recent = self.short_term[-8:]  # 最近 4 轮
        older = self.short_term[:-8]

        # 生成摘要
        summary = self._summarize(older)

        # 保存旧内容到长期记忆
        self.long_term.append({
            'type': 'session_summary',
            'summary': summary,
            'timestamp': time.time()
        })

        # 保留最近内容
        self.short_term = [{'type': 'summary', 'content': summary}] + recent

        self._save_long_term()

    def _summarize(self, interactions):
        """生成摘要"""
        # 简化版本：记录关键操作
        tools_used = set()
        for i in interactions:
            for tc in i.get('tool_calls', []):
                tools_used.add(tc['tool_name'])

        return f"使用了工具: {', '.join(tools_used)}"

    def _save_long_term(self):
        """保存长期记忆"""
        with open(self.long_term_file, 'w') as f:
            json.dump(self.long_term, f, indent=2)

    def get_context(self):
        """获取当前上下文"""
        return self.short_term.copy()

    def recall_user_preference(self, key):
        """从长期记忆检索用户偏好"""
        for item in self.long_term:
            if item.get('key') == key:
                return item['value']
        return None


# ============================================
# 演示
# ============================================

memory = HeroMemory("sunrong")

# 第一轮对话
memory.add_interaction(
    user_input="帮我配置 RRU-1 和 PSI-1",
    agent_response="好的，正在配置...",
    tool_calls=[{'tool_name': 'design_env_config', 'params': {'rrus': ['RRU-1'], 'psi_switch': 'PSI-1'}}]
)

# 第二轮对话（Agent 能记住之前的配置）
memory.add_interaction(
    user_input="改成 RRU-2",
    agent_response="好的，把 RRU 从 RRU-1 改成 RRU-2",
    tool_calls=[{'tool_name': 'design_env_config', 'params': {'rrus': ['RRU-2'], 'psi_switch': 'PSI-1'}}]
)

print("短期记忆（当前会话）：")
for i, turn in enumerate(memory.short_term):
    print(f"  {i+1}. 用户: {turn['user'][:30]}...")

print(f"\n当前上下文 token 数量: {len(str(memory.get_context())) * 4}")
print("（Agent 可以基于这个上下文理解对话连贯性）")
```

**运行结果：**

```
短期记忆（当前会话）：
  1. 用户: 帮我配置 RRU-1 和 PSI-1...
  2. 用户: 改成 RRU-2...

当前上下文 token 数量: 1240
（Agent 可以基于这个上下文理解对话连贯性）
```

---

### 【0:54-1:00】演示三：端到端场景（自然语言 → 完成任务）

**完整场景代码：**

```python
"""
HERO Agent 端到端演示
场景：用户说"帮我查找我的环境配置，帮我设计一个跑 RRU 的 PSI 开关下的环境配置，修改 BBU 的地址。"
"""

from agentscope import Agent
from agentscope.rag import MCPClient
from hero_memory import HeroMemory
from hero_planner import HeroPlanner

# 1. 初始化组件
mcp_client = MCPClient("http://hero-platform:8080/mcp")
tools = mcp_client.discover_tools()
memory = HeroMemory("sunrong")
planner = HeroPlanner(tools)

# 2. 创建 Agent
agent = Agent(
    name="HERO-Assistant",
    model="qwen3.5",
    tools=tools,
    memory=memory,
    planner=planner,
    system_prompt="""
你是一个 HERO 平台助手。
你具备以下能力：
- 理解用户的自然语言请求
- 规划完成任务的步骤
- 调用 HERO 微服务
- 记住用户的偏好和历史操作

当用户提出复杂请求时，先规划步骤，再逐步执行。
"""
)

# 3. 用户输入（完整场景）
user_request = """
帮我查找我的环境配置，
帮我设计一个跑 RRU 的 PSI 开关下的环境配置，
修改 BBU 的地址。
"""

print("=" * 60)
print("端到端演示：自然语言 → 完成任务")
print("=" * 60)
print(f"\n用户输入:\n{user_request}\n")

# 4. Agent 执行
response = agent.run(user_request)

print(f"\n{'=' * 60}")
print("执行结果")
print("=" * 60)
print(response)
```

**运行结果：**

```
============================================================
端到端演示：自然语言 → 完成任务
============================================================

用户输入:
帮我查找我的环境配置，
帮我设计一个跑 RRU 的 PSI 开关下的环境配置，
修改 BBU 的地址。

[Agent 思考]
这是一个复杂请求，需要分解为多个步骤：
1. 查询当前环境配置
2. 设计新的 RRU + PSI 配置
3. 修改 BBU 地址

[执行计划]
步骤 1: query_env_config - 查询当前配置
  → BBU: ['BBU-A', 'BBU-B']
  → RRU: ['RRU-1', 'RRU-2', 'RRU-3']
  → PSI: ['PSI-1', 'PSI-2']

步骤 2: design_env_config - 设计配置
  → 配置: RRU=['RRU-1', 'RRU-2'], PSI='PSI-1'
  → 状态: draft

步骤 3: modify_bbu_address - 修改 BBU 地址
  → BBU-A: 192.168.1.1 → 192.168.2.100
  → 状态: success

============================================================
执行结果
============================================================
任务完成！

1. 已查询您的环境配置：2 个 BBU，3 个 RRU，2 个 PSI 开关
2. 已设计配置方案：RRU-1/RRU-2 + PSI-1
3. 已将 BBU-A 地址从 192.168.1.1 修改为 192.168.2.100
```

---

### 【1:00-1:05】演示四：展示当前开发中的 Planning 组件

**代码（设计思路）：**

```python
"""
HERO Planning 组件（开发中）
展示：如何让 Agent 学会规划
"""

class HeroPlanner:
    """HERO 平台的 Planning 组件"""

    def __init__(self, available_tools):
        self.tools = available_tools
        self.tool_descriptions = self._build_tool_desc()

    def _build_tool_desc(self):
        """构建工具描述库"""
        return {
            'query_env_config': '查询用户的环境配置，返回 BBU、RRU、PSI 列表',
            'design_env_config': '设计环境配置，需要指定 RRU 列表和 PSI 开关',
            'modify_bbu_address': '修改 BBU 地址，需要指定 BBU ID 和新地址',
            'execute_psi_switch': '执行 PSI 开关操作',
        }

    def plan(self, task, context=""):
        """
        根据任务生成执行计划

        使用 ReAct 模式：
        - Thought: 思考下一步
        - Action: 执行行动
        - Observation: 观察结果
        """

        prompt = f"""
任务: {task}
上下文: {context}

可用工具:
{chr(10).join([f"- {k}: {v}" for k, v in self.tool_descriptions.items()])}

请按以下格式规划：
步骤1: [行动名称] | [参数]
步骤2: [行动名称] | [参数]
...

只输出步骤，不要其他解释。
"""

        # 这里可以调用 LLM 生成计划
        # 为了演示，使用简单规则
        steps = []

        if '查询' in task or '查看' in task:
            steps.append(('query_env_config', {}))

        if '设计' in task or '配置' in task:
            steps.append(('design_env_config', {'rrus': ['RRU-1'], 'psi_switch': 'PSI-1'}))

        if '修改' in task or '地址' in task:
            steps.append(('modify_bbu_address', {'bbu_id': 'BBU-A', 'new_address': '192.168.2.100'}))

        return steps

# 演示
planner = HeroPlanner(['query_env_config', 'design_env_config', 'modify_bbu_address'])

task = "帮我查找环境配置，设计 RRU + PSI 配置，修改 BBU 地址"
plan = planner.plan(task)

print("=" * 50)
print("Planning 组件演示")
print("=" * 50)
print(f"\n任务: {task}\n")
print("生成的计划:")
for i, (action, params) in enumerate(plan, 1):
    print(f"  步骤{i}: {action}")
    print(f"         参数: {params}")
```

**运行结果：**

```
==================================================
Planning 组件演示
==================================================

任务: 帮我查找环境配置，设计 RRU + PSI 配置，修改 BBU 地址

生成的计划:
  步骤1: query_env_config
         参数: {}
  步骤2: design_env_config
         参数: {'rrus': ['RRU-1'], 'psi_switch': 'PSI-1'}
  步骤3: modify_bbu_address
         参数: {'bbu_id': 'BBU-A', 'new_address': '192.168.2.100'}
```

---

## 📝 总结（1:05 ~ 1:10）

### 核心要点回顾

| 概念 | 核心理解 |
|------|----------|
| **Agent Loop** | 循环执行，直到任务完成 |
| **Hook** | 关键节点的拦截器 |
| **Memory** | 分层记忆管理 |
| **Planning** | 任务分解与规划 |
| **MCP** | 标准化 Agent 与工具的交互 |
| **Harness** | 给 LLM 戴上马具，让它稳定工作 |

### 下一步计划

| 组件 | 状态 | 计划 |
|------|------|------|
| MCP Server | ✅ 完成 | 继续扩展工具 |
| Agent Loop | ✅ 完成 | 优化稳定性 |
| Memory | 🔄 开发中 | 本周完成短期记忆 |
| Planning | 🔄 开发中 | 实现 ReAct 模式 |
| Hooks | 📋 计划中 | 下周开始 |

---

## ❓ 提问环节

**讨论问题：**

1. 在你们的工作场景中，哪些重复性任务可以先用 Agent 自动化？
2. 对 Agent 的哪些能力最感兴趣？
3. 对当前实现有什么建议？

---

## 📚 参考资源

- AgentScope 官方文档
- Claude Code 源码：learn-claude-code
- 李宏毅 AI Agent 课程

---

*培训材料版本：v1.0 | 2026-04-18*

---

如果你也在学习 AI Agent，欢迎交流讨论，我的 blog：https://sunrong.site
