<template>
  <div class="project left">
    <el-row :gutter="20">
      <el-col class="el-col-pointer"
              :span="isMobileOrPc ? 24 : 12"
              v-for="(l, index) in list"
              :key="l._id"
              style="margin-bottom: 20px">
        <a :href="l.url"
           target="_blank"
           rel="noopener noreferrer">
          <el-card shadow="hover">
            <img :src="l.img"
                 class="image">
            <div style="padding: 14px;">
              <h4>{{l.title}}</h4>
              <div class="content">{{l.content}}</div>
              <span>
                {{formatTime(l.start_time)}}--
              </span>
              <span>
                {{formatTime(l.end_time)}}
              </span>
            </div>
          </el-card>
        </a>
      </el-col>
    </el-row>
    <LoadingCustom v-if="isLoading"></LoadingCustom>
    <LoadEnd v-if="isLoadEnd"></LoadEnd>
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
  timestampToTime,
  isMobileOrPc
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
  isMobileOrPc: boolean = isMobileOrPc();
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
    const res: any = await this.$https.get(this.$urls.getProjectList, {
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
.project {
  overflow: hidden;
  padding: 40px 0;
  .el-col-pointer {
    cursor: pointer;
  }
  .content {
    height: 70px;
    text-overflow: ellipsis;
  }
  .image {
    width: 100%;
    height: 250px;
  }
}
</style>

