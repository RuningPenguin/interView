<template>
  <h1>组织管理</h1>
  <el-divider />

  <List v-model:list="list" />

  <div v-show="edit">
    <el-divider />
    <div style="margin:40px 0">
      <el-button type="primary" size="large" @click="addOrgs">添加组织</el-button>
    </div>
  </div>

  <el-divider />
  <div class="q-flex" style="margin:40px 0">
    <div class="q-flex-1"></div>
    <el-button size="large" v-show="edit" @click="cancel">取消</el-button>
    <el-button type="success" size="large" v-show="edit" @click="saveFn">保存</el-button>
    <el-button type="primary" size="large" v-show="!edit" @click="editFn">编辑</el-button>
  </div>

</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount } from 'vue';
import { ElMessageBox } from 'element-plus';
import { treeToList } from '@/tools';
import { OrgsItem, MemberItem } from '../data/data';
import { storeToRefs } from "pinia";
import { useDataStore } from "../store"
import List from './list/index.vue';
const data = useDataStore();
const { treeData, edit } = storeToRefs(data);
let copyTreeData = ref<Array<OrgsItem>>([]);



const getDate = () => {
  data.getTreeArr();
  copyTreeData.value = JSON.parse(JSON.stringify(treeData.value));
}

let list = computed({
  get() {
    return edit.value ? copyTreeData.value : treeData.value;
  },
  set(v) {
    copyTreeData.value = v;
  }
})


const addOrgs = () => {
  copyTreeData.value.push({
    "name": '',
    "id": String(Date.now()),
    "type": '',
    "parent": null,
    "representation": '',
    "members": [],
    "memberList": [],
    "children": []
  })
}


const verification = (arr: Array<OrgsItem> | undefined): Boolean => {
  if (!arr) return true;
  return arr.every((value: OrgsItem) => {
    if (!value.name) return false;
    if (!value.memberList?.every(val => val.name)) return false;
    return value.children?.every(v => {
      if (!v.name) return false;
      if (!v.memberList?.every(i => i.name)) return false;
      return verification(v.children)
    })
  })
}

const filterDate = (arr: Array<OrgsItem>, id?: string) => {
  if (!arr) return;
  arr.map(value => {
    value.members = value.memberList.length > 0 ? value.memberList?.map(v => v.id) : value.members;
    if (value.children.length > 0) {
      value?.children?.map(val => {
        console.log(val.id, value.id);

        val.parent = value.id;
        val.members = val.memberList.length > 0 ? val.memberList?.map(v => v.id) : val.members;
        return filterDate(val.children, val.id);
      })
    } else {
      if (id) {
        value.parent = id;
      }
    }
    return value
  })
}

const saveFn = () => {
  if (verification(copyTreeData.value)) {
    console.log(copyTreeData.value);

    filterDate(copyTreeData.value);
    copyTreeData.value.map(value => {
      value.parent = null;
      return value;
    })
    let org = treeToList(copyTreeData.value);
    let member = org.map((value: OrgsItem) => value.memberList).flat(Infinity);
    localStorage.setItem('orgs', JSON.stringify(org));
    localStorage.setItem('member', JSON.stringify(member));
    getDate()
    data.setEdit(!edit.value)
  } else {
    ElMessageBox.alert('请输入名称', '提示', {
      type: 'warning',
    })
  }
}

const editFn = () => {
  // getDate()
  data.setEdit(!edit.value)
}

const cancel = () => {
  ElMessageBox.confirm('确定取消编辑？', '提示', {
    type: 'error',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    data.setEdit(!edit.value)
  }).catch(() => {
    console.log('取消')
  })
}

onBeforeMount(() => {
  getDate()
})


</script>

<style lang="less">
.card {
  margin: 10px 0;
}

.el-card__body {
  padding-right: 0 !important;
  padding-bottom: 0 !important;
}
</style>
