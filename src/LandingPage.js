import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

// Helper function to load SVG
const loadSvg = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
    const raw = await response.text();
    const parser = new window.DOMParser();
    return parser.parseFromString(raw, 'image/svg+xml');
  } catch (error) {
    console.error(`Failed to load SVG: ${error}`);
    return null;
  }
};

const LandingPage = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    const { Engine, Render, Runner, Common, MouseConstraint, Mouse, Composite, Vertices, Svg, Bodies } = Matter;

    // Check if `sceneRef.current` is available
    if (!sceneRef.current) return;

    // Create engine
    const engine = Engine.create();
    const world = engine.world;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600
      }
    });

    Render.run(render);

    // Create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Helper function to select paths from SVG
    const select = (root, selector) => Array.from(root.querySelectorAll(selector));

    // Load and add SVGs
    const svgPaths = [
      '/iconmonstr-check-mark-8-icon.svg',
      '/iconmonstr-paperclip-2-icon.svg',
      '/iconmonstr-puzzle-icon.svg',
      '/iconmonstr-user-icon.svg'
    ];

    svgPaths.forEach((path, i) => {
      loadSvg(path).then(root => {
        if (root) {
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
        }
      }).catch(error => {
        console.error(`Error loading SVG at ${path}: ${error}`);
      });
    });

    // Add boundaries
    Composite.add(world, [
      Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
    ]);

    // Add mouse control
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

    // Fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 }
    });

    // Cleanup
    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Composite.clear(world);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return <div ref={sceneRef} style={{ width: '800px', height: '600px', border: '1px solid black' }}></div>;
};

export default LandingPage;
