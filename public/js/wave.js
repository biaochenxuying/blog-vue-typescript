var SEPARATION = 100,
  AMOUNTX = 50,
  AMOUNTY = 50;

var container;
var camera, scene, renderer;

var particles,
  count = 0;

var mouseX = 0,
  mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
  container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.zIndex = '-1';
  container.style.opacity = '1';
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000,
  );
  camera.position.z = 1000;

  scene = new THREE.Scene();

  var numParticles = AMOUNTX * AMOUNTY;

  var positions = new Float32Array(numParticles * 3);
  var scales = new Float32Array(numParticles);

  var i = 0,
    j = 0;

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

  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.addAttribute('scale', new THREE.BufferAttribute(scales, 1));

  var material = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0x1890ff) },
    },
    vertexShader:
      'attribute float scale;void main() {vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );gl_PointSize = scale * ( 300.0 / - mvPosition.z );gl_Position = projectionMatrix * mvPosition;}',
    fragmentShader:
      'uniform vec3 color;void main() {if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;gl_FragColor = vec4( color, 1.0 );}',
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xffffff, 1.0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
  document.addEventListener('touchmove', onDocumentTouchMove, false);

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event) {
  if (event.touches.length === 1) {
    event.preventDefault();

    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;
  }
}

function onDocumentTouchMove(event) {
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
        Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;

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
