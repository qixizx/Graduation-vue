<template>
  <div id="allmap" ref="allmap" style="height: 700px; width: 100%"></div>
</template>
<script type="text/javascript">

  import { postAction, getAction } from '@/api/manage';
  import moment from 'moment';
  export default {
    components:{

    },
    data () {
      return {

        url:{
          list:"benz/parkInfo/list",
          parkSpaceReality: '/benz/parkIndexInfo/parkSpaceReality',
          parkStatusList:'/benz/parkIndexInfo/parkStatusList'
        },
        mescrollDown: {
          callback:this.downCallback,
          auto:true,
          /*mustToTop: true,*/
          offset:80,
          minAngle:25
        }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        mescrollUp: { // 上拉加载的配置.
          callback: this.upCallback,
          page: {
            num:3, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          },
          use:false,
          offset:100
        },
        show:false,
        center: {lng: 120.5, lat: 30.2},
        markers: [{
          position: {lng: 120.4, lat: 30.2},
          orderId:'123456',
          name:'吴韩伟',
          show:false,
        }, {
          position: {lng: 120.5, lat: 30.2},
          orderId:'654321',
          name:'姚永琪',
          show:false,
        }],
        icon: '../../../static/img/qishou.png',
        position:{},
        websock:null,
      }
    },
    mounted () {
      //在mounted中执行地图方法，mapData为要展示的数据
      this.initMap();
      this.loadTree();
    },
    created(){

    },

    methods: {
      initMap() {
        // //创建地图实例，zoom是缩放比例
        // let map = new google.maps.Map(document.getElementById('allmap'), {
        //   zoom: 12,
        //   center: this.center,
        //   // mapTypeId: google.maps.MapTypeId.ROADMAP
        // });
        //
        // //这里因为需要很多标记，所以遍历了this.markers（后端给的数据）来循环创建标记
        // this.markers.map(item=>{
        //   let marker = new google.maps.Marker({
        //     position: item.position,
        //     draggable: false, //不可拖动
        //     map: map,   //地图实例
        //     labelContent: item.name,    //label的内容
        //     labelAnchor: new google.maps.Point(22, 0),    //label的位置，可以调
        //     labelClass: "labels", // the CSS class for the label
        //     labelStyle: { background:'#fff',padding:'5px' }
        //   });
        //
        //   //自定义信息窗口
        //   let iw = new google.maps.InfoWindow({
        //     content: `<div>
        //                   <p>订单编号： ${item.orderId}</p>
        //                   <p>快递员：${item.name}</p>
        //                 </div>`});
        //   //点击信息窗口显示
        //   google.maps.event.addListener(marker, "click", function (e) { iw.open(map, marker); });
        // })

      },
      loadTree(){

        let httpurl = 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDgY6CelM-yYf7pzZWG-geB-UzF08E7kdA';
        let method = '';

        method = 'post';

        httpAction(httpurl,{},method).then((res)=>{
          alert(res)
        }).finally(() => {
        })
      }
    }
  };
</script>
<style>

</style>