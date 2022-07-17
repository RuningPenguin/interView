
<template>
  <draggable v-bind="dragOptions" tag="div" itemKey="id" group="org" :list="list" @end="emitter">
    <template #item="{ element }">
      <el-card class="card" shadow="hover">
        <template #header>
          <el-row class="q-flex q-flex-aic">
            <el-col :span="2" v-show="edit">
              <img src="../../assets/移动.png" class="mover" style="width: 25px;height: 25px;" />
            </el-col>
            <el-col :span="4">
              <h4>组织名称</h4>
            </el-col>
            <el-col :span="8" v-show="edit">
              <el-input placeholder="请输入组织名称" v-model="element.name" />
            </el-col>
            <el-col :span="8" v-show="!edit">
              <span>{{ element.name }}</span>
            </el-col>
          </el-row>
        </template>

        <el-row :gutter="20" class="t_body">
          <el-col :span="4">
            <h4>成员</h4>
          </el-col>
          <el-col :span="5">
            <h4>姓名</h4>
          </el-col>
          <el-col :span="5">
            <h4>年龄</h4>
          </el-col>
          <el-col :span="5">
            <h4>激活</h4>
          </el-col>
          <el-col :span="5">
            <h4>管理者</h4>
          </el-col>
        </el-row>

        <draggable v-bind="dragOptions" tag="div" itemKey="id" group="pop" :list="element.memberList" @end="emitter">
          <template #item="{ element: table }">
            <div>
              <el-row :gutter="20" class="t_body" style="padding: 10px 0;border-bottom: 1px solid #dcdfe6;">
                <el-col :span="4">
                  <img v-show="edit" src="../../assets/移动.png" class="mover" style="width: 25px;height: 25px;" />
                </el-col>
                <el-col :span="5" v-show="!edit">{{ table.name }}</el-col>
                <el-col :span="5" v-show="edit">
                  <el-input placeholder="请输入姓名" v-model="table.name" />
                </el-col>
                <el-col :span="5" v-show="!edit">{{ table.age }}</el-col>
                <el-col :span="5" v-show="edit">
                  <el-input placeholder="请输入年龄" v-model="table.age" />
                </el-col>
                <el-col :span="5">
                  <el-checkbox size="large" :disabled="!edit" v-model="table.status" true-label="activated"
                    false-label="inactivated" />
                </el-col>
                <el-col :span="5">
                  <el-checkbox size="large" :disabled="table.status === 'inactivated' || !edit"
                    v-model="element.representation" :true-label="table.id" false-label="" />
                </el-col>
              </el-row>
            </div>
          </template>
        </draggable>

        <div style="margin:40px 0" v-show="edit">
          <el-button type="primary" size="large" @click="addPep(element.memberList)">添加人员</el-button>
        </div>

        <List :list="element.children" />

      </el-card>
    </template>
  </draggable>


</template>

<script lang="ts">
export default {
  name: 'List'
}
</script>

<script lang="ts" setup>
import { toRefs, computed, defineProps, defineEmits } from 'vue';
import { storeToRefs } from "pinia";
import { useDataStore } from "../../store"
import draggable from "vuedraggable";
import { OrgsItem, MemberItem } from '@/data/data';
const data = useDataStore();
let { edit } = storeToRefs(data);

const props = defineProps({
  list: {
    required: false,
    type: Array,
    default: null
  }
})

const emit = defineEmits(['update:list'])

const { list } = toRefs(props)


const dragOptions = computed(() => ({
  animation: 300,
  group: "description",
  ghostClass: "ghost", chosenClass: "chosen",
  disabled: !edit.value,
  handle: ".mover"
}))


const emitter = () => {
  emit('update:list', list.value)
}

const addPep = (memberList: Array<MemberItem>) => {
  memberList.push(
    { "name": "", "id": String(Date.now()), "age": '', "status": "inactivated" }
  )
  emit('update:list', list.value)
}

</script>

<style lang="less" scoped>
.t_body {
  margin: 20px 0;
  text-align: center;
  align-content: center;

  .el-col {
    display: flex;
    align-items: center;
  }
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.chosen {
  background-color: #c8ebfb;
}
</style>
