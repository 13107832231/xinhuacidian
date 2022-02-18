<template>
  <div class="home">
    <div class="header">
      <el-radio-group v-model="knowledgeType" size="large">
        <el-radio-button label="ci">成语</el-radio-button>
        <el-radio-button label="xiehouyu">歇后语</el-radio-button>
      </el-radio-group>
      <el-input
        v-model="inputValue"
        class="search"
        placeholder="请输入关键字或拼音首字母进行搜索，并按回车"
        :prefix-icon="Search"
        @keyup.enter="searchFun"
      />
      <el-button type="primary" :icon="Search" @click="searchFun">
        搜索</el-button
      >
    </div>

    <div class="content">
      <div class="left">
        <div class="scroll-box">
          <div class="data-null" v-if="curList.length === 0">
            暂无相关搜索,请输入其他关键词
          </div>
          <div class="list-box" v-else>
            <div
              class="item"
              :class="{ selected: selectedData.word === item.word }"
              v-for="item in curList"
              :key="item.word"
              @click="selectedItem(item)"
            >
              <span
                class="word-box"
                v-for="(sub, subIndex) in item.word"
                :key="subIndex"
              >
                <div class="yin">
                  {{ item.pinyin.split(' ')[subIndex] }}
                </div>
                <div class="word">{{ sub }}</div>
              </span>
            </div>
          </div>
        </div>
        <div class="footer">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            v-model:currentPage="pageOpt.currentPage"
            :page-sizes="[20, 400, 60, 80]"
            v-model:page-size="pageOpt.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageOpt.total"
          >
          </el-pagination>
        </div>
      </div>
      <div class="right">
        <div class="describe" v-if="selectedData.explanation">
          <div class="item">
            <h3>成语解释：</h3>
            {{ selectedData.explanation }}
          </div>
          <div class="item">
            <h3>成语出处：</h3>
            {{ selectedData.derivation }}
          </div>
          <div class="item">
            <h3>示例：</h3>
            {{ selectedData.example }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive, computed, Ref } from 'vue'
  import axios from '@/utils/axios'
  import { Search } from '@element-plus/icons-vue'
  const knowledgeType: Ref = ref('猫')
  const inputValue: Ref = ref('猫')
  const selectedData: Ref = ref({})
  // 获取所有数据
  const allList: Ref = ref([])
  // 当前搜索条件下的总数据
  const totalList: Ref = ref([])
  // 当前页面的数据
  const curList = computed(() => {
    const { currentPage, pageSize } = pageOpt
    return totalList.value.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  })

  const pageOpt = reactive({
    pageSize: 10,
    currentPage: 1,
    total: 0
  })
  let list: any = ref([])
  const handleSizeChange = (val: any) => {
    console.log(`每页 ${val} 条`)
  }
  const handleCurrentChange = (val: any) => {
    console.log(`当前页: ${val}`)
  }
  const selectedItem = (item: any) => {
    selectedData.value = item
  }
  const searchFun = () => {
    inputValue.value = inputValue.value.trim()
    totalList.value = inputValue.value
      ? allList.value.filter(
          (item: any) =>
            item.word.indexOf(inputValue.value) >= 0 ||
            item.abbreviation.indexOf(inputValue.value) >= 0
        )
      : allList.value
    pageOpt.total = totalList.value.length
    console.log(totalList.value, 'dadsasdasdas')
    selectedData.value = {}
  }

  onMounted(() => {
    axios({
      url: '/idiom.json',
      method: 'get'
    }).then((res: any) => {
      console.log(res, 'dadas')
      allList.value = res
      totalList.value = res
      pageOpt.total = res.length
    })
  })
</script>

<style lang="less" scoped>
  .home {
    height: 100vh;

    .header {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80px;
      text-align: center;
      line-height: 80px;

      .search {
        width: 400px;
        margin-right: 20px;
      }
    }
    .data-null {
      width: 100%;
      height: 300px;
      line-height: 300px;
      text-align: center;
    }
    .content {
      height: calc(100vh - 80px);
      display: flex;
      .left {
        width: 80%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .scroll-box {
          border: 1px solid #eee;
          flex: 1;
          // height: calc(100vh - 80px - 60px);
          overflow-y: scroll;
          padding: 0px 15px;
        }

        .list-box {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-wrap: wrap;

          .item {
            padding: 10px;
            border: 2px solid transparent;
            &.selected {
              border: 2px solid #333;
            }
            cursor: pointer;
            height: 100px;
            display: flex;

            margin-top: 10px;
            .word-box {
              width: 80px;
              .yin {
                width: 80px;
                text-align: center;
              }
              .word {
                width: 80px;
                height: 80px;
                line-height: 80px;
                text-align: center;
                font-size: 25px;
                display: inline-block;

                background-image: url('@/assets/田字格.jpeg');
                background-size: 100% 100%;
              }
            }
          }
        }
        .footer {
          height: 60px;
          display: flex;
          justify-content: center;
        }
      }
      .right {
        padding: 0px 10px;
        flex: 1;
        .describe {
          .item {
            margin-top: 20px;
          }
        }
      }
    }
  }
</style>
