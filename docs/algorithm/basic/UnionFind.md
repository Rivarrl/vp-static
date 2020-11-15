Title:【算法学习】UnionFind算法
Date: 2019-11-20 21:42
Modified: 2019-11-20 21:42
Category: Algorithm
Tags: Algorithm, Graph, Python3
Slug: algo_union_find
Author: Rivarrl

> Union-Find（并查集）是一种常用的数据结构，它用来解决动态连通性问题。  

> 啥是动态连通性问题呢？书中举的几个例子很好理解，贴两个转述一下。  

计算机-局域网问题：  
一间没有网络覆盖的机房中有n台电脑，起初他们有n个互不相干的点，这就是连通分量，起个变量名叫ctr。每当有两台不属于同一连通分量的电脑建立连接之后，连通分量数ctr会-1，最终想知道两台电脑之间有没有连接上，或是整间机房有多少张局域网。

人际关系问题：  
我们假定朋友的朋友就是朋友，现场有n个人，我们再次假定每两个人握过手之后就是<del>塑料</del>朋友了，那么最开始的时候没有人握过手，连通分量数为ctr=n，每有两个不是朋友关系的人握手，ctr就会-1，最终想知道最后有多少组朋友关系，或者指定两个人问他们是不是朋友关系。

上述的问题就属于动态连通性问题，都可以用union-find来解决。  

> Union-Find的三种实现分别是quick-find，quick-union和weighted-quick-union  

首先贴出UnionFind的框架：
```python
class UF:
    def __init__(self, n):
        # 触点连通的根节点编号
        self.idx = [i for i in range(n)]
        # 连通分量数
        self.ctr = n

    def count(self):
        return self.ctr

    def connected(self, p, q):
        return self.find(p) == self.find(q)

    def find(self, p):
        pass

    def union(self, p, q):
        pass
```

**quick-find算法**  
quick-find的思想很简单，如果p和q是连接关系，那么idx[p]=idx[q]，使所有同一连通分量内的触点的idx值相同即可。  
代码：
```python
# quick-find实现
class QuickFindUF(UF):
    def __init__(self, n):
        super().__init__(n)

    def find(self, p):
        return self.idx[p]

    def union(self, p, q):
        i = self.find(p)
        j = self.find(q)
        if i == j: return
        for k in range(len(self.idx)):
            if self.idx[k] == i:
                self.idx[k] = j
        self.ctr -= 1
```
quick-find中的find时间复杂度低，是O(1)，而union的时间复杂度高，是O(n)。  

**quick-union算法**  
union复杂度过高，导致quick-find整体复杂度太高，需要进行优化。优化的地方就是idx的意义，quick-find中idx中有太多相同的值，导致它能表达的东西不多。  
我们使用quick-union的方法，让idx[p]指向与它直接相连的上一个节点，初始化的时候让每个节点的idx值等于自己。让find的过程变得像顺藤摸瓜一样，顺着当前的p得到与它相连接的idx[p]，再通过idx[p]找到idx[idx[p]]，最终找到一个自连接的节点，即idx[x] = x，这个点就是p的根节点。  

代码：
```python
# quick-union的实现
class QuickUnionUF(UF):
    def __init__(self, n):
        super().__init__(n)

    def find(self, p):
        while self.idx[p] != p:
            p = self.idx[p]
        return p

    def union(self, p, q):
        i = self.find(p)
        j = self.find(q)
        if i == j: return
        self.idx[i] = j
        self.ctr -= 1
```
quick-union很像一棵N叉树，find和union时间复杂度都是O(h)。（h是p所在位置的深度）  
quick-union的整体复杂度已经降了下来，但是考虑极端情况的话，比如p所在的位置很深（一条链表的尾部）的时候执行find(p)，时间复杂度还是会很高。  
如何避免树过深，是解决quick-union算法的根本问题。  

**加权quick-union算法**  
这时人们发现quick-union还有可以优化的点，那就是union的时候，很随意的把p的祖先节点一股脑的接到了q的祖先节点上，如果p所在的是一颗很深的树，而q的是一颗小树，那么把p所在的树接在q的后面，无疑会增加树的整体高度，反之则不会。  

weighted-quick-union就是在quick-union的基础上加上一个sz数组来统计每个编号的点作为根节点的树有多少节点。根据sz的值来决定本次是p树去接q树还是q树去接p树。  

代码：
```python
# weighted-quick-union
class WeightedQuickUnionUF(UF):
    def __init__(self, n):
        super().__init__(n)
        # 存储以p为根节点的分量大小
        self.sz = [1] * n

    def find(self, p):
        while self.idx[p] != p:
            p = self.idx[p]
        return p

    def union(self, p, q):
        i = self.find(p)
        j = self.find(q)
        if i == j: return
        if self.sz[i] < self.sz[j]:
            self.idx[i] = j
            self.sz[j] += self.sz[i]
        else:
            self.idx[j] = i
            self.sz[i] += self.sz[j]
        self.ctr -= 1
```
weighted-quick-union由于减小了树的高度，find和union的时间复杂度为O(lgn)  

**路径压缩的加权quick-union算法**  
这个算法据说union和find时间复杂度都是接近O(1)的，tql。不过我查了一下，涉及到**持久化数组**等前置技能点，受限于现在太菜看不懂，等后续把前置技能点点满了再来补上吧。


相关题目：  
[1202. 交换字符串中的元素](https://leetcode-cn.com/problems/smallest-string-with-swaps/)  
思路：  
union-find派上用场了，我们直接用改良版里已知最快的加权quick-union，使同一连通分量里的字符字典序排序最低就可以了。  

代码：
```python
def smallestStringWithSwaps(s: str, pairs: List[List[int]]) -> str:
    # 找连通分量，用union-find，相同连接中的位置的字符相对字典序最低
    from collections import defaultdict
    def find(p):
        while parent[p] != p:
            p = parent[p]
        return p

    def union(i, j):
        root_i = find(i)
        root_j = find(j)
        if root_i == root_j: return
        if sz[root_i] > sz[root_j]:
            parent[root_j] = root_i
            sz[root_i] += sz[root_j]
        else:
            parent[root_i] = root_j
            sz[root_j] += sz[root_i]

    n = len(s)
    parent = [i for i in range(n)]
    sz = [1 for _ in range(n)]
    for i, j in pairs:
        union(i, j)
    d = defaultdict(list)
    for i in range(n):
        d[find(i)].append(i)
    ls = [e for e in s]
    for v in d.values():
        tmp = sorted([ls[e] for e in v])
        for i in range(len(v)):
            ls[v[i]] = tmp[i]
    s = ''.join(ls)
    return s
```

