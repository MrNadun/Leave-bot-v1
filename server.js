const express = require('express');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const leaveDBPath = path.join(__dirname, 'nexaDB', 'leave.json');

function loadLeaveDB() {
  const defaultDB = { fullLeaves: [], halfLeaves: [] };
  
  if (!fs.existsSync(leaveDBPath)) {
    fs.writeFileSync(leaveDBPath, JSON.stringify(defaultDB, null, 2));
    return defaultDB;
  }
  
  const content = fs.readFileSync(leaveDBPath, 'utf8');
  try {
    const parsed = JSON.parse(content || '{}');
    return {
      fullLeaves: Array.isArray(parsed.fullLeaves) ? parsed.fullLeaves : [],
      halfLeaves: Array.isArray(parsed.halfLeaves) ? parsed.halfLeaves : [],
    };
  } catch (err) {
    console.error('Invalid JSON in leave.json. Reinitializing...');
    fs.writeFileSync(leaveDBPath, JSON.stringify(defaultDB, null, 2));
    return defaultDB;
  }
}

function saveLeaveDB(db) {
  try {
    fs.writeFileSync(leaveDBPath, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

function getMonthlyLeaves(year, month) {
  const db = loadLeaveDB();
  const fullLeaves = db.fullLeaves.filter(leave => {
    if (!leave.date) return false;
    const dateParts = leave.date.split('.');
    if (dateParts.length !== 3) return false;
    return dateParts[0] == year && dateParts[1] == month;
  });
  
  const halfLeaves = db.halfLeaves.filter(leave => {
    if (!leave.requestedAt) return false;
    const date = new Date(leave.requestedAt);
    return date.getFullYear() == year && (date.getMonth() + 1) == month;
  });
  
  return { fullLeaves, halfLeaves };
}

app.get('/', (req, res) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  const year = parseInt(req.query.year) || currentYear;
  const month = parseInt(req.query.month) || currentMonth;
  
  const { fullLeaves, halfLeaves } = getMonthlyLeaves(year, month);
  const db = loadLeaveDB();
  
  const stats = {
    totalFull: db.fullLeaves.length,
    totalHalf: db.halfLeaves.length,
    approvedFull: db.fullLeaves.filter(l => l.status === 'approved').length,
    approvedHalf: db.halfLeaves.filter(l => l.status === 'approved').length,
    pendingFull: db.fullLeaves.filter(l => l.status === 'pending').length,
    pendingHalf: db.halfLeaves.filter(l => l.status === 'pending').length,
  };
  
  res.render('dashboard', {
    fullLeaves,
    halfLeaves,
    stats,
    year,
    month,
    currentYear,
    currentMonth,
  });
});

app.get('/api/leaves', (req, res) => {
  const db = loadLeaveDB();
  res.json(db);
});

app.post('/api/leaves/delete/:type', (req, res) => {
  const { type } = req.params;
  const { user, date, time } = req.body;
  const db = loadLeaveDB();
  
  if (type === 'full') {
    const index = db.fullLeaves.findIndex(leave => 
      leave.user === user && leave.date === date
    );
    if (index !== -1) {
      db.fullLeaves.splice(index, 1);
      saveLeaveDB(db);
      res.json({ success: true, message: 'Full leave deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Leave not found' });
    }
  } else if (type === 'half') {
    const index = db.halfLeaves.findIndex(leave => 
      leave.user === user && leave.time === time
    );
    if (index !== -1) {
      db.halfLeaves.splice(index, 1);
      saveLeaveDB(db);
      res.json({ success: true, message: 'Half leave deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Leave not found' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid leave type' });
  }
});

app.get('/download-pdf', (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  
  const { fullLeaves, halfLeaves } = getMonthlyLeaves(year, month);
  
  const doc = new PDFDocument({ margin: 50 });
  
  const filename = `Leave_Report_${year}_${month.toString().padStart(2, '0')}.pdf`;
  res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-type', 'application/pdf');
  
  doc.pipe(res);
  
  doc.fontSize(20).text('Leave Management Report', { align: 'center' });
  doc.fontSize(14).text(`Month: ${month}/${year}`, { align: 'center' });
  doc.moveDown(2);
  
  doc.fontSize(16).text('Full Day Leaves', { underline: true });
  doc.moveDown(0.5);
  
  if (fullLeaves.length === 0) {
    doc.fontSize(12).text('No full day leaves recorded for this month.');
  } else {
    fullLeaves.forEach((leave, index) => {
      doc.fontSize(12);
      doc.text(`${index + 1}. Name: ${leave.name || 'Unknown'}`);
      doc.text(`   Date: ${leave.date || 'N/A'}`);
      doc.text(`   Status: ${leave.status || 'pending'}`);
      doc.text(`   Phone: ${leave.user ? leave.user.split('@')[0] : 'N/A'}`);
      if (leave.requestedAt) {
        doc.text(`   Requested: ${new Date(leave.requestedAt).toLocaleString()}`);
      }
      if (leave.status === 'approved' && leave.approvedAt) {
        doc.text(`   Approved: ${new Date(leave.approvedAt).toLocaleString()}`);
      }
      if (leave.status === 'rejected' && leave.rejectedAt) {
        doc.text(`   Rejected: ${new Date(leave.rejectedAt).toLocaleString()}`);
      }
      doc.moveDown(1);
    });
  }
  
  doc.moveDown(2);
  doc.fontSize(16).text('Half Day Leaves', { underline: true });
  doc.moveDown(0.5);
  
  if (halfLeaves.length === 0) {
    doc.fontSize(12).text('No half day leaves recorded for this month.');
  } else {
    halfLeaves.forEach((leave, index) => {
      doc.fontSize(12);
      doc.text(`${index + 1}. Name: ${leave.name || 'Unknown'}`);
      doc.text(`   Time: ${leave.time || 'N/A'}`);
      doc.text(`   Status: ${leave.status || 'pending'}`);
      doc.text(`   Phone: ${leave.user ? leave.user.split('@')[0] : 'N/A'}`);
      if (leave.requestedAt) {
        doc.text(`   Requested: ${new Date(leave.requestedAt).toLocaleString()}`);
      }
      if (leave.status === 'approved' && leave.approvedAt) {
        doc.text(`   Approved: ${new Date(leave.approvedAt).toLocaleString()}`);
      }
      if (leave.status === 'rejected' && leave.rejectedAt) {
        doc.text(`   Rejected: ${new Date(leave.rejectedAt).toLocaleString()}`);
      }
      doc.moveDown(1);
    });
  }
  
  doc.moveDown(2);
  doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.text('© BuyMore Technical Team', { align: 'center' });
  
  doc.end();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Leave Management Dashboard running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Access the admin panel at http://localhost:${PORT}`);
});
