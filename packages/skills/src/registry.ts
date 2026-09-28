
import { Skill } from './types.js';
import { SkillRegistryPort } from '@contentyou/schemas';

export class SkillRegistry implements SkillRegistryPort {
  private skills: Map<string, Skill<any>> = new Map();

  register(skill: Skill<any>) {
    this.skills.set(skill.format, skill);
  }

  getSkill(format: string): any {
    return this.skills.get(format);
  }

  getAll() {
    return Array.from(this.skills.values());
  }
}
