import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import './index.css'; // 스타일 파일 임포트

const LandingPage = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    const Engine = Matter.Engine,
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
    const engine = Engine.create(),
          world = engine.world;

    // create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        background: 'transparent',
        wireframes: false
      }
    });

    Render.run(render);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // add boundaries
    Composite.add(world, [
      Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
    ]);

    const explosion = function(engine, delta) {
      const timeScale = (1000 / 60) / delta;
      const bodies = Composite.allBodies(engine.world);

      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];

        if (!body.isStatic && body.position.y >= 500) {
          const forceMagnitude = (0.05 * body.mass) * timeScale;

          Body.applyForce(body, body.position, {
            x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]), 
            y: -forceMagnitude + Common.random() * -forceMagnitude
          });
        }
      }
    };

    let timeScaleTarget = 1,
        lastTime = Common.now();

    Events.on(engine, 'afterUpdate', function(event) {
      const timeScale = (event.delta || (1000 / 60)) / 1000;

      engine.timing.timeScale += (timeScaleTarget - engine.timing.timeScale) * 12 * timeScale;

      if (Common.now() - lastTime >= 2000) {
        timeScaleTarget = timeScaleTarget < 1 ? 1 : 0;
        explosion(engine, event.delta);
        lastTime = Common.now();
      }
    });

    const bodyOptions = {
      frictionAir: 0, 
      friction: 0.0001,
      restitution: 0.8
    };
    
    Composite.add(world, Composites.stack(20, 100, 15, 3, 20, 40, function(x, y) {
      return Bodies.circle(x, y, Common.random(10, 20), bodyOptions);
    }));

    Composite.add(world, Composites.stack(50, 50, 8, 3, 0, 0, function(x, y) {
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
    }));

    const mouse = Mouse.create(render.canvas),
          mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
              stiffness: 0.2,
              render: {
                visible: false
              }
            }
          });

    Composite.add(world, mouseConstraint);

    render.mouse = mouse;

    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 }
    });

    return () => {
      Render.stop(render);
      Runner.stop(runner);
    };
  }, []);

  return (
    <div className="container">
      {/* 상단 헤더 */}
      <div className="header">
        <div className="title">THE SCENTS</div>
        <nav className="nav">
          <div className="nav-item">Home</div>
          <div className="nav-item">Features</div>
          <div className="nav-item">Reviews</div>
          <div className="nav-item">Contact</div>
        </nav>
        <button className="apply-button">Apply Now</button>
      </div>

      {/* 애니메이션 영역 */}
      <div className="main" ref={sceneRef} style={{ position: 'relative', zIndex: -1 }}></div>

      {/* 팀 소개 섹션 */}
      <div className="team-intro">
        <div className="team-title">Meet Our Team</div>
        <div className="team-description">
          Our team consists of experienced professionals who are passionate about bringing you the best experience.
        </div>
      </div>

      {/* 이메일 구독 섹션 */}
      <div className="email-form">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email"
            style={{ width: '100%', maxWidth: '400px' }}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </div>

      {/* 기능 섹션 */}
      <div className="features-section">
        <div className="feature">
          <div className="feature-icon">⭐</div>
          <div className="feature-title">Feature 1</div>
          <div className="feature-description">Description of feature 1.</div>
        </div>
        <div className="feature">
          <div className="feature-icon">🚀</div>
          <div className="feature-title">Feature 2</div>
          <div className="feature-description">Description of feature 2.</div>
        </div>
        <div className="feature">
          <div className="feature-icon">💎</div>
          <div className="feature-title">Feature 3</div>
          <div className="feature-description">Description of feature 3.</div>
        </div>
      </div>

      {/* 개발자 리뷰 섹션 */}
      <div className="developer-reviews">
        <div className="reviews-title">What Developers Say</div>
        <div className="reviews-subtitle">Here are some reviews from our developers.</div>
        <div className="reviews-grid">
          <div className="review-card">
            <div className="review-profile">
              <div className="review-avatar">A</div>
              <div>Alex</div>
            </div>
            <div className="review-text">
              "This tool is fantastic for rapid development and testing."
            </div>
          </div>
          <div className="review-card">
            <div className="review-profile">
              <div className="review-avatar">B</div>
              <div>Ben</div>
            </div>
            <div className="review-text">
              "A must-have for every developer's toolkit."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
