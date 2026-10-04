import { Router, Request, Response } from 'express';
import { db } from '../db.ts';
import { BusinessService } from '../services/businessService.ts';
import { CatalogService } from '../services/catalogService.ts';
import { BookingService } from '../services/bookingService.ts';
import { CustomerService } from '../services/customerService.ts';
import { TeamService } from '../services/teamService.ts';
import { ReportService } from '../services/reportService.ts';
import { AuthService } from '../services/authService.ts';
import { TransactionService } from '../services/transactionService.ts';
import { ExpenseService } from '../services/expenseService.ts';

export const apiRouter = Router();

// --- Authentication (Phase 1 Prototype: Email + Password) ---
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = AuthService.login(email, password);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(401).json({ success: false, error: err.message || 'Login failed' });
  }
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const result = AuthService.register({ name, email, password });
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Registration failed' });
  }
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_siva_owner';
  const session = AuthService.getMe(userId);
  if (!session) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: session });
});

apiRouter.get('/users/:userId/businesses', (req: Request, res: Response) => {
  res.json({ success: true, data: AuthService.getUserBusinesses(req.params.userId) });
});

// --- Categories ---
apiRouter.get('/categories', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getState().categories });
});

// --- Businesses Discovery & Management ---
apiRouter.get('/businesses', (req: Request, res: Response) => {
  try {
    const { search, category, subCategory, location } = req.query;
    const businesses = BusinessService.list({
      search: typeof search === 'string' ? search : undefined,
      category: typeof category === 'string' ? category : undefined,
      subCategory: typeof subCategory === 'string' ? subCategory : undefined,
      location: typeof location === 'string' ? location : undefined,
    });
    res.json({ success: true, count: businesses.length, data: businesses });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to list businesses' });
  }
});

apiRouter.get('/businesses/:id', (req: Request, res: Response) => {
  try {
    const business = BusinessService.getById(req.params.id);
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    const services = CatalogService.listServices(business.id);
    const products = CatalogService.listProducts(business.id);
    const packages = CatalogService.listPackages(business.id);
    const memberships = CatalogService.listMemberships(business.id);
    const events = CatalogService.listEvents(business.id);
    const reviews = CustomerService.listReviews(business.id);

    res.json({
      success: true,
      data: {
        ...business,
        services,
        products,
        packages,
        memberships,
        events,
        reviews,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch business' });
  }
});

apiRouter.post('/businesses', (req: Request, res: Response) => {
  try {
    const newBiz = BusinessService.create(req.body);
    res.status(201).json({ success: true, data: newBiz });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Failed to create business' });
  }
});

apiRouter.put('/businesses/:id', (req: Request, res: Response) => {
  try {
    const updated = BusinessService.update(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Failed to update business' });
  }
});

apiRouter.delete('/businesses/:id', (req: Request, res: Response) => {
  try {
    BusinessService.archive(req.params.id);
    res.json({ success: true, message: 'Business archived successfully' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Failed to archive business' });
  }
});

apiRouter.patch('/businesses/:id/verification', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!['UNVERIFIED', 'PENDING', 'VERIFIED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid verification status' });
    }
    const updated = BusinessService.updateVerification(req.params.id, status);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.patch('/businesses/:id/plan', (req: Request, res: Response) => {
  try {
    const { plan } = req.body;
    if (!['FREE', 'PRO'].includes(plan)) {
      return res.status(400).json({ success: false, error: 'Invalid plan' });
    }
    const updated = BusinessService.updatePlan(req.params.id, plan);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.patch('/businesses/:id/sponsored', (req: Request, res: Response) => {
  try {
    const { enabled } = req.body;
    const updated = BusinessService.updateSponsored(req.params.id, Boolean(enabled));
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- Services ---
apiRouter.get('/businesses/:id/services', (req: Request, res: Response) => {
  res.json({ success: true, data: CatalogService.listServices(req.params.id) });
});

apiRouter.post('/businesses/:id/services', (req: Request, res: Response) => {
  try {
    const service = CatalogService.createService(req.params.id, req.body);
    res.status(201).json({ success: true, data: service });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.put('/services/:id', (req: Request, res: Response) => {
  try {
    const updated = CatalogService.updateService(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/services/:id', (req: Request, res: Response) => {
  try {
    CatalogService.archiveService(req.params.id);
    res.json({ success: true, message: 'Service archived' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- Products ---
apiRouter.get('/businesses/:id/products', (req: Request, res: Response) => {
  res.json({ success: true, data: CatalogService.listProducts(req.params.id) });
});

apiRouter.post('/businesses/:id/products', (req: Request, res: Response) => {
  try {
    const product = CatalogService.createProduct(req.params.id, req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.put('/products/:id', (req: Request, res: Response) => {
  try {
    const updated = CatalogService.updateProduct(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/products/:id', (req: Request, res: Response) => {
  try {
    CatalogService.archiveProduct(req.params.id);
    res.json({ success: true, message: 'Product archived' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- Packages ---
apiRouter.get('/businesses/:id/packages', (req: Request, res: Response) => {
  res.json({ success: true, data: CatalogService.listPackages(req.params.id) });
});

apiRouter.post('/businesses/:id/packages', (req: Request, res: Response) => {
  try {
    const pkg = CatalogService.createPackage(req.params.id, req.body);
    res.status(201).json({ success: true, data: pkg });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.put('/packages/:id', (req: Request, res: Response) => {
  try {
    const updated = CatalogService.updatePackage(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/packages/:id', (req: Request, res: Response) => {
  try {
    CatalogService.archivePackage(req.params.id);
    res.json({ success: true, message: 'Package archived' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- Memberships ---
apiRouter.get('/businesses/:id/memberships', (req: Request, res: Response) => {
  res.json({ success: true, data: CatalogService.listMemberships(req.params.id) });
});

apiRouter.post('/businesses/:id/memberships', (req: Request, res: Response) => {
  try {
    const membership = CatalogService.createMembership(req.params.id, req.body);
    res.status(201).json({ success: true, data: membership });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.put('/memberships/:id', (req: Request, res: Response) => {
  try {
    const updated = CatalogService.updateMembership(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.get('/businesses/:id/enrollments', (req: Request, res: Response) => {
  res.json({ success: true, data: CatalogService.listEnrollments(req.params.id) });
});

apiRouter.post('/businesses/:id/enrollments', (req: Request, res: Response) => {
  try {
    const enrollment = CatalogService.enrollMembership(req.params.id, req.body);
    res.status(201).json({ success: true, data: enrollment });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- Events ---
apiRouter.get('/businesses/:id/events', (req: Request, res: Response) => {
  res.json({ success: true, data: CatalogService.listEvents(req.params.id) });
});

apiRouter.post('/businesses/:id/events', (req: Request, res: Response) => {
  try {
    const event = CatalogService.createEvent(req.params.id, req.body);
    res.status(201).json({ success: true, data: event });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.put('/events/:id', (req: Request, res: Response) => {
  try {
    const updated = CatalogService.updateEvent(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/events/:id', (req: Request, res: Response) => {
  try {
    CatalogService.archiveEvent(req.params.id);
    res.json({ success: true, message: 'Event archived' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- Bookings & Availability ---
apiRouter.get('/customer/bookings', (req: Request, res: Response) => {
  const { phone } = req.query;
  if (!phone || typeof phone !== 'string') {
    return res.json({ success: true, data: [] });
  }
  const list = BookingService.listByCustomerPhone(phone);
  res.json({ success: true, data: list });
});

apiRouter.get('/businesses/:id/bookings', (req: Request, res: Response) => {
  const { date, status } = req.query;
  const list = BookingService.list(req.params.id, {
    date: typeof date === 'string' ? date : undefined,
    status: typeof status === 'string' ? (status as any) : undefined,
  });
  res.json({ success: true, data: list });
});

apiRouter.post('/bookings', (req: Request, res: Response) => {
  try {
    const booking = BookingService.create(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.get('/bookings/:id', (req: Request, res: Response) => {
  const booking = BookingService.getById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
  res.json({ success: true, data: booking });
});

apiRouter.patch('/bookings/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updated = BookingService.updateStatus(req.params.id, status);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.patch('/bookings/:id/reschedule', (req: Request, res: Response) => {
  try {
    const { date, startTime, endTime } = req.body;
    const updated = BookingService.reschedule(req.params.id, date, startTime, endTime);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- Business Operations Configuration (ADR-008) ---
apiRouter.patch('/businesses/:id/operations', (req: Request, res: Response) => {
  try {
    const { enabledOperations, operationConfig, businessType } = req.body;
    const updated = BusinessService.updateOperations(req.params.id, {
      enabledOperations,
      operationConfig,
      businessType,
    });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- Customers & Reviews ---
apiRouter.get('/businesses/:id/customers', (req: Request, res: Response) => {
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  res.json({ success: true, data: CustomerService.listCustomers(req.params.id, search) });
});

apiRouter.post('/businesses/:id/customers', (req: Request, res: Response) => {
  try {
    const customer = CustomerService.createCustomer({
      businessId: req.params.id,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      notes: req.body.notes,
    });
    res.status(201).json({ success: true, data: customer });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.patch('/customers/:id/notes', (req: Request, res: Response) => {
  try {
    const updated = CustomerService.updateCustomerNotes(req.params.id, req.body.notes || '');
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- Transactions (ADR-006: Money Movement Ledger) ---
apiRouter.get('/businesses/:id/transactions', (req: Request, res: Response) => {
  const { type, date, status } = req.query;
  const list = TransactionService.list(req.params.id, {
    type: typeof type === 'string' ? (type as any) : undefined,
    date: typeof date === 'string' ? date : undefined,
    status: typeof status === 'string' ? (status as any) : undefined,
  });
  res.json({ success: true, data: list });
});

apiRouter.post('/businesses/:id/transactions', (req: Request, res: Response) => {
  try {
    const tx = TransactionService.recordIncome({
      businessId: req.params.id,
      category: req.body.category,
      amount: Number(req.body.amount),
      paymentMethod: req.body.paymentMethod,
      date: req.body.date,
      bookingId: req.body.bookingId,
      customerId: req.body.customerId,
      customerName: req.body.customerName,
      description: req.body.description,
      referenceNumber: req.body.referenceNumber,
    });
    res.status(201).json({ success: true, data: tx });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.get('/businesses/:id/transactions/summary', (req: Request, res: Response) => {
  res.json({ success: true, data: TransactionService.getSummary(req.params.id) });
});

// --- Expenses (Phase 1 Manual Expense Management) ---
apiRouter.get('/businesses/:id/expenses', (req: Request, res: Response) => {
  const { category, date, startDate, endDate } = req.query;
  const list = ExpenseService.list(req.params.id, {
    category: typeof category === 'string' ? (category as any) : undefined,
    date: typeof date === 'string' ? date : undefined,
    startDate: typeof startDate === 'string' ? startDate : undefined,
    endDate: typeof endDate === 'string' ? endDate : undefined,
  });
  res.json({ success: true, data: list });
});

apiRouter.post('/businesses/:id/expenses', (req: Request, res: Response) => {
  try {
    const expense = ExpenseService.create({
      businessId: req.params.id,
      category: req.body.category,
      amount: Number(req.body.amount),
      date: req.body.date,
      description: req.body.description,
      paymentMethod: req.body.paymentMethod,
      paidTo: req.body.paidTo,
      receiptRef: req.body.receiptRef,
    });
    res.status(201).json({ success: true, data: expense });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.put('/expenses/:id', (req: Request, res: Response) => {
  try {
    const updated = ExpenseService.update(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/expenses/:id', (req: Request, res: Response) => {
  try {
    ExpenseService.delete(req.params.id);
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.get('/businesses/:id/expenses/summary', (req: Request, res: Response) => {
  res.json({ success: true, data: ExpenseService.getSummary(req.params.id) });
});

apiRouter.get('/businesses/:id/reviews', (req: Request, res: Response) => {
  res.json({ success: true, data: CustomerService.listReviews(req.params.id) });
});

apiRouter.post('/businesses/:id/reviews', (req: Request, res: Response) => {
  try {
    const review = CustomerService.createReview({
      businessId: req.params.id,
      customerName: req.body.customerName,
      rating: req.body.rating,
      review: req.body.review,
      bookingId: req.body.bookingId,
    });
    res.status(201).json({ success: true, data: review });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- Team Management ---
apiRouter.get('/businesses/:id/team', (req: Request, res: Response) => {
  res.json({ success: true, data: TeamService.list(req.params.id) });
});

apiRouter.post('/businesses/:id/team', (req: Request, res: Response) => {
  try {
    const member = TeamService.create(req.params.id, req.body);
    res.status(201).json({ success: true, data: member });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.put('/team/:id', (req: Request, res: Response) => {
  try {
    const updated = TeamService.update(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/team/:id', (req: Request, res: Response) => {
  try {
    const updated = TeamService.deactivate(req.params.id);
    res.json({ success: true, data: updated, message: 'Team member deactivated' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- Reports & Insights ---
apiRouter.get('/businesses/:id/reports', (req: Request, res: Response) => {
  try {
    const reports = ReportService.getReportsForBusiness(req.params.id);
    res.json({ success: true, data: reports });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Notifications Architecture ---
apiRouter.get('/businesses/:id/notifications', (req: Request, res: Response) => {
  const notifs = db.getState().notifications.filter(n => n.businessId === req.params.id);
  res.json({ success: true, data: notifs });
});

// --- System reset to seed ---
apiRouter.post('/system/reset', (_req: Request, res: Response) => {
  const freshState = db.resetToSeed();
  res.json({ success: true, message: 'Database reset to default seed', data: freshState });
});
