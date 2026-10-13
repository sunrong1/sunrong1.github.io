---
title: '把 AI 编程塞进 cron：夜间无人值守开发的三层设计与四个避坑点'
date: '2026-10-13'
tags:
  - Claude Code
  - 定时任务
  - cron
  - tmux
  - BMAD
  - 无人值守
  - AI Agent 编排
  - 工程自动化
categories:
  - AI 实践
icon: 🌙
author: Mr.Sun
---

# 把 AI 编程塞进 cron：夜间无人值守开发的三层设计与四个避坑点

> 把 Claude Code 挂到 cron 上，每晚 00:10 自动跑 BMAD 的 build 流程，早上看 commit。
>
> 这篇记的是**怎么让它真的能跑通**——三次翻车换来的。

***
## 💡 为什么做这件事

我白天用 Claude Code 跑 BMAD-METHOD 做项目。跑着跑着发现一个规律：

**长任务最花时间的地方不是"想"，是"等"。**

BMAD 的 build 流程跑一个 story 常常要十几分钟——大部分时间 agent 在读文件、编译、跑测试。这些环节**不需要人盯着**，但人必须守在旁边，因为一旦弹出确认框就卡死。

于是有个想法：**把不重要的等待时间挪到夜里。**

按 AI Agent 的计费方式算：

| 时段 | MiniMax 配额状态 | 适合干什么 |
|---|---|---|
| 09:00-12:00 | 白天工作，重 | 交互式开发（要人决策）|
| 12:00-14:00 | 午休，轻 | DeepSeek 半价 |
| 14:00-18:00 | 下午工作，重 | 交互式开发 |
| 18:00-24:00 | 下班后，轻 | DeepSeek 半价 |
| 00:10-05:00 | **睡觉时，全新** | **无人值守长任务** |

**凌晨跑的理由不是"便宜"，是"没人跟我抢窗口"。**

***
<!-- more -->
## 一、先说结论：三层设计

最终能跑通的方案是三层。每层解决一个具体问题。

```
┌─ cron ──────────────┐   什么时候跑
│  ├─ nightly-build.sh │   跑什么、怎么跑
│  │   └─ tmux 会话     │   进程活下来（关键）
│  │       └─ claude   │   真正干活
│  └─ 看门狗（后台子进程）│  卡住了自动放行
└────────────────────┘
```

配套两个配置文件，把「时间」和「任务」分开：

```
schedule.conf    # 几点跑（可以配多个时间点）
job.conf         # 跑什么（项目/后端/模型/任务内容）
```

一个管理脚本负责同步：

```bash
bmad-job status    # 看状态
bmad-job stop      # 停用（配置保留）
bmad-job start     # 启用
bmad-job edit      # 改时间点 → 自动同步
bmad-job job       # 改任务配置 → 自动同步
```

***
## 二、第一层：cron 负责"什么时候"

最简单的一行：

```cron
10 0 * * * /root/.claude/jobs/nightly-build.sh /root/repos/plants-game minimax >> /root/.claude/jobs/cron.log 2>&1
```

**为什么用 cron 而不是 `sleep` 循环**：

- 服务器重启、SSH 断开都不影响
- 不占资源（一次检查，一分钟一次）
- 失败会写日志

**但我踩了第一个坑。**

### 坑 1：直接覆盖 crontab 会干掉别人的任务

我第一次配置时直接 `crontab /tmp/cron-new`，结果把原有的这条干掉了：

```cron
*/5 * * * * flock -xn /tmp/stargate.lock -c '/usr/local/qcloud/stargate/admin/start.sh &'
```

这是腾讯云 stargate 的保活任务。**如果没发现，服务器可能在一段时间后被判定为空闲并回收。**

**正确做法**：改 crontab 前先备份，生成新内容时**只替换自己那段**。

我现在的做法是用标记对包起来：

```bash
# 停止：只删标记对之间的内容，别的原样保留
crontab -l | awk '
  /^# ===== BMAD nightly build =====$/ {skip=1; next}
  skip && /^# ===== end BMAD =====$/    {skip=0; next}
  skip {next}
  {print}
' | crontab -
```

**这条现在写进了 `sync-crontab.sh`，每次操作都带这层保护。**

***
## 三、第二层：tmux 负责"进程活下来"

这层是整个方案的关键。

### 为什么不能直接 `claude &`

cron 启动的进程是 cron 的子进程。**cron 一退出，子进程就收到信号。**

我第一版脚本写的是：

```bash
tmux new-session -d ...   # ← 这个是对的
```

如果图省事写成 `nohup claude &`，凌晨 2 点 cron 触发、2 点 01 分脚本结束，**Claude 也一起死了。**

### tmux 的三个好处

**1. 进程独立**——tmux 是守护进程，跟 cron 无关，会话一直活着。

**2. 你能 attach 进去**——这是我觉得最值的一点：

```bash
tmux attach -t nightly-001021
```

早上起来发现昨晚跑歪了，**直接进去接着调**，不用重来。

**3. 你能 capture 它的画面**——不用 attach 就能看进度：

```bash
tmux capture-pane -p -t nightly-001021 | tail -30
```

**我的 check-done.sh 就是靠这个做的状态汇报。**

### 会话命名：去掉年月日

一开始我用 `nightly-20261014-001021`，tmux 列表里密密麻麻看不清。

改成只留时分：

```bash
HHMMSS=$(date +%H%M%S)
SESSION="nightly-${HHMMSS}"
```

现在 `tmux ls` 出来是这样：

```
claude: 1 windows (created Thu Sep 10 15:34:42 2026)
game: 1 windows (created Mon Oct 12 16:03:21 2026)
nightly-001021: 1 windows    ← 一眼看出哪次跑的
```

***
## 四、第三层：多时间点 + 接力

### 为什么需要接力

MiniMax Token Plan 的 5 小时窗口固定在 `00/05/10/15/20` 整点重置。

假设 00:10 起跑，05:00 窗口重置——**任务最长只能跑 4 小时 50 分**。

长任务（比如全仓库重构）跑不完就撞墙。

### 接力怎么工作

在 05:00 窗口重置后再跑一次，但**不是新建会话，是复用**：

```cron
10 0 * * * /root/.claude/jobs/nightly-build.sh ...          # 新建会话
5  5 * * * CONTINUE=1 /root/.claude/jobs/nightly-build.sh ... # 接力续跑
```

`CONTINUE=1` 的逻辑：

```bash
if [[ "$CONTINUE" == "1" && -f "$JOBDIR/current-session" ]]; then
  PREV=$(cat "$JOBDIR/current-session")
  if tmux has-session -t "$PREV" 2>/dev/null; then
    SESSION="$PREV"        # 复用，不新建
    # 等上一轮跑完再发新任务
    ...
    exit 0
  fi
fi
```

**关键点**：接力不是"重开一轮"，而是**在原会话里继续**——上下文还在，不用重读代码。

**而且不会重复劳动**：如果 00:10 那班已经跑完退出了，接力会检测到会话不存在，**自动新建**。

### 时间点配置分离

我把配置拆成两个文件：

```
# schedule.conf — 只管时间
00:10
05:05
21:10
```

```
# job.conf — 只管任务
PROJECT_DIR=/root/repos/plants-game
BACKEND=minimax
MODEL=
TASK=
```

改时间不会碰任务配置，改模型不会碰时间点。

`sync-crontab.sh` 读这两个文件生成 crontab，还自动处理"第一个时间点新建 / 后续时间点接力"的逻辑：

```bash
if (( FIRST )); then
  printf "%d %d * * * %s/nightly-build.sh %s\n" "$M" "$H" ...
  FIRST=0
else
  printf "%d %d * * * CONTINUE=1 %s/nightly-build.sh %s\n" "$M" "$H" ...
fi
```

***
## 五、四个避坑点（都是翻车换来的）

### 坑 2：任务发不出去（最隐蔽的一个）

我第一版脚本是这样：

```bash
tmux send-keys -t "$SESSION" "cc-model minimax" Enter
sleep 25
tmux send-keys -t "$SESSION" "用 bmad-build-auto 实现 story 1-1" Enter
```

看起来没问题，但实测发现**任务消息发进去了，回车没生效**——Claude 界面显示了任务文本，但一直不处理。

**原因**：`sleep 25` 是瞎猜的。Claude 启动有时 8 秒，有时 40 秒（要拉插件、读 CLAUDE.md、初始化 MCP）。**发早了，Enter 就打在启动画面上。**

**修法：轮询就绪 + 两步确认**。

```bash
# ① 轮询等就绪（最多 120 秒）
READY=0
for i in $(seq 1 60); do
  sleep 2
  PANE=$(tmux capture-pane -p -t "$SESSION" | tail -6)
  if echo "$PANE" | grep -qE "❯" && ! echo "$PANE" | grep -qE "Retrying|用量上限"; then
    READY=1; break
  fi
done

# ② 文本分两步发：先粘文本，确认到了才回车
tmux send-keys -t "$SESSION" "$TASK"
sleep 1
CHECK=$(tmux capture-pane -p -t "$SESSION" | tail -4)
if echo "$CHECK" | grep -qF "${TASK:0:20}"; then
  tmux send-keys -t "$SESSION" Enter
else
  tmux send-keys -t "$SESSION" -l "$TASK"    # literal 模式兜底
  sleep 1
  tmux send-keys -t "$SESSION" Enter
fi

# ③ 再确认真的提交了
SENT=$(tmux capture-pane -p -t "$SESSION" | tail -6)
if echo "$SENT" | grep -qE "✻|Cooked|Thought"; then
  log "✅ 任务已提交"
fi
```

**修完之后的日志**：

```
[19:35:25] 启动: cc-model minimax --permission-mode auto --add-dir ...
[19:35:25] 等待 Claude 就绪...
[19:35:27] ✅ Claude 就绪（等待 1x2 秒）
[19:35:30] ✓ 任务文本已就位，回车提交
[19:35:33] ✅ 任务已提交，Claude 开始处理
```

**14 秒完成，每一步都有确认。**

### 坑 3：权限模式选错

无人值守场景下，Claude 会在这些地方停下来等你：

| 卡点 | 解决 |
|---|---|
| 文件编辑确认 | `--permission-mode auto` |
| 工具调用确认 | 同上 |
| BMAD 的菜单选择 | 看门狗（下面讲） |
| 429 配额满 | Claude Code 自动重试 10 次 |

`--permission-mode` 的可选值我查了二进制：

```
choices: "acceptEdits", "auto", "default", "plan"
```

**`auto` 是完全自动模式**，比 `acceptEdits` 更彻底——所有工具调用都不问。

启动后界面显示：

```
⛶⛶ auto mode on (shift+tab to cycle)
```

### 坑 4：卡在菜单选择

BMAD 的 skill 大量用菜单（"选 1 写 PRD / 2 拆 epics / 3 检查"）。`auto` 模式救不了这个——**菜单是要人做决策的**。

两个办法：

**A. 用 `bmad-build-auto`** —— BMAD 自带的无人值守版。

它跟普通 `build` 的差别在文件层面：

```
build:       step-01 → step-02 → step-03 → step-04 → step-05 + sync-sprint-status
build-auto:  step-01 → step-02 → step-03 → step-04
                                        ↑ 砍掉 step-05（交付给你看）和 sprint 回写
```

**B. 看门狗自动放行**

```bash
(
  ELAPSED=0
  while [[ $ELAPSED -lt $MAX_MINUTES ]]; do
    sleep 120
    tmux has-session -t "$SESSION" || exit 0

    SNAP1=$(tmux capture-pane -p -t "$SESSION" | tail -8)
    sleep 8
    SNAP2=$(tmux capture-pane -p -t "$SESSION" | tail -8)

    # 画面 8 秒完全没变 + 有光标 = 卡在确认框了
    if [[ "$SNAP1" == "$SNAP2" ]] && echo "$SNAP1" | grep -qE "❯|Yes|yes"; then
      tmux send-keys -t "$SESSION" Enter
      sleep 3
      # 还卡着就选 1
      if tmux capture-pane -p -t "$SESSION" | grep -qE "❯.*1\."; then
        tmux send-keys -t "$SESSION" "1" Enter
      fi
    fi
  done
) &
```

**为什么用"画面变化"判断卡住**：因为 LLM 思考时画面也不变，但**它会自己继续**。真正卡住的标志是画面长时间静止**且有选择提示符**。

***
## 六、多后端：让夜间任务有兜底

夜间跑任务的最大风险是**撞配额**。

我在服务器上接了三个后端：

```
▸ minimax    MiniMax-M3.1-Flash-Preview   订阅 · 5h 滚动窗口 + 周窗口
▸ qwen       qwen3.8-max / qwen3.8-flash  订阅 · 月额度 · 22:00-08:00 4 折
▸ deepseek   deepseek-v4-pro / deepseek-flash   按量 · 无窗口限制 · 空闲时段半价
```

**切换脚本的关键设计**：backend 配置注入 `claude --settings`，而不是改 `settings.json`。

因为实测发现 **`--settings` 的优先级高于 `settings.json`**：

```bash
# 测试 A：settings.json 里是 MiniMax-M3.1-Flash-Preview
#         --settings 里给 probe-model-x
#         → 报错说 probe-model-x，证明 --settings 赢
$ claude -p "hi" --settings '{"env":{"ANTHROPIC_MODEL":"probe-model-x"}}'
[claude-code:unrecognized_model] {"model":"probe-model-x"}
```

这带来一个好处——**三种启动方式共存**：

```bash
claude              # 走 settings.json 的默认（minimax）
cc-model minimax    # 显式切 minimax
cc-model qwen       # 显式切千问
```

切换脚本还带**时段提示**，一眼看出现在跑划不划算：

```bash
$ cc-model deepseek
🚀 deepseek / deepseek-v4-pro

⏰ 当前【高峰时段】🔴 DeepSeek 全价 · 空闲时段半价（09:00-12:00 / 14:00-18:00 为高峰）
   💡 18:00 后再跑同一个任务，费用直接砍半
```

**夜间跑任务时，这个提示告诉你"现在是空闲时段，半价生效中"。**

***
## 七、最终形态

```
/root/.claude/jobs/
├── schedule.conf       # 时间点（每行 HH:MM）
├── job.conf            # 任务配置
├── sync-crontab.sh     # 同步 + status/stop/start/edit/job
├── nightly-build.sh    # 主启动器（含接力 + 看门狗）
├── check-done.sh       # 早上汇报
├── cron.log            # cron 触发记录
└── run-*.log           # 每次运行详情
```

**crontab：**

```cron
*/5 * * * *  腾讯云 stargate 保活（原有的，别动）

# ===== BMAD nightly build =====
10 0 * * *  nightly-build.sh ...            # 00:10 新建
5  5 * * *  CONTINUE=1 nightly-build.sh ...  # 05:05 接力
30 8 * * *  check-done.sh ...                # 08:30 汇报
# ===== end BMAD =====
```

**早上 08:30 你会看到：**

```
═══════════ BMAD nightly build 状态检查 2026-10-15 08:30:00 ═══════════
会话: nightly-001021
启动于: 2026-10-15T00:10:35+08:00

🟡 状态: 会话仍在运行

─── 最后 30 行输出 ───
...

═══════════ 本次运行产生的 commit ═══════════
a1b2c3d  feat: story 1-1 消除吞异常
d4e5f6a  test: story 2-1 添加单元测试

═══════════ 所有历史日志 ═══════════
  Oct 15 00:10  run-20261015-001035.log
  Oct 14 00:10  run-20261014-001021.log
```

**没有 commit 就是没跑成功，有 commit 就是有效产出。** 这个判断标准比读日志快十倍。

***
## 八、如果让我重来

**第一天就该做的三件事**：

1. **先读 `man crontab`，别直接覆盖**。服务器上的 crontab 往往有别人的东西。

2. **不要用 `sleep` 等异步进程就绪**。用轮询 + 确认——我在这上面卡了两天。

3. **第一版就写日志**。我的脚本每次都 tee 到 `run-*.log`，调试时全靠它。如果没有日志，那两个 bug 我得重装一遍才能定位。

**最花时间的一件事**：

> 排查「任务发不出去」那个问题。表现是界面显示了任务但不处理，看起来像 Claude 挂了，实际是回车发早了。

**这种问题的排查方法**：`tmux capture-pane -p` 截屏看画面，比任何猜测都快。**能看见的东西不用推理。**

***
## 📚 参考

- [BMAD-METHOD 文档](https://docs.bmad-method.org/)
- [Claude Code Hooks 文档](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [MiniMax Token Plan FAQ](https://platform.minimax.io/docs/token-plan/faq)（5h 滚动窗口 + 周窗口机制）
- 阿里云百炼 Claude Code 接入文档（正确的 Anthropic 兼容端点）
- 本系列前文：《三模型协作实战》《一天掌握 BMAD-METHOD》

***
**作者**：Mr.Sun

11 年研发经验，主要做 AI Agent 平台相关的工作。AgentScope 上游有 PR，BMAD-METHOD 是这个系列三篇文章的原型。文中所有数字来自我这台机器的真实运行记录。个人 blog：[sunrong.site](https://sunrong.site/)

**版权**：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)，转载请保留作者信息与原文链接。
