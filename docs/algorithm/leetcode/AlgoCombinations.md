Title:【算法总结】排列组合
Date: 2019-11-04 20:11
Modified: 2019-11-05 14:30
Category: Leetcode
Tags: Leetcode, Algorithm, Math, Python3
Slug: algo_combinations
Author: Rivarrl

### 排列组合相关的题以及解法

> 这里的排列组合指数学上的排列组合问题  
> 用数学知识来解题即可  
> 这类问题的最大特点为求一个数字，而不是求所有结果的集合(这类问题一般要用回溯法)  

> 具体看例子吧  

[357. 计算各个位数不同的数字个数](https://leetcode-cn.com/problems/count-numbers-with-unique-digits/)  

思路：  
排列组合，每一位在0~9中选择一个数，如果n比10大，必定会出现重复，所以只考虑在10以内的情况就行。  

我们按位从高向低选择，每有一个位置选择一个数字，候选区的数字就会减一。如果不考虑0在最高位的情况，单纯的进行10个数字的全排列，答案会是n!（因为想要满足各位数不同的话，从高到低每一位有10,9,8,...,3,2,1个剩余数字可选）  

本题并不能忽略高位0的情况，所以要对问题分类讨论，分类当然是高位选0还是选1~9这两类。  

这里就假设n=4，也就是0~9999，这个区间按上述分类规则，可拆分为0~999和1000~9999两部分，可以观察得出第一部分是n=3的答案，第二部分则是在千位选定一个非0数的时候的排列组合，也就是  
`9(1~9) * 9 (0~9排除位选择的数字) * 8 * 7 = 9*9*8*7`  
以此类推，第一部分(n=3)的解的第二部分为`9*9*8`  
...  
n=1时解是10  
而n=10时第二部分解是`9*9*8*7*6*5*4*3*2*1`  
可以观察得出：n=k的第二部分解就是上述n=10式子的前k项乘积的结果，如果我们把第二部分的公式记作函数f0(n), 1<= n <=10

$$
q = \[9,9,8,7,6,5,4,3,2,1\]
$$
$$
f_0(i) = \prod_k^iq\[k\]
$$

本题就可以归纳成如下公式：  
$$
f(n) = 
\begin{cases} 
f(n-1) + f_0(n), & n > 1 \\\\ 
10, & n=1 
\end{cases}
$$

由于f0(1) = 9，上式可以化简为：  
$$
f(n) = \sum_{i=1}^{n}f_0(i) + 1
$$

代码：  
```python
class Solution:
    def countNumbersWithUniqueDigits(self, n: int) -> int:
        n = min(10, n)
        q = [None, 9] + [i for i in range(9, 0, -1)]
        res, c = 1, 1
        for i in range(1, n+1):
            c *= q[i]
            res += c
        return res
```


[1012. 至少有1位重复的数字](https://leetcode-cn.com/problems/numbers-with-repeated-digits)  

思路：  
**至少有1位重复的数字的总数 = N - 没有重复数字的总数**  
问题可转成求**没有重复的数字的总数**，困难在于给的N不是位数而是具体的数值。  
这里把上一题的方法称作f1（本题不包括0，即f0(1)=9），有：  
$$
f_1(n) = \sum_i^n f_0(i)
$$
用上一题的结论，方便起见，我们把**N的位数记作D(N)**, **N的第i高位记作N[i]**, 如果大于等于11了，求f1(10)即可。  
D(N)小于11的时候，还是从最高位选择，这就需要分类讨论了，总体要分为以下三类，第一部分还是0，第二部分为1~(-1)，第三部分为N[0]。  

**第一部分选0**，区间就是0~10^(D(N)-1) - 1 (0到D(N)-1个9)，也就是f1(digit(N) - 1)  

**第二部分选1~(x-1)**，注意有可能不存在（x=1时），需要判断一下，这部分就是首位受限制的一个排列组合，限制是只能从1到x-1中选，也就是N[0]-1种可能，解为`(N[0]-1)*9*8*...*2*1`  
由于后面f3会用到类似上述操作，可以把上述功能抽象成方法f2(i, base), i表示从哪一位开始计算，base是将第i位的数字替换为base，比如上面说的情况应该调用f2(0, N[0]-1)，实际上就是上一题f0的变种，公式如下：
$$
q = \[9,9,8,7,6,5,4,3,2,1\]
$$
$$
f_2(i, base) = base × \prod_{k=i+1}^{D(N)-1}q\[k\]
$$  

**第三部分是选x**，选定x，就说明后面的位置不能再选择x了，所以需要一个visit数组来记录，visit数组用0和1代表0~9未使用和已使用。当本次选定N[0]后，后面的位数可以从0~N[1]选择，如果N[1]\>N[0]的话，选择数字的数量就会受到N[0]的影响而减1，推广到第k位，第k位的数值为N[k]，它会受到所有在N[k]之前访问过的比N[k]小的数的影响而减sum(visit[0]~visit[N[k]])。  
由于首位已经是非0数了，0的特殊性就不用再讨论，第三部分可分为两部分：0~N[i]-1 中未使用的数和N[i]。  
如果挑选的是N[i]的话，是一个递归，就是f3(i+1)的结果，**注意每次递归前把上面的visit求和算出来并且进行本次visit的更新**，而如果当前的N[i]前面出现过，就直接跳出，因为再次选择就造成重复，不满足要求；  
如果是0~N[i]-1（注意可能没有这部分，全被使用过或N[i]=0）部分，需要用当前的可选数量值，假设为base，去做上面f2的操作，解释一下，前面一定是j属于0~i-1次，每次选定N[j]，才会走到当前这一步，所以在`9*9*8*...*2*1`的连乘式中的前i-1项都应该是1，第i项为当前可选的base，也就是调用f2(i, base)。令第三部分为f3(i)的话，由于i=0时为父问题，所以`1<=i<=D(N)-1`，有  
$$
f_3(i) = 
\begin{cases} 
f_3(i+1) + f_2(i, N[i] - \sum_{j=0}^{N[i]-1}\mathbb{I}(visit[j] == 1)), & 1 <= i < n-1,  visit[i]=0 \\\\ 
f_2(i, N[i] - \sum_{j=0}^{N[i]-1}\mathbb{I}(visit[j] == 1)), & 1 <= i < n-1, visit[i]=1 \\\\
N[i] + 1 - \sum_{j=0}^{N[i]}\mathbb{I}(visit[j] == 1), & i = n
\end{cases}
$$
> 注：空心的I为示性函数，函数内部表达式成立为1，不成立为0   

整理一下，本体可写成如下公式：  
$$
g(N) = N - f(N)
$$
其中，
$$
f(N) = 
\begin{cases}
f_1(10), & D(N) > 10 \\\\
f_1(D(N)-1) + f_2(0, N\[0\] - 1) + f_3(0), & 1 <= D(N) <= 10
\end{cases}
$$
找个特例手推以下就好了，比如N = 1962


代码：  
```python
class Solution:
    def numDupDigitsAtMostN(self, N: int) -> int:
        def f1(n):
            res, x = 0, 1
            for i in range(n):
                x *= q[i]
                res += x
            return res
    
        def f2(k, base):
            res = base
            for i in range(k+1, n):
                res *= q[i]
            return res
    
        def f3(i):
            m = int(sn[i])
            if i == n - 1: return m + 1 - sum(visit[:m+1])
            res = 0
            base = m - sum(visit[:m])
            if visit[m] == 0:
                visit[m] = 1
                res += f3(i + 1)
            if base > 0:
                res += f2(i, base)
            return res
    
        if N < 10: return 0
        sn = str(N)
        n = len(sn)
        q = [9] + [i for i in range(9, 0, -1)]
        visit = [0] * 11
        res = N
        if n - 1 >= 10:
            res -= f1(10)
        else:
            x = int(sn[0])
            res -= f1(n-1)
            if x - 1 > 0:
                res -= f2(0, x - 1)
            visit[x] += 1
            res -= f3(1)
        return res
```