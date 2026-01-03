import { Document, Packer, Paragraph, TextRun } from 'docx';
import type { ResumeContent } from '@/lib/ai/types';
import type { MasterProfile } from '@prisma/client';

export async function renderResumeDocx({
  profile,
  content
}: {
  profile: MasterProfile;
  content: ResumeContent;
}) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: profile.headline ?? 'HireStudio Resume', bold: true })]
          }),
          ...(profile.location
            ? [new Paragraph({ children: [new TextRun(profile.location)] })]
            : []),
          new Paragraph({ children: [new TextRun({ text: 'Summary', bold: true })] }),
          new Paragraph(content.summary),
          new Paragraph({ children: [new TextRun({ text: 'Experience', bold: true })] }),
          ...content.experience.flatMap((exp) =>
            exp.bullets.map((bullet) => new Paragraph({ text: `• ${bullet}` }))
          ),
          new Paragraph({ children: [new TextRun({ text: 'Projects', bold: true })] }),
          ...content.projects.flatMap((project) =>
            project.bullets.map((bullet) => new Paragraph({ text: `• ${bullet}` }))
          ),
          new Paragraph({ children: [new TextRun({ text: 'Skills', bold: true })] }),
          new Paragraph(`Core: ${content.skills.core.join(', ')}`),
          new Paragraph(`Secondary: ${content.skills.secondary.join(', ')}`)
        ]
      }
    ]
  });

  return Packer.toBuffer(doc);
}
