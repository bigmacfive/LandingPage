import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import decomp from 'poly-decomp';

const LandingPage = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
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

    // provide concave decomposition support library
    Common.setDecomp(decomp);

    // create engine
    const engine = Engine.create();
    const world = engine.world;

    // create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600
      }
    });

    Render.run(render);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    const loadSvg = async (url) => {
      const response = await fetch(url);
      const raw = await response.text();
      const parser = new window.DOMParser();
      return parser.parseFromString(raw, 'image/svg+xml');
    };

    const select = (root, selector) => Array.from(root.querySelectorAll(selector));

    const svgPaths = [
      './iconmonstr-check-mark-8-icon.svg',
      './iconmonstr-paperclip-2-icon.svg',
      './iconmonstr-puzzle-icon.svg',
      './iconmonstr-user-icon.svg'
    ];

    svgPaths.forEach((path, i) => {
      loadSvg(path).then(root => {
        const color = Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);
        const vertexSets = select(root, 'path').map(path =>
          Vertices.scale(Svg.pathToVertices(path, 30), 0.4, 0.4)
        );

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

    // add boundaries
    Composite.add(world, [
      Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
    ]);

    // add mouse control
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

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 }
    });

    // cleanup
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
