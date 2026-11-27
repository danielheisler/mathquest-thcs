import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MathView } from '../common/MathView';
import { soundManager } from '../../utils/sound';
import { 
  Play, Pause, RotateCcw, Maximize2, Minimize2, Volume2, VolumeX, 
  Sparkles, BookOpen, Layers, Eye, FastForward, Rewind, Video, MonitorPlay, Award
} from 'lucide-react';

interface LectureChapter {
  id: string;
  grade: number;
  title: string;
  topic: string;
  duration: number; // in seconds
  description: string;
  level: 'basic' | 'intermediate' | 'advanced';
  mathFormula: string;
  narrationSteps: {
    time: number;
    title: string;
    text: string;
    formula?: string;
  }[];
  modelType: 'pythagoras' | 'cylinder_sphere' | 'coordinates_3d' | 'parabola';
}

const LECTURE_CHAPTERS: LectureChapter[] = [
  {
    id: 'ch-pythagoras',
    grade: 8,
    title: 'Định Lí Pythagore Trong Không Gian 3D (Toán 8)',
    topic: 'Hình Học & Đo Lường · GDPT 2018',
    duration: 60,
    description: 'Trực quan hóa diện tích các hình vuông $a^2$, $b^2$ và $c^2$ dựng trên ba cạnh tam giác vuông trong không gian 3 chiều.',
    level: 'intermediate',
    mathFormula: 'a^2 + b^2 = c^2 \\iff c = \\sqrt{a^2 + b^2}',
    modelType: 'pythagoras',
    narrationSteps: [
      {
        time: 0,
        title: 'Cơ bản: Định nghĩa tam giác vuông',
        text: 'Trong tam giác vuông ABC vuông tại A, hai cạnh kề góc vuông gọi là cạnh góc vuông (a và b), cạnh đối diện góc vuông là cạnh huyền (c).',
        formula: '\\triangle ABC \\; (\\widehat{A} = 90^\\circ)'
      },
      {
        time: 15,
        title: 'Trung bình: Định lí Pythagore (Toán 8 – CT GDPT 2018)',
        text: 'Khi dựng 3 khối vuông trên ba cạnh có kích thước a, b và c, tổng diện tích hai hình vuông cạnh góc vuông luôn bằng diện tích hình vuông cạnh huyền.',
        formula: 'S_a + S_b = S_c \\Rightarrow a^2 + b^2 = c^2'
      },
      {
        time: 35,
        title: 'Nâng cao: Ứng dụng tính đường chéo hình hộp chữ nhật',
        text: 'Vận dụng Định lí Pythagore hai lần liên tiếp cho hình hộp chữ nhật (a, b, h): độ dài đường chéo d = √(a² + b² + h²).',
        formula: 'd = \\sqrt{a^2 + b^2 + h^2}'
      }
    ]
  },
  {
    id: 'ch-cylinder',
    grade: 9,
    title: 'Hình Khối Trong Thực Tiễn: Hình Trụ & Hình Nón (Toán 9)',
    topic: 'Hình Học Trực Quan · GDPT 2018',
    duration: 60,
    description: 'Mô phỏng 3D sự tạo thành hình trụ và hình nón (Chương X – Toán 9 GDPT 2018).',
    level: 'intermediate',
    mathFormula: 'S_{xq} = 2\\pi r h, \\quad V = \\pi r^2 h',
    modelType: 'cylinder_sphere',
    narrationSteps: [
      {
        time: 0,
        title: 'Cơ bản: Sự hình thành hình trụ',
        text: 'Khi quay một hình chữ nhật một vòng quanh một cạnh cố định, ta nhận được một hình trụ có bán kính đáy r và chiều cao h.',
        formula: 'r: \\text{bán kính đáy}, \\; h: \\text{chiều cao}'
      },
      {
        time: 20,
        title: 'Trung bình: Diện tích xung quanh & toàn phần',
        text: 'Khai triển mặt xung quanh của hình trụ là một hình chữ nhật có chiều dài bằng chu vi đáy 2πr và chiều rộng bằng chiều cao h.',
        formula: 'S_{xq} = 2\\pi r h, \\quad S_{tp} = 2\\pi rh + 2\\pi r^2'
      },
      {
        time: 40,
        title: 'Nâng cao: Thể tích hình trụ, hình nón & bài toán thực tế',
        text: 'Thể tích hình trụ V = πr²h; thể tích hình nón V = ⅓πr²h. Áp dụng tính dung tích bể nước, lon đồ uống và phễu.',
        formula: 'V_{\\text{trụ}} = \\pi r^2 h \\quad ; \\quad V_{\\text{nón}} = \\frac{1}{3}\\pi r^2 h'
      }
    ]
  },
  {
    id: 'ch-coordinates',
    grade: 8,
    title: 'Mặt Phẳng Tọa Độ Oxy & Mở Rộng Không Gian 3D (Toán 8)',
    topic: 'Hàm Số & Tọa Độ · GDPT 2018',
    duration: 60,
    description: 'Khám phá hệ trục tọa độ Đề-các (mặt phẳng Oxy Toán 8 GDPT 2018) mở rộng trực quan sang 3 chiều Oxyz.',
    level: 'basic',
    mathFormula: 'M(x_0; y_0), \\quad OM = \\sqrt{x_0^2 + y_0^2}',
    modelType: 'coordinates_3d',
    narrationSteps: [
      {
        time: 0,
        title: 'Cơ bản: Hệ trục tọa độ Oxy (Toán 8 – CT 2018)',
        text: 'Hai trục số Ox (trục hoành) và Oy (trục tung) vuông góc với nhau tại gốc O(0; 0). Mở rộng trong không gian có thêm trục cao độ Oz.',
        formula: 'Ox \\perp Oy \\; (\\text{mở rộng } Oz)'
      },
      {
        time: 20,
        title: 'Trung bình: Xác định tọa độ điểm M bằng hình chiếu',
        text: 'Từ điểm M hạ các đường vuông góc xuống các trục tọa độ để đọc chính xác hoành độ x và tung độ y.',
        formula: 'M(x_0; y_0) \\rightarrow \\text{hoành độ } x_0,\\; \\text{tung độ } y_0'
      },
      {
        time: 40,
        title: 'Nâng cao: Khoảng cách từ gốc O đến điểm M (ứng dụng Pythagore)',
        text: 'Vận dụng Định lí Pythagore: khoảng cách từ gốc tọa độ O(0; 0) đến M(x; y) là OM = √(x² + y²), mở rộng 3D là √(x² + y² + z²).',
        formula: 'OM = \\sqrt{x^2 + y^2 + z^2}'
      }
    ]
  },
  {
    id: 'ch-parabola',
    grade: 9,
    title: 'Đồ Thị Hàm Số y = ax² (a ≠ 0) & Parabol 3D (Toán 9)',
    topic: 'Hàm Số y = ax² · GDPT 2018',
    duration: 60,
    description: 'Tính chất đối xứng qua trục tung Oy của đồ thị hàm số y = ax² (a ≠ 0) và ứng dụng mặt chảo parabol.',
    level: 'advanced',
    mathFormula: 'y = ax^2 \\quad (a \\ne 0)',
    modelType: 'parabola',
    narrationSteps: [
      {
        time: 0,
        title: 'Cơ bản: Hình dạng đồ thị hàm số y = ax² (a ≠ 0)',
        text: 'Đồ thị hàm số y = ax² (a ≠ 0) là đường cong parabol đi qua gốc tọa độ O(0; 0) và nhận trục tung Oy làm trục đối xứng.',
        formula: 'a > 0: \\text{nằm phía trên } Ox, \\; a < 0: \\text{nằm phía dưới } Ox'
      },
      {
        time: 20,
        title: 'Trung bình: Điểm cao nhất, điểm thấp nhất & đối xứng',
        text: 'Với a > 0, O(0; 0) là điểm thấp nhất của đồ thị; với a < 0, O(0; 0) là điểm cao nhất. Hai điểm (x; y) và (-x; y) đối xứng qua Oy.',
        formula: 'a > 0 \\Rightarrow y_{\\min} = 0 \\text{ tại } x = 0'
      },
      {
        time: 40,
        title: 'Nâng cao: Ứng dụng chảo phản xạ parabol trong thực tiễn',
        text: 'Khi quay parabol quanh trục đối xứng Oy ta được mặt parabol ứng dụng trong chảo vệ tinh, đèn pha ô tô, kính thiên văn và cầu vòm.',
        formula: 'z = a(x^2 + y^2)'
      }
    ]
  }
];

export const Math3DAnimationTheater: React.FC = () => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>('ch-pythagoras');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const threeStateRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    group: THREE.Group;
    reqId?: number;
  } | null>(null);

  const activeChapter = LECTURE_CHAPTERS.find(c => c.id === selectedChapterId) || LECTURE_CHAPTERS[0];

  // Current narration step based on playback time
  const currentStep = [...activeChapter.narrationSteps]
    .reverse()
    .find(step => currentTime >= step.time) || activeChapter.narrationSteps[0];

  // Playback timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= activeChapter.duration) {
            return 0; // loop or pause
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, activeChapter.duration]);

  // Initialize and update Three.js scene
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 7);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x60a5fa, 2.0);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.5);
    dirLight2.position.set(-5, -3, -5);
    scene.add(dirLight2);

    // Floor Grid
    const grid = new THREE.GridHelper(12, 12, 0x3b82f6, 0x1e293b);
    grid.position.y = -1.5;
    scene.add(grid);

    // Content Group
    const group = new THREE.Group();
    scene.add(group);

    // Build model based on chapter
    build3DModel(group, activeChapter.modelType, wireframeMode);

    threeStateRef.current = { scene, camera, renderer, group };

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      const delta = clock.getDelta();
      if (group && isPlaying) {
        group.rotation.y += delta * 0.4 * playbackSpeed;
        group.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      }
      renderer.render(scene, camera);
      threeStateRef.current!.reqId = requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (threeStateRef.current?.reqId) {
        cancelAnimationFrame(threeStateRef.current.reqId);
      }
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [selectedChapterId, wireframeMode, isPlaying, playbackSpeed]);

  // Helper to build mathematical 3D structures
  const build3DModel = (parent: THREE.Group, type: string, wireframe: boolean) => {
    parent.clear();

    if (type === 'pythagoras') {
      // 3D Right Triangle & 3 Attached Square Blocks
      // Hypotenuse = 5, side A = 3, side B = 4
      const triShape = new THREE.Shape();
      triShape.moveTo(0, 0);
      triShape.lineTo(3, 0);
      triShape.lineTo(0, 4);
      triShape.closePath();

      const extrudeSettings = { depth: 0.6, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
      const triGeo = new THREE.ExtrudeGeometry(triShape, extrudeSettings);
      const triMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        wireframe,
        roughness: 0.2,
        metalness: 0.5
      });
      const triMesh = new THREE.Mesh(triGeo, triMat);
      triMesh.position.set(-1.5, -1, 0);
      parent.add(triMesh);

      // Block on side A (3x3)
      const boxAGeo = new THREE.BoxGeometry(3, 0.4, 3);
      const boxAMat = new THREE.MeshStandardMaterial({ color: 0x10b981, wireframe, roughness: 0.3 });
      const boxA = new THREE.Mesh(boxAGeo, boxAMat);
      boxA.position.set(0, -1.2, 1.5);
      parent.add(boxA);

      // Block on side B (4x4)
      const boxBGeo = new THREE.BoxGeometry(0.4, 4, 4);
      const boxBMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, wireframe, roughness: 0.3 });
      const boxB = new THREE.Mesh(boxBGeo, boxBMat);
      boxB.position.set(-1.7, 1, 0);
      parent.add(boxB);

      // Block on side C (5x5 hypotenuse)
      const boxCGeo = new THREE.BoxGeometry(5, 5, 0.3);
      const boxCMat = new THREE.MeshStandardMaterial({ color: 0xec4899, wireframe, roughness: 0.2 });
      const boxC = new THREE.Mesh(boxCGeo, boxCMat);
      boxC.position.set(0.5, 1.2, -1.5);
      boxC.rotation.z = Math.atan2(4, -3);
      parent.add(boxC);
    } else if (type === 'cylinder_sphere') {
      // 3D Cylinder
      const cylGeo = new THREE.CylinderGeometry(1.4, 1.4, 3, 32);
      const cylMat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        wireframe,
        roughness: 0.1,
        metalness: 0.6,
        transparent: true,
        opacity: 0.85
      });
      const cyl = new THREE.Mesh(cylGeo, cylMat);
      cyl.position.set(-1.8, 0, 0);
      parent.add(cyl);

      // 3D Cone
      const coneGeo = new THREE.ConeGeometry(1.4, 3, 32);
      const coneMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        wireframe,
        roughness: 0.2,
        metalness: 0.4,
        transparent: true,
        opacity: 0.85
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(1.8, 0, 0);
      parent.add(cone);
    } else if (type === 'coordinates_3d') {
      // 3D Coordinate axes with directional arrows
      const axesHelper = new THREE.AxesHelper(3.5);
      parent.add(axesHelper);

      // Target Vector from O to M(2, 2.5, 1.5)
      const dir = new THREE.Vector3(2, 2.5, 1.5).normalize();
      const origin = new THREE.Vector3(0, 0, 0);
      const length = 3.2;
      const hex = 0xf59e0b;
      const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex, 0.4, 0.2);
      parent.add(arrowHelper);

      // Point M sphere
      const sphereGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.5 });
      const pointM = new THREE.Mesh(sphereGeo, sphereMat);
      pointM.position.set(1.8, 2.2, 1.3);
      parent.add(pointM);
    } else if (type === 'parabola') {
      // 3D Paraboloid surface
      const paraGeo = new THREE.CylinderGeometry(0.01, 2.8, 2.6, 32, 16, true);
      const paraMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        wireframe,
        roughness: 0.3,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      const para = new THREE.Mesh(paraGeo, paraMat);
      para.position.set(0, 0, 0);
      parent.add(para);
    }
  };

  const handleToggleFullscreen = () => {
    soundManager.playClick();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const formatSec = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-800/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider mb-3">
            <MonitorPlay className="w-4 h-4 text-cyan-400" />
            <span>Phòng Trình Chiếu Hoạt Hình 3D Giáo Dục Toán THCS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Bài Giảng Hoạt Hình 3D Đa Chiều (Tỉ Lệ 16:9 HD)
          </h2>
          <p className="text-sm text-indigo-200 mt-2 leading-relaxed">
            Mô phỏng hình học không gian, định lí Pythagore và đồ thị hàm số theo thời gian thực. Được thiết kế tối ưu với tỉ lệ màn hình chuẩn 16:9, độ nét cao HD sẵn sàng để giáo viên trình chiếu trên máy chiếu và màn hình lớp học.
          </p>
        </div>
      </div>

      {/* Chapter Selection Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {LECTURE_CHAPTERS.map(ch => {
          const isSelected = selectedChapterId === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedChapterId(ch.id);
                setCurrentTime(0);
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-900/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'
                }`}>
                  Khối {ch.grade} · {ch.topic}
                </span>
                <span className="font-mono text-[11px] text-slate-400">{formatSec(ch.duration)}</span>
              </div>
              <h4 className="text-xs font-bold line-clamp-2 leading-snug">{ch.title}</h4>
            </button>
          );
        })}
      </div>

      {/* Main 16:9 Video Theater Container */}
      <div
        ref={containerRef}
        className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col relative"
      >
        {/* Top Video Header Overlay */}
        <div className="p-4 sm:p-5 flex items-center justify-between bg-gradient-to-b from-slate-950/90 to-transparent z-10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{activeChapter.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase font-bold">
                  16:9 HD 3D
                </span>
              </h3>
              <p className="text-xs text-slate-400">{activeChapter.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setWireframeMode(!wireframeMode)}
              className={`p-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                wireframeMode
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Bật/Tắt khung lưới Wireframe 3D"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Khung Dây (Wireframe)</span>
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs transition-colors"
              title="Phóng to chế độ máy chiếu lớp học"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 16:9 Three.js Canvas Area */}
        <div className="relative w-full aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
          <div ref={canvasContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Floating MathType Formula Badge */}
          <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-indigo-500/40 text-white shadow-xl max-w-sm pointer-events-none">
            <span className="text-[10px] text-indigo-300 font-bold block uppercase tracking-wider">
              Công Thức Trọng Tâm MathType
            </span>
            <div className="text-sm font-serif font-bold text-amber-300 mt-0.5">
              <MathView math={activeChapter.mathFormula} />
            </div>
          </div>

          {/* Subtitle / AI Teacher Narration Box */}
          <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-bold text-[10px] uppercase">
                  {currentStep.title}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Thời lượng: {formatSec(currentTime)} / {formatSec(activeChapter.duration)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                {currentStep.text}
              </p>
            </div>

            {currentStep.formula && (
              <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-serif text-cyan-300 shrink-0">
                <MathView math={currentStep.formula} />
              </div>
            )}
          </div>
        </div>

        {/* Video Control Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col gap-3">
          {/* Timeline progress scrubber */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-400">{formatSec(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={activeChapter.duration}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="flex-1 accent-indigo-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            />
            <span className="text-xs font-mono font-bold text-slate-400">{formatSec(activeChapter.duration)}</span>
          </div>

          {/* Controls Buttons */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors shadow-md shadow-indigo-600/30"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={() => setCurrentTime(prev => Math.max(0, prev - 10))}
                className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Lùi 10 giây"
              >
                <Rewind className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentTime(prev => Math.min(activeChapter.duration, prev + 10))}
                className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Tua 10 giây"
              >
                <FastForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentTime(0)}
                className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Bắt đầu lại từ đầu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Speed & Volume */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 text-[11px] font-bold">Tốc độ:</span>
                {[0.75, 1, 1.25, 1.5].map(spd => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      playbackSpeed === spd
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors text-xs"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
