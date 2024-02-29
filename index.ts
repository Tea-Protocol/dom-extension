/** 节点拓展方法 */
export interface DomExtensionMethods {
  /** 操作属性方法 */
  attr: <T>(key: string, value?: T) => T extends string ? Node : string
  /** 获取节点在浏览器的数据信息 */
  rect: () => any
  /** 添加子节点 */
  add: (child: Node) => Node
  /** 创建并添加子节点 */
  create: (tagName: string, attr?: Obj, innerHTML?: string) => Node
  /** 设置节点样式 */
  setStyle: (style: Obj<string>) => Node
}

/** 普通节点类型 */
type Node = HTMLElement &
  Element &
  HTMLInputElement &
  DomExtensionMethods & {
    [key: string]: any
    style: any
  }

/** 节点列表类型 */
type NodeList = NodeListOf<Node>

/** 对象类型 */
type Obj<T = any> = { [key: string]: T }

/** 操作dom简写方法，方便链式调用 */
export class Dom {
  /** 获取单个节点 */
  static query(select: string, parent?: Node): Node {
    const node = (parent || document).querySelector(select) as Node
    return Dom.setMethods(node)
  }

  /** 获取多个节点 */
  static queryAll(select: string, parent?: Node): NodeList {
    const nodeList = (parent || document).querySelectorAll(select) as NodeList
    nodeList.forEach(node => Dom.setMethods(node))
    return nodeList
  }

  /** 创建节点 */
  static create(
    tagName: string,
    attr: { [key: string]: any } = {},
    innerHTML?: string
  ): Node {
    const node = document.createElement(tagName) as Node
    Object.keys(attr).forEach(key => {
      node[key] = attr[key]
    })
    if (innerHTML) node.innerHTML = innerHTML
    return Dom.setMethods(node)
  }

  /** 设置style */
  static setStyle(node: Node, style: Obj<string>): Node {
    Object.keys(style).forEach(key => {
      node.style[key] = style[key]
    })
    return node
  }

  /** 在节点上挂载一些简写方法,方便链式调用 */
  static setMethods(node: Node): Node {
    if (!node) return node

    node.attr = (key: string, value?: unknown): any => {
      if (value) {
        node.setAttribute(key, value as string)
        return node
      }
      return node.getAttribute(key)
    }

    // 获取元素相对于浏览器的信息
    node.rect = () => node.getBoundingClientRect()

    // 添加子节点
    node.add = child => {
      node.appendChild(child)
      return node
    }

    // 创建并添加子节点
    node.create = function (tagName: string, attr?: Obj, innerHTML?: string) {
      const tag = Dom.create(tagName, attr, innerHTML)
      this.add(tag)
      return tag
    }

    // 设置节点样式
    node.setStyle = function (style: Obj<string>) {
      Dom.setStyle(this, style)
      return this
    }

    return node
  }
}
