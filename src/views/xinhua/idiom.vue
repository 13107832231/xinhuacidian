<template>
  <div class="home">
    <div class="header">
      <el-radio-group v-model="knowledgeType">
        <el-radio-button label="idiom">成语</el-radio-button>
        <el-radio-button label="ci">词语</el-radio-button>
        <el-radio-button label="word">汉字</el-radio-button>
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
      <div class="left" v-loading="loading">
        <div class="scroll-box">
          <div class="data-null" v-if="curList.length === 0">
            暂无相关搜索,请输入其他关键词
          </div>

          <div
            class="list-box"
            v-if="knowledgeType === 'idiom' && curList.length > 0"
          >
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
                  {{ getPinyin(item.pinyin, subIndex) }}
                </div>
                <div class="word">{{ sub }}</div>
              </span>
            </div>
          </div>
          <div
            class="list-box"
            v-if="knowledgeType === 'ci' && curList.length > 0"
          >
            <div
              class="item"
              :class="{ selected: selectedData.ci === item.ci }"
              v-for="item in curList"
              :key="item.ci"
              @click="selectedItem(item)"
            >
              <span
                class="word-box"
                v-for="(sub, subIndex) in item.ci"
                :key="subIndex"
              >
                <div class="word">{{ sub }}</div>
              </span>
            </div>
          </div>
          <!-- 汉字 -->
          <div
            class="list-box"
            v-if="knowledgeType === 'word' && curList.length > 0"
          >
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
                  {{ getPinyin(item.pinyin, subIndex) }}
                </div>
                <div class="word">{{ sub }}</div>
              </span>
            </div>
          </div>
          <div
            class="list-box"
            v-if="knowledgeType === 'xiehouyu' && curList.length > 0"
          >
            <div
              class="item"
              :class="{ selected: selectedData.riddle === item.riddle }"
              v-for="item in curList"
              :key="item.riddle"
              @click="selectedItem(item)"
            >
              <span
                class="word-box"
                v-for="(sub, subIndex) in item.riddle"
                :key="subIndex"
              >
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
            :page-sizes="[20, 40, 60, 80]"
            v-model:page-size="pageOpt.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageOpt.total"
          >
          </el-pagination>
        </div>
      </div>
      <div class="right">
        <div class="describe" v-if="selectedData">
          <div class="item" v-if="selectedData.oldword">
            <span class="label">繁 体：</span>
            <span class="val"> {{ selectedData.oldword }}</span>
            <span class="label">部 首：</span>
            <span class="val">{{ selectedData.radicals }}</span>
            <span class="label">笔画：</span>
            <span class="val">{{ selectedData.strokes }}</span>
          </div>
          <div class="item" v-if="selectedData.explanation">
            <h3>解释：</h3>
            {{ selectedData.explanation }}
          </div>
          <div class="item" v-if="selectedData.more">
            <h3>更多：</h3>
            {{ selectedData.more }}
          </div>
          <div class="item" v-if="selectedData.derivation">
            <h3>出处：</h3>
            {{ selectedData.derivation }}
          </div>
          <div class="item" v-if="selectedData.example">
            <h3>示例：</h3>
            {{ selectedData.example }}
          </div>
          <div class="item" v-if="selectedData.riddle">
            <h3>歇后语：</h3>
            {{ selectedData.riddle }}———{{ selectedData.answer }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive, computed, Ref, watch } from 'vue'
  import axios from '@/utils/axios'
  import { Search } from '@element-plus/icons-vue'
  const loading: Ref = ref(false)
  const knowledgeType: Ref = ref('idiom')
  const inputValue: Ref = ref('')
  // 分页参数
  const pageOpt = reactive({
    pageSize: 10,
    currentPage: 1,
    total: 0
  })
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
  watch(knowledgeType, (cur, pre) => {
    /* ... */
    allList.value = []
    totalList.value = []
    pageOpt.total = 0
    getData(`/${cur}.json`)
  })

  const handleSizeChange = (val: any) => {
    console.log(`每页 ${val} 条`)
  }
  const handleCurrentChange = (val: any) => {
    console.log(`当前页: ${val}`)
  }
  const selectedItem = (item: any) => {
    selectedData.value = item
  }
  const getPinyin = (str: any, index: number) => {
    let val = str.replace('，', ' , ').replace('、', ' 、 ')
    val = val.split(' ')[index]
    
    return val
  }
  const searchFun = () => {
    inputValue.value = inputValue.value.trim()
    totalList.value = inputValue.value
      ? allList.value.filter(
          (item: any) =>
            item.word?.indexOf(inputValue.value) >= 0 || // 类型为成语、汉字时的关键字搜索
            item.abbreviation?.indexOf(inputValue.value) >= 0 || // 类型为成语时的关键字搜索
            item.ci?.indexOf(inputValue.value) >= 0 || // 类型为词语时的关键字搜索
            item.riddle?.indexOf(inputValue.value) >= 0 // 类型为歇后语时的关键字搜索
        )
      : allList.value
    pageOpt.total = totalList.value.length

    selectedData.value = {}
  }
  const getData = (path: string) => {
    loading.value = true

    axios({
      url: path,
      method: 'get'
    }).then((res: any) => {
      loading.value = false

      allList.value = res
      totalList.value = res
      pageOpt.total = res.length
    })
  }

  onMounted(() => {
    getData(`/${knowledgeType.value}.json`)
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
        margin-left: 50px;
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
        width: 60%;
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
          height: calc(100vh - 80px);
          overflow-y: auto;
          .item {
            .label {
              font-size: 18px;
              font-weight: 500;
            }
            .val {
              margin-right: 10px;
            }
            margin-top: 20px;
          }
        }
      }
    }
  }
</style>
