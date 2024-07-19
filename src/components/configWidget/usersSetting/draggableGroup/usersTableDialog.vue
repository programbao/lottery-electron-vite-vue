<template>
  <lt-dialog
    :visible="dialogVisible"
    title="人员编辑"
    :width="'80%'"
    @close="close"
    @confirm="confirm"
  >
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col>
        <el-form
          ref="queryRef"
          :model="queryParams"
          :inline="true"
        >
          <el-form-item
            label="工号"
            prop="userName"
          >
            <el-input
              v-model="queryParams.userNo"
              placeholder="请输入工号"
              clearable
              style="width: 110px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item
            label="部门"
            prop="userName"
          >
            <el-input
              v-model="queryParams.userDept"
              placeholder="请输入部门"
              clearable
              style="width: 110px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item
            label="姓名"
            prop="userName"
          >
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入姓名"
              clearable
              style="width: 110px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="Search"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button
              icon="Refresh"
              @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="op-row">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          @click="handleBatchDelete"
          >删除</el-button
        >
      </el-col>
    </el-row>
    <el-table
      :data="showTableData"
      style="width: 100%"
      height="550"
      @selectionChange="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        prop="0"
        label="工号"
        width="180"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="1"
        label="部门"
        width="180"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="2"
        label="姓名"
        header-align="center"
        align="center"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
          ></el-button>
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="filteredTableData.length"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :page-sizes="pageSizes"
    />

    <!-- 用户编辑 -->
    <editUserDialog
      @close="closeUserEdit"
      @confirm="editUserConfirm"
      :handleUsersTableData="handleUsersTableData"
      :editDialogVisible="editUserDialogVisible"
      :updateEditData="updateEditData"
      :isUpdateEdit="isUpdateEdit"
    />
  </lt-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import ltDialog from '../../../common/lt-dialog.vue'
import editUserDialog from './editUserDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const emit = defineEmits(['close', 'confirm', 'delUser'])
const isUpdateEdit = ref(false);
const updateEditData = ref([]);
const props = defineProps({
  usersTableDialogVisible: {
    type: Boolean,
    required: true
  },
  usersTableData: {
    type: Array,
    default: () => []
  }
})
let handleUsersTableData = []
const isModifyOp = ref(false)
const editUserDialogVisible = ref(false)
const closeUserEdit = () => {
  editUserDialogVisible.value = false
  isUpdateEdit.value = false
}

const updateUserInfo = (user) => {
  let index = handleUsersTableData.findIndex((item) => (item[0]+'') === (user[0]+''))
  if (index > -1) {
    isUpdateEdit.value = false;
    handleUsersTableData.splice(index, 1, user)
    handleQuery();
    isModifyOp.value = true
  }
}

const editUserConfirm = (data) => {
  editUserDialogVisible.value = false
  if (isUpdateEdit.value) {
    updateUserInfo(data[0])
  } else if (data && data.length) {
    handleUsersTableData = handleUsersTableData.concat(data)
    handleQuery();
  } 
}
// 搜索条件
const queryParams = ref({
  userNo: '',
  userDept: '',
  userName: ''
})
const resetQuery = () => {
  Object.keys(queryParams.value).forEach((key) => {
    queryParams.value[key] = ''
  })
  handleQuery()
}
const handleQuery = (isInitPage = true) => {
  if (isInitPage) currentPage.value = 1
  // Original table data (assumed to be passed in props)
  let originalTableData = handleUsersTableData.slice()
  // Apply the filter based on queryParams
  let tableData = originalTableData.filter((row) => {
    // Check each query param; if it's not empty, ensure the row data matches
    const matchesUserNo = queryParams.value.userNo
      ? row[0] && (row[0] + '').includes(queryParams.value.userNo)
      : true
    const matchesUserDept = queryParams.value.userDept
      ? row[1] && (row[1] + '').includes(queryParams.value.userDept)
      : true
    const matchesUserName = queryParams.value.userName
      ? row[2] && (row[2] + '').includes(queryParams.value.userName)
      : true

    // Row must match all non-empty query params to be included in the filtered results
    return matchesUserNo && matchesUserDept && matchesUserName
  })
  filteredTableData.value = tableData
}
// 分页相关数据
const pageSizes = [10, 20, 30, 40, 50]
const pageSize = ref(10)
const currentPage = ref(1)
const showTableData = computed(() => {
  return filteredTableData.value.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  )
  // return props.usersTableData
})
const filteredTableData = ref([])

const userIds = ref([])
/** 多选框选中数据 */
const handleSelectionChange = (selection) => {
  userIds.value = selection.map((item) => item[0])
}
// 名单添加
const handleAdd = () => {
  editUserDialogVisible.value = true
}
// 名单删除 -- 单个
const handleDelete = (user) => {
  ElMessageBox.confirm('是否确认删除用户?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'error'
  }).then(() => {
    let index = handleUsersTableData.findIndex((item) => (item[0]+'') === (user[0]+''))
    // 去掉
    if (index > -1) {
      handleUsersTableData.splice(index, 1)
      handleQuery();
      isModifyOp.value = true
    }
  })
}
// 名单删除 -- 批量
const handleBatchDelete = () => {
  if (!userIds.value.length) {
    ElMessage.warning('请选择要删除的用户')
    return
  }
  ElMessageBox.confirm('是否确认删除选中的用户?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'error'
  }).then(() => {
    userIds.value.forEach((item) => {
      let index = handleUsersTableData.findIndex((user) => (user[0]+'') === (item+''))
      if (index > -1) {
        handleUsersTableData.splice(index, 1)
      }
    })
    handleQuery();
    isModifyOp.value = true
  }).catch(() => {
    
  })
  // emit('delUser', userIds.value)
}

// 更新人员信息
const handleUpdate = (user) => {
  editUserDialogVisible.value = true;
  isUpdateEdit.value = true
  updateEditData.value = user;
}


const dialogVisible = ref(false)
const handleDialogVisible = () => {
  if (props.usersTableDialogVisible) {
    dialogVisible.value = true
    handleUsersTableData = JSON.parse(JSON.stringify(props.usersTableData))
    handleQuery()
  } else {
    dialogVisible.value = false
  }
}
watch(
  () => props.usersTableDialogVisible,
  () => {
    handleDialogVisible()
  }
)

function handleSizeChange(val) {
  pageSize.value = val
  currentPage.value = 1
  // if (currentPage.value * val > props.total) {
  //     currentPage.value = 1;
  // }
  // emit('pagination', { page: currentPage.value, limit: val });
  // if (props.autoScroll) {
  //     scrollTo(0, 800);
  // }
}
function handleCurrentChange(val) {
  // emit('pagination', { page: val, limit: pageSize.value });
  currentPage.value = val
  // if (props.autoScroll) {
  //     scrollTo(0, 800);
  // }
}

const close = () => {
  emit('close', false)
}
const confirm = () => {
  emit('confirm', {
    isModifyOp,
    handleUsersTableData
  })
}
</script>

<style lang="scss" scoped>
.el-pagination {
  margin-top: 20px;
}
.el-form--inline .el-form-item {
  margin-right: 11px;
}
.op-row {
  margin-bottom: 10px;
  .el-col {
    margin-right: 10px;
  }
}
</style>
