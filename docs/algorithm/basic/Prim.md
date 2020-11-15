Title:【算法学习】Prim算法
Date: 2019-11-22 20:14
Modified: 2019-11-22 20:14
Category: Algorithm
Tags: Algorithm, Graph, Python3
Slug: algo_prim
Author: Rivarrl

> 今天学习了算法4书上面的Prim最小生成树算法。 

> Prim算法使用了一个带索引的优先队列，每一次visit就是在最小生成树中添加一个树枝节点，并更新每个树外节点和当前最小生成树的最小距离，然后每次取得距离当前树最近的那个点作为下一个树枝节点，以此循环下去直到所有节点都加入到树中程序结束。  

详细说明看注释吧。

```python
import heapq
# 定义权重的上界
inf_w = (1 << 31) - 1

# Prim算法求最小生成树
def prim(n, graph):
    def visit(u):
        """
        将u添加到最小生成树中，并更新pq内容
        """
        marked[u] = 1
        e = graph[u]
        while e:
            v = e.v
            # marked[v]说明u-v已经在最小生成树中了，算做失效边，跳过
            if not marked[v] and e.w < dist_to[v]:
                edge_to[v] = e
                dist_to[v] = e.w
                for i in range(len(pq)):
                    if pq[i][1] == v:
                        pq[i] = (dist_to[v], v)
                        heapq.heapify(pq)
                        break
                else:
                    heapq.heappush(pq, (dist_to[v], v))
            e = e.next
    # 记录访问过的节点
    marked = [0] * n
    # 有效横切边
    pq = []
    # 距离树最近的边
    edge_to = [None] * n
    # edge_to的边的权重，初始为最大
    dist_to = [inf_w] * n
    # 把0作为程序入口，0是树的第一个节点，0.0是0当前与树的距离
    heapq.heappush(pq, (0.0, 0))
    while pq:
        # 将距离树最近的节点添加到树中
        w, u = heapq.heappop(pq)
        visit(u)
    for e in edge_to[1:]:
        print("%d -[%.2f]- %d" % (e.u, e.w, e.v))

if __name__ == '__main__':
    # 最小生成树是无向带权图，本次实现按照算法4的方法，用邻接表表示图
    graph = build_graph(8, [[4,5,.35],[4,7,.37],[5,7,.28],[0,7,.16],[1,5,.32],[0,4,.38],[2,3,.17],
                            [1,7,.19],[0,2,.26],[1,2,.36],[1,3,.29],[2,7,.34],[6,2,.40],[3,6,.52],
                            [6,0,.58],[6,4,.93]],
                direction=0, tp=2)
    prim(8, graph)
```

打印结果：
```
7 -[0.19]- 1
0 -[0.26]- 2
2 -[0.17]- 3
5 -[0.35]- 4
7 -[0.28]- 5
2 -[0.40]- 6
0 -[0.16]- 7
```

> Prim算法的完整过程，可以想象成这样一个变化过程：  
一棵树从一个根节点为中心开始不断扩散最终至图中的所有节点。