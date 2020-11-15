Title:【算法学习】摩尔投票法求众数
Date: 2019-11-15 19:10
Modified: 2019-11-15 19:10
Category: Leetcode
Tags: Leetcode, Algorithm, Math, Python3
Slug: algo_boyer_moore_vote
Author: Rivarrl

> 记录一下今天学习到的一个有趣的算法：摩尔(Boyer-Moore)投票法  

没题干说太抽象，直接上题：  
[169. 求众数](https://leetcode-cn.com/problems/majority-element/)  
思路：这道题有个很隐蔽的已知条件，我看到题解才发现，那就是题目和我们保证这个众数是存在的，这个保证是摩尔投票法的前提。
数组长度n=len(nums)  
按题目中定义的，个数超过n//2的数是众数，那么众数的个数至少是n//2+1个，比如n=6，z>=4；n=7，z>=4，所以n无论是奇数偶数，众数都要比非众数至少多出1个。推出众数最多只能存在1个，而题目又保证有这个众数，说明nums中肯定有个数是众数。  
摩尔投票法就是在这个条件下得以正常运行的，它令当前出现次数较多的数"假定"为众数，然后去统计众数和非众数的个数，当它们的个数相等时，就不看之前的部分，因为众数至少比非众数多1，如果再次出现，计数器+1，如果出现其它数字，计数器-1，如果计数器减到0，就重新假定下一个数为众数，直到最后剩下的那个数就是众数。  

例如：  
nums = [1,1,2,2,2,1,1]  
观察得知众数是1，用摩尔投票法，需要定义两个变量，base和ctr，base用来选择当前的“众数”，初始为None，ctr是它的计数器，初始为0。  

i   | current | base | ctr
--   | -- | -- | --
init| / | None  |  0   
0   | 1 | 1 | 1
1   | 1 | 1 | 2
2   | 2 | 1 | 1
3   | 2 | 1 | 0
4   | 2 | 2 | 1
5   | 1 | 2 | 0
6   | 1 | 1 | 1

最终答案就是i=6的时候的base值1  

按它的原理分析一下：  
走到i=3的时候出现两个众数和两个非众数，i<=3的部分无视掉也可以在后面找到众数，继续看后面  
走到i=5的时候出现1个众数和1个非众数，i<=5的部分无视  
最后众数 = base = 1, ctr = 1

代码：
```python
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        ctr = 0
        base = None
        for e in nums:
            if ctr == 0:
                base = e
            if e == base:
                ctr += 1
            else:
                ctr -= 1
        return base
```

[229. 求众数 II](https://leetcode-cn.com/problems/majority-element-ii/)  

思路：摩尔投票法变种，区别是本题定义众数是个数大于len(nums)//3的数，至多可以有两个众数，用两个变量来存储这两个众数并计数  
出现前两个数时分别为两个变量赋值并让计数器累加，

```python
class Solution:
    def majorityElement(self, nums: List[int]) -> List[int]:
        a1, a2 = None, None
        c1, c2 = 0, 0
        gap = len(nums) // 3
        for e in nums:
            if c1 == 0 and e != a2: a1, c1 = e, 1
            elif c2 == 0 and e != a1: a2, c2 = e, 1
            elif e == a1: c1 += 1
            elif e == a2: c2 += 1
            else:
                if a1: c1 -= 1
                if a2: c2 -= 1
        res = []
        if c1 > 0 and nums.count(a1) > gap:
            res.append(a1)
        if c2 > 0 and nums.count(a2) > gap:
            res.append(a2)
        return res
```