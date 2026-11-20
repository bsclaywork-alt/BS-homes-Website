import { google } from 'googleapis';

type ManifestPhoto = {
  driveFileId: string;
  fileName: string;
};

type ManifestProject = {
  projectId: string;
  showPhotos: boolean;
  photos: ManifestPhoto[];
  video?: {
    show: boolean;
    url: string;
  };
};

type DriveManifest = {
  schemaVersion: number;
  projects: ManifestProject[];
};

const required = [
  'GOOGLE_DRIVE_CLIENT_ID',
  'GOOGLE_DRIVE_CLIENT_SECRET',
  'GOOGLE_DRIVE_REFRESH_TOKEN',
  'GOOGLE_DRIVE_MANIFEST_FILE_ID'
] as const;

function fail(message: string): never {
  console.error(`[Drive validation] FAIL: ${message}`);
  process.exit(1);
}

function safeProjectId(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(value);
}

function validateManifest(value: unknown): DriveManifest {
  if (!value || typeof value !== 'object') fail('Manifest is not a JSON object.');
  const manifest = value as DriveManifest;
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.projects)) {
    fail('Manifest schemaVersion must be 1 and projects must be an array.');
  }

  const seen = new Set<string>();
  for (const project of manifest.projects) {
    if (!safeProjectId(project?.projectId)) fail('A project has an invalid stable projectId.');
    if (seen.has(project.projectId)) fail(`Duplicate projectId: ${project.projectId}`);
    seen.add(project.projectId);
    if (typeof project.showPhotos !== 'boolean') fail(`showPhotos must be boolean for ${project.projectId}.`);
    if (!Array.isArray(project.photos) || project.photos.length > 5) {
      fail(`Project ${project.projectId} must contain no more than five photos.`);
    }
    const fileIds = new Set<string>();
    for (const photo of project.photos) {
      if (!photo || typeof photo.driveFileId !== 'string' || !/^[A-Za-z0-9_-]{10,}$/.test(photo.driveFileId)) {
        fail(`Invalid Drive file ID in project ${project.projectId}.`);
      }
      if (fileIds.has(photo.driveFileId)) fail(`Duplicate photo file ID in project ${project.projectId}.`);
      fileIds.add(photo.driveFileId);
      if (typeof photo.fileName !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,100}\.(webp|jpe?g|png)$/i.test(photo.fileName)) {
        fail(`Unsafe or unsupported photo filename in project ${project.projectId}.`);
      }
    }
    if (project.video) {
      if (typeof project.video.show !== 'boolean' || typeof project.video.url !== 'string') {
        fail(`Invalid existing-video settings for project ${project.projectId}.`);
      }
      if (project.video.show && !/^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//i.test(project.video.url)) {
        fail(`Visible video for ${project.projectId} must use an approved existing YouTube/Vimeo URL.`);
      }
    }
  }
  return manifest;
}

async function main() {
  for (const key of required) {
    if (!process.env[key]) fail(`Missing GitHub Actions secret/environment value: ${key}`);
  }

  const oauth = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET
  );
  oauth.setCredentials({ refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN });

  const drive = google.drive({ version: 'v3', auth: oauth });
  const manifestId = process.env.GOOGLE_DRIVE_MANIFEST_FILE_ID!;
  const metadata = await drive.files.get({
    fileId: manifestId,
    fields: 'id,name,mimeType,trashed',
    supportsAllDrives: true
  });

  if (metadata.data.trashed) fail('The configured manifest file is in the Drive trash.');
  if (metadata.data.mimeType !== 'application/json' && metadata.data.mimeType !== 'text/plain') {
    fail(`Manifest must be a JSON file; received ${metadata.data.mimeType || 'unknown MIME type'}.`);
  }

  const response = await drive.files.get(
    { fileId: manifestId, alt: 'media', supportsAllDrives: true },
    { responseType: 'arraybuffer' }
  );
  const raw = Buffer.from(response.data as ArrayBuffer).toString('utf8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    fail('Private Drive manifest is not valid JSON.');
  }

  const manifest = validateManifest(parsed);
  console.log('[Drive validation] PASS');
  console.log(`- Manifest file: ${metadata.data.name || manifestId}`);
  console.log(`- Projects in manifest: ${manifest.projects.length}`);
  console.log(`- Projects with photos enabled: ${manifest.projects.filter(p => p.showPhotos).length}`);
  console.log(`- Projects with existing video enabled: ${manifest.projects.filter(p => p.video?.show).length}`);
  console.log('- No Drive media was downloaded, changed, deleted, or made public.');
  console.log('- No website build or deployment was performed.');
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(`Drive API validation request failed: ${message}`);
});
