---
icon: pen-to-square
date: 2018-10-11 22:21:00
category:
  - 数据库
tag:
  - 数据库基础
---

# mysql 基础知识

## 参考资料/工具
SQL书籍资料

* 英国Ben Forta的《SQL必知必会》 SQL的极好的入门教材；
* 英国Ben Forta《MySQl必知必会》，mySQL必读经典
* LeetCode 数据库练习题
* [mysql官方文档](https://dev.mysql.com/doc/refman/5.7/en/)
* [阿里巴巴Java开发手册V1.4](https://yq.aliyun.com/articles/69327?spm=a2c4e.11153940.blogcont378859.9.469272d5wTHJdI&utm_content=m_10088)

* [互联网MySQL开发规范](https://yq.aliyun.com/articles/531426?spm=5176.10695662.1996646101.searchclickresult.ec23621ajJp0HE)

SQL工具、软件

*  Mysql workbench 8.0版本，这款DBMS挺好用，可以独立安装
* Navicat 辅助DBMS，收费
* 数据库软件 mysql 5.7 Server老版本；
* docker 安装任意版本



### 数据库建表规范

参考mysql 手册，优化章节

### Mysql workbench 使用实践

Select查询后，有时候result grid 不出现，重启Workbench解决；
* 执行选中的SQL(如无选中则执行所有)  Ctrl + Shift + Enter
* 执行当前这句SQL (注意MySQL Workbench的编辑器会要求每一句SQL必须以;结尾, 否则会高亮提示错误) *Ctrl + Enter*
* 注释掉选中SQL  *Ctrl + /*
* 格式化(美化)SQL _Ctrl + B_
* 新开SQL编辑器 Ctrl + T
* 查看执行解释 (explain current statement) Ctrl + Alt + X

## LeetCode 简单题目解答
 ### 1. 上升的温度

 >查找与之前（昨天的）日期相比温度更高的所有日期的 Id。

| Id(INT) | RecordDate(DATE) | Temperature(INT) |
|---------|  ----------------| -----------------|
|       1 |       2015-01-01 |               10 |
|       2 |       2015-01-02 |               25 |
|       3 |       2015-01-03 |               20 |
|       4 |       2015-01-04 |               30 |

* 知识点：SQL 自连接的使用；日期的函数的应用；
```SQL
 select w1.id from Weather as w1,Weather as w2 where w1.Temperature >w2.Temperature and datediff(w1.RecordDate,w2.RecordDate)=1
```


### 2. 超过5名学生的课

| student | class      |
| --------| -----------|
| A       | Math       |
| B       | English    |
| C       | Math       |
| D       | Biology    |
| E       | Math       |
| F       | Computer   |
| G       | Math       |
| H       | Math       |
| I       | Math       |

* 知识点：having的使用，分类后的数据进行筛选
```SQL
select class from courses group by class having count(distinct student) >= 5
```

### 3.交换工资
> 交换数据表中性别数据

| id | name | sex | salary |
|----|------|-----|--------|
| 1  | A    | m   | 2500   |
| 2  | B    | f   | 1500   |
| 3  | C    | m   | 5500   |
| 4  | D    | f   | 500    |

```SQL
update salary set sex=if(sex="m","f","m")
```
知识点：MySQL函数之控制流函数[Control Flow Functions](https://dev.mysql.com/doc/refman/5.7/en/control-flow-functions.html#function_if)
### 4. 超过经理收入的员工
> 查询可以获取收入超过他们经理的员工的姓名。

| Id | Name  | Salary | ManagerId |
|----|-------|--------|-----------|
| 1  | Joe   | 70000  | 3         |
| 2  | Henry | 80000  | 4         |
| 3  | Sam   | 60000  | NULL      |
| 4  | Max   | 90000  | NULL      |

* 知识点：表自连接的使用Join、笛卡尔积
```SQL
select e1.name as Employee  from Employee as e1,Employee as e2 where e1.ManagerId= e2.id and e1.salary > e2.salary
```

### 5.删除重复的电子邮箱

| Id | Email            |
| ----| ------------------| 
| 1  | john@example.com |
| 2  | bob@example.com  |
| 3  | john@example.com |

* 删除 `Person` 表中所有重复的电子邮箱，重复的邮箱里只保留 **Id **_最小 _的那个。

```SQL
delete p1 from Person as p1,Person as p2 where p1.Email = p2.Email and p1.id > p2.id
```
知识点：表的自连接，作用很大。

### 6. 查找重复的电子邮箱
| Id | Email   |
|----|---------|
| 1  | a@b.com |
| 2  | c@d.com |
| 3  | a@b.com |
* 查找 `Person` 表中所有重复的电子邮箱。


```SQL
-- 方法1：派生表的使用，必须加别名
select email from (select email,count(*) as count from Person group by email) as my where count > 1
-- 方法2：Having 和聚类函数的使用
SELECT Email FROM Person GROUP BY Email HAVING COUNT(*) > 1;
-- 方法3：
SELECT DISTINCT p1.Email FROM Person p1 JOIN Person p2 ON p1.Email = p2.Email WHERE p1.Id <> p2.Id;
```

* 知识点：聚类函数的使用；
### 7. 第二高的薪水
| Id | Salary |
|----|--------|
| 1  | 100    |
| 2  | 200    |
| 3  | 300    |

> 编写一个 SQL 查询，获取 `Employee` 表中第二高的薪水（Salary）
```SQL
-- 方法1:子查询的使用；聚类函数的使用；Limit的使用；
select max(Salary)  as SecondHighestSalary from Employee where Salary <(select max(Salary) from Employee)  limit 1

-- 解法2:IFNULL函数使用；排序函数使用； 更通用方法
select IFNULL((select Distinct Salary from Employee order by Salary DESC limit 1,1),null) as SecondHighestSalary
```

* 知识点：聚类函数和自查询的使用

## X. SQL知识点总结
### 1. 字符串处理函数
掌握几个常用的处理函数
```SQL
SELECT 
    *, UPPER(name), LENGTH(name), CONCAT(name, ';')
FROM
    test.employee
```
### 2. 日期处理函数

处理函数较多，但有不少是同名词，功能相同或类似，名称不同；
adddate() == date_add()

```SQL
SELECT 
    *
FROM
    test.myorder
WHERE
    ADDDATE(myorder.gmt_create, 30) < NOW();
SELECT 
    DATE_ADD(CURRENT_DATE(),
        INTERVAL 30 DAY);
SELECT 
    DATEDIFF(myorder.gmt_create, NOW())
FROM
    myorder;

select date_format('2018-10-11 10:00:00','%H:%i:%s');
```

### 3. SQL 自连接
题目1 ： **上升的温度**，使用的就是自连接，也可以用inner join.. on


### 4. 通配符、正则表达式 数据过滤

#### 4.1 通配符匹配
`%` 和 `_`  进行匹配；
```SQL
SELECT 
    *
FROM
    employee
WHERE
    name LIKE '_u%'
```

特例：匹配含有通配符的字符串，加`escape` 字句

```SQL
-- 匹配末尾含有.的字符串
SELECT 
    *
FROM
    employee
WHERE
    name LIKE '%\/.' escape "/"
```

#### 4.2 正则表达式匹配

mysql正则匹配不区分大小写; Like只能匹配整个列，正则则在列内匹配
1. 使用 `regexp`子句进行匹配

```SQL
SELECT 
    *
FROM
    test.employee
  WHERE
    name REGEXP 's[1-3]';
```
2. 特例：匹配特殊字符，使用 匹配这些特殊字符，就需要用`\\`为前导

```SQL
SELECT 
    *
FROM
    test.employee
WHERE
    name REGEXP '\\.';
```


3. 匹配多个实例，使用重复元字符匹配：

![重复元字符](https://images2015.cnblogs.com/blog/983980/201702/983980-20170209095736151-1489412957.png)
```SQL
SELECT 
    *
FROM
    test.employee
 WHERE
    name REGEXP 's+|u+';
```

## LeetCode 中级题目解答

### 1. 换座位
|    id   | student |
|---------|---------|
|    1    | Abbot   |
|    2    | Doris   |
|    3    | Emerson |
|    4    | Green   |
|    5    | Jeames  |

* 其中纵列的 **id **是连续递增的，改变相邻俩学生的座位。
```SQL
-- 知识点：IF控制流语句；奇偶数的判断；子查询的使用
SELECT 
    IF(id % 2 = 1,
        IF(id = (SELECT 
                    COUNT(*)
                FROM
                    seat),
            id,
            id + 1),
        id - 1) AS id,
    student
FROM
    seat
ORDER BY id

--- 知识点：case语句使用，和C的Switch语句非常像；
SELECT 
    (CASE
        WHEN id % 2 <> 1 THEN id - 1
        WHEN
            id = (SELECT 
                    COUNT(*)
                FROM
                    seat)
        THEN
            id
        ELSE id + 1
    END) AS id,student
FROM
    seat
    order by id
```
### 2. 分数排名
| Id | Score |
|----|-------|
| 1  | 3.50  |
| 2  | 3.65  |
| 3  | 4.00  |
| 4  | 3.85  |
| 5  | 4.00  |
| 6  | 3.65  |

* 分数排名，如果两个分数相同，则两个分数排名（Rank）相同

```SQL
-- 知识点：排序算法

```

### 3. 连续出现的数字

| Id | Num |
|----|-----|
| 1  |  1  |
| 2  |  1  |
| 3  |  1  |
| 4  |  2  |
| 5  |  1  |
| 6  |  2  |
| 7  |  2  |
* 查找所有至少连续出现三次的数字

```SQL
-- 知识点 JOIN的妙用
select distinct m1.Num as ConsecutiveNums   from Logs as m1 join Logs as m2 on m1.id= m2.id-1 join Logs as m3 on m2.id= m3.id-1  where m1.Num = m2.Num  and m1.Num = m3.Num 
```

### 4. 第N高的薪水

| Id | Salary |
|----|--------|
| 1  | 100    |
| 2  | 200    |
| 3  | 300    |

* _n = 2 _时，应返回第二高的薪水 `200`。如果不存在第 _n _高的薪水，那么查询应返回 `null`

```SQL
--方法1： SQL函数基础知识；Limit的使用；排序
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
set N=N-1;
  RETURN (
      
      # Write your MySQL query statement below.
      select Salary from Employee group by Employee.Salary  order by Employee.Salary desc limit N,1
  );
END

-- 方法2：Distinct的妙用(速度最快);
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
set N=N-1;
  RETURN (
      
      # Write your MySQL query statement below.
      select distinct Salary from Employee  order by Employee.Salary desc limit N,1
  );
END
```

### 5.部门工资最高的员工


| Id | Name  | Salary | DepartmentId |
|----|-------|--------|--------------|
| 1  | Joe   | 70000  | 1            |
| 2  | Henry | 80000  | 2            |
| 3  | Sam   | 60000  | 2            |
| 4  | Max   | 90000  | 1            |

| Id | Name     |
|----|----------|
| 1  | IT       |
| 2  | Sales    |

找出每个部门工资最高的员工。


```SQL
-- 知识点：IN的使用；子查询的使用；JOIN的使用
SELECT 
    department.Name AS Department,
    employee.Name AS Employee,
    Salary
FROM
    department
        JOIN
    employee ON employee.DepartmentId = department.Id
        AND employee.Salary IN (SELECT 
            MAX(employee.Salary)
        FROM
            employee
        WHERE
            employee.DepartmentId = department.Id)
```

### X.  关键知识点

#### 1. SQL语句的执行顺序:
```SQL
(7)     SELECT 
(8)     DISTINCT <select_list>
(1)     FROM <left_table>
(3)     <join_type> JOIN <right_table>
(2)     ON <join_condition>
(4)     WHERE <where_condition>
(5)     GROUP BY <group_by_list>
(6)     HAVING <having_condition>
(9)     ORDER BY <order_by_condition>
(10)    LIMIT <limit_number>
```

1. **FROM：** 对FROM子句中的前两个表执行**笛卡尔积**（Cartesian product)(交叉联接），生成虚拟表VT1
2.  **ON：** 对VT1应用ON筛选器。只有那些使<join_condition>为真的行才被插入VT2。
3.  **OUTER(JOIN)：** 如果指定了OUTER JOIN（相对于CROSS JOIN 或(INNER JOIN),保留表（preserved table：左外部联接把左表标记为保留表，右外部联接把右表标记为保留表，完全外部联接把两个表都标记为保留表）中未找到匹配的行将作为外部行添加到 VT2,生成VT3.如果FROM子句包含两个以上的表，则对上一个联接生成的结果表和下一个表重复执行步骤1到步骤3，直到处理完所有的表为止。
4.  **WHERE：** 对VT3应用WHERE筛选器。只有使<where_condition>为true的行才被插入VT4.
5.  **GROUP BY：** 按GROUP BY子句中的列列表对VT4中的行分组，生成VT5.
6.  **CUBE|ROLLUP：** 把超组(Suppergroups)插入VT5,生成VT6.
7.  **HAVING：** 对VT6应用HAVING筛选器。只有使<having_condition>为true的组才会被插入VT7.
8.  **SELECT：** 处理SELECT列表，产生VT8.
9.  **DISTINCT：** 将重复的行从VT8中移除，产生VT9.
10.  **ORDER BY：** 将VT9中的行按ORDER BY 子句中的列列表排序，生成游标（VC10).
11.  **TOP：** 从VC10的开始处选择指定数量或比例的行，生成表VT11,并返回调用者。

#### 2. JOIN语句的使用

 [SQL的各种连接Join详解](https://www.cnblogs.com/reaptomorrow-flydream/p/8145610.html):这篇文章介绍的很详细了。
实验可以用部门最高工资员工的表测试。


## LeetCode 高级题目解答

### 1. 体育馆的人流量
| id   | date       | people    |
|------|------------|-----------|
| 1    | 2017-01-01 | 10        |
| 2    | 2017-01-02 | 109       |
| 3    | 2017-01-03 | 150       |
| 4    | 2017-01-04 | 99        |
| 5    | 2017-01-05 | 145       |
| 6    | 2017-01-06 | 1455      |
| 7    | 2017-01-07 | 199       |
| 8    | 2017-01-08 | 188       |

* 找出高峰期时段，要求连续三天及以上，并且每天人流量均不少于100。

```SQL
-- 知识点：Join的原理；三个连续选择的算法；
SELECT DISTINCT
    s1.*
FROM
    stadium AS s1,
    stadium AS s2,
    stadium AS s3
WHERE
    s1.people >= 100 AND s2.people >= 100
        AND s3.people >= 100
        AND ((s1.id = s2.id + 1 AND s1.id = s3.id + 2)
        OR (s1.id = s2.id - 1 AND s1.id = s3.id - 2)
        OR (s1.id = s2.id + 1 AND s1.id = s3.id - 1))
ORDER BY s1.id
```

### 2. 行程和用户

| Id | Client_Id | Driver_Id | City_Id |        Status      |Request_at|
|----|-----------|-----------|---------|--------------------|----------|
| 1  |     1     |    10     |    1    |     completed      |2013-10-01|
| 2  |     2     |    11     |    1    | cancelled_by_driver|2013-10-01|
| 3  |     3     |    12     |    6    |     completed      |2013-10-01|
| 4  |     4     |    13     |    6    | cancelled_by_client|2013-10-01|
| 5  |     1     |    10     |    1    |     completed      |2013-10-02|
| 6  |     2     |    11     |    6    |     completed      |2013-10-02|
| 7  |     3     |    12     |    6    |     completed      |2013-10-02|
| 8  |     2     |    12     |    12   |     completed      |2013-10-03|
| 9  |     3     |    10     |    12   |     completed      |2013-10-03| 
| 10 |     4     |    13     |    12   | cancelled_by_driver|2013-10-03|

| Users_Id | Banned |  Role  |
|----------|--------|--------| 
|    1     |   No   | client |
|    2     |   Yes  | client |
|    3     |   No   | client |
|    4     |   No   | client |
|    10    |   No   | driver |
|    11    |   No   | driver |
|    12    |   No   | driver |
|    13    |   No   | driver |
* 每段行程有唯一键 Id，Client_Id 和 Driver_Id 是 `Users` 表中 Users_Id 的外键。Status 是枚举类型，枚举成员为 (‘completed’, ‘cancelled_by_driver’, ‘cancelled_by_client’)。
* `Users` 表存所有用户。每个用户有唯一键 Users_Id。Banned 表示这个用户是否被禁止，Role 则是一个表示（‘client’, ‘driver’, ‘partner’）的枚举类型。
* 查出  **2013年10月1日** 至 **2013年10月3日**期间非禁止用户的取消率

```SQL
-- SUM聚类函数的使用；Round函数的使用；IF条件语句的使用；日期的比较；In的使用
SELECT 
    Request_at AS Day,
    ROUND(SUM(IF(trips.Status = 'cancelled_by_client'
                    OR trips.Status = 'cancelled_by_driver',
                1,
                0)) / COUNT(*),
            2) AS 'Cancellation Rate'
FROM
    test.trips
WHERE
    trips.Client_Id NOT IN (SELECT 
            users.Users_Id
        FROM
            users
        WHERE
            users.Banned = 'YES')
        AND Request_at BETWEEN '2013-10-01' AND '2013-10-03'
GROUP BY trips.Request_at
```

### 3. 部门工资前三高的员工

`Employee` 表包含所有员工信息

| Id | Name  | Salary | DepartmentId |
|----|-------|--------|--------------|
| 1  | Joe   | 70000  | 1            |
| 2  | Henry | 80000  | 2            |
| 3  | Sam   | 60000  | 2            |
| 4  | Max   | 90000  | 1            |
| 5  | Janet | 69000  | 1            |
| 6  | Randy | 85000  | 1            |

`Department` 表包含公司所有部门的信息

| Id | Name     |
|----|----------|
| 1  | IT       |
| 2  | Sales    |

找出每个部门工资前三高的员工

```SQL

-- 非常经典的SQL题目，使用JOIN和自连接进行筛选；都是老知识点的组合使用
SELECT 
    department.Name AS Department, e1.Name AS Employee, Salary
FROM
    employee AS e1
        LEFT JOIN
    department ON e1.DepartmentId = department.id
WHERE
    (SELECT 
            COUNT(DISTINCT e2.Salary)
        FROM
            employee AS e2
        WHERE
            e2.Salary > e1.Salary
                AND e1.DepartmentID = e2.DepartmentID) < 3
        AND department.Name IS NOT NULL
ORDER BY department.Name , e1.Salary DESC
```