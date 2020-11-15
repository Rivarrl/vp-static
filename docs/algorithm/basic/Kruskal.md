Title:【算法学习】Kruskal算法
Date: 2019-11-23 22:33
Modified: 2019-11-23 22:33
Category: Algorithm
Tags: Algorithm, Graph, Python3
Slug: algo_kruskal
Author: Rivarrl

> 今天学习了算法4书上面的Kruskal最小生成树算法。  

> Kruskal算法将所有的边都加入到优先队列中，每次取得最小的边，并使用union-find的方法来判断无效边。  

> 上面的第一句很好理解，每次找到全局最短的边，作为最小生成树的一个边。相当于每次找到两个点，把它们连起来(union)，将它们的连通性记录下来，为后面新的边是否有效做判断(find)。这种问题是典型的动态连通性问题，用union-find。

如果不了解union-find，可以跳转学习[前置技能点：union-find](https://rivarrl.github.io/algo_union_find)

代码：
```python
import heapq

# Kruskal算法求最小生成树
def kruskal(n, graph):
    # 加权quick-union
    uf = WeightedQuickUnionUF(n)
    pq = []
    res = []
    for u in range(n):
        e = graph[u]
        while e:
            heapq.heappush(pq, e)
            e = e.next
    while pq and len(res) < n - 1:
        e = heapq.heappop(pq)
        u, v = e.u, e.v
        # 忽略失效边
        if uf.connected(u, v): continue
        # 添加新边时将边两端的节点连通
        uf.union(u, v)
        res.append(e)
    for e in res:
        print("%d -[%.2f]- %d" % (e.u, e.w, e.v))
        
if __name__ == '__main__':
    graph = build_graph(8, [[4, 5, .35], [4, 7, .37], [5, 7, .28], [0, 7, .16], [1, 5, .32], [0, 4, .38], [2, 3, .17],
                            [1, 7, .19], [0, 2, .26], [1, 2, .36], [1, 3, .29], [2, 7, .34], [6, 2, .40], [3, 6, .52],
                            [6, 0, .58], [6, 4, .93]],
                        direction=0, tp=2)
    kruskal(8, graph)
```

打印结果： 
```
0 -[0.16]- 7
3 -[0.17]- 2
1 -[0.19]- 7
0 -[0.26]- 2
7 -[0.28]- 5
5 -[0.35]- 4
2 -[0.40]- 6
```

> Kruskal算法的完整过程，可以想象成这样一个变化过程：  
每次找到一个零散的树枝，最后慢慢拼接成完整的一棵树。（星星之火可以燎原，个人认为这句话很适合形容这个过程）