---
icon: database
date: 2018-10-11 22:21:00
update: 2026-05-05
category:
  - 数据库
tags:
  - MySQL
  - 数据库基础
  - SQL
  - LeetCode
star: true
---

# MySQL 必知必会：核心知识点与 LeetCode 实战速查

> MySQL 基础速查手册，涵盖常用 SQL 语法、核心知识点、阿里开发规范，以及 LeetCode 题目精解。适合快速回顾和面试准备。

<!-- more -->

## 🚀 快速导航

| 类别 | 内容 | 难度 |
|------|------|------|
| [核心知识速查](#核心知识速查) | 索引、事务、存储引擎、SQL执行顺序 | ⭐⭐⭐ |
| [常用工具](#常用工具) | MySQL Workbench、Navicat、Docker 安装 | ⭐ |
| [简单 LeetCode](#简单难度) | 7 题 | ⭐ |
| [中等 LeetCode](#中等难度) | 5 题 | ⭐⭐ |
| [困难 LeetCode](#困难难度) | 3 题 | ⭐⭐⭐ |

---

## 📚 核心知识速查

### 1. 索引基础

| 索引类型 | 适用场景 | 注意事项 |
|---------|---------|---------|
| B-Tree | 默认索引，适合范围查询 | 适用于高选择性列 |
| Hash | 等值查询，如 `WHERE id = ?` | 不支持范围查询 |
| 联合索引 | 多条件查询 | 遵循最左前缀原则 |
| 全文索引 | 文本内容搜索 | 适用于 CHAR、VARCHAR、TEXT |

**创建索引：**
```sql
-- 单列索引
CREATE INDEX idx_name ON table_name(column);

-- 联合索引
CREATE INDEX idx_name ON table_name(col1, col2, col3);

-- 查看执行计划（是否使用索引）
EXPLAIN SELECT * FROM table_name WHERE ...;
```

### 2. 事务四大特性（ACID）

| 特性 | 说明 |
|------|------|
| **原子性（Atomicity）** | 事务是最小执行单元，要么全成功，要么全失败 |
| **一致性（Consistency）** | 事务执行前后，数据库状态保持一致 |
| **隔离性（Isolation）** | 并发事务之间相互隔离，不互相干扰 |
| **持久性（Durability）** | 事务提交后，数据永久保存 |

**隔离级别：**

| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
|---------|------|----------|------|
| READ UNCOMMITTED | ✅ 可能 | ✅ 可能 | ✅ 可能 |
| READ COMMITTED | ❌ 不可能 | ✅ 可能 | ✅ 可能 |
| REPEATABLE READ | ❌ 不可能 | ❌ 不可能 | ✅ 可能（MySQL默认）|
| SERIALIZABLE | ❌ 不可能 | ❌ 不可能 | ❌ 不可能 |

### 3. 存储引擎对比

| 特性 | InnoDB | MyISAM |
|------|--------|--------|
| 事务支持 | ✅ 支持 | ❌ 不支持 |
| 外键 | ✅ 支持 | ❌ 不支持 |
| 行锁 | ✅ 支持 | ❌ 表锁 |
| 全文索引 | ✅ 支持 | ✅ 支持 |
| 适用场景 | 事务需求、高并发 | 只读/静态表 |

**选择建议：**
- 默认选 **InnoDB**（除非有特殊需求）
- MyISAM 适用于：只读场景、表级锁足够、需全文索引

### 4. SQL 语句执行顺序

```sql
(7)  SELECT DISTINCT <select_list>
(1)  FROM <left_table>
(3)  JOIN <right_table> ON <join_condition>
(2)  ON <join_condition>
(4)  WHERE <where_condition>
(5)  GROUP BY <group_by_list>
(6)  HAVING <having_condition>
(9)  ORDER BY <order_by_condition>
(10) LIMIT <limit_number>
```

**记忆口诀：** From → Join → On → Where → Group By → Having → Select → Distinct → Order By → Limit

---

## 🔧 常用工具

### 开发工具

| 工具 | 说明 | 推荐度 |
|------|------|--------|
| **MySQL Workbench 8.0** | 官方免费 IDE，功能完整 | ⭐⭐⭐⭐⭐ |
| **Navicat** | 辅助 DBMS，界面友好 | ⭐⭐⭐⭐（收费）|
| **Docker** | 快速安装任意版本 MySQL | ⭐⭐⭐⭐⭐ |

**Docker 安装 MySQL：**
```bash
docker pull mysql:5.7
docker run -p 3306:3306 --name mysql5.7 -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7
```

### MySQL Workbench 快捷键

| 操作 | 快捷键 |
|------|--------|
| 执行选中 SQL（或全部） | `Ctrl + Shift + Enter` |
| 执行当前 SQL | `Ctrl + Enter` |
| 注释选中 SQL | `Ctrl + /` |
| 格式化 SQL | `Ctrl + B` |
| 新开 SQL 编辑器 | `Ctrl + T` |
| 查看执行解释 | `Ctrl + Alt + X` |

---

## 📖 SQL 核心知识点

### 字符串处理函数

```sql
SELECT 
    *, 
    UPPER(name),           -- 转大写
    LOWER(name),           -- 转小写
    LENGTH(name),          -- 字节长度
    CHAR_LENGTH(name),     -- 字符长度
    CONCAT(name, ';'),     -- 字符串拼接
    SUBSTRING(name, 1, 3), -- 截取
    TRIM(name),            -- 去除首尾空格
    REPLACE(name, 'a', 'b') -- 替换
FROM test.employee;
```

### 日期处理函数

| 函数 | 说明 |
|------|------|
| `NOW()` | 当前日期时间 |
| `CURDATE()` | 当前日期 |
| `DATEDIFF(d1, d2)` | 日期差（天）|
| `DATE_ADD(d, INTERVAL n DAY)` | 日期加 n 天 |
| `ADDDATE(d, n)` | 同上 |
| `DATE_FORMAT(d, '%Y-%m-%d')` | 格式化日期 |
| `YEAR(d) / MONTH(d) / DAY(d)` | 提取年月日 |

```sql
-- 30天前的订单
SELECT * FROM orders WHERE DATE_ADD(gmt_create, INTERVAL 30 DAY) < NOW();

-- 计算日期差
SELECT DATEDIFF(NOW(), create_time) AS days_ago FROM orders;
```

### 控制流函数

| 函数 | 说明 |
|------|------|
| `IF(condition, true_val, false_val)` | 条件判断 |
| `IFNULL(val, default)` | NULL 替换 |
| `CASE WHEN ... THEN ... END` | switch 语句 |

```sql
-- 交换性别
UPDATE salary SET sex = IF(sex = 'm', 'f', 'm');

-- CASE 用法（座位交换）
SELECT 
    CASE
        WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM seat) THEN id
        WHEN id % 2 = 1 THEN id + 1
        ELSE id - 1
    END AS id, student
FROM seat ORDER BY id;
```

### 通配符与正则

```sql
-- 通配符：% 任意字符，_ 单个字符
SELECT * FROM employee WHERE name LIKE '_u%';

-- 正则匹配（不区分大小写）
SELECT * FROM employee WHERE name REGEXP 's[1-3]';

-- 匹配特殊字符（需转义）
SELECT * FROM employee WHERE name REGEXP '\\.';
```

---

## 📝 LeetCode 题目精解

---

### 简单难度

#### 1. 上升的温度

> 查找与之前（昨天的）日期相比温度更高的所有日期的 Id。

| Id(INT) | RecordDate(DATE) | Temperature(INT) |
|---------|-----------------|-----------------|
| 1 | 2015-01-01 | 10 |
| 2 | 2015-01-02 | 25 |
| 3 | 2015-01-03 | 20 |
| 4 | 2015-01-04 | 30 |

**知识点：** SQL 自连接 + 日期函数

```sql
SELECT w1.id 
FROM Weather AS w1, Weather AS w2 
WHERE w1.Temperature > w2.Temperature 
  AND DATEDIFF(w1.RecordDate, w2.RecordDate) = 1;
```

---

#### 2. 超过5名学生的课

> 找出有至少5名学生选修的课程。

| student | class |
|---------|-------|
| A | Math |
| B | English |
| ... | ... |

**知识点：** GROUP BY + HAVING + COUNT(DISTINCT)

```sql
SELECT class 
FROM courses 
GROUP BY class 
HAVING COUNT(DISTINCT student) >= 5;
```

---

#### 3. 交换工资

> 交换表中男女性别数据。

| id | name | sex | salary |
|----|------|-----|--------|
| 1 | A | m | 2500 |
| 2 | B | f | 1500 |

**知识点：** IF 控制流函数

```sql
UPDATE salary 
SET sex = IF(sex = 'm', 'f', 'm');
```

---

#### 4. 超过经理收入的员工

> 查找收入超过经理的员工姓名。

| Id | Name | Salary | ManagerId |
|----|------|--------|-----------|
| 1 | Joe | 70000 | 3 |
| 2 | Henry | 80000 | 4 |
| 3 | Sam | 60000 | NULL |
| 4 | Max | 90000 | NULL |

**知识点：** 表自连接

```sql
SELECT e1.name AS Employee 
FROM Employee AS e1, Employee AS e2 
WHERE e1.ManagerId = e2.id 
  AND e1.salary > e2.salary;
```

---

#### 5. 删除重复的电子邮箱

> 删除重复邮箱，保留 Id 最小的那条。

| Id | Email |
|----|-------|
| 1 | john@example.com |
| 2 | bob@example.com |
| 3 | john@example.com |

**知识点：** DELETE + 自连接

```sql
DELETE p1 
FROM Person AS p1, Person AS p2 
WHERE p1.Email = p2.Email 
  AND p1.Id > p2.Id;
```

---

#### 6. 查找重复的电子邮箱

**知识点：** GROUP BY + HAVING / 派生表

```sql
-- 方法1：派生表
SELECT email 
FROM (
    SELECT email, COUNT(*) AS cnt 
    FROM Person 
    GROUP BY email
) AS t 
WHERE cnt > 1;

-- 方法2：HAVING（更简洁）
SELECT Email 
FROM Person 
GROUP BY Email 
HAVING COUNT(*) > 1;

-- 方法3：DISTINCT + JOIN
SELECT DISTINCT p1.Email 
FROM Person p1 
JOIN Person p2 ON p1.Email = p2.Email 
WHERE p1.Id <> p2.Id;
```

---

#### 7. 第二高的薪水

**知识点：** LIMIT + OFFSET / IFNULL + DISTINCT

```sql
-- 方法1
SELECT MAX(Salary) AS SecondHighestSalary 
FROM Employee 
WHERE Salary < (SELECT MAX(Salary) FROM Employee) 
LIMIT 1;

-- 方法2（更通用，可处理 NULL）
SELECT IFNULL(
    (SELECT DISTINCT Salary 
     FROM Employee 
     ORDER BY Salary DESC 
     LIMIT 1 OFFSET 1), 
    NULL
) AS SecondHighestSalary;
```

---

### 中等难度

#### 1. 换座位

> 相邻学生交换座位，最后一个学生处理需特殊判断。

**知识点：** IF/CASE + COUNT + 子查询

```sql
SELECT 
    IF(id % 2 = 1,
        IF(id = (SELECT COUNT(*) FROM seat), id, id + 1),
        id - 1) AS id,
    student
FROM seat
ORDER BY id;
```

---

#### 2. 分数排名

> 分数相同则 Rank 相同。

**知识点：** 变量 / JOIN（待补充）

---

#### 3. 连续出现的数字

> 找出至少连续出现3次的数字。

**知识点：** 三表自连接

```sql
SELECT DISTINCT m1.Num AS ConsecutiveNums
FROM Logs AS m1
JOIN Logs AS m2 ON m1.id = m2.id - 1
JOIN Logs AS m3 ON m2.id = m3.id - 1
WHERE m1.Num = m2.Num AND m1.Num = m3.Num;
```

---

#### 4. 第N高的薪水（函数）

> 创建一个函数返回第 N 高的薪水。

```sql
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
    SET N = N - 1;
    RETURN (
        SELECT DISTINCT Salary 
        FROM Employee 
        ORDER BY Salary DESC 
        LIMIT N, 1
    );
END;
```

---

#### 5. 部门工资最高的员工

**知识点：** IN + 子查询 + JOIN

```sql
SELECT 
    d.Name AS Department,
    e.Name AS Employee,
    e.Salary
FROM Department d
JOIN Employee e ON e.DepartmentId = d.Id
WHERE e.Salary IN (
    SELECT MAX(Salary) 
    FROM Employee 
    GROUP BY DepartmentId
);
```

---

### 困难难度

#### 1. 体育馆的人流量

> 找出连续3天及以上每天人流量不少于100的高峰时段。

**知识点：** 三表自连接 + 算法思维

```sql
SELECT DISTINCT s1.*
FROM stadium AS s1, stadium AS s2, stadium AS s3
WHERE s1.people >= 100 AND s2.people >= 100 AND s3.people >= 100
  AND (
      (s1.id = s2.id + 1 AND s1.id = s3.id + 2)
      OR (s1.id = s2.id - 1 AND s1.id = s3.id - 2)
      OR (s1.id = s2.id + 1 AND s1.id = s3.id - 1)
  )
ORDER BY s1.id;
```

---

#### 2. 行程和用户

> 统计 2013-10-01 至 2013-10-03 非禁止用户的取消率。

**知识点：** IF + SUM + ROUND + IN + 子查询

```sql
SELECT 
    Request_at AS Day,
    ROUND(
        SUM(IF(Status = 'cancelled_by_client' OR Status = 'cancelled_by_driver', 1, 0)) / COUNT(*),
        2
    ) AS 'Cancellation Rate'
FROM trips
WHERE Client_Id NOT IN (
    SELECT Users_Id FROM Users WHERE Banned = 'YES'
)
AND Request_at BETWEEN '2013-10-01' AND '2013-10-03'
GROUP BY Request_at;
```

---

#### 3. 部门工资前三高的员工

**知识点：** COUNT(DISTINCT) + 自连接

```sql
SELECT 
    d.Name AS Department,
    e1.Name AS Employee,
    e1.Salary
FROM Employee e1
LEFT JOIN Department d ON e1.DepartmentId = d.id
WHERE (
    SELECT COUNT(DISTINCT e2.Salary)
    FROM Employee e2
    WHERE e2.Salary > e1.Salary
      AND e1.DepartmentID = e2.DepartmentID
) < 3
AND d.Name IS NOT NULL
ORDER BY d.Name, e1.Salary DESC;
```

---

## 📚 学习资源

| 资源 | 说明 |
|------|------|
| [MySQL 官方文档](https://dev.mysql.com/doc/refman/5.7/en/) | 最权威的参考手册 |
| [阿里巴巴 Java 开发手册](https://yq.aliyun.com/articles/69327) | 国内 MySQL 开发规范 |
| LeetCode 数据库练习 | 边学边练 |
| Ben Forta《MySQL 必知必会》| 入门经典教材 |

---

## 💡 面试高频考点

| 考点 | 频率 | 说明 |
|------|------|------|
| JOIN 区别（INNER/LEFT/RIGHT/FULL）| ⭐⭐⭐⭐⭐ | 必须熟练 |
| 索引原理与优化 | ⭐⭐⭐⭐⭐ | B-Tree、失效场景 |
| 事务隔离级别 | ⭐⭐⭐⭐ | ACID + 四种级别 |
| SQL 执行顺序 | ⭐⭐⭐⭐ | 从 FROM 到 LIMIT |
| GROUP BY + HAVING | ⭐⭐⭐⭐ | 与 WHERE 的区别 |
| 子查询与联表 | ⭐⭐⭐⭐ | 性能对比 |
| NULL 处理 | ⭐⭐⭐ | IFNULL、IS NULL |

---

欢迎交流讨论，我的 blog：[sunrong.site](https://sunrong.site)
