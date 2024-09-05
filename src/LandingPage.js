import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import decomp from 'poly-decomp';

const LandingPage = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    // Matter.js 관련 설정
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Common = Matter.Common,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Composite = Matter.Composite,
      Vertices = Matter.Vertices,
      Svg = Matter.Svg,
      Bodies = Matter.Bodies;

    // poly-decomp 설정
    Common.setDecomp(decomp);

    // 엔진과 월드 생성
    const engine = Engine.create();
    const world = engine.world;

    // 렌더러 생성
    const render = Render.create({
      element: sceneRef.current, // DOM 엘리먼트를 지정
      engine: engine,
      options: {
        width: 800,
        height: 600
      }
    });

    Render.run(render);

    // 러너 생성
    const runner = Runner.create();
    Runner.run(runner, engine);

    // SVG 파일 불러오기 및 변환
    const loadSvg = async (url) => {
      const response = await fetch(url);
      const raw = await response.text();
      const parser = new window.DOMParser();
      return parser.parseFromString(raw, 'image/svg+xml');
    };

    const select = (root, selector) => {
      return Array.prototype.slice.call(root.querySelectorAll(selector));
    };

    const svgPaths = [
      './iconmonstr-check-mark-8-icon.svg', 
      './iconmonstr-paperclip-2-icon.svg',
      './iconmonstr-puzzle-icon.svg',
      './iconmonstr-user-icon.svg'
    ];

    svgPaths.forEach((path, i) => {
      loadSvg(path).then(root => {
        const color = Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);
        const vertexSets = select(root, 'path').map(path => {
          return Vertices.scale(Svg.pathToVertices(path, 30), 0.4, 0.4);
        });

        Composite.add(world, Bodies.fromVertices(100 + i * 150, 200 + i * 50, vertexSets, {
          render: {
            fillStyle: color,
            strokeStyle: color,
            lineWidth: 1
          }
        }, true));
      });
    });

    loadSvg('./thescents.svg').then(root => {
      const color = Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);
      const vertexSets = select(root, 'path').map(path => Svg.pathToVertices(path, 30));

      Composite.add(world, Bodies.fromVertices(400, 80, vertexSets, {
        render: {
          fillStyle: color,
          strokeStyle: color,
          lineWidth: 1
        }
      }, true));
    });

    // 경계 벽 추가
    Composite.add(world, [
      Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
    ]);

    // 마우스 컨트롤 추가
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    // 씬 보기 설정
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 }
    });

    // 컴포넌트 언마운트 시 Matter.js 중지
    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Composite.clear(world);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return <div ref={sceneRef}></div>;
};

export default LandingPage;
