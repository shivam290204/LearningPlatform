// noobsyte-frontend/src/components/roadmaps/roadmapData.js
import { registry } from '../../curriculum/curriculumRegistry';

const langToCourseSlug = {
  java: 'java-masterclass-core-to-advanced',
  python: 'python-fundamentals',
  cpp: 'cpp-fundamentals',
  dsa: 'java-dsa-masterclass'
};

const langSubtitles = {
  java: 'From JVM Architecture to Enterprise Spring Applications',
  python: 'From Elegant Scripting to Backend APIs & Automation',
  cpp: 'High-Performance Systems Engineering & Memory Control',
  dsa: 'Algorithmic Problem Solving & Big-O Complexity Mastery'
};

export function getCurriculumRoadmap(lang, expandedNodeId, onToggle, onJump) {
  const slug = langToCourseSlug[lang] || langToCourseSlug.java;
  const course = registry[slug];

  if (!course || !course.modules) {
    return {
      title: 'Course Curriculum',
      subtitle: 'Interactive Programming Learning Path',
      nodes: [],
      edges: []
    };
  }

  const nodes = [];
  const edges = [];
  let currentY = 0;

  course.modules.forEach((mod, index) => {
    const isExpanded = expandedNodeId === mod.id;
    const lessons = mod.lessons || [];

    // Calculate total time across lessons if available
    let totalMins = 0;
    lessons.forEach((l) => {
      const timeMatch = (l.estTime || '').match(/(\d+)/);
      if (timeMatch) totalMins += parseInt(timeMatch[1], 10);
    });
    const timeFormatted = totalMins > 0 ? `${totalMins} mins` : `${lessons.length * 20} mins`;

    // Compute node description from module or first lesson
    const description =
      lessons[0]?.description ||
      `Comprehensive learning module covering key concepts in ${mod.title.replace(/^Module \d+:\s*/i, '')}.`;

    nodes.push({
      id: mod.id,
      type: 'custom',
      position: { x: 260, y: currentY },
      data: {
        id: mod.id,
        step: String(index + 1),
        label: mod.title,
        description,
        lessons,
        totalTime: `${lessons.length} Lessons (${timeFormatted})`,
        difficulty: lessons[0]?.difficulty || 'Core Curriculum',
        isExpanded,
        showTopHandle: index > 0,
        showBottomHandle: index < course.modules.length - 1,
        onToggle,
        onJump
      }
    });

    if (index > 0) {
      const prevMod = course.modules[index - 1];
      edges.push({
        id: `edge-${prevMod.id}-${mod.id}`,
        source: prevMod.id,
        target: mod.id,
        animated: true,
        style: { stroke: '#24E0D9', strokeWidth: 2.5 }
      });
    }

    // Advance Y coordinate dynamically so expanding a node pushes subsequent nodes down smoothly
    const collapsedHeight = 96;
    const expandedExtraHeight = 160 + Math.min(lessons.length, 6) * 42;
    const nodeHeight = isExpanded ? collapsedHeight + expandedExtraHeight : collapsedHeight;
    currentY += nodeHeight + 48;
  });

  return {
    title: course.title,
    subtitle: langSubtitles[lang] || 'Interactive Module Flowchart',
    nodes,
    edges
  };
}
