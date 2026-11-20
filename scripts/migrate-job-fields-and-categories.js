import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pool, query } from '../server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export async function runMigration() {
  console.log('--- Starting TiDB Schema Migration & Vacancy Seed ---');

  // 1. Add new columns to jobs table if they do not exist
  console.log('\n[1/4] Checking and adding columns to jobs table...');
  const newColumns = [
    { name: 'salary_currency', def: 'VARCHAR(20) DEFAULT ""' },
    { name: 'working_hours', def: 'VARCHAR(100) DEFAULT NULL' },
    { name: 'overtime_details', def: 'TEXT DEFAULT NULL' },
    { name: 'accommodation_details', def: 'TEXT DEFAULT NULL' },
    { name: 'transportation_details', def: 'TEXT DEFAULT NULL' },
    { name: 'image_url', def: 'VARCHAR(500) DEFAULT NULL' },
    { name: 'basic_salary', def: 'VARCHAR(100) DEFAULT NULL' },
    { name: 'compulsory_ot_salary', def: 'VARCHAR(100) DEFAULT NULL' }
  ];

  for (const col of newColumns) {
    try {
      await query(`ALTER TABLE jobs ADD COLUMN ${col.name} ${col.def};`);
      console.log(`  + Added column '${col.name}' to jobs`);
    } catch (err) {
      if (err.message && (err.message.includes('Duplicate column') || err.message.includes('already exists'))) {
        console.log(`  - Column '${col.name}' already exists in jobs`);
      } else {
        console.warn(`  ! Note on adding column '${col.name}':`, err.message);
      }
    }
  }

  // 2. Create job_categories table if not exists
  console.log('\n[2/4] Creating job_categories table...');
  await query(`
    CREATE TABLE IF NOT EXISTS job_categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('  + job_categories table verified');

  // 3. Seed job categories (all 8 required categories + industry categories)
  console.log('\n[3/4] Seeding all 8 required job categories and industry sectors...');
  const categoriesToSeed = [
    { name: 'Mason - Block/Plaster', description: 'Construction trade: Block work, plastering and masonry' },
    { name: 'Tile Mason', description: 'Construction trade: Ceramic, marble and tile installations' },
    { name: 'Steel Fixer', description: 'Construction trade: Rebar fabrication and steel fixing' },
    { name: 'Shuttering Carpenter', description: 'Construction trade: Formwork and shuttering carpentry' },
    { name: 'Scaffolder', description: 'Construction trade: Scaffolding erection and structural rigging' },
    { name: 'Driver', description: 'Heavy & light vehicle drivers, bus operators, and transport specialists' },
    { name: 'Engineer', description: 'Civil, planning, mechanical, MEP and electrical site engineers' },
    { name: 'Pocket Packer', description: 'Packaging, manufacturing, warehouse and logistics sorting' },
    { name: 'Facility Management', description: 'Building operations, HVAC, MEP and facility maintenance' },
    { name: 'Construction & Engineering', description: 'Infrastructure, civil works and building contracting' },
    { name: 'Oil & Gas', description: 'Petrochemical plant operations, piping and industrial trades' },
    { name: 'Hospitality & Catering', description: 'Hotel front office, culinary and guest services' },
    { name: 'Logistics & Transport', description: 'Warehousing, inventory and supply chain coordination' }
  ];

  for (const cat of categoriesToSeed) {
    try {
      await query(`
        INSERT INTO job_categories (name, description, created_at)
        VALUES (?, ?, NOW())
        ON DUPLICATE KEY UPDATE description = VALUES(description);
      `, [cat.name, cat.description]);
      console.log(`  + Category verified: ${cat.name}`);
    } catch (err) {
      console.warn(`  ! Category error on '${cat.name}':`, err.message);
    }
  }

  // 4. Seed the 5 Construction Industry Manpower Requirements from India
  console.log('\n[4/4] Seeding 5 Construction Industry vacancies with exact figures from source image...');
  const constructionJobs = [
    {
      title: 'Mason - Block/Plaster',
      category: 'Mason - Block/Plaster',
      country: 'UAE',
      location: 'Dubai, UAE',
      vacancies: 150,
      basic_salary: '1500',
      compulsory_ot_salary: '200',
      salary: '1700',
      salary_currency: '', // No currency assumed per requirement
      working_hours: '10 hours per day (8 hours normal + 2 hours compulsory OT)',
      overtime_details: 'Overtime extra over 10 hours as per UAE labour laws. Compulsory OT: 2 hours (200).',
      accommodation_details: 'Shared accommodation provided by company',
      transportation_details: 'Transportation provided by company',
      experience: 'Experienced in Block and Plaster masonry work',
      qualification: 'Skilled Mason trade certificate / practical trade test passed',
      description: 'Urgent requirement for 150 Mason - Block/Plaster from India for prestigious UAE construction project.\n\n• Monthly Salary (8 hours): 1500\n• Compulsory OT (2 hours): 200\n• Total for 10 hours: 1700\n\nPreserves exact manpower specification from source recruitment document.',
      responsibilities: '• Execute block masonry, internal and external plastering work.\n• Read construction drawings and levels accurately.\n• Maintain high standards of workmanship and site safety compliance.\n• Work in coordination with civil site supervisors.',
      benefits: 'Overtime extra over 10 hours as per UAE labour laws.\nJoining tickets from India only.\nVisa provided by company.\nMedical insurance provided by company.\nShared accommodation provided by company.\nKitchen facility with gas provided by company.\nTransportation provided by company.\nWorking hours: 10 hours per day.\nWorking days: 26 days per month.\nWeekly off: 4 days per month.',
      deadline: '2026-12-31',
      status: 'published'
    },
    {
      title: 'Tile Mason',
      category: 'Tile Mason',
      country: 'UAE',
      location: 'Dubai, UAE',
      vacancies: 50,
      basic_salary: '1600',
      compulsory_ot_salary: '200',
      salary: '1800',
      salary_currency: '', // No currency assumed per requirement
      working_hours: '10 hours per day (8 hours normal + 2 hours compulsory OT)',
      overtime_details: 'Overtime extra over 10 hours as per UAE labour laws. Compulsory OT: 2 hours (200).',
      accommodation_details: 'Shared accommodation provided by company',
      transportation_details: 'Transportation provided by company',
      experience: 'Experienced in floor and wall tile fixing, ceramic and marble',
      qualification: 'Skilled Tile Mason trade certification / practical trade test passed',
      description: 'Urgent requirement for 50 Tile Masons from India for prestigious UAE commercial and residential developments.\n\n• Monthly Salary (8 hours): 1600\n• Compulsory OT (2 hours): 200\n• Total for 10 hours: 1800\n\nPreserves exact manpower specification from source recruitment document.',
      responsibilities: '• Cut, shape, and lay ceramic, porcelain, and marble tiles on floors and walls.\n• Prepare screed, adhesive mixing, and joint grouting.\n• Ensure surface level and alignment adhere to project specifications.\n• Follow site safety procedures.',
      benefits: 'Overtime extra over 10 hours as per UAE labour laws.\nJoining tickets from India only.\nVisa provided by company.\nMedical insurance provided by company.\nShared accommodation provided by company.\nKitchen facility with gas provided by company.\nTransportation provided by company.\nWorking hours: 10 hours per day.\nWorking days: 26 days per month.\nWeekly off: 4 days per month.',
      deadline: '2026-12-31',
      status: 'published'
    },
    {
      title: 'Steel Fixer',
      category: 'Steel Fixer',
      country: 'UAE',
      location: 'Dubai, UAE',
      vacancies: 100,
      basic_salary: '1400',
      compulsory_ot_salary: '200',
      salary: '1600',
      salary_currency: '', // No currency assumed per requirement
      working_hours: '10 hours per day (8 hours normal + 2 hours compulsory OT)',
      overtime_details: 'Overtime extra over 10 hours as per UAE labour laws. Compulsory OT: 2 hours (200).',
      accommodation_details: 'Shared accommodation provided by company',
      transportation_details: 'Transportation provided by company',
      experience: 'Experienced in rebar bending, cutting, and tying on civil structural projects',
      qualification: 'Skilled Steel Fixer trade experience / practical trade test passed',
      description: 'Urgent requirement for 100 Steel Fixers from India for major UAE infrastructure and building projects.\n\n• Monthly Salary (8 hours): 1400\n• Compulsory OT (2 hours): 200\n• Total for 10 hours: 1600\n\nPreserves exact manpower specification from source recruitment document.',
      responsibilities: '• Read bar bending schedules (BBS) and structural reinforcement drawings.\n• Cut and bend steel reinforcement bars using manual and mechanical benders.\n• Position and tie rebar cages for footings, columns, beams, and slabs.\n• Comply with site HSE guidelines.',
      benefits: 'Overtime extra over 10 hours as per UAE labour laws.\nJoining tickets from India only.\nVisa provided by company.\nMedical insurance provided by company.\nShared accommodation provided by company.\nKitchen facility with gas provided by company.\nTransportation provided by company.\nWorking hours: 10 hours per day.\nWorking days: 26 days per month.\nWeekly off: 4 days per month.',
      deadline: '2026-12-31',
      status: 'published'
    },
    {
      title: 'Shuttering Carpenter',
      category: 'Shuttering Carpenter',
      country: 'UAE',
      location: 'Dubai, UAE',
      vacancies: 150,
      basic_salary: '1400',
      compulsory_ot_salary: '200',
      salary: '1600',
      salary_currency: '', // No currency assumed per requirement
      working_hours: '10 hours per day (8 hours normal + 2 hours compulsory OT)',
      overtime_details: 'Overtime extra over 10 hours as per UAE labour laws. Compulsory OT: 2 hours (200).',
      accommodation_details: 'Shared accommodation provided by company',
      transportation_details: 'Transportation provided by company',
      experience: 'Experienced in formwork assembly and striking on structural civil projects',
      qualification: 'Skilled Shuttering Carpenter trade experience / practical trade test passed',
      description: 'Urgent requirement for 150 Shuttering Carpenters from India for high-rise and infrastructure developments in UAE.\n\n• Monthly Salary (8 hours): 1400\n• Compulsory OT (2 hours): 200\n• Total for 10 hours: 1600\n\nPreserves exact manpower specification from source recruitment document.',
      responsibilities: '• Construct, assemble, and align timber and metal formwork for foundations, columns, beams, and decks.\n• Ensure water tightness and dimensional accuracy of shuttering.\n• Safely strip and clean formwork after concrete curing.\n• Comply with safety standards.',
      benefits: 'Overtime extra over 10 hours as per UAE labour laws.\nJoining tickets from India only.\nVisa provided by company.\nMedical insurance provided by company.\nShared accommodation provided by company.\nKitchen facility with gas provided by company.\nTransportation provided by company.\nWorking hours: 10 hours per day.\nWorking days: 26 days per month.\nWeekly off: 4 days per month.',
      deadline: '2026-12-31',
      status: 'published'
    },
    {
      title: 'Scaffolder',
      category: 'Scaffolder',
      country: 'UAE',
      location: 'Dubai, UAE',
      vacancies: 100,
      basic_salary: '1600',
      compulsory_ot_salary: '200',
      salary: '1800',
      salary_currency: '', // No currency assumed per requirement
      working_hours: '10 hours per day (8 hours normal + 2 hours compulsory OT)',
      overtime_details: 'Overtime extra over 10 hours as per UAE labour laws. Compulsory OT: 2 hours (200).',
      accommodation_details: 'Shared accommodation provided by company',
      transportation_details: 'Transportation provided by company',
      experience: 'Experienced in cuplock, tube & coupler, and modular scaffolding erection',
      qualification: 'Certified Scaffolder / Scaffolding Trade Card / practical test passed',
      description: 'Urgent requirement for 100 Scaffolders from India for major UAE construction and industrial sites.\n\n• Monthly Salary (8 hours): 1600\n• Compulsory OT (2 hours): 200\n• Total for 10 hours: 1800\n\nPreserves exact manpower specification from source recruitment document.',
      responsibilities: '• Erect, modify, and dismantle system scaffolding and tube/coupler frameworks.\n• Install safety netting, toe boards, and guard rails.\n• Carry out scaffolding pre-use safety inspections.\n• Work safely at heights adhering strictly to UAE safety regulations.',
      benefits: 'Overtime extra over 10 hours as per UAE labour laws.\nJoining tickets from India only.\nVisa provided by company.\nMedical insurance provided by company.\nShared accommodation provided by company.\nKitchen facility with gas provided by company.\nTransportation provided by company.\nWorking hours: 10 hours per day.\nWorking days: 26 days per month.\nWeekly off: 4 days per month.',
      deadline: '2026-12-31',
      status: 'published'
    }
  ];

  for (const job of constructionJobs) {
    // Check if job already exists by title and country
    const existing = await query('SELECT id FROM jobs WHERE title = ? AND country = ? LIMIT 1;', [job.title, job.country]);
    if (existing.length > 0) {
      // Update existing record
      await query(`
        UPDATE jobs SET
          category = ?, location = ?, vacancies = ?, salary = ?, basic_salary = ?, compulsory_ot_salary = ?,
          salary_currency = ?, working_hours = ?, overtime_details = ?, accommodation_details = ?,
          transportation_details = ?, experience = ?, qualification = ?, description = ?,
          responsibilities = ?, benefits = ?, application_deadline = ?, status = ?, updated_at = NOW()
        WHERE id = ?;
      `, [
        job.category, job.location, job.vacancies, job.salary, job.basic_salary, job.compulsory_ot_salary,
        job.salary_currency, job.working_hours, job.overtime_details, job.accommodation_details,
        job.transportation_details, job.experience, job.qualification, job.description,
        job.responsibilities, job.benefits, job.deadline, job.status, existing[0].id
      ]);
      console.log(`  + Updated existing vacancy in TiDB: ${job.title} (Qty: ${job.vacancies}, Salary: ${job.salary}) [ID: ${existing[0].id}]`);
    } else {
      // Insert new record
      const result = await query(`
        INSERT INTO jobs (
          title, category, country, location, vacancies, salary, basic_salary, compulsory_ot_salary,
          salary_currency, working_hours, overtime_details, accommodation_details, transportation_details,
          experience, qualification, description, responsibilities, benefits, application_deadline, status,
          created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          NOW(), NOW()
        );
      `, [
        job.title, job.category, job.country, job.location, job.vacancies, job.salary, job.basic_salary, job.compulsory_ot_salary,
        job.salary_currency, job.working_hours, job.overtime_details, job.accommodation_details, job.transportation_details,
        job.experience, job.qualification, job.description, job.responsibilities, job.benefits, job.deadline, job.status
      ]);
      console.log(`  + Inserted new vacancy in TiDB: ${job.title} (Qty: ${job.vacancies}, Salary: ${job.salary}) [ID: ${result.insertId}]`);
    }
  }

  console.log('\n--- Migration & Seeding Completed Successfully! ---');
}

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].endsWith('migrate-job-fields-and-categories.js')) {
  runMigration()
    .then(() => pool.end())
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
