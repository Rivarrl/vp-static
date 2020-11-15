Title:【算法总结】最大值最小化
Date: 2019-11-11 15:23
Modified: 2019-11-11 15:23
Category: Leetcode
Tags: Leetcode, Algorithm, Python3
Slug: min_max_binary_search
Author: Rivarrl

### 最大值最小化和最小值最大化

> 主要思路就是使用二分查找+一个自定义judge方法，注意初始边界的选取。  
> 这类问题我第一次见到的时候，会把它误认为是用动态规划去解，然而动态规划过于复杂（因为每个状态都影响着全局，可能解决不了）。  
> 仔细读题很容易能找出这类题的相同点，就是在最小值里选最大的，或是最大值里选最小的。  

[1231. 分享巧克力](http://206.81.6.248:12306/leetcode/divide-chocolate/description)  
> 网址变了，因为力扣双周赛的题比完了就变成会员可见了。（流下了贫穷的泪水）  

题目：  
1231 分享巧克力  

> 你有一大块巧克力，它由一些甜度不完全相同的小块组成。我们用数组sweetness来表示每一小块的甜度。  
你打算和K名朋友一起分享这块巧克力，所以你需要将切割K次才能得到K+1块，每一块都由一些 连续的小块组成。  
为了表现出你的慷慨，你将会吃掉总甜度最小的一块，并将其余几块分给你的朋友们。  
请找出一个最佳的切割策略，使得你所分得的巧克力总甜度最大，并返回这个 最大总甜度。  

> 示例 1：  
输入：sweetness = [1,2,3,4,5,6,7,8,9], K = 5  
输出：6  
解释：你可以把巧克力分成 [1,2,3], [4,5], [6], [7], [8], [9]。  

> 示例 2：  
输入：sweetness = [5,6,7,8,9,1,2,3,4], K = 8  
输出：1  
解释：只有一种办法可以把巧克力分成 9 块。  

> 示例 3：  
输入：sweetness = [1,2,2,1,2,2,1,2,2], K = 2  
输出：5  
解释：你可以把巧克力分成 [1,2,2], [1,2,2], [1,2,2]。

> 提示：  
0 <= K < sweetness.length <= 10^4  
1 <= sweetness[i] <= 10^5


思路：在规定自己获得最小甜度值的巧克力块的前提下让自己得到最大的甜度值，属于最小值最大化问题。初始边界是自己可获得的甜度取值范围，1到总甜度的K+1等分。  

代码：  
```python
def maximizeSweetness(sweetness: List[int], K: int) -> int:
    def judge(x):
        # 最小块大小为x的时候，能不能掰够K+1块
        cur = piece = 0
        for a in sweetness:
            cur += a
            if cur >= x:
                cur = 0
                piece += 1
            if piece >= K+1:
                return True
        return False
    lo, hi = 1, sum(sweetness) // (K+1)
    while lo < hi:
        mid = lo + (hi + 1 - lo) // 2
        if judge(mid):
            lo = mid
        else:
            hi = mid - 1
    return lo
```
[P1182.数列分段 Section II](https://www.luogu.org/problem/P1182)  
同上题，可以练练手

[P2678. 跳石头](https://www.luogu.org/problem/P2678)  

思路：judge函数定义：设定一个当前需要跳的最小距离x，不满足的话石头就要搬走，最终统计搬走的数量是否超出预算。初始左右边界分别为1和L

代码：
```python
import sys

# P2678. 跳石头
def p2678(L, N, M, arr):
    arr = [0] + arr + [L]
    def judge(x):
        last = removes = 0
        for i in range(1, N+2):
            if arr[i] - last < x:
                removes += 1
            else:
                last = arr[i]
        # 如果当前的步长需要移除的石头数超出了预算返回false
        if removes > M:
            return False
        return True

    lo, hi = 1, L
    while lo < hi:
        mid = lo + (hi - lo + 1) // 2
        if judge(mid):
            lo = mid
        else:
            hi = mid - 1
    return lo

if __name__ == '__main__':
    line1 = sys.stdin.readline().strip()
    L, N, M = map(int, line1.split(' '))
    arr = [0] * N
    for i in range(N):
        arr[i] = int(input())
    res = p2678(L, N, M, arr)
    print(res)
```

[P1557. 切绳子](https://www.luogu.org/problem/P1577)  
思路：判断一下以mid为最小的长度的时候，可不可以切够要求的段数，如果不能说明mid给大了，二分折半取mid-1为上界，hi = mid - 1；如果可以，说明这个数可能是答案，也可能小了，折半的时候带上这个边界，取lo=x。  
judge函数判断能否切够K段

代码：
```python
import sys

# P1557. 切绳子

def p1557(N, K, arr):
    def judge(x):
        if x * K > SUM: return False
        piece = 0
        for e in arr:
            piece += e // x
        if piece < K:
            return False
        return True

    lo, hi = 0, MAX
    while lo < hi:
        mid = lo + (hi + 1 - lo) // 2
        if judge(mid):
            lo = mid
        else:
            hi = mid - 1
    return lo / 100


if __name__ == '__main__':
    line1 = sys.stdin.readline().strip()
    N, K = map(int, line1.split(' '))
    arr = [0] * N
    MAX, SUM = -1, 0
    for i in range(N):
        arr[i] = int(float(input()) * 100)
        SUM += arr[i]
        if arr[i] > MAX:
            MAX = arr[i]
    res = p1557(N, K, arr)
    print("%.2f"%res)
```

