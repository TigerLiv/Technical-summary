series:[{
	name: '平行于y轴的趋势线',
    type: 'line',
    markLine: {
        itemStyle: {      //盒须图样式。
        },
        name: 'cc',
        //yAxisIndex: 0,
        // symbol:'none',//去掉箭头
        data: [[
            { coord: ['x轴坐标', 0] },
            { coord: ['x轴坐标',y轴值] }
        ]]
    }
}]

series:[{
	name: '平行于x轴的趋势线',
    type: 'line',
    markLine: {
        itemStyle: {      //盒须图样式。
        },
        name: 'cc',
        //yAxisIndex: 0,
        // symbol:'none',//去掉箭头
       data: [
        {
          name: "max line on close",
          type: "max",
          label: {
            show: true
          },
          // valueDim: "close",
          yAxis: 100, // 第二条标记线x轴的值
        },
      ],
    }
}]

