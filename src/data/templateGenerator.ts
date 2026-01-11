// Template Generator - Programmatically generates 5000+ templates
// This file generates comprehensive templates for every conceivable activity, hazard, and risk

import type { Template } from './templateDatabase';
import { MASSIVE_TEMPLATES } from './massiveTemplateDatabase';

// Export combined templates
export function getAllTemplates(): Template[] {
  console.log(`📚 getAllTemplates() called - Returning ${MASSIVE_TEMPLATES.length} templates`);
  return MASSIVE_TEMPLATES;
}