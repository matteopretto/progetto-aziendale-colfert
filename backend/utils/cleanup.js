import fs from "fs";
import path from "path";

export function scheduleUploadCleanup(uploadDir, intervalMs = 1000 * 60 * 30, maxAgeMs = 1000 * 60 * 60) {
  const cleanup = () => {
    const now = Date.now();
    fs.readdir(uploadDir, (err, files) => {
      if (err) return;
      files.forEach(file => {
        const p = path.join(uploadDir, file);
        fs.stat(p, (err, stats) => {
          if (!err && now - stats.mtimeMs > maxAgeMs) {
            fs.unlink(p, () => console.log(`🧹 Pulito: ${file}`));
          }
        });
      });
    });
  };

  // prima pulizia subito
  cleanup();
  // poi ogni intervallo
  setInterval(cleanup, intervalMs);
}
