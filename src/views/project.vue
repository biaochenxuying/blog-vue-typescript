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
import { Params, ProjectList, ProjectsData } from "@/types/index";

@Component({
  components: {
    LoadEnd,
    LoadingCustom
  }
})
export default class Timeline extends Vue {
  private reverse: boolean = true;
  private isLoadEnd: boolean = false;
  private isLoading: boolean = false;
  private isMobileOrPc: boolean = isMobileOrPc();
  private list: ProjectList[] = [];
  private total: number = 0;
  private params: Params = {
    keyword: "",
    pageNum: 1,
    pageSize: 10
  };

  // lifecycle hook
  mounted(): void {
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

  private async handleSearch(): Promise<void> {
    this.isLoading = true;
    const data: ProjectsData = await this.$https.get(this.$urls.getProjectList, {
      params: this.params
    });
    this.isLoading = false;

    this.list = [...this.list, ...data.list];
    this.total = data.count;
    this.params.pageNum++;
    if (this.total === this.list.length) {
      this.isLoadEnd = true;
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

