<template>
  <div class="archive left">
    <el-timeline>
      <el-timeline-item v-for="(l, i) in articlesList"
                        :key="l.year"
                        placement="top"
                        hide-timestamp>
        <h3 class="year">{{l.year}}</h3>

        <el-timeline-item v-for="(item, index) in l.list"
                          :key="item._id"
                          :color="item.state === 1 ? 'green' : item.state === 3 ? 'red' : ''"
                          placement="top"
                          hide-timestamp>
          <router-link :to="`/articleDetail?article_id=${item._id}`"
                       target="_blank">
            <h3 class="title">{{item.title}}</h3>
          </router-link>
          <p>{{formatTime(item.create_time)}}</p>
        </el-timeline-item>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { timestampToTime } from "@/utils/utils";
import { ParamsArchive, ArchiveData } from "@/types/index";

@Component({
  components: {}
})
export default class Archive extends Vue {
  private isLoadEnd: boolean = false;
  private isLoading: boolean = false;
  private articlesList: Array<object> = [];
  private total: number = 0;
  private params: ParamsArchive = {
    keyword: "",
    likes: "", // 是否是热门文章
    state: 1, // 文章发布状态 => 0 草稿，1 已发布,'' 代表所有文章
    article: 1,
    tag_id: "",
    category_id: "",
    pageNum: 1,
    pageSize: 10
  };

  mounted(): void {
    this.handleSearch();
  }

  private async handleSearch(): Promise<void> {
    this.isLoading = true;
    const data: ArchiveData = await this.$https.get(this.$urls.getArticleList, {
      params: this.params
    });
    this.isLoading = false;
    this.articlesList = [...this.articlesList, ...data.list];
    this.total = data.count;
    this.params.pageNum++;
    if (this.total === this.articlesList.length) {
      this.isLoadEnd = true;
    }
  }
}
</script>
<style lang="less" scoped>
.archive {
  padding: 40px 0;
  .year {
    font-size: 30px;
    font-weight: bold;
    color: #000;
    margin-top: 0;
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

