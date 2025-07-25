import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), '.data', 'freightlynk.db');
const db = new Database(dbPath);

console.log('Starting user data migration...');

try {
  // Add user_id columns if they don't exist
  try {
    db.exec('ALTER TABLE purchase_orders ADD COLUMN user_id TEXT');
    console.log('Added user_id column to purchase_orders');
  } catch (e) {
    console.log('user_id column already exists in purchase_orders');
  }

  try {
    db.exec('ALTER TABLE po_details ADD COLUMN user_id TEXT');
    console.log('Added user_id column to po_details');
  } catch (e) {
    console.log('user_id column already exists in po_details');
  }

  // Get admin user ID for assignment
  const adminUser = db.prepare('SELECT id FROM users WHERE role = "admin" LIMIT 1').get() as any;
  
  if (adminUser) {
    console.log(`Found admin user: ${adminUser.id}`);
    
    // Assign existing purchase orders to admin user
    const updatePOs = db.prepare('UPDATE purchase_orders SET user_id = ? WHERE user_id IS NULL');
    const poResult = updatePOs.run(adminUser.id);
    console.log(`Updated ${poResult.changes} purchase orders with admin user_id`);
    
    // Assign existing po_details to admin user
    const updateDetails = db.prepare('UPDATE po_details SET user_id = ? WHERE user_id IS NULL');
    const detailsResult = updateDetails.run(adminUser.id);
    console.log(`Updated ${detailsResult.changes} po_details with admin user_id`);
    
  } else {
    console.log('No admin user found - existing data will remain unassigned');
  }

  // Add created_at and updated_at columns if they don't exist
  try {
    db.exec('ALTER TABLE purchase_orders ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP');
    db.exec('ALTER TABLE purchase_orders ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP');
    console.log('Added timestamp columns to purchase_orders');
  } catch (e) {
    console.log('Timestamp columns already exist in purchase_orders');
  }

  try {
    db.exec('ALTER TABLE po_details ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP');
    console.log('Added timestamp column to po_details');
  } catch (e) {
    console.log('Timestamp column already exists in po_details');
  }

  console.log('Migration completed successfully!');
  
  // Show summary
  const poCount = db.prepare('SELECT COUNT(*) as count FROM purchase_orders').get() as any;
  const detailCount = db.prepare('SELECT COUNT(*) as count FROM po_details').get() as any;
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
  
  console.log('\nDatabase Summary:');
  console.log(`- Users: ${userCount.count}`);
  console.log(`- Purchase Orders: ${poCount.count}`);
  console.log(`- PO Details: ${detailCount.count}`);

} catch (error) {
  console.error('Migration failed:', error);
} finally {
  db.close();
} 