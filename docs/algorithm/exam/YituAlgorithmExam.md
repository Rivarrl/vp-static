Title:【笔试题】依图科技2019算法
Date: 2019-10-30 20:02
Modified: 2019-11-02 23:40
Category: Algorithm
Tags: Algorithm, Python3, Exam
Slug: yitu_algo_exam
Author: Rivarrl

### 秋招题复现（依图科技2019 - 算法）

> 四道题有三道都没ac，打击很大...复现一下  
> 不保证对，先写下来以后和感兴趣的同学讨论

输入输出就不按照笔试的方式了，直接用函数输入了

#### 题目1 - Ensemble  

目前有一个二分类任务，已经有2个模型A B  
对于一张图 A模型会输出两个值A0 A1  
表示A模型认为这张图属于类别0的概率为A0，1的概率为A1  
B和A相同  
对于一张label为0的图而言，A0>A1时，说明A模型预测正确，A0<=A1时预测错误  
对于一张label为1的图而言，A0<A1时，说明A模型预测正确，A0>=A1时预测错误  
定义一个ensemble的权量x, 0<=x<=1

定义C(x) 是A，B模型按照权重值为x,1-x的ensemble模型  
C(x)认为这张图是类别0的概率为`x * A0 + (1-x) * B0`  
C(x)认为这张图是类别1的概率为`x * A1 + (1-x) * B1`  

如果x服从均匀分布
求C(x)模型在这n张图片上做对的个数的数学期望  

分析：  
C(x)预测对这一事件包括C(x)和类别同0和同1两种  
同0时，需要让C(x)的1式减去C(x)的2式 > 0；即`x*(A0-A1) + (1-x)*(B0-B1) > 0`  
同1时，1式减2式小于0；即`x*(A0-A1) + (1-x)*(B0-B1) < 0`    
结合label的数值可将两个不等式化为一个不等式：   
`(1-2*label)*x*(A0-A1) + (1-x)*(B0-B1) > 0`     
求解上述不等式得：  
`z = (B1-B0) / (A0-A1+B1-B0)`     
`x > z, label = 0时`      
`x < z, label = 1时`  
z在0-1之间, x > z的期望为1-z, x < z的期望为z  
最后将每一行的期望求和  
> 注意求不等式 0不能作为分母 以及x的真实取值范围[0,1]

代码：
```py
def yt_2_ensemble(arr):
    # arr: label A0 A1 B0 B1
    res = 0.0
    for e in arr:
        label, A0, A1, B0, B1 = e
        a, b = B1 - B0, A0 - A1 + B1 - B0
        if b == 0: continue
        n = min(1, max(a/b, 0))
        if (label == 0) ^ (b < 0):
            res += 1 - n
        else:
            res += n
    return res
```

#### 题目2 - Party  

你是一个活动晚会的组织者，晚会总时长为t分钟，共有n个候选节目。  
每个候选节目有三个值，ai, bi, ci。ci表示这个节目会持续ci分钟。  
如果在第i个节目开始时，晚会已经进行了p分钟，那么参与晚会的成员对这个晚会的满意度会增加`ai + p * bi`。  
你需要在n个候选节目中挑选若干个，并安排在合适的时间，使得晚会满意度达到最大。  
要求两个节目时间不能重叠，且你可以在任意时间安排人员进行任意时长的休息（除节目进行时），而不会影响满意度。  
晚会开始的时候视为第0分钟。  

输入： 节目列表arr(ai, bi, ci)，晚会总时间t，节目总数n  
输出： 最大满意度  

例如：  
输入： arr = [[3, 2, 2], [2, 3, 4]], t=7, n=2  
输出： 18

分析：  
总时长为t，从n个候选节目挑选若干使得满意度最大，无论挑选的节目总时长是否达到t，最后一个节目表演结束都要踩着晚会结束的时间点才会使得本次选择的满意度最大化，相当于01背包问题，使用动态规划可以解决，不过由于先挑后挑影响总结果，当前的乱序数组是不满足动态规划的特性的，需要**排序**。  
排序条件很隐蔽，我们可以假设第p分钟的时候有i和j两个候选节目相继表演，如果i排在j的后面，整体满意度会增加aj + p * bj  + ai + (p+cj) * bi，如果j排在i的后面，整体满意度会增加ai + p * bi + aj  + (p+ci) * bj，令i排在j后面的满意度更大，不等式两边化简最后会得到 cj * bi > ci * bj, ci/bi < cj/bj，所以ci/bi较小的排在后面（按ci/bi大小倒序排序）才能使整体满意度最大。  
dp[i][j] 表示前i个候选节目的挑选中，最后一个节目在j时刻结束的最大满意度。  
状态转移方程：  
$$
dp[i][j]= 
\begin{cases} 
dp[i-1][j], & j < c[i] \\\\ 
max(dp[i-1][j], dp[i-1][j-c[i]] + (a[i] + b[i] * (j-c[i]))), & j >= c[i] 
\end{cases}
$$

代码：  
```py
def yt_3_party(arr, t, n):
    arr.sort(key= lambda x:(x[2] / x[1]), reverse=True)
    dp = [[0] * (t+1) for _ in range(n+1)]
    for i in range(n):
        a, b, c = arr[i]
        for j in range(t, -1, -1):
            if j < c:
                dp[i+1][j] = dp[i][j]
            else:
                dp[i+1][j] = max(dp[i][j], dp[i][j-c] + a + b * (j - c))
    return dp[n][t]
```


#### 题目3 - Beam Search  

现在有一个长度为n的权重序列 W1, W2, ..., Wn, 其中Wi表示第i时刻的权重分布, Wi可表示为Wi = (Wi1, Wi2, ..., Wim)  
需要在这个权重序列上进行beam search  
beam search 是一个启发式搜索算法  
在给定beam size = n的情况下  
每一时刻， 维护可能最优的K条记录  
下一时刻， 得到可能最优的K*M条记录，保留其中最优的K条  
特别的，若中间步骤中出现重复权重值时，选取字典序较小的  
序列用A-Z表示，所以M值不会超过26  

输入：上述序列arr，n，m，k  
输出：结果列表  

例如：  
输入：arr = [[500, 500],[900, 100],[100, 900]], n=3, m=2, k=3  
输出：["AAB", "BAB", "AAA"]  

分析：  
按照题目说的过程写即可，使用优先队列降低寻找k个最大值时的复杂度  
> 注意：字典序中, ascii码更大的排名更靠后

代码：
```py
def yt_4_beam_search(arr, n, m, k):
    def strcmp(s1, s2, i=0):
        if i == len(s1): return False
        if s1[i] == s2[i]: return strcmp(s1, s2, i+1)
        else: return ord(s1[i]) > ord(s2[i]) # 字典序 => ascii码值高的更小

    class Beam:
        def __init__(self, key, val):
            self.key = key
            self.val = val

        def __lt__(self, other):
            return strcmp(self.key, other.key) if self.val == other.val else self.val < other.val

    import heapq
    letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    origin = [Beam(letter[i], arr[0][i]) for i in range(m)]
    heapq.heapify(origin)
    status = heapq.nlargest(k, origin)
    print([st.key for st in status])
    for i in range(1, n):
        tmp = []
        for j in range(m):
            for st in status:
                tmp.append(Beam(st.key + letter[j], st.val+arr[i][j]))
        heapq.heapify(tmp)
        status = heapq.nlargest(k, tmp)
    return [st.key for st in status]
```


