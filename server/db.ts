import fs from 'fs';
import path from 'path';
import { DatabaseState, createInitialSeed } from './data/initialSeed.ts';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

class DatabaseEngine {
  private state: DatabaseState | null = null;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.state = JSON.parse(raw);
      } else {
        this.state = createInitialSeed();
        this.persistSync();
      }
    } catch (err) {
      console.error('[DatabaseEngine] Error reading db file, falling back to seed:', err);
      this.state = createInitialSeed();
      this.persistSync();
    }
  }

  public getState(): DatabaseState {
    if (!this.state) {
      this.init();
    }
    return this.state!;
  }

  public update(updater: (state: DatabaseState) => void) {
    if (!this.state) {
      this.init();
    }
    updater(this.state!);
    this.persistDebounced();
  }

  public resetToSeed(): DatabaseState {
    this.state = createInitialSeed();
    this.persistSync();
    return this.state;
  }

  private persistDebounced() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.persistSync();
    }, 100);
  }

  private persistSync() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DatabaseEngine] Failed to persist db.json:', err);
    }
  }
}

export const db = new DatabaseEngine();
