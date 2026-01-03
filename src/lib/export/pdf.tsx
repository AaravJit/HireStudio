import { Document, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import type { ResumeContent } from '@/lib/ai/types';
import type { MasterProfile } from '@prisma/client';

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11, fontFamily: 'Helvetica' },
  section: { marginBottom: 12 },
  heading: { fontSize: 12, marginBottom: 4, fontWeight: 600 },
  bullet: { marginLeft: 10 }
});

function ResumePdf({
  profile,
  content
}: {
  profile: MasterProfile;
  content: ResumeContent;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>{profile.headline ?? 'HireStudio Resume'}</Text>
          {profile.location ? <Text>{profile.location}</Text> : null}
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Summary</Text>
          <Text>{content.summary}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Experience</Text>
          {content.experience.map((exp, idx) => (
            <View key={exp.id ?? idx}>
              {exp.bullets.map((bullet, bulletIdx) => (
                <Text key={bulletIdx} style={styles.bullet}>
                  • {bullet}
                </Text>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Projects</Text>
          {content.projects.map((project, idx) => (
            <View key={project.id ?? idx}>
              {project.bullets.map((bullet, bulletIdx) => (
                <Text key={bulletIdx} style={styles.bullet}>
                  • {bullet}
                </Text>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Skills</Text>
          <Text>Core: {content.skills.core.join(', ')}</Text>
          <Text>Secondary: {content.skills.secondary.join(', ')}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderResumePdf({
  profile,
  content
}: {
  profile: MasterProfile;
  content: ResumeContent;
}) {
  const doc = ResumePdf({ profile, content });
  const buffer = await pdf(doc).toBuffer();
  return Buffer.from(buffer);
}
