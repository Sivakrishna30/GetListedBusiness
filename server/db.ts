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
        // Migrate / backfill newly added Phase 1 foundational collections
        const seed = createInitialSeed();
        let needsSync = false;
        if (!this.state!.users || !this.state!.users.length) {
          this.state!.users = seed.users;
          needsSync = true;
        }
        if (!this.state!.businessMembers || !this.state!.businessMembers.length) {
          this.state!.businessMembers = seed.businessMembers;
          needsSync = true;
        }
        if (!this.state!.transactions) {
          this.state!.transactions = seed.transactions || [];
          needsSync = true;
        }
        if (!this.state!.expenses) {
          this.state!.expenses = seed.expenses || [];
          needsSync = true;
        }
        // Ensure businesses have ownerId, businessType, enabledOperations, and operationConfig
        this.state!.businesses.forEach(b => {
          const seedMatch = seed.businesses.find(sb => sb.id === b.id);
          if (!b.ownerId) {
            b.ownerId = seedMatch?.ownerId || 'user_siva_owner';
            needsSync = true;
          }
          if (!b.businessType) {
            b.businessType = seedMatch?.businessType || 'GENERAL';
            needsSync = true;
          }
          if (!b.enabledOperations || !b.enabledOperations.length) {
            b.enabledOperations = seedMatch?.enabledOperations || ['BOOKINGS', 'SERVICES', 'TRANSACTIONS', 'EXPENSES'];
            needsSync = true;
          }
          if (!b.operationConfig && seedMatch?.operationConfig) {
            b.operationConfig = seedMatch.operationConfig;
            needsSync = true;
          }
        });
        if (needsSync) {
          this.persistSync();
        }
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
