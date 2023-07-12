import { Marker, Popup, Scene, Zoom } from "@antv/l7";
import { GaodeMap } from "@antv/l7";
import "./Map.css";

let nodes = [
  {
    site: "芜湖港",
    x: 118.356982,
    y: 31.334885,
    color: 1,
    throughput: 0,
    weight: 0,
  },
  {
    site: "太仓港",
    x: 121.225829,
    y: 31.63404,
    color: 1,
    throughput: 0,
    weight: 0,
  },
  {
    site: "南通港",
    x: 120.820224,
    y: 32.006977,
    color: 1,
    throughput: 0,
    weight: 0,
  },
  {
    site: "泰州港",
    x: 119.866794,
    y: 32.285275,
    color: 1,
    throughput: 0,
    weight: 0,
  },
  {
    site: "苏州港",
    x: 120.639716,
    y: 31.419077,
    color: 1,
    throughput: 0,
    weight: 0,
  },
  {
    site: "镇江港",
    x: 119.4708587,
    y: 32.1954712,
    color: 1,
    throughput: 0,
    weight: 0,
  },
  {
    site: "马鞍山港",
    x: 118.5701638,
    y: 31.632604,
    color: 1,
    throughput: 0,
    weight: 0,
  },
  {
    site: "铜陵港",
    x: 117.7142064,
    y: 30.8797599,
    color: 1,
    throughput: 0,
    weight: 0,
  },
  {
    site: "杭州港",
    x: 120.2744081,
    y: 30.2655169,
    color: 1,
    throughput: 0,
    weight: 0,
  },
];

function getColor(val: number) {
  let r = val * 255;
  let g = 255 - val * 255;
  return `rgb(${r},${g},0)`;
}

function createMap() {
  const scene = new Scene({
    id: "gaodemap",
    map: new GaodeMap({
      center: [119.785959, 31.342159],
      pitch: 0,
      zoom: 6,
      token: "262c50bb464c9f425cd458e85038067b",
    }),
    logoVisible: false,
  });

  scene.on("loaded", () => {
    const zoom = new Zoom({
      zoomInTitle: "放大",
      zoomOutTitle: "缩小",
    });
    scene.addControl(zoom);

    for (let i = 0; i < nodes.length; i++) {
      var el = document.createElement("label");
      el.className = "labelclass";
      el.textContent = nodes[i].site;
      el.style.backgroundColor = getColor(nodes[i].color);

      const marker = new Marker({
        element: el,
      }).setLnglat({ lng: nodes[i].x * 1, lat: nodes[i].y });

      var popup = new Popup({
        lngLat: {
          lng: nodes[i].x * 1,
          lat: nodes[i].y,
        },
        title: nodes[i].site,
        html: `<div>吞吐量: ${nodes[i].throughput}</br>货重: ${nodes[i].weight}吨</div>`,
      });

      marker.setPopup(popup);

      scene.addMarker(marker);
    }
  });
}

function getData() {
  fetch("http://36.140.31.145:31684/dm/?query=select+*+from+分析一")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.results);
      let vals: any[] = [];
      for (let i in data.results) {
        vals.push(data.results[i][1]);
      }
      const max = Math.max(...vals);
      const min = Math.min(...vals);
      const range = max - min;
      for (let i in nodes) {
        for (let j in data.results) {
          if (nodes[i].site == data.results[j][0]) {
            nodes[i].color = (data.results[j][1] - min) / range;
            nodes[i].throughput = data.results[j][1];
            nodes[i].weight = parseInt(data.results[j][2]);
          }
        }
      }
      createMap();
    });
}
getData();

export default function Map() {
  return <div id="gaodemap" className="scene"></div>;
}
