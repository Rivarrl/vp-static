Title:【算法学习】Kosaraju算法求强连通分量
Date: 2019-11-19 21:22
Modified: 2019-11-19 21:22
Category: Algorithm
Tags: Algorithm, Graph, Python3
Slug: algo_kosaraju_ssc
Author: Rivarrl

> 今天从算法4那本书上学到了Kosaraju算法。  

Kosaraju算法总共分两步，两次dfs。给定有向图G  
1 用dfs计算G的反向图G'的逆后序排列  
2 根据1得到的序列顺序dfs搜索G  

建图：
```python
def build_graph(connections):
    # 构图，邻接表
    graph = defaultdict(list)
    for a, b in connections:
        graph[a].append(b)
    return graph
```

反转图G得到G'：
```python
def reverse_graph(graph):
    r_graph = defaultdict(list)
    for u in graph:
        for v in graph[u]:
            # 因为构造graph用的邻接表是假的，reverse相当于将链表倒置，所以用后进先出模拟链表倒置
            r_graph[v].insert(0, u)
    return r_graph
```

第一趟逆后序遍历G'：
```python
def reverse_post_dfs(n, graph):
    r_post = []
    marked = [0] * n
    def dfs(u):
        marked[u] = 1
        for v in graph[u]:
            if not marked[v]:
                dfs(v)
        r_post.insert(0, u)
    for u in range(n):
        if not marked[u]:
            dfs(u)
    return r_post
```

Kosaraju算法：
```python
def kosaraju(n, graph):
    r_graph = reverse_graph(graph)
    r_post = reverse_post_dfs(n, r_graph)
    ctr = 0
    color = [0] * n
    marked = [0] * n
    def dfs(u):
        nonlocal ctr
        marked[u] = 1
        color[u] = ctr
        for v in graph[u]:
            if not marked[v]:
                dfs(v)
    for u in r_post:
        if not marked[u]:
            dfs(u)
            ctr += 1
    return color, ctr
```

求强连通分量：
```python
def strongly_connected(n, connections):
    graph = build_graph(connections)
    color, ctr = kosaraju(n, graph)
    return color, ctr
```

