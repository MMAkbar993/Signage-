import { PrismaClient, SignageCategory, BlogCategory, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@signagecreators.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@signagecreators.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
      isActive: true,
    },
  });

  console.log(`✅ Created admin user: ${admin.email}`);

  // Seed default templates
  const templates = [
    // Danger Signs
    {
      name: 'High Voltage Area',
      description: 'Warning for high voltage electrical areas',
      detailedDescription: 'This sign indicates areas where high voltage electrical equipment is present. Only authorized personnel with proper training should enter.',
      category: SignageCategory.danger,
      subcategory: 'electrical',
      industry: 'manufacturing',
      hazards: ['Electric shock', 'Electrocution', 'Arc flash'],
      safetyProcedures: ['Lock out/Tag out procedures required', 'Wear appropriate PPE', 'Check for voltage before work'],
      requiredPPE: ['Insulated gloves', 'Safety glasses', 'Arc flash suit'],
      emergencyContacts: ['Emergency: 911', 'Safety Officer: Extension 100'],
      tags: ['electrical', 'high voltage', 'danger', 'shock hazard'],
    },
    {
      name: 'Confined Space Entry',
      description: 'Warning for confined space areas requiring permits',
      detailedDescription: 'Confined space entry requires proper authorization, training, and safety equipment. Never enter without proper procedures.',
      category: SignageCategory.danger,
      subcategory: 'confined-space',
      industry: 'construction',
      hazards: ['Oxygen deficiency', 'Toxic atmosphere', 'Engulfment'],
      safetyProcedures: ['Obtain entry permit', 'Test atmosphere', 'Have rescue team on standby'],
      requiredPPE: ['SCBA', 'Gas monitor', 'Full body harness', 'Retrieval system'],
      emergencyContacts: ['Emergency: 911', 'Rescue Team: Extension 200'],
      tags: ['confined space', 'permit required', 'atmospheric hazard'],
    },
    // Warning Signs
    {
      name: 'Forklift Traffic Area',
      description: 'Warning for areas with forklift operations',
      detailedDescription: 'Forklifts operate in this area. Pedestrians should use designated walkways and maintain awareness.',
      category: SignageCategory.warning,
      subcategory: 'traffic',
      industry: 'warehouse',
      hazards: ['Struck by forklift', 'Crushing hazard'],
      safetyProcedures: ['Use designated walkways', 'Make eye contact with operators', 'Wear high-visibility vest'],
      requiredPPE: ['High-visibility vest', 'Safety boots'],
      emergencyContacts: ['Warehouse Manager: Extension 150'],
      tags: ['forklift', 'traffic', 'warehouse', 'pedestrian'],
    },
    {
      name: 'Slippery When Wet',
      description: 'Warning for wet floor hazards',
      detailedDescription: 'Floor may be slippery when wet. Use caution and appropriate footwear.',
      category: SignageCategory.warning,
      subcategory: 'slip-hazard',
      industry: 'general',
      hazards: ['Slip and fall'],
      safetyProcedures: ['Walk carefully', 'Use handrails', 'Report spills immediately'],
      requiredPPE: ['Non-slip footwear'],
      emergencyContacts: ['Maintenance: Extension 300'],
      tags: ['wet floor', 'slippery', 'slip hazard'],
    },
    // Mandatory Signs
    {
      name: 'PPE Required Zone',
      description: 'Area requiring personal protective equipment',
      detailedDescription: 'All personnel entering this area must wear the specified personal protective equipment at all times.',
      category: SignageCategory.mandatory,
      subcategory: 'ppe',
      industry: 'manufacturing',
      hazards: ['Various workplace hazards'],
      safetyProcedures: ['Inspect PPE before use', 'Replace damaged PPE', 'Follow manufacturer guidelines'],
      requiredPPE: ['Hard hat', 'Safety glasses', 'Safety boots', 'High-visibility vest'],
      emergencyContacts: ['Safety Department: Extension 100'],
      tags: ['ppe', 'mandatory', 'safety equipment'],
    },
    {
      name: 'Hearing Protection Required',
      description: 'Area with high noise levels requiring hearing protection',
      detailedDescription: 'Noise levels in this area exceed safe limits. Hearing protection must be worn at all times.',
      category: SignageCategory.mandatory,
      subcategory: 'hearing',
      industry: 'manufacturing',
      hazards: ['Hearing damage', 'Noise-induced hearing loss'],
      safetyProcedures: ['Wear hearing protection at all times', 'Limit exposure time', 'Get regular hearing tests'],
      requiredPPE: ['Ear plugs', 'Ear muffs'],
      emergencyContacts: ['Occupational Health: Extension 400'],
      tags: ['hearing protection', 'noise', 'mandatory'],
    },
    // Prohibition Signs
    {
      name: 'No Smoking Area',
      description: 'Smoking prohibited in this area',
      detailedDescription: 'Smoking is strictly prohibited in this area due to fire hazards or health regulations.',
      category: SignageCategory.prohibition,
      subcategory: 'fire-safety',
      industry: 'general',
      hazards: ['Fire hazard', 'Health hazard'],
      safetyProcedures: ['Use designated smoking areas', 'Properly dispose of smoking materials'],
      requiredPPE: [],
      emergencyContacts: ['Security: Extension 500'],
      tags: ['no smoking', 'prohibition', 'fire safety'],
    },
    {
      name: 'Authorized Personnel Only',
      description: 'Restricted access area',
      detailedDescription: 'Access to this area is restricted to authorized personnel only. Unauthorized entry is prohibited.',
      category: SignageCategory.prohibition,
      subcategory: 'access-control',
      industry: 'general',
      hazards: ['Security risk', 'Safety hazards'],
      safetyProcedures: ['Check authorization before entry', 'Sign in at security desk', 'Display ID badge'],
      requiredPPE: [],
      emergencyContacts: ['Security: Extension 500'],
      tags: ['restricted', 'authorized personnel', 'access control'],
    },
    // Emergency Signs
    {
      name: 'Emergency Exit',
      description: 'Emergency exit route indicator',
      detailedDescription: 'This sign indicates the location of emergency exits. Keep exit routes clear at all times.',
      category: SignageCategory.emergency,
      subcategory: 'evacuation',
      industry: 'general',
      hazards: ['Blocked exits during emergency'],
      safetyProcedures: ['Know all exit locations', 'Keep exits clear', 'Follow evacuation procedures'],
      requiredPPE: [],
      emergencyContacts: ['Emergency: 911'],
      tags: ['emergency exit', 'evacuation', 'fire escape'],
    },
    {
      name: 'First Aid Station',
      description: 'Location of first aid supplies',
      detailedDescription: 'First aid supplies and equipment are available at this location. Report all injuries.',
      category: SignageCategory.emergency,
      subcategory: 'first-aid',
      industry: 'general',
      hazards: [],
      safetyProcedures: ['Report all injuries', 'Check supplies regularly', 'Know first aid procedures'],
      requiredPPE: [],
      emergencyContacts: ['First Aid: Extension 911', 'Emergency: 911'],
      tags: ['first aid', 'medical', 'emergency'],
    },
    // Fire Safety Signs
    {
      name: 'Fire Extinguisher Location',
      description: 'Location of fire extinguisher',
      detailedDescription: 'Fire extinguisher is located here. Know the PASS technique: Pull, Aim, Squeeze, Sweep.',
      category: SignageCategory.fire,
      subcategory: 'equipment',
      industry: 'general',
      hazards: ['Fire hazard'],
      safetyProcedures: ['Know fire extinguisher locations', 'Learn PASS technique', 'Report used extinguishers'],
      requiredPPE: [],
      emergencyContacts: ['Fire Department: 911'],
      tags: ['fire extinguisher', 'fire safety', 'equipment'],
    },
    // Chemical Safety Signs
    {
      name: 'Chemical Storage Area',
      description: 'Area for chemical storage with safety requirements',
      detailedDescription: 'Chemicals are stored in this area. Follow proper handling and storage procedures.',
      category: SignageCategory.chemical,
      subcategory: 'storage',
      industry: 'manufacturing',
      hazards: ['Chemical exposure', 'Spills', 'Reactions'],
      safetyProcedures: ['Read SDS before handling', 'Use proper containment', 'Report spills immediately'],
      requiredPPE: ['Chemical gloves', 'Safety goggles', 'Chemical apron', 'Respirator'],
      emergencyContacts: ['Hazmat Team: Extension 600', 'Emergency: 911'],
      tags: ['chemical', 'hazmat', 'storage', 'sds'],
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.name.toLowerCase().replace(/\s+/g, '-') },
      update: template,
      create: {
        id: template.name.toLowerCase().replace(/\s+/g, '-'),
        ...template,
      },
    });
  }

  console.log(`✅ Created ${templates.length} default templates`);

  // Create sample blog posts
  const blogPosts = [
    {
      title: 'Understanding ISO 7010 Safety Signs',
      slug: 'understanding-iso-7010-safety-signs',
      excerpt: 'A comprehensive guide to ISO 7010 standardized safety signs and their applications.',
      content: `
# Understanding ISO 7010 Safety Signs

ISO 7010 is the international standard for safety signs. This guide covers the key aspects you need to know.

## What is ISO 7010?

ISO 7010 is a standard that specifies safety signs used in workplaces and public areas. It provides a consistent, internationally recognized set of symbols.

## Categories of Signs

### Prohibition Signs (Red)
These signs indicate actions that are not permitted.

### Mandatory Signs (Blue)
These signs indicate required actions or equipment.

### Warning Signs (Yellow/Amber)
These signs warn of potential hazards.

### Emergency Signs (Green)
These signs indicate emergency-related information.

### Fire Safety Signs (Red)
These signs relate to fire safety equipment and procedures.

## Implementation Tips

1. Conduct a hazard assessment
2. Select appropriate signs
3. Position signs at eye level
4. Ensure adequate lighting
5. Regular inspection and maintenance
      `,
      category: BlogCategory.regulations,
      tags: ['ISO 7010', 'safety signs', 'standards', 'compliance'],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'Best Practices for Workplace Safety Signage',
      slug: 'best-practices-workplace-safety-signage',
      excerpt: 'Learn the best practices for implementing effective safety signage in your workplace.',
      content: `
# Best Practices for Workplace Safety Signage

Effective safety signage is crucial for maintaining a safe work environment.

## Key Principles

### Visibility
Signs should be clearly visible from a reasonable distance.

### Consistency
Use standardized signs throughout your facility.

### Relevance
Only display signs that are relevant to the hazards present.

### Maintenance
Regularly inspect and replace damaged or faded signs.

## Common Mistakes to Avoid

1. Too many signs causing visual clutter
2. Signs placed at incorrect heights
3. Using non-standard symbols
4. Neglecting to update signs when conditions change
      `,
      category: BlogCategory.best_practices,
      tags: ['safety', 'workplace', 'signage', 'best practices'],
      isPublished: true,
      publishedAt: new Date(),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: {
        ...post,
        userId: admin.id,
      },
    });
  }

  console.log(`✅ Created ${blogPosts.length} sample blog posts`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
