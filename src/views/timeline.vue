<template>
  <div class="timeline left">
    <el-timeline>
      <el-timeline-item v-for="(l, i) in list"
                        :key="l._id"
                        :color="l.state === 1 ? 'green' : l.state === 3 ? 'red' : ''"
                        placement="top"
                        hide-timestamp>
        <el-card>
          <h3>{{l.title}}</h3>
          <p>{{l.content}}</p>
          <p>
            <span>
              {{formatTime(l.start_time)}}--
            </span>
            <span>
              {{formatTime(l.end_time)}}
            </span>
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import LoadEnd from "@/components/loadEnd.vue";
import LoadingCustom from "@/components/loading.vue";
import {
  throttle,
  getScrollTop,
  getDocumentHeight,
  getWindowHeight,
  getQueryStringByName,
  timestampToTime
} from "@/utils/utils";

@Component({
  components: {
    LoadEnd,
    LoadingCustom
  }
})
export default class Timeline extends Vue {
  reverse: boolean = true;
  isLoadEnd: boolean = false;
  isLoading: boolean = false;
  list: Array<object> = [];
  total: number = 0;
  params: any = {
    keyword: "",
    pageNum: 1,
    pageSize: 10
  };

  // lifecycle hook
  mounted() {
    this.handleSearch();
    window.onscroll = () => {
      if (getScrollTop() + getWindowHeight() > getDocumentHeight() - 100) {
        // 如果不是已经没有数据了，都可以继续滚动加载
        if (this.isLoadEnd === false && this.isLoading === false) {
          this.handleSearch();
        }
      }
    };
  }

  formatTime(value: any) {
    return timestampToTime(value, true);
  }
  async handleSearch() {
    this.isLoading = true;
    const res: any = await this.$https.get(this.$urls.getTimeAxisList, {
      params: this.params
    });
    this.isLoading = false;
    if (res.status === 200) {
      if (res.data.code === 0) {
        const data: any = res.data.data;
        this.list = [...this.list, ...data.list];
        this.total = data.count;
        this.params.pageNum++;
        if (this.total === this.list.length) {
          this.isLoadEnd = true;
        }
      } else {
        this.$message({
          message: res.data.message,
          type: "error"
        });
      }
    } else {
      this.$message({
        message: "网络错误!",
        type: "error"
      });
    }
  }
}
</script>
<style lang="less" scoped>
.timeline {
  padding: 40px 0;
  .year {
    font-size: 34px;
    font-weight: bold;
    color: #000;
  }
  a {
    text-decoration: none;
  }

  .title {
    color: #333;
    &:hover {
      color: #1890ff;
    }
  }
}
</style>

