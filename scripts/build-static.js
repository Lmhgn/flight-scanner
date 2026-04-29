/**
 * Build script for GitHub Pages static export.
 * Temporarily moves the /api directory out of the Next.js app folder
 * (API routes are server-only and can't be included in a static export),
 * runs the build, then restores it so the repo stays intact for Vercel deploys.
 */
const { execSync } = require('child_process');
const { existsSync, renameSync } = require('fs');
const { join } = require('path');

const root = join(__dirname, '..');
const apiDir = join(root, 'src', 'app', 'api');
const apiDirDisabled = join(root, 'src', 'app', '_api_disabled');

let moved = false;

try {
  if (existsSync(apiDir)) {
    renameSync(apiDir, apiDirDisabled);
    moved = true;
    console.log('ℹ️  Temporarily disabled API routes for static export');
  }

  execSync('next build', {
    stdio: 'inherit',
    env: { ...process.env, GITHUB_PAGES: 'true' },
    cwd: root,
  });
} finally {
  if (moved && existsSync(apiDirDisabled)) {
    renameSync(apiDirDisabled, apiDir);
    console.log('ℹ️  Restored API routes');
  }
}
