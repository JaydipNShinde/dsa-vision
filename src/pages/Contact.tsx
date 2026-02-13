import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MessageSquare, Github, Twitter, Linkedin, ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const faqs = [
  { q: "Is DSA Viz free to use?", a: "Yes! DSA Viz is completely free and open-source. All visualizations run directly in your browser." },
  { q: "Can I use my own data?", a: "Absolutely! Every visualizer supports custom input — enter your own arrays, values, or graph structures." },
  { q: "Which DSA topics are covered?", a: "We cover Sorting, Searching, Stacks, Queues, Linked Lists, Binary Trees, Graphs, Heaps, Tries, Hash Tables, Dynamic Programming, and Recursion." },
  { q: "Does it work on mobile?", a: "Yes, DSA Viz is responsive and works on all devices, though a desktop experience is recommended for complex visualizations." },
  { q: "How can I contribute?", a: "We welcome contributions! You can suggest new features, report bugs, or contribute code via our GitHub repository." },
];

const socials = [
  { icon: Github, label: "GitHub", href: "#", color: "text-foreground" },
  { icon: Twitter, label: "Twitter", href: "#", color: "text-info" },
  { icon: Linkedin, label: "LinkedIn", href: "#", color: "text-info" },
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [openFaq, setOpenFaq] = useState(-1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setName(""); setEmail(""); setSubject(""); setMessage("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4 py-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
          <MessageSquare className="w-4 h-4" />
          Get in Touch
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Contact <span className="text-accent glow-text-accent">Us</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Have questions, feedback, or suggestions? We'd love to hear from you!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Contact Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" /> Send a Message
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Name *</label>
                <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email *</label>
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary border-border" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Subject</label>
              <Input placeholder="What's this about?" value={subject} onChange={(e) => setSubject(e.target.value)} className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Message *</label>
              <Textarea placeholder="Tell us what you think, report a bug, or suggest a feature..." rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="bg-secondary border-border resize-none" />
            </div>
            <Button type="submit" className="w-full gap-2">
              <Send className="w-4 h-4" /> Send Message
            </Button>
          </form>
        </motion.div>

        {/* Info Cards */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-4">
          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold text-foreground">Connect With Us</h3>
            <div className="space-y-3">
              {socials.map((s) => (
                <a key={s.label} href={s.href} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors group">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                  <span className="text-sm text-foreground">{s.label}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-foreground mb-2">Quick Links</h3>
            <div className="space-y-2">
              {["Report a Bug", "Suggest a Feature", "Request a Topic", "General Feedback"].map((item) => (
                <button key={item} onClick={() => setSubject(item)} className="block w-full text-left text-sm text-muted-foreground hover:text-primary transition-colors px-2 py-1.5 rounded hover:bg-secondary">
                  → {item}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5 text-center">
            <Heart className="w-6 h-6 text-destructive mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Made with love for the DSA learning community
            </p>
          </div>
        </motion.div>
      </div>

      {/* FAQ */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
        <div className="space-y-2 max-w-3xl mx-auto">
          {faqs.map((faq, i) => (
            <div key={i} className="glass rounded-xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full text-left p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{faq.q}</span>
                <span className="text-xs text-primary">{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
