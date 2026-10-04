import { db } from '../db.ts';
import { TeamMember } from '../../shared/types.ts';

export class TeamService {
  public static list(businessId: string): TeamMember[] {
    return db.getState().teamMembers.filter(t => t.businessId === businessId);
  }

  public static create(businessId: string, input: Partial<TeamMember>): TeamMember {
    if (!input.name || !input.name.trim()) throw new Error('Team member name is required.');
    if (!input.role || !input.role.trim()) throw new Error('Role is required.');

    const newMember: TeamMember = {
      id: `tm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      businessId,
      name: input.name.trim(),
      role: input.role.trim(),
      contact: input.contact?.trim() || '',
      status: input.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.update(s => s.teamMembers.push(newMember));
    return newMember;
  }

  public static update(id: string, input: Partial<TeamMember>): TeamMember {
    const state = db.getState();
    const idx = state.teamMembers.findIndex(t => t.id === id);
    if (idx === -1) throw new Error(`Team member ${id} not found.`);

    const current = state.teamMembers[idx];
    const updated: TeamMember = {
      ...current,
      ...input,
      id: current.id,
      businessId: current.businessId,
      updatedAt: new Date().toISOString(),
    };

    db.update(s => { s.teamMembers[idx] = updated; });
    return updated;
  }

  public static deactivate(id: string): TeamMember {
    return this.update(id, { status: 'INACTIVE' });
  }
}
