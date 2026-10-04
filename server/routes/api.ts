import { Router, Request, Response } from 'express';
import { db } from '../db.ts';
import { BusinessService } from '../services/businessService.ts';
import { CatalogService } from '../services/catalogService.ts';
import { BookingService } from '../services/bookingService.ts';
import { CustomerService } from '../services/customerService.ts';
import { TeamService } from '../services/teamService.ts';
import { ReportService } from '../services/reportService.ts';

export const apiRouter = Router();

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

// --- Customers & Reviews ---
apiRouter.get('/businesses/:id/customers', (req: Request, res: Response) => {
  res.json({ success: true, data: CustomerService.listCustomers(req.params.id) });
});

apiRouter.patch('/customers/:id/notes', (req: Request, res: Response) => {
  try {
    const updated = CustomerService.updateCustomerNotes(req.params.id, req.body.notes || '');
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
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
