<template>
  <div class="home">
    <div id="wave"></div>
    <div class="content">
      <div class="home-header">
        <router-link class="link"
                     to="/home">
          <img class="home-logo"
               src="../assets/userLogo.jpeg"
               alt="biaochenxuying logo" />
        </router-link>
      </div>
      <div class="home-body">
        <div class="list">
          <router-link class="link"
                       to="/articles">
            文章
          </router-link>
          <router-link class="link"
                       to="/project">
            项目
          </router-link>
          <a target="_blank"
             rel="noopener noreferrer"
             class="link"
             href="https://github.com/biaochenxuying">
            github
          </a>
          <a target="_blank"
             rel="noopener noreferrer"
             class="link"
             href="https://juejin.im/user/591d6b4d0ce463006926ae40">
            掘金
          </a>
          <a target="_blank"
             rel="noopener noreferrer"
             class="link"
             href="https://www.zhihu.com/people/gu-jian-qi-tan-shui/activities">
            知乎
          </a>
          <a target="_blank"
             rel="noopener noreferrer"
             class="link"
             href="https://segmentfault.com/u/biaochenxuying">
            segmentfault
          </a>
          <a target="_blank"
             rel="noopener noreferrer"
             class="link"
             href="https://www.jianshu.com/u/91717b553bfd">
            简书
          </a>
        </div>
        <div class="introduce"> 时光正好，未来可期，加油 ！ </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// 这是波浪效果，要先在 public index.html 里面引用了 three.min.js 才能用

import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Home extends Vue {
  mounted() {
    var SEPARATION: number = 100,
      AMOUNTX: number = 50,
      AMOUNTY: number = 50;

    var container: any;
    var camera: any, scene: any, renderer: any;

    var particles: any,
      count: number = 0;

    var mouseX: number = 0,
      mouseY: number = 0;

    var windowHalfX: any = window.innerWidth / 2;
    var windowHalfY: any = window.innerHeight / 2;

    setTimeout(() => {
      init();
      animate();
    }, 10);

    function init() {
      container = document.getElementById("wave");
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.zIndex = "-1";
      container.style.opacity = "1";
      // document.body.appendChild(container);

      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      camera.position.z = 1000;

      scene = new THREE.Scene();

      var numParticles: any = AMOUNTX * AMOUNTY;

      var positions: any = new Float32Array(numParticles * 3);
      var scales: any = new Float32Array(numParticles);

      var i: any = 0,
        j: any = 0;

      for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
          positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
          positions[i + 1] = 0; // y
          positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z

          scales[j] = 1;

          i += 3;
          j++;
        }
      }

      var geometry: any = new THREE.BufferGeometry();
      geometry.addAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.addAttribute("scale", new THREE.BufferAttribute(scales, 1));

      var material: any = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(0x1890ff) }
        },
        vertexShader:
          "attribute float scale;void main() {vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );gl_PointSize = scale * ( 300.0 / - mvPosition.z );gl_Position = projectionMatrix * mvPosition;}",
        fragmentShader:
          "uniform vec3 color;void main() {if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;gl_FragColor = vec4( color, 1.0 );}"
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setClearColor(0xffffff, 1.0);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      document.addEventListener("mousemove", onDocumentMouseMove, false);
      document.addEventListener("touchstart", onDocumentTouchStart, false);
      document.addEventListener("touchmove", onDocumentTouchMove, false);

      window.addEventListener("resize", onWindowResize, false);
    }

    function onWindowResize() {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event: any) {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    }

    function onDocumentTouchStart(event: any) {
      if (event.touches.length === 1) {
        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
      }
    }

    function onDocumentTouchMove(event: any) {
      if (event.touches.length === 1) {
        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
      }
    }

    function animate() {
      requestAnimationFrame(animate);

      render();
    }

    function render() {
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      var positions = particles.geometry.attributes.position.array;
      var scales = particles.geometry.attributes.scale.array;

      var i = 0,
        j = 0;

      for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
          positions[i + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;

          scales[j] =
            (Math.sin((ix + count) * 0.3) + 1) * 8 +
            (Math.sin((iy + count) * 0.5) + 1) * 8;

          i += 3;
          j++;
        }
      }

      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.scale.needsUpdate = true;

      renderer.render(scene, camera);

      count += 0.1;
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  position: fixed;
  left: 0;
  top: 0;
  .content {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    font-size: 20px;
    text-align: center;
    padding-top: 12%;
    .home-logo {
      width: 220px;
      border-radius: 50%;
    }
    .home-header {
      .link {
        display: block;
      }
    }
    .home-body {
      padding-top: 20px;
      .list {
        .link {
          display: inline-block;
          padding: 20px;
          color: #033767;
          min-width: 80px;
        }
        .link:hover {
          color: rgb(155, 35, 35);
        }
      }
    }
    .introduce {
      color: #960026;
    }
  }
}
</style>

