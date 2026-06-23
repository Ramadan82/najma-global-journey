import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { ArrowRight, Check, GraduationCap, Globe, Calendar, RefreshCw, Search, X } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import SocialShare from "@/components/SocialShare";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COURSES, COUNTRIES } from "@/data/packages";
import { getScholarships, type Scholarship } from "@/lib/schedules";
import studyAbroad from "@/assets/study-abroad.jpg";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Phone is required").max(20),
  course: z.string().min(1, "Select a course"),
  country: z.string().min(1, "Select a country"),
});

export default function StudyAbroad() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", course: "", country: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterFunding, setFilterFunding] = useState("all");
  const [filterDegree, setFilterDegree] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return scholarships.filter((s) => {
      if (q && !s.title.toLowerCase().includes(q) && !s.institution.toLowerCase().includes(q) && !s.location.toLowerCase().includes(q) && !s.highlights.some(h => h.toLowerCase().includes(q))) return false;
      if (filterCountry !== "all" && !s.location.toLowerCase().includes(filterCountry.toLowerCase())) return false;
      if (filterCourse !== "all" && !s.title.toLowerCase().includes(filterCourse.toLowerCase()) && !s.highlights.some(h => h.toLowerCase().includes(filterCourse.toLowerCase()))) return false;
      if (filterFunding === "full" && !s.amount.toLowerCase().includes("full")) return false;
      if (filterFunding === "partial" && !s.amount.toLowerCase().includes("partial")) return false;
      if (filterFunding === "affordable" && !s.amount.toLowerCase().includes("affordable")) return false;
      if (filterDegree !== "all" && !s.title.toLowerCase().includes(filterDegree.toLowerCase()) && !s.highlights.some(h => h.toLowerCase().includes(filterDegree.toLowerCase()))) return false;
      return true;
    });
  }, [scholarships, search, filterCountry, filterCourse, filterFunding, filterDegree]);

  const hasFilters = search || filterCountry !== "all" || filterCourse !== "all" || filterFunding !== "all" || filterDegree !== "all";
  const clearFilters = () => { setSearch(""); setFilterCountry("all"); setFilterCourse("all"); setFilterFunding("all"); setFilterDegree("all"); };

  useEffect(() => {
    (async () => {
      try {
        const data = await getScholarships();
        setScholarships(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = inquirySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => { fieldErrors[i.path[0] as string] = i.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    toast.success("Inquiry received", { description: "Our consultant will contact you within 24 hours." });
    setForm({ name: "", email: "", phone: "", course: "", country: "" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={studyAbroad} alt="Students on a global campus" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/20 to-background/60" />
        </div>
        <div className="container-luxe relative">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="eyebrow mb-5">Study Abroad</div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6">
              Your degree. <span className="text-gold italic">A world stage.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Personalised admission consulting for Nigerian students seeking world-class universities across Europe, North America, Asia and the Middle East.
            </p>
          </div>
        </div>
      </section>

      {/* Study Opportunities */}
      <section className="py-20 bg-secondary/10">
        <div className="container-luxe">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="eyebrow mb-3">Study Opportunities</div>
              <h2 className="font-display text-4xl sm:text-5xl">Unlock your global potential.</h2>
            </div>
          </div>

          {/* Search & filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, institution, country…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCountry} onValueChange={setFilterCountry}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Country" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterCourse} onValueChange={setFilterCourse}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Course" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {COURSES.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterFunding} onValueChange={setFilterFunding}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Funding" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Funding Types</SelectItem>
                <SelectItem value="full">Fully Funded</SelectItem>
                <SelectItem value="partial">Partially Funded</SelectItem>
                <SelectItem value="affordable">Affordable Tuition</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDegree} onValueChange={setFilterDegree}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Degree" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Degrees</SelectItem>
                <SelectItem value="bachelor">Bachelor's</SelectItem>
                <SelectItem value="master">Master's</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
                <SelectItem value="diploma">Diploma</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
              </SelectContent>
            </Select>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 py-20 text-center">
                <RefreshCw className="w-10 h-10 animate-spin mx-auto text-gold/40 mb-4" />
                <p className="text-muted-foreground">Loading opportunities...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="col-span-3 py-20 text-center glass-card rounded-sm border-dashed">
                <p className="text-muted-foreground">{hasFilters ? "No opportunities match your filters." : "No opportunities currently listed. Please check back soon."}</p>
                {hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-3 text-gold">Clear filters</Button>}
              </div>
            ) : (
              filtered.map((s) => (
                <div
                  key={s.id}
                  className={`relative glass-card rounded-sm overflow-hidden flex flex-col transition-all duration-500 hover:border-gold/60 ${s.isFeatured ? "border-gold/50 shadow-gold" : ""}`}
                >
                  {/* Image header */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={s.imageUrl || studyAbroad}
                      alt={s.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                    {/* Top badges */}
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      <span className="bg-gold text-gold-foreground text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-sm font-semibold">
                        Study Opportunity
                      </span>
                      <span className="bg-background/70 backdrop-blur-sm border border-border text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-sm">
                        {s.duration}
                      </span>
                      {s.degreeType && (
                        <span className="bg-background/70 backdrop-blur-sm border border-gold/40 text-gold text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-sm font-semibold">
                          {s.degreeType}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-14 right-4 flex items-center gap-1 bg-background/70 backdrop-blur-sm border border-gold/30 px-2.5 py-1.5 rounded-sm">
                      <Globe className="w-3 h-3 text-gold" />
                      <span className="text-[10px] font-semibold tracking-wider uppercase">{s.location}</span>
                    </div>

                    {s.isFeatured && (
                      <div className="absolute top-16 left-4 bg-gradient-gold text-gold-foreground text-[10px] uppercase tracking-[0.24em] px-3 py-1 rounded-sm font-semibold">
                        Most Popular
                      </div>
                    )}

                    {/* Award overlay bottom-left */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="font-display text-3xl text-gold leading-tight">{s.amount}</div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Award Value</div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-sm bg-gold/10 border border-gold/30 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <div className="font-display text-xl leading-none">{s.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{s.institution}</div>
                      </div>
                    </div>

                    <ul className="space-y-2 text-sm mb-5 flex-1">
                      {s.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                          <span className="text-foreground/90">{h}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-gold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Deadline: {s.deadline}</span>
                    </div>

                    <Button asChild variant={s.isFeatured ? "gold" : "outlineGold"} className="mt-auto w-full">
                      <Link to={`/scholarships/${s.id}`}>View Details <ArrowRight className="w-4 h-4" /></Link>
                    </Button>

                    <div className="mt-4">
                      <SocialShare
                        title={s.title}
                        description={`Discover this ${s.duration} scholarship opportunity for ${s.location}.`}
                        url={`/scholarships/${s.id}`}
                        compact
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-20">
        <div className="container-luxe">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="eyebrow mb-3">Programs</div>
              <h2 className="font-display text-4xl sm:text-5xl">Disciplines we place students in.</h2>
            </div>
            <p className="text-muted-foreground max-w-sm">Nine flagship pathways. Hundreds of partner universities.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COURSES.map((c) => (
              <div key={c.name} className="glass-card rounded-sm p-7 hover:border-gold/50 transition-all duration-500 group">
                <div className="text-3xl mb-4 transition-transform group-hover:scale-110 origin-left">{c.icon}</div>
                <h3 className="font-display text-2xl mb-2">{c.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{c.desc}</p>
                <Button asChild variant="link" className="px-0 h-auto text-gold">
                  <Link to="/booking?type=study">Apply Now <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <section className="py-20 bg-gradient-navy">
        <div className="container-luxe grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="eyebrow mb-4">Inquiry Form</div>
            <h2 className="font-display text-4xl sm:text-5xl mb-6">Tell us about your dream.</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Share a few details and we'll match you with the right program, country, and university. No obligation.
            </p>
            <ul className="space-y-3">
              {["Free initial consultation", "Visa & documentation guidance", "University application support", "Pre-departure orientation"].map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-gold/20 border border-gold flex items-center justify-center">
                    <Check className="w-3 h-3 text-gold" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={submit} className="glass-card rounded-sm p-8 space-y-5">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2" />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2" />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
            </div>
            <div>
              <Label>Preferred Course</Label>
              <Select value={form.course} onValueChange={(v) => setForm({ ...form, course: v })}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="Select a course" /></SelectTrigger>
                <SelectContent>
                  {COURSES.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.course && <p className="text-xs text-destructive mt-1">{errors.course}</p>}
            </div>
            <div>
              <Label>Preferred Country</Label>
              <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="Select a country" /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.country && <p className="text-xs text-destructive mt-1">{errors.country}</p>}
            </div>
            <Button type="submit" variant="gold" size="lg" className="w-full">Submit Inquiry</Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
