import list2tree from 'list2tree';
import { OrgsItem, MemberItem } from '../data/data';

export function listToTree(list: Array<any>, id: string = 'id', parent: string = 'parent'): Array<OrgsItem> {
  const getTreeData = list2tree({
    idKey: id,
    parentIdKey: parent
  })
  let data = getTreeData(list);
  return data
}

export function treeToList(tree: any = [], child = 'children', order = 'id', list: any = []) {
  if (Array.isArray(tree)) {
    Object.keys(tree).forEach((key: any) => {
      let value = tree[key]
      let reffer = JSON.parse(JSON.stringify(value))
      if (reffer[child]) {
        delete reffer[child]
        treeToList(value[child], child, order, list)
      }
      list.push(reffer)
    })
  }
  return list
}