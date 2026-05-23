import {
  siDocker,
  siFastapi,
  siGit,
  siKubernetes,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siSpringboot,
  siTailwindcss,
  siTypescript,
  siVite,
  type SimpleIcon,
} from 'simple-icons';

type SkillIcon = {
  name: string;
  icon: SimpleIcon;
  x: number;
  y: number;
  duration: string;
  delay: string;
};

const skillIcons: SkillIcon[] = [
  { name: 'React', icon: siReact, x: 8, y: 18, duration: '5.8s', delay: '0.1s' },
  { name: 'Node.js', icon: siNodedotjs, x: 34, y: 8, duration: '6.6s', delay: '1.4s' },
  { name: 'TypeScript', icon: siTypescript, x: 66, y: 18, duration: '4.8s', delay: '0.7s' },
  { name: 'PostgreSQL', icon: siPostgresql, x: 20, y: 42, duration: '6.9s', delay: '2.1s' },
  { name: 'Docker', icon: siDocker, x: 50, y: 36, duration: '5.2s', delay: '0.4s' },
  { name: 'FastAPI', icon: siFastapi, x: 78, y: 43, duration: '6.1s', delay: '1.8s' },
  { name: 'Spring Boot', icon: siSpringboot, x: 10, y: 68, duration: '4.4s', delay: '2.7s' },
  { name: 'Python', icon: siPython, x: 38, y: 62, duration: '5.6s', delay: '1.1s' },
  { name: 'Kubernetes', icon: siKubernetes, x: 68, y: 70, duration: '6.8s', delay: '0.2s' },
  { name: 'Git', icon: siGit, x: 28, y: 84, duration: '4.9s', delay: '2.3s' },
  { name: 'Tailwind', icon: siTailwindcss, x: 58, y: 88, duration: '6.3s', delay: '1.5s' },
  { name: 'Vite', icon: siVite, x: 86, y: 82, duration: '5.1s', delay: '0.9s' },
];

export function SkillIconCluster() {
  return (
    <div className="skill-icon-cluster reveal-child hidden h-0 md:block" aria-label="Technology stack">
      {skillIcons.map((item) => (
        <span
          key={item.name}
          className="skill-icon-float"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animationDuration: item.duration,
            animationDelay: item.delay,
          }}
        >
          <span className="skill-icon-node">
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              role="img"
              aria-label={item.name}
            >
              <path d={item.icon.path} />
            </svg>
            <span className="skill-icon-tooltip">
              {item.name}
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
