---
icon: pen-to-square
date: 2025-09-01
category:
  - 算法
tag:
  - 算法基础
  - Masterpiece
star: true
---

# 算法100 share My Masterpiece

1. 练气期（基础巩固）：9月14日 - 10月14日（1个月）
  ○ 目标：完成100道基础题（重点：数组、字符串、链表、栈、队列、排序、搜索、递归，树中级）。
  ○ 题数里程碑：每10题为一层，共10层（练气1层10题、2层20题、...、10层100题）。
  ○ 时间分配：每周约10题，每天2题左右（利用晚上1小时+早上地铁1h）。
  ○ 多巴胺激励：每完成10题，奖励自己30分钟休闲（如看视频、咖啡、零食）；完成练气期，奖励一个周末家庭活动（如公园游玩）。
  ○ 建议：使用LeetCode或牛客网，选择Easy和Medium题，注重理解基础概念。

📅 分享一：树与递归——从二叉树到决策树的思考艺术
时间：对应 10月底的学习刷出 my masterpiece 
核心目标：帮你彻底攻克递归思维，理解树结构的基础。

第一部分：重新认识递归（15分钟）
用架构思维讲解：递归 = 任务分解（老板） + 汇总结果（经理） + 基准情况（员工）。
现场编码：带领大家手写一个最简单的递归（如阶乘、斐波那契数列），并画出调用栈，讲解其时空消耗。

第二部分：二叉树的遍历（20分钟）
深入对比：递归遍历 vs. 迭代遍历。强调为什么迭代法有时更优（避免栈溢出风险）。
现场编码：白板上手写层序遍历（BFS），并强调这是理解队列和广度优先的绝佳例子。

第三部分：与AI的结合点——决策树（15分钟）
概念链接：讲解最简单的机器学习模型之一——决策树。它就是一棵二叉树或多叉树。
直观演示：用一个例子（如“根据天气、温度预测是否打球”）画出一棵决策树。
建立关联：“我们刚才学的二叉树遍历，其实就是决策树进行预测时走过的路径。”

Q&A（10分钟）
课后挑战（给你自己）：在内部Wiki上分享你的笔记和代码链接，并附上一道LeetCode题（如 #104 或 #102）邀请同事们一起尝试。


## 规划

算法三个月冲刺计划（中文题 + 每题附 LeetCode 中文链接）​​

​一 学习目标与节奏​

目标对齐
面向后端岗位（如后端/中间件/数据平台），强调代码正确性、边界处理、复杂度表达、Java 风格工程化与面试表达。
每日投入约1小时​（含通勤），以“高频专题 + 小量高质量复盘”为主，避免题海。

周节奏
学习 5 天 + 复盘 1 天 + 模考半天；每周完成20–25题​（L1 巩固 8–10，L2 变式 8–10，L3 压轴 2–5）。
验收标准
周验收：3 题小测（30–40 分钟），正确率≥80%​；输出 1 页“方法论沉淀”（如“滑动窗口的 4 种边界模板”）。
月验收：全真模拟90 分钟​（3 题：易/中/难），输出成绩单、Bug 类型雷达图、改进清单。

​二 12 周主题与题单（中文题，附 LeetCode 中文链接）​​

使用建议
优先刷中文题解与讨论；每题记录“Java 实现要点、复杂度、边界清单、面试一句话”。
每周至少1 题多解​（暴力→优化→工程化），并沉淀为可复用模板。

第1月 基础夯实

数组/字符串：双指针/滑动窗口/前缀和

27.移除元素 https://leetcode.cn/problems/remove-element/
3.无重复字符的最长子串 https://leetcode.cn/problems/longest-substring-without-repeating-characters/
560.和为 K 的子数组 https://leetcode.cn/problems/subarray-sum-equals-k/

哈希表：计数/两数之和/同构映射

1.两数之和 https://leetcode.cn/problems/two-sum/
454.四数相加 II https://leetcode.cn/problems/4sum-ii/
242.有效的字母异位词 https://leetcode.cn/problems/valid-anagram/

链表：快慢指针/反转/合并

206.反转链表 https://leetcode.cn/problems/reverse-linked-list/
141.环形链表 https://leetcode.cn/problems/linked-list-cycle/
21.合并两个有序链表 https://leetcode.cn/problems/merge-two-sorted-lists/

栈/队列：单调栈/单调队列/括号匹配

84.柱状图中最大的矩形 https://leetcode.cn/problems/largest-rectangle-in-histogram/
239.滑动窗口最大值 https://leetcode.cn/problems/sliding-window-maximum/
155.最小栈 https://leetcode.cn/problems/min-stack/

二分与双指针：二分边界模板/快慢指针
704.二分查找 https://leetcode.cn/problems/binary-search/
15.三数之和 https://leetcode.cn/problems/3sum/
167.两数之和 II https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/

第2月 专题突破

堆/优先队列：TopK/合并 K 组
215.数组中的第 K 个最大元素 https://leetcode.cn/problems/kth-largest-element-in-an-array/
295.数据流的中位数 https://leetcode.cn/problems/find-median-from-data-stream/
692.前 K 个高频单词 https://leetcode.cn/problems/top-k-frequent-words/

并查集：连通分量/最小生成树雏形
547.省份数量 https://leetcode.cn/problems/number-of-provinces/
684.冗余连接 https://leetcode.cn/problems/redundant-connection/

贪心：区间调度/跳跃游戏
45.跳跃游戏 II https://leetcode.cn/problems/jump-game-ii/
435.无重叠区间 https://leetcode.cn/problems/non-overlapping-intervals/
605.种花问题 https://leetcode.cn/problems/can-place-flowers/

DFS/BFS 与图：连通/最短路入门
133.克隆图 https://leetcode.cn/problems/clone-graph/
200.岛屿数量 https://leetcode.cn/problems/number-of-islands/
785.二分图 https://leetcode.cn/problems/is-graph-bipartite/

树与 DFS：递归/迭代/路径和
104.二叉树的最大深度 https://leetcode.cn/problems/maximum-depth-of-binary-tree/
112.路径总和 https://leetcode.cn/problems/path-sum/
94.二叉树的中序遍历 https://leetcode.cn/problems/binary-tree-inorder-traversal/

DP 入门：背包/打家劫舍/最大子数组
416.分割等和子集 https://leetcode.cn/problems/partition-equal-subset-sum/
198.打家劫舍 https://leetcode.cn/problems/house-robber/
53.最大子数组和 https://leetcode.cn/problems/maximum-subarray/

第3月 真题冲刺与系统思维

混合专题：数组/字符串 + DP + 图论/树
322.零钱兑换 https://leetcode.cn/problems/coin-change/
134.加油站 https://leetcode.cn/problems/gas-station/
207.课程表 https://leetcode.cn/problems/course-schedule/

工程化映射（面试加分）
用堆+延迟队列实现限流/TopK；用并查集+图遍历做故障域/连通性；用单调栈做实时告警去抖。

模拟面试：每周2 次 90 分钟​（3 题组合），复盘“面试表达→追问→优化”全链路。

​三 Java 适配与工程化表达要点​

常用容器与习惯
容器：​ArrayList/LinkedList、HashMap/TreeMap、HashSet/TreeSet、PriorityQueue、ArrayDeque、Stack（尽量用 Deque 替代）​。
习惯：优先使用增强 for、Objects.equals/hashCode、var（局部变量类型推断）​、record（不可变 DTO）​、Optional；集合初始化给出容量​（如 new HashMap<>(32)）。

模板与边界
二分模板：给出“左闭右开/左闭右闭”两种写法与死循环规避；滑动窗口维护“有效窗口判定”与“收缩条件”。
复杂度：统一用Big-O表达时间/空间；异常与边界（空、单元素、全相同、溢出）单列。

面试表达模板
5 步法：题意重述→思路与复杂度→边界与取舍→代码走读→测试用例（含极端/随机/等价类）。

系统场景映射（面试加分）
缓存与限流：​LRU（LinkedHashMap/双链表+哈希）​、令牌桶/漏桶（优先队列/延迟队列）​。
实时榜单/TopK：​堆/优先队列；分布式延展：分片+局部 TopK→归并。
连通与故障域：​并查集；拓扑用于任务调度/依赖解析。
