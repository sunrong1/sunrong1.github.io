---
icon: code-branch
date: 2026-08-14
update: 2026-08-14
categories:
  - AI 应用
tags:
  - AgentScope
  - Middleware
  - System Prompt
  - 实战
  - 动态注入
  - on_system_prompt
star: true

author: Mr.Sun
---

# AgentScope 实战：用 `on_system_prompt` Middleware 实现动态 Prompt 注入

> 上一篇讲了"为什么需要动态 prompt"和"3 大关键参数调优"。本文聚焦**怎么在 AgentScope 里**把动态 prompt 实现好——**用 `on_system_prompt` middleware**。

<!-- more -->

> **TL;DR**：AgentScope 提供了 `on_system_prompt` middleware hook——**专为动态 prompt 设计**。3 个核心 insight：
> 1. **静态 base + 动态 injection 分离**——**base 在 `__init__` 传**——**dynamic 在 middleware 改**
> 2. **Middleware 是 transformer pattern**——**输入 prompt**——**输出新 prompt**——**可以链式**
> 3. **3 层注入**（base / project / runtime）——**对应 3 个 middleware**

## 一、AgentScope 的 System Prompt 流程

**`_agent.py:2784-2807`** 完整流程：

```python
async def _get_system_prompt(self) -> str:
    """Get the system prompt of the agent."""
    prompt = [self._system_prompt]  #  /  /  1. 静态 base

    #  /  /  2. 自动追加：skill instructions
    skill_instructions = await self.toolkit.get_skill_instructions(...)
    if skill_instructions:
        prompt.append(skill_instructions)

    #  /  /  3. 自动追加：offloader instructions
    if isinstance(self.offloader, WorkspaceBase):
        offload_instructions = await self.offloader.get_instructions()
        if offload_instructions:
            prompt.append(offload_instructions)

    result = "\n".join(prompt)

    #  /  /  4. 关键：middleware 链（transformer pattern）
    for mw in self._system_prompt_middlewares:
        result = await mw.on_system_prompt(self, result)

    return result
```

**4 步流程**：

| 步骤 | 内容 | 来源 |
|---|---|---|
| 1. 静态 base | `__init__(system_prompt=...)` | 不可变 |
| 2. Skill 指令 | `toolkit.get_skill_instructions()` | 自动 |
| 3. Offloader 指令 | `offloader.get_instructions()` | 自动 |
| 4. **Middleware 链** | `on_system_prompt(prompt)` | **可扩展** |

**关键洞察**：**第 4 步就是动态注入的入口**。

## 二、3 种实现动态 Prompt 的方式

### 方式 1：直接改 `system_prompt`（最简单）

```python
from agentscope.agent import ReActAgent
from agentscope.model import DashScopeChatModel
from agentscope.tool import Toolkit

agent = ReActAgent(
    name="Friday",
    system_prompt="你是助手。",  #  /  /  静态
    model=DashScopeChatModel(model_name="qwen-max", api_key="..."),
    toolkit=Toolkit([]),
)
```

**适用**：单用户 / 单项目 / 简单场景。

### 方式 2：每次调用前修改（动态但绕）

```python
#  /  /  ❌ 不好：每次都重建 agent
def handle_request(current_bom):
    agent = ReActAgent(
        system_prompt=build_system_prompt(current_bom),  #  /  /  重建
        ...
    )
    return await agent.reply(...)
```

**问题**：浪费——**每次都重建 agent + 重载 model**。

### 方式 3：on_system_prompt middleware（✅ 推荐）

```python
#  /  /  ✅ 好：1 个 agent + 1 个 middleware
class ProjectContextMiddleware:
    """动态注入项目上下文到 system prompt。"""
    
    def __init__(self, project_resolver):
        self._resolver = project_resolver
    
    async def on_system_prompt(self, agent, prompt: str) -> str:
        """在 agent 调用 LLM 前，动态改写 system prompt。"""
        #  /  /  从外部上下文（DB / Redis / config）查项目信息
        project = await self._resolver.get_current()
        
        if not project:
            return prompt  #  /  /  无项目上下文，原样返回
        
        return f"{prompt}

## 当前项目

- 项目：{project['name']}
- 版本：{project['version']}
- 模块：{project['module']}
- 关键变更：{project.get('keyChange', '无')}
"
```

**优势**：
- **不重建 agent**——**1 个 agent 服务所有用户**
- **动态查询**——**每次 reply 都拿最新项目信息**
- **链式**——**多个 middleware 叠加**

## 三、完整实战：3 层 Middleware 架构

### 3.1 架构图

```
ReActAgent 创建
  /  /  system_prompt="基础 prompt"  (静态)
  /  /  middlewares=[
  /  /    ProjectContextMiddleware(),    /  /  第 2 层：项目上下文
  /  /    RuntimeContextMiddleware(),   /  /  第 3 层：运行时
  /  /  ]

每次 reply() 调用
  /  /  _get_system_prompt()
  /  /    1. static base
  /  /    2. skill instructions
  /  /    3. offloader instructions
  /  /    4. ProjectContextMiddleware.on_system_prompt  /  /  动态项目
  /  /    5. RuntimeContextMiddleware.on_system_prompt   /  /  动态运行时
  /  /  → 最终 prompt
```

### 3.2 第 2 层：ProjectContextMiddleware

```python
from typing import Self
from agentscope.message import Msg


class ProjectContextMiddleware:
    """注入当前项目信息。"""
    
    def __init__(self, project_resolver):
        """
        Args:
            project_resolver: 可调用对象——返回当前项目信息
                例如：lambda: db.get_project(user_id)
        """
        self._resolver = project_resolver
    
    async def on_system_prompt(self, agent, prompt: str) -> str:
        project = self._resolver()
        
        if not project:
            return prompt
        
        return f"""{prompt}

## 当前项目

- 项目：{project.moduleName}
- B 版本：{project.bbom}
- C 版本：{project.cversion}
{f"- 关键变更：{project.keyChange}" if project.get('keyChange') else ''}
"""
```

### 3.3 第 3 层：RuntimeContextMiddleware

```python
import datetime


class RuntimeContextMiddleware:
    """注入运行时信息（时间 / 用户 / 时区）。"""
    
    def __init__(self, user_resolver):
        self._user_resolver = user_resolver
    
    async def on_system_prompt(self, agent, prompt: str) -> str:
        user = self._user_resolver()
        now = datetime.datetime.now().isoformat()
        
        return f"""{prompt}

## 运行时

- 用户：{user.userId}
- 角色：{user.role}
- 时间：{now}
"""
```

### 3.4 Agent 装配

```python
from agentscope.agent import ReActAgent
from agentscope.model import DashScopeChatModel
from agentscope.tool import Toolkit


def create_agent(user_id: str, project_resolver, user_resolver):
    """工厂函数——每次请求创建一个 agent 实例。"""
    return ReActAgent(
        name=f"agent-{user_id}",
        
        #  /  /  1. 静态 base（不可变）
        system_prompt="""你是一个专业、智能的平台助手。

你的核心职责是：
- 解答平台功能相关问题
- 协助用户完成流程操作
- 提供开发最佳实践建议

仅回答与开发相关的问题，对于平台外的问题请礼貌拒绝。""",
        
        model=DashScopeChatModel(
            model_name="qwen-max",
            api_key="...",
        ),
        toolkit=Toolkit([]),
        
        #  /  /  2. 关键：3 个 middleware（按顺序执行）
        middlewares=[
            ProjectContextMiddleware(project_resolver),  #  /  /  第 2 层
            RuntimeContextMiddleware(user_resolver),     #  /  /  第 3 层
        ],
    )
```

### 3.5 调用

```python
async def handle_request(user_id: str, message: str):
    #  /  /  resolver 是 lambda / callable——查 DB / Redis
    def project_resolver():
        return db.get_current_project(user_id)  #  /  /  dict
    
    def user_resolver():
        return db.get_user(user_id)  #  /  /  dict
    
    agent = create_agent(user_id, project_resolver, user_resolver)
    
    msg = await agent.reply(UserMsg("Bob", message))
    return msg.get_text_content()
```

**每次调用**——**system prompt 都动态生成**——**不重建 agent**。

## 四、关键设计点

### 4.1 Middleware 是 Transformer Pattern

```python
async def on_system_prompt(self, agent, prompt: str) -> str:
    #  /  /  输入：上一步的 prompt
    #  /  /  输出：改写后的 prompt（传给下一步）
    return new_prompt
```

**3 个特点**：
- **纯函数**——**不修改外部状态**
- **可链式**——**每个 middleware 输出给下一个**
- **可测试**——**独立测每个**

### 4.2 注入 vs 覆盖

```python
#  /  /  注入（推荐）：保留原 prompt + 加新内容
return f"{prompt}\n\n## 新内容"

#  /  /  覆盖（危险）：可能丢 base 知识
return "新内容"  #  /  /  ❌ 丢了基础 prompt
```

**总是注入**——**不覆盖**。

### 4.3 顺序很重要

```python
middlewares=[
    ProjectContextMiddleware(),  #  /  /  先：项目级（变化慢）
    RuntimeContextMiddleware(),  #  /  /  后：运行时（变化快）
]
```

**先慢后快**——**project 慢变化先加**——**runtime 快变化后加**——**每次 reply 都要重新跑**。

### 4.4 异步 + 异常

```python
async def on_system_prompt(self, agent, prompt: str) -> str:
    try:
        project = await self._resolver()  #  /  /  可能是 async
    except Exception as e:
        logger.warning(f"Failed to load project context: {e}")
        return prompt  #  /  /  失败不影响 reply——优雅降级
    
    return f"{prompt}\n\n{project}"
```

**W5-D1 我们学的 3 道防线**——**这里也用**——**context 加载失败 = 继续**。

## 五、3 个高级 Pattern

### 5.1 Pattern 1：缓存（项目级 cache）

```python
class CachedProjectContextMiddleware:
    """项目级 cache——避免每个 reply 都查 DB。"""
    
    def __init__(self, project_resolver, cache_ttl=60):
        self._resolver = project_resolver
        self._ttl = cache_ttl
        self._cache = {}  #  /  /  user_id -> (project, timestamp)
    
    async def on_system_prompt(self, agent, prompt: str) -> str:
        #  /  /  从 agent 拿 user_id（约定在 name 里）
        user_id = agent.name.replace("agent-", "")
        now = time.time()
        
        if user_id in self._cache:
            project, ts = self._cache[user_id]
            if now - ts < self._ttl:
                return f"{prompt}\n\n## 项目\n{project}"
        
        #  /  /  cache miss——重新查
        project = await self._resolver(user_id)
        self._cache[user_id] = (project, now)
        return f"{prompt}\n\n## 项目\n{project}"
```

**节省**：每个 reply 省 1 次 DB 查询。

### 5.2 Pattern 2：阶段感知（不同 iter 不同 prompt）

```python
class StageAwareMiddleware:
    """不同 ReAct 阶段注入不同上下文。"""
    
    async def on_system_prompt(self, agent, prompt: str) -> str:
        #  /  /  从 agent state 拿 iter 阶段
        cur_iter = agent.state.cur_iter
        
        if cur_iter == 0:
            #  /  /  第 1 轮：告诉 agent 当前项目
            return f"{prompt}\n\n## 阶段\n刚开始——先理解项目"
        
        elif cur_iter >= 10:
            #  /  /  深度推理：建议 agent 总结
            return f"{prompt}\n\n## 阶段\n已 10 轮——建议总结当前发现"
        
        return prompt
```

**高级**——**让 prompt 跟阶段动态变化**。

### 5.3 Pattern 3：权限隔离

```python
class RoleBasedMiddleware:
    """不同角色看到不同的项目信息。"""
    
    def __init__(self, project_resolver):
        self._resolver = project_resolver
    
    async def on_system_prompt(self, agent, prompt: str) -> str:
        user_id = agent.name.replace("agent-", "")
        project = await self._resolver(user_id)
        
        #  /  /  权限过滤
        if project.role == "viewer":
            #  /  /  只读角色：隐藏关键变更
            project.keyChange = "(已隐藏)"
        
        return f"{prompt}\n\n{project}"
```

**安全**——**同一 agent 不同权限**。

## 六、对比：3 种方式

| 方式 | 适用 | 性能 | 灵活 |
|---|---|---|---|
| **静态 system_prompt** | 单租户 / 单场景 | ⭐⭐⭐ | ⭐ |
| **每次重建 agent** | 极少（不要用） | ⭐ | ⭐⭐⭐ |
| **on_system_prompt middleware** | 多租户 / 多场景 | ⭐⭐ | ⭐⭐⭐ |

**结论**：**99% 场景用 middleware**。

## 七、调试技巧

**怎么看到底注入了什么**：

```python
import logging
logging.basicConfig(level=logging.DEBUG)

class DebugMiddleware:
    """打印所有 middleware 前后的 prompt。"""
    
    async def on_system_prompt(self, agent, prompt: str) -> str:
        logger.debug(f"[BEFORE] prompt:\n{prompt[:500]}...")
        result = f"{prompt}\n\nDEBUG: {datetime.now()}"
        logger.debug(f"[AFTER] prompt:\n{result[:500]}...")
        return result
```

**临时加上**——**看 prompt 长什么样**——**调好后删**。

## 八、对应你之前 TypeScript 代码

**你之前 TypeScript 写的 `buildSystemPrompt`**——**在 AgentScope 里就是 `ProjectContextMiddleware`**：

| 你之前 | AgentScope 替代 |
|---|---|
| `buildSystemPrompt(bom, moduleInfo)` | `ProjectContextMiddleware.on_system_prompt` |
| `currentBom` 参数 | `agent.name` 或 `agent.state` 里的属性 |
| `moduleInfo` 参数 | `self._resolver()` 动态查 DB |
| 字符串拼接 | `f"{prompt}\n\n{context}"` 注入 |
| 调用前重新 build | **不用重新 build**——middleware 自动跑 |

**TypeScript 写法 → Python 写法迁移**——**核心概念一致**。

## 九、W2-W5 框架知识

| 概念 | 在 on_system_prompt 里 |
|---|---|
| **W3 Middleware 钩子** | on_system_prompt 是 6 大 hook 之一 |
| **W3 State** | 从 `agent.state` 拿运行时信息 |
| **W5 Robustness ≠ Strictness** | 加载失败 = 继续 = 不阻塞 reply |
| **W4 Schema Cascade** | 静态 base + 动态层叠 = 同样的模式 |

**一句话**：**on_system_prompt 是 W3 middleware 钩子 + W4 Cascade 模式 + W5 Robustness 哲学的实战**。

## 十、致读者

**动态 system prompt 没那么神秘**——**就是 middleware**——**3 行核心代码**：
```python
async def on_system_prompt(self, agent, prompt: str) -> str:
    context = await self._resolver()
    return f"{prompt}\n\n{context}"  #  /  /  注入
```

**别再用静态 prompt**——**别再每次重建 agent**——**用 middleware**。

## 参考

- AgentScope 源码：`src/agentscope/agent/_agent.py:2784-2807`（`_get_system_prompt`）
- AgentScope 源码：`src/agentscope/agent/_agent.py:207-208`（middleware 注册）
- 上一篇：[System Prompt 动态注入 + 关键参数调优](https://sunrong.site/posts/ai-practice/ai-app/agentscope-system-prompt-and-key-params.html)
- W3 学习：[Agent 模块深潜](https://sunrong.site/posts/ai-practice/ai-app/agentscope-w3-agent-deep-dive.html)
