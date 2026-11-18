const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 1. Test Connection Route
app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello Ananya! React and Node.js connected successfully!",
  });
});

// 2. About Page Data Route
app.get("/api/about", (req, res) => {
  res.json({
    timeline: [
      { year: "2010", title: "Skyline Founded", desc: "Started with a single classroom and a big dream of building aviators." },
      { year: "2014", title: "CAAB Approval", desc: "Received official approval for professional aviation training programs." },
      { year: "2018", title: "Flight Simulator Lab", desc: "Launched a full-motion simulator lab for real cockpit experience." },
      { year: "2022", title: "Airline Partnerships", desc: "Signed hiring partnerships with national and international airlines." },
      { year: "2026", title: "New Training Campus", desc: "Opened an expanded campus with advanced labs and a modern hangar." },
    ],
    team: [
      { name: "Capt. Rahim Chowdhury", role: "Chief Flight Instructor", exp: "22 yrs experience" },
      { name: "Nusrat Jahan", role: "Head of Cabin Crew Training", exp: "14 yrs experience" },
      { name: "Dr. Arif Hossain", role: "Aviation Management Director", exp: "18 yrs experience" },
    ],
    accreditations: [
      { icon: "certificate", title: "CAAB Approved", desc: "Recognised by the Civil Aviation Authority of Bangladesh." },
      { icon: "globe", title: "ICAO Aligned Curriculum", desc: "Syllabus follows international aviation training standards." },
      { icon: "university", title: "Industry Affiliations", desc: "Academic and training links with aviation bodies and airlines." },
      { icon: "award", title: "Safety Excellence", desc: "Consistent safety record across all flight and ground training." },
    ],
  });
});

// 3. Courses Page Data Route
app.get("/api/courses", (req, res) => {
  res.json({
    categories: [
      { id: "all", name: "All Courses", icon: "🎓" },
      { id: "pilot", name: "Pilot Training", icon: "✈️" },
      { id: "cabin", name: "Cabin Crew", icon: "👨‍✈️" },
      { id: "management", name: "Aviation Management", icon: "📊" },
      { id: "maintenance", name: "Aircraft Maintenance", icon: "🔧" }
    ],
    courses: [
      {
        id: 1,
        category: "pilot",
        title: "Commercial Pilot License (CPL)",
        duration: "18 Months",
        level: "Advanced",
        price: "$45,000",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
        description: "Complete commercial pilot training with multi-engine rating and instrument certification.",
        features: [
          "200+ Flight Hours",
          "Multi-Engine Rating",
          "Instrument Rating",
          "CPL Theory Classes",
          "Simulator Training",
          "Airline Placement Support"
        ],
        highlights: ["CAAB Approved", "International Standard", "Job Guarantee"],
        color: "from-blue-600 to-cyan-400"
      },
      {
        id: 2,
        category: "pilot",
        title: "Private Pilot License (PPL)",
        duration: "6 Months",
        level: "Beginner",
        price: "$12,000",
        image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80", // Small plane
        description: "Start your aviation journey with private pilot training for recreational flying.",
        features: [
          "40+ Flight Hours",
          "Solo Flight Training",
          "Navigation Skills",
          "Weather Theory",
          "Radio Communication",
          "PPL License Exam Prep"
        ],
        highlights: ["Weekend Classes", "Flexible Schedule", "Experienced Instructors"],
        color: "from-purple-600 to-pink-400"
      },
      {
        id: 3,
        category: "cabin",
        title: "Cabin Crew Training",
        duration: "4 Months",
        level: "Beginner",
        price: "$3,500",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
        description: "Professional cabin crew training with airline recruitment preparation.",
        features: [
          "Safety & Emergency Procedures",
          "First Aid & Medical Training",
          "Customer Service Excellence",
          "Grooming & Personality Development",
          "In-flight Service Training",
          "Interview Preparation"
        ],
        highlights: ["Airline Tie-ups", "100% Placement", "International Airlines"],
        color: "from-pink-600 to-rose-400"
      },
      {
        id: 4,
        category: "management",
        title: "Aviation Management Diploma",
        duration: "12 Months",
        level: "Intermediate",
        price: "$8,000",
        image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800",
        description: "Comprehensive aviation management program covering airport and airline operations.",
        features: [
          "Airport Operations Management",
          "Airline Business Management",
          "Aviation Safety & Security",
          "Cargo & Logistics",
          "Revenue Management",
          "Industry Internship"
        ],
        highlights: ["Industry Experts", "Live Projects", "Global Recognition"],
        color: "from-emerald-600 to-teal-400"
      },
      {
        id: 5,
        category: "maintenance",
        title: "Aircraft Maintenance Engineering",
        duration: "24 Months",
        level: "Advanced",
        price: "$18,000",
        image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800",
        description: "Licensed aircraft maintenance engineer training with hands-on workshop experience.",
        features: [
          "Aircraft Systems & Structures",
          "Engine Maintenance",
          "Avionics & Electrical",
          "Hydraulics & Pneumatics",
          "Workshop Practice",
          "AME License Preparation"
        ],
        highlights: ["DGCA Approved", "Workshop Access", "Certification Exam"],
        color: "from-orange-600 to-amber-400"
      },
      {
        id: 6,
        category: "pilot",
        title: "Instrument Rating (IR)",
        duration: "3 Months",
        level: "Advanced",
        price: "$8,500",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
        description: "Advanced instrument flying training for all-weather operations.",
        features: [
          "40+ Instrument Hours",
          "Advanced Navigation",
          "IFR Procedures",
          "Simulator Sessions",
          "Weather Analysis",
          "IR Flight Test Prep"
        ],
        highlights: ["Full Motion Sim", "Expert Instructors", "Fast Track"],
        color: "from-indigo-600 to-violet-400"
      }
    ]
  });
});

// 4. Training & Facilities Route
app.get("/api/training", (req, res) => {
  res.json({
    stats: [
      { value: 12, suffix: "+", label: "Training Aircraft" },
      { value: 5000, suffix: "+", label: "Flight Hours Logged" },
      { value: 98, suffix: "%", label: "Pass Rate" },
      { value: 40, suffix: "+", label: "Expert Instructors" },
    ],
    categories: [
      { id: "all", name: "All Facilities" },
      { id: "flight", name: "Flight" },
      { id: "ground", name: "Ground School" },
      { id: "cabin", name: "Cabin Crew" },
      { id: "technical", name: "Technical" },
    ],
    facilities: [
      {
        id: 1,
        category: "flight",
        tag: "Flight Training",
        title: "Full-Motion Flight Simulator",
        description: "Practise real cockpit procedures, emergencies and all-weather landings in a safe, realistic environment.",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=80",
        points: ["Full-motion cockpit", "Day, night and storm scenarios", "Instructor control station", "Instrument rating practice"],
      },
      {
        id: 2,
        category: "flight",
        tag: "Flight Training",
        title: "Modern Training Aircraft Fleet",
        description: "A well-maintained fleet of single and multi-engine aircraft for hands-on flying experience.",
        image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=80",
        points: ["Single and multi-engine aircraft", "Glass cockpit avionics", "Daily safety inspections", "Solo and dual flying"],
      },
      {
        id: 3,
        category: "ground",
        tag: "Ground School",
        title: "Smart Aviation Classrooms",
        description: "Interactive classrooms covering navigation, meteorology, air law and aircraft systems.",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=80",
        points: ["Digital smart boards", "Small batch sizes", "Weekly mock tests", "Recorded lecture access"],
      },
      {
        id: 4,
        category: "cabin",
        tag: "Cabin Crew",
        title: "Mock Cabin Trainer",
        description: "A real aircraft cabin replica to practise service, safety drills and emergency evacuation.",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900&q=80",
        points: ["Real cabin layout", "Evacuation drills", "First aid practice", "In-flight service training"],
      },
      {
        id: 5,
        category: "ground",
        tag: "Management",
        title: "Airport Operations Lab",
        description: "Learn check-in, ground handling, cargo and airline operations through live project work.",
        image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=900&q=80",
        points: ["Operations software", "Live case studies", "Industry guest sessions", "Internship support"],
      },
      {
        id: 6,
        category: "technical",
        tag: "Technical",
        title: "Hangar & Maintenance Workshop",
        description: "Hands-on workshop where students work on real engines, avionics and aircraft structures.",
        image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=900&q=80",
        points: ["Engine test bench", "Avionics workshop", "Hydraulics practice", "Licensed engineer guidance"],
      },
    ],
    phases: [
      { step: "01", title: "Ground Foundation", desc: "Theory, navigation, weather and air law with weekly assessments.", duration: "Month 1-2" },
      { step: "02", title: "Simulator Practice", desc: "Learn cockpit flow, radio calls and emergencies on the simulator.", duration: "Month 3-4" },
      { step: "03", title: "Real Flight Hours", desc: "Dual and solo flying with certified instructors on our fleet.", duration: "Month 5-12" },
      { step: "04", title: "License & Placement", desc: "Final check ride, license exam and airline interview support.", duration: "Month 13+" },
    ],
    safety: [
      { icon: "🛡️", title: "Safety First Culture", desc: "Every flight starts with a full briefing and checklist." },
      { icon: "🩺", title: "On-site Medical Support", desc: "Trained first-aid team and tie-up with nearby hospitals." },
      { icon: "🔍", title: "Daily Aircraft Checks", desc: "Licensed engineers inspect each aircraft before take-off." },
      { icon: "📡", title: "Live Flight Monitoring", desc: "Instructors track every training flight in real time." },
    ],
  });
});

// 5. Gallery Route
const galleryData = {
  stats: [
    { value: "12+", label: "Aircraft" },
    { value: "500+", label: "Cadets" },
    { value: "98%", label: "Pass Rate" },
    { value: "15+", label: "Years" },
  ],
  categories: [
    { id: "all", name: "All", icon: "🌍" },
    { id: "aircraft", name: "Aircraft", icon: "✈️" },
    { id: "simulator", name: "Simulator", icon: "🎮" },
    { id: "cabin", name: "Cabin Crew", icon: "👨‍✈️" },
    { id: "campus", name: "Campus", icon: "🏫" },
    { id: "events", name: "Events", icon: "🎓" },
  ],
  photos: [
    { id: 1, category: "aircraft", title: "Morning Take-off", desc: "Our training aircraft leaving the runway at sunrise.", image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=80" },
    { id: 2, category: "simulator", title: "Full-Motion Simulator", desc: "Cadets practising all-weather landings in the sim lab.", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=80" },
    { id: 3, category: "cabin", title: "Cabin Crew Drill", desc: "Emergency evacuation practice in the mock cabin.", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900&q=80" },
    { id: 4, category: "campus", title: "Smart Classrooms", desc: "Interactive ground school with digital boards.", image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=900&q=80" },
    { id: 5, category: "aircraft", title: "Hangar Maintenance", desc: "Licensed engineers inspecting engines before every flight.", image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=900&q=80" },
    { id: 6, category: "events", title: "Graduation Day", desc: "Proud cadets receiving their wings.", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=80" },
    { id: 7, category: "aircraft", title: "Above the Clouds", desc: "Solo cross-country flight training at altitude.", image: "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=900&q=80" },
    { id: 8, category: "campus", title: "Runway View", desc: "Our campus overlooks a live training runway.", image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=900&q=80" },
    { id: 9, category: "simulator", title: "Cockpit Procedures", desc: "Learning checklists and radio calls step by step.", image: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&q=80" },
    { id: 10, category: "cabin", title: "In-flight Service", desc: "Grooming and service excellence training.", image: "https://images.unsplash.com/photo-1520437358207-323b43b50729?w=900&q=80" },
    { id: 11, category: "events", title: "Airline Hiring Day", desc: "Partner airlines interviewing our final-year cadets.", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900&q=80" },
    { id: 12, category: "events", title: "Open House", desc: "Families visiting the hangar and simulator lab.", image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=900&q=80" },
  ],
};

// Optional filter: /api/gallery?category=aircraft
app.get("/api/gallery", (req, res) => {
  const { category } = req.query;
  const photos =
    category && category !== "all"
      ? galleryData.photos.filter((p) => p.category === category)
      : galleryData.photos;

  res.json({ ...galleryData, photos });
});

// 6. Reviews (in-memory data; resets when the server restarts)
const reviewCategories = [
  { id: "all", name: "All Stories" },
  { id: "pilot", name: "Pilot Training" },
  { id: "cabin", name: "Cabin Crew" },
  { id: "management", name: "Management" },
  { id: "maintenance", name: "Maintenance" },
];

let reviews = [
  { id: 1, name: "Tanvir Ahmed", course: "Commercial Pilot License (CPL)", category: "pilot", rating: 5, date: "2026-09-18", likes: 48, featured: true, verified: true,
    message: "The full-motion simulator prepared me for real storms better than I ever imagined. My first solo cross-country felt calm because the instructors drilled every checklist until it became instinct.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80" },
  { id: 2, name: "Sadia Rahman", course: "Cabin Crew Training", category: "cabin", rating: 5, date: "2026-09-02", likes: 36, featured: true, verified: true,
    message: "The mock cabin made evacuation drills feel real. Mock interviews gave me the confidence to get through the airline recruitment day on my first attempt.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80" },
  { id: 3, name: "Imran Hossain", course: "Aircraft Maintenance Engineering", category: "maintenance", rating: 4, date: "2026-08-21", likes: 22, featured: true, verified: true,
    message: "Working on real engines in the hangar workshop was the best part. The licensed engineers explained every system patiently and the workshop is well equipped.",
    image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&q=80" },
  { id: 4, name: "Farhana Islam", course: "Aviation Management Diploma", category: "management", rating: 5, date: "2026-08-05", likes: 31, featured: true, verified: true,
    message: "Live airport operations projects and guest sessions from industry experts opened real doors. My internship turned into a job offer.",
    image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&q=80" },
  { id: 5, name: "Rafiul Karim", course: "Private Pilot License (PPL)", category: "pilot", rating: 5, date: "2026-07-27", likes: 27, featured: true, verified: true,
    message: "Weekend classes fit my job perfectly. Flying solo for the first time above the clouds is a feeling I will never forget.",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80" },
  { id: 6, name: "Mehjabin Chowdhury", course: "Instrument Rating (IR)", category: "pilot", rating: 4, date: "2026-07-10", likes: 19, featured: true, verified: true,
    message: "Fast-track instrument training with lots of simulator time. Weather analysis sessions were detailed and very practical.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80" },
  { id: 7, name: "Nabil Sarker", course: "Commercial Pilot License (CPL)", category: "pilot", rating: 5, date: "2026-06-15", likes: 40, featured: false, verified: true,
    message: "Airline placement support was excellent. Hiring day with partner airlines gave me three interview calls in one week.",
    image: "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=800&q=80" },
  { id: 8, name: "Tasnim Akter", course: "Cabin Crew Training", category: "cabin", rating: 4, date: "2026-05-29", likes: 14, featured: false, verified: false,
    message: "Grooming and personality development classes changed how I carry myself. Highly recommended for anyone nervous about interviews.",
    image: "https://images.unsplash.com/photo-1520437358207-323b43b50729?w=800&q=80" },
];
let nextReviewId = reviews.length + 1;

// Get all reviews (newest first)
app.get("/api/reviews", (req, res) => {
  const sorted = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({ categories: reviewCategories, reviews: sorted });
});

// Add a new review
app.post("/api/reviews", (req, res) => {
  const { name, course, category, rating, message } = req.body || {};
  const cleanName = String(name || "").trim();
  const cleanMessage = String(message || "").trim();
  const stars = Number(rating);

  if (cleanName.length < 2) return res.status(400).json({ error: "Please enter your name." });
  if (!course) return res.status(400).json({ error: "Please choose your course." });
  if (!(stars >= 1 && stars <= 5)) return res.status(400).json({ error: "Rating must be 1 to 5." });
  if (cleanMessage.length < 20) return res.status(400).json({ error: "Please write at least 20 characters." });
  if (cleanMessage.length > 400) return res.status(400).json({ error: "Review is too long (max 400)." });

  const review = {
    id: nextReviewId++,
    name: cleanName.slice(0, 40),
    course: String(course).slice(0, 80),
    category: reviewCategories.some((c) => c.id === category) ? category : "pilot",
    rating: Math.round(stars),
    date: new Date().toISOString().slice(0, 10),
    likes: 0,
    featured: false,
    verified: false,
    message: cleanMessage,
    image: null,
  };
  reviews.push(review);
  res.status(201).json(review);
});

// Like / unlike a review (delta = 1 or -1)
app.post("/api/reviews/:id/like", (req, res) => {
  const review = reviews.find((r) => r.id === Number(req.params.id));
  if (!review) return res.status(404).json({ error: "Review not found." });
  const delta = req.body && req.body.delta === -1 ? -1 : 1;
  review.likes = Math.max(0, review.likes + delta);
  res.json({ id: review.id, likes: review.likes });
});

app.get("/api/contact", (req, res) => {
  res.json({
    methods: [
      { id: "call", label: "Call Us", value: "+880 1700-000000", href: "tel:+8801700000000", icon: "📞", hint: "Talk to our admissions team", copy: true },
      { id: "whatsapp", label: "WhatsApp", value: "+880 1700-000000", href: "https://wa.me/8801700000000", icon: "💬", hint: "Fastest way to get a reply", copy: false },
      { id: "email", label: "Email", value: "info@skyline.edu.bd", href: "mailto:info@skyline.edu.bd", icon: "✉️", hint: "We reply within 24 hours", copy: true },
      { id: "visit", label: "Visit Campus", value: "Airport Road, Uttara, Dhaka", href: "https://maps.google.com/?q=Uttara+Dhaka", icon: "📍", hint: "Book a campus tour", copy: true },
    ],
   
    hours: [
      { day: "Sunday", open: "09:00", close: "18:00" },
      { day: "Monday", open: "09:00", close: "18:00" },
      { day: "Tuesday", open: "09:00", close: "18:00" },
      { day: "Wednesday", open: "09:00", close: "18:00" },
      { day: "Thursday", open: "09:00", close: "18:00" },
      { day: "Friday", closed: true },
      { day: "Saturday", open: "10:00", close: "14:00" },
    ],
    faqs: [
      { q: "How do I apply for a course?", a: "Call or WhatsApp our admissions team, or visit the campus with your documents. We will guide you through every step." },
      { q: "Can I visit the campus before enrolling?", a: "Yes! Campus tours are free. Message us on WhatsApp to book a time slot." },
      { q: "Do you offer scholarships?", a: "We offer merit-based scholarships for selected programs. Ask our team for the latest details." },
      { q: "What documents are needed?", a: "Academic certificates, NID or passport copy, passport-size photos and a medical fitness certificate for pilot courses." },
    ],
    socials: [
      { name: "Instagram", handle: "@skyline.aviation", href: "https://instagram.com", icon: "📸" },
      { name: "Facebook", handle: "Skyline Aviation", href: "https://facebook.com", icon: "📘" },
      { name: "YouTube", handle: "Skyline TV", href: "https://youtube.com", icon: "▶️" },
      { name: "LinkedIn", handle: "Skyline Academy", href: "https://linkedin.com", icon: "💼" },
    ],
    mapQuery: "Uttara, Dhaka",
  });
});
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running successfully on port ${PORT}`);
});