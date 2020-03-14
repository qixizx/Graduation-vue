<template>
  <div class="footer" style="display: none">
    <div class="links">
     <!-- <a href="" target="_blank">首页</a>
      &lt;!&ndash;<a href="https://github.com/zhangdaiscott/jeecg-boot" target="_blank">
        <a-icon type="github"/>
      </a>&ndash;&gt;
      <a href="https://ant.design/">Ant Design</a>
      <a href="https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/">Vue Antd</a>-->
    </div>
    <!--<div class="copyright">
      Copyright
      <a-icon type="copyright"/>
      2019 <span>&lt;!&ndash;JEECG开源社区 出品&ndash;&gt;</span>
    </div>-->
  </div>
</template>

<script>
  export default {
    name: "LayoutFooter"
  }
</script>

<style lang="scss" scoped>
  .footer {
    padding: 0 16px;
    margin: 48px 0 24px;
    text-align: center;

    .links {
      margin-bottom: 8px;

      a {
        color: rgba(0, 0, 0, .45);

        &:hover {
          color: rgba(0, 0, 0, .65);
        }

        &:not(:last-child) {
          margin-right: 40px;
        }
      }
    }
    .copyright {
      color: rgba(0, 0, 0, .45);
      font-size: 14px;
    }
  }
</style>