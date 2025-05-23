// export  const canvasFireworks = (canvas) => {
//     const ctx = canvas.getContext("2d");
  
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
  
//     const particles = [];
  
//     class Particle {
//       constructor(x, y, color, velocity, life) {
//         this.x = x;
//         this.y = y;
//         this.color = color;
//         this.velocity = velocity;
//         this.alpha = 1; // 初始透明度
//         this.life = life; // 粒子寿命
//       }
  
//       draw() {
//         ctx.save();
//         ctx.globalAlpha = this.alpha;
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, 2, 0, Math.PI * 2); // 粒子大小
//         ctx.fillStyle = this.color;
//         ctx.fill();
//         ctx.restore();
//       }
  
//       update() {
//         this.x += this.velocity.x;
//         this.y += this.velocity.y;
//         this.velocity.y += 0.02; // 模拟重力
//         this.alpha -= 0.01; // 逐渐透明
//         this.life--;
//       }
//     }
  
//     function createFirework(x, y) {
//       const colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"];
//       const count = 100; // 粒子数量
//       for (let i = 0; i < count; i++) {
//         const angle = Math.random() * Math.PI * 2;
//         const speed = Math.random() * 5 + 2;
//         particles.push(
//           new Particle(
//             x,
//             y,
//             colors[Math.floor(Math.random() * colors.length)],
//             {
//               x: Math.cos(angle) * speed,
//               y: Math.sin(angle) * speed,
//             },
//             100 // 粒子寿命
//           )
//         );
//       }
//     }
//     function randomFireworks() {
//       for (let i = 0; i < 3; i++) { // 每次触发5组烟花
//         const x = Math.random() * canvas.width;
//         const y = Math.random() * canvas.height;
//         createFirework(x, y);
//       }
//     }
  
  
//     function animate() {
//       ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // 烟花轨迹消退
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
  
//       particles.forEach((particle, index) => {
//         if (particle.alpha <= 0 || particle.life <= 0) {
//           particles.splice(index, 1); // 删除透明粒子
//         } else {
//           particle.update();
//           particle.draw();
//         }
//       });
  
//       requestAnimationFrame(animate);
//     }
  
//     // 自动触发烟花
//     const interval = setInterval(() => {
//       const x = Math.random() * canvas.width; // 随机 X 坐标
//       const y = Math.random() * canvas.height * 0.5; // 随机 Y 坐标 (靠近顶部)
//       randomFireworks(x, y);
//     }, 1000); // 每 0.5 秒触发一次烟花
  
//     animate();
// }
// // 停止动画并清理
// export function clearCanvas(canvas) {
//   const ctx = canvas.getContext("2d");
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
// }

export const canvasFireworks = (canvas) => {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  let animationFrameId = null;
  let intervalId = null;

  class Particle {
      constructor(x, y, color, velocity, life) {
          this.x = x;
          this.y = y;
          this.color = color;
          this.velocity = velocity;
          this.alpha = 1;
          this.life = life;
      }

      draw() {
          ctx.save();
          ctx.globalAlpha = this.alpha;
          ctx.beginPath();
          ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.restore();
      }

      update() {
          this.x += this.velocity.x;
          this.y += this.velocity.y;
          this.velocity.y += 0.02;
          this.alpha -= 0.01;
          this.life--;
      }
  }

  function createFirework(x, y) {
      const colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"];
      const count = 100;
      for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 5 + 2;
          particles.push(
              new Particle(
                  x,
                  y,
                  colors[Math.floor(Math.random() * colors.length)],
                  {
                      x: Math.cos(angle) * speed,
                      y: Math.sin(angle) * speed,
                  },
                  100
              )
          );
      }
  }

  function randomFireworks() {
      for (let i = 0; i < 3; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          createFirework(x, y);
      }
  }

  function animate() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
          if (particle.alpha <= 0 || particle.life <= 0) {
              particles.splice(index, 1);
          } else {
              particle.update();
              particle.draw();
          }
      });

      animationFrameId = requestAnimationFrame(animate);
  }

  function startFireworks() {
      // Clear any existing animation
      stopFireworks();

      // Start new animation
      intervalId = setInterval(() => {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height * 0.5;
          randomFireworks(x, y);
      }, 1000);

      animate();
  }

  function stopFireworks() {
      // Stop interval for creating fireworks
      if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
      }

      // Cancel animation frame
      if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
      }

      // Clear particles and canvas
      particles.length = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Expose start and stop functions
  return {
      start: startFireworks,
      stop: stopFireworks
  };
}

// No longer needed - functionality integrated into main function
export function clearCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}