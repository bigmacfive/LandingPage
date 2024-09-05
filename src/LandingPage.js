import React, { useEffect } from 'react';
import Matter from 'matter-js';

const LandingPage = () => {
  useEffect(() => {
    const Example = Example || {};

    Example.timescale = function () {
      var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Events = Matter.Events,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Common = Matter.Common,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Bodies = Matter.Bodies;

      // create engine
      var engine = Engine.create(),
        world = engine.world;

      // create renderer
      var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
          width: window.innerWidth,
          height: window.innerHeight,
          wireframes: false, // This ensures shapes are shown as wireframes.
          background: '#000000',
          showAngleIndicator: false,
        },
      });

      Render.run(render);

      // create runner
      var runner = Runner.create();
      Runner.run(runner, engine);

      // add bodies with white borders
      Composite.add(world, [
        Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 50, { isStatic: true }),
        Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 50, { isStatic: true }),
        Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true }),
        Bodies.rectangle(0, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true }),
      ]);

      var explosion = function (engine, delta) {
        var timeScale = (1000 / 60) / delta;
        var bodies = Composite.allBodies(engine.world);

        for (var i = 0; i < bodies.length; i++) {
          var body = bodies[i];

          if (!body.isStatic && body.position.y >= window.innerHeight - 100) {
            var forceMagnitude = (0.05 * body.mass) * timeScale;

            Body.applyForce(body, body.position, {
              x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]),
              y: -forceMagnitude + Common.random() * -forceMagnitude,
            });
          }
        }
      };

      var timeScaleTarget = 1,
        lastTime = Common.now();

      Events.on(engine, 'afterUpdate', function (event) {
        var timeScale = (event.delta || (1000 / 60)) / 1000;

        engine.timing.timeScale += (timeScaleTarget - engine.timing.timeScale) * 12 * timeScale;

        if (Common.now() - lastTime >= 2000) {
          timeScaleTarget = timeScaleTarget < 1 ? 1 : 0;
          explosion(engine, event.delta);
          lastTime = Common.now();
        }
      });

      var bodyOptions = {
        frictionAir: 0,
        friction: 0.0001,
        restitution: 0.8,
        render: {
          fillStyle: 'transparent',
          strokeStyle: 'white',
          lineWidth: 2,
        },
      };

      Composite.add(
        world,
        Composites.stack(20, 100, 15, 3, 20, 40, function (x, y) {
          return Bodies.circle(x, y, Common.random(10, 20), bodyOptions);
        })
      );

      Composite.add(
        world,
        Composites.stack(50, 50, 8, 3, 0, 0, function (x, y) {
          switch (Math.round(Common.random(0, 1))) {
            case 0:
              if (Common.random() < 0.8) {
                return Bodies.rectangle(x, y, Common.random(20, 50), Common.random(20, 50), bodyOptions);
              } else {
                return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(20, 30), bodyOptions);
              }
            case 1:
              return Bodies.polygon(x, y, Math.round(Common.random(4, 8)), Common.random(20, 50), bodyOptions);
          }
        })
      );

      var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
            stiffness: 0.2,
            render: {
              visible: false,
            },
          },
        });

      Composite.add(world, mouseConstraint);

      render.mouse = mouse;

      Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: window.innerWidth, y: window.innerHeight },
      });

      return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function () {
          Matter.Render.stop(render);
          Matter.Runner.stop(runner);
        },
      };
    };

    Example.timescale();

    return () => {
      // Clean up on unmount
      Matter.Engine.clear(Example.timescale.engine);
    };
  }, []);

  return <div className="main" />;
};

export default LandingPage;
