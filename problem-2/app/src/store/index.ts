import { defineStore } from 'pinia';
import { listToTree } from '../tools';
import { OrgsItem, MemberItem } from '../data/data';
const M: Array<MemberItem> = require('../data/members.json');
const O: Array<OrgsItem> = require('../data/orgs.json');

interface StateType {
  treeData: Array<OrgsItem>
  edit: boolean
}

function getTreeArr(orgs: Array<OrgsItem>, member: Array<MemberItem>) {
  let allData = orgs.map(value => {
    value.memberList = [];
    value.children = [];
    member.forEach(val => {
      value.members && value.members.forEach(v => {
        if (v === val.id) {
          value.memberList?.push(val)
        }
      })
    })
    return value
  })

  return listToTree(allData)
}


export const useDataStore = defineStore("data", {
  state(): StateType {
    return {
      treeData: [],
      edit: true,
    }
  },
  actions: {
    getTreeArr() {
      const member = JSON.parse(localStorage.getItem('member') || JSON.stringify(M));
      const orgs = JSON.parse(localStorage.getItem('orgs') || JSON.stringify(O));
      this.treeData = getTreeArr(orgs, member);
    },
    setTreeData(arr: Array<OrgsItem>) {
      this.treeData = arr
    },
    setEdit(bl: boolean) {
      this.edit = bl;
    }
  }
})