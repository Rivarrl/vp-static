Title:【算法学习】四种常用的构图方法
Date: 2019-11-21 19:25
Modified: 2019-11-21 19:25
Category: Algorithm
Tags: Algorithm, Graph, Python3
Slug: algo_build_graph
Author: Rivarrl


> 最近经常用python做图论的题，把常用的几种构图方法造个轮子

- 伪邻接表（python可用的最快的方法，带权图不支持）
- 邻接矩阵（适用于稠密图，构造过程简单）
- 邻接表（适用于稀疏图，构造过程较为复杂）
- 链式前向星（性能与占用介于邻接矩阵和邻接表之间的折中方法，构造和遍历都较为简单）

把以上4种方法整合到一起，用一个函数就可以生成了。  
构图方法：
```python
def build_graph(n, connections, direction=1, tp=1):
    # tp 1：dict伪邻接表，2：邻接表，3：邻接矩阵，4：链式前向星
    return globals().get({
        1: "_fake_linked_list",
        2: "_linked_list",
        3: "_matrix",
        4: "_forward_star_list"
    }[tp])(n, connections, direction)
```

伪邻接表：
```python
def _fake_linked_list(n, connections, direction=1):
    # 构图，伪邻接表
    graph = defaultdict(list)
    for a, b in connections:
        graph[a].append(b)
        if direction == 0:
            graph[b].append(a)
    return graph
```

邻接矩阵：
```python
def _matrix(n, connections, direction=1):
    # direction 有向无向 0 无向，1 有向
    # weights 点权 None 无权，list(int) 带权
    w = len(connections[0]) == 3
    if w:
        arr = [[inf_w] * n for _ in range(n)]
        for a, b, c in connections:
            arr[a][b] = c
            if direction == 0:
                arr[b][a] = c
    else:
        arr = [[0] * n for _ in range(n)]
        for a, b in connections:
            arr[a][b] = 1
            if direction == 0:
                arr[b][a] = 1
    return arr
```

邻接表：
```python
class Node:
    def __init__(self, u, v, w = 1, nxt = None):
        self.u = u
        self.v = v
        self.w = w
        self.next = nxt

    def __lt__(self, other):
        return self.w < other.w


def _linked_list(n, connections, direction = 1):
    # direction 有向无向 0 无向，1 有向
    # weights 点权 None 无权，list(int) 带权
    def build_connections(a, b, c=None):
        node = Node(a, b)
        if c: node.w = c
        if not arr[a]:
            arr[a] = node
        else:
            p = arr[a]
            while p.next:
                p = p.next
            p.next = node

    arr = [None] * n
    w = len(connections[0]) == 3
    for i in range(len(connections)):
        a, b = connections[i][0], connections[i][1]
        c = connections[i][2] if w else None
        build_connections(a, b, c)
        if direction == 0:
            build_connections(b, a, c)
    return arr
```

链式前向星：
```python
class StarNode:
    def __init__(self, to=0, w=0, nxt=0):
        self.to = to
        self.w = w
        self.next = nxt
    
    def __lt__(self, other):
        return self.w < other.w


def _forward_star_list(n, connections, direction=1):
    # direction 有向无向 0 无向，1 有向
    # weights 点权 None 无权，list(int) 带权
    ne = len(connections)
    head = [-1] * n
    arr = [StarNode() for _ in range(ne + 1)]
    w = len(connections[0]) == 3
    for i in range(ne):
        a, b = connections[i][0], connections[i][1]
        arr[i].to = b
        if w: arr[i].w = connections[i][2]
        arr[i].next = head[a]
        head[a] = i
    if direction == 0:
        arr += [StarNode() for _ in range(ne + 1)]
        for i in range(ne):
            j = i + ne
            a, b = connections[i][0], connections[i][1]
            arr[j].to = a
            if w: arr[j].w = connections[i][2]
            arr[j].next = head[b]
            head[b] = j
    return head, arr
```

附四种构图法构图后的遍历：
```python
if __name__ == '__main__':
    # 伪邻接表的图遍历
    print("="*30)
    print("伪邻接表的图遍历")
    a = build_graph(10, [[0,1],[1,2],[2,3],[2,4],[4,3],[4,5],[5,2],[4,6],[6,7],[7,1],[7,8],[8,9]])
    for u in range(10):
        for v in a[u]:
            print("%d -> %d" % (u, v))
    print("="*30)

    # 邻接表的图遍历
    print("="*30)
    print("邻接表的图遍历")
    a = build_graph(10, [[0,1],[1,2],[2,3],[2,4],[4,3],[4,5],[5,2],[4,6],[6,7],[7,1],[7,8],[8,9]], tp=2)
    for u in range(10):
        p = a[u]
        while p:
            print("%d -> %d" % (p.u, p.v))
            p = p.next
    print("="*30)

    # 邻接矩阵的图遍历
    print("="*30)
    print("邻接矩阵的图遍历")
    a = build_graph(10, [[0,1],[1,2],[2,3],[2,4],[4,3],[4,5],[5,2],[4,6],[6,7],[7,1],[7,8],[8,9]], tp=3)
    for u in range(10):
        for v, w in enumerate(a[u]):
            if w != 0:
                print("%d -> %d" % (u, v))
    print("="*30)

    # 链式前向星的图遍历
    print("="*30)
    print("链式前向星的图遍历")
    a = build_graph(10, [[0,1],[1,2],[2,3],[2,4],[4,3],[4,5],[5,2],[4,6],[6,7],[7,1],[7,8],[8,9]], tp=4)
    head, arr = a
    for i in range(10):
        j = head[i]
        while j != -1:
            print("%d -> %d" % (i, arr[j].to))
            j = arr[j].next
    print("="*30)
```