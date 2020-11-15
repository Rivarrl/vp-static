Title:【算法总结】前缀和
Date: 2019-11-06 21:22
Modified: 2019-11-06 21:22
Category: Leetcode
Tags: Leetcode, Algorithm, Array, Summary, Python3
Slug: algo_prefix_sum
Author: Rivarrl

#### 前缀和及相关题目

前缀和是一种实用的技巧，经常用在数据的预处理上，可有效的降低时间复杂度。  

前缀和的意思就是将一个数值型数组每个位置之前的子数组和计算出来，例如nums = [1,2,4,3]对应的前缀和数组pre = [0,1,3,7,10]，由于它的用途是计算sum(nums[j:i]) = pre[i] - pre[j]，通常需要在0的位置上添加初始值，一般为0。  

前缀和的多数题目有一个共同的特点：**在一个数组中统计有多少满足条件的连续子数组，元素之和（也可以变种为求和再取余等）为一个固定值。**, 关键词：**统计**  

先来道基本操作题：  
[303. 区域和检索 - 数组不可变](https://leetcode-cn.com/problems/range-sum-query-immutable/)  
思路：前缀和基本操作，没得可说。。  

代码：
```python
class NumArray:
    def __init__(self, nums: List[int]):
        self.pre = [0]
        for e in nums:
            self.pre += [self.pre[-1] + e]

    def sumRange(self, i: int, j: int) -> int:
        return self.pre[j+1] - self.pre[i]
```


一般题目会给出一个固定值，也就是sum(nums[j:i])，当我们的程序遍历到i的时候，计算sum(nums[0:i])并更新pre[i]的同时，上述的式子知二求一可找到pre[j]。

例如下面要贴出来的第一题，找和为K的子数组的个数。  


[560. 和为K的子数组](https://leetcode-cn.com/problems/subarray-sum-equals-k/)  
思路：典型的前缀和问题，一边计算前缀和，并计数，一边在已经计算过的结果集合中找与当前前缀和差值为K的个数，由于前缀和值的范围不定，结果集合采用哈希表存储比数组更合适。  

代码：  
```python
def subarraySum(nums: List[int], k: int) -> int:
    from collections import defaultdict
    s = defaultdict(int)
    s[0] += 1
    res, c = 0, 0
    for x in nums:
        c += x
        print(c, c-k)
        res += s[c-k]
        s[c] += 1
    return res
```

[974. 和可被 K 整除的子数组](https://leetcode-cn.com/problems/subarray-sums-divisible-by-k/)  
思路：和上题唯一的区别，需要求的子数组和是K的倍数，要对前缀和进行取余操作，例如K=6，我们只需要余数的和为6的即可，3和9都要算作“前缀和”为3。  

代码：
```python
def subarraysDivByK(A: List[int], K: int) -> int:
    from collections import defaultdict
    s = defaultdict(int)
    s[0] += 1
    res, x = 0, 0
    for a in A:
        x = ((x + a) % K + K) % K
        res += s[x]
        s[x] += 1
    return res
```
这里需要注意有些语言%表示取余（如C），有些语言%表示取模（如python），两者区别在x%y，x和y符号相反时，取余后的结果与x同号，而取模后的结果与y同号。(-3) % 5，取余为-3，取模为2
，本题需要取模，考虑通用性，写上面那句无论哪个平台的语言都通用了。

[523. 连续的子数组和](https://leetcode-cn.com/problems/continuous-subarray-sum/)  
思路：和上题的区别在于，子数组长度需要至少为2，返回布尔类型，找到一次即可返回true。  
问题翻译一下：在nums数组中，有没有满足和对K取余后得0，且长度至少为2的连续子数组。  
上一题已经解决了K取余的问题，由于不需要统计数量，对于每个余数在哈希表中出现过之后再次出现即可返回true。现在需要解决长度至少为2的问题，K=6时，数组中单一的6的倍数不算数，所以要记录每个余数第一次出现的位置，如果两次出现相同余数前缀和的索引i和第一次出现时的j相差至少为2（nums[j:i]左开右闭，第一次出现时的j不计算到子数组中，从j+1到i的索引个数为i-(j+1)+1 = i-j），就可以排除单一的K倍数问题了。  

代码：
```python
def checkSubarraySum(nums: List[int], k: int) -> bool:
    d = {0: -1}
    c = 0
    for i, x in enumerate(nums):
        c += x
        if k != 0:
            c %= k
        print(d)
        if not c in d: d[c] = i
        elif i - d[c] >= 2: return True
    return False
```
注意一个特殊的测试用例：nums=[0, 3], k=3，由于初始值为0，第一个0添加过后更新索引为0，第二次本该return true的时候却因为i和j只相差1而没有进入if分支内，所以针对这个特殊情况，需要为key为0赋初始值-1


[437. 路径总和 III](https://leetcode-cn.com/problems/path-sum-iii/)  
思路：前缀和，从根节点到任一叶子结点组成的路径就是一个数组，找连续子数组和为sum即可。注意非叶子节点的前缀和要反复使用，需要用回溯算法，计算过左子树之后，把左子计算过的前缀和去掉，以免干扰到右子树的计算。  

代码：
```python
def pathSum(root, sum):
    from collections import defaultdict
    def helper(node, s):
        if not node:
            return
        s += node.val
        ans[0] += d[s - sum]
        d[s] += 1
        helper(node.left, s)
        helper(node.right, s)
        d[s] -= 1
    d = defaultdict(int)
    d[0] = 1
    ans = [0]
    helper(root, 0)
    return ans[0]
```

[1248. 统计「优美子数组」](https://leetcode-cn.com/problems/count-number-of-nice-subarrays/)  
思路：奇数视为1，偶数视为0，和为k的连续子数组就是优美子数组了，剩下的就符合前缀和的标准了。  

代码：
```python
def numberOfSubarrays2(nums: List[int], k: int) -> int:
    from collections import defaultdict
    s = defaultdict(int)
    s[0] += 1
    c = 0
    res = 0
    for x in nums:
        if x & 1:
            c += 1
        if c >= k:
            res += s[c - k]
        s[c] += 1
    return res
```

[862. 和至少为K的最短子数组](https://leetcode-cn.com/problems/shortest-subarray-with-sum-at-least-k)  
思路：  
把题目翻译一下，求两前缀和相减大于等于K (pre[i] - pre[j] >= K) 的最小的i - j值。  

在前缀和的基础上还要用个双向的单调队列  
看到这个双向单调队列别慌，来看看为什么要这么复杂的数据结构：

现在考虑下面的两个情况：  

如果左边有两个位置j1和j2，j1 < j2，pre[j1] >= pre[j2]，如果当前走到i的位置且与j1满足题目要求，那么也一定可以与j2满足需求，由于j2 > j1，j2距离i更近，所以只要有这种情况，就不再去考虑j1那个位置了，也就是不去考虑pre数组中的逆序的情况。  
> 想要满足上述要求，维护一个单调递增的栈就可以。  

而一个单增的栈，与当前对比需要从小到大去比，因为从大到小可能第一步就不符合了，从小到大可以保证找到那个最短的数组。

对于固定的左边位置j，如果与当前的右边位置i1和i2都满足答案要求，i1 < i2，那么i2-j > i1-j，所以如果i1满足条件的时候，i1-j就是j作为子数组左边界的最短子数组的长度，i1再向右移动就不需要j了，所以要pop掉。  

> 想同时满足上述两个需求，需要一个能从头和尾执行pop的数据结构，就要用双向的队列。

代码：
```python
def shortestSubarray(A: List[int], K: int) -> int:
    pre = [0]
    for x in A:
        pre += [pre[-1] + x]
    q = []
    i, n = 0, len(pre)
    res = n + 1
    for i in range(n):
        while q and pre[i] <= pre[q[-1]]:
            q.pop()
        while q and pre[i] >= pre[q[0]] + K:
            res = min(res, i - q.pop(0))
        q.append(i)
    return res if res != n + 1 else -1
```

