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
## 四、第三层：多时间点（每班独立会话）

### 为什么要多时间点

一个时间点跑不透。MiniMax Token Plan 的 5 小时窗口固定在 `00/05/10/15/20` 整点重置——00:10 起跑，05:00 窗口重置，**最长只能跑 4 小时 50 分**。

拆成三班，每班独立跑：

```cron
10 0 * * *  nightly-build.sh ...   # 00:10
5  5 * * *  nightly-build.sh ...   # 05:05
0  20 * * *  nightly-build.sh ...  # 20:00
```

### 我一开始写了"接力"，后来删掉了

最初的设计是**接力**：05:05 那一班不新建会话，复用 00:10 那个继续跑（上下文还在，不用重读代码）。

```cron
5 5 * * * CONTINUE=1 nightly-build.sh ...   # ← 这行删了
```

**实测跑了一晚，发现两个问题**：

**问题 1：信号会跨会话累积**

看门狗判断"卡没卡"靠两个信号：session jsonl 的修改时间 + 项目文件 mtime。接力模式下，05:05 的班次复用了旧会话，**jsonl 是同一个文件**（一直在涨），但 `file` 时间是全局的。两次运行的信号混在一起，判定结果不可信。

**问题 2：旧会话的上下文会干扰判定**

接力模式下要等上一轮跑完，逻辑变成"轮询旧会话的画面 → 等它空闲 → 发新任务"。这套等待逻辑比"直接新建"复杂得多，还多了一类失败点。

**改成每班独立新建后，逻辑简单了一截**：

```bash
# 每次都是新会话，信号独立，判定干净
tmux new-session -d -s "$SESSION" -c "$PROJECT_DIR"
```

**三个时间点的会话名**（带时分秒，方便早上分辨）：

```
nightly-001021    ← 00:10 那班
nightly-050508    ← 05:05 那班
nightly-200003    ← 20:00 那班
```

### 配置分离

时间、任务、模型拆成三个文件：

```
schedule.conf   # 时间点（每行一个 HH:MM）
job.conf        # 项目 + 后端 + 模型
task.txt        # 任务内容（多行，随便写）
```

改任务只编辑 `task.txt`，不用碰脚本：

```bash
vim /root/.claude/jobs/task.txt
bmad-job start     # 同步到 crontab
```

`bmad-job` 的四个子命令：

```bash
bmad-job status    # 看当前状态（跑哪些时间点 + 配置在哪 + 最近运行）
bmad-job stop      # 停用（配置保留，随时 start 恢复）
bmad-job start     # 启用
bmad-job edit      # 编辑时间点 → 保存后自动同步
bmad-job job       # 编辑任务配置 → 保存后自动同步
```

**`stop` 是只删 crontab 里带标记的那一段，不是清空整个 crontab。**

***
## 五、看门狗迭代了四版（本文最长的部分）

看门狗的任务很简单：**发现 Claude 卡住了，按一下 Enter**。

但"怎么判断卡住了"这件事，我改了三版。前两版都误判。

***
### 第一版：看屏幕

最直觉的做法——截图两次，对比：

```bash
SNAP1=$(tmux capture-pane -p -t "$SESSION" | tail -8)
sleep 8
SNAP2=$(tmux capture-pane -p -t "$SESSION" | tail -8)
if [[ "$SNAP1" == "$SNAP2" ]] && echo "$SNAP1" | grep -qE "❯|Yes"; then
  tmux send-keys -t "$SESSION" Enter
fi
```

**问题**：画面静止 ≠ 卡住。Claude 跑长任务时画面也不动（它在等 LLM 返回，或者在跑 npm install）。第一版把"正常干活"判成了"卡住"，疯狂发 Enter。

**而且屏幕是渲染结果，会骗人**：终端重绘、光标闪烁、fullscreen TUI 切换都可能让对比逻辑误判。

***
### 第二版：加 CPU 采样

想补一个"进程是否在动"的信号：

```bash
C1=$(awk '{print $14+$15}' /proc/$PID/stat)
sleep 6
C2=$(awk '{print $14+$15}' /proc/$PID/stat)
CPU_DELTA=$(( C2 - C1 ))
```

**问题**：LLM 调用期间 Claude 进程**几乎不烧 CPU**（在等网络）。所以"CPU 没涨"恰恰是常态，跟卡没卡没关系。而且每轮检测要多 sleep 6 秒，三倍拖慢。

**这版我实测跑了一次，检测耗时从 0.085 秒变成 6 秒。**

***
### 第三版：读 session jsonl（关键突破）

Claude Code 会把**每一句话、每一次工具调用、每一份 token 用量**都写进一个 jsonl 文件：

```
~/.claude/projects/-root-repos-plants-game/<session-uuid>.jsonl
```

**这个文件每做一步就 append 一行**，格式是 JSON Lines（一行一个 JSON 对象）。这是硬信号，不是渲染结果。

我实测过任务完成时发空 Enter 的效果：

```
发之前 jsonl: 1244233 字节
发之后 jsonl: 1244233 字节   ← 完全没变
画面：无变化
```

**Claude Code 会忽略空 Enter**。所以误判的代价是零。

一个真实条目的样子：

```json
{
  "type": "assistant",
  "timestamp": "2026-10-13T07:34:56.982Z",
  "message": {
    "model": "MiniMax-M3.1-Flash-Preview",
    "content": [{"type": "tool_use", "name": "Skill",
                 "input": {"skill": "gds-dev-story"}}],
    "usage": {"input_tokens": 22683, "output_tokens": 92}
  },
  "cwd": "/root/repos/plants-game",
  "gitBranch": "main"
}
```

***
### 第四版（当前）：jsonl + 文件 mtime，AND 关系

```bash
#!/usr/bin/env bash
# stuck-detect.sh <session> <project_dir>
# 退出码: 0=WORKING  1=STUCK  2=EXITED

tmux has-session -t "$SESSION" || { echo "EXITED"; exit 2; }

# 信号 1：session jsonl 最后修改时间（最强）
PROJ_SLUG=$(echo "$PROJ" | sed 's|/|-|g')     # /root/repos/x → -root-repos-x
JSONL=$(ls -t "$HOME/.claude/projects/${PROJ_SLUG}"/*.jsonl | head -1)
JSONL_AGE=$(( $(date +%s) - $(stat -c %Y "$JSONL") ))

# 信号 2：项目源文件最近修改时间
NEWEST=$(find "$PROJ" -type f \( -name "*.ts" -o -name "*.py" -o ... \) \
         -not -path "*/node_modules/*" -not -path "*/.git/*" \
         -newermt "-6 hours" | head -1)
FILE_AGE=$(( $(date +%s) - $(stat -c %Y "$NEWEST") ))

# 判定：AND —— 两个都静默才判卡住
THRESHOLD="${STUCK_THRESHOLD:-300}"
if [[ $JSONL_AGE -gt $THRESHOLD && $FILE_AGE -gt $THRESHOLD ]]; then
  echo "STUCK jsonl=${JSONL_AGE}s file=${FILE_AGE}s"; exit 1
fi
echo "WORKING jsonl=${JSONL_AGE}s file=${FILE_AGE}s"; exit 0
```

**为什么是 AND 不是 OR**：

| 场景 | jsonl | file | 判定 |
|---|---|---|---|
| 正在写代码 | 动 | 动 | WORKING ✅ |
| **正在做 CR（只读代码）** | 动 | **不动** | **WORKING** ✅ |
| 正在长思考（subagent 跑批）| 不动 | 不动 | STUCK ❌ |
| 真卡在菜单 | 不动 | 不动 | STUCK ✅ |

**第二列是关键**：code review 阶段只读代码不改文件，`file` 天然不动。如果用 OR 判定，"正在审查但没改文件"会被立刻误判成卡住。

***
### 阈值调了三次：180 → 600 → 300

**180 秒（第一版设定）严重误判**。实测日志：

```
02:50:20  STUCK jsonl=218s file=241s   size=1195099B
02:54:23  STUCK jsonl=239s file=484s   size=1198740B   ← 涨了 3641 字节
02:58:27  STUCK jsonl=192s file=207s   size=1312902B   ← 涨了 114162 字节
```

**jsonl 明明在涨**，只是单次动作间隔 3-4 分钟。原因很清楚：**gds-code-review 的三层审查（Blind Hunter / Edge Case Hunter / Acceptance Auditor）会起 3 个并行 subagent，每个跑完才写一次 jsonl**。

**一晚上触发 12 次**，每次还补发一个 Enter 和选项 1，把 Claude 从审查流程里拽出来。

**中间试过 600 秒**，但那样真卡住时要等 10 分钟才被发现。

**最终定 300 秒**（5 分钟）：

| 阈值 | 误判风险 | 卡住发现延迟 |
|---|---|---|
| 180s | 高（昨晚 12 次误判）| ≤3 分钟 |
| 600s | 低 | ≤10 分钟 |
| **300s** | **中** | **≤5 分钟** |

**而且把"补发选项 1"整个删掉了**。原来逻辑是"发 Enter → 再测一次 → 还卡就发 1"，那是在乱选菜单。改成只发 Enter（Claude 能自己消化就消化，吃不下就停着等你早上看）。

***
### 第三版加过一次"抖动过滤"，也删了

因为误判太多，我加了一层"连续 2 次静默才判卡住"：

```bash
CNT=$(cat "$STATE_FILE" 2>/dev/null || echo 0)
CNT=$((CNT+1))
if [[ $CNT -ge 2 ]]; then echo "STUCK"; exit 1; fi
echo "MAYBE (1/2)"; exit 3
```

**这个设计是对的，但属于给错误的阈值打补丁。** 阈值本身错了（180s），加过滤层只是让它慢一倍触发，错还是错。

**根因修好之后（300s），抖动过滤就没必要了**——删掉，逻辑简单。

***
### 一个附带发现：jsonl 是完整的对话备份

既然每次都读这个文件，我顺手把它用起来了：

```bash
# 某次会话总共烧了多少 token
python3 -c "
import json, glob
f = sorted(glob.glob('/root/.claude/projects/-root-repos-plants-game/*.jsonl'))[-1]
ti = to = tc = 0
for line in open(f):
    u = (json.loads(line).get('message') or {}).get('usage') or {}
    ti += u.get('input_tokens', 0)
    to += u.get('output_tokens', 0)
    tc += u.get('cache_read_input_tokens', 0)
print(f'输入 {ti:,}  输出 {to:,}  缓存读 {tc:,}')
"
```

**我后来所有的 token 成本分析，数据源全是这个文件。** 比 Claude Code UI 里的 "Usage" 面板更准，因为它包含所有历史会话，不只是当前一次。

***
### 看门狗最后一版

```bash
# 每 2 分钟检测一次，最长 180 分钟
while [[ $ELAPSED -lt $MAX_MINUTES ]]; do
  sleep 120
  RESULT=$("$DETECT" "$SESSION" "$PROJECT_DIR"); RC=$?
  case $RC in
    2) exit 0 ;;                      # 会话退出
    1) tmux send-keys -t "$SESSION" Enter ;;   # 卡住 → Enter
    0) ;;                             # 工作中 → 不动
  esac
done
```

**代码不到 30 行，但里面的判断逻辑是四版迭代出来的。**

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
## 七、最终形态 + 实战结果

### 文件清单

```
/root/.claude/jobs/
├── schedule.conf       # 时间点（每行 HH:MM）
├── job.conf            # 项目 + 后端 + 模型
├── task.txt            # 任务内容（多行）
├── sync-crontab.sh     # 同步 + status/stop/start/edit/job
├── nightly-build.sh    # 主启动器（含看门狗）
├── stuck-detect.sh     # 卡住检测（jsonl + file mtime）
├── check-done.sh       # 早上汇报
└── run-*.log           # 每次运行详情
```

### crontab

```cron
*/5 * * * *  腾讯云 stargate 保活（原有的，别动）

# ===== BMAD nightly build =====
10 0 * * *  nightly-build.sh /root/.claude/jobs/task.txt >> cron.log 2>&1
5  5 * * *  nightly-build.sh /root/.claude/jobs/task.txt >> cron.log 2>&1
0 20 * * *  nightly-build.sh /root/.claude/jobs/task.txt >> cron.log 2>&1
30 8 * * *  check-done.sh >> cron.log 2>&1
# ===== end BMAD =====
```

***
### 任务消息：状态机驱动，不写死步骤

我第一版任务消息写的是"用 build-auto 实现下一个 ready-for-dev 的 story"，跑完发现**它绕过了 create-story 环节**——因为那是 bmm 模块的 skill，跟 gds 模块完全两套。

**改成让 Claude 自己读 `sprint-status.yaml` 决定下一步**：

```
读 _bmad-output/implementation-artifacts/sprint-status.yaml，
按其中每个 story 的 status 决定下一步做什么。

【规则 1】如果存在 status: review 的 story
  → 对它跑 gds-code-review（CR）做三层审查
  → 审查报告写完后停下来，不要自动修复，不要 git commit

【规则 2】如果没有 review 但有 ready-for-dev 或 in-progress
  → 跑 gds-dev-story（DS）继续实现，测试通过后改成 review，停下来报告

【规则 3】如果只有 backlog
  → 跑 gds-create-story（CS）生成上下文文件，停下来报告

【规则 4】如果全部 done
  → 停下来告诉我，问我要不要开新的 epic

一次只跑一个 story，不要并行。
硬约束：绝不执行 git commit；绝不擅自改数值平衡参数；需要产品决策就停。
```

**这个写法的关键**：脚本不需要知道 BMAD 流程长什么样，它只知道"读状态 → 跑对应 skill"。**BMAD 的 `sprint-status.yaml` 就是状态机的载体，任务消息只负责触发。**

***
### 第一次整夜运行的结果

配置：`minimax` 后端 / `acceptEdits` 权限 / 00:10 那一班。

```
启动  00:10:01  →  Claude 就绪（2 秒）→  任务已提交
……
跑到  03:12:30  →  看门狗达 180 分钟上限，会话保留
```

**产出的 commit**：

```
114f453  feat: [1-5] 回合状态机与题单 —— 三模块 + 116 条测试 + 10 项变异验证 + 门槛 7→4 更正
2e4e89b  fix: [CR] Story 1.5 三层审查 —— 4 条变异验证坐实的假绿 + 22 条 patch
```

**一夜之间跑完了 CS → DS → CR 三段式，还自动修了 22 条 patch。**

**但看门狗误报了 12 次**——就是第五节写的那个问题，阈值 180 秒太短。

***
### 早上 08:30 的汇报长这样

```
═══════════ BMAD nightly build 状态检查 2026-10-15 08:30:00 ═══════════
会话: nightly-001021
启动于: 2026-10-15T00:10:35+08:00

🟡 状态: 会话仍在运行

─── 最后 30 行输出 ───
...

═══════════ 本次运行产生的 commit ═══════════
2e4e89b  fix: [CR] Story 1.5 三层审查 —— 4 条变异验证坐实的假绿 + 22 条 patch
114f453  feat: [1-5] 回合状态机与题单 —— 三模块 + 116 条测试

═══════════ 所有历史日志 ═══════════
  Oct 15 00:10  run-20261015-001021.log
  Oct 14 00:10  run-20261014-001001.log
```

**"有没有 commit"是判断夜间任务是否有效的最快标准**，比读日志快十倍。

***
## 八、如果让我重来

**第一天就该做的三件事**：

1. **先读 `crontab -l`，别直接覆盖**。服务器上的 crontab 往往有别人的东西（比如腾讯云的保活任务）。

2. **卡住检测直接用 session jsonl，别从屏幕截取开始**。屏幕是渲染结果，会骗人；jsonl 是事件日志，不会。中间的 CPU 采样是弯路——LLM 调用时进程本来就不烧 CPU。

3. **阈值别拍脑袋定**。我第一版随手写了 180 秒，结果整晚误判 12 次。**应该先跑一晚看真实间隔**再定值。

**最花时间的一件事**：

> 排查看门狗为什么一直发 Enter。表面现象是"日志里刷屏 STUCK"，实际是 CR 三层审查的 subagent 间隔 3-4 分钟超过了我的阈值。
>
> 而这类问题的排查方法只有一个：**把当时的 jsonl 大小变化打出来**。

那一晚的数据摆在那儿：

```
02:50  size=1195099B
02:54  size=1198740B   ← 涨了 3.6KB
02:58  size=1312902B   ← 涨了 114KB
```

**文件在涨，说明它一直在干活。** 我要是第一版就把 jsonl 大小记进日志，能省两小时。

***
**一个数据点**：那晚夜间任务跑 3 小时，产出 **2 个 commit + 22 条自动修复**。相当于一个人类工程师两三天的工作量。

**但我更在意的是另一件事**：第二天早上我看到的是**可审计的 commit + 完整的运行日志**，而不是"AI 说它做完了"。这两者在工程上的差别，比省的那点时间重要得多。

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
