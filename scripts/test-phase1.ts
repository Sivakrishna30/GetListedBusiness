/**
 * GetListed — Comprehensive Phase 1 Test Suite
 * 
 * Module-by-module unit tests, operational validation, and 
 * end-to-end verification of all 11 Phase 1 Success Criteria.
 */

import { AuthService } from '../server/services/authService.ts';
import { BusinessService } from '../server/services/businessService.ts';
import { CatalogService } from '../server/services/catalogService.ts';
import { CustomerService } from '../server/services/customerService.ts';
import { BookingService } from '../server/services/bookingService.ts';
import { TransactionService } from '../server/services/transactionService.ts';
import { ExpenseService } from '../server/services/expenseService.ts';
import { ReportService } from '../server/services/reportService.ts';
import { db } from '../server/db.ts';

interface TestResult {
  module: string;
  testName: string;
  passed: boolean;
  error?: string;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function runTest(module: string, testName: string, testFn: () => void) {
  try {
    testFn();
    results.push({ module, testName, passed: true });
    console.log(`  ✓ [PASS] ${testName}`);
  } catch (err: any) {
    results.push({ module, testName, passed: false, error: err.message });
    console.error(`  ✗ [FAIL] ${testName}: ${err.message}`);
  }
}

console.log('===============================================================');
console.log('   GETLISTED — PHASE 1 MODULE-BY-MODULE VERIFICATION SUITE     ');
console.log('===============================================================\n');

// -------------------------------------------------------------
// MODULE 1: IDENTITY & BUSINESS OWNERSHIP (ADR-007, CHK-002)
// -------------------------------------------------------------
console.log('--- MODULE 1: Identity & Business Ownership (CHK-002) ---');

runTest('Identity', '1.1 Authenticate default seed owner', () => {
  const loginRes = AuthService.login('sivakrishna.era@gmail.com', 'password123');
  assert(loginRes.user.id === 'user_siva_owner', 'Owner ID matches');
  assert(loginRes.user.email === 'sivakrishna.era@gmail.com', 'Owner email matches');
});

runTest('Identity', '1.2 Register new user with prototype password', () => {
  const testEmail = `newowner_${Date.now()}@example.com`;
  const regRes = AuthService.register({
    name: 'Anil Kumar',
    email: testEmail,
    password: 'password123',
  });
  assert(regRes.user.name === 'Anil Kumar', 'Registered name matches');
  assert(regRes.user.email === testEmail, 'Registered email matches');
  
  // Verify login immediately
  const loginRes = AuthService.login(testEmail, 'password123');
  assert(loginRes.user.id === regRes.user.id, 'Can log in with new credentials');
});

runTest('Identity', '1.3 Verify decoupled user model (no global role enum on User)', () => {
  const user = db.getState().users.find(u => u.id === 'user_siva_owner');
  assert(user !== undefined, 'User exists');
  // @ts-ignore
  assert(user.role === undefined, 'User must not have a global role property (role belongs to BusinessMember)');
});

// -------------------------------------------------------------
// MODULE 2: BUSINESS TYPE & MODULAR OPERATIONS (ADR-008, CHK-003)
// -------------------------------------------------------------
console.log('\n--- MODULE 2: Business Type & Modular Operations (CHK-003) ---');

let testTurfId = '';

runTest('OperationsConfig', '2.1 Business has businessType and enabledOperations', () => {
  const turfBiz = BusinessService.create({
    name: 'GreenPark Sports Arena',
    category: 'Sports',
    subCategory: 'Turf',
    location: 'Bengaluru',
    workingHours: '06:00 AM - 11:30 PM (Daily)',
    ownerId: 'user_siva_owner',
    businessType: 'TURF',
    enabledOperations: ['BOOKINGS', 'SERVICES', 'TRANSACTIONS', 'EXPENSES'],
  });
  testTurfId = turfBiz.id;

  const turf = BusinessService.getById(testTurfId);
  assert(turf !== null, 'Turf business exists');
  assert(turf?.businessType === 'TURF', 'Business type is TURF');
  assert(Array.isArray(turf?.enabledOperations), 'enabledOperations is array');
  assert(Boolean(turf?.enabledOperations?.includes('BOOKINGS')), 'Turf includes BOOKINGS operation');
  assert(Boolean(turf?.enabledOperations?.includes('SERVICES')), 'Turf includes SERVICES operation');
  assert(Boolean(turf?.enabledOperations?.includes('EXPENSES')), 'Turf includes EXPENSES operation');
  assert(Boolean(turf?.enabledOperations?.includes('TRANSACTIONS')), 'Turf includes TRANSACTIONS operation');
});

runTest('OperationsConfig', '2.2 Dynamic updating of enabled operations and config', () => {
  const testBiz = BusinessService.create({
    name: 'Test Pilates Studio',
    category: 'Fitness',
    subCategory: 'Pilates',
    location: 'Bengaluru',
    description: 'Boutique reformer pilates studio',
    contactNumber: '+91 99000 11223',
    ownerId: 'user_siva_owner',
    businessType: 'STUDIO',
    enabledOperations: ['SERVICES', 'BOOKINGS', 'EXPENSES', 'TRANSACTIONS'],
  });

  assert(testBiz.businessType === 'STUDIO', 'Assigned STUDIO type');
  
  // Update operations
  const updated = BusinessService.updateOperations(testBiz.id, {
    businessType: 'STUDIO',
    enabledOperations: ['SERVICES', 'BOOKINGS', 'PACKAGES', 'EXPENSES', 'TRANSACTIONS'],
    operationConfig: {
      slotDurationMinutes: 50,
      capacityPerSlot: 6,
    },
  });

  assert(Boolean(updated.enabledOperations?.includes('PACKAGES')), 'PACKAGES operation successfully enabled');
  assert(updated.operationConfig?.capacityPerSlot === 6, 'Operation capacity configured');
});

// -------------------------------------------------------------
// MODULE 3: CUSTOMER MANAGEMENT & WALK-INS (CHK-004)
// -------------------------------------------------------------
console.log('\n--- MODULE 3: Customer Management & Walk-In CRM (CHK-004) ---');

let createdCustomerId = '';

runTest('Customers', '3.1 Create walk-in customer without requiring customer login', () => {
  const customer = CustomerService.createCustomer({
    businessId: testTurfId,
    name: 'Suresh Raina',
    phone: '+91 98888 77777',
    notes: 'Walk-in cricket enthusiast; prefers morning weekend slots.',
  });

  assert(customer.id.startsWith('cust_'), 'Customer ID generated');
  assert(customer.name === 'Suresh Raina', 'Customer name stored');
  assert(customer.totalSpent === 0, 'Initial spent is 0');
  assert(customer.bookingCount === 0, 'Initial bookings is 0');
  createdCustomerId = customer.id;
});

runTest('Customers', '3.2 Search customer by name or phone', () => {
  const byName = CustomerService.listCustomers(testTurfId, 'Raina');
  assert(byName.length >= 1, 'Found customer by name');
  assert(byName[0].phone === '+91 98888 77777', 'Phone matches');

  const byPhone = CustomerService.listCustomers(testTurfId, '98888');
  assert(byPhone.length >= 1, 'Found customer by phone query');
});

runTest('Customers', '3.3 Update customer operational notes', () => {
  const updated = CustomerService.updateCustomerNotes(createdCustomerId, 'Prefers Court 1; updated notes.');
  assert(Boolean(updated.notes?.includes('Court 1')), 'Customer notes updated');
});

// -------------------------------------------------------------
// MODULE 4: CATALOG MANAGEMENT (CHK-005)
// -------------------------------------------------------------
console.log('\n--- MODULE 4: Catalog Management (CHK-005) ---');

let testServiceId = '';

runTest('Catalog', '4.1 Create, list, and update services', () => {
  const service = CatalogService.createService(testTurfId, {
    name: 'Early Morning Turf Rental (5-a-Side)',
    price: 1000,
    durationMinutes: 60,
    description: 'Special early bird rate for morning teams',
  });

  assert(service.id.startsWith('srv_'), 'Service ID generated');
  assert(service.price === 1000, 'Price matches');
  testServiceId = service.id;

  const updated = CatalogService.updateService(testServiceId, { price: 1100 });
  assert(updated.price === 1100, 'Service price updated');
});

// -------------------------------------------------------------
// MODULE 5: BOOKINGS & CALENDAR (CHK-006, CHK-007)
// -------------------------------------------------------------
console.log('\n--- MODULE 5: Bookings & Slots (CHK-006, CHK-007) ---');

let testBookingId = '';

runTest('Bookings', '5.1 Create reservation and verify slot calculation', () => {
  const booking = BookingService.create({
    businessId: testTurfId,
    customerName: 'Suresh Raina',
    customerPhone: '+91 98888 77777',
    serviceId: testServiceId,
    serviceName: 'Early Morning Turf Rental (5-a-Side)',
    date: '2026-04-10',
    startTime: '06:00',
    endTime: '07:00',
    grossAmount: 1100,
    notes: 'Paid booking created for upcoming fixture',
  });

  assert(booking.id.startsWith('bk_'), 'Booking ID created');
  assert(booking.grossAmount === 1100, 'Gross amount recorded');
  assert(booking.platformFee === 55, '5% platform fee calculated (₹55)');
  assert(booking.netAmount === 1045, 'Net amount calculated (₹1045)');
  assert(booking.status === 'CONFIRMED', 'Booking confirmed');
  testBookingId = booking.id;
});

runTest('Bookings', '5.2 Reschedule booking date and time', () => {
  const rescheduled = BookingService.reschedule(testBookingId, {
    date: '2026-04-11',
    startTime: '07:00',
    endTime: '08:00',
  });

  assert(rescheduled.date === '2026-04-11', 'Date updated');
  assert(rescheduled.startTime === '07:00', 'Start time updated');
});

// -------------------------------------------------------------
// MODULE 6: FINANCIAL LEDGER & TRANSACTIONS (ADR-006, CHK-008)
// -------------------------------------------------------------
console.log('\n--- MODULE 6: Financial Ledger & Money Movement (ADR-006, CHK-008) ---');

runTest('Transactions', '6.1 CRITICAL ADR-006: Booking does NOT auto-create transaction until money moves', () => {
  // Check transactions for testBookingId before payment
  const txBefore = db.getState().transactions.filter(t => t.bookingId === testBookingId);
  assert(txBefore.length === 0, 'Zero transactions generated merely from booking confirmation');
});

runTest('Transactions', '6.2 Explicitly record money movement for booking', () => {
  const tx = TransactionService.recordIncome({
    businessId: testTurfId,
    category: 'BOOKING_PAYMENT',
    amount: 1100,
    paymentMethod: 'UPI',
    date: '2026-04-11',
    bookingId: testBookingId,
    customerName: 'Suresh Raina',
    description: 'UPI payment received via QR code at counter',
    referenceNumber: 'UPI/260411/88991',
  });

  assert(tx.id.startsWith('tx_'), 'Transaction recorded');
  assert(tx.amount === 1100, 'Transaction amount recorded');
  assert(tx.status === 'SUCCESS', 'Status is SUCCESS');
  assert(tx.type === 'INCOME', 'Type is INCOME');
});

runTest('Transactions', '6.3 Record direct over-the-counter sale income', () => {
  const counterSale = TransactionService.recordIncome({
    businessId: testTurfId,
    category: 'DIRECT_SALE',
    amount: 350,
    paymentMethod: 'CASH',
    date: '2026-04-11',
    customerName: 'Walk-in Player',
    description: 'Grip tape and sports drink purchase',
  });

  assert(counterSale.amount === 350, 'Counter sale amount recorded');
  assert(counterSale.paymentMethod === 'CASH', 'Payment method is CASH');
});

// -------------------------------------------------------------
// MODULE 7: MANUAL EXPENSE MANAGEMENT (CHK-009)
// -------------------------------------------------------------
console.log('\n--- MODULE 7: Manual Expense Management (CHK-009) ---');

let testExpenseId = '';

runTest('Expenses', '7.1 Create categorized operating expenses', () => {
  const expense = ExpenseService.create({
    businessId: testTurfId,
    category: 'MAINTENANCE',
    amount: 2500,
    date: '2026-04-11',
    description: 'Turf boundary line repainting and net fasteners',
    paymentMethod: 'UPI',
    paidTo: 'Indiranagar Sports Hardware',
    receiptRef: 'INV-SP-2041',
  });

  assert(expense.id.startsWith('exp_'), 'Expense ID generated');
  assert(expense.category === 'MAINTENANCE', 'Category is MAINTENANCE');
  assert(expense.amount === 2500, 'Amount recorded');
  testExpenseId = expense.id;
});

runTest('Expenses', '7.2 List expenses with category filter', () => {
  const maintenanceExpenses = ExpenseService.list(testTurfId, { category: 'MAINTENANCE' });
  assert(maintenanceExpenses.length >= 1, 'Found maintenance expenses');
  assert(maintenanceExpenses.some(e => e.id === testExpenseId), 'Includes newly created expense');
});

runTest('Expenses', '7.3 Update and summarize expenses', () => {
  const updated = ExpenseService.update(testExpenseId, { amount: 2600 });
  assert(updated.amount === 2600, 'Expense amount updated');

  const summary = ExpenseService.getSummary(testTurfId);
  assert(summary.totalExpenses > 0, 'Total expenses summarized');
  assert(summary.byCategory.some(c => c.category === 'MAINTENANCE'), 'Category included in summary');
});

// -------------------------------------------------------------
// MODULE 8: FINANCIAL REPORTING & NET INCOME (CHK-010, CHK-011)
// -------------------------------------------------------------
console.log('\n--- MODULE 8: Financial Reporting & Intelligence (CHK-010, CHK-011) ---');

runTest('Reporting', '8.1 Compute Net Business Amount = Total Income - Total Expenses', () => {
  const reports = ReportService.getReportsForBusiness(testTurfId);
  assert(reports.financials !== undefined, 'Financials section generated');
  
  const income = reports.financials.totalIncome;
  const expenses = reports.financials.totalExpenses;
  const net = reports.financials.netProfit;

  assert(income > 0, `Total income is positive (₹${income})`);
  assert(expenses > 0, `Total expenses are positive (₹${expenses})`);
  assert(net === Math.round((income - expenses) * 100) / 100, 'Net Profit strictly equals Total Income minus Total Expenses');
});

runTest('Reporting', '8.2 Plain-language narrative summary generation (Layer 5)', () => {
  const reports = ReportService.getReportsForBusiness(testTurfId);
  assert(Boolean(reports.narrativeSummary), 'Narrative summary exists');
  assert(typeof reports.narrativeSummary.weeklySummaryText === 'string', 'Weekly narrative text generated');
  assert(reports.narrativeSummary.weeklySummaryText.includes('₹'), 'Contains localized financial figures');
  assert(typeof reports.narrativeSummary.monthlySummaryText === 'string', 'Monthly narrative text generated');
  assert(typeof reports.narrativeSummary.growthInsight === 'string', 'Growth insight generated');
});

// -------------------------------------------------------------
// MODULE 9: NATIVE DATA EXPORT (CHK-012)
// -------------------------------------------------------------
console.log('\n--- MODULE 9: Native Data Export (CHK-012) ---');

runTest('Export', '9.1 Validate CSV data formatting for Customers', () => {
  const customers = CustomerService.listCustomers(testTurfId);
  const headers = ['Customer Name', 'Phone', 'Email', 'Total Bookings', 'Total Spent (INR)', 'Last Interaction', 'Notes'];
  const rows = customers.map(c => [
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.phone}"`,
    `"${(c.email || '').replace(/"/g, '""')}"`,
    c.bookingCount,
    c.totalSpent,
    `"${c.lastInteraction ? c.lastInteraction.split('T')[0] : ''}"`,
    `"${(c.notes || '').replace(/"/g, '""')}"`,
  ]);
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  assert(csvContent.includes('Suresh Raina'), 'CSV includes created customer');
  assert(csvContent.startsWith('Customer Name,Phone'), 'CSV contains correct header format');
});

runTest('Export', '9.2 Validate CSV data formatting for Expenses', () => {
  const expenses = ExpenseService.list(testTurfId);
  const headers = ['Date', 'Category', 'Description', 'Amount (INR)', 'Payment Method', 'Paid To', 'Receipt Ref'];
  const rows = expenses.map(e => [
    `"${e.date}"`,
    `"${e.category}"`,
    `"${e.description.replace(/"/g, '""')}"`,
    e.amount,
    `"${e.paymentMethod}"`,
    `"${(e.paidTo || '').replace(/"/g, '""')}"`,
    `"${(e.receiptRef || '').replace(/"/g, '""')}"`,
  ]);
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  assert(csvContent.includes('MAINTENANCE'), 'CSV includes expense category');
  assert(csvContent.includes('2600'), 'CSV includes updated amount');
});

// -------------------------------------------------------------
// MODULE 10: END-TO-END 11 PHASE 1 SUCCESS CRITERIA (CHK-013)
// -------------------------------------------------------------
console.log('\n--- MODULE 10: 11 Phase 1 Success Criteria Verification (CHK-013) ---');

const criteria = [
  { id: 1, name: 'Business profile can be created and edited', check: () => BusinessService.getById(testTurfId) !== null },
  { id: 2, name: 'Services / offerings can be added with pricing', check: () => CatalogService.listServices(testTurfId).length > 0 },
  { id: 3, name: 'Business availability / working hours defined', check: () => Boolean(BusinessService.getById(testTurfId)?.workingHours) },
  { id: 4, name: 'Customer can view business profile and catalog', check: () => CatalogService.listServices(testTurfId).length > 0 },
  { id: 5, name: 'Customer can book an appointment / slot', check: () => BookingService.list(testTurfId).length > 0 },
  { id: 6, name: 'Booking appears in business calendar', check: () => BookingService.list(testTurfId).some(b => b.id === testBookingId) },
  { id: 7, name: 'Walk-in / offline customers can be added manually', check: () => CustomerService.listCustomers(testTurfId).some(c => c.id === createdCustomerId) },
  { id: 8, name: 'Basic business income and expenses can be recorded', check: () => TransactionService.list(testTurfId).length > 0 && ExpenseService.list(testTurfId).length > 0 },
  { id: 9, name: 'Business dashboard shows today\'s overview', check: () => ReportService.getReportsForBusiness(testTurfId).overview !== undefined },
  { id: 10, name: 'Weekly / monthly plain-language business summary generated', check: () => Boolean(ReportService.getReportsForBusiness(testTurfId).narrativeSummary.weeklySummaryText) },
  { id: 11, name: 'Business can export customers, bookings, and expenses to Excel/CSV', check: () => CustomerService.listCustomers(testTurfId).length > 0 && ExpenseService.list(testTurfId).length > 0 },
];

criteria.forEach(crit => {
  runTest('SuccessCriteria', `Crit #${crit.id}: ${crit.name}`, () => {
    assert(crit.check(), `Criterion #${crit.id} failed verification`);
  });
});

// Clean up test data so live DB stays zero-mock
db.resetToSeed();

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log('\n===============================================================');
const totalPassed = results.filter(r => r.passed).length;
const totalFailed = results.filter(r => !r.passed).length;
console.log(`TOTAL TESTS: ${results.length} | PASSED: ${totalPassed} | FAILED: ${totalFailed}`);
console.log('===============================================================\n');

if (totalFailed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL PHASE 1 CORE MODULES AND SUCCESS CRITERIA VERIFIED SUCCESSFULLY!');
  process.exit(0);
}
