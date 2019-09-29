<template>
  <div class="home">
    <canvas id="sakura" />
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
// 满屏落花效果
import { Component, Vue } from "vue-property-decorator";
declare var document: Document | any;

@Component({})
export default class Home extends Vue {
  mounted() {
    if (document.location.protocol === "http:") {
      this.$message({
        message:
          "本网站已经配置了 https，为了有更好的体验效果，请把地址前缀换成 https 哦",
        type: "warning",
        duration: 3000
      });
    }
    let sakura_point_vsh: string = `
    uniform mat4 uProjection;
    uniform mat4 uModelview;
    uniform vec3 uResolution;
    uniform vec3 uOffset;
    uniform vec3 uDOF;  //x:focus distance, y:focus radius, z:max radius
    uniform vec3 uFade; //x:start distance, y:half distance, z:near fade start

    attribute vec3 aPosition;
    attribute vec3 aEuler;
    attribute vec2 aMisc; //x:size, y:fade

    varying vec3 pposition;
    varying float psize;
    varying float palpha;
    varying float pdist;

    //varying mat3 rotMat;
    varying vec3 normX;
    varying vec3 normY;
    varying vec3 normZ;
    varying vec3 normal;

    varying float diffuse;
    varying float specular;
    varying float rstop;
    varying float distancefade;

    void main(void) {
        // Projection is based on vertical angle
        vec4 pos = uModelview * vec4(aPosition + uOffset, 1.0);
        gl_Position = uProjection * pos;
        gl_PointSize = aMisc.x * uProjection[1][1] / -pos.z * uResolution.y * 0.5;
        
        pposition = pos.xyz;
        psize = aMisc.x;
        pdist = length(pos.xyz);
        palpha = smoothstep(0.0, 1.0, (pdist - 0.1) / uFade.z);
        
        vec3 elrsn = sin(aEuler);
        vec3 elrcs = cos(aEuler);
        mat3 rotx = mat3(
            1.0, 0.0, 0.0,
            0.0, elrcs.x, elrsn.x,
            0.0, -elrsn.x, elrcs.x
        );
        mat3 roty = mat3(
            elrcs.y, 0.0, -elrsn.y,
            0.0, 1.0, 0.0,
            elrsn.y, 0.0, elrcs.y
        );
        mat3 rotz = mat3(
            elrcs.z, elrsn.z, 0.0, 
            -elrsn.z, elrcs.z, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 rotmat = rotx * roty * rotz;
        normal = rotmat[2];
        
        mat3 trrotm = mat3(
            rotmat[0][0], rotmat[1][0], rotmat[2][0],
            rotmat[0][1], rotmat[1][1], rotmat[2][1],
            rotmat[0][2], rotmat[1][2], rotmat[2][2]
        );
        normX = trrotm[0];
        normY = trrotm[1];
        normZ = trrotm[2];
        
        const vec3 lit = vec3(0.6917144638660746, 0.6917144638660746, -0.20751433915982237);
        
        float tmpdfs = dot(lit, normal);
        if(tmpdfs < 0.0) {
            normal = -normal;
            tmpdfs = dot(lit, normal);
        }
        diffuse = 0.4 + tmpdfs;
        
        vec3 eyev = normalize(-pos.xyz);
        if(dot(eyev, normal) > 0.0) {
            vec3 hv = normalize(eyev + lit);
            specular = pow(max(dot(hv, normal), 0.0), 20.0);
        }
        else {
            specular = 0.0;
        }
        
        rstop = clamp((abs(pdist - uDOF.x) - uDOF.y) / uDOF.z, 0.0, 1.0);
        rstop = pow(rstop, 0.5);
        //-0.69315 = ln(0.5)
        distancefade = min(1.0, exp((uFade.x - pdist) * 0.69315 / uFade.y));
    }`;
    let sakura_point_fsh: string = `
    #ifdef GL_ES
    //precision mediump float;
    precision highp float;
    #endif

    uniform vec3 uDOF;  //x:focus distance, y:focus radius, z:max radius
    uniform vec3 uFade; //x:start distance, y:half distance, z:near fade start

    const vec3 fadeCol = vec3(0.08, 0.03, 0.06);

    varying vec3 pposition;
    varying float psize;
    varying float palpha;
    varying float pdist;

    //varying mat3 rotMat;
    varying vec3 normX;
    varying vec3 normY;
    varying vec3 normZ;
    varying vec3 normal;

    varying float diffuse;
    varying float specular;
    varying float rstop;
    varying float distancefade;

    float ellipse(vec2 p, vec2 o, vec2 r) {
        vec2 lp = (p - o) / r;
        return length(lp) - 1.0;
    }

    void main(void) {
        vec3 p = vec3(gl_PointCoord - vec2(0.5, 0.5), 0.0) * 2.0;
        vec3 d = vec3(0.0, 0.0, -1.0);
        float nd = normZ.z; //dot(-normZ, d);
        if(abs(nd) < 0.0001) discard;
        
        float np = dot(normZ, p);
        vec3 tp = p + d * np / nd;
        vec2 coord = vec2(dot(normX, tp), dot(normY, tp));
        
        //angle = 15 degree
        const float flwrsn = 0.258819045102521;
        const float flwrcs = 0.965925826289068;
        mat2 flwrm = mat2(flwrcs, -flwrsn, flwrsn, flwrcs);
        vec2 flwrp = vec2(abs(coord.x), coord.y) * flwrm;
        
        float r;
        if(flwrp.x < 0.0) {
            r = ellipse(flwrp, vec2(0.065, 0.024) * 0.5, vec2(0.36, 0.96) * 0.5);
        }
        else {
            r = ellipse(flwrp, vec2(0.065, 0.024) * 0.5, vec2(0.58, 0.96) * 0.5);
        }
        
        if(r > rstop) discard;
        
        vec3 col = mix(vec3(1.0, 0.8, 0.75), vec3(1.0, 0.9, 0.87), r);
        float grady = mix(0.0, 1.0, pow(coord.y * 0.5 + 0.5, 0.35));
        col *= vec3(1.0, grady, grady);
        col *= mix(0.8, 1.0, pow(abs(coord.x), 0.3));
        col = col * diffuse + specular;
        
        col = mix(fadeCol, col, distancefade);
        
        float alpha = (rstop > 0.001)? (0.5 - r / (rstop * 2.0)) : 1.0;
        alpha = smoothstep(0.0, 1.0, alpha) * palpha;
        
        gl_FragColor = vec4(col * 0.5, alpha);
    }`;
    let fx_common_vsh: string = `
    uniform vec3 uResolution;
    attribute vec2 aPosition;

    varying vec2 texCoord;
    varying vec2 screenCoord;

    void main(void) {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        texCoord = aPosition.xy * 0.5 + vec2(0.5, 0.5);
        screenCoord = aPosition.xy * vec2(uResolution.z, 1.0);
    }`;
    let bg_fsh: string = `
    #ifdef GL_ES
    //precision mediump float;
    precision highp float;
    #endif

    uniform vec2 uTimes;

    varying vec2 texCoord;
    varying vec2 screenCoord;

    void main(void) {
        vec3 col;
        float c;
        vec2 tmpv = texCoord * vec2(0.8, 1.0) - vec2(0.95, 1.0);
        c = exp(-pow(length(tmpv) * 1.8, 2.0));
        col = mix(vec3(0.02, 0.0, 0.03), vec3(0.96, 0.98, 1.0) * 1.5, c);
        gl_FragColor = vec4(col * 0.5, 1.0);
    }`;
    let fx_brightbuf_fsh: string = `
    #ifdef GL_ES
    //precision mediump float;
    precision highp float;
    #endif
    uniform sampler2D uSrc;
    uniform vec2 uDelta;

    varying vec2 texCoord;
    varying vec2 screenCoord;

    void main(void) {
        vec4 col = texture2D(uSrc, texCoord);
        gl_FragColor = vec4(col.rgb * 2.0 - vec3(0.5), 1.0);
    }`;
    let fx_dirblur_r4_fsh: string = `
    #ifdef GL_ES
    //precision mediump float;
    precision highp float;
    #endif
    uniform sampler2D uSrc;
    uniform vec2 uDelta;
    uniform vec4 uBlurDir; //dir(x, y), stride(z, w)

    varying vec2 texCoord;
    varying vec2 screenCoord;

    void main(void) {
        vec4 col = texture2D(uSrc, texCoord);
        col = col + texture2D(uSrc, texCoord + uBlurDir.xy * uDelta);
        col = col + texture2D(uSrc, texCoord - uBlurDir.xy * uDelta);
        col = col + texture2D(uSrc, texCoord + (uBlurDir.xy + uBlurDir.zw) * uDelta);
        col = col + texture2D(uSrc, texCoord - (uBlurDir.xy + uBlurDir.zw) * uDelta);
        gl_FragColor = col / 5.0;
    }`;
    let pp_final_vsh: string = `
    uniform vec3 uResolution;
    attribute vec2 aPosition;
    varying vec2 texCoord;
    varying vec2 screenCoord;
    void main(void) {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        texCoord = aPosition.xy * 0.5 + vec2(0.5, 0.5);
        screenCoord = aPosition.xy * vec2(uResolution.z, 1.0);
    }`;
    let pp_final_fsh: string = `
    #ifdef GL_ES
    //precision mediump float;
    precision highp float;
    #endif
    uniform sampler2D uSrc;
    uniform sampler2D uBloom;
    uniform vec2 uDelta;
    varying vec2 texCoord;
    varying vec2 screenCoord;
    void main(void) {
        vec4 srccol = texture2D(uSrc, texCoord) * 2.0;
        vec4 bloomcol = texture2D(uBloom, texCoord);
        vec4 col;
        col = srccol + bloomcol * (vec4(1.0) + srccol);
        col *= smoothstep(1.0, 0.0, pow(length((texCoord - vec2(0.5)) * 2.0), 1.2) * 0.5);
        col = pow(col, vec4(0.45454545454545)); //(1.0 / 2.2)
        
        gl_FragColor = vec4(col.rgb, 1.0);
        gl_FragColor.a = 1.0;
    }`;

    // Utilities
    var Vector3: any = {};
    var Matrix44: any = {};
    Vector3.create = function(x: any, y: any, z: any) {
      return { x: x, y: y, z: z };
    };
    Vector3.dot = function(v0: any, v1: any) {
      return v0.x * v1.x + v0.y * v1.y + v0.z * v1.z;
    };
    Vector3.cross = function(v: any, v0: any, v1: any) {
      v.x = v0.y * v1.z - v0.z * v1.y;
      v.y = v0.z * v1.x - v0.x * v1.z;
      v.z = v0.x * v1.y - v0.y * v1.x;
    };
    Vector3.normalize = function(v: any) {
      var l: any = v.x * v.x + v.y * v.y + v.z * v.z;
      if (l > 0.00001) {
        l = 1.0 / Math.sqrt(l);
        v.x *= l;
        v.y *= l;
        v.z *= l;
      }
    };
    Vector3.arrayForm = function(v: any) {
      if (v.array) {
        v.array[0] = v.x;
        v.array[1] = v.y;
        v.array[2] = v.z;
      } else {
        v.array = new Float32Array([v.x, v.y, v.z]);
      }
      return v.array;
    };
    Matrix44.createIdentity = function() {
      return new Float32Array([
        1.0,
        0.0,
        0.0,
        0.0,
        0.0,
        1.0,
        0.0,
        0.0,
        0.0,
        0.0,
        1.0,
        0.0,
        0.0,
        0.0,
        0.0,
        1.0
      ]);
    };
    Matrix44.loadProjection = function(
      m: any,
      aspect: any,
      vdeg: any,
      near: any,
      far: any
    ) {
      let h = near * Math.tan(((vdeg * Math.PI) / 180.0) * 0.5) * 2.0;
      let w = h * aspect;

      m[0] = (2.0 * near) / w;
      m[1] = 0.0;
      m[2] = 0.0;
      m[3] = 0.0;

      m[4] = 0.0;
      m[5] = (2.0 * near) / h;
      m[6] = 0.0;
      m[7] = 0.0;

      m[8] = 0.0;
      m[9] = 0.0;
      m[10] = -(far + near) / (far - near);
      m[11] = -1.0;

      m[12] = 0.0;
      m[13] = 0.0;
      m[14] = (-2.0 * far * near) / (far - near);
      m[15] = 0.0;
    };
    Matrix44.loadLookAt = function(m: any, vpos: any, vlook: any, vup: any) {
      let frontv = Vector3.create(
        vpos.x - vlook.x,
        vpos.y - vlook.y,
        vpos.z - vlook.z
      );
      Vector3.normalize(frontv);
      let sidev = Vector3.create(1.0, 0.0, 0.0);
      Vector3.cross(sidev, vup, frontv);
      Vector3.normalize(sidev);
      let topv = Vector3.create(1.0, 0.0, 0.0);
      Vector3.cross(topv, frontv, sidev);
      Vector3.normalize(topv);

      m[0] = sidev.x;
      m[1] = topv.x;
      m[2] = frontv.x;
      m[3] = 0.0;

      m[4] = sidev.y;
      m[5] = topv.y;
      m[6] = frontv.y;
      m[7] = 0.0;

      m[8] = sidev.z;
      m[9] = topv.z;
      m[10] = frontv.z;
      m[11] = 0.0;

      m[12] = -(vpos.x * m[0] + vpos.y * m[4] + vpos.z * m[8]);
      m[13] = -(vpos.x * m[1] + vpos.y * m[5] + vpos.z * m[9]);
      m[14] = -(vpos.x * m[2] + vpos.y * m[6] + vpos.z * m[10]);
      m[15] = 1.0;
    };

    //
    var timeInfo: any = {
      start: 0,
      prev: 0, // Date
      delta: 0,
      elapsed: 0 // Number(sec)
    };

    //
    var gl: any;
    var renderSpec: any = {
      width: 0,
      height: 0,
      aspect: 1,
      array: new Float32Array(3),
      halfWidth: 0,
      halfHeight: 0,
      halfArray: new Float32Array(3)
      // and some render targets. see setViewport()
    };
    renderSpec.setSize = function(w: any, h: any) {
      renderSpec.width = w;
      renderSpec.height = h;
      renderSpec.aspect = renderSpec.width / renderSpec.height;
      renderSpec.array[0] = renderSpec.width;
      renderSpec.array[1] = renderSpec.height;
      renderSpec.array[2] = renderSpec.aspect;

      renderSpec.halfWidth = Math.floor(w / 2);
      renderSpec.halfHeight = Math.floor(h / 2);
      renderSpec.halfArray[0] = renderSpec.halfWidth;
      renderSpec.halfArray[1] = renderSpec.halfHeight;
      renderSpec.halfArray[2] = renderSpec.halfWidth / renderSpec.halfHeight;
    };

    function deleteRenderTarget(rt: any) {
      gl.deleteFramebuffer(rt.frameBuffer);
      gl.deleteRenderbuffer(rt.renderBuffer);
      gl.deleteTexture(rt.texture);
    }

    function createRenderTarget(w: any, h: any) {
      var ret: any = {
        width: w,
        height: h,
        sizeArray: new Float32Array([w, h, w / h]),
        dtxArray: new Float32Array([1.0 / w, 1.0 / h])
      };
      ret.frameBuffer = gl.createFramebuffer();
      ret.renderBuffer = gl.createRenderbuffer();
      ret.texture = gl.createTexture();

      gl.bindTexture(gl.TEXTURE_2D, ret.texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        w,
        h,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      gl.bindFramebuffer(gl.FRAMEBUFFER, ret.frameBuffer);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        ret.texture,
        0
      );

      gl.bindRenderbuffer(gl.RENDERBUFFER, ret.renderBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.DEPTH_ATTACHMENT,
        gl.RENDERBUFFER,
        ret.renderBuffer
      );

      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      return ret;
    }

    function compileShader(shtype: any, shsrc: any) {
      var retsh: any = gl.createShader(shtype);

      gl.shaderSource(retsh, shsrc);
      gl.compileShader(retsh);

      if (!gl.getShaderParameter(retsh, gl.COMPILE_STATUS)) {
        var errlog: any = gl.getShaderInfoLog(retsh);
        gl.deleteShader(retsh);
        console.error(errlog);
        return null;
      }
      return retsh;
    }

    function createShader(
      vtxsrc: any,
      frgsrc: any,
      uniformlist: any,
      attrlist: any
    ) {
      var vsh: any = compileShader(gl.VERTEX_SHADER, vtxsrc);
      var fsh: any = compileShader(gl.FRAGMENT_SHADER, frgsrc);

      if (vsh == null || fsh == null) {
        return null;
      }

      var prog: any = gl.createProgram();
      gl.attachShader(prog, vsh);
      gl.attachShader(prog, fsh);

      gl.deleteShader(vsh);
      gl.deleteShader(fsh);

      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        var errlog: any = gl.getProgramInfoLog(prog);
        console.error(errlog);
        return null;
      }

      if (uniformlist) {
        prog.uniforms = {};
        for (var i = 0; i < uniformlist.length; i++) {
          prog.uniforms[uniformlist[i]] = gl.getUniformLocation(
            prog,
            uniformlist[i]
          );
        }
      }

      if (attrlist) {
        prog.attributes = {};
        for (let i = 0; i < attrlist.length; i++) {
          let attr = attrlist[i];
          prog.attributes[attr] = gl.getAttribLocation(prog, attr);
        }
      }

      return prog;
    }

    function useShader(prog: any) {
      gl.useProgram(prog);
      for (let attr in prog.attributes) {
        gl.enableVertexAttribArray(prog.attributes[attr]);
      }
    }

    function unuseShader(prog: any) {
      for (let attr in prog.attributes) {
        gl.disableVertexAttribArray(prog.attributes[attr]);
      }
      gl.useProgram(null);
    }

    /////
    var projection: any = {
      angle: 60,
      nearfar: new Float32Array([0.1, 100.0]),
      matrix: Matrix44.createIdentity()
    };
    var camera: any = {
      position: Vector3.create(0, 0, 100),
      lookat: Vector3.create(0, 0, 0),
      up: Vector3.create(0, 1, 0),
      dof: Vector3.create(10.0, 4.0, 8.0),
      matrix: Matrix44.createIdentity()
    };

    var pointFlower: any = {};
    // var meshFlower = {};
    var sceneStandBy: any = false;

    var BlossomParticle: any = function() {
      this.velocity = new Array(3);
      this.rotation = new Array(3);
      this.position = new Array(3);
      this.euler = new Array(3);
      this.size = 1.0;
      this.alpha = 1.0;
      this.zkey = 0.0;
    };

    BlossomParticle.prototype.setVelocity = function(
      vx: any,
      vy: any,
      vz: any
    ) {
      this.velocity[0] = vx;
      this.velocity[1] = vy;
      this.velocity[2] = vz;
    };

    BlossomParticle.prototype.setRotation = function(
      rx: any,
      ry: any,
      rz: any
    ) {
      this.rotation[0] = rx;
      this.rotation[1] = ry;
      this.rotation[2] = rz;
    };

    BlossomParticle.prototype.setPosition = function(
      nx: any,
      ny: any,
      nz: any
    ) {
      this.position[0] = nx;
      this.position[1] = ny;
      this.position[2] = nz;
    };

    BlossomParticle.prototype.setEulerAngles = function(
      rx: any,
      ry: any,
      rz: any
    ) {
      this.euler[0] = rx;
      this.euler[1] = ry;
      this.euler[2] = rz;
    };

    BlossomParticle.prototype.setSize = function(s: any) {
      this.size = s;
    };

    BlossomParticle.prototype.update = function(dt: any, et: any) {
      this.position[0] += this.velocity[0] * dt;
      this.position[1] += this.velocity[1] * dt;
      this.position[2] += this.velocity[2] * dt;

      this.euler[0] += this.rotation[0] * dt;
      this.euler[1] += this.rotation[1] * dt;
      this.euler[2] += this.rotation[2] * dt;
    };

    function createPointFlowers() {
      // get point sizes
      var prm: any = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
      renderSpec.pointSize = { min: prm[0], max: prm[1] };

      var vtxsrc: any = sakura_point_vsh;
      var frgsrc: any = sakura_point_fsh;

      pointFlower.program = createShader(
        vtxsrc,
        frgsrc,
        [
          "uProjection",
          "uModelview",
          "uResolution",
          "uOffset",
          "uDOF",
          "uFade"
        ],
        ["aPosition", "aEuler", "aMisc"]
      );

      useShader(pointFlower.program);
      pointFlower.offset = new Float32Array([0.0, 0.0, 0.0]);
      pointFlower.fader = Vector3.create(0.0, 10.0, 0.0);

      // paramerters: velocity[3], rotate[3]
      pointFlower.numFlowers = 1600;
      pointFlower.particles = new Array(pointFlower.numFlowers);
      // vertex attributes {position[3], euler_xyz[3], size[1]}
      pointFlower.dataArray = new Float32Array(
        pointFlower.numFlowers * (3 + 3 + 2)
      );
      pointFlower.positionArrayOffset = 0;
      pointFlower.eulerArrayOffset = pointFlower.numFlowers * 3;
      pointFlower.miscArrayOffset = pointFlower.numFlowers * 6;

      pointFlower.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pointFlower.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, pointFlower.dataArray, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);

      unuseShader(pointFlower.program);

      for (let i = 0; i < pointFlower.numFlowers; i++) {
        pointFlower.particles[i] = new BlossomParticle();
      }
    }

    function initPointFlowers() {
      //area
      pointFlower.area = Vector3.create(20.0, 20.0, 20.0);
      pointFlower.area.x = pointFlower.area.y * renderSpec.aspect;

      pointFlower.fader.x = 10.0; //env fade start
      pointFlower.fader.y = pointFlower.area.z; //env fade half
      pointFlower.fader.z = 0.1; //near fade start

      //particles
      var PI2: any = Math.PI * 2.0;
      var tmpv3: any = Vector3.create(0, 0, 0);
      var tmpv: any = 0;
      var symmetryrand: any = function() {
        return Math.random() * 2.0 - 1.0;
      };
      for (let i = 0; i < pointFlower.numFlowers; i++) {
        let tmpprtcl = pointFlower.particles[i];

        //velocity
        tmpv3.x = symmetryrand() * 0.3 + 0.8;
        tmpv3.y = symmetryrand() * 0.2 - 1.0;
        tmpv3.z = symmetryrand() * 0.3 + 0.5;
        Vector3.normalize(tmpv3);
        tmpv = 2.0 + Math.random() * 1.0;
        tmpprtcl.setVelocity(tmpv3.x * tmpv, tmpv3.y * tmpv, tmpv3.z * tmpv);

        //rotation
        tmpprtcl.setRotation(
          symmetryrand() * PI2 * 0.5,
          symmetryrand() * PI2 * 0.5,
          symmetryrand() * PI2 * 0.5
        );

        //position
        tmpprtcl.setPosition(
          symmetryrand() * pointFlower.area.x,
          symmetryrand() * pointFlower.area.y,
          symmetryrand() * pointFlower.area.z
        );

        //euler
        tmpprtcl.setEulerAngles(
          Math.random() * Math.PI * 2.0,
          Math.random() * Math.PI * 2.0,
          Math.random() * Math.PI * 2.0
        );

        //size
        tmpprtcl.setSize(0.9 + Math.random() * 0.1);
      }
    }

    function renderPointFlowers() {
      //update
      var PI2: any = Math.PI * 2.0;
      // var limit = [pointFlower.area.x, pointFlower.area.y, pointFlower.area.z];
      var repeatPos: any = function(prt: any, cmp: any, limit: any) {
        if (Math.abs(prt.position[cmp]) - prt.size * 0.5 > limit) {
          //out of area
          if (prt.position[cmp] > 0) {
            prt.position[cmp] -= limit * 2.0;
          } else {
            prt.position[cmp] += limit * 2.0;
          }
        }
      };
      var repeatEuler: any = function(prt: any, cmp: any) {
        prt.euler[cmp] = prt.euler[cmp] % PI2;
        if (prt.euler[cmp] < 0.0) {
          prt.euler[cmp] += PI2;
        }
      };

      for (let i = 0; i < pointFlower.numFlowers; i++) {
        let prtcl = pointFlower.particles[i];
        prtcl.update(timeInfo.delta, timeInfo.elapsed);
        repeatPos(prtcl, 0, pointFlower.area.x);
        repeatPos(prtcl, 1, pointFlower.area.y);
        repeatPos(prtcl, 2, pointFlower.area.z);
        repeatEuler(prtcl, 0);
        repeatEuler(prtcl, 1);
        repeatEuler(prtcl, 2);

        prtcl.alpha = 1.0; //(pointFlower.area.z - prtcl.position[2]) * 0.5;

        prtcl.zkey =
          camera.matrix[2] * prtcl.position[0] +
          camera.matrix[6] * prtcl.position[1] +
          camera.matrix[10] * prtcl.position[2] +
          camera.matrix[14];
      }

      // sort
      pointFlower.particles.sort(function(p0: any, p1: any) {
        return p0.zkey - p1.zkey;
      });

      // update data
      var ipos: any = pointFlower.positionArrayOffset;
      var ieuler: any = pointFlower.eulerArrayOffset;
      var imisc: any = pointFlower.miscArrayOffset;
      for (let i = 0; i < pointFlower.numFlowers; i++) {
        let prtcl = pointFlower.particles[i];
        pointFlower.dataArray[ipos] = prtcl.position[0];
        pointFlower.dataArray[ipos + 1] = prtcl.position[1];
        pointFlower.dataArray[ipos + 2] = prtcl.position[2];
        ipos += 3;
        pointFlower.dataArray[ieuler] = prtcl.euler[0];
        pointFlower.dataArray[ieuler + 1] = prtcl.euler[1];
        pointFlower.dataArray[ieuler + 2] = prtcl.euler[2];
        ieuler += 3;
        pointFlower.dataArray[imisc] = prtcl.size;
        pointFlower.dataArray[imisc + 1] = prtcl.alpha;
        imisc += 2;
      }

      //draw
      gl.enable(gl.BLEND);
      //gl.disable(gl.DEPTH_TEST);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      var prog: any = pointFlower.program;
      useShader(prog);

      gl.uniformMatrix4fv(prog.uniforms.uProjection, false, projection.matrix);
      gl.uniformMatrix4fv(prog.uniforms.uModelview, false, camera.matrix);
      gl.uniform3fv(prog.uniforms.uResolution, renderSpec.array);
      gl.uniform3fv(prog.uniforms.uDOF, Vector3.arrayForm(camera.dof));
      gl.uniform3fv(prog.uniforms.uFade, Vector3.arrayForm(pointFlower.fader));

      gl.bindBuffer(gl.ARRAY_BUFFER, pointFlower.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, pointFlower.dataArray, gl.DYNAMIC_DRAW);

      gl.vertexAttribPointer(
        prog.attributes.aPosition,
        3,
        gl.FLOAT,
        false,
        0,
        pointFlower.positionArrayOffset * Float32Array.BYTES_PER_ELEMENT
      );
      gl.vertexAttribPointer(
        prog.attributes.aEuler,
        3,
        gl.FLOAT,
        false,
        0,
        pointFlower.eulerArrayOffset * Float32Array.BYTES_PER_ELEMENT
      );
      gl.vertexAttribPointer(
        prog.attributes.aMisc,
        2,
        gl.FLOAT,
        false,
        0,
        pointFlower.miscArrayOffset * Float32Array.BYTES_PER_ELEMENT
      );

      // doubler
      for (let i = 1; i < 2; i++) {
        let zpos = i * -2.0;
        pointFlower.offset[0] = pointFlower.area.x * -1.0;
        pointFlower.offset[1] = pointFlower.area.y * -1.0;
        pointFlower.offset[2] = pointFlower.area.z * zpos;
        gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
        gl.drawArrays(gl.POINT, 0, pointFlower.numFlowers);

        pointFlower.offset[0] = pointFlower.area.x * -1.0;
        pointFlower.offset[1] = pointFlower.area.y * 1.0;
        pointFlower.offset[2] = pointFlower.area.z * zpos;
        gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
        gl.drawArrays(gl.POINT, 0, pointFlower.numFlowers);

        pointFlower.offset[0] = pointFlower.area.x * 1.0;
        pointFlower.offset[1] = pointFlower.area.y * -1.0;
        pointFlower.offset[2] = pointFlower.area.z * zpos;
        gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
        gl.drawArrays(gl.POINT, 0, pointFlower.numFlowers);

        pointFlower.offset[0] = pointFlower.area.x * 1.0;
        pointFlower.offset[1] = pointFlower.area.y * 1.0;
        pointFlower.offset[2] = pointFlower.area.z * zpos;
        gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
        gl.drawArrays(gl.POINT, 0, pointFlower.numFlowers);
      }

      //main
      pointFlower.offset[0] = 0.0;
      pointFlower.offset[1] = 0.0;
      pointFlower.offset[2] = 0.0;
      gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
      gl.drawArrays(gl.POINT, 0, pointFlower.numFlowers);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      unuseShader(prog);

      gl.enable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
    }

    // effects
    //common util
    function createEffectProgram(
      vtxsrc: any,
      frgsrc: any,
      exunifs: any,
      exattrs: any
    ) {
      var ret: any = {};
      var unifs: any = ["uResolution", "uSrc", "uDelta"];
      if (exunifs) {
        unifs = unifs.concat(exunifs);
      }
      var attrs: any = ["aPosition"];
      if (exattrs) {
        attrs = attrs.concat(exattrs);
      }

      ret.program = createShader(vtxsrc, frgsrc, unifs, attrs);
      useShader(ret.program);

      ret.dataArray = new Float32Array([
        -1.0,
        -1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,
        1.0,
        1.0
      ]);
      ret.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, ret.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, ret.dataArray, gl.STATIC_DRAW);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      unuseShader(ret.program);

      return ret;
    }

    // basic usage
    // useEffect(prog, srctex({'texture':texid, 'dtxArray':(f32)[dtx, dty]})); //basic initialize
    // gl.uniform**(...); //additional uniforms
    // drawEffect()
    // unuseEffect(prog)
    // TEXTURE0 makes src
    function useEffect(fxobj: any, srctex: any) {
      var prog: any = fxobj.program;
      useShader(prog);
      gl.uniform3fv(prog.uniforms.uResolution, renderSpec.array);

      if (srctex != null) {
        gl.uniform2fv(prog.uniforms.uDelta, srctex.dtxArray);
        gl.uniform1i(prog.uniforms.uSrc, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, srctex.texture);
      }
    }
    function drawEffect(fxobj: any) {
      gl.bindBuffer(gl.ARRAY_BUFFER, fxobj.buffer);
      gl.vertexAttribPointer(
        fxobj.program.attributes.aPosition,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    function unuseEffect(fxobj: any) {
      unuseShader(fxobj.program);
    }

    var effectLib: any = {};
    function createEffectLib() {
      var vtxsrc: any, frgsrc: any;
      //common
      var cmnvtxsrc: any = fx_common_vsh;

      //background
      frgsrc = bg_fsh;
      effectLib.sceneBg = createEffectProgram(
        cmnvtxsrc,
        frgsrc,
        ["uTimes"],
        null
      );

      // make brightpixels buffer
      frgsrc = fx_brightbuf_fsh;
      effectLib.mkBrightBuf = createEffectProgram(
        cmnvtxsrc,
        frgsrc,
        null,
        null
      );

      // direction blur
      frgsrc = fx_dirblur_r4_fsh;
      effectLib.dirBlur = createEffectProgram(
        cmnvtxsrc,
        frgsrc,
        ["uBlurDir"],
        null
      );

      //final composite
      vtxsrc = pp_final_vsh;
      frgsrc = pp_final_fsh;
      // console.log('frgsrc :',frgsrc )
      effectLib.finalComp = createEffectProgram(
        vtxsrc,
        frgsrc,
        ["uBloom"],
        null
      );
    }

    // background
    function createBackground() {
      //console.log("create background");
    }
    function initBackground() {
      //console.log("init background");
    }
    function renderBackground() {
      gl.disable(gl.DEPTH_TEST);

      useEffect(effectLib.sceneBg, null);
      gl.uniform2f(
        effectLib.sceneBg.program.uniforms.uTimes,
        timeInfo.elapsed,
        timeInfo.delta
      );
      drawEffect(effectLib.sceneBg);
      unuseEffect(effectLib.sceneBg);

      gl.enable(gl.DEPTH_TEST);
    }

    // post process
    // var postProcess = {};
    function createPostProcess() {
      //console.log("create post process");
    }
    function initPostProcess() {
      //console.log("init post process");
    }

    function renderPostProcess() {
      gl.enable(gl.TEXTURE_2D);
      gl.disable(gl.DEPTH_TEST);
      var bindRT: any = function(rt: any, isclear: any) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, rt.frameBuffer);
        gl.viewport(0, 0, rt.width, rt.height);
        if (isclear) {
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
      };

      //make bright buff
      bindRT(renderSpec.wHalfRT0, true);
      useEffect(effectLib.mkBrightBuf, renderSpec.mainRT);
      drawEffect(effectLib.mkBrightBuf);
      unuseEffect(effectLib.mkBrightBuf);

      // make bloom
      for (let i = 0; i < 2; i++) {
        let p = 1.5 + 1 * i;
        let s = 2.0 + 1 * i;
        bindRT(renderSpec.wHalfRT1, true);
        useEffect(effectLib.dirBlur, renderSpec.wHalfRT0);
        gl.uniform4f(
          effectLib.dirBlur.program.uniforms.uBlurDir,
          p,
          0.0,
          s,
          0.0
        );
        drawEffect(effectLib.dirBlur);
        unuseEffect(effectLib.dirBlur);

        bindRT(renderSpec.wHalfRT0, true);
        useEffect(effectLib.dirBlur, renderSpec.wHalfRT1);
        gl.uniform4f(
          effectLib.dirBlur.program.uniforms.uBlurDir,
          0.0,
          p,
          0.0,
          s
        );
        drawEffect(effectLib.dirBlur);
        unuseEffect(effectLib.dirBlur);
      }

      //display
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, renderSpec.width, renderSpec.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      useEffect(effectLib.finalComp, renderSpec.mainRT);
      gl.uniform1i(effectLib.finalComp.program.uniforms.uBloom, 1);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, renderSpec.wHalfRT0.texture);
      drawEffect(effectLib.finalComp);
      unuseEffect(effectLib.finalComp);

      gl.enable(gl.DEPTH_TEST);
    }

    /////
    // var SceneEnv = {};
    function createScene() {
      createEffectLib();
      createBackground();
      createPointFlowers();
      createPostProcess();
      sceneStandBy = true;
    }

    function initScene() {
      initBackground();
      initPointFlowers();
      initPostProcess();

      //camera.position.z = 17.320508;
      camera.position.z = pointFlower.area.z + projection.nearfar[0];
      projection.angle =
        ((Math.atan2(
          pointFlower.area.y,
          camera.position.z + pointFlower.area.z
        ) *
          180.0) /
          Math.PI) *
        2.0;
      Matrix44.loadProjection(
        projection.matrix,
        renderSpec.aspect,
        projection.angle,
        projection.nearfar[0],
        projection.nearfar[1]
      );
    }

    function renderScene() {
      //draw
      Matrix44.loadLookAt(
        camera.matrix,
        camera.position,
        camera.lookat,
        camera.up
      );

      gl.enable(gl.DEPTH_TEST);

      //gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, renderSpec.mainRT.frameBuffer);
      gl.viewport(0, 0, renderSpec.mainRT.width, renderSpec.mainRT.height);
      gl.clearColor(0.005, 0, 0.05, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      renderBackground();
      renderPointFlowers();
      renderPostProcess();
    }

    /////
    function onResize(e: any) {
      makeCanvasFullScreen(document.getElementById("sakura"));
      setViewports();
      if (sceneStandBy) {
        initScene();
      }
    }

    function setViewports() {
      renderSpec.setSize(gl.canvas.width, gl.canvas.height);

      gl.clearColor(0.2, 0.2, 0.5, 1.0);
      gl.viewport(0, 0, renderSpec.width, renderSpec.height);

      var rtfunc: any = function(rtname: any, rtw: any, rth: any) {
        var rt: any = renderSpec[rtname];
        if (rt) deleteRenderTarget(rt);
        renderSpec[rtname] = createRenderTarget(rtw, rth);
      };
      rtfunc("mainRT", renderSpec.width, renderSpec.height);
      rtfunc("wFullRT0", renderSpec.width, renderSpec.height);
      rtfunc("wFullRT1", renderSpec.width, renderSpec.height);
      rtfunc("wHalfRT0", renderSpec.halfWidth, renderSpec.halfHeight);
      rtfunc("wHalfRT1", renderSpec.halfWidth, renderSpec.halfHeight);
    }

    function render() {
      renderScene();
    }

    var animating: boolean = true;

    function animate() {
      var curdate: any = new Date();
      timeInfo.elapsed = (curdate - timeInfo.start) / 1000.0;
      timeInfo.delta = (curdate - timeInfo.prev) / 1000.0;
      timeInfo.prev = curdate;

      if (animating) requestAnimationFrame(animate);
      render();
    }

    function makeCanvasFullScreen(canvas: any) {
      var b: any = document.body;
      var d: any = document.documentElement;
      let fullw = Math.max(
        b.clientWidth,
        b.scrollWidth,
        d.scrollWidth,
        d.clientWidth
      );
      let fullh = Math.max(
        b.clientHeight,
        b.scrollHeight,
        d.scrollHeight,
        d.clientHeight
      );
      canvas.width = fullw;
      canvas.height = fullh;
    }

    // window.addEventListener("load", function(e: any) {
    //   var canvas: any = document.getElementById("sakura");
    //   try {
    //     makeCanvasFullScreen(canvas);
    //     gl = canvas.getContext("experimental-webgl");
    //   } catch (e) {
    //     alert("WebGL not supported." + e);
    //     console.log("WebGL not supported :", e);
    //     return;
    //   }

    //   window.addEventListener("resize", onResize);

    //   setViewports();
    //   createScene();
    //   initScene();

    //   timeInfo.start = new Date();
    //   timeInfo.prev = timeInfo.start;
    //   animate();
    // });

    // 保证每次都执行
    var canvas: any = document.getElementById("sakura");
    try {
      makeCanvasFullScreen(canvas);
      gl = canvas.getContext("experimental-webgl");
    } catch (e) {
      alert("WebGL not supported." + e);
      console.error(e);
      return;
    }

    window.addEventListener("resize", onResize);

    setViewports();
    createScene();
    initScene();

    timeInfo.start = new Date();
    timeInfo.prev = timeInfo.start;
    animate();

    //set window.requestAnimationFrame
    (function(w: any, r: any) {
      w["r" + r] =
        w["r" + r] ||
        w["webkitR" + r] ||
        w["mozR" + r] ||
        w["msR" + r] ||
        w["oR" + r] ||
        function(c: any) {
          w.setTimeout(c, 1000 / 60);
        };
    })(window, "equestAnimationFrame");
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
      animation: mylogo 3s;
      -moz-animation: mylogo 3s; /* Firefox */
      -webkit-animation: mylogo 3s; /* Safari and Chrome */
      -o-animation: mylogo 3s; /* Opera */
      animation-iteration-count: infinite;
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
          color: #409eff;
          min-width: 80px;
        }
        .link:hover {
          color: rgb(155, 35, 35);
        }
      }
    }
    .introduce {
      padding-top: 20px;
      color: #fff;
    }
  }
}
@keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}

@-moz-keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}

@-webkit-keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}

@-o-keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}
</style>

